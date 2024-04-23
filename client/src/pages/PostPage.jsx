import { useEffect, useState } from "react";
import {Link, useParams} from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import img from '../assets/web-img.jpg';
import '../components/css/postpage.css';

const PostPage = () => {

  //when trying to useParams make sure the name is the same as the word after the url and always use {} to get the exact value.
  const {postSlug} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);


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

 
  return (
    <div className="singlepost-container">
      {loading && <div className="post-loader"><ClipLoader type='TailSpin' height='50' width='50' color='red'/></div>}
      {post && ( // Only render when loading is false and post data is available
        <div className="singlepost-content">
          <h1>{post.title}</h1>
          <button><Link to={`/search/?category=${post.category}`}>{post.category}</Link></button>
          <div className="singlepost-img"><img src={post.image} alt={post.title} /></div>
          <div className="date-time-txt">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{(post.content.length / 1000).toFixed(0)} mins read</span>
          </div>
          <div className="singlepost-p" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
      )
      }

      <div className="cta">
        <div className="cta-left">
          <div className="cta-left-content">
          <h1>Want to know more about how amazing <br/> my projects are?</h1>
          <span>Check out my projects by clicking on the button below</span>
          </div>
          {/* rel='noopener noreferrer'  attribute is added for security reasons to prevent a potential security vulnerability called "tabnabbing". */}
          <button><Link to='https://github.com/Wizeeyung?tab=repositories' target='_blank' rel='noopener noreferrer'>My Projects</Link></button>
        </div>
        <div className="cta-right">
          <img src={img} alt="blog-pic" />
        </div>

      </div>

    </div>
  )
}

export default PostPage