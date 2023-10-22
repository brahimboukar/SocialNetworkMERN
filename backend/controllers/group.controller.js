import GroupModel from "../models/group.model.js";
import UserModel from "../models/user.model.js";

export const createGroup = async (req, res) => {
  try {
    const { nom, description, estPrive } = req.body;
    const SAId = res.locals.user.id; // Get the authenticated user's ID
    const newGroup = new GroupModel({
      nom,
      description,
      superAdministrateur: SAId, // Use the authenticated user's ID as the admin
      estPrive, // Set the group as public by default
    });

    const savedGroup = await newGroup.save();

    return res.status(201).json(savedGroup);
  } catch (err) {
    console.error('Error creating group:', err);
    return res.status(400).json({ error: 'Failed to create group' });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { nom, description, estPrive } = req.body;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user making the request is the superadmin of the group
    const adminUserId = res.locals.user.id;
    if (group.superAdministrateur.toString() !== adminUserId) {
      return res.status(403).json({ error: 'You do not have permission to update this group' });
    }

    // Update fields if provided
    if (nom) {
      group.nom = nom;
    }
    if (description) {
      group.description = description;
    }
    if (typeof estPrive === 'boolean') {
      group.estPrive = estPrive;
    }

    const updatedGroup = await group.save();

    return res.status(200).json(updatedGroup);
  } catch (err) {
    console.error('Error updating group:', err);
    return res.status(400).json({ error: 'Failed to update group' });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = res.locals.user.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is the admin of the group
    if (group.superAdministrateur.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this group' });
    }

    // Delete the group
    await GroupModel.deleteOne({ _id: groupId });

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Error deleting group:', err);
    return res.status(500).json({ error: 'Failed to delete group' });
  }
};

export const joinRequest = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = res.locals.user.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is the super admin
    if (group.superAdministrateur.toString() === userId) {
      return res.status(400).json({ error: 'You are the super admin of this group' });
    }

    // Check if the user is already in joinRequests or members
    if (group.demandeDeRejoindre.includes(userId)) {
      return res.status(400).json({ error: 'You have already requested to join ' });
    }
    if (group.membres.includes(userId)) {
      return res.status(400).json({ error: 'You are already a member of this group' });
    }
    if (group.administrateurs.includes(userId)) {
      return res.status(400).json({ error: 'You are already an admin of this group' });
    }
    // Check if the group is private
    if (group.estPrive) {
      // Add the user to the join requests array
      group.demandeDeRejoindre.push(userId);

      // Save the group with the updated join requests
      await group.save();

      return res.status(200).json({ message: 'Join request sent' });
    } else {
      // For public groups, directly add the user to members
      group.membres.push(userId);
      await group.save();

      return res.status(200).json({ message: 'Joined the group' });
    }
  } catch (err) {
    console.error('Error joining group:', err);
    return res.status(500).json({ error: 'Failed to join group' });
  }
};

export const acceptJoinRequest = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user making the request is the super admin or an admin
    const superAdminId = group.superAdministrateur.toString();
    const requestingUserId = res.locals.user.id.toString();

    if (requestingUserId !== superAdminId && !group.administrateurs.includes(requestingUserId)) {
      return res.status(403).json({ error: 'Only the super admin and admins can accept join requests' });
    }

    // Check if the userId is in the JoinRequests array
    const joinRequestIndex = group.demandeDeRejoindre.indexOf(userId);

    if (joinRequestIndex === -1) {
      return res.status(400).json({ error: 'User not found in join requests' });
    }

    // Remove the userId from JoinRequests array
    group.demandeDeRejoindre.splice(joinRequestIndex, 1);

    // Add userId to Members array
    group.membres.push(userId);

    const updatedGroup = await group.save();

    return res.status(200).json({ message: 'Join request accepted', updatedGroup });
  } catch (err) {
    console.error('Error accepting join request:', err);
    return res.status(500).json({ error: 'Failed to accept join request' });
  }
};

