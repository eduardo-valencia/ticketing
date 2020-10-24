import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import jwt from 'jsonwebtoken'
import request from 'supertest'

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_ckvu36SJEKBx7d92PZIYesSe00hycjRURs'

let mongo: any = null

beforeAll(async () => {
  jest.clearAllMocks()
  process.env.JWT_KEY = 'adkfdskjfkdsafd'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[]
    }
  }
}

global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'myemail@gmail.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`express:sess=${base64}`]
}
