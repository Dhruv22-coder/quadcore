/**
 * Weather fetching, geolocation management, and context-aware crop storage recommendations.
 */

import { Language } from '../types';

export type WeatherRiskType = 'rain' | 'heat' | 'none';

export interface WeatherData {
  latitude: number;
  longitude: number;
  locationName: string;
  source: 'gps' | 'regional' | 'simulated';
  temperature: number;
  maxTemperature: number;
  minTemperature: number;
  humidity?: number;
  precipitationSum: number; // in mm
  precipitationProbability: number; // percentage
  weatherCode: number;
  conditionLabel: string;
  riskType: WeatherRiskType;
  riskTitle: string;
  riskSeverity: 'none' | 'moderate' | 'extreme';
  isExtremeRisk: boolean;
  updatedAt: string;
}

export interface StorageSuggestion {
  cropId: string;
  cropName: string;
  riskType: 'rain' | 'heat';
  urgency: 'high' | 'critical';
  headline: string;
  facilityType: string;
  safeStorageDuration: string;
  moistureLimit: string;
  keyDirectives: string[];
  mandiTransitAdvice: string;
  audioSummary: {
    en: string;
    hi: string;
    mr: string;
  };
}

// Weather code translation helper
export function getWeatherConditionLabel(code: number, maxTemp: number, rainSum: number): string {
  if (rainSum >= 15 || [63, 65, 81, 82, 95, 96, 99].includes(code)) {
    return 'Heavy Rain / Thunderstorm';
  }
  if (rainSum > 2 || [51, 53, 55, 61, 80].includes(code)) {
    return 'Light to Moderate Rain';
  }
  if (maxTemp >= 40) {
    return 'Severe Heatwave';
  }
  if (maxTemp >= 37) {
    return 'High Heat & Sunshine';
  }
  if ([1, 2, 3].includes(code)) {
    return 'Partly Cloudy';
  }
  if ([45, 48].includes(code)) {
    return 'Foggy / High Humidity';
  }
  return 'Clear & Sunny';
}

/**
 * Fetch live forecast from Open-Meteo for given coordinates
 */
