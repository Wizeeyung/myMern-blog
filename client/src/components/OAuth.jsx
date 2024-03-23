import { FcGoogle } from "react-icons/fc";
import './css/signup.css'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signInStart, signInSuccess } from "../redux/user/userSlice";
import {  useDispatch } from "react-redux";
const OAuth = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = getAuth(app)
  const handleGoogleSubmit = async () =>{
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account'})
    try{
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const res = await fetch('api/auth/google',{
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify({
          email: resultsFromGoogle.user.email,
          name: resultsFromGoogle.user.displayName,
          googlePhotoURL: resultsFromGoogle.user.photoURL
        })
      });

      const data = await res.json()

      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')

      }
    } catch(error){
      console.log(error)
    }

  }
  return (
    <div>
      <button className='signup-btn2' onClick={handleGoogleSubmit}><FcGoogle /> Continue with google</button>
    </div>
  )
}

export default OAuth;