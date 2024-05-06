import { Link } from "react-router-dom"
const PostCard = ({post}) => {
  return (
    <div className="post-card">
      <div className="post-card-img">
        <Link to={`/post/${post.slug}`}><img src={post.image} alt={post.title}/></Link>
      </div>
      <h3>{post.title.length > 35 ? post.title.split('').slice(0, 45).join('') + '....' : post.title}</h3>
      <p className="post-card-ct">{post.category}</p>
      <Link to={`/post/${post.slug}`}><button className="post-card-btn">Read article</button></Link>

    </div>
  )
}

export default PostCard