const Game = require('../models/Game');

const getGames = async (req, res) => {
    try {
        const {
            genre,
            platform,
            featured,
            search,
            minPrice,
            maxPrice,
            sort = '-createdAt',
            page = 1,
            limit = 10
        } = req.query;

        const query = { isActive: true };

        if (genre) {
            query.genres = { $in: [genre] };
        }

        if (platform) {
            query.platform = { $in: [platform] };
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { developer: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const games = await Game.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Game.countDocuments(query);

        res.status(200).json({
            status: 'success',
            count: games.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            curretPage: Number(page),
            data: games
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getGame = async (req, res) => {
    try {
        const game = await Game.findOne({ slug: req.params.slug, isActive: true });

        if (!game) {
            return req.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: game
        });
    } catch (error) {
        res.response(500).json({
            status: 'success',
            message: error.message
        });
    }
};

const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: game
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);

        res.status(201).json({
            status: 'success',
            message: 'Game created successfully',
            data: game
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const updateGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Game updated successfully',
            data: game
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!game) {
            return res.status(404).json({
                status: 'error',
                message: 'Game not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Game deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const getFeaturedGames = async (req, res) => {
    try {
        const games = await Game.find({ isFeatured: true, isActive: true })
            .limit(10)
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            count: games.length,
            data: games
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    getGames,
    getGame,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getFeaturedGames
};