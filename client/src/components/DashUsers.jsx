import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './css/dashboardtable.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { IoCheckmarkSharp } from "react-icons/io5";



const DashUsers = () => {
  const {currentUser} = useSelector((state)=> state.user);
  const {theme} = useSelector((state)=> state.theme);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(()=>{
    const fetchUsers = async () =>{
      try{
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();

        if(res.ok){
          setUsers(data.users)
          if(data.users.length < 9){
            setShowMore(false);
          }
        }
        console.log(data.users);

      }catch (error){
        console.log(error.message)
      }
    };
    if(currentUser.isAdmin){
      fetchUsers();
    }
    

  }, []);

  const handleShowMore = async () =>{
    const startIndex = users.length;
    console.log(startIndex)

    try{
      //Querying the database, and setting the start index to the length of the current post which would be 9
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);

      const data = await res.json();
      //if response is succesful, then append remaining 9 post to the previous post that was displayed, and if the new set of post after the first start index is less than 9 dont show the show more button
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 9){
          setShowMore(false);
        }
      }

    }catch(error){
      console.log(error)

    }
  }


  const handleDeleteUser = async () =>{
    try{
      const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
        method: 'DELETE'
      });

      const data = await res.json();

      if(!res.ok){
        console.log(data.message)
      }else{
        setUsers((prev) =>
          prev.filter((user)=> user._id !== userIdToDelete)
        )
        setShowModal(false)
      }
      
    }catch (error){
      console.log(error.message);
    }
  }






  // const handleDeletePost = async () =>{
  //   setShowModal(false);
  //   try{
  //     const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
  //       method: 'DELETE',
  //     });

  //     const data = await res.json();

  //     if(!res.ok){
  //       console.log(data.message)
  //     } else {
  //       setUserPosts((prev) => 
  //         prev.filter((post)=> post._id !== postIdToDelete)
  //       )
  //     }

  //   }catch(error){
  //     console.log(error.message)
  //   }
  // }

  return (
    <div className="dashboard-table-container">
      {currentUser.isAdmin && users.length > 0 ? 
      <>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Date Created</th>
            <th>User Image</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user)=>(
            <tr key={user._id} className={theme === 'dark' ? 'lights' : null}>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="usertable-img"><img src={user.profilePicture} alt={user.username} /></td>
              <td className={theme === 'dark' ? 'table-title lights' : "table-title" }>{user.username}</td>
              <td>{user.email}</td>
              <td><span className="isadmin-btn">{!user.isAdmin ? <FaXmark /> : <IoCheckmarkSharp className="mark"/>}</span></td>
              <td><span className="table-delete" onClick={()=> {setShowModal(true)
                setUserIdToDelete(user._id)
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
          <p className="delete-txt">Are you sure you want to delete <br /> this user? ?</p>
          <div className="delete-btn-lnr">
            <button onClick={handleDeleteUser} className="delete-left-btn">Yes, i am sure</button>
            <button className="delete-right-btn" onClick={()=> setShowModal(false)}>No</button>

          </div>
        </div>
      </div>
      }
      

    </div>
  )
}

export default DashUsers;