import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Signup new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // console.log(req.body);

  // res.json({ message: 'Dei dessoooo' });

  if (!username) {
    return res.json({
      error: 'Nome utente non inserito',
    });
  }

  if (!password || password.length < 6) {
    return res.json({
      error: 'Password di almeno 6 caratteri',
    });
  }

  //   if (!secret) {
  //     return res.json({
  //       error: 'Segreto non inserito',
  //     });
  //   }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    res.status(500).json(err);
  }

  if (existingUser) {
    return res.json({
      error: 'Utente giá registrato con questa email',
    });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    res.status(500).json(err);
  }

  const createdUser = new User({
    username,
    email,
    // secret,
    password: hashedPassword,
  });

  try {
    const newUser = await createdUser.save();

    let token;
    token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      username: newUser.username,
      userId: newUser._id,
      email: newUser.email,
      preferences: newUser.preferences,
      token: token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
