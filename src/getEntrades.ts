import {
  filtradorItems,
  filtreCaractersAbecedari,
  filtreCaractersValids,
  filtreInfinitius,
  filtreNomsPropis,
  filtreQuantitatLletres,
} from './filtres';
import { Entrada } from './types';

export const getEntrades = (diccionari: string): Entrada[] => {
  const lineas = diccionari.split('\n');

  return lineas.map((entrada) => {
    const [derivada = '', origen = '', definicio = ''] =
      entrada.split(' ') ?? [];
    return {
      derivada,
      origen,
      definicio,
    };
  });
};

export const getEntradesPerParaula = (
  paraules: Entrada[],
): Record<string, Entrada> => {
  const entradesFiltrades = filtradorItems(paraules, [
    filtreQuantitatLletres,
    filtreInfinitius,
    filtreNomsPropis,
    filtreCaractersAbecedari,
  ]);

  const entradesPerParaula = entradesFiltrades.reduce(
    (prev, entrada) => {
      const paraulaAmbCaractersValids = filtreCaractersValids(entrada.origen);

      return {
        ...prev,
        [paraulaAmbCaractersValids]: entrada,
      };
    },
    {} as Record<string, Entrada>,
  );

  return entradesPerParaula;
};
