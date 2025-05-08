import { QUANTITAT_LLETRES } from './getQuantitatLletres'
import { ABECEDARI } from './constants'
import { filtradorParaules, filtreCaractersUnics } from './filtres'

type QuantitatIPosicio = {
    quantitat: number
    posicio: number
}

export const getParaulaBuida = (llargada: number) => Array(llargada).fill(null)

export const getQuantitatIPosicions = (
    llargada: number
): QuantitatIPosicio[] => {
    const paraulaBuida = getParaulaBuida(llargada)
    return paraulaBuida.map((_, posicio) => ({ quantitat: 0, posicio }))
}

type Lletra = {
    lletra: string
}

type RecompteLletraAmbPosicions = Lletra & {
    total: number
    quantitatIPosicions: QuantitatIPosicio[]
}

type RecomptePerLletra = {
    [lletra: string]: RecompteLletraAmbPosicions
}

type LletresOrdenades = {
    quantitatIPosicions: QuantitatIPosicio[]
    lletra: string
    total: number
}

export const getLletresOrdenades = (
    paraules: string[],
    llargada: number
): LletresOrdenades[] => {
    const lletresAbecedari = ABECEDARI.split('')

    const recomptePerLletra = lletresAbecedari.reduce(
        (prev, lletra) => ({
            ...prev,
            [lletra]: {
                lletra,
                quantitatIPosicions: getQuantitatIPosicions(llargada),
                total: 0,
            },
        }),
        {} as RecomptePerLletra
    )

    paraules.forEach((paraula) =>
        paraula.split('').forEach((lletra, index) => {
            const lletraDiccionari = recomptePerLletra[lletra]
            lletraDiccionari.quantitatIPosicions[index].quantitat++
            lletraDiccionari.total++
        })
    )

    const lletresOrdenades = Object.values(recomptePerLletra)
        .map((lletra) => ({
            ...lletra,
            quantitatIPosicions: [...lletra.quantitatIPosicions].sort(
                (a, b) => b.quantitat - a.quantitat
            ),
        }))
        .sort((a, b) => b.total - a.total)

    return lletresOrdenades
}

type RecompteLletraAmbPosicio = Lletra & QuantitatIPosicio

type ItemsAfegits = {
    lletres: RecompteLletraAmbPosicio[]
    posicionsJaUsades: number[]
    lletresJaUsades: string[]
}

export type MillorLletres = ItemsAfegits & {
    paraulesRestants: string[]
}

export const getSeguentLletra = (
    prev: MillorLletres,
    lletresOrdenades: LletresOrdenades[]
): RecompteLletraAmbPosicions | undefined => {
    const seguentLletra = lletresOrdenades.find(
        ({ quantitatIPosicions, lletra }) => {
            if (prev.lletresJaUsades?.includes(lletra)) return

            const seguentPosicio = quantitatIPosicions.find(({ posicio }) => {
                if (prev.posicionsJaUsades?.includes(posicio)) return

                return prev.paraulesRestants.find(
                    (paraula) => lletra === paraula[posicio]
                )
            })
            return seguentPosicio ?? undefined
        }
    )
    return seguentLletra
}

export const getSeguentQuantitatIPosicio = (
    metaLletra: RecompteLletraAmbPosicions,
    paraulesRestants: string[]
) => {
    const { lletra, quantitatIPosicions } = metaLletra
    return quantitatIPosicions.find(({ posicio }) =>
        paraulesRestants.some((paraula) => lletra === paraula[posicio])
    )
}

type GetParaulesRestants = {
    paraulesRestants: string[]
    posicio: number
    lletra: string
}

export const getParaulesRestants = ({
    paraulesRestants,
    posicio,
    lletra,
}: GetParaulesRestants) =>
    paraulesRestants.filter((paraula) => paraula[posicio] === lletra)

type GetItemsAfegits = {
    quantitat: number
    lletra: string
    posicio: number
}

export const getItemsAfegits = (
    { quantitat, lletra, posicio }: GetItemsAfegits,
    prev: MillorLletres
): ItemsAfegits => {
    const novaLletra = {
        lletra,
        quantitat,
        posicio,
    }

    const lletres = [...(prev?.lletres ?? []), novaLletra]

    const posicionsJaUsades = [...(prev?.posicionsJaUsades ?? []), posicio]

    const lletresJaUsades = [...(prev?.lletresJaUsades ?? []), lletra]

    return {
        lletres,
        posicionsJaUsades,
        lletresJaUsades,
    }
}

export const getMillorLletres = (
    paraulesRestants: string[],
    lletresOrdenades: LletresOrdenades[]
) =>
    Array(QUANTITAT_LLETRES)
        .fill(null)
        .reduce(
            (prev: MillorLletres) => {
                const seguentLletra = getSeguentLletra(prev, lletresOrdenades)

                if (!seguentLletra) return prev

                const seguentQuantitatIPosicio = getSeguentQuantitatIPosicio(
                    seguentLletra,
                    prev.paraulesRestants
                )

                if (!seguentQuantitatIPosicio) return prev

                const { quantitat, posicio } = seguentQuantitatIPosicio
                const { lletra } = seguentLletra

                const paraulesRestants = getParaulesRestants({
                    paraulesRestants: prev?.paraulesRestants,
                    posicio,
                    lletra,
                })

                const { lletres, posicionsJaUsades, lletresJaUsades } =
                    getItemsAfegits(
                        {
                            quantitat,
                            lletra,
                            posicio,
                        },
                        prev
                    )

                return {
                    paraulesRestants,
                    lletres,
                    posicionsJaUsades,
                    lletresJaUsades,
                }
            },
            {
                paraulesRestants,
                lletres: [],
                posicionsJaUsades: [],
                lletresJaUsades: [],
            } as MillorLletres
        )

export const getParaulaDeLletres = (lletres: RecompteLletraAmbPosicio[]) =>
    lletres.reduce((prev, { posicio, lletra }) => {
        const paraula = [...prev]
        paraula[posicio] = lletra
        return paraula
    }, [] as string[])

export const getMillorParaula = (paraules: string[], llargada: number) => {
    console.time('performance')

    const lletresOrdenades = getLletresOrdenades(paraules, llargada)

    const paraulesCaractersUnics = filtradorParaules(paraules, [
        filtreCaractersUnics,
    ])

    const paraulesRestants = paraulesCaractersUnics

    const millorLletres = getMillorLletres(paraulesRestants, lletresOrdenades)
    const millorParaula = getParaulaDeLletres(millorLletres.lletres)

    console.timeEnd('performance')
    return millorParaula
}
