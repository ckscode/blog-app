import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../Components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown";
import { getAppProps } from "../../utils/getAppProps";
import { useContext, useState } from "react";
import {  useRouter } from "next/router";
import axios from "axios";
import PostsContext from "../../context/postContext";

export default function PostId(props) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const {deletePost} = useContext(PostsContext)
  const router = useRouter()
const handleDeleteConfirm = async() =>{
 try{
   await axios.post(`/api/deletePost`,{postId:props.id}).then((res)=>{
    console.log(res.data);
    if(res.data.success){
      deletePost(props.id)
      router.push(`/post/new`)
    }
    
    }).catch((error)=>console.log(error))
 }catch(error){
  console.log("CONFIRM DELETE",error)
 }
}
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>
        <Markdown>{props.postContent || ""}</Markdown>
        <div className="mt-5 mb-3">
          {!showConfirmDelete ? (
            <button onClick={()=>setShowConfirmDelete(true)} className="btn bg-red-600 text-white w-full">
              Delete Post
            </button>
          ) : (
            <div className="w-full">
              <div className="bg-red-200 text-center p-3">
                Are you sure,you want ot delete this post?
              </div>
              <div className="py-3 w-full flex justify-center">
              <button onClick={()=>setShowConfirmDelete(false)} className="btn  bg-slate-600 mx-1 inline w-1/4">Cancel</button>
              <button onClick={()=>handleDeleteConfirm()} className="btn  bg-red-600 mx-1 inline w-1/4">Delete</button>
              </div>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PostId.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("Blog");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id:ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.createdAt.toString(),
        ...props,
      },
    };
  },
});
