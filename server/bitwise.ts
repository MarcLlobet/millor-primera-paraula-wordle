type LletraPosicio = [lletra: string, posicio: number]

export type EstatWordle = {
    llargada: number
    encerts: LletraPosicio[]
    descartades: string[]
    malColocades: LletraPosicio[]
}

type Validator = (paraula: string) => boolean
type CurryValidator = (estat: EstatWordle) => Validator

// Conversió de lletra a bit
const indexAbecedari = 97
export const convertirLletraABit = (lletra: string): number =>
    1 << (lletra.charCodeAt(0) - indexAbecedari)

// Crea una màscara bitwise
export const crearMascaraBitwise = (paraula: string[]): number =>
    paraula.map(convertirLletraABit).reduce((bitmask, bit) => bitmask | bit, 0)

// Valida si la paraula té la llargada correcta
export const validaLlargada: CurryValidator =
    ({ llargada }) =>
    (paraula) =>
        paraula.length === llargada

// Valida si les lletres encertades són a la posició correcta
export const validaEncerts: CurryValidator =
    ({ encerts }) =>
    (paraula) =>
        encerts.every(
            ([lletraCorrecta, posicio]) => paraula[posicio] === lletraCorrecta
        )

// Valida que cap lletra descartada aparegui a la paraula
export const validaAbsenciaLletresDescartades: CurryValidator = ({
    descartades,
}) => {
    const mascaraDescartades = crearMascaraBitwise(descartades)

    return (paraula) => {
        const mascaraParaula = crearMascaraBitwise(paraula.split(''))
        const capLletraDescartadaPresent =
            (mascaraParaula & mascaraDescartades) === 0
        return capLletraDescartadaPresent
    }
}

// Valida que totes les lletres mal col·locades siguin presents
export const validaPresenciaMalColocades: CurryValidator = ({
    malColocades,
}) => {
    const lletres = malColocades.map(([lletra]) => lletra)
    const [...lletresNoRepetides] = new Set(lletres)

    const mascaraObligatoriaBitwise = crearMascaraBitwise(lletresNoRepetides)

    return (paraula) => {
        const mascaraParaula = crearMascaraBitwise(paraula.split(''))
        const totesLletresObligatoriesPresents =
            (mascaraParaula & mascaraObligatoriaBitwise) ===
            mascaraObligatoriaBitwise
        return totesLletresObligatoriesPresents
    }
}

// Valida que les lletres mal col·locades **no estiguin** a la posició equivocada
export const validaAbsenciaMalColocades: CurryValidator =
    ({ malColocades }) =>
    (paraula) =>
        malColocades.every(
            ([lletra, posicioProhibida]) => paraula[posicioProhibida] !== lletra
        )

// Aplica totes les validacions d'una sola passada
export const filtraParaulesValides = (
    diccionari: string[],
    estat: EstatWordle
): string[] => {
    const curryValidadors: CurryValidator[] = [
        validaLlargada,
        validaEncerts,
        validaAbsenciaLletresDescartades,
        validaAbsenciaMalColocades,
        validaPresenciaMalColocades,
    ]

    const validators: Validator[] = curryValidadors.map((validador) =>
        validador(estat)
    )

    return diccionari.filter((paraula) =>
        validators.every((validador) => validador(paraula))
    )
}
