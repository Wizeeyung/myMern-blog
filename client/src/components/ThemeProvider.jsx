import { useSelector } from "react-redux";
import './css/theme.css'

const ThemeProvider = ({ children }) => {

  const {theme} = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      {/* <div> */}
        {children}
      {/* </div> */}
    </div>
  )
}

export default ThemeProvider