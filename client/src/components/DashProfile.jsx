
const DashProfile = () => {
  return (
    <div className="dash-profile">
      <div className="profile-pic-container">

      </div>
      <form className="profile-form">
        <input type="text" placeholder="username"/>
        <input type="email" placeholder="email"/>
        <input type="password" placeholder="password"/>
        <button className="profile-form-btn">Update</button>
      </form>
      <div className="profile-form-p">
        <p>Delete Account</p>
        <p>Sign Out</p>
      </div>

    </div>
  )
}

export default DashProfile