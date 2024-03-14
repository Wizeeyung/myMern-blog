import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Signin from './pages/Signin'
import Dashboard from './pages/Dashboard'
import Signups from './pages/Signups'
import Header from './components/Header'



function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} /> 
        <Route path='/about' element={<About />} /> 
        <Route path='/projects' element={<Projects />} />
        <Route path='/sign-up' element={<Signups />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>   
    
    
    </BrowserRouter>
    
  )
}

export default App
