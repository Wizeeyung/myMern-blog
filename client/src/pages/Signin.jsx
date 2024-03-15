import '../components/css/signup.css';
import logo from '../assets/logowizblack.png';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


const Signin = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    console.log(formData)
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields!!!')
    }
    try{
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/')
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
        <p>Welcome to Wiz Blog page. You can sign-in with your email and password or with Google</p>

      </div>
      <div className='right-signup'>
        <form onSubmit={handleSubmit}>
          <div className='form-div'>
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email'  placeholder='name@example.com' onChange={handleChange}/>
          </div>
          <div className='form-div'>
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password'  placeholder='******' onChange={handleChange}/>
          </div>
          {errorMessage && <p className='error-msg'>{errorMessage}</p>}
          <button className='signup-btn' type='submit' disabled={loading}>{loading ? 'Loading...' : 'Sign In'}</button>
          <button className='signup-btn2'><FcGoogle /> Continue with google</button>
         
        </form>
        
        <p>Dont hava an account?  <Link to='/sign-up'>Sign up</Link></p>
      </div>

    </div>
  )
}

export default Signin