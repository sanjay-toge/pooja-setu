const Pooja = require('../models/Pooja');

exports.getAllPoojas = async (req, res) => {
    try {
        const poojas = await Pooja.find();
        res.json(poojas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPoojaById = async (req, res) => {
    try {
        const pooja = await Pooja.findOne({ id: req.params.id });
        if (!pooja) {
            return res.status(404).json({ error: 'Pooja not found' });
        }
        res.json(pooja);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPoojasByTemple = async (req, res) => {
    try {
        const poojas = await Pooja.find({ templeId: req.params.templeId });
        res.json(poojas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
