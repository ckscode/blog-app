import axios from "axios";
import React, { createContext, useCallback, useState } from "react";

const PostsContext = createContext();

export default PostsContext;

export const PostsProvider = ({children}) =>{
    const [posts,setPosts] = useState([]);
    const [noMorePosts,setNoMorePosts] = useState(false)

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

    const getPosts = useCallback(async({lastPostDate, getNewerPosts = false})=>{
             const result = await axios.post(`/api/getPosts`,{lastPostDate,getNewerPosts})
             .then((res)=>{return res.data}).catch((err)=>console.log(err));
             const postResult = result.posts || [];
             if(postResult.length < 5){
                setNoMorePosts(true);
             }
             setPosts((e)=> {
                const result = [...e]
                postResult.forEach(element => {
                      const exists = result.find(e=>e._id===element._id);
                      if(exists){
                        return result
                      }
                        result.push(element)    
                });
                return result
             })

    },[])
    return (
        <PostsContext.Provider value={{posts,setPostFromSSR,getPosts,noMorePosts,deletePost}}>
        {children}
      </PostsContext.Provider>
    )
  
}