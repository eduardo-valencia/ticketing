import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler, NotFoundError } from '@tickets-448800/common'

console.log('starting auth service...')

const app = express()
app.set('trust proxy', true)

app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined')
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDB.')
  } catch (error) {
    console.error(error)
  }
}

start()

app.all('*', () => {
  throw new NotFoundError()
})

app.listen(3000, () => console.log('Listening on port 3000!!!!!!!!'))
