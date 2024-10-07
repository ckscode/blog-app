import axios from "axios";
import React, { createContext, useCallback, useState } from "react";

const PostsContext = createContext();

export default PostsContext;

export const PostsProvider = ({children}) =>{
    const [posts,setPosts] = useState([]);

const deletePost = useCallback((postId)=>{
        setPosts(value =>{
            const filtered = value.filter(e=>e._id!==postId);
             return filtered;
        })
},[])


    const setPostFromSSR = useCallback((postsFromSSR = [])=>{
        console.log('POSTS FROM SSR',postsFromSSR)
        setPosts(postsFromSSR)
    
    },[])

    const getPosts = useCallback(async()=>{
      try{
        const result = await axios.post(`/api/getPosts`)
        .then((res)=>{return res.data}).catch((err)=>console.log(err));
        const postResult = result.posts || [];
     
        setPosts(postResult)
      }catch(error){
        console.log("ERROR IN GETPOST",error)
      }
           

    },[])
    return (
        <PostsContext.Provider value={{posts,setPostFromSSR,getPosts,deletePost}}>
        {children}
      </PostsContext.Provider>
    )
  
}