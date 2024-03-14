import '../components/css/signup.css';
import logo from '../assets/logowizblack.png';
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';

const Signups = () => {
  return (
    <div className='signup-container'>
      <div className='left-signup'>
        <img src={logo} alt='logo' />
        <p>Welcome to Wiz Blog page. You can sign up with your email and password or with Google</p>

      </div>
      <div className='right-signup'>
        <form>
          <div className='form-div'>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username'  placeholder='Username' />
          </div>
          <div className='form-div'>
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email'  placeholder='name@example.com' />
          </div>
          <div className='form-div'>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password'  placeholder='Password' />
          </div>

          <button className='signup-btn' type='submit'>Sign Up</button>
          <button className='signup-btn2'><FcGoogle /> Continue with google</button>
         
        </form>
        <p>Have an account?  <Link to='/sign-in'>Sign in</Link></p>
      </div>

    </div>
  )
}

export default Signups