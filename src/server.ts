import { app } from './app.ts'
import { env } from './env/env.ts'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running!')
  })
