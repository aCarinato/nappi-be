import jwt from 'jsonwebtoken';
// import { expressjwt } from 'express-jwt';
import User from '../models/User.js';

export const requireSignin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log('token found');
    try {
      token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decodedToken._id).select('-password');
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).send('Authentication failed!');
    }
  }

  if (!token) {
    console.log('token NOT found');
    return res.status(401).send('Authentication failed. Token NOT found');
  }
};
