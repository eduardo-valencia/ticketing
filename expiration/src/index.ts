import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
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
    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (error) {
    console.error(error)
  }
}

start()
