import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService: ConfigService<Env, true> = app.get(ConfigService)
  const port = configService.get('PORT', { infer: true })
  const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept",
        "Origin", "Access-Control-Allow-Headers", "Access-Control-Request-Method",
        "Access-Control-Request-Headers", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
    credentials: true,
  };
  app.enableCors(corsOptions)
  await app.listen(port)
}
bootstrap()
