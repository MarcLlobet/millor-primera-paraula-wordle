import {
    getTotesLesEntradesPerParaula,
    getTotesLesParaules,
} from '../diccionari'
import { getMillorParaula } from './getMillorParaula'
import { QUANTITAT_LLETRES } from './getQuantitatLletres'

export const getMillorEntrada = () => {
    const entradesPerParaula = getTotesLesEntradesPerParaula()
    const totesLesParaules = getTotesLesParaules()
    const millorParaula = getMillorParaula(totesLesParaules, QUANTITAT_LLETRES)

    const millorEntrada = entradesPerParaula[millorParaula.join('')]

    return millorEntrada
}
