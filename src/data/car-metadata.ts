export type MetadataPowertrainType =
  | "gasoline"
  | "diesel"
  | "hybrid"
  | "mhev"
  | "phev"
  | "electric"
  | "lpg"

export type MetadataTransmissionType = "manual" | "automatic"
export type MetadataDgtLabel = "B" | "C" | "ECO" | "CERO"
export type MetadataBodyType =
  | "utilitario"
  | "compacto"
  | "suv-urbano"
  | "suv-compacto"

export type MetadataCarVersion = {
  id: string
  powertrain: MetadataPowertrainType
  transmission: MetadataTransmissionType
  dgtLabel: MetadataDgtLabel
}

export type CarMetadata = {
  bodyType?: MetadataBodyType
  versions?: MetadataCarVersion[]
  lengthMm?: number
  widthMm?: number
  trunkLiters?: number
  imageUrl?: string
  canonicalModelId?: string
  canonicalBrand?: string
  canonicalModel?: string
  canonicalName?: string
}

// Persistent metadata cache keyed by generated rollingSalesTopModels ids.
// Update only when a new model appears with N/D in the UI.
export const carMetadataById: Record<string, CarMetadata> = {
  "dacia-sandero": {
    bodyType: "utilitario",
    versions: [
      {
        id: "tce-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tce-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "eco-g-manual",
        powertrain: "lpg",
        transmission: "manual",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4102,
    widthMm: 1848,
    trunkLiters: 328,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/2023_Dacia_Sandero_III_DSC_6012.jpg",
  },
  "renault-clio": {
    bodyType: "utilitario",
    versions: [
      {
        id: "tce-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "e-tech-auto",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4053,
    widthMm: 1798,
    trunkLiters: 391,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/Renault_Clio_%28V%2C_Facelift%29_%E2%80%93_f_02092025.jpg",
  },
  "seat-ibiza": {
    bodyType: "utilitario",
    versions: [
      {
        id: "tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tsi-dsg",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4059,
    widthMm: 1780,
    trunkLiters: 355,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/84/2018_SEAT_Ibiza_SE_Technology_MPi_1.0_Front.jpg",
  },
  "mg-mg-zs": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "zs-gas-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "zs-hybrid-auto",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4432,
    widthMm: 1809,
    trunkLiters: 443,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2c/2018_SAIC-MG_ZS%2C_front_8.11.18.jpg",
  },
  "toyota-toyota-corolla": {
    bodyType: "compacto",
    versions: [
      {
        id: "corolla-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4370,
    widthMm: 1790,
    trunkLiters: 361,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/fe/Toyota_Corolla_Hybrid_%28E210%29_IMG_4338.jpg",
  },
  "seat-arona": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "arona-tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "arona-tsi-dsg",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4154,
    widthMm: 1780,
    trunkLiters: 400,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c8/2018_SEAT_Arona_SE_Technology_TSi_1.0_Front_%281%29.jpg",
  },
  "hyundai-tucson": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "tgdi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "crdi-auto",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "hybrid-auto",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "phev-auto",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4510,
    widthMm: 1865,
    trunkLiters: 577,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/2022_Hyundai_Tucson_Preferred%2C_Front_Right%2C_05-24-2021.jpg",
  },
  "toyota-toyota-c-hr": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "chr-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "chr-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4362,
    widthMm: 1832,
    trunkLiters: 388,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/Toyota_C-HR_Hybrid_%28AX20%29_DSC_7239.jpg",
  },
  "nissan-nissan-qashqai": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "mhev-manual",
        powertrain: "mhev",
        transmission: "manual",
        dgtLabel: "ECO",
      },
      {
        id: "e-power-auto",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4425,
    widthMm: 1835,
    trunkLiters: 504,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/2024_Nissan_Qashqai_e-Power_IMG_2187.jpg",
  },
  "toyota-toyota-yaris-cross": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "yaris-cross-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4180,
    widthMm: 1765,
    trunkLiters: 397,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f4/Toyota_Yaris_Cross_Hybrid_%28XP210%29_1X7A1846.jpg",
  },
  "volkswagen-t-roc": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "troc-tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "troc-tdi-auto",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4236,
    widthMm: 1819,
    trunkLiters: 445,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/VW_T-Roc_1.5_TSI_Style_%E2%80%93_f_03012021.jpg",
  },
  "volkswagen-tiguan": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "tiguan-etsi",
        powertrain: "mhev",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "tiguan-tdi",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "tiguan-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4539,
    widthMm: 1842,
    trunkLiters: 652,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/50/VW_Tiguan_1.5_eTSI_R-Line_%28III%29_%E2%80%93_f_18052025.jpg",
  },
  "toyota-toyota-yaris": {
    bodyType: "utilitario",
    versions: [
      {
        id: "yaris-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 3940,
    widthMm: 1745,
    trunkLiters: 286,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3e/2020_Toyota_Yaris_Design_HEV_CVT_1.5_Front.jpg",
  },
  "kia-sportage": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "sportage-gdi",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "sportage-crdi",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "sportage-hev",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "sportage-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4515,
    widthMm: 1865,
    trunkLiters: 591,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/2025_Kia_Sportage_S_front_only.jpg",
  },
  "kia-ceed": {
    bodyType: "compacto",
    versions: [
      {
        id: "ceed-gdi",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "ceed-crdi",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "ceed-mhev",
        powertrain: "mhev",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4355,
    widthMm: 1800,
    trunkLiters: 395,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/2018_Kia_Ceed_First_Edition_1.4_Front.jpg",
  },
  "volkswagen-golf": {
    bodyType: "compacto",
    versions: [
      {
        id: "golf-tsi",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "golf-tdi",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "golf-etsi",
        powertrain: "mhev",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "golf-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4282,
    widthMm: 1789,
    trunkLiters: 381,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg",
  },
  "hyundai-kona": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "kona-gas",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "kona-hev",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "kona-ev",
        powertrain: "electric",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4350,
    widthMm: 1825,
    trunkLiters: 466,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/Hyundai_Kona_%28SX2%29_IMG_8762_%28cropped%29.jpg",
  },
  "volkswagen-taigo": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "taigo-tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "taigo-tsi-dsg",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4266,
    widthMm: 1757,
    trunkLiters: 438,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Volkswagen_Taigo_1X7A0350.jpg",
  },
  "dacia-duster": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "duster-tce",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "duster-eco-g",
        powertrain: "lpg",
        transmission: "manual",
        dgtLabel: "ECO",
      },
      {
        id: "duster-hev",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4343,
    widthMm: 1813,
    trunkLiters: 472,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Dacia_Duster_TCe_130_Extreme_%28III%29_%E2%80%93_f_13102024.jpg",
  },
  "kia-stonic": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "stonic-gdi",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "stonic-mhev",
        powertrain: "mhev",
        transmission: "manual",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4140,
    widthMm: 1760,
    trunkLiters: 352,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/7/74/2017_Kia_Stonic_First_Edition_1.0.jpg",
  },
  "toyota-toyota-rav4": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "rav4-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "rav4-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4600,
    widthMm: 1855,
    trunkLiters: 580,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/62/Toyota_RAV4_XLE_%28facelift%29_%28front%29.jpg",
  },
  "omoda-omoda5": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "omoda5-gas",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4230,
    widthMm: 1840,
    trunkLiters: 405,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chery%20Omoda%205%20003.jpg",
  },
  "omoda-omoda-9-phev": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "omoda9-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4615,
    widthMm: 1900,
    trunkLiters: 460,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Omoda%209%20IAA%202025%20DSC%202242.jpg",
  },
  "jaecoo-jaecoo7-phev": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "jaecoo7-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4400,
    widthMm: 1850,
    trunkLiters: 420,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jaecoo%207%20front%20view%2001.png",
  },
  "ebro-s700": {
    versions: [
      {
        id: "s700-dci",
        powertrain: "diesel",
        transmission: "manual",
        dgtLabel: "C",
      },
    ],
    lengthMm: 6025,
    widthMm: 2050,
    trunkLiters: 13800,
    imageUrl:
      "https://cdn.prod.website-files.com/672341df822e37f60ade73da/69426d34f56fa477167f5c98_img_home_S700.png",
  },
  "ebro-s400-hev": {
    versions: [
      {
        id: "s400-hev",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 5550,
    widthMm: 2050,
    trunkLiters: 10000,
    imageUrl:
      "https://cdn.prod.website-files.com/672341df822e37f60ade73da/69426d332784ebf707e73ac9_img_home_S400_HEV.png",
  },
  "seat-seat-leon": {
    bodyType: "compacto",
    versions: [
      {
        id: "tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tsi-dsg",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "tdi-auto",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "phev-auto",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4368,
    widthMm: 1799,
    trunkLiters: 380,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/SEAT_Leon_%284%29.jpg",
  },
  "hyundai-i20": {
    bodyType: "utilitario",
    versions: [
      {
        id: "tgdi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tgdi-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "mhev-manual",
        powertrain: "mhev",
        transmission: "manual",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4065,
    widthMm: 1775,
    trunkLiters: 352,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hyundai_i20_%284%29.jpg",
  },
  "volkswagen-t-cross": {
    bodyType: "suv-urbano",
    versions: [
      {
        id: "tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tsi-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "tdi-auto",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4127,
    widthMm: 1760,
    trunkLiters: 385,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/VW_T-Cross_1.0_TSi_%E2%80%93_f_2021.jpg",
  },
  "renault-austral": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "tce-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tce-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "etech-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4533,
    widthMm: 1830,
    trunkLiters: 500,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Renault_Austral_frontside.jpg",
  },
  "skoda-kamiq": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "tsi-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tsi-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "gtec-manual",
        powertrain: "lpg",
        transmission: "manual",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4241,
    widthMm: 1793,
    trunkLiters: 400,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Skoda_Kamiq_frontside.jpg",
  },
  "renault-captur": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "tce-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "tce-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "etech-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
      {
        id: "etech-phev",
        powertrain: "phev",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4239,
    widthMm: 1797,
    trunkLiters: 422,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Renault_Captur_frontside.jpg",
  },
  "tesla-model-3": {
    bodyType: "compacto",
    versions: [
      {
        id: "rwd",
        powertrain: "electric",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
      {
        id: "lr-awd",
        powertrain: "electric",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
      {
        id: "mr-awd",
        powertrain: "electric",
        transmission: "automatic",
        dgtLabel: "CERO",
      },
    ],
    lengthMm: 4720,
    widthMm: 1850,
    trunkLiters: 513,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/2022_Tesla_Model_3_%28Highland%29%2C_front_10.7.22.jpg",
  },
  "peugeot-208-5p-allure-gasolina": {
    bodyType: "utilitario",
    versions: [
      {
        id: "puretech-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "puretech-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
    ],
    lengthMm: 4055,
    widthMm: 1745,
    trunkLiters: 309,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Peugeot_208_frontside.jpg",
  },
  "ford-kuga": {
    bodyType: "suv-compacto",
    versions: [
      {
        id: "ecoboost-manual",
        powertrain: "gasoline",
        transmission: "manual",
        dgtLabel: "C",
      },
      {
        id: "ecoboost-auto",
        powertrain: "gasoline",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "ecoblue-diesel",
        powertrain: "diesel",
        transmission: "automatic",
        dgtLabel: "C",
      },
      {
        id: "ecoboost-hybrid",
        powertrain: "hybrid",
        transmission: "automatic",
        dgtLabel: "ECO",
      },
    ],
    lengthMm: 4604,
    widthMm: 1882,
    trunkLiters: 482,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ford_Kuga_front_2020.jpg",
  },
  "audi-a1-sportback": {
    bodyType: "utilitario",
    lengthMm: 4029,
    widthMm: 1740,
    trunkLiters: 335,
    imageUrl:
      "https://www.automobiledimension.com/photos/audi-a1-sportback-2019.jpg",
  },
  "audi-a3-sportback": {
    bodyType: "compacto",
    lengthMm: 4352,
    widthMm: 1816,
    trunkLiters: 380,
    imageUrl:
      "https://www.automobiledimension.com/photos/audi-a3-sportback-2024.jpg",
  },
  "audi-q2": {
    bodyType: "suv-compacto",
    lengthMm: 4208,
    widthMm: 1794,
    trunkLiters: 405,
    imageUrl: "https://www.automobiledimension.com/photos/audi-q2-2021.jpg",
  },
  "audi-q3": {
    bodyType: "suv-compacto",
    lengthMm: 4531,
    widthMm: 1859,
    trunkLiters: 488,
    imageUrl: "https://www.automobiledimension.com/photos/audi-q3-2026.jpg",
  },
  "audi-q3-sportback": {
    bodyType: "suv-compacto",
    lengthMm: 4531,
    widthMm: 1859,
    trunkLiters: 488,
    imageUrl:
      "https://www.automobiledimension.com/photos/audi-q3-sportback-2026.jpg",
  },
  "bmw-x1-sdrive20d": {
    bodyType: "suv-compacto",
    lengthMm: 4500,
    widthMm: 1845,
    trunkLiters: 540,
    imageUrl: "https://www.automobiledimension.com/photos/bmw-x1-2023.jpg",
  },
  "byd-byd-dolphin-surf": {
    bodyType: "utilitario",
    lengthMm: 3990,
    widthMm: 1720,
    trunkLiters: 308,
    imageUrl: "https://www.automobiledimension.com/photos/byd-seal-u-2024.jpg",
  },
  "byd-byd-seal-u-dm-i": {
    bodyType: "suv-compacto",
    lengthMm: 4785,
    widthMm: 1890,
    trunkLiters: 425,
    imageUrl: "https://www.automobiledimension.com/photos/byd-seal-u-2024.jpg",
  },
  "citroen-nuevo-c4-hybrid-136": {
    bodyType: "compacto",
    lengthMm: 4360,
    widthMm: 1800,
    trunkLiters: 380,
    imageUrl: "https://www.automobiledimension.com/photos/citroen-c4-2021.jpg",
  },
  "citroen-nuevo-c4-hybrid-145": {
    bodyType: "compacto",
    lengthMm: 4360,
    widthMm: 1800,
    trunkLiters: 380,
    imageUrl: "https://www.automobiledimension.com/photos/citroen-c4-2021.jpg",
  },
  "citroen-nuevo-citro-n-c3-aircr": {
    bodyType: "utilitario",
    lengthMm: 4015,
    widthMm: 1755,
    trunkLiters: 310,
    imageUrl: "https://www.automobiledimension.com/photos/citroen-c3-2024.jpg",
  },
  "citroen-nuevo-citro-n-c3-turbo": {
    bodyType: "utilitario",
    lengthMm: 4015,
    widthMm: 1755,
    trunkLiters: 310,
    imageUrl: "https://www.automobiledimension.com/photos/citroen-c3-2024.jpg",
  },
  "cupra-cupra-leon": {
    bodyType: "compacto",
    lengthMm: 4398,
    widthMm: 1799,
    trunkLiters: 380,
    imageUrl: "https://www.automobiledimension.com/photos/cupra-leon--2024.jpg",
  },
  "cupra-formentor": {
    bodyType: "suv-compacto",
    lengthMm: 4451,
    widthMm: 1839,
    trunkLiters: 450,
    imageUrl:
      "https://www.automobiledimension.com/photos/cupra-formentor-2024.jpg",
  },
  "cupra-formentor-e-hybrid": {
    bodyType: "suv-compacto",
    lengthMm: 4451,
    widthMm: 1839,
    trunkLiters: 450,
    imageUrl:
      "https://www.automobiledimension.com/photos/cupra-formentor-2024.jpg",
  },
  "cupra-terramar-e-hybrid": {
    bodyType: "suv-compacto",
    lengthMm: 4519,
    widthMm: 1869,
    trunkLiters: 540,
    imageUrl:
      "https://www.automobiledimension.com/photos/cupra-terramar-2025.jpg",
  },
  "dacia-bigster": {
    bodyType: "suv-compacto",
    lengthMm: 4570,
    widthMm: 1810,
    trunkLiters: 667,
    imageUrl:
      "https://www.automobiledimension.com/photos/dacia-bigster-2025.jpg",
  },
  "dacia-jogger": {
    bodyType: "suv-compacto",
    lengthMm: 4547,
    widthMm: 1784,
    trunkLiters: 708,
    imageUrl:
      "https://www.automobiledimension.com/photos/dacia-jogger-2022.jpg",
  },
  "fiat-600": {
    bodyType: "compacto",
    lengthMm: 4171,
    widthMm: 1781,
    trunkLiters: 385,
    imageUrl: "https://www.automobiledimension.com/photos/fiat-600-2024.jpg",
  },
  "fiat-panda": {
    bodyType: "utilitario",
    lengthMm: 3686,
    widthMm: 1672,
    trunkLiters: 225,
    imageUrl: "https://www.automobiledimension.com/photos/fiat-panda-2021.jpg",
  },
  "ford-puma": {
    bodyType: "suv-urbano",
    lengthMm: 4186,
    widthMm: 1805,
    trunkLiters: 574,
    imageUrl: "https://www.automobiledimension.com/photos/ford-puma-2024.jpg",
  },
  "hyundai-bayon": {
    bodyType: "suv-urbano",
    lengthMm: 4180,
    widthMm: 1775,
    trunkLiters: 411,
    imageUrl:
      "https://www.automobiledimension.com/photos/hyundai-bayon-2024.jpg",
  },
  "hyundai-i-30": {
    bodyType: "compacto",
    lengthMm: 4340,
    widthMm: 1795,
    trunkLiters: 395,
    imageUrl: "https://www.automobiledimension.com/photos/hyundai-i30-2020.jpg",
  },
  "hyundai-i10": {
    bodyType: "utilitario",
    lengthMm: 3670,
    widthMm: 1680,
    trunkLiters: 252,
    imageUrl: "https://www.automobiledimension.com/photos/hyundai-i10-2023.jpg",
  },
  "ford-focus": {
    bodyType: "compacto",
    lengthMm: 4382,
    widthMm: 1825,
    trunkLiters: 392,
    imageUrl: "https://www.automobiledimension.com/photos/ford-focus-2022.jpg",
  },
  "jeep-avenger": {
    bodyType: "suv-urbano",
    lengthMm: 4084,
    widthMm: 1776,
    trunkLiters: 380,
    imageUrl:
      "https://www.automobiledimension.com/photos/jeep-avenger-2023.jpg",
  },
  "kia-ev3": {
    lengthMm: 4300,
    widthMm: 1850,
    trunkLiters: 485,
    imageUrl: "https://www.automobiledimension.com/photos/kia-ev3-2025.jpg",
  },
  "kia-niro": {
    bodyType: "suv-compacto",
    lengthMm: 4420,
    widthMm: 1825,
    trunkLiters: 495,
    imageUrl: "https://www.automobiledimension.com/photos/kia-niro-2022.jpg",
  },
  "kia-xceed": {
    bodyType: "suv-compacto",
    lengthMm: 4395,
    widthMm: 1826,
    trunkLiters: 426,
    imageUrl: "https://www.automobiledimension.com/photos/kia-xceed-2023.jpg",
  },
  "lexus-lexus-lbx": {
    bodyType: "suv-urbano",
    lengthMm: 4190,
    widthMm: 1825,
    trunkLiters: 332,
    imageUrl: "https://www.automobiledimension.com/photos/lexus-lbx-2024.jpg",
  },
  "mazda-mazda-cx-30": {
    bodyType: "suv-compacto",
    lengthMm: 4395,
    widthMm: 1795,
    trunkLiters: 430,
    imageUrl: "https://www.automobiledimension.com/photos/mazda-cx-30-2020.jpg",
  },
  "mazda-mazda3": {
    bodyType: "compacto",
    lengthMm: 4460,
    widthMm: 1795,
    trunkLiters: 358,
    imageUrl: "https://www.automobiledimension.com/photos/mazda-3-2019.jpg",
  },
  "mercedes-benz-gla-250-e": {
    bodyType: "suv-compacto",
    lengthMm: 4410,
    widthMm: 1834,
    trunkLiters: 435,
    imageUrl:
      "https://www.automobiledimension.com/photos/mercedes-benz-gla-2020.jpg",
  },
  "mercedes-benz-glc-220-d-4matic": {
    bodyType: "suv-compacto",
    lengthMm: 4731,
    widthMm: 1890,
    trunkLiters: 500,
    imageUrl:
      "https://www.automobiledimension.com/photos/mercedes-benz-glc-coupe-2019.jpg",
  },
  "mercedes-benz-glc-300-de-4matic": {
    bodyType: "suv-compacto",
    lengthMm: 4731,
    widthMm: 1890,
    trunkLiters: 500,
    imageUrl:
      "https://www.automobiledimension.com/photos/mercedes-benz-glc-coupe-2019.jpg",
  },
  "mg-mg-hs": {
    bodyType: "suv-compacto",
    lengthMm: 4670,
    widthMm: 1890,
    trunkLiters: 507,
    imageUrl: "https://www.automobiledimension.com/photos/mg-hs-2025.jpg",
  },
  "mg-mg3": {
    bodyType: "compacto",
    lengthMm: 4113,
    widthMm: 1797,
    trunkLiters: 293,
    imageUrl: "https://www.automobiledimension.com/photos/mg-mg3-2024.jpg",
  },
  "mg-mg3-hybrid": {
    bodyType: "compacto",
    lengthMm: 4113,
    widthMm: 1797,
    trunkLiters: 293,
    imageUrl: "https://www.automobiledimension.com/photos/mg-mg3-2024.jpg",
  },
  "nissan-nissan-juke": {
    bodyType: "suv-compacto",
    lengthMm: 4210,
    widthMm: 1800,
    trunkLiters: 422,
    imageUrl: "https://www.automobiledimension.com/photos/nissan-juke-2024.jpg",
  },
  "nissan-nissan-x-trail": {
    bodyType: "suv-compacto",
    lengthMm: 4680,
    widthMm: 1840,
    trunkLiters: 585,
    imageUrl:
      "https://www.automobiledimension.com/photos/nissan-x-trail-2023.jpg",
  },
  "opel-corsa-edition-1-2t-xhl": {
    bodyType: "utilitario",
    lengthMm: 4060,
    widthMm: 1765,
    trunkLiters: 309,
    imageUrl: "https://www.automobiledimension.com/photos/opel-corsa-2024.jpg",
  },
  "opel-corsa-gs-1-2t-xhl-mt6": {
    bodyType: "utilitario",
    lengthMm: 4060,
    widthMm: 1765,
    trunkLiters: 309,
    imageUrl: "https://www.automobiledimension.com/photos/opel-corsa-2024.jpg",
  },
  "peugeot-2008-allure-gasolina-1": {
    bodyType: "suv-compacto",
    lengthMm: 4304,
    widthMm: 1770,
    trunkLiters: 434,
    imageUrl:
      "https://www.automobiledimension.com/photos/peugeot-2008-2023.jpg",
  },
  "peugeot-2008-allure-hybrid-145": {
    bodyType: "suv-compacto",
    lengthMm: 4304,
    widthMm: 1770,
    trunkLiters: 434,
    imageUrl:
      "https://www.automobiledimension.com/photos/peugeot-2008-2023.jpg",
  },
  "peugeot-208-5p-allure-hybrid-1": {
    bodyType: "utilitario",
    lengthMm: 4055,
    widthMm: 1745,
    trunkLiters: 309,
    imageUrl: "https://www.automobiledimension.com/photos/peugeot-208-2024.jpg",
  },
  "peugeot-nuevo-3008-allure-hybr": {
    bodyType: "suv-compacto",
    lengthMm: 4542,
    widthMm: 1895,
    trunkLiters: 520,
    imageUrl:
      "https://www.automobiledimension.com/photos/peugeot-3008-2024.jpg",
  },
  "renault-arkana-e-tech": {
    bodyType: "suv-compacto",
    lengthMm: 4568,
    widthMm: 1821,
    trunkLiters: 513,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-arkana-2021.jpg",
  },
  "renault-captur-e-tech-hybrid": {
    bodyType: "suv-compacto",
    lengthMm: 4239,
    widthMm: 1797,
    trunkLiters: 422,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-captur-2024.jpg",
  },
  "renault-clio-e-tech-hybrid": {
    bodyType: "utilitario",
    lengthMm: 3922,
    widthMm: 1774,
    trunkLiters: 277,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-5-e-tech-2024.jpg",
  },
  "renault-kangoo": {
    lengthMm: 4486,
    widthMm: 1860,
    trunkLiters: 850,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-kangoo-2021.jpg",
  },
  "renault-rafale": {
    bodyType: "suv-compacto",
    lengthMm: 4710,
    widthMm: 1866,
    trunkLiters: 530,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-rafale-2024.jpg",
  },
  "renault-renault-5-e-tech-elect": {
    bodyType: "utilitario",
    lengthMm: 3922,
    widthMm: 1774,
    trunkLiters: 277,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-5-e-tech-2024.jpg",
  },
  "renault-symbioz": {
    bodyType: "suv-compacto",
    lengthMm: 4413,
    widthMm: 1797,
    trunkLiters: 613,
    imageUrl:
      "https://www.automobiledimension.com/photos/renault-symbioz-2025.jpg",
  },
  "seat-seat-ateca": {
    bodyType: "suv-compacto",
    lengthMm: 4381,
    widthMm: 1841,
    trunkLiters: 510,
    imageUrl: "https://www.automobiledimension.com/photos/seat-ateca-2020.jpg",
  },
  "skoda-fabia": {
    bodyType: "compacto",
    lengthMm: 4108,
    widthMm: 1780,
    trunkLiters: 380,
    imageUrl: "https://www.automobiledimension.com/photos/skoda-fabia-2021.jpg",
  },
  "skoda-karoq": {
    bodyType: "suv-compacto",
    lengthMm: 4390,
    widthMm: 1841,
    trunkLiters: 521,
    imageUrl: "https://www.automobiledimension.com/photos/skoda-karoq-2022.jpg",
  },
  "skoda-kodiaq": {
    bodyType: "suv-compacto",
    lengthMm: 4758,
    widthMm: 1864,
    trunkLiters: 725,
    imageUrl:
      "https://www.automobiledimension.com/photos/skoda-kodiaq-2024.jpg",
  },
  "skoda-octavia": {
    bodyType: "compacto",
    lengthMm: 4698,
    widthMm: 1829,
    trunkLiters: 600,
    imageUrl:
      "https://www.automobiledimension.com/photos/skoda-octavia-2024.jpg",
  },
  "tesla-model-y": {
    bodyType: "suv-compacto",
    lengthMm: 4790,
    widthMm: 1920,
    trunkLiters: 971,
    imageUrl:
      "https://www.automobiledimension.com/photos/tesla-model-y-2025.jpg",
  },
  "toyota-toyota-aygo-x": {
    bodyType: "utilitario",
    lengthMm: 3776,
    widthMm: 1740,
    trunkLiters: 231,
    imageUrl:
      "https://www.automobiledimension.com/photos/toyota-aygo-x-cross-2026.jpg",
  },
  "volkswagen-caddy": {
    lengthMm: 4500,
    widthMm: 1855,
    imageUrl:
      "https://www.automobiledimension.com/photos/volkswagen-caddy-2021.jpg",
  },
  "volkswagen-polo": {
    bodyType: "utilitario",
    lengthMm: 4074,
    widthMm: 1751,
    trunkLiters: 351,
    imageUrl:
      "https://www.automobiledimension.com/photos/volkswagen-polo-2021.jpg",
  },
  "volkswagen-touran": {
    lengthMm: 4527,
    widthMm: 1829,
    trunkLiters: 743,
    imageUrl:
      "https://www.automobiledimension.com/photos/volkswagen-touran-2016.jpg",
  },
  "volvo-xc40": {
    bodyType: "suv-compacto",
    lengthMm: 4440,
    widthMm: 1863,
    trunkLiters: 452,
    imageUrl: "https://www.automobiledimension.com/photos/volvo-xc40-2023.jpg",
  },
  "volvo-xc60": {
    bodyType: "suv-compacto",
    lengthMm: 4708,
    widthMm: 1902,
    trunkLiters: 483,
    imageUrl: "https://www.automobiledimension.com/photos/volvo-xc60-2025.jpg",
  },
}
