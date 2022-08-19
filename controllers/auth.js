import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

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

  // GENERATE TOKEN WITH USER, EMAIL AND PASSWORD

  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(password, 12);
  // } catch (err) {
  //   res.status(500).json(err);
  // }

  let token;
  token = jwt.sign(
    { username, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    {
      expiresIn: '7d',
    }
  );

  // const createdUser = new User({
  //   username,
  //   email,
  //   password: hashedPassword,
  // });

  // SEND EMAIL
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html>
          <h1>Hello ${username}</h1>
          <p>Please verify your email address through thil link:</p>
          <a href='${process.env.CLIENT_URL}/login/activate/${token}'>Link</a>
          <p>${process.env.CLIENT_URL}/login/activate/${token}</p>
          </html>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `DEI DESSOOOOO`,
      },
    },
  };

  const sendEmailOnRegister = ses.sendEmail(params).promise();
  sendEmailOnRegister
    // .then((data) => console.log('email submitted to ses', data))
    .then((data) => res.status(200).json({ success: true }))
    .catch((error) => console.log('ERRONE', error));

  res.status(200).json({ success: true });
  // res.status(200).json({ success: true }
  // try {
  //   const newUser = await createdUser.save();

  //   let token;
  //   token = jwt.sign(
  //     { _id: newUser._id, email: newUser.email },
  //     process.env.JWT_SECRET,
  //     { expiresIn: '7d' }
  //   );

  //   res.status(201).json({
  //     username: newUser.username,
  //     userId: newUser._id,
  //     email: newUser.email,
  //     preferences: newUser.preferences,
  //     token: token,
  //   });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
};

// @desc    Activate user account
// @route   POST /api/auth/signup/activate
// @access  Public
export const activateAccount = async (req, res) => {
  const token = req.body.token;
  // console.log(req.body.token);
  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    async function (err, decoded) {
      if (err) {
        return res.status(401).json({ error: err });
      }

      const { username, email, password } = jwt.decode(token);

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 12);
      } catch (err) {
        res.status(500).json(err);
      }

      const createdUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const newUser = await createdUser.save();

      res.status(200).json({
        success: true,
        newUser: {
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          token: token,
        },
      });
    }
  );
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
