import { Link } from "react-router-dom";
import '../components/css/home.css';
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

const Home = () =>{

  const [posts, setPosts] = useState([]);
  console.log(posts)

  useEffect(()=>{
    const fetchPosts = async () =>{
      const res = await fetch('/api/post/getpost');

      const data = await res.json();
      setPosts(data.posts);
    }

    fetchPosts()

  }, [])
  return(
    <>
    <p className="mobile">Mobile/Tablet view still in progress... <br/> to view switch to a desktop/Laptop</p>
    <div className="home-container">
      <div className="banner">
        <h1>Welcome to WIZZY&apos;S Blog</h1>
        <p className="mobile">Here you&apos;ll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
        <Link to='/search'>view all posts</Link>
      </div>
      <div className="cta-banner">
        <CallToAction />
      </div>
      <div className="home-postcard-container">
        <h2>Recent Posts</h2>
        <div className="home-postcard">
          {posts && posts.map((post)=> (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
        <Link to='/search'>view all posts</Link>
      </div>
    </div>
    </>
  )
}

export default Home