import 'reflect-metadata';
import { App } from './app';
import { config } from './configs';
import { productGrpcService } from './modules/client/product/grpc/product.grpc.controller';
(async () => {
    const app = new App(config, [productGrpcService])
    await app.start()
})()
