import { expect, describe, it } from 'vitest'
import {
    filtreCaractersValids,
    filtradorEntrades,
    filtreQuantitatLletres,
    filtreInfinitius,
    filtreNomsPropis,
    filtreCaractersAbecedari,
    filtreCaractersUnics,
} from './filtres'
import type { Entrada } from '../types'

describe('filtreCaractersValids', () => {
    it('hauria de normalitzar i eliminar caràcters no vàlids', () => {
        expect(filtreCaractersValids('çàé')).toBe('çae')
    })

    it('hauria de manejar paraules sense caràcters especials correctament', () => {
        expect(filtreCaractersValids('abc')).toBe('abc')
    })
})

describe('filtradorEntrades', () => {
    it('hauria de filtrar elements segons els filtres proporcionats', () => {
        const entrades = [
            { derivada: '', origen: 'a' },
            { derivada: '', origen: 'ab' },
            { derivada: '', origen: 'abc' },
        ]
        const filtres = [(entrada: Entrada) => entrada.origen.length === 3]
        expect(filtradorEntrades(entrades, filtres)).toEqual([
            { derivada: '', origen: 'abc' },
        ])
    })
})

describe('filtreQuantitatLletres', () => {
    it('hauria de filtrar entrades amb la quantitat correcta de lletres', () => {
        const entrada: Entrada = {
            derivada: '',
            origen: 'abcde',
            definicio: '',
        }
        expect(filtreQuantitatLletres(entrada)).toBe(true)
    })

    it('hauria de rebutjar entrades amb una quantitat incorrecta de lletres', () => {
        const entrada: Entrada = { derivada: '', origen: 'abcd', definicio: '' }
        expect(filtreQuantitatLletres(entrada)).toBe(false)
    })
})

describe('filtreInfinitius', () => {
    it('hauria de filtrar entrades on origen i derivada són iguals', () => {
        const entrada: Entrada = {
            derivada: 'cantar',
            origen: 'cantar',
            definicio: '',
        }
        expect(filtreInfinitius(entrada)).toBe(true)
    })

    it('hauria de rebutjar entrades on origen i derivada són diferents', () => {
        const entrada: Entrada = {
            derivada: 'cantar',
            origen: 'cantant',
            definicio: '',
        }
        expect(filtreInfinitius(entrada)).toBe(false)
    })
})

describe('filtreNomsPropis', () => {
    it('hauria de rebutjar noms propis', () => {
        const entrada: Entrada = { derivada: '', origen: 'Nom', definicio: '' }
        expect(filtreNomsPropis(entrada)).toBe(false)
    })

    it("hauria d'acceptar noms no propis", () => {
        const entrada: Entrada = { derivada: '', origen: 'nom', definicio: '' }
        expect(filtreNomsPropis(entrada)).toBe(true)
    })
})

describe('filtreCaractersAbecedari', () => {
    it("hauria de filtrar paraules amb caràcters dins de l'abecedari", () => {
        const entrada: Entrada = { derivada: '', origen: 'abcç', definicio: '' }
        expect(filtreCaractersAbecedari(entrada)).toBe(true)
    })

    it("hauria de rebutjar paraules amb caràcters fora de l'abecedari", () => {
        const entrada: Entrada = { derivada: '', origen: 'abc1', definicio: '' }
        expect(filtreCaractersAbecedari(entrada)).toBe(false)
    })
})

describe('filtreCaractersUnics', () => {
    it('hauria de filtrar paraules amb caràcters únics', () => {
        expect(filtreCaractersUnics('abc')).toBe(true)
    })

    it('hauria de rebutjar paraules amb caràcters repetits', () => {
        expect(filtreCaractersUnics('aabc')).toBe(false)
    })
})
