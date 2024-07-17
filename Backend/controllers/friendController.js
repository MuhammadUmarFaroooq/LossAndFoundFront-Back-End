const User = require('../modals/users');

// Get friend list
const getFriendList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add friend
const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found' });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove friend
const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or Friend not found' });
    }

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFriendList,
  addFriend,
  removeFriend
};
