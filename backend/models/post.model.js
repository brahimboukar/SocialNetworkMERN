import mongoose from 'mongoose';
import UserModel from './user.model.js';


const PublicationSchema = new mongoose.Schema(
  {
    utilisateur: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'utilisateur'
    },
    status: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
    },
    video: {
      type: String, 
    },
    
    etat: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model('publication', PublicationSchema);
export default PostModel;

 