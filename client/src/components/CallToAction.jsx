import '../components/css/postpage.css';
import { Link } from 'react-router-dom';
import img from '../assets/web-img.jpg';

const CallToAction = () => {
  return (
    <div className="cta">
    <div className="cta-left">
      <div className="cta-left-content">
      <h1>Want to know more about how amazing <br/> my projects are?</h1>
      <span>Check out my projects by clicking on the button below</span>
      </div>
      {/* rel='noopener noreferrer'  attribute is added for security reasons to prevent a potential security vulnerability called "tabnabbing". */}
      <button><Link to='https://github.com/Wizeeyung?tab=repositories' target='_blank' rel='noopener noreferrer'>My Projects</Link></button>
    </div>
    <div className="cta-right">
      <img src={img} alt="blog-pic" />
    </div>

  </div>
  )
}

export default CallToAction