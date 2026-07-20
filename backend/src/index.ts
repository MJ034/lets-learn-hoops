import express = require('express');
import type { Request, Response } from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.get('/health', (_request: Request, response: Response) => {
	response.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
	console.log(`Backend listening in dev mode on http://localhost:${port}`);
});
