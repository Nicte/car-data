import {
  rollingSalesEndMonth,
  rollingSalesLabel,
  rollingSalesRankByCarId,
  rollingSalesStartMonth,
  rollingSalesUnitsByCarId,
  rollingSalesWindowMonths,
} from "@/data/sales-rolling-12m"

export type PowertrainType =
  | "gasoline"
  | "diesel"
  | "hybrid"
  | "mhev"
  | "phev"
  | "electric"
  | "lpg"

export type TransmissionType = "manual" | "automatic"

export type DgtLabel = "B" | "C" | "ECO" | "CERO"

export type BodyType = "utilitario" | "compacto" | "suv-urbano" | "suv-compacto"

export type Car = {
  id: string
  brand: string
  model: string
  bodyType: BodyType
  salesRank12m: number
  salesUnits12m: number
  powertrains: PowertrainType[]
  transmissions: TransmissionType[]
  dgtLabels: DgtLabel[]
  lengthMm: number
  widthMm: number
  trunkLiters: number
  imageUrl: string
}

export const powertrainLabels: Record<PowertrainType, string> = {
  gasoline: "Gasolina",
  diesel: "Diesel",
  hybrid: "Hibrido",
  mhev: "Microhibrido (MHEV)",
  phev: "Hibrido enchufable (PHEV)",
  electric: "Electrico",
  lpg: "GLP",
}

export const transmissionLabels: Record<TransmissionType, string> = {
  manual: "Manual",
  automatic: "Automatico",
}

export const dgtLabelLabels: Record<DgtLabel, string> = {
  B: "Etiqueta B",
  C: "Etiqueta C",
  ECO: "Etiqueta ECO",
  CERO: "Etiqueta Cero",
}

export const bodyTypeLabels: Record<BodyType, string> = {
  utilitario: "Utilitario",
  compacto: "Compacto",
  "suv-urbano": "SUV urbano",
  "suv-compacto": "SUV compacto",
}

