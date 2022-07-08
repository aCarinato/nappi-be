import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
    // res.json({ message: 'Hello from the server!' });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    }
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
    // res.json({ message: 'Product not found' });
  }
};

// @desc    Fetch single product based on the slug
// @route   GET /api/products/slug/:slugEN
// @access  Public
export const getProductBySlugEN = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slugEN: req.params.slugEN });
    if (product) {
      res.json(product);
    }
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};

// @desc    Fetch single product based on the slug
// @route   GET /api/products/slug/:slugIT
// @access  Public
export const getProductBySlugIT = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slugIT: req.params.slugIT });
    if (product) {
      res.json(product);
    }
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};

// @desc    Fetch single product based on the slug
// @route   GET /api/products/slug/:slugDE
// @access  Public
export const getProductBySlugDE = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slugDE: req.params.slugDE });
    if (product) {
      res.json(product);
    }
  } catch (err) {
    res.status(404); // if no specific status is set, by default it would fall back to 500
    return next(err); // this error is passed to the middleware that handles the error
  }
};
