import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import './css/dashboardtable.css';



const DashPost = () => {
  const {currentUser} = useSelector((state)=> state.user);
  const {theme} = useSelector((state)=> state.theme);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(()=>{
    const fetchPosts = async () =>{
      try{
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`);
        const data = await res.json();

        if(res.ok){
          setUserPosts(data.posts)
        }
        console.log(data.posts);

      }catch (error){
        console.log(error.message)
      }
    };
    if(currentUser.isAdmin){
      fetchPosts();
    }
    

  }, [currentUser._id]);

  return (
    <div className="dashboard-table-container">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Post Image</th>
            <th>Post Title</th>
            <th>Category</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {userPosts.map((post)=>(
            <tr key={post.id} className={theme === 'dark' ? 'lights' : null}>
              <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
              <td className="table-img"><Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title} /></Link></td>
              <td><Link to={`/post/${post.slug}`}  className={theme === 'dark' ? 'table-title lights' : "table-title" }>{post.title}</Link></td>
              <td>{post.category}</td>
              <td><span className="table-delete">Delete</span></td>
              <td><Link to={`/update-post/${post._id}`} className="table-edit"><span>Edit</span></Link></td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}

export default DashPost;