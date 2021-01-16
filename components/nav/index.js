import { useState } from 'react'
import LoginModal from '../modal'
import Image from 'next/image'

import userbase from 'userbase-js'

export default function Nav({ user, setUser }) {
  const [open, setOpen] = useState()
  const [modalType, setModalType] = useState()

  function openModal(type) {
    setOpen(true)
    setModalType(type)
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
    <div className="sticky top-0 z-50">
    <nav className="mx-auto p-4 bg-white">
    <>
    <div className="md:flex md:items-center md:justify-between md:space-x-5">
      <div className="flex items-start space-x-5">
        <div className="flex-shrink-0">
          <div classname="relative">
            <Image className="rounded w-50" src="/magnumstone-logo.png" alt="" width="248" height="50"/>
            
            {/* <span className="absolute inset-0 shadow-inner rounded-full" aria-hidden="true"></span> */}
          </div>
        </div>

        <div className="pt-1.5">
          
          {/* <p className="text-sm font-medium text-gray-500">Applied for <a href="#" class="text-gray-900">Front End Developer</a> on <time datetime="2020-08-25">August 25, 2020</time></p> */}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <h1 className="text-3xl font-bold text-gray-900">Wall Calculator</h1>
        {!user ? (
          <>
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => openModal('logIn')}>
              Login
            </button>
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={() => openModal('signUp')}>
              Sign Up
            </button>
          </>
        ) : (
          <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue" onClick={logOut}>
              Log Out
            </button>
        )
        }
      </div>
      
    </div>
    <div className="relative pt-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="px-2 bg-white text-sm text-gray-500">
        
        </span>
      </div>
    </div>



    

      {open && (
        <>

        <div className="w-4/5 md:w-1/2 mx-auto mt-10">
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