export const selectAdmins = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminIds } = req.body;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const validAdminIds = [];
    const invalidAdminIds = [];
    const alreadyAddedAdminIds = [];

    for (const id of adminIds) {
      if (group.membres.includes(id)) {
        if (!group.administrateurs.includes(id) && !validAdminIds.includes(id)) {
          validAdminIds.push(id);

          // Remove the user from the Members list
          const memberIndex = group.membres.indexOf(id);
          if (memberIndex !== -1) {
            group.membres.splice(memberIndex, 1);
          }
        } else if (group.administrateurs.includes(id)) {
          alreadyAddedAdminIds.push(id);
        }
      } else {
        invalidAdminIds.push(id);
      }
    }

    group.administrateurs = [...group.administrateurs, ...validAdminIds];
    const updatedGroup = await group.save();

    let responseMessage = '';
    if (invalidAdminIds.length > 0) {
      responseMessage += ` The following admin IDs are not valid members of the group: ${invalidAdminIds.join(', ')}.`;
    }
    if (validAdminIds.length > 0) {
      responseMessage += ` The following admin IDs were added: ${validAdminIds.join(', ')}.`;
    }
    if (alreadyAddedAdminIds.length > 0) {
      responseMessage += ` The following admin IDs were already added previously: ${alreadyAddedAdminIds.join(', ')}.`;
    }

    return res.status(200).json({ message: responseMessage, updatedGroup });
  } catch (err) {
    console.error('Error selecting admins:', err);
    return res.status(400).json({ error: 'Failed to select admins' });
  }
};

export const removeAdmins = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminIds } = req.body;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const superAdminId = group.superAdministrateur.toString();
    const requestingUserId = res.locals.user.id.toString();

    if (requestingUserId !== superAdminId) {
      return res.status(403).json({ error: 'Only the super admin can remove admins' });
    }

    const validAdminIds = [];
    const invalidAdminIds = [];

    for (const id of adminIds) {
      if (id === superAdminId) {
        invalidAdminIds.push(id);
      } else if (group.administrateurs.includes(id)) {
        validAdminIds.push(id);
      } else {
        invalidAdminIds.push(id);
      }
    }

    // Remove valid admin IDs from Admins list and add them to Members list
    for (const id of validAdminIds) {
      const index = group.administrateurs.indexOf(id);
      group.administrateurs.splice(index, 1);
      group.membres.push(id);
    }

    const updatedGroup = await group.save();

    let responseMessage = '';
    if (validAdminIds.length > 0) {
      responseMessage += ` The following admin IDs were removed from the admin list and added to the Members list: ${validAdminIds.join(', ')}.`;
    }
    if (invalidAdminIds.length > 0) {
      responseMessage += ` The following admin IDs are not valid admins of the group: ${invalidAdminIds.join(', ')}.`;
    }

    return res.status(200).json({ message: responseMessage, updatedGroup });
  } catch (err) {
    console.error('Error removing admins:', err);
    return res.status(400).json({ error: 'Failed to remove admins' });
  }
};

export const removeMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const superAdministrateurId = group.superAdministrateur.toString();
    const requestingUserId = res.locals.user.id.toString();

    if (requestingUserId !== superAdministrateurId && !group.administrateurs.includes(requestingUserId)) {
      return res.status(403).json({ error: 'Only the super admin and admins can remove members' });
    }

    const validMemberIds = [];
    const invalidMemberIds = [];

    for (const id of memberIds) {
      if (id === superAdministrateurId) {
        invalidMemberIds.push(id);
      } else if (group.membres.includes(id)) {
        validMemberIds.push(id);
      } else {
        invalidMemberIds.push(id);
      }
    }

    // Remove valid member IDs from Members list
    for (const id of validMemberIds) {
      const memberIndex = group.membres.indexOf(id);
      if (memberIndex !== -1) {
        group.membres.splice(memberIndex, 1);
      }
    }

    const updatedGroup = await group.save();

    let responseMessage = '';
    if (validMemberIds.length > 0) {
      responseMessage += ` The following member IDs were removed from the member list  ${validMemberIds.join(', ')}.`;
    }
    if (invalidMemberIds.length > 0) {
      responseMessage += ` The following member IDs are not valid members of the group: ${invalidMemberIds.join(', ')}.`;
    }

    return res.status(200).json({ message: responseMessage, updatedGroup });
  } catch (err) {
    console.error('Error removing members:', err);
    return res.status(400).json({ error: 'Failed to remove members' });
  }
};

