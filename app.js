import express from 'express';
const app = express();
import dotenv from "dotenv";
dotenv.config();
import './config/dbConnection.js'; // Assuming dbConnection.js handles DB connection
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import usermodel from './models/usermodel.js';
import postmodel from './models/postmodel.js';
import jwt from 'jsonwebtoken';

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render("index");
});

// Register route
app.post('/register', async (req, res) => {
    let { email, password, username, name, age } = req.body;

    // Check if email already exists
    let user = await usermodel.findOne({ email });
    if (user) return res.status(400).send("User already Registered");

    // Check if all fields are provided
    if (!email || !password || !username || !name || !age) {
        return res.status(400).json({ message: "Please fill all the details" });
    }

    try {
        // Hash the password and save the user
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        const newUser = new usermodel({
            username,
            name,
            age,
            email,
            password: hash
        });

        await newUser.save();

        // Generate JWT token
        let token = jwt.sign({ email: email, userid: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send the token as a cookie
        res.cookie("token", token, { httpOnly: true });
        res.send("Registration Successful");
    } catch (error) {
        return res.status(500).send("Error saving user");
    }
});

// Login Page
app.get('/login', (req, res) => {
    res.render("login");
});

// Login Route
app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the details" });
    }

    let user = await usermodel.findOne({ email });
    if (!user) return res.status(400).send("Please Register First");

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("Error comparing passwords");

        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true });
            return res.status(200).send("You are now Logged in");
        } else {
            return res.status(401).send("Invalid Credentials");
        }
    });
});

// Logout Route
app.get('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.redirect("/login");
});

// Profile Page (Protected Route)
app.get('/profile', isLoggedin, (req, res) => {
    res.send("Profile Page");
});

// Middleware for protected routing
function isLoggedin(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send("You need to be logged in");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send("Invalid or Expired Token");
    }
}

// Port Listening
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`);
});
