import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import './css/dashboardtable.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";



const DashPost = () => {
  const {currentUser} = useSelector((state)=> state.user);
  const {theme} = useSelector((state)=> state.theme);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(()=>{
    const fetchPosts = async () =>{
      try{
        const res = await fetch(`/api/post/getpost?userId=${currentUser._id}`);
        const data = await res.json();

        if(res.ok){
          setUserPosts(data.posts)
          if(data.post.length < 9){
            setShowMore(false);
          }
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

  const handleShowMore = async () =>{
    const startIndex = userPosts.length;
    console.log(startIndex)

    try{
      //Querying the database, and setting the start index to the length of the current post which would be 9
      const res = await fetch(`/api/post/getpost?userId=${currentUser._id}&startIndex=${startIndex}`);

      const data = await res.json();
      //if response is succesful, then append remaining 9 post to the previous post that was displayed, and if the new set of post after the first start index is less than 9 dont show the show more button
      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }

    }catch(error){
      console.log(error)

    }
  }

  const handleDeletePost = async () =>{
    setShowModal(false);
    try{
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if(!res.ok){
        console.log(data.message)
      } else {
        setUserPosts((prev) => 
          prev.filter((post)=> post._id !== postIdToDelete)
        )
      }

    }catch(error){
      console.log(error.message)
    }
  }

  return (
    <div className="dashboard-table-container">
      {currentUser.isAdmin && userPosts.length > 0 ? 
      <>
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
            <tr key={post._id} className={theme === 'dark' ? 'lights' : null}>
              <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
              <td className="table-img"><Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title} /></Link></td>
              <td><Link to={`/post/${post.slug}`}  className={theme === 'dark' ? 'table-title lights' : "table-title" }>{post.title}</Link></td>
              <td>{post.category}</td>
              <td><span className="table-delete" onClick={()=> {setShowModal(true)
                setPostIdToDelete(post._id)
              }}>Delete</span></td>
              <td><Link to={`/update-post/${post._id}`} className="table-edit"><span>Edit</span></Link></td>
                  
            </tr>
          ))}
        </tbody>

      </table>
      {showMore && <div className="show-btn"><button onClick={handleShowMore} className={theme === 'dark' ? "show-more-btn lights" : 'show-more-btn'}>Show More</button></div>}
      </> 
      : <p>You have no post yet</p>}

      {
        showModal &&
        <div className="delete-modes delete-modal-container">
        <div className="delete-modal">
          <IoClose className="delete-cls-btn" onClick={()=> setShowModal(false)}/>
          <IoMdInformationCircleOutline className="delete-info-btn"/>
          <p className="delete-txt">Are you sure you want to delete this post <br /> your account?</p>
          <div className="delete-btn-lnr">
            <button className="delete-left-btn"onClick={handleDeletePost}>Yes</button>
            <button className="delete-right-btn" onClick={()=> setShowModal(false)}>No</button>

          </div>
        </div>
      </div>
      }
      

    </div>
  )
}

export default DashPost;