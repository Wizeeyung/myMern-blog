import '../components/css/signup.css';
import logo from '../assets/logowizblack.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure, signInStopError } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';


const Signin = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading , error: errorMessage} = useSelector((state)=> state.user)

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
    if(errorMessage){
      dispatch(signInFailure(errorMessage))
      dispatch(signInStopError())
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!formData.email || !formData.password){
      return dispatch(signInFailure('Please fill out all fields!!!'))
    }
    try{
      // setLoading(true)
      // setErrorMessage(null)
      //try to use the signinstart reducer from redux to control the error and the loading instead
      dispatch(signInStart())
      //dont forget to add the server proxy to the vite.config.js file when the route is /api so it can switch to port 3000 when connecting to the backend
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false){
        // setLoading(false);
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message))
      }
      

      
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    }catch (error){
     dispatch(signInFailure(error.message))
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
          <OAuth />

        </form>
        
        <p>Dont hava an account?  <Link to='/sign-up'>Sign up</Link></p>
      </div>

    </div>
  )
}

export default Signin