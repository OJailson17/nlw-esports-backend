// --exit-child
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { convertHourStringToMinute } from './utils/convertHourStringToMinutes';
import { convertMinutesToHoursString } from './utils/convertMinutesToHourString';

const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/games', async (req, res) => {
	const games = await prisma.game.findMany({
		include: {
			_count: {
				select: {
					ads: true,
				},
			},
		},
	});

	return res.json(games);
});

app.get('/ads', (req: Request, res: Response) => {
	return res.json([]);
});

app.post('/games/:id/ads', async (req: Request, res: Response) => {
	const { id: gameId } = req.params;
	const body = req.body;

	const ad = await prisma.ad.create({
		data: {
			gameId,
			name: body.name,
			discord: body.discord,
			hourEnd: convertHourStringToMinute(body.hourEnd),
			hourStart: convertHourStringToMinute(body.hourStart),
			useVoiceChannel: body.useVoiceChannel,
			weekdays: body.weekdays.join(','),
			yearsPlaying: body.yearsPlaying,
		},
	});

	return res.json(ad);
});

app.get('/games/:id/ads', async (req: Request, res: Response) => {
	const { id: gameId } = req.params;

	const ads = await prisma.ad.findMany({
		select: {
			id: true,
			name: true,
			weekdays: true,
			yearsPlaying: true,
			useVoiceChannel: true,
			hourEnd: true,
			hourStart: true,
		},
		where: {
			gameId,
		},
		orderBy: {
			createdAt: 'asc',
		},
	});

	return res.json(
		ads.map(ad => {
			return {
				...ad,
				weekdays: ad.weekdays.split(','),
				hourStart: convertMinutesToHoursString(ad.hourStart),
				hourEnd: convertMinutesToHoursString(ad.hourEnd),
			};
		}),
	);
});

app.get('/ads/:id/discord', async (req: Request, res: Response) => {
	const { id: adId } = req.params;

	const ad = await prisma.ad.findUniqueOrThrow({
		select: {
			discord: true,
		},
		where: {
			id: adId,
		},
	});

	return res.json({
		discord: ad.discord,
	});
});

const port = 8082;
app.listen(port, () => console.log(`Server is running on port ${port}`));
