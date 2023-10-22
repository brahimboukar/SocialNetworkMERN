import mongoose from 'mongoose';
import PostModel from '../models/post.model.js';
import UserModel from '../models/user.model.js';
import GroupModel from '../models/group.model.js';


export const createPost = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  try {
    const userId = res.locals.user.id;
    const  {status}  = req.body;
    

    const randomString = req.randomString; // Retrieve the random string from the request object

    // Initialize a new post object with the common fields
    const newPost = new PostModel({
      utilisateur: userId,
      status,
    });

    // Check if an image is included in the request
    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      const imageOriginalName = imageFile.originalname;
      const imageExt = imageOriginalName.split('.').pop(); // Get file extension
      const imageFilename = `uploads/images/${randomString}-${imageOriginalName}`; // Use the same random string for the filename
      newPost.image = imageFilename;
    }

    // Check if a video is included in the request
    if (req.files && req.files["video"]) {
      const videoFile = req.files["video"][0];
      const videoOriginalName = videoFile.originalname;
      const videoExt = videoOriginalName.split('.').pop(); // Get file extension
      const videoFilename = `uploads/videos/${randomString}-${videoOriginalName}`; // Use the same random string for the filename
      newPost.video = videoFilename;
    }
    
    // Save post with the appropriate fields based on file presence
    const savedPost = await newPost.save();
    // Find the user by identifiant
      const user = await UserModel.findById(userId);

      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).json({ error: 'User not found' });
      }

      user.publications.push(savedPost._id); // Push the ID of the new post
      await user.save();// Save the user to update the publications array

      // Debug log to verify publications
     // console.log("Updated Publications:", user.publications);
    return res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send(err);
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id; // Get the post ID from the request parameters

    // Find the post by ID in the database
    const post = await PostModel.findById(postId);

    if (!post) {
      // If the post with the given ID is not found, return a 404 error
      return res.status(404).json({ message: 'Post not found' });
    }

    // If the post is found, return it as a JSON response
    return res.status(200).json(post);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))                       
      return res.status(400).send("ID unknown: " + req.params.id);

    const { status } = req.body;
    const randomString = req.randomString;
    const userId = res.locals.user.id; // Assuming you have user information in res.locals

    //console.log(userId);
    // Find the post by ID
    const post = await PostModel.findById(req.params.id);

    // Check if the post exists and if the user is authorized to update it
    if (!post ) {
      return res.status(404).send("Post not found");
    }else if(post.utilisateur != userId){
      return res.status(404).send("unauthorized");
    }

    // Update the post fields based on user input
    if (status !== undefined) {
      post.status = status;
    }

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      const imageOriginalName = imageFile.originalname;
      const imageExt = imageOriginalName.split('.').pop(); // Get file extension
      const imageFilename = `uploads/images/${randomString}-${imageOriginalName}`; // Use the same random string for the filename
      post.image = imageFilename;
    }else {
      post.image = null; 
    }

    if (req.files && req.files["video"]) {
      const videoFile = req.files["video"][0];
      const videoOriginalName = videoFile.originalname;
      const videoExt = videoOriginalName.split('.').pop();
      const videoFilename = `uploads/videos/${randomString}-${videoOriginalName}`;
      post.video = videoFilename;
    }else {
      post.video = null; 
    }

    // Save the updated post
    const updatedPost = await post.save();

    res.send(updatedPost);
  } catch (err) {
    console.log("Update error: " + err);
    res.status(500).send("An error occurred while updating the post");
  }
};

