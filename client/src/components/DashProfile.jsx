import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";


const DashProfile = () => {

  const {theme} = useSelector((state)=> state.theme);
  const {currentUser} = useSelector((state)=> state.user);
  const [imageFile , setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadError,setImageFileUploadError] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);

  console.log(imageFileUploadProgress, imageFileUploadError)
  const handleImage = (e) =>{
    const file = e.target.files[0];
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file));
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
      },

      () =>{
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
          setImageFileUrl(downloadUrl)
        })
      }
    )
  }
  
  // console.log(imageFile, imageFileUrl)
  return (
    <div className="dash-profile">
      <h1>Profile</h1>
      <form className="profile-form">
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
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username}/>
        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email}/>
        <input type="password" id="password" placeholder="password"/>
        <button className={theme === 'dark' ? "profile-form-btn lights" : 'profile-form-btn'} type="submit">Update</button>
      </form>
      <div className="profile-form-p">
        <p>Delete Account</p>
        <p>Sign Out</p>
      </div>

    </div>
  )
}

export default DashProfile