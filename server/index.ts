import express from 'express'
import path from 'path'
import { getMillorEntrada } from './logic'

export const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/api', (_, res) => {
    const millorEntrada = getMillorEntrada()
    res.json({ millorEntrada })
})

app.get('/diccionari', (_, res) =>
    res.sendFile(path.resolve('./diccionari/index.txt'))
)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
