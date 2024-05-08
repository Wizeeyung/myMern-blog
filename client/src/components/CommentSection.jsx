import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";


const CommentSection = ({postId}) => {

  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  console.log(commentToDelete, showModal)

  useEffect(()=>{
      const getPostComments = async () =>{

        try{
          const res = await fetch(`/api/comment/getPostComments/${postId}`);

           const data = await res.json();

        if(res.ok){
          setComments(data)
        }

        }catch (error){
          console.log(error)
        }
        
        

      }

      getPostComments()
  }, [postId])

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(comment.length > 200) {
      return;
    }

    try{
      // setCommentError(null);
      const res = await fetch('/api/comment/create' , {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: comment, postId, userId: currentUser._id})
      })
  
      const data = await res.json();
      if(res.ok){
        setComment('')
        setCommentError(null)
        setComments([data, ...comments])
      }
  
    }catch(error){
      setCommentError(error.message);
    }

  };

  const handleLike = async (commentId) =>{
    try{
      if(!currentUser){
        navigate('/sign-in');
        //it's essential to include the return statement to exit the function early if the user is not logged in to prevent further execution of unauthorized actions.
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}` ,{
        method: 'PUT',
      });

      //if response is okay, update the comment likes and number of likes other return the comment
      if(res.ok){
        const data = await res.json();
        setComments(comments.map((comment)=> (
          comment._id === commentId ? {
            ...comment,
            likes: data.likes,
            numberOfLikes: data.likes.length,
          } : comment
        )))
      }
    }catch(error){
      console.log(error.message)
    }

  }

  //creating handleEdit function here cause we need to update the state from the array of comments to update immediately as its present in the commentSectionComponents
  const handleEdit = (comment, editedContent) =>{
    setComments(comments.map((c) => 
    c._id === comment._id ? {...c, content : editedContent} : c
  ))

  };

  const handleDelete = async (commentId) =>{
    setShowModal(false);
    try{
      if(!currentUser) {
        navigate('/sign-in');
        // the return statement means to end the function immediately if there is no currentuser present
        return;
      }

      const res = await fetch(`/api/comment/deleteComment/${commentId}`,{
        method: 'DELETE',
      });

      if(res.ok){
        
        setComments(comments.filter((comment)=> comment._id !== commentId))
      }
    }catch(error){
      console.log(error.message)

    }

  };
  return (
    <div className='comment-container'>
      {
        currentUser ? 
        (
          <div className='comment-sign'>
            <p>Signed in as:</p>
            <img src={currentUser.profilePicture} alt={currentUser.username} />
            <Link to='/dashboard?tab=profile'>@{currentUser.username}</Link>
          </div>
        ):
        (
          <div className='comment-signout'>
            <p>You need to sign in to comment.  <Link to='/sign-in'>Signin</Link></p>
          </div>
        )
      }


      {currentUser && 
        <form className='comment-form' onSubmit={handleSubmit}>
          <textarea rows={3} maxLength={200} placeholder='Add a comment......' onChange={(e)=> setComment(e.target.value)} value={comment}/>
          <div className='comment-form-content'>
            <p>{200 - comment.length} characters remaining</p>
            <button type='submit'>Submit</button>
          </div>
          {commentError && <p className="update-error">{commentError}</p>}
        </form>
      }

      {comments?.length > 0 ?
      
        <div className='comments-container'>
          <p>Comments <span className='comments-count'>{comments.length}</span></p>
         {comments.map((comment)=>(<Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId)=>{
          setShowModal(true);
          setCommentToDelete(commentId);
          console.log('modal tho')
         }}/>))}

        {
        showModal &&
        <div className="delete-modes delete-modal-container">
        <div className="delete-modal">
          <IoClose className="delete-cls-btn" onClick={()=> setShowModal(false)}/>
          <IoMdInformationCircleOutline className="delete-info-btn"/>
          <p className="delete-txt">Are you sure you want to delete this<br /> comment?</p>
          <div className="delete-btn-lnr">
            <button className="delete-left-btn"onClick={()=>handleDelete(commentToDelete)}>Yes</button>
            <button className="delete-right-btn" onClick={()=> setShowModal(false)}>No</button>

          </div>
        </div>
      </div>
      }
        </div> : <p>No comments yet!</p>
      }

      
    </div>
  )
}

export default CommentSection;