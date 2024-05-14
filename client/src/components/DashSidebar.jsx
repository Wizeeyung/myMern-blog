import { useEffect, useState } from 'react';
import './css/dashboard.css';
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutSuccess } from '../redux/user/userSlice';
import { CgFileDocument } from "react-icons/cg";
import { FaUsersLine } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";



const DashSidebar = () => {

  const {theme} = useSelector((state) => state.theme)
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state)=> state.user);


  const handleSignOut = async () =>{
    try{
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });

      const data = await res.json();
      if(!res.ok){
        console.log(data.message)
      }else{
        dispatch(signOutSuccess())
      }
    } catch (error){
      console.log(error.message)
    }
  };


  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl !== null){
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <div className='dash-sidebar'>
      <div className={tab === 'profile' ? 'profile active' : 'profile'}>
        <FaUser />
        <p ><Link to='/dashboard?tab=profile' className={theme === 'light' ? 'darks' : null}>Profile</Link></p>
        <span>{currentUser.isAdmin ? 'Admin' : 'User'}</span>
      </div>
      {
        currentUser.isAdmin &&
        <div className={tab === 'dash' ? 'profile active' : 'profile'}>
          <BiSolidDashboard />
          <p><Link to='/dashboard?tab=dash' className={theme === 'light' ? 'darks' : null}>Dashboard</Link></p>
        </div>
      }
      {
        currentUser.isAdmin &&
        <div className={tab === 'post' ? 'profile active' : 'profile'}>
          <CgFileDocument />
          <p><Link to='/dashboard?tab=post' className={theme === 'light' ? 'darks' : null}> Post</Link></p>
        </div>
      }
      {
        currentUser.isAdmin &&
        <div className={tab === 'user' ? 'profile active' : 'profile'}>
          <FaUsersLine />
          <p><Link to='/dashboard?tab=user' className={theme === 'light' ? 'darks' : null}>User</Link></p>
        </div>
      }
      {
        currentUser.isAdmin &&
        <div className={tab === 'comments' ? 'profile active' : 'profile'}>
          <MdOutlineInsertComment />
          <p><Link to='/dashboard?tab=comments' className={theme === 'light' ? 'darks' : null}>Comments</Link></p>
        </div>
      }
      
      <div className='profile-sign'>
        <FaArrowRight />
        <p onClick={handleSignOut}>Signout</p>
      </div>
      

    </div>
  )
}

export default DashSidebar;