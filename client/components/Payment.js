import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../hooks/use-request'
import Router from 'next/router'

export default function Payment({ order, currentUser }) {
  const { doRequest, errors } = useRequest({
    url: '/api/payment',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })
  return (
    <div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_7ndLNtLQfF2uo3FZSYvnyWaq00X3q3raLW"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      ></StripeCheckout>
      {errors}
    </div>
  )
}
