import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../Components/AppLayout";
import axios from "axios";
import { useState } from "react";
import Markdown from "react-markdown";
import { useRouter } from "next/router";
import {getAppProps} from "../../utils/getAppProps"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function PostNew(props) {
  const router = useRouter();

  const [topic,setTopic] = useState();
  const [keywords,setKeywords] = useState();
  const [generating,setGenerating] = useState(false);

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setGenerating(true)
    try{
    
      await axios.post(`/api/generatePost`,{topic,keywords}).then((res=>{
        if(res.data?.postId){
             router.push(`/post/${res.data.postId}`)}
            }))
       .catch(err=>console.log(err))
    }catch(error){
      console.log(error)
      setGenerating(false)
    }
       
  }


    return <div className="flex h-screen items-center justify-center relative">
      {!generating?<>
        <div>
     <div className="bg-slate-200 p-3 rounded-md shadow-lg border border-slate-300  mx-auto mb-10">
      <form onSubmit={handleSubmit}> 
        <div>
            <label htmlFor="topic">Generate a blog post on the topic of:</label>
            <textarea className="w-full resize-none rounded-md border border-slate-400 px-2 py-1" id="topic" value={topic} onChange={(e)=>setTopic(e.target.value)} maxLength={80}/>
        </div>
        <div>
        <label htmlFor="keywords">Keywords to be targetted:</label>
        <textarea className="w-full resize-none rounded-md border border-slate-400 px-2 py-1" id="keywords" value={keywords} onChange={(e)=>setKeywords(e.target.value)} maxLength={80}/>
        </div>
        <div className="text-xs -mt-1">seperate keywords with a comma</div>
      <button type="submit" className="btn" disabled={!topic?.trim() || !keywords?.trim()}>
        Generate
      </button>
      </form>
      </div>
      <div>
      </div>
      </div></>:<>
      <div className="text-slate-600 flex items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-white animate-pulse">
        <div>
        <FontAwesomeIcon icon={faBrain} className="text-8xl "/>
        <div className="text-center mt-1">Generating</div>
        </div>
      </div></>}
    </div>;
  }

  PostNew.getLayout = function getLayout(page,pageProps){
     return <AppLayout {...pageProps}>{page}</AppLayout>
  }

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props =await getAppProps(ctx);

      if(!props.availableTokens){
        return{
          redirect:{
            destination:"/token-topup",
            permanent:false
          }
        }
      }

      return{
         props,
      }
  }
  });