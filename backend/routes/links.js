const router = require('express').Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Link = require('../models/Link');
const auth = require('../middleware/auth');

// Auto-fetch title from URL
async function fetchMeta(url) {
    try {
        const { data } = await axios.get(url, { timeout: 5000 });
        const $ = cheerio.load(data);
        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
        return title.trim();
    } catch {
        return '';
    }
}

// GET all links (with optional tag filter & search)
router.get('/', auth, async (req, res) => {
    try {
        const { tag, q, group } = req.query;
        let query = { user: req.user.id };

        if (tag) query.tags = tag;
        if (group) query.group = group;
        if (q) query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { url: { $regex: q, $options: 'i' } },
        ];

        const links = await Link.find(query).sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST add link
router.post('/', auth, async (req, res) => {
    try {
        let { url, title, description, tags, group } = req.body;

        // Auto-fetch title if not provided
        if (!title) title = await fetchMeta(url);

        const link = await Link.create({
            user: req.user.id,
            url, title, description,
            tags: tags || [],
            group: group || 'General',
        });
        res.status(201).json(link);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE link
router.delete('/:id', auth, async (req, res) => {
    try {
        await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update link
router.patch('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        res.json(link);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all unique tags for the user
router.get('/tags', auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        const tags = [...new Set(links.flatMap(l => l.tags))];
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all unique groups for the user
router.get('/groups', auth, async (req, res) => {
    try {
        const groups = await Link.distinct('group', { user: req.user.id });
        res.json(groups.filter(Boolean));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;