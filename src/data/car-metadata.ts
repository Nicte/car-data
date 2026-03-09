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
}
