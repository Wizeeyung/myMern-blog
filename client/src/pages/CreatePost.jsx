import { useState } from 'react';
import '../components/css/createpost.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();


  const handleUploadImage = async () => {

    try{
      if(!file){
        setImageFileUploadError('Please select an image')
        return;
      }
      setImageFileUploadError(null)
      const storage = getStorage(app);
      //we have to get a unique file name so we use the date method appended to the filename
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0))
        },

        (error) => {
          setImageFileUploadError('Image upload failed');
          setImageUploadProgress(null);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageFileUploadError(null);
            setFormData({...formData, image: downloadURL});
          });
        }
      )

    }catch (error){
      setImageFileUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };


  const handleSubmit = async (e) =>{
    e.preventDefault();

    try{
      const res = await fetch('api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
    
      });
  
      const data = await res.json();
     
      if(!res.ok){
        setPublishError(data.message)
        
      }

      if(res.ok){
        setPublishError(null)
        navigate(`/post/${data.slug}`);
      }
    }catch (error){
        setPublishError('Something went wrong');
    }
    

  }


  return (
    <div className='create-post-cover'>
      <div className="create-post-container">
        <h1>Create Post</h1>
        <form className='create-post-form' onSubmit={handleSubmit}>
          <input type="text" id="title" placeholder="Title" required onChange={(e) => setFormData({...formData, title : e.target.value})}/>
          <select onClick={(e) => setFormData({...formData, category : e.target.value})}>
            <option value='uncategorized'>select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='nextjs'>Next.js</option>
            <option value='reactjs'>React.js</option>
          </select>
          <div className='create-post-file'>
            <input className='custom-file-input' type='file' accept='image/*' onChange={(e)=> setFile(e.target.files[0])}/>
            <button className='create-post-upload-btn' onClick={handleUploadImage} disabled={imageUploadProgress}>{imageUploadProgress ? imageUploadProgress + '%' : 'Upload Image'}</button>
          </div>
          {
            imageUploadError && <p className='update-error publish'>{imageUploadError + ' !!!'}</p>
          }
          
          {
            formData.image && <div className='img-upload'><img src={formData.image} alt='image-upload' /></div>
          }
          
          <ReactQuill  placeholder='Write something' required 
          onChange={(value) => {setFormData({...formData, content: value})}}/>
          <button type='submit' className='quill-btn'>Publish</button>
          
        </form>
        {
            publishError && <p className='update-error publish'>{publishError + '!!!'}</p>
          }
      </div>
    </div>
  )
}

export default CreatePost