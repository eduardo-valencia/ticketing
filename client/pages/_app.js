import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'
import buildClient from '../api/build-client'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')
  // Data from each page that we are trying to fetch, such as the landing page and all other pages that have a getInitialProps method
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }
  console.log('data', data)
  return {
    pageProps,
    ...data,
  }
}

export default AppComponent
