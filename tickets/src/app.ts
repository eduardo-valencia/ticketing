import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketsRouter } from './routes'
import { updateTicketRouter } from './routes/update'

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@tickets-448800/common'

const app = express()
app.set('trust proxy', true)

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)
app.use(currentUser)
app.use(showTicketRouter)
app.use(createTicketRouter)
app.use(indexTicketsRouter)
app.use(updateTicketRouter)

app.all('*', () => {
  throw new NotFoundError()
})

export { app }
