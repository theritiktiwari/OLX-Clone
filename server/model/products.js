const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the product data will be stored)
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    seller_name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "unsold"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('product', productSchema);
module.exports = Product;