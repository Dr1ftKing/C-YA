const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const pool = require('../config/database')

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try{
        const { email, name, password, birthday } = req.body;

        // Validation
        if (!email || !name || !password || !birthday) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if(!validator.isEmail(email)) {
            return res.status(400).json({error: 'Invalid email address'});
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters'});
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email =$1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered'});
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, name, password, birthday) VALUES ($1, $2, $3, $4) RETURNING id, email, name, birthday',
            [email, name, hashedPassword, birthday]
        );

        const user = result.rows[0];

        // Set session
        req.session.userId = user.id;

        res.status(201).json({ user });
    }catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;

    // Don't send password back
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
router.get('/me', async (req, res) => {
    try{
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const result = await pool.query(
            'SELECT id, email, name, birthday FROM users WHERE id = $1',
            [req.session.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user:result.rows[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error:'Server error' });
    }
});

module.exports = router;