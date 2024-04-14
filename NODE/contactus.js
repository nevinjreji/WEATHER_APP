const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/paymentDB',
    ).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Define a schema for the contact form data
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    message: String
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// Route for handling form submission
// Route for handling form submission
app.post('/submit', (req, res) => {
    // Create a new instance of Contact model with the data from the form
    const newContact = new Contact({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        message: req.body.message
    });

    // Save the new contact to the database
    newContact.save()
        .then(() => {
            console.log('Contact saved successfully');
            // Send response with script to trigger modal popup
            res.send('<script>alert("Contact form submitted successfully!"); window.location.href = "/";</script>');
        })
        .catch((err) => {
            console.error('Error saving contact:', err);
            res.status(500).send('Error submitting contact form');
        });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
