import { HiMiniUserGroup } from "react-icons/hi2";
import '../components/css/dashboardct.css'
import { useEffect, useState } from "react";
import { MdOutlineInsertComment } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { useSelector } from "react-redux";
import { FaLongArrowAltUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardComponent = () => {

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0)
  const [totalPosts, setTotalPosts] =useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const {currentUser} = useSelector((state)=> state.user);

  console.log(posts)
  useEffect(()=>{
    const fetchUsers = async () =>{
      try{
        const res = await fetch('/api/user/getusers?limit=5');

        const data = await res.json();
        console.log(data.totalUsers);
        if(res.ok){
          setUsers(data.users)
          setNumberOfUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers)
        }

      }catch(error){
        console.log(error.message)
      }
      
    }

    const fetchComments = async () =>{
      try{
        const res = await fetch('/api/comment/getcomments?limit=5');

        const data = await res.json();
        
        if(res.ok){
          setComments(data.comments)
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments)
        }

      }catch(error){
        console.log(error.message)
      }
      
    }

    const fetchPosts = async () =>{
      try{
        const res = await fetch('/api/post/getpost?limit=5');

        const data = await res.json();
        
        if(res.ok){
          setPosts(data.posts)
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts)
        }

      }catch(error){
        console.log(error.message)
      }
      
    }

    if(currentUser.isAdmin){
      fetchUsers();
      fetchComments();
      fetchPosts();

    }

    
  }, [currentUser]);


  



  return (
    <div className="dashboard-comp-ct">
      <div className="dashboard-first-row">
        <div className="dashboard-first-row-ct">
          <h3>Total Users</h3>
          <h1>{numberOfUsers}</h1>
          <span className="arrow-svg"> <FaLongArrowAltUp /> {lastMonthUsers} Last Month</span>
          <span className="svg grey"><HiMiniUserGroup /></span>
        </div>
        <div className="dashboard-first-row-ct">
          <h3>Total Comments</h3>
          <h1>{totalComments}</h1>
          <span className="arrow-svg"> <FaLongArrowAltUp /> {lastMonthComments} Last month</span>
          <span className="svg blue"><MdOutlineInsertComment /></span>
        </div>
        <div className="dashboard-first-row-ct">
          <h3>Total Posts</h3>
          <h1>{totalPosts}</h1>
          <span className="arrow-svg"> { lastMonthPosts === 0 ? '' : <FaLongArrowAltUp /> }{lastMonthPosts} Last month</span>
          <span className="svg green"><CgFileDocument /></span>
        </div>
      </div>

      <div className="dashboard-second-row-ct">
        <div className="dashboard-second-row-ct-left">
          <div className="recent-users-ct">
            <div className="recent-users-hd">
              <h3>Recent Users</h3>
              <Link to='/dashboard?tab=user'><button>See All</button></Link>
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th>USER IMAGE</th>
                  <th className="user-name-th">USER NAME</th>
                </tr>
              </thead>
              <tbody>
                {users && users.map((user)=>(
                  <tr key={user._id} className="user-table-row">
                    <td className="user-table-img"><img src={user.profilePicture} /></td>
                    <td className="user-name-th">{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="recent-users-ct">
            <div className="recent-users-hd">
              <h3>Recent Comments</h3>
              <Link to='/dashboard?tab=comments'><button>See All</button></Link>
            </div>
            <table className="user-table">
              <thead>
                <tr>
                  <th>COMMENT CONTENT</th>
                  <th className="user-name-th">LIKES</th>
                </tr>
              </thead>
              <tbody>
                {comments && comments.map((comment)=>(
                  <tr key={comment._id} className="user-table-row">
                    <td className="user-table-img">{comment.content.length > 25 ? comment.content.split('').slice(0, 25).join('') + '....' : comment.content }</td>
                    <td className="user-name-th">{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      <div className="recent-users-ct">
        <div className="recent-users-hd">
          <h3>Recent Posts</h3>
          <Link to='/dashboard?tab=post'><button>See All</button></Link>
        </div>
        <table className="user-table">
          <thead>
            <tr>
            <th>POST IMAGE</th>
              <th className="user-name-th">POST TITLE</th>
              <th >CATEGORY</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.map((post)=>(
              <tr key={post._id} className="user-table-row">
                <td className="user-table-img-post"><img src={post.image} /></td>
                <td className="user-name-th">{post.title}</td>
                <td >{post.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

    </div>
  )
}

export default DashboardComponent