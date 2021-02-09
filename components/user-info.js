import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Link from 'next/link'

function UserInfo({ user }) {
  const [username, setUsername] = useState(user.user.username)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [dbName, setDBname] = useState('magnumstone')
  const [loading, setLoading] = useState()
  const [rememberMe, setRememberMe] = useState('none')
  const [error, setError] = useState()
  

  useEffect(() => {
    setError('')
  }, [])

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await userbase.signUp({
        username,
        password,
        email: email,
        profile: {dbName: dbName, name: name, city: city},
        rememberMe: rememberMe,
        sessionLenght: 8760,
      })
      setUser(user)
      setLoading(false)
      toggle(false)
    } catch (e) {
      setLoading(false)
      setError(e.message)
    }
  }

  async function handleLogIn(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await userbase.signIn({
        username,
        password,
        rememberMe: rememberMe,
        sessionLenght: 8760,
      })
      setUser(user)
      setLoading(false)
      toggle(false)
    } catch (e) {
      setLoading(false)
      setError(e.message)
    }
  }

  function handleCheck(e) {
    if (e) {
      setRememberMe('local')
    }
    else {
      setRememberMe('none')
    }
  }

  function goBack() {
    window.history.back();
  }

  return (

    <div className="flex items-center rounded-lg max-w-lg  mx-auto shadow-lg justify-center bg-white dark:bg-mag-grey-600 pt-3 pb-4 px-4 mb-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        <div>
          {/* <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt=""/> */}
          <svg className="mx-auto h-12 w-12 text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Edit User Information
          </h2>
          
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">


              <>

{/*                 <div>
                  <label htmlFor="dbname" className="sr-only">Database Name</label>
                  <input id="dbname" 
                    name="dbname" 
                    type="text" 
                    required 
                    className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                    placeholder="Database Name" 
                    value={dbName}
                    onChange={(e) => setDBname(e.target.value)}
                  />
                </div> */}
              </>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="username" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                Username
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="username" 
                  name="username" 
                  type="text"
                  value={username}
                  placeholder="Username"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setUsername(e.target.value)}
                >
                </input>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="password" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                Password
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  value={password}
                  placeholder="Username"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setPassword(e.target.value)}
                >
                </input>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="email" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                Email Address
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="email" 
                  name="email" 
                  type="text"
                  value={email}
                  placeholder="Email Address"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setEmail(e.target.value)}
                >
                </input>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="full-name" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                Full Name
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="full-name" 
                  name="full-name" 
                  type="text"
                  value={name}
                  placeholder="Full Name"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setName(e.target.value)}
                >
                </input>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="city" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                City
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="city" 
                  name="city" 
                  type="text"
                  value={city}
                  placeholder="City"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setCity(e.target.value)}
                >
                </input>
              </div>
            </div>
            
          </div>

          <div className="inline-flex w-full space-x-4 justify-right">
              <Link href="/">
                <button 
                  className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" 
                  disabled={loading} 
                  //onClick={goBack}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-mag-blue group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                     Cancel
                </button>
              </Link>
 
              <button 
                className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" 
                disabled={loading} 
                onClick={handleSignUp}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-mag-blue group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                {loading ? 'Saving ...' : 'Save'}
              </button>
       
          </div>
          <p className="text-red-500 font-bold">{error}</p>
        </form>
      </div>
    </div>
   
  )
}

export default UserInfo

    
{/*     <form className="bg-white shadow-md rounded p-8">
      <div className="mb-4">
        <label
          className="block text-purple-700 text-sm font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-purple-700 text-sm font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span
          className="font-bold cursor-pointer"
          onClick={() => toggle(false)}
        >
          Cancel
        </span>
        {modalType === 'logIn' ? (
          <button
            disabled={loading}
            className="btn-yellow"
            onClick={handleLogIn}
          >
            {loading ? 'Logging In ...' : 'Log In'}
          </button>
        ) : (
          <button
            disabled={loading}
            className="btn-yellow"
            onClick={handleSignUp}
          >
            {loading ? 'Signing up ...' : 'Sign Up'}
          </button>
        )}
      </div>
      <p className="text-red-500 font-bold">{error}</p>
    </form> */}
