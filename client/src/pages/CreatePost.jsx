import '../components/css/createpost.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className="create-post-container">
      <h1>Create Post</h1>
      <form className='create-post-form'>
        <input type="text" id="title" placeholder="Title" required/>
        <select>
          <option value='uncategorized'>select a category</option>
          <option value='javascript'>JavaScript</option>
          <option value='nextjs'>Next.js</option>
          <option value='reactjs'>React.js</option>
        </select>
        <div className='create-post-file'>
          <input className='custom-file-input' type='file' accept='image/*'/>
          <button className='create-post-upload-btn'>Upload Image</button>
        </div>
        <ReactQuill  placeholder='Write something' required/>
        <button type='submit' className='quill-btn'>Publish</button>
      </form>
    </div>
  )
}

export default CreatePost