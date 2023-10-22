import './home.css';
import Feed from "../../components/Feed/Feed.jsx";
import Navbar from "../../components/NavBar/Navbar.jsx";
import Rightbar from "../../components/RightBar/Rightbar.jsx";
import Sidebar from "../../components/SideBar/Sidebar.jsx";

export default function Home() {
 
    return (
      <>
            <Navbar/>
            <div className="homeContainer">
            <Sidebar/>
            <Feed/>
            <Rightbar/>
            </div>
            
      </>
    )
}
