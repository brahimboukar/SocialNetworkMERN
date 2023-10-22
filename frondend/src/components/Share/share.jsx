import './share.css';
import { InsertPhotoSharp } from '@mui/icons-material';
import { OndemandVideoSharp } from '@mui/icons-material';

export default function share() {
  return (
    <div className='share'>
        <div className='shareWrapper'>
        <div className='shareTop'>
            <img className='shareProfileImg' src='/assets/profile1.jpg' alt='' />
            <input placeholder='What New' className='shareInput' />
        </div>
        <hr className='shareHr'/>
        <div className='shareBottom'>
            <div className='shareOptions'>
            <div className='shareOption'>
                <InsertPhotoSharp htmlColor='tomato' className='shareIcon'/>
                <span className='shareOptionText'>Photo</span>
            </div>
            <div className='shareOption'>
                <OndemandVideoSharp htmlColor='blue' className='shareIcon'/>
                <span className='shareOptionText'>Video</span>
            </div>
            <button className='shareButton'>Post</button>
            </div>
            
        </div>
        </div>
    </div>
  )
}
