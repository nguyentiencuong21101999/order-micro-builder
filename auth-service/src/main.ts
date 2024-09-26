import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
import { ClientRoute } from './modules/client/client.router'
import { CMSRoute } from './modules/cms/cms.router'
const app = new App(config, [
    {
        version: 'v1',
        groups: [
            {
                routes: [ClientRoute, CMSRoute],
            },
        ],
    },
])

app.start()
