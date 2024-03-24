import '../components/css/signup.css';
import logo from '../assets/logowizblack.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import whiteLogo from '../assets/logowizwhite.png';
import OAuth from '../components/OAuth';
import { useSelector } from 'react-redux';

const Signups = () => {

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {theme} = useSelector((state) => state.theme);

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
      <img src={theme === 'dark' ? whiteLogo : logo} alt='logo' />
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
          <button className={theme === 'dark'? 'signup-btn black' : 'signup-btn'} type='submit' disabled={loading}>{loading ? 'Loading...' : 'Sign Up'}</button>
          <OAuth />
         
        </form>
        
        <p className={theme === 'dark'? 'signin-theme' : null}>Have an account?  <Link to='/sign-in'>Sign in</Link></p>
      </div>

    </div>
  )
}

export default Signups