import { useState, useEffect } from "react";
import LoginModal from "./modal";
import Image from "next/image";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import UserInfo from "../components/user-info";
import { Transition } from "@headlessui/react";

import userbase from "userbase-js";

export default function Nav({ user, setUser }) {
  const [open, setOpen] = useState();
  const [edit, setEdit] = useState(false);
  const [modalType, setModalType] = useState();
  const [theme, setTheme] = useState("light");
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    if (localStorage.theme && localStorage.theme == "dark") {
      setTheme("dark");
      //console.log('Dark')
    } else {
      setTheme("light");
      //console.log('Light')
    }
    setTooltipVisibility(true);
  });

  function openModal(type) {
    setOpen(true);
    setModalType(type);
  }

  function openEdit() {
    setEdit(true);
  }

  function toggleDark(mode) {
    if (mode == "light") {
      document.querySelector("html").classList.remove("dark");
    } else {
      document.querySelector("html").classList.add("dark");
    }
    localStorage.theme = mode;
    setTheme(mode);
  }

  async function logOut() {
    try {
      await userbase.signOut();
      setUser(null);
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <div
      className="sticky top-0 z-50 shadow-lg border border-b-4 border-t-0 border-l-0 border-r-0 border-black bg-cover"
      style={{ backgroundImage: 'url("/siteheader2.jpg")' }}
    >
      <nav className="mx-auto p-4 ">
        {isTooltipVisible && <ReactTooltip textColor="white" delayShow={150} />}

        <div className="flex md:justify-between md:space-x-5">
          <div className="w-200 sm:w-60 lg:w-200 flex md:inline-flex items-start mr-5">
            {/*         <div className="flex-shrink-0">
          <div className="relative"> */}
            {/* <img className="w-50" src="https://magnumstone.com/wp-content/themes/bulletpress/src/assets/images/logo/magnumstone-logo-white.svg" alt="" width="248" height="50" onClick={logOut}/> */}
            <Image
              src="/magnumstone-logo-white-svg.svg"
              alt=""
              width="248"
              height="50"
              onClick={logOut}
            />
            {/*           </div>
        </div> */}
          </div>
          <div className="items-end inline-flex space-y-2 space-x-3 sm:justify-end sm:space-x sm:space-y-2 sm:space-x-3 md:mt-0 sm:mt-0 md:space-x-3">
            {/* <h1 className="text-3xl font-bold text-gray-900">Wall Calculator</h1> */}
            {!user ? (
              <>
                <button
                  type="button"
                  className="truncate inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue"
                  onClick={() => openModal("logIn")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue"
                  onClick={() => openModal("signUp")}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  className="truncate inline-flex items-center justify-center px-4 py-2 sm:px-2 lg:px-4 md:px-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-mag-blue"
                  onClick={logOut}
                >
                  Sign Out
                </button>

                <button
                  className="group relative w-1/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mag-blue hover:bg-mag-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue"
                  onClick={() => setEdit(true)}
                >
                  Profile
                </button>
              </>
            )}
            {theme == "dark" ? (
              <>
                <div className="inline-flex">
                  <svg
                    data-tip="Switch To light mode"
                    className="h-9 w-9 text-mag-blue cursor-pointer"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => toggleDark("light")}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <circle cx="12" cy="12" r="4" />
                    <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
                  </svg>
                  {/* 
            <svg data-tip="Currently using dark mode" className="h-9 w-9 text-white cursor-pointer"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round" onClick={() => toggleDark('dark')}>  
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg> */}
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex">
                  {/*             <svg data-tip="Currently using light mode" className="h-9 w-9 text-white cursor-pointer"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={() => toggleDark('light')}>  
                <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="12" r="4" />  
                <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
            </svg> */}

                  <svg
                    data-tip="switch to dark mode"
                    className="h-9 w-9 text-mag-blue cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => toggleDark("dark")}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>

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

        {/*       {edit && (
        <>  */}

        <Transition
          show={edit}
          /* enter="transition ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0" */
        >
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                enter="transition ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              > 
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

              </Transition.Child> 

                
              <Transition.Child
                enter="ease-out duration-500"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-mag-blue rounded-xl px-0 pt-0 pb-0 text-left overflow-hidden transform transition-all sm:my-0 sm:align-middle sm:max-w-lg sm:w-full sm:p-0"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* <div className="w-full md:w-1/2 lg:w-1/3 sm:w-full mx-auto mt-10"> */}

                  <UserInfo toggle={setEdit} setUser={setUser} user={user} />
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition>

        {/*         </>
      )} */}
      </nav>
    </div>
  );
}
