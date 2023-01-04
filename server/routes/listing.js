const express = require("express");
const router = express.Router();

const Product = require('../model/products');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Create a listing of product with endpoint (POST : '/listing/create').
router.post("/create", fetchUser, async (req, res) => {
    let { name, price, seller_name, user_id } = req.body;

    try {

        if (!name || !price || !user_id)
            return res.status(400).json({
                type: "error",
                message: "Please fill the required details."
            });

        const listing = await Product.create({
            name,
            price,
            seller_name,
            user_id,
        });

        if (listing)
            return res.status(200).json({
                type: "success",
                message: "Product listed successfully."
            });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 2 - Get all listing details with endpoint (POST : '/listing/all')
router.post('/all', fetchUser, async (req, res) => {
    try {
        const listings = await Product.find();
        if (listings.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No products found.",
                data: []
            });

        res.status(200).json({
            type: "success",
            message: "List of products fetched successfully.",
            data: listings
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get the product details from ID with endpoint (POST : '/listing/:id')
router.post('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });
        }

        const listing = await Product.findById(req.params.id);
        if (!listing)
            return res.status(404).json({
                type: "error",
                message: "Listing not found."
            });

        res.status(200).json({
            type: "success",
            message: "Product details fetched successfully.",
            data: listing
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Update the product details with endpoint (PUT : '/listing/:id')
router.put('/:id', fetchUser, async (req, res) => {
    try {
        let { name, price, user_id, seller_name, status } = req.body;

        if (req.user.role !== "admin" && req.user.id !== user_id)
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        // if (!name || !price || !seller_name || !status)
        //     return res.status(400).json({
        //         type: "error",
        //         message: "Please fill the required details."
        //     });

        const existingListing = await Product.findById(req.params.id);
        if (!existingListing)
            return res.status(404).json({
                type: "error",
                message: "Product not found."
            });

        await Product.findByIdAndUpdate(req.params.id, {
            name: name || existingListing.name,
            price: price || existingListing.price,
            user_id: user_id || existingListing.user_id,
            seller_name: seller_name || existingListing.seller_name,
            status: status || existingListing.status,
        }, { new: true });

        res.status(200).json({
            type: "success",
            message: "Product details updated successfully."
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Delete the user details with endpoint (DELETE : '/band/:id')
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const listing = await Product.findById(req.params.id);
        if (!listing)
            return res.status(404).json({
                type: "error",
                message: "Listing not found."
            });

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            type: "success",
            message: "Listing deleted successfully."
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