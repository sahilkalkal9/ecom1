const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('API is running 🚀');
    console.log("API running")
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        console.log(users);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error while fetching users' });
    }
});


// MongoDB connection
mongoose.connect('mongodb+srv://sahil:sahil123$@ecom1.xilep.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    otpVerified: Boolean
});
const User = mongoose.model('Users', userSchema);

// Register Route
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    console.log(
        req.body
    )

    if (!firstName || !lastName || !email || !phone) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }


    try {
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            otpVerified: true
        });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ success: false, message: 'Email already exists' });
        } else {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
});

app.post('/send-otp', async (req, res) => {
    const { phone, otp } = req.body;
    console.log(req.body)

    try {
        const response = await axios.post(
            'https://www.fast2sms.com/dev/bulkV2',

            {

                "route": "otp",
                "variables_values": String(otp),
                "numbers": phone,
            },

            {
                headers: {
                    "authorization": "PmUMBfGiwtyXJeCYj41gzKTF8ZE90RVcqa6vNSrpxlkhbuWoAsOfEmTBIcDWHQg6APaZUR3eb1r7CKYX",
                    "Content-Type": "application/json",
                },
            }
        );

        return res.status(200).json({ success: true, data: response.data });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
