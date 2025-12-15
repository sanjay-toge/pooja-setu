const God = require('../models/God');

exports.getGods = async (req, res) => {
    try {
        const gods = await God.find();
        res.json(gods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGodById = async (req, res) => {
    try {
        const god = await God.findOne({ id: req.params.id });
        if (!god) {
            return res.status(404).json({ error: 'God not found' });
        }
        res.json(god);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
