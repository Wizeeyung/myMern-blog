import { useState } from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';

const CommentSection = ({postId}) => {

  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);


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
        console.log(data)
      }
  
    }catch(error){
      setCommentError(error.message);
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
    </div>
  )
}

export default CommentSection;