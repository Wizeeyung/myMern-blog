import { useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import {useSelector} from 'react-redux';
import moment from 'moment';

const Comment = ({comment}) => {

  const [user, setUser] = useState({})
  const [liked, setLiked] = useState(false);
  
  const handleLiked = () =>{
    setLiked(!liked)
  };

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

  
  return (
    <div className='comment-list'>
                <img src={user?.profilePicture} alt='profile-pic'/>
                <div className='comment-list-right'>
                  <p>{user ? `@${user?.username}` : 'Anonymous user'} <span>{moment(comment.createdAt).fromNow()}</span></p>
                  <span className='comment-ct'>{comment.content}</span>
                  {!liked ? <BiLike onClick={handleLiked} /> : <BiSolidLike onClick={handleLiked} /> }
                </div>
    </div>
  )
}

export default Comment