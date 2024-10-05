import { UserProvider } from "@auth0/nextjs-auth0/client";
import "../styles/globals.css";
import {Poppins,Questrial} from '@next/font/google'
import { PostsProvider } from "../context/postContext";


const poppins = Poppins({
  weight: ['400', '700'], // Specify the weights you need
  subsets: ['latin'], 
  variable:'--font-poppins'
})

const questrial = Questrial({
  weight: ['400'], // Specify the weights you need
  subsets: ['latin'], 
  variable:'--font-questrial'
})
function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
 

  return (
    <UserProvider>
      <PostsProvider>
      <main className={`${poppins.variable} ${questrial.variable} font-questrial`}>
      {getLayout(<Component {...pageProps} />, pageProps)}
      </main>
      </PostsProvider>
    </UserProvider>
  );
}

export default MyApp;
