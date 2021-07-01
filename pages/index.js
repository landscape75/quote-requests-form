import QuoteForm from "../components/QuoteForm";
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
        <div className="mt-2 pt-2 bg-gray-50 dark:bg-mag-grey mx-auto max-w-4xl px-2 lg:px-5 py-2 lg:py-5">
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
        <div className="mt-10 pt-5 bg-gray-50 dark:bg-mag-grey mx-auto max-w-7xl px-4 sm:mt-10">

          <article className="text-center mx-auto mt-20 sm:mt-5 md:mt-10 prose lg:prose-xl md:prose-xl sm:prose-lg text-gray-700 dark:text-gray-200">
            <p>
              Please wait...
            </p>

          </article>

        </div>
      </>
    );
  }
}

export default Index;
