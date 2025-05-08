import { describe, it, expect } from 'vitest'
import {
    getMillorParaula,
    getParaulaBuida,
    getQuantitatIPosicions,
    getLletresOrdenades,
    getSeguentLletra,
    getSeguentQuantitatIPosicio,
    getParaulesRestants,
    getItemsAfegits,
    getMillorLletres,
    getParaulaDeLletres,
    MillorLletres,
} from './getMillorParaula'

const mockParaules = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy']
const mockLlargada = 5
describe('getMillorParaula', () => {
    it('retorna una de les paraules donades', () => {
        const resultat = getMillorParaula(mockParaules, mockLlargada)

        expect(resultat.join('')).toEqual(expect.toBeOneOf(mockParaules))
    })

    it('retorna la primera millor paraula', () => {
        const resultat = getMillorParaula(mockParaules, mockLlargada)

        expect(resultat.join('')).toEqual('abcde')
    })

    it('retorna la primera paraula amb lletres mes coincidents', () => {
        const mockParaules = [
            'abcde',
            'fghij',
            'klmno',
            'kqrst', // k en comptes de p
            'uvwxy',
        ]

        const resultat = getMillorParaula(mockParaules, mockLlargada)

        expect(resultat.join('')).toEqual('klmno')
    })

    it("retorna la primera paraula amb lletres mes coincidents en comparacio d'altres", () => {
        const mockParaules = [
            'abcde',
            'afghi', // 2 a
            'plmno',
            'pqrst',
            'pvwxy', // 3 p
        ]

        const resultat = getMillorParaula(mockParaules, mockLlargada)

        expect(resultat.join('')).toEqual('plmno')
    })

    it('retorna la primera paraula amb lletres mes coincidents i posicio mes coincident', () => {
        const mockParaules = [
            'abcde',
            'fghia', // a final
            'klmna', // a final
            'pqrst',
            'uvwxy',
        ]

        const resultat = getMillorParaula(mockParaules, mockLlargada)

        expect(resultat.join('')).toEqual('fghia')
    })
})

describe('getParaulaBuida', () => {
    it('retorna una paraula buida amb la llargada especificada', () => {
        const resultat = getParaulaBuida(5)
        expect(resultat).toEqual([null, null, null, null, null])
    })
})

describe('getQuantitatIPosicions', () => {
    it('retorna un array amb quantitat i posició per cada lletra', () => {
        const resultat = getQuantitatIPosicions(3)
        expect(resultat).toEqual([
            { quantitat: 0, posicio: 0 },
            { quantitat: 0, posicio: 1 },
            { quantitat: 0, posicio: 2 },
        ])
    })
})

describe('getLletresOrdenades', () => {
    it('ordena les lletres segons la seva freqüència i posició', () => {
        const paraules = ['abc', 'def', 'ach']
        const resultat = getLletresOrdenades(paraules, 3)
        expect(resultat[0].lletra).toBe('a')
        expect(resultat[1].lletra).toBe('c')
        expect(resultat[2].lletra).toBe('b')
    })
})

