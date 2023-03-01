const User = require("../models/userModal");

exports.resetWeeklyGoals = async () => {
  const users = await User.find({});

  users.forEach(async (user) => {
    const weeklyGoal = user.weeklyGoal;

    await User.findByIdAndUpdate(
      user._id,
      { weeklyGoalRemaining: weeklyGoal, weeklySessionTime: 0 },
      { new: true }
    );
  });
};
