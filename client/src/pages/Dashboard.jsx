import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import { useSelector } from "react-redux";
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

      </div>
    </div>
  )
}

export default Dashboard