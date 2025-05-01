import {
  getLettersAmountParam,
  QUANTITAT_LLETRES_PER_DEFECTE,
} from "./getQuantitatLletres";

describe("getLettersAmountParam", () => {
  it("hauria de retornar el valor per defecte si no es passa cap paràmetre", () => {
    expect(getLettersAmountParam(undefined)).toBe(
      QUANTITAT_LLETRES_PER_DEFECTE,
    );
  });

  it("hauria de retornar el valor per defecte si el paràmetre no és un número", () => {
    expect(getLettersAmountParam("abc")).toBe(QUANTITAT_LLETRES_PER_DEFECTE);
  });

  it("hauria de retornar el valor per defecte si el paràmetre no és vàlid", () => {
    expect(getLettersAmountParam("10")).toBe(QUANTITAT_LLETRES_PER_DEFECTE);
  });

  it("hauria de retornar el valor correcte si el paràmetre és vàlid", () => {
    expect(getLettersAmountParam("6")).toBe(6);
  });
});
