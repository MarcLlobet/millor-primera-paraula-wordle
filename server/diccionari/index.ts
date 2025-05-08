import fs from 'fs'
import path from 'path'
import { getEntrades, getEntradesPerParaula } from './getEntrades'

const UTF8_ENCODING = 'utf-8'

const testFileExtension = process.env.TEST === 'test' ? '-test' : ''

export const getDiccionari = () => {
    const diccionariPath = path.resolve(
        `./server/diccionari/diccionari${testFileExtension}.txt`
    )
    const diccionari: string = fs.readFileSync(diccionariPath, UTF8_ENCODING)
    return diccionari
}

export const getTotesLesEntrades = () => {
    const diccionari = getDiccionari()
    const totesLesEntrades = getEntrades(diccionari)
    return totesLesEntrades
}

export const getEntradesOriginals = () => {
    const totesLesEntrades = getTotesLesEntrades()
    return totesLesEntrades.map(({ origen }) => origen)
}

export const getTotesLesEntradesPerParaula = () => {
    const totesLesEntrades = getTotesLesEntrades()
    const entradesPerParaula = getEntradesPerParaula(totesLesEntrades)
    return entradesPerParaula
}

export const getTotesLesParaules = () => {
    const totesLesEntradesPerParaula = getTotesLesEntradesPerParaula()
    const totesLesParaules = Object.keys(totesLesEntradesPerParaula)
    return totesLesParaules
}