export const deletePost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("ID unknown: " + req.params.id);

  try {
    const post = await PostModel.findById(req.params.id);

    // Check if the post exists
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const userId = res.locals.user.id; // Assuming you have user information in res.locals

    // Check if the connected user is the owner of the post
    if (post.utilisateur.toString() !== userId) {
      return res.status(401).send("Unauthorized: You are not the owner of this post");
    }

    // If the user is the owner, proceed with deleting the post
    const removedPost = await PostModel.findByIdAndRemove(req.params.id);

    // Remove the deleted post's ID from the user's publications array
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const postIndex = user.publications.indexOf(req.params.id);

    if (postIndex !== -1) {
      user.publications.splice(postIndex, 1); // Remove the post's ID from the array
      await user.save(); // Save the updated user document
    }

    res.send(removedPost);
  } catch (err) {
    console.log("Delete error : " + err);
    res.status(500).send("Internal Server Error");
  }
};

/*
export const likePost = async (req, res) => {
  const postId = req.params.id; // The post ID from the URL
  const likerId = res.locals.user.id; // Use likerId from the request body

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).send("Post ID unknown : " + postId);

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $addToSet: { Likers: likerId } }, // Use $addToSet to prevent duplicates
      { new: true }
    );

    console.log("Post updated:", updatedPost);

    await UserModel.findByIdAndUpdate(
      likerId,
      {
        $addToSet: { Likes: postId },
      },
      { new: true }
    );

    return res.send(updatedPost);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send(err);
  }
};

export const unlikePost = async (req, res) => {
  const postId = req.params.id; // Post ID from request params
  const userId = res.locals.user.id;   // Authenticated user's ID

  if (!mongoose.isValidObjectId(postId))
    return res.status(400).send("Post ID unknown : " + postId);

  try {
    console.log("Updating post and user...");
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $pull: { Likers: userId }, // Pull authenticated user's ID from likers array
      },
      { new: true }
    );

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: { Likes: postId }, // Pull post ID from authenticated user's likes array
      },
      { new: true }
    );

    return res.send(updatedPost);
  } catch (err) {
    console.error("Error in try-catch:", err);
    return res.status(400).send(err);
  }
};

export const commentPost = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          Comments: {
            CommenterId: res.locals.user.id, // Use the authenticated user's ID
            CommenterPseudo: res.locals.user.Pseudo, // Use the authenticated user's pseudo
            Text: req.body.Text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );

    return res.send(updatedPost);
  } catch (err) {
    console.error("Error in commentPost:", err);
    return res.status(400).send(err);
  }
};

export const editCommentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.body.CommentId;
    const newText = req.body.Text;

    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId)) {
      return res.status(400).send('Invalid post or comment ID');
    }

    const updatedPost = await PostModel.findOneAndUpdate(
      {
        _id: postId,
        'Comments._id': commentId,
        'Comments.CommenterId': res.locals.user.id, // Ensure the comment owner matches the authenticated user
      },
      { $set: { 'Comments.$.Text': newText } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).send('Post or comment not found, or unauthorized to edit');
    }

    return res.send(updatedPost);
  } catch (err) {
    console.error('Error in editCommentPost:', err);
    return res.status(500).send('Internal server error');
  }
};

export const deleteCommentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.body.CommentId;

    if (!mongoose.isValidObjectId(postId) || !mongoose.isValidObjectId(commentId))
      return res.status(400).send("Invalid post or comment ID");

    const post = await PostModel.findById(postId);

    if (!post)
      return res.status(404).send("Post not found");

    // Find the comment to be deleted
    const commentToDelete = post.Comments.find(comment => comment._id.toString() === commentId);

    if (!commentToDelete)
      return res.status(404).send("Comment not found");

    // Check if the authenticated user is the post owner or the comment owner
    if (post.identifiant !== res.locals.user.id && commentToDelete.CommenterId !== res.locals.user.id) {
      return res.status(403).send("Unauthorized to delete the comment");
    }

    // Update the post by removing the comment
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $pull: { Comments: { _id: commentId } } },
      { new: true }
    );

    return res.send(updatedPost);
  } catch (err) {
    console.error("Error in deleteCommentPost:", err);
    return res.status(400).send(err);
  }
};*/

