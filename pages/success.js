import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../Components/AppLayout";
import { getAppProps } from "../utils/getAppProps";



export default function Success() {

    return <div className=" h-screen flex justify-center items-center">
     <h1 className="h1">Thank your for your purchase!</h1>
    </div>;
  }

  Success.getLayout = function getLayout(page,pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
 }

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props =await getAppProps(ctx)
      return{
         props,
      }
  }
  
  });