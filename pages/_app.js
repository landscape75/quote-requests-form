import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Layout from '../components/layout'
import '../styles/index.css'

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState()

  useEffect(() => {
      userbase.init({ appId: process.env.NEXT_PUBLIC_USERBASE_APP_ID, 
      allowServerSideEncryption: true, 
      sessionLength: 8760 
    }).then((session) => {
      if (session.user) {
        setUser(session.user)
      }
      else {
        console.log('No session')
      }
    }).catch((e) => console.error(e))
  }, [])

  return (
    <Layout user={user} setUser={setUser}>
      <Component user={user} {...pageProps} />
    </Layout>
  )
}

export default MyApp
