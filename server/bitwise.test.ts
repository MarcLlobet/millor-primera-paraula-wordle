import { expect, it, describe } from 'vitest'
import {
    convertirLletraABit,
    crearMascaraBitwise,
    validaLlargada,
    validaEncerts,
    validaAbsenciaLletresDescartades,
    validaAbsenciaMalColocades,
    validaPresenciaMalColocades,
    EstatWordle,
    filtraParaulesValides,
} from './bitwise'

const mockEstatWordle: EstatWordle = {
    llargada: 5,
    encerts: [],
    descartades: [],
    malColocades: [],
}

describe('convertirLletraABit', () => {
    it('converteix una lletra a la seva representació en bit', () => {
        expect(convertirLletraABit('a')).toBe(0o1)
        expect(convertirLletraABit('b')).toBe(2)
        expect(convertirLletraABit('c')).toBe(4)
    })
})

describe('crearMascaraBitwise', () => {
    it('crea una màscara bitwise per un array de lletres', () => {
        expect(crearMascaraBitwise(['a', 'b', 'c'])).toBe(7) // 1 | 2 | 4 = 7
        expect(crearMascaraBitwise(['a', 'c'])).toBe(5) // 1 | 4 = 5
    })
})

describe('validaLlargada', () => {
    it('valida que una paraula tingui la llargada esperada', () => {
        const validador = validaLlargada(mockEstatWordle)
        expect(validador('12345')).toBe(true)
        expect(validador('1234')).toBe(false)
    })
})

describe('validaEncerts', () => {
    it('valida que les lletres encertades siguin a la posició correcta', () => {
        const validador = validaEncerts({
            ...mockEstatWordle,
            encerts: [
                ['a', 0],
                ['b', 1],
            ],
        })
        expect(validador('ab___')).toBe(true)
        expect(validador('a____')).toBe(false)
    })
})

describe('validaAbsenciaLletresDescartades', () => {
    it('valida que cap lletra descartada aparegui a la paraula', () => {
        const validador = validaAbsenciaLletresDescartades({
            ...mockEstatWordle,
            descartades: ['a', 'b'],
        })
        expect(validador('cdefg')).toBe(true)
        expect(validador('ab___')).toBe(false)
    })
})

describe('validaAbsenciaMalColocades', () => {
    it('valida que les lletres mal col·locades no estiguin a la posició equivocada', () => {
        const validador = validaAbsenciaMalColocades({
            ...mockEstatWordle,
            malColocades: [
                ['a', 0],
                ['b', 1],
            ],
        })
        expect(validador('__ab_')).toBe(true)
        expect(validador('ab___')).toBe(false)
    })

    describe('validaPresenciaMalColocades', () => {
        it('valida que les lletres mal col·locades no estiguin a la posició equivocada', () => {
            const validador = validaPresenciaMalColocades({
                ...mockEstatWordle,
                malColocades: [['a', 2]],
            })
            expect(validador('____1')).toBe(false)
            expect(validador('a___2')).toBe(true)
        })
    })
})

describe('filtraParaulesValides', () => {
    it('filtra les paraules per llargada', () => {
        const diccionari = [
            '1',
            '12',
            '123',
            '1234',
            '12345',
            '123456',
            '1234567',
        ]
        const paraulesFiltrades = filtraParaulesValides(diccionari, {
            ...mockEstatWordle,
            llargada: 4,
        })

        expect(paraulesFiltrades).toEqual(['1234'])
    })

    it('filtra les lletres encertades', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            encerts: [['e', 1]],
        }
        const diccionari = ['e____', '_e___', '__e__', '___e_', '____e']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['_e___'])
    })

    it('no descarta lletres encertades repetides', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            encerts: [['e', 1]],
        }
        const diccionari = ['ee___', '_ee__', '_e_e_', '_e__e']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['ee___', '_ee__', '_e_e_', '_e__e'])
    })

    it('filtra mal colocada', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            malColocades: [['a', 2]],
        }
        const diccionari = ['a____', '_a___', '__a__', '___a_', '____a']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['a____', '_a___', '___a_', '____a'])
    })

    it('filtra descartades', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            descartades: ['a'],
        }
        const diccionari = ['a____', 'b____', 'c____', 'd____']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['b____', 'c____', 'd____'])
    })

    it('filtra varies posicions mal colocades de la mateixa lletra', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            malColocades: [
                ['a', 2],
                ['a', 3],
            ],
        }
        const diccionari = ['a____', '_a___', '__a__', '___a_', '____a']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['a____', '_a___', '____a'])
    })

    it('ha de contenir la mal colocada a algun lloc', () => {
        const estatDeJoc: EstatWordle = {
            ...mockEstatWordle,
            malColocades: [['a', 2]],
        }
        const diccionari = ['____1', 'a___2', '__a_3']
        const paraulesFiltrades = filtraParaulesValides(diccionari, estatDeJoc)

        expect(paraulesFiltrades).toEqual(['a___2'])
    })
})
