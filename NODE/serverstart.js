const express = require('express');
const path = require('path');
const mongoose = require('mongoose'); 
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/paymentDB')
    .then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define UTR schema and model
const utrSchema = new mongoose.Schema({
    utrNumber : String
});
const UTR = mongoose.model('UTR', utrSchema);

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'FRONTEND' directory
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// Route for redirecting to pricing.html
app.get('/pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/pricing.html'));
});

// Route for redirecting to aboutus.html
app.get('/aboutus', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/aboutus.html'));
});

// Route for redirecting to contactus.html
app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/contactus.html'));
});

// Route for redirecting to getweather.html
app.get('/getweather', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/getweather.html'));
});

// Route for handling POST requests to check payment status
app.post('/checkPayment', async (req, res) => {
    const utrNumber = req.body.utrNumber;

    const client = new MongoClient('mongodb://localhost:27017')
    const db = client.db('paymentDB');
    const collection = db.collection('UTR'); 

    if (!utrNumber) {
        // If UTR number is not provided in the request body, send a bad request response
        return res.status(400).send('UTR Number is required.');
    }

    try {
        // Query the MongoDB database to check if the UTR number exists
        const foundUTR = await collection.findOne({ utrNumber: utrNumber }, { _id: 0 });


        if (foundUTR) {
            // If UTR number is found, send success response
            res.status(200).send('Payment Successful!');
        } else {
            // If UTR number is not found, send failure response
            res.status(400).send('Payment Failed.Payment Number not found.');
            
        }
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        res.status(500).send('Internal server error.');
    }
});

//Weather prediction using API
app.get('/weather', async (req, res) => {
    const location = req.query.location;
    const apiKey = '1caaa52ce5aacc6b46bf1c5187ebb9b9';
  
    try {
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      const weatherData = await response.json();
      res.json(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'Unable to fetch weather data' });
    }
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


// Start the server and listen on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
