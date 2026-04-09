const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    if (!username || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      mobile,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide credentials' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, mobile, newPassword } = req.body;

    if (!email || !mobile || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email, mobile });
    if (!user) {
      return res.status(404).json({ message: 'Identity verification failed. Information does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ valid: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { aesthetic_style, mood_feel, budget, project } = req.body;
    const userId = req.user.userId || req.user._id;

    // Validate enum values
    const validAestheticStyles = ['Minimalistic', 'Modern', 'Industrial', 'Maximalistic', 'Traditional', 'Vintage / Art Deco', 'Cottagecore'];
    const validMoodFeels = ['Cosy & Inviting', 'Sleek & Modern', 'Serene & Calm', 'Rustic & Warm', 'Luxurious & Opulent', 'Natural & Organic'];
    const validBudgets = ['Budget', 'Standard', 'Premium', 'Luxury'];

    if (aesthetic_style && !validAestheticStyles.includes(aesthetic_style)) {
      return res.status(400).json({ message: 'Invalid aesthetic style' });
    }
    if (mood_feel && !validMoodFeels.includes(mood_feel)) {
      return res.status(400).json({ message: 'Invalid mood feel' });
    }
    if (budget && !validBudgets.includes(budget)) {
      return res.status(400).json({ message: 'Invalid budget' });
    }

    const updateData = {};
    if (aesthetic_style !== undefined) updateData.aesthetic_style = aesthetic_style;
    if (mood_feel !== undefined) updateData.mood_feel = mood_feel;
    if (budget !== undefined) updateData.budget = budget;
    if (project !== undefined) updateData.project = project;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        aesthetic_style: updatedUser.aesthetic_style,
        mood_feel: updatedUser.mood_feel,
        budget: updatedUser.budget,
        project: updatedUser.project
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
