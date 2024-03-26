import { useSelector } from "react-redux";


const DashProfile = () => {

  const {currentUser} = useSelector((state)=> state.user)
  return (
    <div className="dash-profile">
      <h1>Profile</h1>
      <form className="profile-form">
        <div className="profile-pic-container">
          <img src={currentUser.profilePicture} />
        </div>
        <input type="text" id="username" placeholder="username" defaultValue={currentUser.username}/>
        <input type="email" id="email" placeholder="email" defaultValue={currentUser.email}/>
        <input type="password" id="password" placeholder="password"/>
        <button className="profile-form-btn" type="submit">Update</button>
      </form>
      <div className="profile-form-p">
        <p>Delete Account</p>
        <p>Sign Out</p>
      </div>

    </div>
  )
}

export default DashProfile