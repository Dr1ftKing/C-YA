const express = require('express');
const pool = require('../config/database');
const { addDays } = require('date-fns');

const router = express.Router();


// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};

// Create a new proposal
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, description, dateRangeStart, dateRangeEnd, numSlots } = req.body;

        // Validation
        if (!title || !numSlots) {
            return res.status(400).json({ error: 'Title and number of slots are required' });
        }

        if (numSlots < 1) {
            return res.status(400).json({ error: 'Number of slots must be at least 1' });
        }

        // Set default date range if not provided (4 weeks from today)
        const start = dateRangeStart || new Date().toISOString().split('T')[0];
        const end = dateRangeEnd || addDays(new Date(), 28).toISOString.split('T')[0];

        const result = await pool.query(
            `INSERT INTO proposals (title, description, date_range_start, date_range_end, creator_id, num_slots, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'active')
            RETURNING *`,
            [title, description || null, start, end, req.session.userId, numSlots]
        );

        res.status(201).json({ proposal: result.rows[0] });
    } catch (error) {
        console.error('Create proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all proposals for current user (created + responded to)
router.get('/', requireAuth, async (req, res) => {
    try{
        // Get proposals created by user
        const createdProposals = await pool.query(
            `SELECT p.*, u.name as creator_name
            FROM proposals p
            JOIN users u ON p.creator_id = u.id
            WHERE p.creator_id = $1
            ORDER BY p.created_at DESC`,
            [req.session.userId]
        );

        // Get proposals user has responded to
        const respondedProposals = await pool.query(
            `SELECT DISTINCT p.*, u.name as creator_name
            FROM proposals p
            JOIN users u ON p.creator_id = u.id
            JOIN slots s ON s.proposal_id = p.id
            WHERE s.email = (SELECT email FROM users WHERE id = $1)
            AND p.creator_id != $1
            ORDER BY p.created_at DESC`,
            [req.session.userId]
        );

        res.json({
            created:createdProposals.rows,
            responded: respondedProposals.rows
        });
    } catch(error) {
        console.error('Get proposals error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single proposal by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result =  await pool.query(
            `SELECT p.*, u.name as creator_name, u.email as creator_email
            FROM proposals p
            JOIN users u ON p.creator_id = u.id
            WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Get slots count
        const slotsResult = await pool.query(
            `SELECT COUNT(*) as filled_slots FROM slots WHERE proposal_id = $1`,
            [id]
        );

        const proposal = {
            ...result.rows[0],
            filled_slots: parseInt(slotsResult.rows[0].filled_slots)
        };

        res.json({ proposal });
    } catch (error) {
        console.error('Get proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update proposal(creator only)
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dateRangeStart, dateRangeEnd, numSlots } = req.body;

        // Check if user is creator
        const proposal = await pool.query(
            `SELECT * FROM proposals WHERE id = $1`,
            [id]
        );

        if (proposal.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (proposal.rows[0].creator_id !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized'  });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(title);
        }
        if(description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if(dateRangeStart !== undefined) {
            updates.push(`date_range_start = $${paramCount++}`);
            values.push(dateRangeStart);
        }
        if(dateRangeEnd !== undefined) {
            updates.push(`date_range_end = $${paramCount++}`);
            values.push(dateRangeEnd);
        }
        if(numSlots !== undefined) {
            updates.push(`num_slots = $${paramCount++}`);
            values.push(numSlots);
        }


        if (updates.length === 0) {
            return res.status(400).json({ error: 'No updates provided' });
        }

        values.push(id);

        const result = await pool.query(
            `UPDATE proposals SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );

        res.json({ proposal: result.rows[0] });
    } catch (error) {
        console.error('Update proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Cancel proposal (only creator)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user us creator
        const proposal = await pool.query(
            `SELECT * FROM proposals WHERE id = $1`,
            [id]
        );

        if (proposal.rows.length === 0) {
            return res.status(404).json({ error: 'Proposal not found'});
        }

        if (proposal.rows[0].creator_id !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await pool.query(
            `UPDATE proposals SET status = 'cancelled' WHERE id = $1`,
            [id]
        );

        res.json({ message: 'Proposal cancelled' });
    }catch (error) {
        console.error('Cancel proposal error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;