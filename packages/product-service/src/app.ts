import { ClassConstructor } from 'class-transformer'
import cors from 'cors'
import express, {
    NextFunction,
    Request,
    Response,
    json,
    urlencoded,
} from 'express'
import expressBasicAuth from 'express-basic-auth'
import helmet from 'helmet'
import * as grpc from 'protobuf/node_modules/@grpc/grpc-js'
import Container from 'typedi'
import { Config, validateConfig } from './configs'
import { AppDataSource } from './database/connection'
import { QueueManager, setupQueues } from './queues/queues'
import { setupWorkers } from './queues/workers'
import { CacheManager } from './utils/cache'
import { handleError } from './utils/error'
import { logger } from './utils/logger'
import { RabbitMQManager } from './modules/rabbit-mq/rabbit-mq'

export interface GrpcServiceGroup {
    clsGrpcService: ClassConstructor<grpc.UntypedServiceImplementation>
    clsServiceDefinition: grpc.ServiceDefinition
}

export class App {
    private app = express()
    private grpcServer: grpc.Server
    constructor(private config: Config, serviceGroup: GrpcServiceGroup[]) {
        setupQueues()
        setupWorkers()
        this.initMiddleware()
        this.grpcServer = new grpc.Server()
        this.addGrpcServices(serviceGroup)
    }

    addGrpcServices(grpcServiceGroup: GrpcServiceGroup[]) {
        grpcServiceGroup.forEach((grpcService) => {
            const { clsGrpcService, clsServiceDefinition } = grpcService
            this.grpcServer.addService(
                clsServiceDefinition,
                Container.get(clsGrpcService)
            )
        })
    }

    private initMiddleware() {
        // cross-origin resource sharing
        this.app.use(cors())

        // http headers to improve security
        this.app.use(helmet())

        // body parser
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))

        this.app.use(
            '/admin/queues',
            expressBasicAuth({
                challenge: true,
                users: { admin: this.config.basicAuthPassword },
            }),
            Container.get(QueueManager).createBoard().getRouter()
        )

        this.app.get('/check', (req, res, next) => {
            res.json({ status: 'success' })
        })

        this.app.use(
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
            Container.get(RabbitMQManager).connect(),
        ])

        this.grpcServer.bindAsync(
            this.config.grpcPort,
            grpc.ServerCredentials.createInsecure(),
            () => {
                logger.info(
                    `GRPC: product-service is running on ${this.config.grpcPort}`
                )
                this.grpcServer.start()
            }
        )
        this.app.listen(Number(this.config.port), () => {
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
                    reason: reason.toString(),
                })}`
            )
        })
    }
}
