import express from 'express';
import * as groupController from '../controllers/group.controller.js';
import { checkUser, requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/get-all-info/:id', groupController.getdata);
router.post('/create', checkUser, groupController.createGroup);
router.patch('/update/:groupId', checkUser, groupController.updateGroup);
router.delete('/delete/:groupId', checkUser, groupController.deleteGroup);
router.patch('/rejoindre/:groupId', checkUser, groupController.joinRequest);
router.patch('/accept-join-request/:groupId/:userId', checkUser, groupController.acceptJoinRequest);
router.patch('/select-admins/:groupId', checkUser, groupController.selectAdmins);
router.patch('/remove-admins/:groupId', checkUser, groupController.removeAdmins);
router.patch('/remove-members/:groupId', checkUser, groupController.removeMembers);
router.get('/get-all-members-admins/:groupId', checkUser, groupController.getAllMembersAndAdmins);
router.patch('/leave-group/:groupId', checkUser, groupController.leaveGroup);
router.get('/get-all-groups',  groupController.getdata);
router.patch('/:groupId/invite/:userId', checkUser,groupController.inviteUserToGroup);


export default router;
