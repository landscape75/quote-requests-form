import { useState, useEffect } from "react";
import LoginModal from "./modal";
import Image from "next/image";
//import ReactTooltip from "react-tooltip";
//import Link from "next/link";
import UserInfo from "../components/user-info";
import { Transition, Menu } from "@headlessui/react";

import userbase from "userbase-js";
import { auth, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Nav() {
  //export default function Nav({ user, setUser }) {

  const { user, username } = useContext(UserContext);
  const [open, setOpen] = useState(false);
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

  /*   function openModal(type) {
    setOpen(true);
    setModalType(type);
  } */

  /*   function openEdit() {
    setEdit(true);
  } */

  function toggleDark(mode) {
    if (mode == "light") {
      document.querySelector("html").classList.remove("dark");
    } else {
      document.querySelector("html").classList.add("dark");
    }
    localStorage.theme = mode;
    setTheme(mode);
  }

  /*   async function logOut() {
    try {
      await userbase.signOut();
      setUser(null);
    } catch (e) {
      console.error(e.message);
    }
  } */

  // Sign in with Google button

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  function SignOutFromGoogle() {
    //return <button onClick={() => auth.signOut()}>Sign Out</button>;
    auth.signOut();
  }

  function UsernameForm() {
    return null;
  }

  return (
    <div
      className="sticky top-0 z-50 h-15 shadow-xl border border-b-1 border-t-0 border-l-0 border-r-0 border-gray-300 dark:border-mag-grey-500 bg-gradient-to-r from-mag-grey-500 via-mag-grey-800 to-mag-grey-500"
      // style={{ backgroundImage: 'url(./signal.svg)' }}
    >
      <nav className="mx-auto p-2 ">
        {/* {isTooltipVisible && <ReactTooltip textColor="white" delayShow={150} />} */}
        {/* <div className="flex md:justify-between md:space-x-5"></div> */}
        <div className="flex justify-between">
          <div className="w-60 lg:w-200 flex md:inline-flex items-start mr-5">
            {/*         <div className="flex-shrink-0">
          <div className="relative"> */}
            {/* <img className="w-50" src="https://magnumstone.com/wp-content/themes/bulletpress/src/assets/images/logo/magnumstone-logo-white.svg" alt="" width="248" height="50" onClick={logOut}/> */}
            <Image
              src="/sl-logo-white.svg"
              alt=""
              width="286"
              height="60"
              //onClick={logOut}
            />
            {/*           </div>
        </div> */}
          </div>
          {/* <div className="items-end inline-flex space-y-2 space-x-3 sm:justify-end sm:space-x sm:space-y-2 sm:space-x-3 md:mt-0 sm:mt-0 md:space-x-3"></div> */}
          <div className="">
            {/* <h1 className="text-3xl font-bold text-gray-900">Wall Calculator</h1> */}
            {/*  {!user ? (
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
            )} */}

            {/* //////////////////////////////////////// */}

            <div className="relative inline-block text-left">
              <Menu as="div">
                {({ open }) => (
                  <>
                    {/* <Menu.Button className="inline-flex justify-center w-full rounded-md border border-transparent shadow-md px-4 py-2 bg-mag-blue text-base font-medium text-white hover:bg-mag-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mag-blue-500 sm:text-sm"> */}
                    <Menu.Button className="focus:outline-none">
                      {/*                       <svg
                        className="-mr-1 ml-2 h-5 w-5 text-mag-blue"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                      <svg
                        className="h-10 w-10 text-mag-blue"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Menu.Button>
                    <Transition show={open}>
                      <Menu.Items as="ul">
                        <div
                          className="origin-top-right z-10 absolute right-0 mt-1 w-52 rounded-md shadow-lg bg-gray-100 dark:bg-mag-grey-400 ring-1 ring-mag-blue ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          {user && (
                            <div className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 font-bold border border-t-0 border-l-0 border-r-0 border-gray-300 dark:border-gray-500">
                              <Image
                                src={user.photoURL}
                                alt=""
                                width="20"
                                height="20"
                                className="rounded-full mr-3"
                              ></Image>
                              <div className="ml-3">{username}</div>
                            </div>
                          )}
                          <div className="py-1">
                            <Menu.Item as="li">
                              {!username ? (
                                <>
                                  <a
                                    href="#"
                                    className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                    role="menuitem"
                                    onClick={signInWithGoogle}
                                  >
{/*                                     <svg
                                      className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                      />
                                    </svg> */}
                                  <Image
                                    src={"/google.svg"}
                                    alt=""
                                    width="16"
                                    height="16"
                                    className="mr-3"
                                  ></Image>
                                    <div className="ml-4">Sign In With Google</div>
                                  </a>
                                  {/*                                 <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => openModal("logIn")}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                    />
                                  </svg>
                                  Sign In
                                </a> */}
                                </>
                              ) : (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={SignOutFromGoogle}
                                >
{/*                                   <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg> */}
                                  <Image
                                    src={"/google.svg"}
                                    alt=""
                                    width="16"
                                    height="16"
                                    className="mr-3"
                                  ></Image>
                                    <div className="ml-4">Sign Out</div>
                                </a>
                              )}
                            </Menu.Item>
                            {/*                             <Menu.Item as="li">
                              {!user ? (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => openModal("signUp")}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                  </svg>
                                  Sign Up
                                </a>
                              ) : (
                                <>
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-bluehover:bg-gray-200 hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={logOut}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                  Sign Out
                                </a>



                                </>
                              )}
                            </Menu.Item> */}
                            <Menu.Item as="li">
                              {theme == "light" ? (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => toggleDark("dark")}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    onClick={() => toggleDark("light")}
                                  >
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                  </svg>
                                  Dark Mode
                                </a>
                              ) : (
                                <a
                                  href="#"
                                  className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-300 hover:text-mag-blue dark:hover:text-mag-blue font-normal hover:font-bold"
                                  role="menuitem"
                                  onClick={() => toggleDark("light")}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-mag-blue"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    onClick={() => toggleDark("dark")}
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
                                  </svg>
                                  Light Mode
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>

            {/* //////////////////////////////////////// */}

            {/*             {theme == "light" ? (
              <>
                <div className="inline-flex">
                  <svg
                    className="h-9 w-9 text-mag-blue cursor-pointer"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => toggleDark("dark")}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />{" "}
                    <circle cx="12" cy="12" r="4" />
                    <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex">
                  <svg
                    className="h-9 w-9 text-mag-blue cursor-pointer"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => toggleDark("light")}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
              </>
            )} */}
          </div>
        </div>

        {/*         {open && (
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
 */}

        {/*   <Transition
          show={open}
        
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
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
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

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div
                  className="inline-block align-bottom bg-none rounded-xl px-0 pt-0 pb-0 text-left overflow-hidden transform transition-all sm:my-0 sm:align-middle sm:max-w-lg sm:w-full sm:p-0"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <LoginModal
                    toggle={setOpen}
                    modalType={modalType}
                    setUser={setUser}
                  />
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition>

        <Transition
          show={edit}

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
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
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

                  <UserInfo toggle={setEdit} setUser={setUser} user={user} />
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition> */}
      </nav>
    </div>
  );
}
