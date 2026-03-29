const { pool } = require('../config/db');

exports.createItem = async (req, res) => {
    try {
        const { item_name, category, purchase_date, expiry_date, notes } = req.body;
        const user_id = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO items (user_id, item_name, category, purchase_date, expiry_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, item_name, category, purchase_date || null, expiry_date, notes || '']
        );

        res.status(201).json({ message: 'Item added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item.' });
    }
};

exports.getItems = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        // Sorting items so the soonest to expire are first
        const [items] = await pool.query(
            'SELECT * FROM items WHERE user_id = ? ORDER BY expiry_date ASC',
            [user_id]
        );

        res.json({ items });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items.' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { item_name, category, purchase_date, expiry_date, notes } = req.body;
        const user_id = req.user.id;

        const [result] = await pool.query(
            'UPDATE items SET item_name=?, category=?, purchase_date=?, expiry_date=?, notes=? WHERE id=? AND user_id=?',
            [item_name, category, purchase_date || null, expiry_date, notes || '', id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found or unauthorized.' });
        }

        res.json({ message: 'Item updated successfully.' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item.' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const [result] = await pool.query('DELETE FROM items WHERE id=? AND user_id=?', [id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item not found or unauthorized.' });
        }

        res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item.' });
    }
};
