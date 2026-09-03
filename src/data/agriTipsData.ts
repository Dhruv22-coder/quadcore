import { Language } from '../types';

export interface SeasonalCropRecommendation {
  cropName: string;
  hindiName: string;
  sowingMonths: string;
  harvestMonths: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  expectedYield: string;
  soilSuitability: string;
  beginnerDifficulty: 'Easy' | 'Moderate' | 'Challenging';
  proTip: string;
}

export interface SeasonInfo {
  seasonId: 'kharif' | 'rabi' | 'zaid';
  seasonName: string;
  hindiSeasonName: string;
  period: string;
  weatherCondition: string;
  idealForNewbies: string;
  recommendedCrops: SeasonalCropRecommendation[];
}

export interface StateSoilWeatherProfile {
  stateId: string;
  stateName: string;
  dominantSoils: {
    name: string;
    type: string;
    characteristics: string;
    phRange: string;
    bestCrops: string[];
  }[];
  climaticZones: string;
  annualRainfall: string;
  averageTemperature: string;
  waterAvailability: string;
  currentSeasonalAlert: string;
  seasons: SeasonInfo[];
  newbieFarmerStarterGuide: {
    topRule: string;
    soilPreparation: string;
    mistakeToAvoid: string;
    governmentSupportNote: string;
  };
}

