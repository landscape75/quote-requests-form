import { useState, useEffect } from 'react'
import userbase from 'userbase-js'

function UserInfo({ user }) {
  const [username, setUsername] = useState('')
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

  return (

    <div className="flex items-center rounded-lg max-w-md  mx-auto shadow-lg justify-center bg-white dark:bg-mag-grey-600 pt-3 pb-4 px-4 mb-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
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
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input id="username" 
                name="username" 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

              <>
                <div>
                  <label htmlFor="email-address" className="sr-only">Email Address</label>
                  <input id="email-address" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input id="name" 
                    name="name" 
                    type="text" 
                    required 
                    className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="sr-only">City</label>
                  <input id="city" 
                    name="city" 
                    type="text" 
                    required 
                    className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                    placeholder="City" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
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
                </div>
              </>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                className="appearance-none rounded-none relative block w-full bg-white dark:bg-gray-100 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-mag-blue focus:border-mag-blue focus:z-10 sm:text-sm" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" 
                name="remember_me" 
                type="checkbox" 
                // value={rememberMe} 
                //isChecked={rememberMe}
                className="h-4 w-4 text-mag-blue focus:ring-mag-blue border-gray-300 rounded" 
                onChange={(e) => handleCheck(e.target.checked)}
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Remember me
              </label>
            </div>

{/*             <div className="text-sm">
              {modalType === 'logIn' &&
                <a href="#" className="font-medium text-mag-blue hover:text-indigo-500">
                  Forgot your password?
                </a>
              }
            </div> */}
          </div>

          <div class="inline-flex w-full space-x-4 justify-center">

              <button 
                className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" 
                disabled={loading} 
                onClick={handleLogIn}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-mag-blue group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Cancel
              </button>
 
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
