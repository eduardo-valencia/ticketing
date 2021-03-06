import mongoose from 'mongoose'

import { app } from './app'
import { TicketCreatedListener } from './events/listeners/ticket-created'
import { TicketUpdatedListener } from './events/listeners/ticket-updated'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete'
import { natsWrapper } from './nats-wrapper'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'

console.log('starting!')

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined.')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI is not defined.')
  }
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI is not defined.')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI is not defined.')
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    )
    natsWrapper.client.on('close', () => {
      console.log('Closed')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

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

app.listen(3000, () => console.log('Listening on port 3000!!!!!!!!'))
