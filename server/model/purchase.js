const mongoose = require('mongoose');
const { Schema } = mongoose;

// Declare the schema (how the slot purchase data will be stored)
const purchaseSchema = new Schema({
    item_id: {
        type: String,
        required: true
    },
    item_name: {
        type: String,
        required: true
    },
    item_price: {
        type: Number,
        required: true
    },
    buyer_name: {
        type: String,
        required: true
    },
    seller_name: {
        type: String,
        required: true
    },
    buyer_id: {
        type: String,
        required: true
    },
    seller_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Purchase = mongoose.model('purchase', purchaseSchema);
module.exports = Purchase;