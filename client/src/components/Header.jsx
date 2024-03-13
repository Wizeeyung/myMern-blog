import logo from '../assets/logo2.png'
import { IoSearch } from "react-icons/io5";
import './css/header.css'
import { MdLightMode } from "react-icons/md";
import { Link, NavLink} from 'react-router-dom';

const Header = () => {


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
          <MdLightMode  className='light-icon'/>
          <button className='sign-up'>Sign Up</button>
        </div>
      </nav>

    </header>
  )
}

export default Header