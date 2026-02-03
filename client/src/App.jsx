import './App.css'
import { Button } from './components/ui/button'
import Navbar from "./components/Navbar.jsx"
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'

function App() {

  return (
    <div>
      <Navbar/>
      <HeroSection />
      <Login />
    </div>
  )
}

export default App
