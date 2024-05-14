import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import { useSelector } from "react-redux";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
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
  return (
    <div className="dashboard-container">
      <div className={theme === 'dark' ? "left-dashboard lights" : 'left-dashboard'}>
        <DashSidebar />
      </div>
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