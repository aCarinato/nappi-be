import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const currentUserIsAdmin = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id);
    // res.json(user);
    if (user.isAdmin) {
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    Summary of ecommerce performance
// @route   GET /api/admin/summary
// @access  Private
export const getSummary = async (req, res) => {
  try {
    // console.log('dei vanti');
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();

    const ordersPriceGroup = await Order.aggregate([
      //   {
      //     $match: { isPaid: true },
      //   },
      {
        $group: {
          _id: null,
          sales: { $sum: '$totalPrice' },
        },
      },
    ]);

    let ordersPrice;
    if (ordersPriceGroup.length > 0) {
      ordersPrice = ordersPriceGroup[0].sales;
    } else {
      ordersPrice = 0;
    }

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    // console.log(salesData);

    res
      .status(201)
      .json({ ordersPrice, ordersCount, usersCount, productsCount, salesData });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    List all orders
// @route   GET /api/admin/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'username');
    res.status(201).json(orders);
  } catch (err) {
    res.sendStatus(400);
  }
};

// @desc    Deliver an order
// @route   PUT /api/admin/orders/${id}/deliver
// @access  Private / Public
export const deliverOrder = async (req, res) => {
  try {
    console.log('te sento');
    const id = req.params.id;
    const order = await Order.findById(id);

    if (order) {
      if (!order.isDelivered) {
        console.log('order not delivered');
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const deliveredOrder = await order.save();
        res.json({
          message: 'order delivered successfully',
          // order: deliveredOrder,
        });
      }

      // if (order.isDelivered) {
      //   return res.json({ message: 'Error: order is already delivered' });
      // }
    } else {
      res.json({ message: 'Error: order not found' });
    }
    // console.log(id);
  } catch (err) {
    res.sendStatus(400);
  }
};
