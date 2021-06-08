import QuoteForm from "../components/quoteForm";
import Head from "next/head";
import { useContext } from 'react';
import { UserContext } from '../lib/context';

//import Link from 'next/link'

function Index() {
  const { user, username } = useContext(UserContext)
  if (user) {
    return (
      <>
        <Head>
          <title>Quote Request Form</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="mt-2 pt-2 bg-white dark:bg-mag-grey mx-auto max-w-2xl px-2 lg:px-5 py-2 lg:py-5">
          {/* <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-3xl md:text-5xl lg:text-6xl mb-6 ml-3 sm:ml-3 md:ml-3 lg:ml-1">
            <span className="inline xl:inline md:inline lg:inline sm:inline">
              Signature
            </span>
            <span className="inline text-mag-blue xl:inline md:inline lg:inline sm:inline">
              {" "}
              Log
            </span>
          </h1> */}
          {/*             <Link href="edit-user">
                <a className="text-gray-400 hover:text-gray-500">Edit User</a>
            </Link> */}
          <QuoteForm user={user} />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Quote Request Form</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="mt-10 pt-5 bg-white dark:bg-mag-grey mx-auto max-w-7xl px-4 sm:mt-10">
          {/* <div className="text-center"> */}

 {/*          <h1 className="text-center text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block xl:inline md:inline">Signature</span>
            <span className="block text-mag-blue xl:inline md:inline">
              {" "}
              Log
            </span>
          </h1> */}
          <article className="text-center mx-auto mt-20 sm:mt-5 md:mt-10 prose lg:prose-xl md:prose-xl sm:prose-lg text-gray-700 dark:text-gray-200">
            <p>
              Please wait...
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
    );
  }
}

export default Index;
