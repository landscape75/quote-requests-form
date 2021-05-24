import Nav from './nav'
import Footer from './footer'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast';

function Layout({ user, setUser, children }) {
  return (

    <div className="bg-white dark:bg-mag-grey mx-auto">
      <Head>
        <title>Cash Account Form</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
{/*         <script>if (localStorage.theme === 'dark' || (!('theme' in localStorage))) document.querySelector('html').classList.add('dark'), document.querySelector('html').classList.remove('light')</script>
        <script>document.querySelector('body').classList.add('dark:bg-mag-grey')</script> */}
      </Head>
      <Nav user={user} setUser={setUser} />
      {children}
      <Footer />
      <Toaster
          toastOptions={{
            className: '',
            style: {
              border: '3px solid #029BDF',
              padding: '16px',
              color: '#fff',
              background: '#2c2c2c',
              //background: '#029BDF'
            },
          }}
        />
    </div>
    
  )
}

export default Layout


