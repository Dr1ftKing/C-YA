const express = require('express');
const pool = require('../config/database');
const validator = require('validator');

const router = express.Router();

// Get slots for a proposal
router.get('/proposal/:proposalId', async (req, res) => {
    try {
        const { proposalId } = req.params;

        const result = await pool.query(
            `SELECT s.*,
            (SELECT COUNT(*) FROM availability_entries WHERE slot_id = s.id) as availability_count
            FROM slots s
            WHERE s.proposal_id = $1
            ORDER by s.claimed_at ASC`,
            [proposalId]
        );

        res.json({ slots: result.rows });
    } catch(error) {
        console.error('Get slots error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Claim a slot and submit availability
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { proposalId, name, email, availability } = req.body;

        //validation
        if (!proposalId || !name || !email || !availability) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'All fields are required' });
        }

        if(!validator.isEmail(email)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Check if proposal exists and is active
        const proposalResult = await client.query(
            `SELECT * FROM proposals WHERE id = $1`,
            [proposalId]
        );

        if (proposalResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Proposal not found' });
        }

        if (proposalResult.rows[0].status !== 'active') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Proposal is not active' });
        }

        // Check if slots are full
        const slotsCount = await client.query(
            `SELECT COUNT(*) as count FROM slots WHERE proposal_id = $1`,
            [proposalId]
        );

        if (parseInt(slotsCount.rows[0].count) >= proposalResult.rows[0].num_slots) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'All slots are filled' });
        }

        // Check if email already has a slot
        const existingSlot = await client.query(
            `SELECT * FROM slots WHERE proposal_id = $1 AND email = $2`,
            [proposalId, email]
        );

        if (existingSlot.rows.length > 0) {
            await client.query(`ROLLBACK`);
            return res.status(400).json({ error: 'You have already clained a slot' });
        }

        // Check if user has account
        const userResult = await client.query(
            `SELECT id FROM users WHERE email  = $1`,
            [email]
        );

        const hasAccount = userResult.rows.length > 0;

        // Create slot
        const slotResult = await client.query(
            `INSERT INTO slots (proposal_id, name, email, has_account)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [proposalId, name, email, hasAccount]
        );

        const slotId = slotResult.rows[0].id;

        // Insert new availability entries
        for (const entry of availability) {
            await client.query(
                `INSERT INTO availability_entries (slot_id, date, busy_times)
                VALUES ($1, $2, $3)`,
                [slotId, entry.date, JSON.stringify(entry.busyTimes || [])]
            );

            // Add to history
            await client.query(
                `INSERT INTO availability_history (slot_id, date, busy_times, action)
                VALUES ($1, $2, $3, 'updated')`,
                [slotId, entry.date, JSON.stringify(entry.busyTimes || [])]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            slot: slotResult.rows[0],
            message: 'Availability submitted successfully'
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Claim slot error:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});


// Update availability (requires authentication or matching email)
router.patch('/:slotId/availability', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { slotId } = req.params;
        const { availability } = req.body;

        // Get slot
        const slotResult = await client.query(
            `SELECT * FROM slots WHERE id = $1`,
            [slotId]
        );

        if (slotResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Slot not found' });
        }

        const slot = slotResult.rows[0];

        // Check authorization
        const isAuthorized = 
            req.session.userId &&
            await client.query('SELECT * FROM users WHERE id  = $1 AND email =$2',
                [req.session.userId, slot.email]);
 
        if (!isAuthorized || (isAuthorized.rows && isAuthorized.rows.length === 0)) {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Delete old availability entries
        await client.query(`DELETE FROM availability_entries WHERE slot_id = $1`, [slotId]);

        // Insert new availability entries
        for (const entry of availability) {
            await client.query(
                `INSERT INTO availability_entries (slot_id, date, busy_times)
                VALUES ($1, $2, $3)`,
                [slotId, entry.date, JSON.stringify(entry.busyTimes || [])]
            );
        }
        
        // Add to history
        await client.query('COMMIT');

        res.json({ message:'Availability updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Update availability error:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        client.release();
    }
});

module.exports = router;