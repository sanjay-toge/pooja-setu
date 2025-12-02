const Temple = require('../models/Temple');

exports.getAllTemples = async (req, res) => {
    try {
        const temples = await Temple.find();
        res.json(temples);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTempleById = async (req, res) => {
    try {
        const temple = await Temple.findOne({ id: req.params.id });
        if (!temple) {
            return res.status(404).json({ error: 'Temple not found' });
        }
        res.json(temple);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
