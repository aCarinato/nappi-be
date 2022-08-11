import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
