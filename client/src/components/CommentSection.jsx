import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import Comment from './Comment';


const CommentSection = ({postId}) => {

  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(null);
  const [commentError, setCommentError] = useState(null);

  console.log(comments)
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

      {comments?.length > 0 && 
      
        <div className='comments-container'>
          <p>Comments <span className='comments-count'>{comments.length}</span></p>
         {comments.map((comment)=>(<Comment key={comment._id} comment={comment} />))}
        </div>
      }
    </div>
  )
}

export default CommentSection;