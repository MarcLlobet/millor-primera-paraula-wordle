import express from 'express'
import { millorEntrada } from './logic'

export const app = express()

// @ts-expect-error la resposta no es final
app.get('/api', (_, res) => res.json({ millorEntrada }))
