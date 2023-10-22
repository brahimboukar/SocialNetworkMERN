import './post.css';
import { MoreVert } from '@mui/icons-material';
import { ThumbUp } from '@mui/icons-material';
import { Favorite } from '@mui/icons-material';
export default function post() {
  return (
    <div className='post'>
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                <img className='postProfileImg' src='/assets/profile1.jpg' alt='' />
                <span className="postUserName">BRAHIM BOUKAR</span>
                <span className="posDate">5 min ago</span>
                </div>
                <div className="postTopRight">
                    <MoreVert/>
                </div>
            </div>
            <div className="postCenter">
                <span className='postText'> Hey Its My first post</span>
                <img className='postImg' src='/assets/profile1.jpg' alt='' />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <ThumbUp className='likeIcon'/>
                    <Favorite className='likeIcon'/>
                    <span className='postLikeCounter'>32 Like</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">9 Comment</span>
                </div>
            </div>
        </div>
        </div>
  )
}
