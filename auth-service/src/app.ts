import { ClassConstructor } from 'class-transformer'
import cors from 'cors'
import express, {
    NextFunction,
    Request,
    Response,
    Router,
    json,
    urlencoded,
} from 'express'
import expressBasicAuth from 'express-basic-auth'
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import Container from 'typedi'
import yaml from 'yamljs'
import { Config, validateConfig } from './configs'
import { AppDataSource } from './database/connection'
import { QueueManager, setupQueues } from './queues/queues'
import { setupWorkers } from './queues/workers'
import { CacheManager } from './utils/cache'
import { handleError } from './utils/error'
import { logger } from './utils/logger'
export interface AppRoute {
    route?: string
    router: Router
}

export interface GroupableRoute {
    group?: string
    routes: ClassConstructor<AppRoute>[]
}

export interface VersionableRoute {
    version: string
    groups: GroupableRoute[]
}

export class App {
    private app = express()
    constructor(private config: Config, versionableRoutes: VersionableRoute[]) {
        setupQueues()
        setupWorkers()
        this.initMiddleware()
        this.initRoutes(versionableRoutes)
    }

    private initMiddleware() {
        // cross-origin resource sharing
        this.app.use(cors())

        // http headers to improve security
        this.app.use(helmet())

        // body parser
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))

        this.app.use('/api-docs', swaggerUi.serve)
        this.app.get('/api-docs', swaggerUi.setup(yaml.load('./swagger.yaml')))
    }

    private initRoutes(vRoutes: VersionableRoute[]) {
        vRoutes.forEach((vRoute) => {
            vRoute.groups.forEach((gRoute) => {
                let path = '/'
                if (vRoute.version) {
                    path += vRoute.version + '/'
                }
                if (gRoute.group) {
                    path += gRoute.group + '/'
                }

                gRoute.routes.forEach((clsRoute) => {
                    const route = Container.get(clsRoute)
                    this.app.use(path + (route.route ?? ''), route.router)
                })
            })
        })

        this.app.use(
            '/admin/queues',
            expressBasicAuth({
                challenge: true,
                users: { admin: this.config.basicAuthPassword },
            }),
            Container.get(QueueManager).createBoard().getRouter()
        )

        this.app.get('/check', (req, res, next) => {
            res.json({ status: 'check v2' })
        })

        this.app.use(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                handleError(err, res)
            }
        )
    }

    async start() {
        const start = Date.now()
        validateConfig(this.config)

        await Promise.all([
            Container.get(CacheManager).check(),
            AppDataSource.initialize(),
        ])

        this.app.listen(Number(this.config.port), `0.0.0.0`, () => {
            return logger.info(
                `Server is listening at port ${
                    this.config.port
                } - Elapsed time: ${(Date.now() - start) / 1000}s`
            )
        })

        process.on('uncaughtException', (err) => {
            logger.error(err)
        })

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(
                `Unhandled Rejection at: Promise ${JSON.stringify({
                    promise,
                    reason,
                })}`
            )
        })
    }
}
