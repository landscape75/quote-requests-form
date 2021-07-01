import { useState, useEffect } from "react";
import Image from "next/image";
import Headroom from "react-headroom";
//import { Transition, Menu } from "@headlessui/react";
import { auth, googleAuthProvider } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Logo from "../public/logo-3.png"

export default function Nav() {
  //export default function Nav({ user, setUser }) {

  const { user, username } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [theme, setTheme] = useState("light");
  //const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    signInWithGoogle();

    return function cleanup () {
      auth.signOut();
    }

  }, []);

  /*   function toggleDark(mode) {
    if (mode == "light") {
      document.querySelector("html").classList.remove("dark");
    } else {
      document.querySelector("html").classList.add("dark");
    }
    localStorage.theme = mode;
    setTheme(mode);
  } */

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
    //await auth.signInWithPopup(googleAuthProvider);
    await auth.signInAnonymously();
  };

  function SignOutFromGoogle() {
    //return <button onClick={() => auth.signOut()}>Sign Out</button>;
    auth.signOut();
  }

  return (
    <Headroom>
      <div
        className="sticky top-0 z-50 h-15 shadow-xl bg-white opacity-100 border border-b-1 border-t-0 border-l-0 border-r-0 border-gray-300 p-1 bg-cover flex justify-center"
        // style={{ backgroundImage: 'url("/cash-account-header-1.png")' }}
      >
        <div className="pt-1">
          <Image
            src={Logo}
            alt="logo"
            width={300 * 0.65}
            height={117 * 0.65}
            layout="intrinsic"
            className="mx-auto"
          />
        </div>
      </div>
    </Headroom>
  );
}
