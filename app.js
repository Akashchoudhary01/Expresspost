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

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

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

    res.cookie("token", token, { httpOnly: true });
    res.send("Registration Successful");
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
            res.status(200).redirect("/profile");
        } else {
            res.status(200).redirect("/login");
        }
    });
});

// Logout Route
app.get('/logout', (req, res) => {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    res.redirect("/login");
});

// Profile Page (Protected Route)
app.get('/profile', isLoggedin, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email }).populate("posts");
    console.log(user.posts);
    
    res.render("profile", { user });
});

// Post Route
app.post('/post', isLoggedin, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email });
    let content = req.body.content;  // Assuming the content is coming from the request body
    
    let post = await postmodel.create({
        user: user._id,
        content: content
    });

    // Push the post's ID into the user's posts array
    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
});

// Middleware for protected routing
function isLoggedin(req, res, next) {
    if (!req.cookies.token) {
        return res.redirect("/login");
    }

    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, data) => {
        req.user = data;  // Attach the user data to the request object
        next();
    });
}

// Port Listening
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`);
});
