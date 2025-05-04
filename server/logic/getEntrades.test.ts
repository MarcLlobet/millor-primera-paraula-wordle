import { expect, describe, it } from 'vitest'
import { getEntrades, getEntradesPerParaula } from './getEntrades'
import type { Entrada } from '../types'

describe('getEntrades', () => {
    it("hauria de convertir el diccionari en una llista d'entrades", () => {
        const diccionari =
            'derivada1 origen1 definicio1\nderivada2 origen2 definicio2'
        const result = getEntrades(diccionari)
        expect(result).toEqual([
            {
                derivada: 'derivada1',
                origen: 'origen1',
                definicio: 'definicio1',
            },
            {
                derivada: 'derivada2',
                origen: 'origen2',
                definicio: 'definicio2',
            },
        ])
    })
})

describe('getEntradesPerParaula', () => {
    it('hauria de retornar un objecte amb les paraules com a claus', () => {
        const entrades: Entrada[] = [
            { derivada: 'aeiou', origen: 'aeiou', definicio: 'definicio1' },
            { derivada: 'zxyae', origen: 'zxyae', definicio: 'definicio2' },
        ]
        const result = getEntradesPerParaula(entrades)
        expect(result).toEqual({
            aeiou: {
                derivada: 'aeiou',
                origen: 'aeiou',
                definicio: 'definicio1',
            },
            zxyae: {
                derivada: 'zxyae',
                origen: 'zxyae',
                definicio: 'definicio2',
            },
        })
    })
})
