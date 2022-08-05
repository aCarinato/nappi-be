import User from '../models/User.js';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Pass stripe secret key to the frontend
// @route   POST /api/order/place-order
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    // KALORAAT

    // 1) find current user
    // const user = await User.findById(req.user._id);

    // 2) get user cart total
    let totalPrice;
    totalPrice = req.body.totalPrice;
    // console.log(typeof totalPrice);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: 'usd',
    });
    // console.log(paymentIntent.client_secret);
    if (paymentIntent.client_secret) {
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    }

    // // JS MASTERY
    // const params = {
    //   submit_type: 'pay',
    //   mode: 'payment',
    //   payment_method_types: ['card'],
    //   billing_address_collection: 'auto',
    //   shipping_options: [
    //     // { shipping_rate: 'shr_1Kn3IaEnylLNWUqj5rqhg9oV' },
    //   ],
    //   line_items: req.body.map((item) => {
    //     const img = item.image[0].asset._ref;
    //     const newImage = img
    //       .replace(
    //         'image-',
    //         'https://cdn.sanity.io/images/vfxfwnaw/production/'
    //       )
    //       .replace('-webp', '.webp');

    //     return {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: item.name,
    //           images: [newImage],
    //         },
    //         unit_amount: item.price * 100,
    //       },
    //       adjustable_quantity: {
    //         enabled: true,
    //         minimum: 1,
    //       },
    //       quantity: item.quantity,
    //     };
    //   }),
    //   // success_url: `${req.headers.origin}/success`,
    //   // cancel_url: `${req.headers.origin}/canceled`,
    // };

    // // Create Checkout Sessions from body params.
    // const session = await stripe.checkout.sessions.create(params);
    // res.status(200).json(session);
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};
