import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from './index'
import { EstatWordle } from './bitwise'

describe('API Endpoints', () => {
    it('GET /api/millor-paraula should return millorParaula', async () => {
        const response = await request(app).get('/api/millor-paraula')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('millorParaula')
    })

    it('POST /api/paraules-valides should return paraulesValides', async () => {
        const mockEstatWordle: EstatWordle = {
            llargada: 5,
            encerts: [],
            descartades: [],
            malColocades: [],
        }

        const response = await request(app)
            .post('/api/paraules-valides')
            .send(mockEstatWordle)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('paraulesValides')
        expect(Array.isArray(response.body.paraulesValides)).toBe(true)
    })

    it('GET /diccionari should return dictionary content', async () => {
        const response = await request(app).get('/diccionari')
        expect(response.status).toBe(200)

        expect(response.text).toEqual(
            JSON.stringify(['abcde', 'fghij', 'klmno'])
        )
    })
})
