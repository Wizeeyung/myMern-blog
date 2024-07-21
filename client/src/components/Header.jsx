import logo from '../assets/logowizwhite.png'
import { IoSearch } from "react-icons/io5";
import './css/header.css'
import { MdLightMode } from "react-icons/md";
import { Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { signOutSuccess } from '../redux/user/userSlice';
import { GiMoon } from "react-icons/gi";
import { toggleTheme } from '../redux/theme/themeSlice';
import { CiMenuFries } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";

const Header = () => {

  const {theme} = useSelector((state) => state.theme);
  const {currentUser} = useSelector((state) => state.user);
  const [menu, setMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [hamburgMenu, setHamburgMenu] = useState(false);
  
  const dispatch = useDispatch();


  const toggleMenu = () =>{
    setHamburgMenu(!hamburgMenu);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }

  }, [location.search]);

  const handleMenu = () =>{
    setMenu(!menu)
  }

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

  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);

    //want to make sure the search query is a string
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }


  return (
    <header className='header-container'>
      <nav className='nav-bar'>
        <Link to='/'><img src={logo} alt="logo" className='logo'/></Link>
        <form className='search-box' onSubmit={handleSubmit}>
            <input type='text' placeholder='search' onChange={(e)=> setSearchTerm(e.target.value)} value={searchTerm}/>
            <IoSearch className='search-icon'/>
        </form>
        
        <ul className= { hamburgMenu ? 'nav-links' : 'nav-links nav-links-close'}>
          <li onClick={toggleMenu}><NavLink to='/' className={(navData) => navData.isActive ? 'links actives' : 'links'}>Home</NavLink></li>
          <li onClick={toggleMenu}><NavLink to='/about' className={(navData) => navData.isActive ? 'links actives' : 'links'}>About</NavLink></li>
          <li onClick={toggleMenu}><NavLink to='/projects' className={(navData) => navData.isActive ? 'links actives' : 'links'}>Projects</NavLink></li>
          <IoCloseCircleOutline onClick={toggleMenu} className='close-header'/>
        </ul>
        <div className='header-sign'>
          <CiMenuFries onClick={toggleMenu} className='menu'/>
          {theme === 'light' ? 
          <GiMoon  className='light-icon' onClick={()=> dispatch(toggleTheme())}/> :
          <MdLightMode  className='light-icon' onClick={()=> dispatch(toggleTheme())}/>
          }
          
          {currentUser ? 
          (
          <div className='profile-picture' onClick={handleMenu}>
            <img src={currentUser?.profilePicture} alt='profile-picture' />
            { menu &&
               <div className='menu-container'>
                <div className='menu-name'>
                  <span>{currentUser.username}</span>
                  <span>{currentUser.email}</span>
                </div>
                <Link to='/dashboard?tab=profile'><p>Profile</p></Link>
                <p onClick={handleSignOut}>SignOut</p>
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