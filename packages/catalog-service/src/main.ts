import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
;(async () => {
    const app = new App(config, [])
    await app.start()
})()
