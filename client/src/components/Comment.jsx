import { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import {useSelector} from 'react-redux';
import moment from 'moment';

const Comment = ({comment, onLike, onEdit}) => {

  const [user, setUser] = useState({});
  const {currentUser} = useSelector((state)=> state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content)
   
  console.log(comment)
  
  //for this page, trying to get each user that made a particular comment to display under the comment section

  useEffect(()=>{
    const getUser = async () =>{
      try{
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();

        if(res.ok){
            setUser(data)
        }

      } catch (error){
        console.log(error);
      }
    }

    getUser();
  },[comment])

  //the reason why we doing the handleEdit function here and not the commentSection component is becasue we just need to edit one comment at a time and not all the comment
  const editComment = async () =>{
    setIsEditing(true)
    setEditedContent(comment.content);

  };

  //handling the save button we have to update the content based on the comment id.
  const handleSave = async () =>{
    try{
      const res = await fetch(`/api/comment/editComment/${comment._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({content: editedContent})
      });

      if(res.ok){
        setIsEditing(false);
        onEdit(comment, editedContent);
      }

    }catch(error){
      console.log(error)
    }
  }

  
  return (
    <div className='comment-list'>
                <img src={user?.profilePicture} alt='profile-pic'/>
                <div className='comment-list-right'>
                  <p className="ct-p">{user ? `@${user?.username}` : 'Anonymous user'} <span>{moment(comment.createdAt).fromNow()}</span></p>
                    {isEditing ? 
                    <div className="is-edit">
                    <textarea className='txt-area' maxLength={200} value={editedContent} onChange={(e)=> setEditedContent(e.target.value)} />
                    <div className="is-edit-btn">
                      <button className="save-btn" onClick={handleSave}> Save </button>
                      <button className='cancel-btn' onClick={()=> setIsEditing(false)}> Cancel </button>
                    </div>
                                  
                    </div> 
                    :
                    <>
                      <span className='comment-ct'>{comment.content}</span>
                      <div className="comment-list-right-ct">
                        <button onClick={()=> onLike(comment._id)}> {currentUser && comment.likes.includes(currentUser._id) ? <BiSolidLike className="solid"/> : <BiLike className="normal"/>} </button>
                        <p>{comment.numberOfLikes > 0 && comment.numberOfLikes + ' ' + 
                        (comment.numberOfLikes === 1 ? 'like' : 'likes')}</p>
                        {/* edit should only show if the current user id is equal to comment id or the current user is an admin */}
                        {
                          currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) &&
                          <button className="edit-btn" onClick={editComment}>
                            Edit
                          </button>
                        }
                      </div>
                    </>
                    }

                   
                    
                    
               </div>
    </div>
  )
}

export default Comment