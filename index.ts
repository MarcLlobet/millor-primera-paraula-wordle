import fs from 'fs';
import { QUANTITAT_LLETRES } from './src/getQuantitatLletres';
import { getEntrades, getEntradesPerParaula } from './src/getEntrades';
import { ABECEDARI } from './src/constants';
import { filtradorItems, filtreCaractersUnics } from './src/filtres';

const diccionari: string = fs.readFileSync('./diccionari/index.txt', 'utf-8');

console.time('performance');

console.log({ QUANTITAT_LLETRES });

const totesLesEntrades = getEntrades(diccionari);
const entradesPerParaula = getEntradesPerParaula(totesLesEntrades);
const totesLesParaules = Object.keys(entradesPerParaula);

type QuantitatIPosicio = {
  quantitat: number;
  posicio: number;
};

const getQuantitatIPosicions = (): QuantitatIPosicio[] =>
  Array(QUANTITAT_LLETRES)
    .fill(null)
    .map((_, posicio) => ({ quantitat: 0, posicio }));

const lletresAbecedari = ABECEDARI.split('');

type Lletra = {
  lletra: string;
};

type RecompteLletraAmbPosicions = Lletra & {
  total: number;
  quantitatIPosicions: QuantitatIPosicio[];
};

type RecomptePerLletra = {
  [lletra: string]: RecompteLletraAmbPosicions;
};

const recomptePerLletra = lletresAbecedari.reduce(
  (prev, lletra) => ({
    ...prev,
    [lletra]: {
      lletra,
      quantitatIPosicions: getQuantitatIPosicions(),
      total: 0,
    },
  }),
  {} as RecomptePerLletra,
);

totesLesParaules.forEach((paraula) =>
  paraula.split('').forEach((lletra, index) => {
    const lletraDiccionari = recomptePerLletra[lletra];
    lletraDiccionari.quantitatIPosicions[index].quantitat++;
    lletraDiccionari.total++;
  }),
);

const paraulesCaractersUnics = filtradorItems(totesLesParaules, [
  filtreCaractersUnics,
]);

const paraulesRestants = paraulesCaractersUnics;

const lletresOrdenades = Object.values(recomptePerLletra)
  .map((lletra) => ({
    ...lletra,
    quantitatIPosicions: [...lletra.quantitatIPosicions].sort(
      (a, b) => b.quantitat - a.quantitat,
    ),
  }))
  .sort((a, b) => b.total - a.total);

type RecompteLletraAmbPosicio = Lletra & QuantitatIPosicio;

type ItemsAfegits = {
  lletres: RecompteLletraAmbPosicio[];
  posicionsJaUsades: number[];
  lletresJaUsades: string[];
};

type MillorLletres = ItemsAfegits & {
  paraulesRestants: string[];
};

const getSeguentLletra = (
  prev: MillorLletres,
): RecompteLletraAmbPosicions | undefined => {
  const seguentLletra = lletresOrdenades.find(
    ({ quantitatIPosicions, lletra }) => {
      if (prev.lletresJaUsades?.includes(lletra)) return;

      const seguentPosicio = quantitatIPosicions.find(({ posicio }) => {
        if (prev.posicionsJaUsades?.includes(posicio)) return;

        return prev.paraulesRestants.find(
          (paraula) => lletra === paraula[posicio],
        );
      });
      return seguentPosicio ?? undefined;
    },
  );
  return seguentLletra;
};

const getSeguentQuantitatIPosicio = (
  metaLletra: RecompteLletraAmbPosicions,
  paraulesRestants: string[],
) => {
  const { lletra, quantitatIPosicions } = metaLletra;
  return quantitatIPosicions.find(({ posicio }) =>
    paraulesRestants.some((paraula) => lletra === paraula[posicio]),
  );
};

type GetParaulesRestants = {
  paraulesRestants: string[];
  posicio: number;
  lletra: string;
};

const getParaulesRestants = ({
  paraulesRestants,
  posicio,
  lletra,
}: GetParaulesRestants) =>
  paraulesRestants.filter((paraula) => paraula[posicio] === lletra);

type GetItemsAfegits = {
  quantitat: number;
  lletra: string;
  posicio: number;
};

const getItemsAfegits = (
  { quantitat, lletra, posicio }: GetItemsAfegits,
  prev: MillorLletres,
): ItemsAfegits => {
  const novaLletra = {
    lletra,
    quantitat,
    posicio,
  };

  const lletres = [...(prev?.lletres ?? []), novaLletra];

  const posicionsJaUsades = [...(prev?.posicionsJaUsades ?? []), posicio];

  const lletresJaUsades = [...(prev?.lletresJaUsades ?? []), lletra];

  return {
    lletres,
    posicionsJaUsades,
    lletresJaUsades,
  };
};

const millorLletres = Array(QUANTITAT_LLETRES)
  .fill(null)
  .reduce(
    (prev: MillorLletres) => {
      const seguentLletra = getSeguentLletra(prev);

      if (!seguentLletra) return prev;

      const seguentQuantitatIPosicio = getSeguentQuantitatIPosicio(
        seguentLletra,
        prev.paraulesRestants,
      );

      if (!seguentQuantitatIPosicio) return prev;

      const { quantitat, posicio } = seguentQuantitatIPosicio;
      const { lletra } = seguentLletra;

      const paraulesRestants = getParaulesRestants({
        paraulesRestants: prev?.paraulesRestants,
        posicio,
        lletra,
      });

      const { lletres, posicionsJaUsades, lletresJaUsades } = getItemsAfegits(
        {
          quantitat,
          lletra,
          posicio,
        },
        prev,
      );

      return {
        paraulesRestants,
        lletres,
        posicionsJaUsades,
        lletresJaUsades,
      };
    },
    {
      paraulesRestants,
      lletres: [],
      posicionsJaUsades: [],
      lletresJaUsades: [],
    } as MillorLletres,
  );

const millorParaula = millorLletres.lletres.reduce(
  (prev, { posicio, lletra }) => {
    const paraula = [...prev];
    paraula[posicio] = lletra;
    return paraula;
  },
  [] as string[],
);

const millorEntrada = entradesPerParaula[millorParaula.join('')];

console.log({ millorEntrada });

console.timeEnd('performance');
