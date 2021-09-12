import {NestFactory} from '@nestjs/core';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import cookieParser from 'fastify-cookie';
import helmet from 'fastify-helmet';

import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: true
        })
    );

    await app.register(helmet, {
        contentSecurityPolicy: {
            reportOnly: true
        }
    });

    await app.register(cookieParser, {
        secret: 'my-secret' // for cookies signature
    });

    SwaggerModule.setup(
        'api',
        app,
        SwaggerModule.createDocument(
            app,
            new DocumentBuilder()
                .setTitle('Cats example')
                .setDescription('The cats API description')
                .setVersion('1.0')
                .addTag('cats')
                .build()
        )
    );

    await app.listen(3000);

    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
