import GravityCalc from '../components/gravity-calc'
import Head from 'next/head'
//import Link from 'next/link'

function Index({ user }) {
  if (user) {
    return (
      <>
      <Head>
        <title>Magnumstone Calculator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="mt-10 pt-5 bg-white dark:bg-mag-grey mx-auto max-w-7xl px-1 sm:mt-10">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6 ml-4">
              <span className="block xl:inline md:inline lg:inline sm:inline">MagnumStone</span>
              <span className="block text-mag-blue xl:inline md:inline lg:inline sm:inline"> Wall Calculator</span>
            </h1>
{/*             <Link href="edit-user">
                <a className="text-gray-400 hover:text-gray-500">Edit User</a>
            </Link> */}
        <GravityCalc user={user}/>
      </div>
      </>
    )
  } 
  else 
  {
    return (
      <>
      <Head>
        <title>Sign in to Magnumstone Calculator</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="mt-10 pt-5 bg-white dark:bg-mag-grey mx-auto max-w-7xl px-4 sm:mt-10">

        {/* <div className="text-center"> */}
          
            <h1 className="text-center text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block xl:inline md:inline">MagnumStone</span>
              <span className="block text-mag-blue xl:inline md:inline"> Wall Calculator</span>
            </h1>
            <article className="text-center mx-auto mt-20 sm:mt-5 md:mt-10 prose lg:prose-xl md:prose-xl sm:prose-lg text-gray-700 dark:text-gray-200">
              <p>
                These preliminary details are intended soley to act as an aid when designing a wall. These drawings should not be used for final design or construction.
                Each site-specific wall should be certified and signed by a registered geotechnical engineer in the Sate or Province where it is being built. the accuarcy 
                and use of the details in this document are the sole responsibility of the user. Global stability analysis has not been performed.
              </p>
              {/* <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"> */}
              <p>
                The Trademark MagnumStone, Logo and Copyright are owned by CornerStone Wall Solutions Inc. All Rights Reserved..
              </p>
            </article>
  {/*         <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
              <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get started
              </a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Live demo
              </a>
            </div>
          </div> */}
        {/* </div> */}
      </div>
      </>
    )
  }
}

export default Index
