const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    tags: [{ type: String }],
    group: { type: String, default: 'General' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Link', linkSchema);