export const carsSpainTopSalesRolling12m: Car[] = [
  {
    id: "dacia-sandero",
    brand: "Dacia",
    model: "Sandero",
    bodyType: "utilitario",
    salesRank12m: rollingSalesRankByCarId["dacia-sandero"],
    salesUnits12m: rollingSalesUnitsByCarId["dacia-sandero"],
    powertrains: ["gasoline", "lpg"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO"],
    lengthMm: 4102,
    widthMm: 1848,
    trunkLiters: 328,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/2023_Dacia_Sandero_III_DSC_6012.jpg",
  },
  {
    id: "renault-clio",
    brand: "Renault",
    model: "Clio",
    bodyType: "utilitario",
    salesRank12m: rollingSalesRankByCarId["renault-clio"],
    salesUnits12m: rollingSalesUnitsByCarId["renault-clio"],
    powertrains: ["gasoline", "hybrid"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO"],
    lengthMm: 4053,
    widthMm: 1798,
    trunkLiters: 391,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Renault_Clio_%28V%2C_Facelift%29_%E2%80%93_f_02092025.jpg",
  },
  {
    id: "mg-zs",
    brand: "MG",
    model: "ZS",
    bodyType: "suv-compacto",
    salesRank12m: rollingSalesRankByCarId["mg-zs"],
    salesUnits12m: rollingSalesUnitsByCarId["mg-zs"],
    powertrains: ["gasoline", "hybrid"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO"],
    lengthMm: 4432,
    widthMm: 1809,
    trunkLiters: 443,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/2018_SAIC-MG_ZS%2C_front_8.11.18.jpg",
  },
  {
    id: "seat-ibiza",
    brand: "SEAT",
    model: "Ibiza",
    bodyType: "utilitario",
    salesRank12m: rollingSalesRankByCarId["seat-ibiza"],
    salesUnits12m: rollingSalesUnitsByCarId["seat-ibiza"],
    powertrains: ["gasoline"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C"],
    lengthMm: 4059,
    widthMm: 1780,
    trunkLiters: 355,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/2018_SEAT_Ibiza_SE_Technology_MPi_1.0_Front.jpg",
  },
  {
    id: "hyundai-tucson",
    brand: "Hyundai",
    model: "Tucson",
    bodyType: "suv-compacto",
    salesRank12m: rollingSalesRankByCarId["hyundai-tucson"],
    salesUnits12m: rollingSalesUnitsByCarId["hyundai-tucson"],
    powertrains: ["gasoline", "diesel", "mhev", "hybrid", "phev"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO", "CERO"],
    lengthMm: 4510,
    widthMm: 1865,
    trunkLiters: 577,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg",
  },
  {
    id: "toyota-corolla",
    brand: "Toyota",
    model: "Corolla",
    bodyType: "compacto",
    salesRank12m: rollingSalesRankByCarId["toyota-corolla"],
    salesUnits12m: rollingSalesUnitsByCarId["toyota-corolla"],
    powertrains: ["hybrid"],
    transmissions: ["automatic"],
    dgtLabels: ["ECO"],
    lengthMm: 4370,
    widthMm: 1790,
    trunkLiters: 361,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg",
  },
  {
    id: "seat-arona",
    brand: "SEAT",
    model: "Arona",
    bodyType: "suv-urbano",
    salesRank12m: rollingSalesRankByCarId["seat-arona"],
    salesUnits12m: rollingSalesUnitsByCarId["seat-arona"],
    powertrains: ["gasoline"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C"],
    lengthMm: 4154,
    widthMm: 1780,
    trunkLiters: 400,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/2018_SEAT_Arona_SE_Technology_TSi_1.0_Front_%281%29.jpg",
  },
  {
    id: "peugeot-2008",
    brand: "Peugeot",
    model: "2008",
    bodyType: "suv-urbano",
    salesRank12m: rollingSalesRankByCarId["peugeot-2008"],
    salesUnits12m: rollingSalesUnitsByCarId["peugeot-2008"],
    powertrains: ["gasoline", "mhev", "electric"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO", "CERO"],
    lengthMm: 4304,
    widthMm: 1770,
    trunkLiters: 434,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f7/2023_Peugeot_2008_in_Vertigo_Blue%2C_front_left%2C_06-08-2025.jpg",
  },
  {
    id: "peugeot-208",
    brand: "Peugeot",
    model: "208",
    bodyType: "utilitario",
    salesRank12m: rollingSalesRankByCarId["peugeot-208"],
    salesUnits12m: rollingSalesUnitsByCarId["peugeot-208"],
    powertrains: ["gasoline", "mhev", "electric"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO", "CERO"],
    lengthMm: 4055,
    widthMm: 1745,
    trunkLiters: 352,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/Peugeot_208_PureTech_130_EAT8_Allure_GT-Line_%28II%29_%E2%80%93_f_17102021.jpg",
  },
  {
    id: "nissan-qashqai",
    brand: "Nissan",
    model: "Qashqai",
    bodyType: "suv-compacto",
    salesRank12m: rollingSalesRankByCarId["nissan-qashqai"],
    salesUnits12m: rollingSalesUnitsByCarId["nissan-qashqai"],
    powertrains: ["mhev", "hybrid"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["ECO"],
    lengthMm: 4425,
    widthMm: 1835,
    trunkLiters: 504,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/2024_Nissan_Qashqai_e-Power_IMG_2187.jpg",
  },
  {
    id: "toyota-c-hr",
    brand: "Toyota",
    model: "C-HR",
    bodyType: "suv-compacto",
    salesRank12m: rollingSalesRankByCarId["toyota-c-hr"],
    salesUnits12m: rollingSalesUnitsByCarId["toyota-c-hr"],
    powertrains: ["hybrid", "phev"],
    transmissions: ["automatic"],
    dgtLabels: ["ECO", "CERO"],
    lengthMm: 4362,
    widthMm: 1832,
    trunkLiters: 388,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/Toyota_C-HR_Hybrid_%28AX20%29_DSC_7239.jpg",
  },
  {
    id: "toyota-yaris-cross",
    brand: "Toyota",
    model: "Yaris Cross",
    bodyType: "suv-urbano",
    salesRank12m: rollingSalesRankByCarId["toyota-yaris-cross"],
    salesUnits12m: rollingSalesUnitsByCarId["toyota-yaris-cross"],
    powertrains: ["hybrid"],
    transmissions: ["automatic"],
    dgtLabels: ["ECO"],
    lengthMm: 4180,
    widthMm: 1765,
    trunkLiters: 397,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg",
  },
  {
    id: "renault-captur",
    brand: "Renault",
    model: "Captur",
    bodyType: "suv-urbano",
    salesRank12m: rollingSalesRankByCarId["renault-captur"],
    salesUnits12m: rollingSalesUnitsByCarId["renault-captur"],
    powertrains: ["gasoline", "mhev", "hybrid"],
    transmissions: ["manual", "automatic"],
    dgtLabels: ["C", "ECO"],
    lengthMm: 4239,
    widthMm: 1797,
    trunkLiters: 422,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/03/2024_Renault_Captur_II_Automesse_Ludwigsburg_2024_IMG_1506.jpg",
  },
]

export const dataLastUpdated = "2026-03-08"
export const salesWindowMonths = rollingSalesWindowMonths
export const salesWindowStartMonth = rollingSalesStartMonth
export const salesWindowEndMonth = rollingSalesEndMonth
export const salesWindowLabel = rollingSalesLabel

export const dataSources = {
  salesRanking: {
    title: "DGT - Microdatos de Matriculaciones de Vehiculos (mensual, acceso a listados)",
    url: "https://www.dgt.es/menusecundario/dgt-en-cifras/matraba-listados/matriculaciones-automoviles-mensual.html",
  },
  dimensionsAndPowertrains: {
    title: "Automobile Dimension - fichas por modelo (longitud, anchura y maletero)",
    url: "https://www.automobiledimension.com/",
  },
  dgtCriteria: {
    title: "DGT - Etiquetas ambientales y criterios",
    url: "https://www.dgt.es/nuestros-servicios/tu-vehiculo/medio-ambiente/distintivo-ambiental/",
  },
  daciaSanderoPowertrains: {
    title: "Dacia Sandero - motores ECO-G / gasolina",
    url: "https://www.dacia.es/gama/sandero.html",
  },
  images: {
    title: "Wikipedia REST API summaries (imagenes de modelos)",
    url: "https://en.wikipedia.org/api/rest_v1/",
  },
} as const
