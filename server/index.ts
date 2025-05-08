import express from 'express'
import { getMillorEntrada } from './logic'
import { EstatWordle, filtraParaulesValides } from './bitwise'
import { getEntradesOriginals, getTotesLesParaules } from './diccionari'

export const app = express()
app.use(express.json())

const PORT = process.env.PORT ?? 3000

app.get('/api/millor-paraula', (_, res) => {
    const millorEntrada = getMillorEntrada()
    res.json({ millorParaula: millorEntrada.origen })
})

app.post('/api/paraules-valides', (req, res) => {
    const estatWordle = req.body
    const totesLesParaules = getTotesLesParaules()

    const paraulesValides = filtraParaulesValides(
        totesLesParaules,
        estatWordle as EstatWordle
    )
    res.json({ paraulesValides })
})

app.get('/diccionari', (_, res) => {
    const totesLesParaules = getEntradesOriginals()
    res.send(totesLesParaules)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
