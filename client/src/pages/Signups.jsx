import '../components/css/signup.css';
import logo from '../assets/logowizblack.png';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Signups = () => {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    if(errorMessage){
      setErrorMessage(null);
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields!!!')
    }
    try{
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in')
      }
    }catch (error){
      setLoading(false);  
      setErrorMessage(error.message);
        
    }
  }

  return (
    <div className='signup-container'>
      <div className='left-signup'>
        <img src={logo} alt='logo' />
        <p>Welcome to Wiz Blog page. You can sign up with your email and password or with Google</p>

      </div>
      <div className='right-signup'>
        <form onSubmit={handleSubmit}>
          <div className='form-div'>
            <label htmlFor='username'>Username:</label>
            <input type='text' id='username'  placeholder='Username' onChange={handleChange}/>
          </div>
          <div className='form-div'>
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email'  placeholder='name@example.com' onChange={handleChange}/>
          </div>
          <div className='form-div'>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password'  placeholder='Password' onChange={handleChange}/>
          </div>
          {errorMessage && <p className='error-msg'>{errorMessage}</p>}
          <button className='signup-btn' type='submit' disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
          <button className='signup-btn2'><FcGoogle /> Continue with google</button>
         
        </form>
        
        <p>Have an account?  <Link to='/sign-in'>Sign in</Link></p>
      </div>

    </div>
  )
}

export default Signups