describe('getSeguentLletra', () => {
    it('retorna la lletra amb més quantitat total primer', () => {
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [{ quantitat: 4, posicio: 0 }],
                total: 4,
            },
            {
                lletra: 'd',
                quantitatIPosicions: [{ quantitat: 1, posicio: 1 }],
                total: 1,
            },
        ]
        const prev = {
            paraulesRestants: ['abc', 'abd'],
            lletres: [],
            posicionsJaUsades: [],
            lletresJaUsades: [],
        }
        const resultat = getSeguentLletra(prev, lletresOrdenades)
        expect(resultat?.lletra).toBe('a')
    })

    it('ignora lletres ja usades', () => {
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [{ quantitat: 4, posicio: 0 }],
                total: 4,
            },
            {
                lletra: 'd',
                quantitatIPosicions: [{ quantitat: 2, posicio: 2 }],
                total: 2,
            },
        ]
        const prev = {
            paraulesRestants: ['abc', 'abd', 'def'],
            lletres: [],
            posicionsJaUsades: [],
            lletresJaUsades: ['a'],
        }
        const resultat = getSeguentLletra(prev, lletresOrdenades)
        expect(resultat?.lletra).toBe('d')
    })

    it('ignora posicions ja usades', () => {
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [{ quantitat: 4, posicio: 0 }],
                total: 5,
            },
            {
                lletra: 'd',
                quantitatIPosicions: [{ quantitat: 2, posicio: 1 }],
                total: 4,
            },
        ]
        const prev = {
            paraulesRestants: ['abc', 'abd', 'edf'],
            lletres: [],
            posicionsJaUsades: [0],
            lletresJaUsades: [],
        }
        const resultat = getSeguentLletra(prev, lletresOrdenades)
        expect(resultat?.lletra).toBe('d')
    })

    it('retorna undefined si no hi ha cap lletra vàlida', () => {
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [{ quantitat: 4, posicio: 0 }],
                total: 4,
            },
            {
                lletra: 'd',
                quantitatIPosicions: [{ quantitat: 1, posicio: 1 }],
                total: 1,
            },
        ]
        const prev = {
            paraulesRestants: ['abc', 'abd'],
            lletres: [],
            posicionsJaUsades: [0, 1],
            lletresJaUsades: ['a', 'd'],
        }
        const resultat = getSeguentLletra(prev, lletresOrdenades)
        expect(resultat).toBeUndefined()
    })

    it('troba la lletra amb la posició més coincident', () => {
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [
                    { quantitat: 2, posicio: 0 },
                    { quantitat: 1, posicio: 1 },
                ],
                total: 3,
            },
            {
                lletra: 'b',
                quantitatIPosicions: [
                    { quantitat: 1, posicio: 0 },
                    { quantitat: 2, posicio: 1 },
                ],
                total: 3,
            },
        ]
        const prev = {
            paraulesRestants: ['abc', 'abd'],
            lletres: [],
            posicionsJaUsades: [],
            lletresJaUsades: [],
        }
        const resultat = getSeguentLletra(prev, lletresOrdenades)
        expect(resultat?.lletra).toBe('a') // Prioritza 'a' perquè té més coincidències a la primera posició
    })
})

describe('getSeguentQuantitatIPosicio', () => {
    it('troba la següent posició vàlida per una lletra', () => {
        const metaLletra = {
            lletra: 'a',
            quantitatIPosicions: [{ quantitat: 2, posicio: 0 }],
            total: 2,
        }
        const paraulesRestants = ['abc', 'abd']
        const resultat = getSeguentQuantitatIPosicio(
            metaLletra,
            paraulesRestants
        )
        expect(resultat).toEqual({ quantitat: 2, posicio: 0 })
    })
})

describe('getParaulesRestants', () => {
    it('filtra les paraules restants segons la lletra i posició', () => {
        const resultat = getParaulesRestants({
            paraulesRestants: ['abc', 'abd', 'xyz'],
            posicio: 0,
            lletra: 'a',
        })
        expect(resultat).toEqual(['abc', 'abd'])
    })
})

describe('getItemsAfegits', () => {
    it('actualitza els items afegits amb la nova lletra i posició', () => {
        const metaLletres: MillorLletres = {
            lletres: [],
            posicionsJaUsades: [],
            lletresJaUsades: [],
            paraulesRestants: [],
        }

        const resultat = getItemsAfegits(
            { quantitat: 2, lletra: 'a', posicio: 0 },
            metaLletres
        )
        expect(resultat.lletres).toEqual([
            { lletra: 'a', quantitat: 2, posicio: 0 },
        ])
        expect(resultat.posicionsJaUsades).toEqual([0])
        expect(resultat.lletresJaUsades).toEqual(['a'])
    })
})

describe('getMillorLletres', () => {
    it('troba les millors lletres segons les paraules restants', () => {
        const paraulesRestants = ['abc', 'abd']
        const lletresOrdenades = [
            {
                lletra: 'a',
                quantitatIPosicions: [{ quantitat: 2, posicio: 0 }],
                total: 2,
            },
            {
                lletra: 'b',
                quantitatIPosicions: [{ quantitat: 1, posicio: 1 }],
                total: 1,
            },
        ]
        const resultat = getMillorLletres(paraulesRestants, lletresOrdenades)
        expect(resultat.lletres[0].lletra).toBe('a')
    })
})

describe('getParaulaDeLletres', () => {
    it('construeix una paraula a partir de les lletres i posicions', () => {
        const lletres = [
            { lletra: 'a', posicio: 0, quantitat: 2 },
            { lletra: 'b', posicio: 1, quantitat: 1 },
        ]
        const resultat = getParaulaDeLletres(lletres)
        expect(resultat).toEqual(['a', 'b'])
    })
})
