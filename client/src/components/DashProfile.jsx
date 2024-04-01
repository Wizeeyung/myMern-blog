import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { updateSuccess, updateStart, updateFailure } from "../redux/user/userSlice.js";



const DashProfile = () => {

  const {theme} = useSelector((state)=> state.theme);
  const {currentUser} = useSelector((state)=> state.user);
  const [imageFile , setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch()
  const [imageFileUploadError,setImageFileUploadError] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [formData, setFormData] = useState({})
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] =  useState(null)
  const [updateUserError, setUpdateUserError] = useState(null);

  console.log(imageFileUploadProgress, imageFileUploadError)

  const handleImage = (e) =>{
    const file = e.target.files[0];
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id] : e.target.value })
    console.log(formData)
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if(Object.keys(formData).length === 0){
      setUpdateUserError('No changes made')
      return;
    }

    if(imageFileUploading){
      setUpdateUserError('Please wait for image to upload')
      return;
    }

    try{
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message)
      }else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully")
        setUpdateUserError(null)
      }
      

    } catch (error){
      dispatch(updateFailure(error.message));
    }
  }

  //By using useEffect with a dependency array containing imageFile, the uploadImage function is invoked only when the imageFile state changes. This ensures that the upload operation is triggered only when a new image file is selected.
  useEffect(()=>{
    if(imageFile){
      uploadImage()
    }
  },[imageFile])

  //uploadImage function, ensuring that it doesn't block the main thread and that it runs at an appropriate time.
  const uploadImage = async() =>{
    //firebase storage Rules settings
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('.image/.*')
    //     }
    //   }
    // }

    //incase the user clicks on the update button without finish uploading
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
    uploadTask.on(
      'state_changed',
      (snapshot) =>{
        const progress = 
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //to avoid getting decimals for the progress
          setImageFileUploadProgress(progress.toFixed(0));
         
      },
      (error) =>{
        setImageFileUploadError('Could not upload image (Files must be less than 2Mb)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },

      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
          setImageFileUrl(downloadUrl)
          setFormData({...formData, profilePicture: downloadUrl});
          //if the image updates completely set file uploading to false
          setImageFileUploading(false);
        })
      }
    )
  }
  
  // console.log(imageFile, imageFileUrl)
  return (
    <div className="dash-profile">
      <h1>Profile</h1>
      <form className="profile-form" onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleImage} ref={filePickerRef} hidden/>
        <div className="profile-pic-container" onClick={()=> filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`} 
            strokeWidth={5}
            styles={{
              root:{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top:0,
                left: 0,
                color: 'green'
              },
              path: {
                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
              }
            }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} />
        </div>
        {imageFileUploadError ? <p>{imageFileUploadError}</p> : null}
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username}  onChange={handleChange}/>
        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" id="password" placeholder="password" onChange={handleChange}/>
        <button className={theme === 'dark' ? "profile-form-btn lights" : 'profile-form-btn'} type="submit">Update</button>
      </form>
      <div className="profile-form-p">
        <p>Delete Account</p>
        <p>Sign Out</p>
      </div>

      <p>{updateUserSuccess}</p>
      <p>{updateUserError}</p>

    </div>
  )
}

export default DashProfile