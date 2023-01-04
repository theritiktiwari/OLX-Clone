const mongoose = require('mongoose');

// Connect to the database
const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URI, (err) => {
        if (err)
            return console.log(err);

        console.log("Connected to the database");
    });
}

module.exports = connectDB;