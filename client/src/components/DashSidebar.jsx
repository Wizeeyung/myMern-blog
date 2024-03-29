import { useEffect, useState } from 'react';
import './css/dashboard.css';
import { FaUser } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { toggleTheme } from '../redux/theme/themeSlice';
import { useSelector } from 'react-redux';





const DashSidebar = () => {

  const {theme} = useSelector((state) => state.theme)
  const location = useLocation()
  const [tab, setTab] = useState('')

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
        <span>User</span>
      </div>
      <div className='profile-sign'>
        <FaArrowRight />
        <p>Signout</p>
      </div>
      

    </div>
  )
}

export default DashSidebar;