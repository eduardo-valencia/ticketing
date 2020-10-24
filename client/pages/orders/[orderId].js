import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Payment from '../../components/Payment'

export class OrderShow extends Component {
  state = {
    timeLeft: 0,
  }

  setTimeLeft = (timeLeft) => this.setState({ timeLeft })

  findTimeLeft = () => {
    const { expiresAt } = this.props.order
    const time = new Date(expiresAt) - new Date()
    const secondsRounded = Math.round(time / 1000)
    this.setTimeLeft(secondsRounded)
  }

  timerInterval = null

  componentDidMount() {
    this.findTimeLeft
    this.timerInterval = setInterval(this.findTimeLeft, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval)
  }

  render() {
    const { currentUser, order } = this.props
    const { timeLeft } = this.state
    if (timeLeft < 0) {
      return <div>Order expired!</div>
    }
    return (
      <div>
        {timeLeft} seconds until order expires{' '}
        <Payment currentUser={currentUser} order={order} />
      </div>
    )
  }
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)
  return { order: data }
}

export default OrderShow
