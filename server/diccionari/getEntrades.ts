import {
    filtradorEntrades,
    filtreCaractersAbecedari,
    filtreCaractersValids,
    filtreInfinitius,
    filtreNomsPropis,
    filtreQuantitatLletres,
} from '../logic/filtres'
import type { Entrada } from '../types'

export const getEntrades = (diccionari: string): Entrada[] => {
    const lineas = diccionari.split('\n')

    const llistaEntrada = lineas
        .map((entrada) => entrada.split(' '))
        .filter((entrada) => entrada.length === 3)

    const entradaObjecte = llistaEntrada.map(
        ([derivada, origen, definicio]) => ({
            derivada,
            origen,
            definicio,
        })
    )

    return entradaObjecte
}

export const getEntradesPerParaula = (
    paraules: Entrada[]
): Record<string, Entrada> => {
    const entradesFiltrades = filtradorEntrades(paraules, [
        filtreQuantitatLletres,
        filtreInfinitius,
        filtreNomsPropis,
        filtreCaractersAbecedari,
    ])

    const entradesPerParaula = entradesFiltrades.reduce(
        (prev, entrada) => {
            const paraulaAmbCaractersValids = filtreCaractersValids(
                entrada.origen
            )

            return {
                ...prev,
                [paraulaAmbCaractersValids]: entrada,
            }
        },
        {} as Record<string, Entrada>
    )

    return entradesPerParaula
}
