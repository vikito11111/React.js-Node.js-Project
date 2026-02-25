const express = require('express');
const router = express.Router();

const {
    getGames,
    getGame,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getFeaturedGames
} = require('../controllers/gameController');

const {
    protect,
    authorize
} = require('../middleware/auth');

router.get('/', getGames);
router.get('/featured', getFeaturedGames);
router.get('/id/:id', getGameById);
router.get('/:slug', getGame);

router.post('/', protect, authorize('admin'), createGame);
router.put('/:id', protect, authorize('admin'), updateGame);
router.delete('/:id', protect, authorize('admin'), deleteGame);

module.exports = router;