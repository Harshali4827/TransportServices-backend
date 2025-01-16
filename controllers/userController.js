
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const blacklistedTokens = new Set();
// const secretKey = 'your_secret_key';
// const saltRounds = 10;

// exports.verifyToken = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.json({ valid: false, message: 'Access denied' });
    
//     if (blacklistedTokens.has(token)) {
//         return res.json({ valid: false, message: 'Token is invalidated' });
//     }

//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) return res.json({ valid: false, message: 'Invalid token' });
//         req.user = decoded;
//         next();
//     });
// };

// exports.register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         await User.create({ username, email, password: hashedPassword });

//         return res.status(201).json({ status: 'Success', message: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error registering user' });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ login: false, message: 'User not found' });
//         }

//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) {
//             return res.status(401).json({ login: false, message: 'Invalid password' });
//         }

//         const token = jwt.sign(
//             { id: user.id, email: user.email },
//             secretKey,
//             { expiresIn: '1h' }
//         );

//         return res.status(200).json({ login: true, token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error during login' });
//     }
// };

// exports.logout = (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//         return res.status(400).json({ status: 'Error', message: 'No token provided' });
//     }
//     blacklistedTokens.add(token);
//     return res.json({ status: 'Success', message: 'Logged out successfully' });
// };



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = 'your_secret_key';
const saltRounds = 10;
const blacklistedTokens = new Set();


// exports.verifyToken = (req, res, next) => {
//     const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ valid: false, message: 'Access denied' });

//     if (blacklistedTokens.has(token)) {
//         return res.status(401).json({ valid: false, message: 'Token is invalidated' });
//     }

//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) return res.status(401).json({ valid: false, message: 'Invalid token' });
//         req.user = decoded;
//         next();
//     });
// };

exports.verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false, message: 'Access denied' });

    if (blacklistedTokens.has(token)) {
        return res.status(401).json({ valid: false, message: 'Token is invalidated' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ valid: false, message: 'Session expired' });
            }
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};


// Register User
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ username, email, password: hashedPassword });

        return res.status(201).json({ status: 'Success', message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ login: false, message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ login: false, message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: '1h' }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: false, 
            maxAge: 3600000,
        });

        return res.status(200).json({ login: true, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
};

// Logout User
exports.logout = (req, res) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ status: 'Error', message: 'No token provided' });
    }

    blacklistedTokens.add(token);

    res.clearCookie('accessToken');

    return res.status(200).json({ status: 'Success', message: 'Logged out successfully' });
};
