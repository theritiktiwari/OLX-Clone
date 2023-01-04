const express = require("express");
const router = express.Router();

const Purchase = require('../model/purchase');
const Product = require('../model/products');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Craete a purchase with endpoint (POST : '/purchase/create').
router.post("/create", fetchUser, async (req, res) => {
    // Get the data from the body
    let { item_id, buyer_id, buyer_name } = req.body;
    try {
        // Check if all the details are provided
        if (!item_id && !buyer_id && !buyer_name)
            return res.status(400).json({
                type: "error",
                message: "Please fill the required details."
            });

            console.log(item_id, buyer_id, buyer_name);

        // Check if the product is sold or not
        const listing = await Product.findOne({ _id: item_id });
        console.log(listing);
        if (listing.status === "sold")
            return res.status(400).json({
                type: "error",
                message: "Product already sold."
            });

        // Creating a new purchase
        const purchase = await Purchase.create({
            item_id,
            item_name: listing.name,
            item_price: listing.price,
            buyer_name,
            seller_name: listing.seller_name,
            buyer_id,
            seller_id: listing.user_id
        });

        // Update the product status
        const product = await Product.updateOne({ _id: item_id }, { status: "sold" });

        // Send the response
        if (purchase && product)
            return res.status(200).json({
                type: "success",
                message: "You purchased the product successfully."
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 2 - Get all purchase details with endpoint (POST : '/purchase/all')
router.post('/all', fetchUser, async (req, res) => {
    try {
        // Get the purchases 
        let purchase;
        if (req.user.role !== "admin") {
            purchase = await Purchase.find({ user_id: req.user.id });
        } else {
            purchase = await Purchase.find();
        }

        if (purchase.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No transaction found.",
                data: []
            });

        // Send the response data
        res.status(200).json({
            type: "success",
            message: "Transaction details fetched successfully.",
            data: purchase
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get the purchase details from ID with endpoint (POST : '/purchase/:id')
router.post('/:id', fetchUser, async (req, res) => {
    try {
        // Only show their own booking details (for users)
        if (req.user.role !== "admin") {
            const purchase = await Purchase.findOne({ _id: req.params.id, buyer_id: req.user.id });
            if (!purchase)
                return res.status(401).json({
                    type: "error",
                    message: "You are not authorized to perform this action."
                });
        }

        // Get the purchase details
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase)
            return res.status(404).json({
                type: "error",
                message: "Transaction details not found."
            });

        // Send the response data
        res.status(200).json({
            type: "success",
            message: "Transaction details fetched successfully.",
            data: purchase
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Delete the purchase details with endpoint (DELETE : '/purchase/delete')
router.delete('/delete', fetchUser, async (req, res) => {
    try {
        // Not allowed for users
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        // Get the ID of the booking to be deleted from the body
        const { ids } = req.body;
        if (ids.length === 0)
            return res.status(400).json({
                type: "error",
                message: "Please select the bookings to delete."
            });

        // Delete the bookings
        const purchase = await Purchase.deleteMany({ _id: { $in: ids } });
        if (!purchase)
            return res.status(404).json({
                type: "error",
                message: "Transaction details not deleted."
            });

        res.status(200).json({
            type: "success",
            message: "Transactions deleted successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }

});

// ROUTE 5 - Delete the purchase details with ID with endpoint (DELETE : '/purchase/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        // Not allowed for users
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        // Delete the booking with the given ID
        const purchase = await Purchase.findByIdAndDelete(req.params.id);
        if (!purchase)
            return res.status(404).json({
                type: "error",
                message: "Transaction not found."
            });

        res.status(200).json({
            type: "success",
            message: "Transaction deleted successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;