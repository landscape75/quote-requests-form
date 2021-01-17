import TodoForm from '../components/todo-form'
import Head from 'next/head'

function Index({ user }) {
  if (user) {
    return (
      <div className="bg-white dark:bg-gray-800 w-4/5 md:w-1/2 mx-auto mt-10 mb-10">
        <h3 className="font-bold text-4xl text-gray-800 dark:text-white">
          Welcome, <span>{user.username}</span>
        </h3>
        <TodoForm />
      </div>
    )
  } else {
    return (
      <>

      <main className="mt-10 pt-5 bg-white dark:bg-gray-800 mx-auto max-w-7xl px-4 sm:mt-10">
        <Head>
          <title>Magnumstone Calculator</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Data to enrich your</span>
            <span className="block text-mag-blue xl:inline"> online business</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
          </p>
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
        </div>
      </main>
      </>
    )
  }
}

export default Index
