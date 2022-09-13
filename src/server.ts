import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Hello World' });
});

const port = 8082;
app.listen(port, () => console.log(`Server is running on port ${port}`));