export async function fetchLiveWeatherData(
  lat: number,
  lng: number,
  locationName: string,
  isGps: boolean = false
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(
      4
    )}&longitude=${lng.toFixed(
      4
    )}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API returned status ${response.status}`);
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const temp = Math.round(current.temperature_2m ?? 31);
    const maxTemp = Math.round(daily.temperature_2m_max?.[0] ?? (temp + 4));
    const minTemp = Math.round(daily.temperature_2m_min?.[0] ?? (temp - 6));
    const rainSum = Math.round((daily.precipitation_sum?.[0] ?? (current.precipitation ?? 0)) * 10) / 10;
    const rainProb = Math.round(daily.precipitation_probability_max?.[0] ?? 15);
    const code = current.weather_code ?? (daily.weather_code?.[0] ?? 0);
    const humidity = current.relative_humidity_2m ?? 55;

    // Determine Risk:
    // Rain Risk: Rainfall >= 12mm OR rain prob >= 60% with rain code, or storm codes
    const isRainRisk = rainSum >= 12 || (rainProb >= 60 && [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96].includes(code));
    // Heat Risk: Max Temp >= 38°C
    const isHeatRisk = maxTemp >= 38 || temp >= 38;

    let riskType: WeatherRiskType = 'none';
    let riskTitle = 'Normal Conditions';
    let riskSeverity: 'none' | 'moderate' | 'extreme' = 'none';

    if (isRainRisk) {
      riskType = 'rain';
      riskSeverity = rainSum >= 25 ? 'extreme' : 'moderate';
      riskTitle = `Extreme Rainfall Risk (${rainSum} mm predicted)`;
    } else if (isHeatRisk) {
      riskType = 'heat';
      riskSeverity = maxTemp >= 41 ? 'extreme' : 'moderate';
      riskTitle = `Extreme Heat Risk (${maxTemp}°C heatwave)`;
    }

    return {
      latitude: lat,
      longitude: lng,
      locationName,
      source: isGps ? 'gps' : 'regional',
      temperature: temp,
      maxTemperature: maxTemp,
      minTemperature: minTemp,
      humidity,
      precipitationSum: rainSum,
      precipitationProbability: rainProb,
      weatherCode: code,
      conditionLabel: getWeatherConditionLabel(code, maxTemp, rainSum),
      riskType,
      riskTitle,
      riskSeverity,
      isExtremeRisk: riskType !== 'none',
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Weather fetch failed, utilizing regional climate fallback:', err);
    // Graceful fallback with realistic regional conditions
    return {
      latitude: lat,
      longitude: lng,
      locationName,
      source: isGps ? 'gps' : 'regional',
      temperature: 32,
      maxTemperature: 35,
      minTemperature: 24,
      humidity: 50,
      precipitationSum: 0,
      precipitationProbability: 10,
      weatherCode: 1,
      conditionLabel: 'Clear & Sunny',
      riskType: 'none',
      riskTitle: 'Normal Conditions',
      riskSeverity: 'none',
      isExtremeRisk: false,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}

/**
 * Generate simulated weather presets for testing Extreme Weather Risk behaviors
 */
export function getSimulatedWeatherData(
  type: 'rain' | 'heat' | 'normal',
  locationName: string,
  lat: number,
  lng: number
): WeatherData {
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (type === 'rain') {
    return {
      latitude: lat,
      longitude: lng,
      locationName,
      source: 'simulated',
      temperature: 25,
      maxTemperature: 27,
      minTemperature: 22,
      humidity: 92,
      precipitationSum: 42.5,
      precipitationProbability: 88,
      weatherCode: 65, // Heavy rain
      conditionLabel: 'Heavy Downpour & Thunderstorms',
      riskType: 'rain',
      riskTitle: 'Extreme Rainfall Risk (42.5 mm forecast)',
      riskSeverity: 'extreme',
      isExtremeRisk: true,
      updatedAt: time,
    };
  }

  if (type === 'heat') {
    return {
      latitude: lat,
      longitude: lng,
      locationName,
      source: 'simulated',
      temperature: 42,
      maxTemperature: 43.5,
      minTemperature: 29,
      humidity: 28,
      precipitationSum: 0,
      precipitationProbability: 5,
      weatherCode: 0, // Clear sky
      conditionLabel: 'Severe Heatwave & Dry Winds',
      riskType: 'heat',
      riskTitle: 'Extreme Heat Risk (43.5°C Heatwave)',
      riskSeverity: 'extreme',
      isExtremeRisk: true,
      updatedAt: time,
    };
  }

  // Normal simulated weather
  return {
    latitude: lat,
    longitude: lng,
    locationName,
    source: 'simulated',
    temperature: 31,
    maxTemperature: 34,
    minTemperature: 23,
    humidity: 52,
    precipitationSum: 1.2,
    precipitationProbability: 15,
    weatherCode: 1,
    conditionLabel: 'Pleasant & Mild Weather',
    riskType: 'none',
    riskTitle: 'Normal Conditions',
    riskSeverity: 'none',
    isExtremeRisk: false,
    updatedAt: time,
  };
}

/**
 * Get detailed, context-aware crop storage suggestion based on crop and risk type
 */
export function getContextAwareStorageSuggestion(
  cropId: string,
  cropName: string,
  category: string,
  riskType: 'rain' | 'heat',
  language: Language
): StorageSuggestion {
  const isRain = riskType === 'rain';

  // Customized crop-specific logic
  switch (cropId) {
    case 'onion':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: 'Store Onion in Raised Kanda Chawl Immediately',
            facilityType: 'Ventilated Kanda Chawl (कांदा चाळ) / Bamboo Racks',
            safeStorageDuration: '15 to 45 Days (Well Aerated)',
            moistureLimit: 'Air Humidity < 65% (Keep Dry)',
            keyDirectives: [
              'Move harvest off ground into raised bamboo Kanda Chawl with bottom and side cross-ventilation.',
              'Never pack onions in plastic or sealed polythene bags; use wide-mesh aerated nylon bags only.',
              'Discard any wet or bruised bulbs immediately to prevent black mold (Aspergillus niger) and bacterial neck rot.',
            ],
            mandiTransitAdvice:
              'Do not dispatch in open tractor-trolleys during downpours. Wet onions arriving at APMC face up to 30% discount or rejection.',
            audioSummary: {
              en: 'Extreme rain alert for Onion. Store harvest in a raised ventilated Kanda Chawl. Do not transport wet bags to mandi today.',
              hi: 'प्याज के लिए भारी बारिश का खतरा। प्याज को जमीन से ऊपर हवादार कांदा चाळ में सुरक्षित रखें। गीली बोरियां मंडी न ले जाएं।',
              mr: 'कांद्यासाठी अतिवृष्टीचा इशारा. कांदा ताबडतोब हवेशीर कांदा चाळीत साठवा. आज भिजलेला कांदा बाजारात नेऊ नका.',
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: 'Shade Storage Advised to Prevent Onion Weight Loss',
            facilityType: 'Shaded, Cross-Ventilated Godown / Thatched Shed',
            safeStorageDuration: '20 to 30 Days with night ventilation',
            moistureLimit: 'Optimal Temp: 25°C–30°C',
            keyDirectives: [
              'Ensure thick thatched or insulated roof over storage to block direct solar radiation.',
              'Open ventilation louvers at night to circulate cooler air; close during peak noon heat.',
              'Avoid stacking onions higher than 4 feet to prevent bottom layer heat buildup and softening.',
            ],
            mandiTransitAdvice:
              'Transport to mandi only in early morning (5 AM – 8 AM) or evening to prevent dehydration weight shrinkage in transit.',
            audioSummary: {
              en: 'Extreme heat risk for Onion. Store in shaded ventilated godown to avoid dehydration and weight loss.',
              hi: 'प्याज के लिए भीषण गर्मी का अलर्ट। प्याज को छांव और हवादार जगह रखें ताकि वजन कम न हो।',
              mr: 'कांद्यासाठी तीव्र उष्णतेचा धोका. वजन घट टाळण्यासाठी कांदा सावलीत व हवेशीर ठिकाणी साठवा.',
            },
          };

    case 'potato':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: 'Store Potatoes in Dry Dark Godown to Stop Soft Rot',
            facilityType: 'Dark Ventilated Godown / Cold Storage (2°C–4°C)',
            safeStorageDuration: '30 to 90 Days',
            moistureLimit: 'Tubers must be surface dry',
            keyDirectives: [
              'Keep potatoes on elevated wooden dunnage crates away from damp mud floors.',
              'Cover with dry rice straw; do not let ambient moisture trigger soft bacterial rot or tuber decay.',
              'Sort and remove any skin-punctured or water-damaged tubers before stacking.',
            ],
            mandiTransitAdvice:
              'Delay unloading at muddy mandi yards. Ensure waterproof tarpaulin coverage on trucks if transit is unavoidable.',
            audioSummary: {
              en: 'Heavy rain risk for Potato. Keep tubers on wooden pallets in dry dark godown to prevent bacterial soft rot.',
              hi: 'आलू के लिए भारी बारिश का खतरा। आलू को लकड़ी के तख्तों पर सूखे और अंधेरे गोदाम में रखें ताकि सड़न न लगे।',
              mr: 'बटाट्यासाठी अतिवृष्टीचा धोका. सड टाळण्यासाठी बटाटा कोरड्या लाकडी फळ्यांवर साठवा.',
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: 'Prevent Potato Blackheart & Sprouting Under High Heat',
            facilityType: 'Cool Shaded Storage / Cold Store Facility',
            safeStorageDuration: '15 to 25 Days in rustic shade',
            moistureLimit: 'Keep temperature below 28°C',
            keyDirectives: [
              'High temperatures (>32°C) cause internal blackheart decay and rapid sprouting.',
              'Store in cool basement or well-shaded brick room; sprinkle water on exterior walls/curtains.',
              'Keep away from sunlight to prevent greening (solanine toxicity) which lowers mandi value.',
            ],
            mandiTransitAdvice:
              'Move to mandi auctions during pre-dawn hours. Direct sun on gunny bags turns potatoes soft and dark.',
            audioSummary: {
              en: 'Extreme heat alert for Potato. Protect from high temperature to prevent blackheart and premature sprouting.',
              hi: 'आलू के लिए तेज धूप की चेतावनी। ब्लैकहार्ट और अंकुरण से बचाने के लिए ठंडे कमरे में रखें।',
              mr: 'बटाट्यासाठी उष्णतेचा इशारा. काळा डाग व कोंब फुटणे टाळण्यासाठी थंड खोलीत साठवा.',
            },
          };

    case 'tomato':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: 'Store in Stackable Plastic Crates under Rain Cover',
            facilityType: 'Dry Covered Packing Shed / Zero-Energy Cool Chamber',
            safeStorageDuration: '3 to 5 Days',
            moistureLimit: 'High perishability (Wipe dry)',
            keyDirectives: [
              'Pack tomatoes strictly in rigid plastic perforated crates, not in gunny bags.',
              'Excess rain causes skin burst, fungal fruit rot, and rapid bacterial collapse.',
              'Hold harvested fruit under shelter until morning mandi slot; do not harvest during heavy downpours.',
            ],
            mandiTransitAdvice:
              'Sell only to nearby APMCs with covered auction sheds. Open-air yards lead to waterlogged fruit dumping.',
            audioSummary: {
              en: 'Heavy rain risk for Tomato. Keep crates covered and dry. Avoid plucking during downpours.',
              hi: 'टमाटर के लिए भारी बारिश का अलर्ट। टमाटर को प्लास्टिक क्रेट में ढककर रखें, बारिश में तुड़ाई न करें।',
              mr: 'टोमॅटोसाठी पावसाचा इशारा. क्रेटमध्ये कोरड्या जागी साठवा, पावसात तोडणी टाळा.',
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'critical',
            headline: 'Store in Shaded Cool Shed; Harvest at Breaker Stage',
            facilityType: 'Zero Energy Cool Chamber / Evaporative Shaded Shed',
            safeStorageDuration: '2 to 4 Days',
            moistureLimit: 'Temp must remain below 30°C',
            keyDirectives: [
              'Extreme heat (>36°C) causes rapid softening, sunscald, and over-ripening within 18 hours.',
              'Cover crate stacks with damp, clean gunny bags to provide evaporative cooling.',
              'Harvest only at color-turning/breaker stage before 9 AM.',
            ],
            mandiTransitAdvice:
              'Ship exclusively during night hours. Midday transport will boil and mash soft tomatoes in transit.',
            audioSummary: {
              en: 'Extreme heat risk for Tomato. Cover crates with damp cloth in cool shade and transport at night.',
              hi: 'टमाटर के लिए भीषण गर्मी। गीली बोरियों से ढककर ठंडी छांव में रखें और रात में मंडी भेजें।',
              mr: 'टोमॅटोसाठी उष्णतेचा इशारा. ओल्या गोणपाटाने झाकून ठेवा आणि रात्रीच्या वेळी वाहतूक करा.',
            },
          };

    case 'wheat':
    case 'paddy':
    case 'maize':
    case 'bajra':
    case 'jowar':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: `Store ${cropName} in Hermetic Bags or Raised Warehouse Godown`,
            facilityType: 'WDRA-Accredited Warehouse / PICS Hermetic Bags',
            safeStorageDuration: '6 to 12 Months (Grain Moisture < 12%)',
            moistureLimit: 'Moisture strictly below 12%',
            keyDirectives: [
              'Store sacks on wooden dunnage pallets raised at least 30 cm above floor and 60 cm away from walls.',
              'Never allow rainwater seepage; wet grain causes aflatoxin mold, sprouting, and complete quality downgrade.',
              'Seal sacks in airtight moisture-proof PICS bags or cover grain heaps with heavy 250+ GSM HDPE tarpaulins.',
            ],
            mandiTransitAdvice:
              'Do not bring unbagged grain trolleys to APMC in rain. Damp grain is penalized with steep 10%–25% dockage cuts.',
            audioSummary: {
              en: `Heavy rain alert for ${cropName}. Keep grain moisture below 12% in a warehouse or hermetic bags on wooden pallets.`,
              hi: `${cropName} के लिए बारिश की चेतावनी। अनाज को लकड़ी के तख्तों पर सूखे गोदाम या हर्मीटिक बैग में रखें।`,
              mr: `${cropName} साठी पावसाचा इशारा. धान्य कोरड्या गोदामात लाकडी फळ्यांवर साठवा.`,
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: `Aerate ${cropName} to Prevent Grain Brittleness & Weevils`,
            facilityType: 'Ventilated Godown / Metal Silo with Shade',
            safeStorageDuration: '6 to 9 Months',
            moistureLimit: 'Prevent overheating (>38°C)',
            keyDirectives: [
              'Extreme heat causes grain cracking, lowering flour recovery and milling outturn.',
              'Ensure godown ventilation is open early morning to cool grain bulk, then seal against midday heatwaves.',
              'Inspect for pulse beetles and grain weevils, which reproduce 3x faster in hot conditions.',
            ],
            mandiTransitAdvice:
              'Safe to transport; ensure tarpaulin does not trap radiant heat directly on top grain layers.',
            audioSummary: {
              en: `High heat warning for ${cropName}. Aerate grain storage in early morning to prevent thermal cracking and pests.`,
              hi: `${cropName} के लिए तेज धूप। सुबह गोदाम में हवा लगाएं ताकि अनाज में घुन और टूटन न हो।`,
              mr: `${cropName} साठी उष्णतेचा इशारा. किडे व धान्य तुटणे टाळण्यासाठी सकाळी गोदामात हवा खेळती ठेवा.`,
            },
          };

    case 'cotton':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: 'Store Cotton Bales Under Waterproof Cover on Raised Pallets',
            facilityType: 'Dry Covered Shed / Tarpaulin-wrapped Dunnage',
            safeStorageDuration: '3 to 6 Months (Dry)',
            moistureLimit: 'Moisture < 8% (Water stains ruin lint grade)',
            keyDirectives: [
              'Rainwater stains lint yellow, permanently destroying fiber tensile strength and spinning value.',
              'Keep raw seed cotton (Kapas) elevated on wooden planks inside closed shed.',
              'Never cover damp cotton with non-breathable plastic, as it creates internal mildew and spontaneous heating.',
            ],
            mandiTransitAdvice:
              'Wait for dry sunshine before dispatching to CCI / APMC ginning centers. Damp cotton faces massive moisture deduction.',
            audioSummary: {
              en: 'Extreme rain alert for Cotton. Protect lint and seed cotton from water stains in a covered shed on raised pallets.',
              hi: 'कपास के लिए भारी बारिश का अलर्ट। रुई को पानी से बचाकर सूखे गोदाम में तख्तों पर रखें।',
              mr: 'कापसासाठी पावसाचा इशारा. कापूस पिवळा पडणे टाळण्यासाठी कोरड्या गोदामात सुरक्षित ठेवा.',
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: 'Store Cotton in Cool Shaded Enclosure to Prevent Static Fire Risk',
            facilityType: 'Ventilated Shed with Fire Breaks',
            safeStorageDuration: '2 to 4 Months',
            moistureLimit: 'Dry fiber (Inspect friction points)',
            keyDirectives: [
              'Dry heat makes cotton fibers brittle, reducing staple length and grade.',
              'Extreme heat increases friction and fire hazard in ginning storage; ensure sand buckets and water drums are ready.',
              'Keep away from direct tin roof radiation.',
            ],
            mandiTransitAdvice:
              'Transit during cooler hours; avoid parking loaded trucks under burning sun near exhaust sparks.',
            audioSummary: {
              en: 'High heat advisory for Cotton. Keep in shaded ventilated godown and observe strict fire safety.',
              hi: 'कपास के लिए तेज गर्मी। आग के खतरे और रेशे की मजबूती बनाए रखने के लिए छांव में रखें।',
              mr: 'कापसासाठी उष्णतेचा इशारा. सावलीत साठवा व आगीपासून सुरक्षितता बाळगा.',
            },
          };

    case 'soybean':
    case 'groundnut':
    case 'mustard':
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: 'critical',
            headline: `Store ${cropName} in Moisture-Proof Godown to Prevent Aflatoxin`,
            facilityType: 'Elevated Concrete Floor Godown / Double Gunny Sacks',
            safeStorageDuration: '3 to 6 Months (Strictly Dry)',
            moistureLimit: 'Moisture must be < 8%',
            keyDirectives: [
              'Excessive moisture in oilseeds triggers fungal aflatoxin and free-fatty-acid rancidity.',
              'Stack bags on wooden runners at least 15 cm above floor.',
              'Ensure gunny bags are completely dry before filling; sun-dry immediately once rain clears.',
            ],
            mandiTransitAdvice:
              'Traders conduct instant moisture tests at APMC gate. Moisture > 10% will cause immediate auction rejection.',
            audioSummary: {
              en: `Heavy rain risk for ${cropName}. Keep seed moisture below 8% to prevent fungus and oil degradation.`,
              hi: `${cropName} के लिए बारिश की चेतावनी। फफूंद और तेल खराबी से बचाने के लिए नमी 8% से कम रखें।`,
              mr: `${cropName} साठी पावसाचा इशारा. बुरशी व तेल खराब होणे टाळण्यासाठी धान्य कोरडे ठेवा.`,
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: `Store ${cropName} Away from Tin Roof Heat to Retain Oil Quality`,
            facilityType: 'Insulated Shaded Godown',
            safeStorageDuration: '2 to 4 Months',
            moistureLimit: 'Store under 30°C',
            keyDirectives: [
              'High heat (>38°C) oxidizes seed oil and raises acid value, causing lower solvent extraction rates.',
              'Store in cool, dark rooms away from tin-roof radiant heat.',
              'Do not stack bags more than 6 layers high to allow heat dissipation.',
            ],
            mandiTransitAdvice:
              'Deliver to crushing mills or APMC during cooler morning hours.',
            audioSummary: {
              en: `Heatwave alert for ${cropName}. Store away from hot tin roofs to protect seed oil quality.`,
              hi: `${cropName} के लिए तेज धूप। तेल की गुणवत्ता बचाने के लिए गर्म टिन की छत से दूर रखें।`,
              mr: `${cropName} साठी उष्णतेचा इशारा. तेलाची प्रत टिकवण्यासाठी सावलीत साठवा.`,
            },
          };

    default:
      // Generic fallback based on category
      const isPerishable = category === 'Vegetables' || category === 'Fruits & Plantation';
      return isRain
        ? {
            cropId,
            cropName,
            riskType: 'rain',
            urgency: isPerishable ? 'critical' : 'high',
            headline: `Store ${cropName} in Dry, Elevated Facility to Avoid Spoilage`,
            facilityType: isPerishable ? 'Ventilated Crates in Covered Shed' : 'Dry Covered Godown on Dunnage',
            safeStorageDuration: isPerishable ? '3 to 7 Days' : '3 to 6 Months',
            moistureLimit: 'Protect from ambient rainwater',
            keyDirectives: [
              `Keep ${cropName} off wet ground using wooden pallets or clean dunnage.`,
              'Ensure adequate air circulation around stacks to dry out dampness.',
              'Cover with breathable water-resistant tarpaulins; do not let water pool on sacks.',
            ],
            mandiTransitAdvice:
              'Wait until rain subsides before open trolley transport to avoid APMC distress deductions.',
            audioSummary: {
              en: `Heavy rain alert for ${cropName}. Store safely off the ground in a dry, covered shed.`,
              hi: `${cropName} के लिए बारिश की चेतावनी। फसल को जमीन से ऊपर सूखे और ढके हुए गोदाम में रखें।`,
              mr: `${cropName} साठी पावसाचा इशारा. माल कोरड्या आणि सुरक्षित ठिकाणी साठवा.`,
            },
          }
        : {
            cropId,
            cropName,
            riskType: 'heat',
            urgency: 'high',
            headline: `Store ${cropName} in Shaded Cool Area to Avoid Heat Damage`,
            facilityType: 'Shaded Ventilated Godown / Cool Storage',
            safeStorageDuration: isPerishable ? '2 to 5 Days' : '2 to 4 Months',
            moistureLimit: 'Maintain cool cross-breeze',
            keyDirectives: [
              `Protect ${cropName} from direct midday sun to stop thermal stress and moisture loss.`,
              'Ventilate storage during night and early morning hours.',
              'Stack loosely to allow heat trapped in core bags to escape.',
            ],
            mandiTransitAdvice:
              'Avoid midday transit in open trucks; schedule transport in early morning.',
            audioSummary: {
              en: `Heat risk for ${cropName}. Keep in a cool, shaded storage area with cross-ventilation.`,
              hi: `${cropName} के लिए तेज धूप। फसल को ठंडी और हवादार छांव में रखें।`,
              mr: `${cropName} साठी उष्णतेचा इशारा. माल सावलीत आणि थंड जागी साठवा.`,
            },
          };
  }
}
