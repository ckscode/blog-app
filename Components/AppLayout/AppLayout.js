import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import PostsContext from "../../context/postContext";
import { useContext, useEffect } from "react";

export const AppLayout = ({ children,availableTokens,posts:postsFromSSR,postId,postCreated }) => {
  const { user } = useUser();
   
  const {posts,setPostFromSSR,getPosts} = useContext(PostsContext)
console.log(posts)
  useEffect(()=>{
     setPostFromSSR(postsFromSSR) 
     getPosts()    
  
  },[postsFromSSR, setPostFromSSR, postId, postCreated])
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-black-800 overflow-hidden shadow-xl ">
        <div className="bg-slate-100 text-center">
          <Logo/>
          <Link className="bg-green-500 hover:bg-green-600 w-11/12 mx-auto my-2 text-white px-4 py-2 uppercase tracking-wider rounded-md transition-colors block" href='/post/new'>New Post</Link>
          <div>
          <Link className="block mt-2" href='/token-topup'>
          <FontAwesomeIcon icon={faCoins} className="text-yellow-500 mr-1"/>{availableTokens} tokens available</Link>
          </div>
        </div>
        <div className="flex-1  overflow-auto bg-slate-100">
          <div className="w-11/12 mx-auto my-2">
          <div className="font-bold px-2 mt-6 mb-1">Topics Searched</div>
         {posts.map((post)=>{
          return(
            <Link className={`block p-2 hover:bg-slate-300 rounded-md overflow-hidden text-ellipsis whitespace-nowrap ${postId===post._id?"bg-gray-300":""}`} key={post._id} href={`/post/${post._id}`}>{post.topic}</Link>
          )
         })}
         {/* {!noMorePosts&&
          <div onClick={()=>getPosts({lastPostDate:posts[posts.length-1].createdAt})} className="text-sm hover:underline text-center cursor-pointer">Load more posts</div>} */}
         </div>
        </div>
        <div className="bg-slate-100 flex flex-row p-3 border-t border-slate-300">
          {user ? (
           <>
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
            
              <div className="pl-3">
                <p className="font-semibold">{user.email}</p>
                <Link className="text-sm " href="/api/auth/logout">Logout</Link>
              </div>
              </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
       {children}
    </div>
  );
};
