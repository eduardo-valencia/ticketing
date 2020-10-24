import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@tickets-448800/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payment'

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'my token',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'my token',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const user = global.signin(userId)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'my token',
      orderId: order.id,
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const user = global.signin(userId)
  const price = 20
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list()
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  )
  expect(stripeCharge).toBeDefined()
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.amount).toEqual(20 * 100)
  // expect(chargeOptions.currency).toEqual('usd')
})

it('adds the payment to the database', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const user = global.signin(userId)
  const price = 20
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)
  const stripeCharges = await stripe.charges.list()
  const stripeCharge = stripeCharges.data.find(
    (charge) => charge.amount === price * 100
  )
  console.log('stripeid', stripeCharge!.id, 'order', order.id)
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  })
  expect(payment).not.toBeNull()
})
