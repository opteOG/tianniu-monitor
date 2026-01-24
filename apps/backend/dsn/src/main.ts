import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 开启CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests from localhost or tianniu domains
      if (!origin || origin.includes('localhost') || origin.includes('tianniu')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
