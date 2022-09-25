import { Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { convertHourStringToMinute } from '../utils/convertHourStringToMinutes';
import { convertMinutesToHoursString } from '../utils/convertMinutesToHourString';

export const getAds = (req: Request, res: Response) => {
	return res.json([]);
};

export const createAds = async (req: Request, res: Response) => {
	const { id: gameId } = req.params;
	const body = req.body;

	await prisma.ad.create({
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
};

export const getAdsByGame = async (req: Request, res: Response) => {
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
};

export const getDiscordByAd = async (req: Request, res: Response) => {
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
};