export const getAllMembersAndAdmins = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const userId = res.locals.user.id;

    // Check if the user is a member, admin, or super admin
    if (
      group.membres.includes(userId) ||
      group.administrateurs.includes(userId) ||
      group.superAdministrateur.toString() === userId
    ) {
      // Fetch detailed user information for members, admins, and superadmin
      const membres = await UserModel.find({ _id: { $in: group.membres } });
      const administrateurs = await UserModel.find({ _id: { $in: group.administrateurs } });
      const superAdministrateur = await UserModel.findById(group.superAdministrateur);

      return res.status(200).json({ membres, administrateurs, superAdministrateur });
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }
  } catch (err) {
    console.error('Error getting members and admins:', err);
    return res.status(500).json({ error: 'Failed to get members and admins' });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = res.locals.user.id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if the user is a member or admin of the group
    if (!group.membres.includes(userId) && !group.administrateurs.includes(userId)) {
      return res.status(403).json({ error: 'You are not a member or admin of this group' });
    }

    // Remove the user from Members and Admins lists if present
    if (group.membres.includes(userId)) {
      const memberIndex = group.membres.indexOf(userId);
      group.membres.splice(memberIndex, 1);
    }
    if (group.administrateurs.includes(userId)) {
      const adminIndex = group.administrateurs.indexOf(userId);
      group.administrateurs.splice(adminIndex, 1);
    }

    const updatedGroup = await group.save();

    return res.status(200).json({ message: 'You have left the group', updatedGroup });
  } catch (err) {
    console.error('Error leaving group:', err);
    return res.status(500).json({ error: 'Failed to leave group' });
  }
};

export const getdata = async (req, res) => {
  try {
    const groups = await GroupModel.find();

    return res.status(200).json(groups);
  } catch (err) {
    console.error('Error getting all groups:', err);
    return res.status(500).json({ error: 'Failed to get all groups' });
  }
};

export const inviteUserToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const invitingUserId = res.locals.user.id;

    // Check if the inviting user is a member of the group
    if (
      !group.membres.includes(invitingUserId) &&
      !group.administrateurs.includes(invitingUserId) &&
      group.superAdministrateur.toString() !== invitingUserId
    ){
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Check if the user to be invited is already following the inviting user
    const invitingUser = await UserModel.findById(invitingUserId); // Assuming UserModel exists
    if (!invitingUser.abonnés.includes(userId)) {
      return res.status(400).json({ error: 'User is not following you' });
    }

    // Check if the user has already been invited
    const existingInvitation = group.invitations.find(
      (invitation) => invitation.userId.toString() === userId
    );

    if (existingInvitation) {
      return res.status(400).json({ error: 'User has already been invited to this group' });
    }

    // Add the user to the invitations list
    group.invitations.push({ userId, status: 'pending' });
    await group.save();

    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (err) {
    console.error('Error sending invitation:', err);
    return res.status(500).json({ error: 'Failed to send invitation' });
  }
};

/*module.exports.createPost = async (req, res) => {
  try {
    // Extract relevant data from the request
    const { PosterId, Message, Picture, Video } = req.body;
    const groupId = req.params.groupId;
    
    // Check if the group exists
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if the user is a member, admin, or super admin of the group
    const userId = res.locals.user.id;
    if (!group.Members.includes(userId) && !group.Admins.includes(userId) && group.SuperAdmin.toString() !== userId) {
      return res.status(403).json({ error: "You do not have permission to post in this group" });
    }

    // Determine the post status based on group privacy and user role
    let postStatus = "Published"; // Default status
    if (group.IsPrivate && group.Members.includes(userId) && !group.Admins.includes(userId) && group.SuperAdmin.toString() !== userId) {
      postStatus = "Pending"; // Pending status for private groups if user is a member
    }

    // Create a new post
    const newPost = new PostModel({
      PosterId: userId, // Use the connected user's ID as the PosterId
      Message,
      Picture,
      Video,
      PostStatus: postStatus, // Set the determined post status
      GroupId: groupId, // Set the group ID for reference
    });

    const savedPost = await newPost.save();

    return res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(400).json({ error: "Failed to create post" });
  }
};*/

/*module.exports.getGroupsForUser = async (req, res) => {
  try {
    const userId = res.locals.user.id;

    // Find groups where the user is a member, admin, or super admin
    const groups = await GroupModel.find({
      $or: [
        { Members: userId },
        { Admins: userId },
        { SuperAdmin: userId },
      ],
    });

    return res.status(200).json(groups);
  } catch (err) {
    console.error('Error getting groups for user:', err);
    return res.status(500).json({ error: 'Failed to get groups for user' });
  }
};*/
// ...

// Other group-related controller actions...
