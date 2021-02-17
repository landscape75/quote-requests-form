import { useState, useEffect } from 'react'
import userbase from 'userbase-js'
import Link from 'next/link'
import toast from 'react-hot-toast';

function UserInfo({ user, toggle, setUser }) {
  //console.log(currentUsername)
  const [username, setUsername] = useState(user.username)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [email, setEmail] = useState(user.email)
  const [name, setName] = useState(user.profile.name)
  const [city, setCity] = useState(user.profile.city)
  const [state, setState] = useState(user.profile.state)
  const [dbName, setDBname] = useState('magnumstone')
  const [loading, setLoading] = useState()
  //const [rememberMe, setRememberMe] = useState('none')
  const [error, setError] = useState()

  
  

  useEffect(() => {
    setError('')
  }, [])

  async function handleUpdate(e) {
    //const toastId = toast.loading('Saving...');
    e.preventDefault()
    setLoading(true)
    setError('')
    if (newPassword === '') {
      try {
        const user = await userbase.updateUser({
          username: username,
          //currentPassword: currentPassword,
          //newPassword: newPassword,
          email: email,
          profile: {dbName: dbName, name: name, city: city, state: state},
        })
        //setUser(user)
        setLoading(false)
        toast.success('Profile saved.', {duration: 4000})
        toggle(false)
      } catch (e) {
        setLoading(false)
        setError(e.message)
        toast.remove(toastId)
        toast.error('Failed to save profile. - ' + e.message, {duration: 5000})
      }
    }
    else {
      try {
        const user = await userbase.updateUser({
          username: username,
          currentPassword: currentPassword,
          newPassword: newPassword,
          email: email,
          profile: {dbName: dbName, name: name, city: city, state: state},
        })
        //setUser(user)
        setLoading(false)
        toast.success('Profile saved.', {duration: 4000})
        toggle(false)
      } catch (e) {
        setLoading(false)
        setError(e.message)
        toast.remove(toastId)
        toast.error('Failed to save profile. - ' + e.message, {duration: 5000})
      }
    }

  }

  function goBack() {
    window.history.back();
  }

  return (

    <div className="flex items-center rounded-lg max-w-lg  mx-auto shadow-lg justify-center bg-white dark:bg-mag-grey-600 pt-3 pb-4 px-4 mb-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 sm:space-y-3">
        <div>
{/*           <svg className="mx-auto h-12 w-12 text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg> */}

          <svg className="mx-auto h-12 w-12 text-mag-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white border border-gray-200 dark:border-mag-grey-200 border-t-0 border-l-0 border-r-0 pb-4">
            Edit User Information
          </h2>
          
        </div>
        <form className="mt-5 space-y-6">
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
              <label htmlFor="current-password" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                Current Password
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="current-password" 
                  name="current-password" 
                  type="password" 
                  autoComplete="secure-password" 
                  value={currentPassword}
                  placeholder="Leave blank if not changing password"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                >
                </input>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="new-password" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                New Password
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="new-password" 
                  name="new-password" 
                  type="password" 
                  autoComplete="new-password" 
                  value={newPassword}
                  placeholder="Leave blank if not changing password"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setNewPassword(e.target.value)}
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


            <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
              <label htmlFor="state" className="block text-md font-medium text-gray-700 dark:text-gray-100 sm:mt-px sm:pt-2">
                State
              </label>
              <div className="mt-1 sm:mt-0 md:col-span-1 sm:col-span-3 lg:col-span-2">
                <input 
                  id="state" 
                  name="state" 
                  type="text"
                  value={state}
                  placeholder="State"
                  className="max-w-lg block bg-white focus:ring-mag-blue focus:border-mag-blue w-full shadow-md sm:max-w-xs sm:text-sm border-gray-300 dark:border-gray-500 rounded-md"
                  onChange={(e) => setState(e.target.value)}
                >
                </input>
              </div>
            </div>
            
          </div>

          <div className="inline-flex w-full space-x-4 justify-center">
     
                <button 
                  className="group relative w-1/4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" 
                  disabled={loading} 
                  onClick={(e) => toggle(false)}
                >
{/*                   <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-mag-blue group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span> */}
                     Cancel
                </button>
   
 
              <button 
                className="group relative w-1/4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" 
                disabled={loading} 
                onClick={handleUpdate}
              >
{/*                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-mag-blue group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span> */}
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
