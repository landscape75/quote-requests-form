import Nav from './nav'
import Footer from './footer'
import Head from 'next/head'

function Layout({ user, setUser, children }) {
  return (

    <div className="bg-white dark:bg-gray-800 mx-auto">
      <Head>
        <title>Magnumstone Wall Calculator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script>if (localStorage.theme === 'dark' || (!('theme' in localStorage))) document.querySelector('html').classList.add('dark'), document.querySelector('html').classList.remove('light')</script>
        <script>document.querySelector('body').classList.add('dark:bg-gray-800')</script>
      </Head>
      <Nav user={user} setUser={setUser} />
      {children}
      <Footer />
    </div>
    
  )
}

export default Layout


