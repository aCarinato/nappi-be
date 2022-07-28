import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
  try {
    // console.log('TE SENTO SI');
    // console.log(req.body);
    // console.log(req.user);
    const newOrder = new Order({ ...req.body, user: req.user._id });
    // console.log(newOrder);
    const order = await newOrder.save();
    // console.log(newOrder);
    res.status(201).json(order);
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};
