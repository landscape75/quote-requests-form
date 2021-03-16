import { useState, useEffect } from "react";
import userbase from "userbase-js";
import Layout from "../components/layout";
import "../styles/index.css";
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  //const [user, setUser] = useState([]);
  const userData = useUserData();

  useEffect(() => {
/*     userbase
      .init({
        appId: process.env.NEXT_PUBLIC_USERBASE_APP_ID,
        allowServerSideEncryption: true,
        sessionLength: 8760,
        updateUserHandler: function ({ user }) {
          setUser(user);
        },
      })
      .then((session) => {
        if (session.user) {
          setUser(session.user);
        } else {
          console.log("No session");
          setUser(null);
        }
      })
      .catch((e) => console.error(e)); */
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
