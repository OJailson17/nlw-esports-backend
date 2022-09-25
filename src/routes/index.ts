import { Router } from 'express';
import {
	createAds,
	getAds,
	getAdsByGame,
	getDiscordByAd,
} from '../controllers/ads';
import { getGames } from '../controllers/games';

const routes = Router();

// Get all games
routes.get('/games', getGames);

// Get all ads
routes.get('/ads', getAds);

// Create ads
routes.post('/games/:id/ads', createAds);

// Get ads by game
routes.get('/games/:id/ads', getAdsByGame);

// Get discord
routes.get('/ads/:id/discord', getDiscordByAd);

export { routes };
