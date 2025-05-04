import { ABECEDARI } from './constants'
import { QUANTITAT_LLETRES } from './getQuantitatLletres'
import type { Entrada } from '../types'

const MARCA_C_TRENCADA = 'MARCA_C_TRENCADA'

const manipulaParaula = (
    paraula: string,
    manipulacions: ((paraula: string) => string)[]
): string =>
    manipulacions.reduce(
        (paraulaModificada, manipulacio) => manipulacio(paraulaModificada),
        paraula
    )

const manipulaReferenciaLaCTrencada = (paraula: string): string =>
    paraula.replace(/ç/g, MARCA_C_TRENCADA)

const manipulaParaulesNormalitzades = (paraula: string): string =>
    paraula.normalize('NFD')
const manipulaParaulaSenseTitlles = (paraula: string): string =>
    paraula.replace(/[\u0300-\u036f]/g, '')
const manipulaRecuperarLaCTrencada = (paraula: string): string =>
    paraula.replace(new RegExp(MARCA_C_TRENCADA, 'g'), 'ç')

export const filtreCaractersValids = (paraula: string): string =>
    manipulaParaula(paraula, [
        manipulaReferenciaLaCTrencada,
        manipulaParaulesNormalitzades,
        manipulaParaulaSenseTitlles,
        manipulaRecuperarLaCTrencada,
    ])

export const filtradorItems = <T>(
    items: T[],
    filtres: ((item: T) => boolean)[]
): T[] => filtres.reduce((prevItems, filtre) => prevItems.filter(filtre), items)

export const filtreQuantitatLletres = ({ origen }: Entrada): boolean =>
    origen?.length === QUANTITAT_LLETRES

export const filtreInfinitius = ({ origen, derivada }: Entrada): boolean =>
    origen === derivada

export const filtreNomsPropis = ({ origen }: Entrada): boolean =>
    origen.toLowerCase() === origen

export const filtreCaractersAbecedari = ({ origen }: Entrada): boolean => {
    const paraulaAmbCaractersValids = filtreCaractersValids(origen)
    return paraulaAmbCaractersValids
        .split('')
        .every((lletra) => ABECEDARI.includes(lletra))
}

export const filtreCaractersUnics = (paraula: string): boolean =>
    paraula.length === new Set(paraula).size
