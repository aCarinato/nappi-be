import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Get the current user to protect routes
// @route   GET /api/auth/current-user
// @access  Private
export const currentUser = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    Get the current ADMIN to protect routes
// @route   POST /api/auth/current-admin
// @access  Private
export const currentAdmin = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id);
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    Get current logged-in user
// @route   POST /api/auth/:email
// @access  Private
export const getUser = async (req, res) => {
  // console.log('DAIIII');
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      '-password'
    );
    // console.log(user);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  // console.log(req.body);

  // res.json({ message: 'Grintaaa' });
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
    // res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json(err);
  }

  if (!existingUser) {
    return res.json({
      error: 'Utente non trovato. Controllare email.',
    });
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    res.status(500).json(err);
  }

  if (!isValidPassword) {
    return res.json({
      error: 'Password errata',
    });
  }

  let token;
  // ////////////////////////////////
  // MAX SIGNS THE TOKEN WITH _id AND EMAIL, KALORAAT ONLY WITH _id
  token = jwt.sign(
    { _id: existingUser._id, email: existingUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    username: existingUser.username,
    userId: existingUser._id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    token: token,
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    // console.log(req.body);

    const { username, email, password } = req.body;

    // // if (!name || !email || !email.includes('@') || (password && password.trim().length < 6))

    const user = await User.findById(req.user._id);

    user.username = username;
    user.email = email;

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      res.status(500).json(err);
    }

    user.password = hashedPassword;

    await user.save();

    res.status(201).json({ message: 'User successfully updated' });
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};
