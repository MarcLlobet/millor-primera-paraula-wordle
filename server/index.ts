import express from 'express'
import path from 'path'
import { millorEntrada } from './logic'

export const app = express()

const PORT = process.env.PORT ?? 3000;

// @ts-expect-error la resposta no es final
app.get('/api', (_, res) => res.json({ millorEntrada }))

app.get('/diccionari', (_, res) => 
    res.sendFile(path.resolve('./diccionari/index.txt'))
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});