export const createGroupPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = res.locals.user.id;
    const { status } = req.body;
    const randomString = req.randomString;
    // Check if the user is a member, admin, or superadmin of the group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (
      !group.membres.includes(userId) &&
      !group.administrateurs.includes(userId) &&
      group.superAdministrateur.toString() !== userId
    ) {
      return res.status(403).json({ error: 'You do not have permission to create a post in this group' });
    }

    // Determine the post's status based on group privacy setting
    let postStatus = "Pending"; // Default status for public groups
    if ( group.administrateurs.includes(userId) || group.superAdministrateur.toString() == userId) {
      postStatus = "Published"; // Pending status for private groups if user is not admin or superadmin
    }

    // Create a new post
    const newPost = new PostModel({
      identifiant: userId,
      status: status,
      etat: postStatus,
    });

    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      const imageOriginalName = imageFile.originalname;
      const imageExt = imageOriginalName.split('.').pop(); // Get file extension
      const imageFilename = `uploads/images/${randomString}-${imageOriginalName}`; // Use the same random string for the filename
      newPost.image = imageFilename;
    }

    // Check if a video is included in the request
    if (req.files && req.files["video"]) {
      const videoFile = req.files["video"][0];
      const videoOriginalName = videoFile.originalname;
      const videoExt = videoOriginalName.split('.').pop(); // Get file extension
      const videoFilename = `uploads/videos/${randomString}-${videoOriginalName}`; // Use the same random string for the filename
      newPost.video = videoFilename;
    }

    const savedPost = await newPost.save();

    // Store the post in the group's Posts attribute
    if (postStatus === "Pending") {
      console.log('Pushing to publication en attente:', savedPost._id);
      group.publicationEnAttente.push(savedPost._id);
    } else {
      console.log('Pushing to publication Publiée:', savedPost._id);
      group.publicationPublie.push(savedPost._id);
    }

    await group.save();

    console.log('Group after saving:', group);

    return res.status(201).json(savedPost);
  } catch (err) {
    console.error('Error creating group post:', err);
    return res.status(400).json({ error: 'Failed to create group post' });
  }
};

