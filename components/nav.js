import { useState, useEffect } from 'react'
import LoginModal from './modal'
import Image from 'next/image'

import userbase from 'userbase-js'

export default function Nav({ user, setUser }) {
  const [open, setOpen] = useState()
  const [modalType, setModalType] = useState()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (localStorage.theme && localStorage.theme == 'dark') {
      setTheme('dark')
      //console.log('Dark')
    }
    else {
      setTheme('light')
      //console.log('Light')
    }
  })

  function openModal(type) {
    setOpen(true)
    setModalType(type)
  }

  function toggleDark() {
    if (theme == 'dark') {
      document.querySelector('html').classList.remove('dark')
      localStorage.theme = 'light'
      setTheme('light')
    }
    else {
      document.querySelector('html').classList.add('dark')
      localStorage.theme = 'dark'
      setTheme('dark')
    }
  }

  async function logOut() {
    try {
      await userbase.signOut()
      setUser(null)
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <div className="sticky top-0 z-50 shadow-lg border border-b-4 border-t-0 border-l-0 border-r-0 border-black bg-cover" style={{backgroundImage: 'url("/siteheader2.jpg")'}}>
      
    <nav className="mx-auto p-4 ">
    <>
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0">
          <div className="relative">
            <img className="rounded w-50" src="https://magnumstone.com/wp-content/themes/bulletpress/src/assets/images/logo/magnumstone-logo-white.svg" alt="" width="248" height="50"/>
          </div>
        </div>

        <div className="pt-1.5">
          
          {/* <p className="text-sm font-medium text-gray-500">Applied for <a href="#" class="text-gray-900">Front End Developer</a> on <time datetime="2020-08-25">August 25, 2020</time></p> */}
        </div>
      </div>
      <div className="mt-6 flex flex-col justify-stretch lg:items-center md:items-center space-y-4 space-y sm:flex-row sm:justify-end sm:space-x sm:space-y-0 sm:space-x-3 md:mt-4 sm:mt-0 md:flex-row md:space-x-3">
        {/* <h1 className="text-3xl font-bold text-gray-900">Wall Calculator</h1> */}
        {!user ? (
          <>
            <div className="flex-row">
              <span class="ml-0 mr-3 pb-2" id="toggleLabel">
                <span class="text-sm font-medium text-white">Dark Mode </span>
              </span>
              <div>
              <button type="button" aria-pressed="false" className="bg-gray-300 dark:bg-mag-blue relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" onClick={toggleDark}>
                <span className="sr-only">Dark</span>
                {theme == 'dark' ? (
                    <span aria-hidden="true" className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                  ) : (
                    <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
                  )
                }
              </button>
              </div>
             
            </div>
  
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => openModal('logIn')}>
              Login
            </button>
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => openModal('signUp')}>
              Sign Up
            </button>
  
          </>
        ) : (
          <>
          <button type="button" aria-pressed="false" className="bg-gray-300 dark:bg-mag-blue relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue" onClick={toggleDark}>
          <span className="sr-only">Dark</span>
          {theme == 'dark' ? (
              <span aria-hidden="true" className="translate-x-5 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
            ) : (
              <span aria-hidden="true" className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
            )
          }
        </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={logOut}>
            Log Out
          </button>
          </>
        )
        }
      </div>
      
    </div>
{/*     <div className="relative pt-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-400"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-2 bg-white text-sm text-gray-500">
        
        </span>
      </div>
    </div> */}


      {open && (
        <>

        <div className="w-full md:w-1/2 lg:w-1/3 sm:w-full mx-auto mt-10">
          <LoginModal
            toggle={setOpen}
            modalType={modalType}
            setUser={setUser}
          />
        </div>
        </>
      )}
      </>
    </nav>
    </div>

  
  )
}
