import './sidebar.css';
import { RssFeed } from '@mui/icons-material';
import { Chat } from '@mui/icons-material';
import { PlayCircleFilledOutlined } from '@mui/icons-material';
import { Group } from '@mui/icons-material';
import { Bookmark } from '@mui/icons-material';
import { HelpOutline } from '@mui/icons-material';
import { WorkOutline } from '@mui/icons-material';
import { Event } from '@mui/icons-material';
import { School } from '@mui/icons-material';
import {  useEffect, useReducer } from 'react';
import { reducer,initialState } from '../../ColorReducer';

export default function Sidebar() {
  const [ colorState, dispatch]  = useReducer(reducer, initialState);
  const changeHandler = (typeAction) => {
    
    dispatch({ type: typeAction });
  }

 
  return (
    <div className='sidebar'>
      <div className='sidebarWraper'>
        <ul className='sidebarList'>
        <li style={colorState.feed ? { backgroundColor: '#5632CD', color: 'white', border: '1px solid #ccc',width:'200px' } : null} onClick={() => changeHandler('feed')} className='sidebarListItem'>
            <RssFeed className='sidebarIcon' />
            <span className='sidebarListItemText'>Feed</span>
          </li>

          <li style={colorState.chat ? { backgroundColor: '#5632CD', color: 'white', border: '1px solid #ccc',width:'200px' } : null} onClick={() => changeHandler('chat')} className='sidebarListItem'>
            <Chat className='sidebarIcon' />
            <span className='sidebarListItemText'>Chats</span>
          </li>
          <li style={colorState.video ? { backgroundColor: '#5632CD', color: 'white', border: '1px solid #ccc',width:'200px' } : null} onClick={() => changeHandler('video')} className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
        </ul>
        {/* <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" /> */}
      </div>
      </div>
  )
}
