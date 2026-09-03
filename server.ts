import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

interface WeatherMetrics {
  temperature?: number;
  temp?: number;
  maxTemperature?: number;
  minTemperature?: number;
  humidity?: number;
  precipitationSum?: number;
  precipitationProbability?: number;
  rainChance?: number;
  windSpeed?: number;
  conditionLabel?: string;
  condition?: string;
  isExtremeRisk?: boolean;
  riskType?: string;
}

interface CropInfo {
  id?: string;
  name: string;
  hindiName?: string;
  category?: string;
}

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Intelligent fallback generator for weather advisory
const LANGUAGE_NAMES: Record<string, string> = {
  hi: 'Hindi (हिन्दी)',
  en: 'English',
  mr: 'Marathi (मराठी)',
  gu: 'Gujarati (ગુજરાતી)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  bn: 'Bengali (বাংলা)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  or: 'Odia (ଓଡ଼ିଆ)',
  as: 'Assamese (অসমীয়া)',
  ur: 'Urdu (اردو)',
};

function generateFallbackAdvisory(crop: CropInfo, location: string, weather: WeatherMetrics, lang: string) {
  const cropName = crop.name || 'Crop';
  const hindiCrop = crop.hindiName || cropName;
  const temp = weather.temperature ?? 30;
  const rain = weather.precipitationSum ?? 0;
  const rainProb = weather.precipitationProbability ?? 10;
  const wind = weather.windSpeed ?? 12;
  const isWet = rain >= 5 || rainProb >= 50;
  const isHot = temp >= 38;

  let transportAdvice = '';
  let fieldAdvice = '';
  let produceAdvice = '';

  if (isWet) {
    transportAdvice = `Ensure double-layer waterproof tarpaulin on transport vehicle before leaving for ${location || 'mandi'}. Cover edges tightly as high winds (${wind} km/h) can displace loose sheets. Avoid night travel if waterlogging is reported along low-lying rural roads.`;
    fieldAdvice = `Dig 15-cm deep inter-row drainage trenches immediately to prevent root inundation for standing ${cropName}. Cease any pesticide or fertilizer spraying until rain clears, as chemical wash-off will cause monetary loss.`;
    produceAdvice = `Move harvested ${hindiCrop} to an elevated, well-ventilated brick plinth or indoor shed. Never stack jute bags directly on damp earthen floors—place wooden pallets (channi) underneath to prevent fungal rot.`;
  } else if (isHot) {
    transportAdvice = `Schedule mandi vehicle dispatch early morning before 7:30 AM or after 6:30 PM. Intense daytime heat (${temp}°C) causes fast weight loss (dehydration) during open highway transit.`;
    fieldAdvice = `Provide light evening irrigation to standing ${cropName} to maintain root-zone coolness. Avoid middle-of-the-day irrigation as hot water causes root shock. Mulch soil surface to conserve moisture.`;
    produceAdvice = `Store harvested ${hindiCrop} under dense green shade nets or cool pakka structures. Maintain cross-ventilation to prevent internal heat buildup and premature rotting or sprouting.`;
  } else {
    transportAdvice = `Favorable weather (${temp}°C, gentle breeze) for mandi transport. Inspect vehicle tire pressure and carry tarpaulin as standard precaution against unexpected morning drizzle.`;
    fieldAdvice = `Ideal conditions for field scouting, weeding, and routine intercultural operations for ${cropName}. Soil moisture is moderate; schedule next watering based on field moisture tensiometer.`;
    produceAdvice = `Spread harvested ${hindiCrop} in a single layer under shaded dry shed for curing (1-2 days) before final bagging to maximize skin quality and fetch premium bids.`;
  }

  return {
    summary: `${cropName} Weather Advisory for ${location || 'Local Mandi'}: ${isWet ? 'Rain Alert Active' : isHot ? 'Heat Alert Active' : 'Favorable Conditions'}.`,
    measures: [
      {
        category: 'Travel & Transport Safety',
        hindiCategory: 'परिवहन व मंडी यात्रा सुरक्षा',
        advice: transportAdvice,
        actionBadge: isWet ? 'Wet Road Caution' : isHot ? 'Early Departure' : 'Normal Transit',
      },
      {
        category: 'Field Protection',
        hindiCategory: 'खेत व खड़ी फसल सुरक्षा',
        advice: fieldAdvice,
        actionBadge: isWet ? 'Drainage Priority' : isHot ? 'Evening Watering' : 'Routine Care',
      },
      {
        category: 'Produce Protection',
        hindiCategory: 'कटी फसल व उपज सुरक्षा',
        advice: produceAdvice,
        actionBadge: isWet ? 'Pallet Stacking' : isHot ? 'Shade Protection' : 'Curing Standard',
      },
    ],
    audioText: `${cropName} weather advisory: ${transportAdvice} In the field: ${fieldAdvice} For produce: ${produceAdvice}`,
  };
}

