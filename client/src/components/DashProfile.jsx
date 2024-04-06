import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { updateSuccess, updateStart, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess} from "../redux/user/userSlice.js";



const DashProfile = () => {

  const {theme} = useSelector((state)=> state.theme);
  const {currentUser, error, loading} = useSelector((state)=> state.user);
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
  const [showModal, setShowModal] = useState(false);



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

  const handleDeleteUser = async () => {
    setShowModal(false);

    try{
      dispatch(deleteUserStart());
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


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
        {imageFileUploadError ? <p className="file-upload">{imageFileUploadError}</p> : null}
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username}  onChange={handleChange}/>
        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange}/>
        <input type="password" id="password" placeholder="password" onChange={handleChange}/>
        <button className={theme === 'dark' ? "profile-form-btn lights" : 'profile-form-btn'} type="submit" disabled={loading || imageFileUploading}>{loading ? 'loading....' : 'Update'}</button>
        {currentUser.isAdmin &&
        <Link to='/create-post'><button className={ theme === 'dark' ? "profile-form-btn create-post-lit" :"profile-form-btn create-post" }>Create Post</button></Link>
}
      </form>
      <div className="profile-form-p">
        <p onClick={()=> setShowModal(true)}>Delete Account</p>
        <p onClick={handleSignOut}>Sign Out</p>
      </div>

      <p className="update-success">{updateUserSuccess}</p>
      <p className="update-error">{updateUserError}</p>

      {
        showModal &&
        <div className="delete-modal-container">
        <div className="delete-modal">
          <IoClose className="delete-cls-btn" onClick={()=> setShowModal(false)}/>
          <IoMdInformationCircleOutline className="delete-info-btn"/>
          <p className="delete-txt">Are you sure you want to delete <br /> your account?</p>
          <div className="delete-btn-lnr">
            <button className="delete-left-btn" onClick={handleDeleteUser}>Yes</button>
            <button className="delete-right-btn" onClick={()=> setShowModal(false)}>No</button>

          </div>
        </div>
      </div>
      }
      

    </div>
  )
}

export default DashProfile