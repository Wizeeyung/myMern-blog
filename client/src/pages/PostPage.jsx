import { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import '../components/css/postpage.css';
import { useSelector } from "react-redux";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {

  //when trying to useParams make sure the name is the same as the word after the url and always use {} to get the exact value.
  const {postSlug} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const {theme} = useSelector((state)=> state.theme);


  console.log(post, postSlug)
  useEffect(() => {
    const delay = 1000;
    const fetchPost = async () => {
      
      try {
        const res = await fetch(`/api/post/getpost?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };


    const delayPost = setTimeout(()=>{
        fetchPost()
    }, delay)
    
    return () =>{
      clearTimeout(delayPost)
    }
    
  }, [postSlug]);


  useEffect(()=>{
    try{
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getpost?limit=3`);

        const data = await res.json()
        if(res.ok){
          setRecentPosts(data.posts)
        }
      }

      fetchRecentPosts()
    }catch(error){
      console.log(error.message)

    }
  }, [])

  

  return (
    <div className="singlepost-container">
      {loading && <div className="post-loader"><ClipLoader type='TailSpin' height='50' width='50' color='red'/></div>}
      {post && ( // Only render when loading is false and post data is available
        <>
        <div className="singlepost-content">
          <h1>{post.title}</h1>
          <button className={theme === 'dark' ? 'btn-light' : ''}><Link to={`/search/?category=${post.category}`}>{post.category}</Link></button>
          <div className="singlepost-img"><img src={post.image} alt={post.title} loading="lazy" /></div>
          <div className="date-time-txt">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{(post.content.length / 1000).toFixed(0)} mins read</span>
          </div>
          <div className="singlepost-p" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>

        
        <CallToAction />
        <CommentSection postId={post._id}/>
        <div className="post-card-container">
          <h1>Recent Article</h1>
          <div className="recent-post">
            {recentPosts && recentPosts.map((post)=>
          (<PostCard key={post._id} post={post} />)
          )}
          </div>
        </div>
        </>
      )
      }


    </div>
  )
}

export default PostPage