// Intelligent fallback generator for weather chat Q&A
function generateFallbackChatAnswer(
  question: string,
  crop: CropInfo,
  location: string,
  weather: WeatherMetrics,
  lang: string = 'en'
) {
  const q = question.toLowerCase();
  const cropName = crop.name || 'crop';
  const hindiName = crop.hindiName || cropName;
  const rain = weather.precipitationSum ?? 0;
  const rainProb = weather.rainChance ?? weather.precipitationProbability ?? 10;
  const wind = weather.windSpeed ?? 14;
  const temp = weather.temp ?? weather.temperature ?? 30;
  const hum = weather.humidity ?? 50;
  const isHindi = lang === 'hi';

  // 1. Rain & Produce Spoilage questions
  if (
    q.includes('rain') ||
    q.includes('spoil') ||
    q.includes('बारिश') ||
    q.includes('खराब') ||
    q.includes('पाऊस') ||
    q.includes('भेंज') ||
    q.includes('বৃষ্টি')
  ) {
    if (rain > 5 || rainProb >= 40) {
      if (isHindi) {
        return `⚠️ बारिश चेतावनी: ${location} में ${rainProb}% बारिश की संभावना (${rain} मिमी) है। कटी हुई ${hindiName} को भीगने से बचाने के लिए तुरंत तिरपाल से ढकें या पक्के गोदाम में लकड़ी के तख्तों (चन्नी) पर रखें। नमी से मंडी में भाव 15-20% गिर सकता है।`;
      }
      return `⚠️ Rain Spoilage Risk: With a ${rainProb}% chance of rain (${rain} mm) in ${location}, harvested ${cropName} is vulnerable to moisture absorption and fungal rot. Move all produce onto wooden pallets under waterproof sheds immediately, and keep double tarpaulins secured.`;
    }
    if (isHindi) {
      return `✓ बारिश का खतरा कम: वर्तमान में बारिश की संभावना केवल ${rainProb}% (${rain} मिमी) है। आज ${hindiName} के भीगने का सीधा खतरा नहीं है, फिर भी मंडी ले जाते समय वाहन पर तिरपाल की व्यवस्था अवश्य रखें।`;
    }
    return `✓ Low Rain Risk: Current rain probability is only ${rainProb}% (${rain} mm) in ${location}, so your harvested ${cropName} is safe from immediate rain spoilage. Maintain standard tarpaulin cover on standby as a standard precaution.`;
  }

  // 2. Pesticide & Chemical Spray questions
  if (
    q.includes('pesticide') ||
    q.includes('spray') ||
    q.includes('कीटनाशक') ||
    q.includes('दवा') ||
    q.includes('फवारणी') ||
    q.includes('छिड़क') ||
    q.includes('દવા') ||
    q.includes('কীটনাশক')
  ) {
    if (wind >= 16) {
      if (isHindi) {
        return `❌ अभी कीटनाशक न छिड़कें: हवा की गति ${wind} किमी/घंटा है, जिससे दवा उड़कर बर्बाद होगी (ड्रिफ्ट नुकसान) और अन्य खेतों में जा सकती है। हवा की गति 12 किमी/घंटा से कम होने (सुबह या शांत शाम) तक प्रतीक्षा करें।`;
      }
      return `❌ Do not spray pesticide right now. Wind speed is ${wind} km/h, which exceeds the safe 15 km/h threshold and will cause chemical drift off your ${cropName}, wasting expensive input. Wait for calm early morning conditions (<12 km/h).`;
    }
    if (rainProb >= 45) {
      if (isHindi) {
        return `❌ छिड़काव स्थगित रखें: बारिश की संभावना ${rainProb}% है। दवा छिड़कने के 4-6 घंटे के भीतर बारिश होने से पूरी दवा धुल जाएगी और आर्थिक नुकसान होगा। 24 घंटे का सूखा मौसम मिलने पर ही स्प्रे करें।`;
      }
      return `❌ Postpone spraying today: Rain probability is ${rainProb}%. Incoming precipitation will wash off foliar chemicals within hours. Wait for a clear, dry 24-hour weather window before applying spray to ${cropName}.`;
    }
    if (isHindi) {
      return `✓ छिड़काव के लिए अनुकूल समय: हवा की गति शांत (${wind} किमी/घंटा) और तापमान ${temp}°C है। सुबह 7:30 से 10:00 बजे के बीच छिड़काव सबसे प्रभावी रहेगा। छिड़काव करते समय सुरक्षात्मक मास्क जरूर पहनें।`;
    }
    return `✓ Favorable Spray Window: Wind speed is calm at ${wind} km/h and temperature is ${temp}°C. Early morning (7:00-9:30 AM) is ideal for ${cropName} spraying while leaf pores are open and drift is minimal.`;
  }

  // 3. Mandi Transport & Road Transit safety
  if (
    q.includes('transport') ||
    q.includes('mandi') ||
    q.includes('मंडी') ||
    q.includes('safe') ||
    q.includes('सुरक्षित') ||
    q.includes('ले जाना') ||
    q.includes('बाजार') ||
    q.includes('यात्रा') ||
    q.includes('गाड़ी') ||
    q.includes('वाहतूक') ||
    q.includes('परिवहन') ||
    q.includes('transit')
  ) {
    if (rain >= 15 || rainProb >= 65 || weather.isExtremeRisk) {
      if (isHindi) {
        return `⚠️ मंडी परिवहन में सावधानी: बारिश की संभावना ${rainProb}% है और रास्ते में जलभराव हो सकता है। यदि आज ${location} मंडी जा रहे हैं, तो वाहन को दोहरी तिरपाल से रस्सियों द्वारा कसकर बांधें और निकलने से पहले मंडी यार्ड के टीन शेड खुले होने की पुष्टि करें।`;
      }
      return `⚠️ Mandi Transport Alert: Rain probability is ${rainProb}% with ${wind} km/h wind in ${location}. Secure your vehicle with heavy-duty double tarpaulins tied tightly against wind gusts, and verify covered auction sheds at the APMC before departure.`;
    }
    if (isHindi) {
      return `✓ मंडी ले जाने के लिए सुरक्षित: आज मौसम अनुकूल है (${temp}°C, हवा ${wind} किमी/घंटा)। जल्दी सुबह 6:00 से 8:00 बजे निकलें ताकि मंडी तोल कांटे पर जल्दी टोकन मिल सके और दोपहर की तेज धूप से बचा जा सके।`;
    }
    return `✓ Safe for Mandi Transport: Road transit conditions to ${location} are favorable (${temp}°C, wind ${wind} km/h). Dispatch your ${cropName} in early morning hours to beat market congestion and secure early weighbridge tokens.`;
  }

  // 4. Stacking, Storage & Humidity questions
  if (
    q.includes('stack') ||
    q.includes('bag') ||
    q.includes('storage') ||
    q.includes('humidity') ||
    q.includes('store') ||
    q.includes('बोरी') ||
    q.includes('भंडारण') ||
    q.includes('थप्पी') ||
    q.includes('गोदाम') ||
    q.includes('नमी')
  ) {
    if (hum >= 65) {
      if (isHindi) {
        return `⚠️ उच्च आर्द्रता भंडारण निर्देश: हवा में नमी ${hum}% है। ${hindiName} की बोरियों को कभी भी सीधे मिट्टी के फर्श पर न रखें; नीचे लकड़ी की चन्नी (पैलेट्स) बिछाएं। बोरियों के बीच 1 फुट का गैप रखें ताकि हवा आर-पार निकल सके और फफूंद न लगे।`;
      }
      return `⚠️ High Humidity Stacking Protocol: Relative humidity is high at ${hum}%. Stack ${cropName} bags strictly on raised wooden pallets (channi) at least 15 cm above ground, leaving a 1-foot air gap between stacks to prevent sweating and fungal rot.`;
    }
    if (isHindi) {
      return `✓ सामान्य भंडारण स्थिति: आर्द्रता ${hum}% और तापमान ${temp}°C है। कटी हुई फसल को हवादार शेड में तिरपाल के ऊपर रखें। दीवार से कम से कम 2 फीट दूरी बनाकर थप्पी लगाएं।`;
    }
    return `✓ Normal Stacking Conditions: Humidity is moderate at ${hum}% and temperature is ${temp}°C. Ensure well-ventilated dry storage for ${cropName} bags, keeping stacks 2 feet away from perimeter walls for smooth air circulation.`;
  }

  // 5. General Fallback addressing the specific question directly with exact metrics
  if (isHindi) {
    return `${location} में मौसम की स्थिति: तापमान ${temp}°C, नमी ${hum}%, बारिश की संभावना ${rainProb}% और हवा ${wind} किमी/घंटा है। आपके सवाल के अनुसार, ${hindiName} की फसल को खुले में भीगने से बचाएं और हवा व नमी के स्तर को देखते हुए खेत कार्य की योजना बनाएं।`;
  }
  return `Weather for ${cropName} in ${location}: Temperature is ${temp}°C, humidity ${hum}%, rain probability ${rainProb}%, and wind speed ${wind} km/h. To protect your crop, monitor field moisture closely, avoid unshaded daytime exposure, and maintain protective tarpaulin coverage during transport.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. AI Kisan Weather Advisory Endpoint
  app.post('/api/weather/advisory', async (req, res) => {
    try {
      const { crop, location, weather, language } = req.body || {};
      const cropInfo: CropInfo = crop || { name: 'Crop', hindiName: 'फसल' };
      const weatherData: WeatherMetrics = weather || {};
      const loc = location || 'Local Mandi';
      const lang = language || 'en';

      const ai = getGenAI();
      if (!ai) {
        // Fallback when no API key configured
        const fallback = generateFallbackAdvisory(cropInfo, loc, weatherData, lang);
        return res.json({ success: true, isAIGenerated: false, ...fallback });
      }

      const activeLanguageName = LANGUAGE_NAMES[lang] || 'English';

      const prompt = `You are an expert Agricultural Meteorologist ("Kisan Weather Advisor") in India.
Current Context:
- Crop: ${cropInfo.name} (${cropInfo.hindiName || ''}) [Category: ${cropInfo.category || 'Agricultural produce'}]
- Location: ${loc}, India
- Live Weather:
  * Temperature: ${weatherData.temperature ?? 30}°C (Max: ${weatherData.maxTemperature ?? 34}°C, Min: ${weatherData.minTemperature ?? 22}°C)
  * Humidity: ${weatherData.humidity ?? 50}%
  * Precipitation Forecast: ${weatherData.precipitationSum ?? 0} mm (${weatherData.precipitationProbability ?? 10}% rain probability)
  * Wind Speed: ${weatherData.windSpeed ?? 14} km/h
  * Conditions: ${weatherData.conditionLabel || 'Normal'}
  * Extreme Risk Flag: ${weatherData.isExtremeRisk ? 'YES (' + (weatherData.riskType || 'Extreme') + ')' : 'NO'}

CRITICAL LANGUAGE REQUIREMENT:
Respond strictly in ${activeLanguageName}.
All text in the output fields ("summary", "advice", "actionBadge", "hindiCategory", "audioText") MUST be written in ${activeLanguageName} (using its native regional script if not English), so that the farmer sees and hears advice 100% in ${activeLanguageName}.

Generate exactly 3 crisp, preventive measures for the farmer formatted as valid JSON:
1. "Travel & Transport Safety" (Road/mandi route conditions, vehicle tarp coverage, optimal dispatch timing)
2. "Field Protection" (Standing crop drainage, wind shielding, irrigation/spray scheduling)
3. "Produce Protection" (Harvested bag storage, moisture thresholds, shade vs drying)

Return ONLY valid raw JSON matching this schema:
{
  "summary": "Brief 1-sentence weather impact overview in ${activeLanguageName}",
  "measures": [
    {
      "category": "Travel & Transport Safety",
      "hindiCategory": "Category translated into ${activeLanguageName}",
      "advice": "Crisp 2-sentence actionable directive for road/mandi transport in ${activeLanguageName}",
      "actionBadge": "Short 2-3 word badge e.g. 'Tarp Required' translated in ${activeLanguageName}"
    },
    {
      "category": "Field Protection",
      "hindiCategory": "Category translated into ${activeLanguageName}",
      "advice": "Crisp 2-sentence actionable directive for field & standing crop in ${activeLanguageName}",
      "actionBadge": "Short 2-3 word badge e.g. 'Clear Drains' translated in ${activeLanguageName}"
    },
    {
      "category": "Produce Protection",
      "hindiCategory": "Category translated into ${activeLanguageName}",
      "advice": "Crisp 2-sentence actionable directive for harvested produce & bags in ${activeLanguageName}",
      "actionBadge": "Short 2-3 word badge e.g. 'Pallet Stacking' translated in ${activeLanguageName}"
    }
  ],
  "audioText": "A natural, clear 3-sentence summary in ${activeLanguageName} suitable for text-to-speech audio reading to the farmer."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, isAIGenerated: true, ...parsed });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini JSON, using fallback:', parseErr);
        const fallback = generateFallbackAdvisory(cropInfo, loc, weatherData, lang);
        return res.json({ success: true, isAIGenerated: false, ...fallback });
      }
    } catch (err: any) {
      console.error('Gemini Weather Advisory API error:', err?.message || err);
      const { crop, location, weather, language } = req.body || {};
      const fallback = generateFallbackAdvisory(crop || { name: 'Crop' }, location || '', weather || {}, language || 'en');
      return res.json({ success: true, isAIGenerated: false, ...fallback });
    }
  });

  // 2. Interactive Weather Q&A Chatbot Endpoint
  app.post('/api/weather/chat', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
      const { question, userQuestion: rawUserQuestion, crop, selectedCrop: rawSelectedCrop, location, currentLocation: rawCurrentLocation, weather, weatherData: rawWeatherData, language, currentLanguage: rawCurrentLanguage } = req.body || {};
      const userQuestion = (rawUserQuestion || question || '').trim();
      if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const selectedCrop: CropInfo = rawSelectedCrop || crop || { name: 'General Agriculture', hindiName: 'फसल' };
      const currentLocation = rawCurrentLocation || location || 'Maharashtra';
      const weatherDataObj = rawWeatherData || weather || {};
      const lang = rawCurrentLanguage || language || 'en';

      const temp = weatherDataObj.temp ?? weatherDataObj.temperature ?? 30;
      const humidity = weatherDataObj.humidity ?? 50;
      const rainChance = weatherDataObj.rainChance ?? weatherDataObj.precipitationProbability ?? 10;
      const windSpeed = weatherDataObj.windSpeed ?? 14;
      const condition = weatherDataObj.condition ?? weatherDataObj.conditionLabel ?? 'Normal';
      const currentLanguage = LANGUAGE_NAMES[lang] || lang || 'English';

      const weatherMetricsSummary: WeatherMetrics = {
        temp,
        temperature: temp,
        humidity,
        rainChance,
        precipitationProbability: rainChance,
        windSpeed,
        condition,
        conditionLabel: condition,
      };

      const ai = getGenAI();
      if (!ai) {
        const fallbackAnswer = generateFallbackChatAnswer(
          userQuestion,
          selectedCrop,
          currentLocation,
          weatherMetricsSummary,
          lang
        );
        return res.json({
          success: true,
          isAIGenerated: false,
          answer: fallbackAnswer,
          audioText: fallbackAnswer,
        });
      }

      const prompt = `You are an expert agricultural meteorologist advising an Indian farmer.

User's Specific Question: "${userQuestion}"

Current Context:
- Selected Crop: ${selectedCrop?.name || "General Agriculture"}
- Location/APMC: ${currentLocation || "Maharashtra"}
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Rain Probability: ${rainChance}%
- Wind Speed: ${windSpeed} km/h
- Conditions: ${condition}

Instructions:
1. Answer the specific question directly in 2-3 actionable, concise sentences.
2. Use the exact weather metrics above (e.g., if asking about pesticide spray, evaluate wind speed and rain probability; if asking about mandi transport, evaluate rain chance).
3. Do NOT repeat a generic weather summary. Address ONLY what was asked.
4. Respond strictly in ${currentLanguage}.

Format your response strictly as valid JSON matching this schema:
{
  "answer": "Direct, actionable 2-3 sentence answer specifically addressing '${userQuestion}' in ${currentLanguage} using exact metrics",
  "audioText": "Short spoken version of the answer in ${currentLanguage} for audio playback"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        const ans = parsed.answer || parsed.response || parsed.advice || responseText;
        const audio = parsed.audioText || ans;
        return res.json({
          success: true,
          isAIGenerated: true,
          answer: ans,
          audioText: audio,
        });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini chat JSON:', parseErr);
        if (responseText && responseText.trim().length > 10) {
          const cleanText = responseText.replace(/```json|```/g, '').trim();
          return res.json({
            success: true,
            isAIGenerated: true,
            answer: cleanText,
            audioText: cleanText,
          });
        }
        const fallbackAnswer = generateFallbackChatAnswer(
          userQuestion,
          selectedCrop,
          currentLocation,
          weatherMetricsSummary,
          lang
        );
        return res.json({
          success: true,
          isAIGenerated: false,
          answer: fallbackAnswer,
          audioText: fallbackAnswer,
        });
      }
    } catch (err: any) {
      console.error('Gemini Weather Chat API error:', err?.message || err);
      const { question, userQuestion, crop, selectedCrop, location, currentLocation, weather, weatherData, language, currentLanguage } = req.body || {};
      const q = (userQuestion || question || '').trim();
      const c = selectedCrop || crop || { name: 'General Agriculture', hindiName: 'फसल' };
      const loc = currentLocation || location || 'Maharashtra';
      const w = weatherData || weather || {};
      const l = currentLanguage || language || 'en';
      const fallbackAnswer = generateFallbackChatAnswer(q, c, loc, w, l);
      return res.json({
        success: true,
        isAIGenerated: false,
        answer: fallbackAnswer,
        audioText: fallbackAnswer,
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
