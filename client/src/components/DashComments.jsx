

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './css/dashboardtable.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { IoCheckmarkSharp } from "react-icons/io5";



const DashComments = () => {
  const {currentUser} = useSelector((state)=> state.user);
  const {theme} = useSelector((state)=> state.theme);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(()=>{
    const fetchComments = async () =>{
      try{
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();

        if(res.ok){
          setComments(data.comments)
          if(data.comments.length < 9){
            setShowMore(false);
          }
        }
        console.log(data.comments);

      }catch (error){
        console.log(error.message)
      }
    };
    if(currentUser.isAdmin){
      fetchComments();
    }
    

  }, []);

  const handleShowMore = async () =>{
    const startIndex = comments.length;
    console.log(startIndex)
    
    try{
      //Querying the database, and setting the start index to the length of the current post which would be 9
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);

      const data = await res.json();
      //if response is succesful, then append remaining 9 post to the previous post that was displayed, and if the new set of post after the first start index is less than 9 dont show the show more button
      if(res.ok){
        setComments((prev) => [...prev, ...data.comments]);
        if(data.comments.length < 9){
          setShowMore(false);
        }
      }

    }catch(error){
      console.log(error)

    }
  }


  const handleDeleteComment = async () =>{
    setShowModal(false);
    try{
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`,{
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
      
    }catch (error){
      console.log(error.message);
    }
  }


  return (
    <div className="dashboard-table-container">
      {currentUser.isAdmin && comments.length > 0 ? 
      <>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Comment Content</th>
            <th>Number of likes</th>
            <th>PostId</th>
            <th>UserId</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {comments.map((comment)=>(
            <tr key={comment._id} className={theme === 'dark' ? 'lights' : null}>
              <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
              <td className="usertable-img">{comment.content.length > 15 ? comment.content.split('').splice(0,15).join('') + '...' : comment.content }</td>
              <td className={theme === 'dark' ? 'table-title lights' : "table-title" }>{comment.numberOfLikes}</td>
              <td>{comment.postId}</td>
              <td><span className="isadmin-btn">{comment.userId }</span></td>
              <td><span className="table-delete" onClick={()=> {setShowModal(true)
                setCommentIdToDelete(comment._id);
              }}>Delete</span></td>
            </tr>
          ))}
        </tbody>

      </table>
      {showMore && <div className="show-btn"><button onClick={handleShowMore} className={theme === 'dark' ? "show-more-btn lights" : 'show-more-btn'}>Show More</button></div>}
      </> 
      : <p>You have no users yet</p>}

      {
        showModal &&
        <div className="delete-modes delete-modal-container">
        <div className="delete-modal">
          <IoClose className="delete-cls-btn" onClick={()=> setShowModal(false)}/>
          <IoMdInformationCircleOutline className="delete-info-btn"/>
          <p className="delete-txt">Are you sure you want to comment <br /> this user? ?</p>
          <div className="delete-btn-lnr">
            <button onClick={handleDeleteComment} className="delete-left-btn">Yes, i am sure</button>
            <button className="delete-right-btn" onClick={()=> setShowModal(false)}>No</button>

          </div>
        </div>
      </div>
      }
      

    </div>
  )
}

export default DashComments;