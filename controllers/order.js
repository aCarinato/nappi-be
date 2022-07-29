import Order from '../models/Order.js';

// @desc    Create an order
// @route   POST /api/order/place-order
// @access  Private
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

// @desc    Retrieve an order
// @route   GET /api/order/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    // console.log('TE SENTO SIII');
    // console.log(req.params);
    const order = await Order.findById(req.params.id);
    res.status(201).json(order);
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};
