import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import { useSelector } from "react-redux";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import { MdDashboard } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import DashboardComponent from "../components/DashboardComponent";


const Dashboard = () => {

  const location = useLocation();
  const [tab, setTab] = useState('');
  const {theme} = useSelector((state)=> state.theme)

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl !== null){
      setTab(tabFromUrl)
    }
  }, [location.search])
  console.log(location, 'this locate')

  const [show, setShow] = useState(false);

  const handleShowDashboard = () =>{
    setShow(!show)
  };

 

  

  return (
    <div className="dashboard-container">
      {!show && <MdDashboard className="dash-icon" onClick={handleShowDashboard}/>}
      {show && <div className={theme === 'dark' ? "left-dashboard lights" : 'left-dashboard'}>
        <GiCancel className='dash-cancel'onClick={handleShowDashboard}/>
        <DashSidebar handleShowDashboard={handleShowDashboard}/>
      </div>}
      <div className="right-dashboard">
        
        {tab === 'profile' && <DashProfile />}
        {tab === 'post' && <DashPost />}
        {tab === 'user' && <DashUsers />}
        {tab === 'comments' && <DashComments />}
        {tab === 'dash' && <DashboardComponent />}

      </div>
    </div>
  )
}

export default Dashboard