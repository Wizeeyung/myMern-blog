import logo from '../assets/logowizwhite.png'
import { IoSearch } from "react-icons/io5";
import './css/header.css'
import { MdLightMode } from "react-icons/md";
import { Link, NavLink} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { GiMoon } from "react-icons/gi";
import { toggleTheme } from '../redux/theme/themeSlice';

const Header = () => {

  const {theme} = useSelector((state) => state.theme);
  const {currentUser} = useSelector((state) => state.user)
  const [menu, setMenu] = useState(false)
  const dispatch = useDispatch()

  const handleMenu = () =>{
    setMenu(!menu)
  }
  return (
    <header className='header-container'>
      <nav className='nav-bar'>
        <Link to='/'><img src={logo} alt="logo" /></Link>
        <form className='search-box'>
            <input type='text' placeholder='search'/>
            <IoSearch className='search-icon'/>
        </form>
        <ul className='nav-links'>
          <li><NavLink to='/' className={(navData) => navData.isActive ? 'links actives' : 'links'}>Home</NavLink></li>
          <li><NavLink to='/about' className={(navData) => navData.isActive ? 'links actives' : 'links'}>About</NavLink></li>
          <li><NavLink to='/projects' className={(navData) => navData.isActive ? 'links actives' : 'links'}>Projects</NavLink></li>
        </ul>
        <div className='header-sign'>
          {theme === 'light' ? 
          <GiMoon  className='light-icon' onClick={()=> dispatch(toggleTheme())}/> :
          <MdLightMode  className='light-icon' onClick={()=> dispatch(toggleTheme())}/>
          }
          
          {currentUser ? 
          (
          <div className='profile-picture' onClick={handleMenu}>
            <img src={currentUser.profilePicture} alt='profile-picture' />
            { menu &&
               <div className='menu-container'>
                <div className='menu-name'>
                  <span>{currentUser.username}</span>
                  <span>{currentUser.email}</span>
                </div>
                <Link to='/dashboard?tab=profile'><p>Profile</p></Link>
                <p>SignOut</p>
             </div>
            }
           
          </div>
          ) : 
          <Link to='/sign-in'><button className='sign-up'> Sign In</button></Link>
          }
          
        </div>
      </nav>

    </header>
  )
}

export default Header