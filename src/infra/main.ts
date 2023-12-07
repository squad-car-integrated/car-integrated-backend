import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Env } from './env/env'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService: ConfigService<Env, true> = app.get(ConfigService)
    const port = configService.get('PORT', { infer: true })
    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Request-Method',
            'Access-Control-Request-Headers',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials',
        ],
        credentials: true,
    }
    app.enableCors(corsOptions)
    const config = new DocumentBuilder()
        .setTitle('Car-integrated-api')
        .setDescription('The car integrated api')
        .setVersion('1.0')
        .addTag('CarIntegrated')
        .addBearerAuth(undefined, 'defaultBearerAuth')
        .build()
    const swaggerOptions = {
        swaggerOptions: {
            authAction: {
                defaultBearerAuth: {
                    name: 'defaultBearerAuth',
                    schema: {
                        description: 'Default',
                        type: 'http',
                        in: 'header',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                    value: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NjZlZDEwNi04ZDIxLTQzMmUtOWNjYS05NTJmZjdlODhiYTQiLCJpYXQiOjE2OTk0NjYwMzl9.T0GsECw_PgqAU7LrSfFPGEqjwUg1hWNAJ_uEIH8hxMOoz9BcIn-Q8C13cRYfjuaCOC3DvzCzoyESZDIK7jUMNkqamDQIdWMJO7dvXRY8JTnAYPn79PGOLF94netBlFT9znjYMfA0dy0LW5tmcCUrQRlGjJqhGrrjmSCgeV-eLdbPMISgeCGVbPsoW4HgrsUQsIV2ZT26ThrVEHTFbET_9CWDlDOcoUFbtKIL7EN2QyrtH5MwOsyUzc6RDDXcAgDqlf-C408CxZ90vuL5pxywihzFp7RPReK-CXbEVvKM-UfYtoA1yoOYWGGinD_XhXVPEcJ652NlEkfqbmuJhaI9xA',
                },
            },
        },
    }
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document, swaggerOptions)
    await app.listen(port)
}
bootstrap()
