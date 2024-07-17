const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/:userId', friendController.getFriendList);
router.post('/add', friendController.addFriend);
router.post('/remove', friendController.removeFriend);

module.exports = router;