export const STATE_AGRI_PROFILES: Record<string, StateSoilWeatherProfile> = {
  maharashtra: {
    stateId: 'maharashtra',
    stateName: 'Maharashtra',
    dominantSoils: [
      {
        name: 'Black Regur Soil (काली मिट्टी)',
        type: 'Clayey / Volcanic Trap',
        characteristics: 'Deep, moisture-retentive, rich in iron, lime, calcium and magnesium carbonate; cracks in summer aiding aeration.',
        phRange: '7.2 - 8.5 (Neutral to mildly alkaline)',
        bestCrops: ['Cotton', 'Soybean', 'Onion', 'Tur (Arhar)', 'Sugarcane', 'Jowar'],
      },
      {
        name: 'Red & Lateritic Soil (लाल व जांभा माती)',
        type: 'Konkan & Western Ghats',
        characteristics: 'Porous, well-drained, acidic with high organic matter, ideal for horticulture and fruit orchards.',
        phRange: '5.5 - 6.5 (Mildly acidic)',
        bestCrops: ['Cashew', 'Mango (Alphonso)', 'Paddy', 'Coconut', 'Spices'],
      },
    ],
    climaticZones: 'Tropical monsoon with semi-arid Deccan plateau and high-rainfall Konkan coastal belt',
    annualRainfall: '600 mm to 3,000 mm (widely varying from Marathwada rain-shadow to Western Ghats)',
    averageTemperature: '18°C in winter to 42°C in peak summer',
    waterAvailability: 'Rainfed drylands in Vidarbha/Marathwada; canal & tube-wells in Western Maharashtra',
    currentSeasonalAlert: 'Post-monsoon soil moisture retention is high. Ideal window for Rabi sowing and winter vegetable nursery preparation.',
    seasons: [
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Monsoon Crop)',
        hindiSeasonName: 'खरीफ (मानसून फसल)',
        period: 'June – October',
        weatherCondition: 'Warm, humid, southwest monsoon rains (700-1200mm)',
        idealForNewbies: 'Soybean & Cotton offer high mandi liquidity and standard farming packages.',
        recommendedCrops: [
          {
            cropName: 'Soybean (सोयाबीन)',
            hindiName: 'सोयाबीन',
            sowingMonths: 'Mid-June to Mid-July (after 75mm rain)',
            harvestMonths: 'September – October (90-100 days)',
            waterNeed: 'Medium',
            expectedYield: '8 - 12 Quintals/Acre',
            soilSuitability: 'Well-drained Black Cotton soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Inoculate seed with Rhizobium culture before sowing to cut chemical nitrogen fertilizer costs by 30%.',
          },
          {
            cropName: 'Tur / Arhar Dal (अरहर / तूर)',
            hindiName: 'तूर दाल',
            sowingMonths: 'June – July',
            harvestMonths: 'December – January',
            waterNeed: 'Low',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Deep black soils with good drainage',
            beginnerDifficulty: 'Easy',
            proTip: 'Intercrop 1 line of Tur with 4 lines of Soybean for risk-free dual harvesting.',
          },
          {
            cropName: 'Cotton / Kapas (कपास)',
            hindiName: 'कपास',
            sowingMonths: 'June – Early July',
            harvestMonths: 'November – February (multiple pickings)',
            waterNeed: 'Medium',
            expectedYield: '8 - 14 Quintals/Acre',
            soilSuitability: 'Deep Black Regur Soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Install yellow sticky traps and pheromone traps early to prevent pink bollworm without heavy spraying.',
          },
        ],
      },
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Winter Crop)',
        hindiSeasonName: 'रबी (सर्दियों की फसल)',
        period: 'October – March',
        weatherCondition: 'Cool, crisp days, dry weather with residual soil moisture and dew',
        idealForNewbies: 'Gram (Chana) and Onion offer great returns for first-time growers.',
        recommendedCrops: [
          {
            cropName: 'Bengal Gram / Chana (चना)',
            hindiName: 'चना (हरभरा)',
            sowingMonths: 'October – November',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '7 - 10 Quintals/Acre',
            soilSuitability: 'Medium to heavy black soil with moisture',
            beginnerDifficulty: 'Easy',
            proTip: 'Requires only 1 to 2 protective irrigations at flowering and pod-formation stages.',
          },
          {
            cropName: 'Rabi Onion (लाल / फुरसुंगी प्याज)',
            hindiName: 'प्याज (कांदा)',
            sowingMonths: 'Nursery in Oct-Nov, Transplant in Dec-Jan',
            harvestMonths: 'April – May',
            waterNeed: 'Medium',
            expectedYield: '100 - 140 Quintals/Acre',
            soilSuitability: 'Sandy loam to light black friable soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Rabi onions store safely for 5-6 months without cold storage, allowing you to sell during peak monsoon price spikes.',
          },
          {
            cropName: 'Wheat / Sharbati (गेहूं)',
            hindiName: 'गेहूं',
            sowingMonths: 'November (after temperatures drop below 20°C)',
            harvestMonths: 'March',
            waterNeed: 'Medium',
            expectedYield: '14 - 18 Quintals/Acre',
            soilSuitability: 'Deep fertile loams and clay loams',
            beginnerDifficulty: 'Easy',
            proTip: 'Irrigate at Crown Root Initiation (CRI stage, 21 days after sowing) for maximum tiller formation.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Summer Crop)',
        hindiSeasonName: 'जायद (ग्रीष्मकालीन फसल)',
        period: 'March – June',
        weatherCondition: 'Hot, dry, high sun exposure; requires assured drip or well irrigation',
        idealForNewbies: 'Short-duration Moong dal and cucurbits bring quick 60-day cash turnover.',
        recommendedCrops: [
          {
            cropName: 'Summer Green Gram / Moong (मूंग)',
            hindiName: 'मूंग दाल',
            sowingMonths: 'March',
            harvestMonths: 'May (60-65 days)',
            waterNeed: 'Low',
            expectedYield: '4 - 6 Quintals/Acre',
            soilSuitability: 'Well-drained loam or clay loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Adds natural atmospheric nitrogen to soil, reducing fertilizer needs for subsequent Kharif crops.',
          },
          {
            cropName: 'Watermelon & Muskmelon (तरबूज / खरबूजा)',
            hindiName: 'तरबूज',
            sowingMonths: 'February – March',
            harvestMonths: 'May – June',
            waterNeed: 'Medium',
            expectedYield: '150 - 200 Quintals/Acre',
            soilSuitability: 'Sandy loam riverbed or well-drained loamy soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Use silver-black plastic mulch sheet and drip irrigation to prevent weed growth and save 50% water.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Always perform a Soil Health Card (मृदा स्वास्थ्य कार्ड) test before buying any chemical fertilizer.',
      soilPreparation: 'Deep summer ploughing (25-30cm) to expose resting pests and soil-borne fungi to intense sun rays.',
      mistakeToAvoid: 'Never sow seeds deeper than 5cm in heavy black cotton soil; seed rot will occur during early heavy showers.',
      governmentSupportNote: 'Avail 50-80% subsidy on Drip Irrigation under MahaDBT & PM Krishi Sinchayee Yojana.',
    },
  },

  punjab: {
    stateId: 'punjab',
    stateName: 'Punjab',
    dominantSoils: [
      {
        name: 'Alluvial Loam Soil (जलोढ़ दोमट मिट्टी)',
        type: 'Indo-Gangetic Plain Alluvium',
        characteristics: 'Deep, highly fertile, nutrient-rich with balanced sand, silt, and clay; high cation exchange capacity.',
        phRange: '7.0 - 8.2 (Slightly neutral to alkaline)',
        bestCrops: ['Wheat', 'Basmati Paddy', 'Mustard', 'Maize', 'Potato', 'Green Fodder'],
      },
      {
        name: 'Sandy Loam / Arid Soil (रेतीली दोमट)',
        type: 'South-Western Belt (Bathinda/Fazilka)',
        characteristics: 'Light-textured, high water permeability, low organic carbon, well suited for cotton and mustard.',
        phRange: '7.8 - 8.6',
        bestCrops: ['Bt Cotton', 'Mustard', 'Guar', 'Kinnow Citrus'],
      },
    ],
    climaticZones: 'Sub-tropical continental semi-arid with hot summers and chilly frost-prone winters',
    annualRainfall: '450 mm to 900 mm (mostly monsoon; winter western disturbances benefit wheat)',
    averageTemperature: '4°C in winter frost to 44°C in May-June',
    waterAvailability: 'Comprehensive canal network and deep tube-well irrigation',
    currentSeasonalAlert: 'Optimal conditions for timely sowing of HD-2967/PBW wheat and mustard with zero-tillage machines.',
    seasons: [
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Winter Main Crop)',
        hindiSeasonName: 'रबी (मुख्य शीतकालीन फसल)',
        period: 'October – April',
        weatherCondition: 'Cool sunny days, chilly nights, crucial winter showers from Western Disturbances',
        idealForNewbies: 'Wheat and Mustard are the safest, highly mechanized crops with guaranteed MSP procurement.',
        recommendedCrops: [
          {
            cropName: 'Wheat (गेहूं - HD 3086 / PBW 826)',
            hindiName: 'गेहूं',
            sowingMonths: 'November 1 – November 15',
            harvestMonths: 'April',
            waterNeed: 'Medium',
            expectedYield: '20 - 24 Quintals/Acre',
            soilSuitability: 'Deep alluvial loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Use Happy Seeder or Super Seeder directly in paddy stubble to save ₹2,000/acre in field preparation.',
          },
          {
            cropName: 'Mustard / Sarson (सरसों - PBR 357)',
            hindiName: 'पीली सरसों / राया',
            sowingMonths: 'October',
            harvestMonths: 'March',
            waterNeed: 'Low',
            expectedYield: '7 - 10 Quintals/Acre',
            soilSuitability: 'Sandy loam to loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Requires minimal water (only 2-3 irrigations); fetched record prices above MSP in local mandis.',
          },
        ],
      },
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Paddy & Cotton)',
        hindiSeasonName: 'खरीफ (धान और कपास)',
        period: 'June – October',
        weatherCondition: 'Warm, humid, high solar radiation with monsoon downpours',
        idealForNewbies: 'Basmati rice (Pusa 1121/1509) requires less water than PR paddy and fetches higher private prices.',
        recommendedCrops: [
          {
            cropName: 'Basmati Paddy (बासमती पूसा 1509/1121)',
            hindiName: 'बासमती धान',
            sowingMonths: 'Transplant in late June – early July',
            harvestMonths: 'October – November',
            waterNeed: 'High',
            expectedYield: '18 - 22 Quintals/Acre',
            soilSuitability: 'Clay loam alluvium',
            beginnerDifficulty: 'Moderate',
            proTip: 'Direct Seeded Rice (DSR) technique saves 25% irrigation water and reduces electricity expense.',
          },
          {
            cropName: 'Maize / Makka (मक्का)',
            hindiName: 'मक्का',
            sowingMonths: 'June – July',
            harvestMonths: 'September – October',
            waterNeed: 'Medium',
            expectedYield: '22 - 28 Quintals/Acre',
            soilSuitability: 'Well-drained fertile loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Excellent alternative to flood-irrigated paddy that protects Punjab groundwater table.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Spring Crop)',
        hindiSeasonName: 'जायद (वसंत/ग्रीष्मकालीन फसल)',
        period: 'March – May',
        weatherCondition: 'Rising temperatures, dry sunny days',
        idealForNewbies: 'Spring maize or summer Moong as catch-crops.',
        recommendedCrops: [
          {
            cropName: 'Summer Moong (ग्रीष्मकालीन मूंग SML 668)',
            hindiName: 'मूंग दाल',
            sowingMonths: 'March 20 – April 10',
            harvestMonths: 'May end (60 days)',
            waterNeed: 'Low',
            expectedYield: '4.5 - 6 Quintals/Acre',
            soilSuitability: 'Loamy soil with good percolation',
            beginnerDifficulty: 'Easy',
            proTip: 'Fits perfectly between wheat harvest and Kharif paddy transplantation.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Test irrigation water salinity/EC; avoid brackish tubewell water in southwest districts.',
      soilPreparation: 'Level the field with a Laser Land Leveller; saves 20-25% water across the crop cycle.',
      mistakeToAvoid: 'Do not over-apply Urea; excessive nitrogen makes wheat lodge (fall over) during March storms.',
      governmentSupportNote: 'Check PAU Ludhiana advisories and apply for farm machinery custom hiring center subsidies.',
    },
  },

  gujarat: {
    stateId: 'gujarat',
    stateName: 'Gujarat',
    dominantSoils: [
      {
        name: 'Medium Black & Coastal Alluvial (काली व तटीय दोमट)',
        type: 'Saurashtra & Central Gujarat',
        characteristics: 'Rich in potash and lime, highly suitable for cash crops and oilseeds.',
        phRange: '7.5 - 8.4',
        bestCrops: ['Cotton (Shankar-6)', 'Groundnut', 'Cumin (Jeera)', 'Castor', 'Sesame'],
      },
      {
        name: 'Sandy Loam / Goradu Soil (गोराडू मिट्टी)',
        type: 'North Gujarat (Mehsana/Banaskantha)',
        characteristics: 'Light yellowish-brown, highly responsive to drip irrigation and organic manure.',
        phRange: '7.2 - 8.0',
        bestCrops: ['Cumin', 'Fennel (Saunf)', 'Mustard', 'Potato', 'Castor'],
      },
    ],
    climaticZones: 'Arid to semi-arid in Kutch/Saurashtra; sub-humid in South Gujarat',
    annualRainfall: '400 mm to 1,500 mm (highly erratic in North Gujarat; heavy in South)',
    averageTemperature: '12°C in winter to 43°C in summer',
    waterAvailability: 'Narmada canal network, check dams, and micro-irrigation systems',
    currentSeasonalAlert: 'Saurashtra & North Gujarat regions entering ideal dry window for Cumin and Mustard sowing.',
    seasons: [
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Spice & Winter Crop)',
        hindiSeasonName: 'रबी (मसाला और शीतकालीन फसल)',
        period: 'October – March',
        weatherCondition: 'Dry, bright sunny days and cool nights, very low humidity',
        idealForNewbies: 'Cumin and Mustard have world-class trading hubs in Unjha and Gondal mandis.',
        recommendedCrops: [
          {
            cropName: 'Cumin / Jeera (जीरा - Gujarat Cumin 4)',
            hindiName: 'जीरा',
            sowingMonths: 'November 1 – November 20',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '3.5 - 5 Quintals/Acre',
            soilSuitability: 'Well-drained sandy loam / Goradu soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Do not irrigate during cloudy humid weather to prevent blight (chhello disease); spray Mancozeb proactively.',
          },
          {
            cropName: 'Castor / Arandi (अरंडी)',
            hindiName: 'अरंडी',
            sowingMonths: 'August – September',
            harvestMonths: 'January – April',
            waterNeed: 'Low',
            expectedYield: '12 - 16 Quintals/Acre',
            soilSuitability: 'Deep sandy loam with moderate fertility',
            beginnerDifficulty: 'Easy',
            proTip: 'Gujarat produces 85% of India\'s castor; very resilient to dry spells with steady mandi buying.',
          },
        ],
      },
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Groundnut & Cotton)',
        hindiSeasonName: 'खरीफ (मूंगफली और कपास)',
        period: 'June – October',
        weatherCondition: 'Warm monsoon weather with fluctuating dry spells',
        idealForNewbies: 'Groundnut is the lifeblood of Saurashtra with guaranteed APMC demand.',
        recommendedCrops: [
          {
            cropName: 'Groundnut (मूंगफली - GG 20 / GJG 9)',
            hindiName: 'मूंगफली',
            sowingMonths: 'Late June to Mid July',
            harvestMonths: 'October – November',
            waterNeed: 'Medium',
            expectedYield: '10 - 15 Quintals/Acre',
            soilSuitability: 'Sandy loam / light black soil that allows peg penetration',
            beginnerDifficulty: 'Easy',
            proTip: 'Apply Gypsum (200kg/acre) at flowering stage to ensure hard pod shells and high oil content.',
          },
          {
            cropName: 'Bt Cotton (कपास)',
            hindiName: 'कपास',
            sowingMonths: 'June',
            harvestMonths: 'November – January',
            waterNeed: 'Medium',
            expectedYield: '10 - 16 Quintals/Acre',
            soilSuitability: 'Medium to deep black soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Follow paired row planting with drip irrigation to save 40% water and simplify inter-cultivation.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Summer Cash Crop)',
        hindiSeasonName: 'जायद (ग्रीष्मकालीन फसल)',
        period: 'March – May',
        weatherCondition: 'Sunny, dry, high heat',
        idealForNewbies: 'Summer Sesame (Til) and Bajra produce lucrative dry-season returns.',
        recommendedCrops: [
          {
            cropName: 'Summer Sesame / Til (तिल - Gujarat Til 2)',
            hindiName: 'सफेद तिल',
            sowingMonths: 'Mid-February to March',
            harvestMonths: 'May',
            waterNeed: 'Low',
            expectedYield: '3.5 - 5 Quintals/Acre',
            soilSuitability: 'Light sandy loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Fetched over ₹11,000/quintal in Rajkot mandi; free from major insect pests in summer.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Adopt Drip/Sprinkler Irrigation under Gujarat Green Revolution Company (GGRC) for up to 70% state subsidy.',
      soilPreparation: 'Add farmyard manure (FYM) or castor cake to improve water retention in sandy soils.',
      mistakeToAvoid: 'Avoid excessive irrigation in Cumin after flowering; standing moisture destroys cumin roots.',
      governmentSupportNote: 'Register on i-Khedut portal for prompt seeds, toolkits, and solar pump benefits.',
    },
  },

  uttar_pradesh: {
    stateId: 'uttar_pradesh',
    stateName: 'Uttar Pradesh',
    dominantSoils: [
      {
        name: 'Deep Gangetic Alluvial Soil (दोमट व मटियार मिट्टी)',
        type: 'Indo-Gangetic Basin Alluvium',
        characteristics: 'Extremely deep, rich in organic humus, potash and lime; ideal water retention for multiple cropping cycles.',
        phRange: '6.8 - 8.0',
        bestCrops: ['Sugarcane', 'Wheat', 'Potato', 'Paddy', 'Mustard', 'Mentha'],
      },
      {
        name: 'Bundelkhand Red & Mixed Black Soil (राकर व मार मिट्टी)',
        type: 'Semi-arid southern belt',
        characteristics: 'Shallow to medium depth, rocky subsoil, susceptible to erosion; well suited for hardy pulses and oilseeds.',
        phRange: '7.0 - 7.8',
        bestCrops: ['Chana (Gram)', 'Masoor (Lentil)', 'Mustard', 'Sesame'],
      },
    ],
    climaticZones: 'Sub-tropical humid to sub-humid plain; chilly winters and intense dry Loo winds in May-June',
    annualRainfall: '650 mm (western UP) to 1,200 mm (eastern UP & Terai belt)',
    averageTemperature: '5°C in Jan frost to 45°C in peak summer',
    waterAvailability: 'Extensive tubewells, canals (Ganga, Sharda), and shallow groundwater table',
    currentSeasonalAlert: 'Prime window for early potato planting and timely sowing of high-yielding wheat varieties.',
    seasons: [
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Wheat, Mustard & Potato)',
        hindiSeasonName: 'रबी (गेहूं, सरसों व आलू)',
        period: 'October – April',
        weatherCondition: 'Cool, sunny days, morning fog/dew, frost spells in Dec-Jan',
        idealForNewbies: 'Wheat and Yellow Mustard (Pili Sarson) are foolproof crops for beginners.',
        recommendedCrops: [
          {
            cropName: 'Wheat / Gehun (गेहूं - HD 2967 / PBW 502)',
            hindiName: 'गेहूं',
            sowingMonths: 'November 10 – November 25',
            harvestMonths: 'April',
            waterNeed: 'Medium',
            expectedYield: '18 - 22 Quintals/Acre',
            soilSuitability: 'Fertile Gangetic loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Seed treatment with Trichoderma viride prevents seedling blight and root rot.',
          },
          {
            cropName: 'Yellow Mustard / Pili Sarson (पीली सरसों)',
            hindiName: 'पीली सरसों',
            sowingMonths: 'October',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Loam to sandy loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Yellow mustard commands a ₹400-600/qtl premium over black raya in Kanpur and Agra mandis.',
          },
          {
            cropName: 'Potato / Aloo (आलू - Kufri Pukhraj / Chipsona)',
            hindiName: 'आलू',
            sowingMonths: 'October 15 – November 5',
            harvestMonths: 'January – February',
            waterNeed: 'Medium',
            expectedYield: '120 - 160 Quintals/Acre',
            soilSuitability: 'Loose, friable sandy loam rich in organic matter',
            beginnerDifficulty: 'Moderate',
            proTip: 'Earthing-up (mounding soil on ridges) at 30 days protects growing tubers from sunlight greening.',
          },
        ],
      },
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Paddy & Sugarcane)',
        hindiSeasonName: 'खरीफ (धान और गन्ना)',
        period: 'June – October',
        weatherCondition: 'Hot, humid, steady monsoon showers',
        idealForNewbies: 'Paddy with assured irrigation or Autumn planting of Sugarcane.',
        recommendedCrops: [
          {
            cropName: 'Paddy / Dhan (धान - Sambha Mahsuri / PR 126)',
            hindiName: 'धान',
            sowingMonths: 'Nursery in May-June, Transplant in July',
            harvestMonths: 'October – November',
            waterNeed: 'High',
            expectedYield: '22 - 28 Quintals/Acre',
            soilSuitability: 'Clay loam to heavy clay',
            beginnerDifficulty: 'Easy',
            proTip: 'Maintain 2-3 cm standing water during panicle emergence for plump, heavy grain formation.',
          },
          {
            cropName: 'Sugarcane / Ganna (गन्ना - Co 0238 / Co 15023)',
            hindiName: 'गन्ना',
            sowingMonths: 'Autumn (Oct) or Spring (Feb-March)',
            harvestMonths: 'November – March (10-12 months)',
            waterNeed: 'High',
            expectedYield: '300 - 450 Quintals/Acre',
            soilSuitability: 'Deep loamy soil with high organic content',
            beginnerDifficulty: 'Moderate',
            proTip: 'Trench method of planting saves irrigation water and permits intercropping with mustard or garlic.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Mentha, Moong & Cucurbits)',
        hindiSeasonName: 'जायद (पिपरमेंट/मेंथा व मूंग)',
        period: 'March – June',
        weatherCondition: 'Intense dry heat, long sunny days',
        idealForNewbies: 'Mentha (Peppermint) in Barabanki/Sambhal or Green Gram (Moong).',
        recommendedCrops: [
          {
            cropName: 'Mentha / Peppermint (मेंथा/पिपरमेंट)',
            hindiName: 'मेंथा',
            sowingMonths: 'Transplant sucker roots in February – March',
            harvestMonths: 'June (distill oil before monsoon)',
            waterNeed: 'High',
            expectedYield: '50 - 65 Liters Oil/Acre',
            soilSuitability: 'Rich moist loam',
            beginnerDifficulty: 'Moderate',
            proTip: 'UP accounts for 80% of global menthol oil; fast cash turnover in local essential oil markets.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Apply Zinc Sulfate (10kg/acre) during paddy and wheat basal application to prevent Khaira disease.',
      soilPreparation: 'Incorporate Dhaincha (Sesbania) green manure before Kharif paddy to restore organic carbon.',
      mistakeToAvoid: 'Avoid late sowing of wheat after December 15; terminal heat in March shrivels the grain kernels.',
      governmentSupportNote: 'Register on UP Agriculture portal (upagriculture.com) for DBT seed and fertilizer subsidies.',
    },
  },

  madhya_pradesh: {
    stateId: 'madhya_pradesh',
    stateName: 'Madhya Pradesh',
    dominantSoils: [
      {
        name: 'Deep to Medium Black Soil (गहरी व मध्यम काली मिट्टी)',
        type: 'Malwa & Narmada Valley',
        characteristics: 'High moisture capacity, rich in montmorillonite clay; ideal for rainfed soybean and irrigated wheat.',
        phRange: '7.2 - 8.5',
        bestCrops: ['Soybean', 'Sharbati Wheat', 'Gram (Chana)', 'Garlic', 'Mustard'],
      },
      {
        name: 'Red & Yellow Soil (लाल-पीली मिट्टी)',
        type: 'Mahakoshal & Baghelkhand',
        characteristics: 'Lighter texture, lower nitrogen and phosphorus, responsive to organic compost.',
        phRange: '6.0 - 7.2',
        bestCrops: ['Paddy', 'Tur', 'Kodo-Kutki (Millets)', 'Linseed (Alsi)'],
      },
    ],
    climaticZones: 'Sub-tropical with warm dry summers, moderate monsoon, and mild pleasant winters',
    annualRainfall: '800 mm (western MP) to 1,400 mm (eastern MP)',
    averageTemperature: '10°C in winter to 42°C in summer',
    waterAvailability: 'Narmada, Chambal, Betwa irrigation projects and farm ponds (Khet Talab)',
    currentSeasonalAlert: 'Soil moisture is prime in Malwa & Narmadapuram; ideal sowing window for Sharbati wheat and dollar chana.',
    seasons: [
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Sharbati Wheat & Chana)',
        hindiSeasonName: 'रबी (शरबती गेहूं व चना)',
        period: 'October – March',
        weatherCondition: 'Cool, clear sunny days, low humidity, dew in early mornings',
        idealForNewbies: 'MP is the pulse & Sharbati wheat capital; high mandi demand at Indore and Ujjain.',
        recommendedCrops: [
          {
            cropName: 'Sharbati Wheat (शरबती सीहोर गेहूं - HI 1544 / C 306)',
            hindiName: 'शरबती गेहूं',
            sowingMonths: 'November',
            harvestMonths: 'March',
            waterNeed: 'Medium',
            expectedYield: '16 - 20 Quintals/Acre',
            soilSuitability: 'Deep black soil of Malwa',
            beginnerDifficulty: 'Easy',
            proTip: 'Genuine Sehore Sharbati fetches ₹3,200 - ₹3,800/qtl in local mandis, nearly 50% above ordinary MSP.',
          },
          {
            cropName: 'Dollar Chana / Kabuli Gram (डॉलर चना - Phule G-12)',
            hindiName: 'डॉलर चना',
            sowingMonths: 'October – November',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '8 - 12 Quintals/Acre',
            soilSuitability: 'Well-drained medium black soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Large bold grains command strong export buyer demand in Indore and Khargone mandis.',
          },
          {
            cropName: 'Garlic / Lahsun (लहसुन - Ooty / G-282)',
            hindiName: 'लहसुन',
            sowingMonths: 'October',
            harvestMonths: 'March',
            waterNeed: 'Medium',
            expectedYield: '35 - 50 Quintals/Acre',
            soilSuitability: 'Rich loamy black soil',
            beginnerDifficulty: 'Moderate',
            proTip: 'Mandsaur and Neemuch are Asia\'s largest garlic hubs; dry cured garlic stores up to 6 months.',
          },
        ],
      },
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Soybean & Maize)',
        hindiSeasonName: 'खरीफ (सोयाबीन व मक्का)',
        period: 'June – October',
        weatherCondition: 'Monsoon showers, humid, warm days',
        idealForNewbies: 'Soybean (JS 20-34, JS 20-98) offers simple agronomy and instant mandi liquidity.',
        recommendedCrops: [
          {
            cropName: 'Soybean (सोयाबीन - JS 20-98)',
            hindiName: 'सोयाबीन',
            sowingMonths: 'Late June to Early July',
            harvestMonths: 'Late September – October',
            waterNeed: 'Medium',
            expectedYield: '8 - 11 Quintals/Acre',
            soilSuitability: 'Medium to deep black soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Use Broad Bed Furrow (BBF) planting to prevent waterlogging during heavy monsoon downpours.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Moong & Vegetables)',
        hindiSeasonName: 'जायद (ग्रीष्मकालीन मूंग)',
        period: 'March – May',
        weatherCondition: 'Hot, dry, bright sunshine',
        idealForNewbies: 'Summer Moong has become MP\'s third major cash earner with state procurement.',
        recommendedCrops: [
          {
            cropName: 'Summer Moong (मूंग - Shikha / Virat)',
            hindiName: 'मूंग',
            sowingMonths: 'March 15 – April 5',
            harvestMonths: 'May end',
            waterNeed: 'Low',
            expectedYield: '5 - 7 Quintals/Acre',
            soilSuitability: 'Black soil with residual moisture',
            beginnerDifficulty: 'Easy',
            proTip: 'Two irrigations after wheat harvest yield clean pods before monsoon showers begin.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Adopt BBF (Broad Bed Furrow) seeder machines in heavy black soils to survive both droughts and heavy downpours.',
      soilPreparation: 'Deep summer ploughing every 3 years to break hard subsoil pan and expose weeds.',
      mistakeToAvoid: 'Never spray glyphosate or harsh non-selective herbicides without a protective hood.',
      governmentSupportNote: 'Apply for solar pump subsidy under Mukhyamantri Solar Pump Yojana on mpkrishi portal.',
    },
  },

  rajasthan: {
    stateId: 'rajasthan',
    stateName: 'Rajasthan',
    dominantSoils: [
      {
        name: 'Desert / Arid Sandy Soil (रेतीली बलुई मिट्टी)',
        type: 'Thar Desert & Western Rajasthan',
        characteristics: 'Coarse sand grains, low clay, rapid water drainage, low organic carbon; high mineral salt content.',
        phRange: '7.8 - 8.8 (Alkaline)',
        bestCrops: ['Bajra (Pearl Millet)', 'Guar', 'Moth Bean', 'Cumin', 'Castor'],
      },
      {
        name: 'Medium Black & Alluvial Loam (काली व दोमट)',
        type: 'Hadoti & Eastern Plains (Kota/Bharatpur/Jaipur)',
        characteristics: 'Clayey to loamy, fertile, good moisture holding; supported by canal irrigation.',
        phRange: '7.2 - 8.2',
        bestCrops: ['Mustard', 'Soybean', 'Wheat', 'Coriander (Dhaniya)', 'Garlic'],
      },
    ],
    climaticZones: 'Arid to semi-arid; extreme temperature fluctuations between day and night; scarce rainfall',
    annualRainfall: '200 mm (western Thar) to 900 mm (Hadoti region)',
    averageTemperature: '2°C in winter frost to 48°C in blistering summer heat',
    waterAvailability: 'Indira Gandhi Canal (IGNP), tube-wells, and rainwater harvesting (Kunds/Tankas)',
    currentSeasonalAlert: 'Temperature drop creates ideal condition for Mustard and Cumin sowing across Bharatpur, Alwar, and Nagaur belts.',
    seasons: [
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Mustard, Cumin & Coriander)',
        hindiSeasonName: 'रबी (सरसों, जीरा व धनिया)',
        period: 'October – March',
        weatherCondition: 'Cool, dry, chilly nights with intense bright sunlight during the day',
        idealForNewbies: 'Rajasthan is India\'s #1 Mustard producer; Kota and Bharatpur offer assured mandis.',
        recommendedCrops: [
          {
            cropName: 'Mustard / Sarson (सरसों - Giriraj / RH 749)',
            hindiName: 'सरसों',
            sowingMonths: 'October 1 – October 25',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '8 - 12 Quintals/Acre',
            soilSuitability: 'Loam, sandy loam, and alluvial plains',
            beginnerDifficulty: 'Easy',
            proTip: 'Sow before October 25 to escape aphid (चेपा) attack in late winter.',
          },
          {
            cropName: 'Coriander / Dhaniya (धनिया - RCr 436)',
            hindiName: 'धनिया',
            sowingMonths: 'October – November',
            harvestMonths: 'February – March',
            waterNeed: 'Medium',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Medium black soil of Hadoti (Kota/Baran)',
            beginnerDifficulty: 'Easy',
            proTip: 'Baran and Ramganj Mandi is Asia\'s largest coriander market; green whole seeds fetch premium.',
          },
          {
            cropName: 'Cumin / Jeera (जीरा - RZ 209 / GC 4)',
            hindiName: 'जीरा',
            sowingMonths: 'November',
            harvestMonths: 'March',
            waterNeed: 'Low',
            expectedYield: '3 - 4.5 Quintals/Acre',
            soilSuitability: 'Light sandy loam with good drainage',
            beginnerDifficulty: 'Moderate',
            proTip: 'Requires only 3-4 light sprinkler irrigations; overwatering causes root rot.',
          },
        ],
      },
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Bajra & Guar)',
        hindiSeasonName: 'खरीफ (बाजरा व ग्वार)',
        period: 'July – October',
        weatherCondition: 'Hot, dry spells interrupted by intense sporadic monsoon rains',
        idealForNewbies: 'Bajra and Guar are the most drought-tolerant crops in the world.',
        recommendedCrops: [
          {
            cropName: 'Pearl Millet / Bajra (बाजरा - MPMH 17 / HHB 67)',
            hindiName: 'बाजरा',
            sowingMonths: 'July (after first rain)',
            harvestMonths: 'September – October',
            waterNeed: 'Low',
            expectedYield: '12 - 16 Quintals/Acre',
            soilSuitability: 'Sandy desert soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Matures in 65-70 days; tolerates temperatures up to 45°C without wilting.',
          },
          {
            cropName: 'Guar / Cluster Bean (ग्वार - RGC 936)',
            hindiName: 'ग्वार',
            sowingMonths: 'July',
            harvestMonths: 'October – November',
            waterNeed: 'Low',
            expectedYield: '4 - 6 Quintals/Acre',
            soilSuitability: 'Light sandy soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Guar gum has strong global export demand in petroleum and food industries.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid (Vegetables & Fodder)',
        hindiSeasonName: 'जायद (सब्जी व हरा चारा)',
        period: 'March – May',
        weatherCondition: 'Dry, very hot desert winds',
        idealForNewbies: 'Growing cucurbits (muskmelon/tinda) on canal banks.',
        recommendedCrops: [
          {
            cropName: 'Muskmelon / Kharbuja (खरबूजा)',
            hindiName: 'खरबूजा',
            sowingMonths: 'February – March',
            harvestMonths: 'May',
            waterNeed: 'Medium',
            expectedYield: '120 - 150 Quintals/Acre',
            soilSuitability: 'Sandy riverbed loam',
            beginnerDifficulty: 'Moderate',
            proTip: 'Thrives in desert sun; high sugars develop under warm sunny days.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Invest in Drip & Sprinkler irrigation; Rajasthan government provides up to 75% subsidy through Rajkisan portal.',
      soilPreparation: 'Erect windbreaks or plant Khemp/Khejri boundaries to prevent topsoil sand dune erosion.',
      mistakeToAvoid: 'Never flood-irrigate sandy fields; nutrients leach instantly below the root zone.',
      governmentSupportNote: 'Apply for Farm Pond (खेत तलाई) subsidy of up to ₹1,35,000 to store rainwater.',
    },
  },

  karnataka: {
    stateId: 'karnataka',
    stateName: 'Karnataka',
    dominantSoils: [
      {
        name: 'Red Sandy Loam / Ragi Soil (ಕೆಂಪು ಮಣ್ಣು)',
        type: 'South Interior Karnataka',
        characteristics: 'Porous, well-aerated, rich in iron, low in nitrogen; ideal for rainfed millets, vegetables and pulses.',
        phRange: '6.0 - 7.0 (Slightly acidic to neutral)',
        bestCrops: ['Ragi (Finger Millet)', 'Tomato', 'Maize', 'Groundnut', 'Tur', 'Sunflower'],
      },
      {
        name: 'Deep Black Soil (ಕಪ್ಪು ಮಣ್ಣು)',
        type: 'North Karnataka (Belagavi/Dharwad/Gulbarga)',
        characteristics: 'Heavy clay, high water retention, rich in calcium carbonate and potash.',
        phRange: '7.5 - 8.5',
        bestCrops: ['Tur / Kalaburagi Red Gram (GI)', 'Cotton', 'Bengal Gram', 'Jowar', 'Sugarcane'],
      },
    ],
    climaticZones: 'Coastal tropical monsoon, Western Ghats highland rainforest, and semi-arid Deccan plateau',
    annualRainfall: '550 mm (North dry zone) to 3,500 mm (Malnad & Coastal belt)',
    averageTemperature: '16°C in winter to 38°C in summer',
    waterAvailability: 'Krishna, Cauvery river basins and extensive borewell network',
    currentSeasonalAlert: 'North Karnataka black soils are ready for Rabi Bengal gram and Rabi Jowar sowing.',
    seasons: [
      {
        seasonId: 'kharif',
        seasonName: 'Kharif (Monsoon Crop)',
        hindiSeasonName: 'खरीफ (ಮುಂಗಾರು ಬೆಳೆ)',
        period: 'June – October',
        weatherCondition: 'Warm, cloudy, southwest monsoon showers',
        idealForNewbies: 'Ragi (Finger Millet) and Red Gram (Tur) have zero pest risk and robust government MSP buying.',
        recommendedCrops: [
          {
            cropName: 'Ragi / Finger Millet (ರಾಗಿ - GPU 28 / MR 1)',
            hindiName: 'रागी',
            sowingMonths: 'July – August',
            harvestMonths: 'November',
            waterNeed: 'Low',
            expectedYield: '12 - 16 Quintals/Acre',
            soilSuitability: 'Red sandy loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Super-food with immense urban demand; drought-proof crop that requires almost zero pesticide.',
          },
          {
            cropName: 'Kalaburagi Red Gram / Tur (ತೊಗರಿ - GRG 811)',
            hindiName: 'तूर दाल (जीआई टैग)',
            sowingMonths: 'June – July',
            harvestMonths: 'December – January',
            waterNeed: 'Low',
            expectedYield: '7 - 10 Quintals/Acre',
            soilSuitability: 'Deep black soil of North Karnataka',
            beginnerDifficulty: 'Easy',
            proTip: 'Has Geographical Indication (GI) tag; commands highest dal mill prices in Gulbarga APMC.',
          },
        ],
      },
      {
        seasonId: 'rabi',
        seasonName: 'Rabi (Hingaru Season)',
        hindiSeasonName: 'रबी (ಹಿಂಗಾರು ಬೆಳೆ)',
        period: 'October – February',
        weatherCondition: 'Northeast monsoon in south, cool dry winds in north',
        idealForNewbies: 'Bengal Gram (Chana) and Sunflower in Northern plains.',
        recommendedCrops: [
          {
            cropName: 'Bengal Gram (ಕಡಲೆ - JG 11 / Annigeri 1)',
            hindiName: 'चना',
            sowingMonths: 'October – November',
            harvestMonths: 'February',
            waterNeed: 'Low',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Black soil with residual moisture',
            beginnerDifficulty: 'Easy',
            proTip: 'Requires no synthetic nitrogen fertilizer; roots fix atmospheric nitrogen naturally.',
          },
          {
            cropName: 'Sunflower (ಸೂರ್ಯಕಾಂತಿ - KBSH 44)',
            hindiName: 'सूरजमुखी',
            sowingMonths: 'November',
            harvestMonths: 'February',
            waterNeed: 'Medium',
            expectedYield: '6 - 8 Quintals/Acre',
            soilSuitability: 'Well-drained loam or black soil',
            beginnerDifficulty: 'Easy',
            proTip: 'Keep bee boxes nearby to improve pollination seed set by up to 25%.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Summer (Besige Season)',
        hindiSeasonName: 'जायद (ಬೇಸಿಗೆ ಬೆಳೆ)',
        period: 'February – May',
        weatherCondition: 'Warm sunny weather; needs drip or borewell',
        idealForNewbies: 'Groundnut and sweet corn.',
        recommendedCrops: [
          {
            cropName: 'Summer Groundnut (ಬೇಸಿಗೆ ಕಡಲೆಕಾಯಿ)',
            hindiName: 'मूंगफली',
            sowingMonths: 'January – February',
            harvestMonths: 'May',
            waterNeed: 'Medium',
            expectedYield: '12 - 16 Quintals/Acre',
            soilSuitability: 'Red sandy loam with gypsum',
            beginnerDifficulty: 'Easy',
            proTip: 'Free of leaf spot (Tikka) disease during dry summer months.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Apply for Raitha Siri scheme incentives for growing minor millets (Ragi, Foxtail, Little millet).',
      soilPreparation: 'Apply 5 tonnes of Farm Yard Manure (FYM) per acre to balance acidic red soils.',
      mistakeToAvoid: 'Do not use flood irrigation on red soils; nutrient runoff will wash away topsoil.',
      governmentSupportNote: 'Use the Karnataka Bhoomi and Raitha Mitra portal to check subsidized seed availability at RSKs.',
    },
  },

  telangana: {
    stateId: 'telangana',
    stateName: 'Telangana',
    dominantSoils: [
      {
        name: 'Red Sandy Loam / Chelka Soil (ఎర్ర నేలలు)',
        type: 'Telangana Plateau',
        characteristics: 'Coarse texture, highly permeable, rich in iron, responsive to irrigation and fertilizer.',
        phRange: '6.5 - 7.5',
        bestCrops: ['Maize', 'Red Chilli', 'Groundnut', 'Turmeric', 'Vegetables'],
      },
      {
        name: 'Black Regur Soil (నల్ల రేగడి నేలలు)',
        type: 'Northern Belt (Adilabad/Warangal/Khammam)',
        characteristics: 'Heavy clay, high moisture holding capacity, ideal for commercial cash crops.',
        phRange: '7.5 - 8.5',
        bestCrops: ['Cotton', 'Paddy', 'Soybean', 'Bengal Gram'],
      },
    ],
    climaticZones: 'Semi-arid tropical with hot dry summers and moderate monsoon rainfall',
    annualRainfall: '700 mm to 1,100 mm',
    averageTemperature: '15°C in winter to 44°C in summer',
    waterAvailability: 'Kaleshwaram Lift Irrigation, Mission Kakatiya tanks, and borewells',
    currentSeasonalAlert: 'Warangal & Khammam chilli farmers entering prime picking season; Yasangi paddy nursery preparation under way.',
    seasons: [
      {
        seasonId: 'kharif',
        seasonName: 'Kharif / Vaanakalam (వానకాలం)',
        hindiSeasonName: 'खरीफ (वानकालम)',
        period: 'June – October',
        weatherCondition: 'Warm, humid, southwest monsoon rainfall',
        idealForNewbies: 'Cotton and Maize offer high liquidity in Warangal Enamamula and Nizamabad mandis.',
        recommendedCrops: [
          {
            cropName: 'Cotton (ప్రత్తి / దూది)',
            hindiName: 'कपास',
            sowingMonths: 'June – July',
            harvestMonths: 'November – February',
            waterNeed: 'Medium',
            expectedYield: '10 - 15 Quintals/Acre',
            soilSuitability: 'Deep black soils',
            beginnerDifficulty: 'Moderate',
            proTip: 'Warangal Enamamula is one of Asia\'s largest cotton markets with digital electronic weighing.',
          },
          {
            cropName: 'Maize / Corn (మొక్కజొన్న)',
            hindiName: 'मक्का',
            sowingMonths: 'June – July',
            harvestMonths: 'October',
            waterNeed: 'Medium',
            expectedYield: '25 - 32 Quintals/Acre',
            soilSuitability: 'Red chelka and light black soils',
            beginnerDifficulty: 'Easy',
            proTip: 'Feed mills in Hyderabad provide continuous high-volume off-take.',
          },
        ],
      },
      {
        seasonId: 'rabi',
        seasonName: 'Rabi / Yasangi (యాసంగి)',
        hindiSeasonName: 'रबी (यासंगी)',
        period: 'November – March',
        weatherCondition: 'Dry, warm sunny days, mild nights',
        idealForNewbies: 'Groundnut and Bengal Gram under borewell or tank irrigation.',
        recommendedCrops: [
          {
            cropName: 'Rabi Groundnut (యాసంగి వేరుశనగ - Kadiri 6)',
            hindiName: 'मूंगफली',
            sowingMonths: 'November – December',
            harvestMonths: 'March',
            waterNeed: 'Medium',
            expectedYield: '14 - 18 Quintals/Acre',
            soilSuitability: 'Red sandy chelka soils',
            beginnerDifficulty: 'Easy',
            proTip: 'Yasangi groundnut gives 30% higher pod yield than Kharif because of disease-free dry sunshine.',
          },
          {
            cropName: 'Teja Red Chilli (తేజ మిర్చి)',
            hindiName: 'लाल मिर्च (तेजा)',
            sowingMonths: 'Transplant in August – September',
            harvestMonths: 'January – April',
            waterNeed: 'High',
            expectedYield: '25 - 35 Quintals/Acre (Dry)',
            soilSuitability: 'Well-drained fertile loam',
            beginnerDifficulty: 'Challenging',
            proTip: 'Export favorite with high capsaicin content; prices often exceed ₹18,000/qtl in Khammam yard.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Check Rythu Bharosa benefits and register on the Dharani portal for agricultural identity.',
      soilPreparation: 'Apply gypsum to red soils to supply calcium and sulfur required for oilseed crops.',
      mistakeToAvoid: 'Avoid indiscriminate pesticide spraying for thrips on chilli; use neem-based botanicals first.',
      governmentSupportNote: 'Avail 24x7 free agricultural power supply responsibly through automated motor starters.',
    },
  },
};

// Fallback generic profile generator for any other state in India
export function getStateAgriProfile(stateId: string, stateName: string): StateSoilWeatherProfile {
  if (STATE_AGRI_PROFILES[stateId]) {
    return STATE_AGRI_PROFILES[stateId];
  }

  // Generate an intelligent, scientifically-grounded profile for other states
  return {
    stateId,
    stateName,
    dominantSoils: [
      {
        name: 'Alluvial & Loamy Soil (उपजाऊ दोमट मिट्टी)',
        type: 'Regional River Basin',
        characteristics: 'Deep, permeable, well-balanced texture with moderate to high fertility.',
        phRange: '6.5 - 7.8 (Neutral)',
        bestCrops: ['Paddy', 'Wheat', 'Mustard', 'Vegetables', 'Pulses'],
      },
      {
        name: 'Red & Lateritic Loam (लाल-दोमट मिट्टी)',
        type: 'Upland & Plateau',
        characteristics: 'Good drainage, rich in iron oxides, highly responsive to organic composting.',
        phRange: '5.8 - 6.8',
        bestCrops: ['Millets', 'Pulses', 'Oilseeds', 'Horticulture'],
      },
    ],
    climaticZones: 'Regional monsoon climate with seasonal variations in temperature and rainfall',
    annualRainfall: '800 mm to 1,600 mm',
    averageTemperature: '14°C to 38°C depending on season',
    waterAvailability: 'Surface canals, state reservoirs, and groundwater irrigation',
    currentSeasonalAlert: 'Seasonal soil conditions are favorable for current cropping calendar; verify local mandi arrival prices before planting.',
    seasons: [
      {
        seasonId: 'kharif',
        seasonName: 'Kharif Season (Monsoon)',
        hindiSeasonName: 'खरीफ मौसम (मानसून)',
        period: 'June – October',
        weatherCondition: 'Warm, humid, southwest monsoon showers',
        idealForNewbies: 'Paddy, Soybean, or Maize depending on rainfall intensity.',
        recommendedCrops: [
          {
            cropName: 'Paddy / Rice (धान)',
            hindiName: 'धान',
            sowingMonths: 'June – July',
            harvestMonths: 'October – November',
            waterNeed: 'High',
            expectedYield: '18 - 25 Quintals/Acre',
            soilSuitability: 'Clay loam to heavy clay',
            beginnerDifficulty: 'Easy',
            proTip: 'Maintain optimal nursery spacing for stronger root development.',
          },
          {
            cropName: 'Pulses / Arhar / Moong (दालें)',
            hindiName: 'दलहन फसलें',
            sowingMonths: 'July',
            harvestMonths: 'October – December',
            waterNeed: 'Low',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Well-drained loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Enriches soil naturally with atmospheric nitrogen.',
          },
        ],
      },
      {
        seasonId: 'rabi',
        seasonName: 'Rabi Season (Winter)',
        hindiSeasonName: 'रबी मौसम (सर्दियां)',
        period: 'October – March',
        weatherCondition: 'Cool, pleasant sunny days with low humidity',
        idealForNewbies: 'Wheat and Mustard offer guaranteed local APMC buying.',
        recommendedCrops: [
          {
            cropName: 'Wheat / Gehun (गेहूं)',
            hindiName: 'गेहूं',
            sowingMonths: 'November',
            harvestMonths: 'March – April',
            waterNeed: 'Medium',
            expectedYield: '16 - 22 Quintals/Acre',
            soilSuitability: 'Deep loamy soils',
            beginnerDifficulty: 'Easy',
            proTip: 'Sow certified high-yielding seeds within the optimal 15-day window.',
          },
          {
            cropName: 'Mustard / Sarson (सरसों)',
            hindiName: 'सरसों',
            sowingMonths: 'October',
            harvestMonths: 'February – March',
            waterNeed: 'Low',
            expectedYield: '6 - 9 Quintals/Acre',
            soilSuitability: 'Loam to sandy loam',
            beginnerDifficulty: 'Easy',
            proTip: 'Low water requirement with high cash value in local markets.',
          },
        ],
      },
      {
        seasonId: 'zaid',
        seasonName: 'Zaid Season (Summer)',
        hindiSeasonName: 'जायद मौसम (गर्मी)',
        period: 'March – May',
        weatherCondition: 'Hot, dry, intense solar radiation',
        idealForNewbies: 'Summer Moong or vegetables like Watermelon and Cucumber.',
        recommendedCrops: [
          {
            cropName: 'Summer Moong (मूंग दाल)',
            hindiName: 'मूंग दाल',
            sowingMonths: 'March',
            harvestMonths: 'May (60 days)',
            waterNeed: 'Low',
            expectedYield: '4 - 6 Quintals/Acre',
            soilSuitability: 'Well-drained loams',
            beginnerDifficulty: 'Easy',
            proTip: 'Fast 60-day cash turnover before monsoon field preparation.',
          },
        ],
      },
    ],
    newbieFarmerStarterGuide: {
      topRule: 'Get your soil tested at the nearest Krishi Vigyan Kendra (KVK) for exact N-P-K recommendations.',
      soilPreparation: 'Plough the land thoroughly and add organic compost to enhance water retention.',
      mistakeToAvoid: 'Never over-irrigate seedlings; stagnant water suffocates tender root hairs.',
      governmentSupportNote: 'Visit your local block agriculture office to register for PM-Kisan and subsidized seeds.',
    },
  };
}

// Multilingual month dictionary for sowing and harvesting schedules
const MONTH_TRANSLATIONS: Record<string, Record<Language, string>> = {
  January: { en: 'January', hi: 'जनवरी', mr: 'जानेवारी', pa: 'ਜਨਵਰੀ', gu: 'જાન્યુઆરી', te: 'జనవరి', kn: 'ಜನವರಿ', ta: 'ஜனவரி', bn: 'জানুয়ারী', ml: 'ജനുവരി', or: 'ଜାନୁଆରୀ', as: 'জানুৱাৰী', ur: 'جنوری' },
  February: { en: 'February', hi: 'फरवरी', mr: 'फेब्रुवारी', pa: 'ਫ਼ਰਵਰੀ', gu: 'ફેબ્રુઆરી', te: 'ఫిబ్రవరి', kn: 'ಫೆಬ್ರವರಿ', ta: 'பிப்ரவரி', bn: 'ফেব্রুয়ারী', ml: 'ഫെബ്രുവരി', or: 'ଫେବୃଆରୀ', as: 'ফেব্ৰুৱাৰী', ur: 'فروری' },
  March: { en: 'March', hi: 'मार्च', mr: 'मार्च', pa: 'ਮਾਰਚ', gu: 'માર્ચ', te: 'మార్చి', kn: 'ಮಾರ್ಚ್', ta: 'மார்ச்', bn: 'মার্চ', ml: 'മാർച്ച്', or: 'ମାର୍ଚ୍ଚ', as: 'মাৰ্চ', ur: 'مارچ' },
  April: { en: 'April', hi: 'अप्रैल', mr: 'एप्रिल', pa: 'ਅਪ੍ਰੈਲ', gu: 'એપ્રિલ', te: 'ఏప్రిల్', kn: 'ಏಪ್ರಿಲ್', ta: 'ஏப்ரல்', bn: 'এপ্রিল', ml: 'ഏപ്രിൽ', or: 'ଏପ୍ରିଲ', as: 'এপ্ৰিল', ur: 'اپریل' },
  May: { en: 'May', hi: 'मई', mr: 'मे', pa: 'ਮਈ', gu: 'મે', te: 'మే', kn: 'ಮೇ', ta: 'ಮೇ', bn: 'মে', ml: 'മേയ്', or: 'ମେ', as: 'মে', ur: 'مئی' },
  June: { en: 'June', hi: 'जून', mr: 'जून', pa: 'ਜੂਨ', gu: 'જૂન', te: 'జూన్', kn: 'ಜೂನ್', ta: 'ஜூன்', bn: 'জুন', ml: 'ജൂൺ', or: 'ଜୁନ', as: 'জুন', ur: 'جون' },
  July: { en: 'July', hi: 'जुलाई', mr: 'जुलै', pa: 'ਜੁਲਾਈ', gu: 'જુલાઈ', te: 'జూలై', kn: 'ಜುಲೈ', ta: 'ஜூலை', bn: 'জুলাই', ml: 'ജൂലൈ', or: 'ଜୁଲାଇ', as: 'জুলাই', ur: 'جولائی' },
  August: { en: 'August', hi: 'अगस्त', mr: 'ऑगस्ट', pa: 'ਅਗਸਤ', gu: 'ઓગસ્ટ', te: 'ఆగస్టు', kn: 'ಆಗಸ್ಟ್', ta: 'ஆகஸ்ட்', bn: 'আগস্ট', ml: 'ആഗസ്റ്റ്', or: 'ଅଗଷ୍ଟ', as: 'আগষ্ট', ur: 'اگست' },
  September: { en: 'September', hi: 'सितंबर', mr: 'सप्टेंबर', pa: 'ਸਤੰਬਰ', gu: 'સપ્ટેમ્બર', te: 'సెప్టెంబర్', kn: 'ಸೆಪ್ಟೆಂಬರ್', ta: 'செப்டம்பர்', bn: 'সেপ্টেম্বর', ml: 'സെപ്റ്റംബർ', or: 'ସେପ୍ଟେମ୍ବର', as: 'ছেপ্টেম্বৰ', ur: 'ستمبر' },
  October: { en: 'October', hi: 'अक्टूबर', mr: 'ऑक्टोबर', pa: 'ਅਕਤੂਬਰ', gu: 'ઓક્ટોબર', te: 'అక్టోబర్', kn: 'ಅಕ್ಟೋಬರ್', ta: 'அக்டோபர்', bn: 'অক্টোবর', ml: 'ഒക്ടോബർ', or: 'ଅକ୍ଟୋବର', as: 'অক্টোবৰ', ur: 'اکتوبر' },
  November: { en: 'November', hi: 'नवंबर', mr: 'नोव्हेंबर', pa: 'ਨਵੰਬਰ', gu: 'નવેમ્બર', te: 'నవంబర్', kn: 'ನವೆಂಬರ್', ta: 'நவம்பர்', bn: 'নভেম্বর', ml: 'നവംബർ', or: 'ନଭେମ୍ବର', as: 'নৱেম্বৰ', ur: 'نومبر' },
  December: { en: 'December', hi: 'दिसंबर', mr: 'डिसेंबर', pa: 'ਦਸੰਬਰ', gu: 'ડિસેમ્બર', te: 'డిసెంబర్', kn: 'ಡಿಸೆಂಬರ್', ta: 'டிசம்பர்', bn: 'ডিসেম্বর', ml: 'ഡിസംബർ', or: 'ଡିସେମ୍ବର', as: 'ডিচেম্বৰ', ur: 'دسمبر' },
};

export function localizeScheduleText(text: string, lang: Language): string {
  if (lang === 'en' || !text) return text;

  let localized = text;
  for (const [month, translations] of Object.entries(MONTH_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${month}\\b`, 'gi');
    if (regex.test(localized)) {
      localized = localized.replace(regex, translations[lang] || translations.hi || month);
    }
  }

  // Connectors
  if (lang === 'hi' || lang === 'mr') {
    localized = localized
      .replace(/\bto\b/gi, 'से')
      .replace(/\band\b/gi, 'व')
      .replace(/\bdays\b/gi, 'दिन');
  } else if (lang === 'gu') {
    localized = localized
      .replace(/\bto\b/gi, 'થી')
      .replace(/\band\b/gi, 'અને')
      .replace(/\bdays\b/gi, 'દિવસ');
  } else if (lang === 'pa') {
    localized = localized
      .replace(/\bto\b/gi, 'ਤੋਂ')
      .replace(/\band\b/gi, 'ਅਤੇ')
      .replace(/\bdays\b/gi, 'ਦਿਨ');
  } else if (lang === 'te') {
    localized = localized
      .replace(/\bto\b/gi, 'నుండి')
      .replace(/\band\b/gi, 'మరియు')
      .replace(/\bdays\b/gi, 'రోజులు');
  } else if (lang === 'kn') {
    localized = localized
      .replace(/\bto\b/gi, 'ರಿಂದ')
      .replace(/\band\b/gi, 'ಮತ್ತು')
      .replace(/\bdays\b/gi, 'ದಿನಗಳು');
  } else if (lang === 'ta') {
    localized = localized
      .replace(/\bto\b/gi, 'முதல்')
      .replace(/\band\b/gi, 'மற்றும்')
      .replace(/\bdays\b/gi, 'நாட்கள்');
  } else if (lang === 'bn') {
    localized = localized
      .replace(/\bto\b/gi, 'থেকে')
      .replace(/\band\b/gi, 'এবং')
      .replace(/\bdays\b/gi, 'দিন');
  }

  return localized;
}

// Multilingual 4 Golden Rules per state
export function getLocalizedStarterGuide(
  stateId: string,
  lang: Language,
  fallback: {
    topRule: string;
    soilPreparation: string;
    mistakeToAvoid: string;
    governmentSupportNote: string;
  }
) {
  if (lang === 'en') return fallback;

  if (stateId === 'maharashtra') {
    if (lang === 'mr') {
      return {
        soilPreparation: 'उन्हाळ्यात २५-३० सेंमी खोल नांगरणी करा, जेणेकरून किडींचे कोष व बुरशी तीव्र उन्हामुळे नष्ट होईल.',
        topRule: 'रासायनिक खतांचा अतिरिक्त वापर टाळण्यासाठी सर्वात आधी माती परीक्षण (मृदा आरोग्य पत्रिका) करून घ्या.',
        mistakeToAvoid: 'काळी कसदार जमिनीत बियाणे ५ सेंमी पेक्षा जास्त खोल पेरू नका; जास्त खोल पेरल्यास बियाणे कुजण्याची शक्यता असते.',
        governmentSupportNote: 'महाडीबीटी आणि प्रधानमंत्री कृषी सिंचन योजनेअंतर्गत ठिबक सिंचनावर ५०-८०% अनुदान मिळवा.',
      };
    }
    return {
      soilPreparation: 'गर्मियों में 25-30 सेमी गहरी जुताई करें ताकि हानिकारक कीटों के अवशेष और फफूंद तेज धूप से नष्ट हो जाएं।',
      topRule: 'रासायनिक खाद खरीदने से पहले अपने नजदीकी कृषि विज्ञान केंद्र (KVK) से मृदा स्वास्थ्य कार्ड की जांच जरूर कराएं।',
      mistakeToAvoid: 'काली भारी मिट्टी में बीज को 5 सेमी से ज्यादा गहरा कभी न बोएं; अधिक गहराई पर बीज सड़ने का खतरा रहता है।',
      governmentSupportNote: 'महाडीबीटी और पीएम कृषि सिंचाई योजना के तहत ड्रिप एवं स्प्रिंकलर पर 50-80% तक अनुदान प्राप्त करें।',
    };
  }

  if (stateId === 'punjab') {
    if (lang === 'pa') {
      return {
        soilPreparation: 'ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਲੇਜ਼ਰ ਲੈਂਡ ਲੈਵਲਰ ਨਾਲ ਖੇਤ ਪੱਧਰਾ ਕਰੋ; ਇਸ ਨਾਲ 25% ਪਾਣੀ ਦੀ ਬਚਤ ਹੁੰਦੀ ਹੈ।',
        topRule: 'ਝੋਨੇ ਦੀ ਪਰਾਲੀ ਨੂੰ ਅੱਗ ਨਾ ਲਾਓ; ਹੈਪੀ ਸੀਡਰ ਜਾਂ ਸੁਪਰ ਸੀਡਰ ਨਾਲ ਸਿੱਧੀ ਕਣਕ ਦੀ ਬਿਜਾਈ ਕਰੋ।',
        mistakeToAvoid: 'ਯੂਰੀਆ ਖਾਦ ਜ਼ਿਆਦਾ ਨਾ ਪਾਓ; ਲੋੜ ਤੋਂ ਵੱਧ ਯੂਰੀਆ ਫਸਲ ਨੂੰ ਕੀੜਿਆਂ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲ ਬਣਾਉਂਦਾ ਹੈ।',
        governmentSupportNote: 'ਪੰਜਾਬ ਖੇਤੀਬਾੜੀ ਵਿਭਾਗ ਵੱਲੋਂ ਫਸਲੀ ਰਹਿੰਦ-ਖੂੰਹਦ ਪ੍ਰਬੰਧਨ ਮਸ਼ੀਨਰੀ ਤੇ 50-80% ਸਬਸਿਡੀ ਉਪਲਬਧ ਹੈ।',
      };
    }
    return {
      soilPreparation: 'बुवाई से पहले लेजर लैंड लेवलर से खेत को समतल करें; इससे 25% पानी की बचत होती है।',
      topRule: 'धान की पराली में आग न लगाएं; हैप्पी सीडर या सुपर सीडर से गेहूं की सीधी बुवाई करें।',
      mistakeToAvoid: 'यूरिया का अंधाधुंध उपयोग न करें; अधिक यूरिया से फसल में बीमारी व कीटों का प्रकोप बढ़ता है।',
      governmentSupportNote: 'पराली प्रबंधन एवं कृषि यंत्रों पर 50-80% सब्सिडी का लाभ उठाएं।',
    };
  }

  if (stateId === 'gujarat') {
    if (lang === 'gu') {
      return {
        soilPreparation: 'જીરું અને કપાસની વાવણી પહેલાં જમીનમાં ટ્રાઇકોડર્મા યુક્ત છાણિયું ખાતર અવશ્ય ભેળવો.',
        topRule: 'જમીનનું પરીક્ષણ કરાવી સોઇલ હેલ્થ કાર્ડ મુજબ જ ખાતરની માત્રા નક્કી કરો.',
        mistakeToAvoid: 'જીરું અને વરિયાળી જેવા પાકમાં વધુ પડતું પિયત ન આપો; વધુ પાણીથી મૂળનો સડો થાય છે.',
        governmentSupportNote: 'આઇ-ખેડૂત પોર્ટલ પર ડ્રિપ સિંચાઇ અને સોલાર પંપ માટે 50-80% સરકારી સહાય મેળવો.',
      };
    }
    return {
      soilPreparation: 'जीरा व कपास की बुवाई से पूर्व खेत में ट्राइकोडर्मा युक्त सड़ा हुआ गोबर खाद मिलाएं।',
      topRule: 'मृदा स्वास्थ्य कार्ड बनवाएं और संस्तुत मात्रा में ही फास्फोरस व पोटाश का उपयोग करें।',
      mistakeToAvoid: 'जीरा की फसल में अत्यधिक सिंचाई से बचें; अधिक नमी से उकठा रोग फैलता है।',
      governmentSupportNote: 'आई-खेड़ूत पोर्टल के माध्यम से ड्रिप एवं सोलर वाटर पंप पर 70-80% तक अनुदान प्राप्त करें।',
    };
  }

  if (stateId === 'uttar_pradesh') {
    return {
      soilPreparation: 'हरी खाद (ढैंचा या सनई) की पलटाई करके मिट्टी में जैविक कार्बन और नाइट्रोजन की मात्रा बढ़ाएं।',
      topRule: 'प्रमाणित बीज का ही चयन करें और बुवाई से पूर्व फफूंदनाशी (थीरम/बाविस्टिन) से बीजोपचार अवश्य करें।',
      mistakeToAvoid: 'गेहूं की देरी से बुवाई (दिसंबर बाद) करने से बचें; देर से बोने पर प्रति सप्ताह 1.5 क्विंटल पैदावार घटती है।',
      governmentSupportNote: 'पारदर्शी किसान सेवा पोर्टल पर पंजीकृत होकर अनुदानित बीज व कृषि यंत्रों पर छूट प्राप्त करें।',
    };
  }

  if (stateId === 'rajasthan') {
    return {
      soilPreparation: 'रेतीली मिट्टी में नमी संरक्षण के लिए खेत की मेड़बंदी करें और जैविक मल्चिंग का प्रयोग करें।',
      topRule: 'कम पानी वाली शुष्क फसलें (बाजरा, ग्वार, सरसों, मूंग) चुनें जो सूखे को सहन कर सकें।',
      mistakeToAvoid: 'खारे पानी वाले नलकूप से सीधे सिंचाई न करें; जिप्सम का उपयोग कर क्षारियता घटाएं।',
      governmentSupportNote: 'राजकिसान साथी पोर्टल से तारबंदी योजना व खेत तलाई निर्माण पर 60% अनुदान प्राप्त करें।',
    };
  }

  if (stateId === 'karnataka') {
    if (lang === 'kn') {
      return {
        soilPreparation: 'ಕೆಂಪು ಮಣ್ಣಿಗೆ ಸುಣ್ಣ ಅಥವಾ ಜಿಪ್ಸಮ್ ಬೆರೆಸಿ ಮಣ್ಣಿನ ಆಮ್ಲೀಯತೆಯನ್ನು ಸರಿದೂಗಿಸಿ.',
        topRule: 'ರಾಗಿ ಮತ್ತು ಬೇಳೆಕಾಳುಗಳ ಬಿತ್ತನೆಗೆ ಮುನ್ನ ರೈಜೋಬಿಯಂ ಜೈವಿಕ ಗೊಬ್ಬರದಿಂದ ಬೀಜೋಪಚಾರ ಮಾಡಿ.',
        mistakeToAvoid: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಪರೀಕ್ಷಿಸದೆ ಅತಿಯಾಗಿ ನೀರು ಹಾಯಿಸಬೇಡಿ.',
        governmentSupportNote: 'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆಯಡಿ ಕೃಷಿ ಹೊಂಡ ಮತ್ತು ಪಾಲಿಥೀನ್ ಹೊದಿಕೆಗೆ ಗರಿಷ್ಠ ಸಬ್ಸಿಡಿ ಪಡೆಯಿರಿ.',
      };
    }
    return {
      soilPreparation: 'लाल मिट्टी में चूना या जिप्सम मिलाकर मिट्टी की अम्लीयता को संतुलित करें।',
      topRule: 'रागी और दलहनी फसलों की बुवाई से पहले राइजोबियम से बीजोपचार अवश्य करें।',
      mistakeToAvoid: 'कच्चा गोबर कभी खेत में न डालें; अच्छी तरह सड़े कंपोस्ट का ही प्रयोग करें।',
      governmentSupportNote: 'कृषि भाग्य योजना के तहत खेत तालाब एवं ड्रिप पर विशेष सब्सिडी का लाभ लें।',
    };
  }

  if (stateId === 'telangana') {
    if (lang === 'te') {
      return {
        soilPreparation: 'ఎర్ర నేలల్లో సేంద్రీయ ఎరువులు (జీవామృతం, పశువుల ఎరువు) వేసి నేల సారాన్ని పెంచండి.',
        topRule: 'వరి సాగులో ప్రత్యామ్నాయ తడి-ఆరబెట్టే విధానం (AWD) పాటించి నీటిని ఆదా చేయండి.',
        mistakeToAvoid: 'మిరపలో తామర పురుగు నివారణకు ప్రారంభంలోనే మోతాదుకు మించి రసాయన మందులు పిచికారీ చేయవద్దు.',
        governmentSupportNote: 'రైతు బంధు మరియు ఉచిత వ్యవసాయ విద్యుత్ సదుపాయాన్ని బాధ్యతాయుతంగా వినియోగించుకోండి.',
      };
    }
    return {
      soilPreparation: 'लाल मिट्टी में प्रचुर मात्रा में सड़ी गोबर खाद मिलाकर जल-धारण क्षमता बढ़ाएं।',
      topRule: 'धान में वैकल्पिक गीला-सूखा (AWD) सिंचाई तरीका अपनाएं जिससे 30% पानी की बचत हो।',
      mistakeToAvoid: 'मिर्च में रसचूसक कीटों के लिए पहले ही दिन से अंधाधुंध कीटनाशक न छिड़कें; नीम का तेल प्रयोग करें।',
      governmentSupportNote: 'रायथु बंधु योजना एवं कृषि उपकरणों पर राज्य सब्सिडी का लाभ उठाएं।',
    };
  }

  // General Hindi/Regional fallback
  return {
    soilPreparation: 'खेत की 2-3 बार गहरी जुताई करें और 4-5 टन प्रति एकड़ सड़ा हुआ गोबर खाद या कंपोस्ट मिलाएं।',
    topRule: 'नजदीकी कृषि विज्ञान केंद्र (KVK) से मृदा परीक्षण कराकर अनुशंसित एन-पी-के अनुपात ही डालें।',
    mistakeToAvoid: 'छोटे अंकुरों पर अधिक पानी न लगाएं; खेत में पानी जमा होने से जड़ें सड़ सकती हैं।',
    governmentSupportNote: 'पीएम-किसान सम्मान निधि और राज्य कृषि विभाग की रियायती बीज योजनाओं का लाभ लें।',
  };
}

// Generate an audio readout script tailored to language and state
export function generateAudioAdvisoryText(
  stateName: string,
  seasonName: string,
  topCrops: string[],
  lang: Language
): string {
  const cropList = topCrops.slice(0, 3).join(', ');

  if (lang === 'mr') {
    return `${stateName} मधील शेतकरी बांधवांसाठी कृषी सल्ला. सध्याचा काळ ${seasonName} साठी अत्यंत अनुकूल आहे. नवशिक्या शेतकऱ्यांसाठी ${cropList} ही फायदेशीर पिके आहेत. पेरणीपूर्वी बीजप्रक्रिया अवश्य करा आणि माती आरोग्य पत्रिकेनुसारच खते द्या.`;
  }
  if (lang === 'gu') {
    return `${stateName}ના ખેડૂત મિત્રો માટે કૃષિ સલાહ. અત્યારે ${seasonName} માટે ઉત્તમ સમય છે. નવા ખેડૂતો માટે ${cropList} ખૂબ જ સારા પાક છે. વાવણી પહેલાં બીજ માવજત કરો અને સોઈલ હેલ્થ કાર્ડ મુજબ ખાતર આપો.`;
  }
  if (lang === 'pa') {
    return `${stateName} ਦੇ ਕਿਸਾਨ ਵੀਰਾਂ ਲਈ ਖੇਤੀ ਸਲਾਹ। ਮੌਜੂਦਾ ਸਮਾਂ ${seasonName} ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ। ਨਵੇਂ ਕਿਸਾਨਾਂ ਲਈ ${cropList} ਸਭ ਤੋਂ ਵਧੀਆ ਫਸਲਾਂ ਹਨ। ਬਿਜਾਈ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜ ਸੋਧ ਜ਼ਰੂਰ ਕਰੋ ਅਤੇ ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਵਰਤੋ।`;
  }
  if (lang === 'te') {
    return `${stateName} రైతులకు ముఖ్య సూచన. ప్రస్తుత సమయం ${seasonName} పంటలకు ఎంతో అనుకూలం. నూతన రైతులకు ${cropList} అనువైన పంటలు. విత్తే ముందు విత్తన శుద్ధి తప్పక చేయండి.`;
  }
  if (lang === 'kn') {
    return `${stateName} ರೈತರಿಗೆ ಕೃಷಿ ಸಲಹೆ. ಪ್ರಸ್ತುತ ಸಮಯ ${seasonName} ಬೆಳೆಗಳಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ. ಹೊಸ ರೈತರಿಗೆ ${cropList} ಉತ್ತಮ ಬೆಳೆಗಳು. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜೋಪಚಾರ ಮಾಡಿ.`;
  }
  if (lang === 'ta') {
    return `${stateName} விவசாயிகளுக்கான ஆலோசனை. தற்போதைய பருவம் ${seasonName} பயிர்களுக்கு மிகவும் ஏற்றது. புதிய விவசாயிகளுக்கு ${cropList} சிறந்த பயிர்கள். விதை நேர்த்தி செய்து விதைக்கவும்.`;
  }
  if (lang === 'bn') {
    return `${stateName}র চাষী ভাইদের জন্য কৃষি পরামর্শ। বর্তমান সময় ${seasonName}র ফসলের জন্য অত্যন্ত অনুকূল। নতুন কৃষকদের জন্য ${cropList} উপযুক্ত ফসল। বীজ শোধন করে বপন করুন।`;
  }
  if (lang === 'hi') {
    return `${stateName} के किसान भाइयों के लिए कृषि सलाह। वर्तमान समय ${seasonName} के लिए अत्यंत अनुकूल है। नए किसानों के लिए ${cropList} उत्तम एवं सुरक्षित फसलें हैं। बुवाई से पूर्व बीजोपचार अवश्य करें और मिट्टी परीक्षण के अनुसार ही खाद दें।`;
  }

  // English fallback
  return `Agricultural advisory for ${stateName}. The current conditions are ideal for ${seasonName}. Recommended beginner crops include ${cropList}. Always conduct seed treatment before sowing and follow Soil Health Card fertilizer recommendations.`;
}

