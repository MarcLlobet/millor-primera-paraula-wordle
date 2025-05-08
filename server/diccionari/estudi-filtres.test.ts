import fs from 'fs'
import {
    filtradorEntrades,
    filtreCaractersAbecedari,
    filtreInfinitius,
    filtreNomsPropis,
} from '../logic/filtres'
import path from 'path'
import { Entrada } from '../types'
import { describe, expect, it } from 'vitest'

const UTF8_ENCODING = 'utf-8'
const diccionariPath = path.resolve(`./server/diccionari/diccionari.txt`)
const diccionari: string = fs.readFileSync(diccionariPath, UTF8_ENCODING)

const lineas = diccionari.split('\n')

const llistaEntrada = lineas.map((entrada) => entrada.split(' '))

const entradaObjecte: Entrada[] = llistaEntrada.map(([derivada, origen]) => ({
    derivada,
    origen,
}))

export const filtreLlargada = (llargada: number) => {
    const innerFiltreLlargada = ({ origen }: Entrada) => {
        return origen?.length === llargada
    }
    Object.defineProperty(innerFiltreLlargada, 'name', {
        value: `filtreLlargada${llargada}`,
    })
    return innerFiltreLlargada
}

const filtres = [
    filtreLlargada(3),
    filtreLlargada(4),
    filtreLlargada(5),
    filtreLlargada(6),
    filtreLlargada(7),
    filtreInfinitius,
    filtreNomsPropis,
    filtreCaractersAbecedari,
]

const getDosDecimals = (num: number) => Math.round(num * 100) / 100

const numItemsTotal = entradaObjecte.length

const recomptePerFiltre = filtres.map((filtre) => {
    const itemsFiltrats = filtradorEntrades(entradaObjecte, [filtre])
    const numItemsFiltrats = itemsFiltrats.length
    const percentatge = getDosDecimals((100 * numItemsFiltrats) / numItemsTotal)

    return {
        nom: filtre.name,
        num: itemsFiltrats.length,
        percentatge,
    }
})

describe('estudi dels filtres', () => {
    it('fa el recompte', () => {
        expect(recomptePerFiltre).toEqual([
            { nom: 'filtreLlargada3', num: 2984, percentatge: 0.25 },
            { nom: 'filtreLlargada4', num: 9288, percentatge: 0.77 },
            { nom: 'filtreLlargada5', num: 45473, percentatge: 3.78 },
            { nom: 'filtreLlargada6', num: 95466, percentatge: 7.94 },
            { nom: 'filtreLlargada7', num: 146281, percentatge: 12.17 },
            { nom: 'filtreInfinitius', num: 163754, percentatge: 13.62 },
            { nom: 'filtreNomsPropis', num: 1174016, percentatge: 97.65 },
            {
                nom: 'filtreCaractersAbecedari',
                num: 1156203,
                percentatge: 96.17,
            },
        ])
    })
})
