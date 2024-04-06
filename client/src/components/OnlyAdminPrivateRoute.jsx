import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
  const {currentUser} = useSelector((state) => state.user)
  //the outlet would be the dashboard cause its a child of the PrivateRoute.jsx
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />
}

export default OnlyAdminPrivateRoute;