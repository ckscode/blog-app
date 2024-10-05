import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../Components/AppLayout";
import axios from "axios";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async(e) =>{
    e.preventDefault();
    try{
      const result = await axios.post(`/api/addTokens`)
      .then((result)=>{return result.data})
      .catch((error)=>console.log(error));
      window.location.href =result.session.url;
    }catch(error){
         console.log(error)
    }
      
       
  }
    return <div>
     tokenTopup
     <button className="btn" onClick={handleClick}>
          Add Tokens
     </button>
    </div>;
  }

TokenTopup.getLayout = function getLayout(page,pageProps){
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