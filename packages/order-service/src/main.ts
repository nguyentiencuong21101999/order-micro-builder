import 'reflect-metadata'
import { App } from './app'
import { config } from './configs'
import { orderGrpcService } from './modules/client/order/order.controller'
;(async () => {
    const app = new App(config, [orderGrpcService])
    await app.start()
})()