export const approvePendingPost = async (req, res) => {
  try {
    const { postId, groupId } = req.params;
    const userId = res.locals.user.id;

    console.log('userId:', userId);

    const group = await GroupModel.findById(groupId);

    console.log('group:', group);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is an admin or superadmin
    const isAdminOrSuperAdmin = group.administrateurs.includes(userId) || group.superAdministrateur.toString() === userId;
    if (!isAdminOrSuperAdmin) {
      return res.status(403).json({ error: 'You do not have permission to approve this post' });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Update the post's status to "Published"
    post.etat = "Published";
    const updatedPost = await post.save();

    // Remove the post ID from Pen_posts and add it to Pub_posts in the specific group
    const penIndex = group.publicationEnAttente.indexOf(postId);
    if (penIndex !== -1) {
      group.publicationEnAttente.splice(penIndex, 1);
      group.publicationPublie.push(postId);
      await group.save();
    }

    return res.status(200).json({ message: 'Post approved', updatedPost });
  } catch (err) {
    console.error('Error approving post:', err);
    return res.status(500).json({ error: 'Failed to approve post' });
  }
};

export const deleteGroupPost = async (req, res) => {
  try {
    const { postId,groupId } = req.params;
    const userId = res.locals.user.id;

    // Find the post to be deleted
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the owner of the post
    if (post.utilisateur === userId) {
      // User is the owner of the post, they can delete it
      await PostModel.findByIdAndDelete(postId);

      // Delete the post from the group's Pub_posts or Pen_posts
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      const postIndex = group.publicationPublie.indexOf(postId);
      if (postIndex !== -1) {
        group.publicationPublie.splice(postIndex, 1);
      } else {
        const penIndex = group.publicationEnAttente.indexOf(postId);
        if (penIndex !== -1) {
          group.publicationEnAttente.splice(penIndex, 1);
        }
      }

      await group.save();
      return res.status(200).json({ message: 'Post deleted' });
    } else {
      // User is not the owner of the post, check if they are an admin or superadmin
      const group = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      if (
        group.administrateurs.includes(userId) ||
        group.superAdministrateur.toString() === userId
      ) {
        // Admin or superadmin can delete the post
        await PostModel.findByIdAndDelete(postId);

        // Remove the post ID from Pub_posts or Pen_posts
        const postIndex = group.publicationPublie.indexOf(postId);
        if (postIndex !== -1) {
          group.publicationPublie.splice(postIndex, 1);
        } else {
          const penIndex = group.publicationEnAttente.indexOf(postId);
          if (penIndex !== -1) {
            group.publicationEnAttente.splice(penIndex, 1);
          }
        }

        await group.save();

        return res.status(200).json({ message: 'Post deleted' });
      } else {
        return res.status(403).json({ error: 'You do not have permission to delete this post' });
      }
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
};

export const getApprovedGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Find the group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Fetch all posts with "Published" status that belong to the group
    const approvedPosts = await PostModel.find({
      _id: { $in: group.publicationPublie },
      etat: 'Published',
    });

    return res.status(200).json(approvedPosts);
  } catch (err) {
    console.error('Error fetching approved group posts:', err);
    return res.status(500).json({ error: 'Failed to fetch approved group posts' });
  }
};

export const getPendingGroupPosts = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = res.locals.user.id;

    // Find the group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is a member, admin, or superadmin of the group
    if (
      !group.membres.includes(userId) &&
      !group.administrateurs.includes(userId) &&
      group.superAdministrateur.toString() !== userId
    ) {
      return res.status(403).json({ error: 'You do not have permission to access these posts' });
    }

    let pendingPosts = [];

    // If the user is an admin or superadmin, fetch all pending posts
    if (group.administrateurs.includes(userId) || group.superAdministrateur.toString() === userId) {
      pendingPosts = await PostModel.find({
        _id: { $in: group.publicationEnAttente},
        etat: 'Pending',
      });
    }
    // If the user is a member, fetch only their pending posts
    else if (group.membres.includes(userId)) {
      pendingPosts = await PostModel.find({
        _id: { $in: group.publicationEnAttente },
        Status: 'Pending',
        identifiant: userId,
      });
    }

    return res.status(200).json(pendingPosts);
  } catch (err) {
    console.error('Error fetching pending group posts:', err);
    return res.status(500).json({ error: 'Failed to fetch pending group posts' });
  }
};

export const getUserPostsAndFollowingPosts = async (req, res) => {
  try {
    const userId = res.locals.user.id; // The ID of the user whose posts and following posts you want to retrieve

    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all posts created by the user
    const userPosts = await PostModel.find({ utilisateur: userId });

    // Find all posts created by users that the current user is following
    const followingUsersPosts = await PostModel.find({ utilisateur: { $in: user.abonnements} });

    // Combine userPosts and followingUsersPosts into a single array
    const allPosts = [...userPosts, ...followingUsersPosts];

    return res.status(200).json(allPosts);
  } catch (err) {
    console.error('Error fetching user posts and following users posts:', err);
    return res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

/*module.exports.updatePost = async (req, res) => {
  try {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);

    const updatedRecord = {
      Message: req.body.Message,
    };

    if (req.files["Picture"]) {
      // Retrieve existing image paths from the post
      const existingImagePaths = await postModel.findById(req.params.id, 'Picture');

      // Store the paths of new images
      const newImagePaths = req.files["Picture"].map(file => file.path);

      // Combine existing and new image paths
      updatedRecord.Picture = [...existingImagePaths.Picture, ...newImagePaths];
    }

    if (req.files["Video"]) {
      updatedRecord.Video = req.files["Video"][0].path;
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
    );

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    console.log("Update error : " + err);
    res.status(500).send("An error occurred while updating the post");
  }
};*/




