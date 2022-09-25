import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

// Initialize routes
app.use(routes);

const port = 8082;
app.listen(port, () => console.log(`Server is running on port ${port}`));
