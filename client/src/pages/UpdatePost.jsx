import { useEffect, useState} from 'react';
import '../components/css/createpost.css'
import {useSelector} from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate, useParams} from 'react-router-dom';

const UpdatePost = () => {

  const [file, setFile] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageFileUploadError] = useState(null);
  //to avoid error of input field been empty and now contains content, you can controll it like so below
  const [formData, setFormData] = useState({
    title: '',
    category: 'select a category',
    content: '',
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();
  const {postId} = useParams();
  const {theme} = useSelector((state)=> state.theme);
  const [loading, setLoading] = useState(true);

  const {currentUser} = useSelector((state)=> state.user);


  //we use useParams to get the if of the post, and useEffect to update the page based on the postId using the getrequest
  useEffect(()=>{
    try{
        setLoading(true);
        const fetchPost = async () =>{
          const res = await fetch(`/api/post/getpost?postId=${postId}`);
          const data = await res.json();

          if(!res.ok){
            setLoading(false);
            console.log(data.message)
            setPublishError(data.message)
            return;
          }

          if(res.ok){
            setLoading(false)
            setPublishError(null);
            const postData = data.posts[0];
            console.log(postData)
            //set the form data manually
            setFormData({
              _id: postData._id,
              title: postData.title,
              category: postData.category,
              content: postData.content,
              image: postData.image,
            });
          }
        }
        
        const timeOutId = setTimeout(()=>{
          fetchPost()
        }, 500)

        return (()=>{
          clearTimeout(timeOutId)
        })
    }catch(error){
      console.log(error.message);
    }

  }, [postId])


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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };


  return (
    <div className='create-post-cover'>
       {loading && <div className="post-loader"><ClipLoader type='TailSpin' height='50' width='50' color='red'/></div>}
      <div className="create-post-container">
        {/* form content should only show if formData.title is present */}
        {
          !loading && formData.title ?
          <>
          <h1>Update Post</h1>
          <form className='create-post-form' onSubmit={handleSubmit}>
          <input className={ theme === 'dark' ? "update-input" : "" }  type="text" id="title" placeholder="Title" required onChange={(e) => setFormData({...formData, title : e.target.value})} value={formData.title}/>
          <select  className={ theme === 'dark' ? "update-select" : "" }  onChange={(e) => setFormData({...formData, category : e.target.value})} value={formData.category}>
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
          
          <ReactQuill placeholder='Write something' required 
          onChange={(value) => {setFormData({...formData, content: value})}} value={formData.content}/>
          <button type='submit' className='quill-btn'>Update post</button>
          
        </form>
        </> : ''

        }
        
        {
            publishError && <p className='update-error publish'>{publishError + '!!!'}</p>
          }
      </div>
    </div>
  )
}

export default UpdatePost;