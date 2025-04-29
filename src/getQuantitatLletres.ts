const QUANTITAT_LLETRES_PER_DEFECTE = 5;
const MAX_QUANTITAT_LLETRES = 7;
const MIN_QUANTITAT_LLETRES = 3;

export const getLettersAmountParam = (numLletresParam: string | undefined): number => {
  if (!numLletresParam) return QUANTITAT_LLETRES_PER_DEFECTE;

  const quantitatLletresParametre = Number(numLletresParam);

  const esUnNumero = !Number.isNaN(quantitatLletresParametre);

  if (!esUnNumero) return QUANTITAT_LLETRES_PER_DEFECTE;

  const numeroLimitat = Math.max(
    Math.min(quantitatLletresParametre, MAX_QUANTITAT_LLETRES),
    MIN_QUANTITAT_LLETRES
  );

  return numeroLimitat === quantitatLletresParametre
    ? numeroLimitat
    : QUANTITAT_LLETRES_PER_DEFECTE;
};

const NUM_LLETRES = process.env.NUM_LLETRES;

export const QUANTITAT_LLETRES = getLettersAmountParam(NUM_LLETRES);