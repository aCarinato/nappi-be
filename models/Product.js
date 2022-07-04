import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    nameIT: {
      type: String,
      required: true,
      // unique: true,
    },
    nameEN: {
      type: String,
      required: true,
      // unique: true,
    },
    nameDE: {
      type: String,
      required: true,
      // unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    categoryIT: {
      type: String,
      required: true,
    },
    categoryEN: {
      type: String,
      required: true,
    },
    categoryDE: {
      type: String,
      required: true,
    },
    descriptionIT: {
      type: String,
      required: true,
    },
    descriptionEN: {
      type: String,
      required: true,
    },
    descriptionDE: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
