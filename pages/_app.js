import { useState, useEffect } from "react";
//import userbase from "userbase-js";
import Layout from "../components/layout";
import "../styles/index.css";
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  //const [user, setUser] = useState([]);
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
