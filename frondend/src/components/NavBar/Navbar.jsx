import './navbar.css';
import { Home } from '@mui/icons-material';
import { Message } from '@mui/icons-material';
import { Notifications } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
export default function Navbar() {
  return (
    <div className='navbarContainer'>
        <div className='navbar-left'>
        <a className='logo'><img src='/assets/logo.png' alt=''/></a>
        <div className='search-box'>
          <p><Search/></p>
          <input type='text' placeholder='Search'/>

        </div>
        </div>
        <div className='navbar-center'>
          <ul>
            <li><a className='active-link'> <p><Home/></p><span>Home</span></a></li>
            
            <li><a> <p><Message/></p><span>Messaging</span></a></li>
            <li><a> <p><Notifications /></p><span>Notifications</span></a></li>
          </ul>
       </div>
        <div className='navbar-right'>
          <div className='online'>
          <img src='/assets/profile1.jpg' alt='' className='nav-profile-img'/>
          </div>
        </div>
        </div>
  )
}
