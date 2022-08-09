import Order from '../models/Order.js';

// @desc    Create an order
// @route   POST /api/order/place-order
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.user);
    const newOrder = new Order({ ...req.body, user: req.user._id });
    const order = await newOrder.save();
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
    // console.log(req.params);
    const order = await Order.findById(req.params.id);
    res.status(201).json(order);
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};

// export const getAccazzo = async (req, res) => {
//   try {
//     res.status(201).json({ message: 'accazzo' });
//   } catch (err) {
//     res.status(404); // if no specific status is set, by default it would fall back to 500
//     return next(err);
//   }
// };

// @desc    Retrieve order history
// @route   GET /api/order/order-history
// @access  Private
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }); //user: req.user._id
    res.status(201).json(orders);
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err);
  }
};

// @desc    Pay an order
// @route   PUT /api/order/:id/pay
// @access  Private
export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.isPaid) {
        return res.json({ message: 'Error: order is already paid' });
      }
      order.isPaid = true;
      order.paidAt = Date.now();

      const paidOrder = await order.save();
      res.json({ message: 'order paid successfully', order: paidOrder });
    } else {
      res.json({ message: 'Error: order not found' });
    }
  } catch (err) {
    res.status(404);
    return next(err);
  }
};

// @desc    Pay an order
// @route   PUT /api/order/:id/pay
// @access  Private
// export const payOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (order) {
//       if (order.isPaid) {
//         return res.json({ message: 'Error: order is already paid' });
//       }
//       order.isPaid = true;
//       order.paidAt = Date.now();
//       // the following are data provided by paypal
//       order.paymentResult = {
//         id: req.body.id,
//         status: req.body.status,
//         email_address: req.body.email_address,
//       };
//       const paidOrder = await order.save();
//       res.json({ message: 'order paid successfully', order: paidOrder });
//     } else {
//       res.json({ message: 'Error: order not found' });
//     }
//   } catch (err) {
//     res.status(404); // if no specific status is set, by default it would fall back to 500
//     return next(err); // this error is passed to the middleware that handles the error
//   }
// };
