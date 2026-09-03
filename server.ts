import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

interface WeatherMetrics {
  temperature?: number;
  maxTemperature?: number;
  minTemperature?: number;
  humidity?: number;
  precipitationSum?: number;
  precipitationProbability?: number;
  windSpeed?: number;
  conditionLabel?: string;
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
function generateFallbackChatAnswer(question: string, crop: CropInfo, location: string, weather: WeatherMetrics) {
  const q = question.toLowerCase();
  const cropName = crop.name || 'crop';
  const rain = weather.precipitationSum ?? 0;
  const rainProb = weather.precipitationProbability ?? 10;
  const wind = weather.windSpeed ?? 14;
  const temp = weather.temperature ?? 30;

  if (q.includes('rain') || q.includes('spoil') || q.includes('बारिश') || q.includes('खराब')) {
    if (rain > 5 || rainProb >= 40) {
      return `⚠️ Rain Alert: With a ${rainProb}% chance of rain (${rain} mm) in ${location}, unprotected ${cropName} is at severe risk of moisture absorption and fungal dockage at mandi auction. Keep harvested produce strictly under covered sheds on wooden pallets. Do not harvest more crops today until dry weather resumes.`;
    }
    return `✓ Low Rain Risk: Rain probability is currently ${rainProb}% (${rain} mm), so minimal threat of rain damage today. However, always keep waterproof tarpaulins on standby when hauling ${cropName} to the mandi.`;
  }

  if (q.includes('pesticide') || q.includes('spray') || q.includes('कीटनाशक') || q.includes('दवा')) {
    if (wind >= 18) {
      return `❌ Do not spray pesticide right now. Wind speed is ${wind} km/h, which will cause severe chemical drift, wasting expensive chemicals and risking unintended drift onto adjacent plots. Wait for wind to drop below 12 km/h (usually early morning or calm evening).`;
    }
    if (rainProb >= 50) {
      return `❌ Avoid spraying now. Rain probability is ${rainProb}%. Sprayed chemicals will wash off within hours, rendering the treatment ineffective. Wait for a clear 24-hour window.`;
    }
    return `✓ Safe to spray: Current wind is calm (${wind} km/h) and temperature is ${temp}°C. Best time is early morning (7:00-9:30 AM) when stomata are open and pollinators are less active. Ensure personal protective equipment.`;
  }

  if (q.includes('transport') || q.includes('mandi') || q.includes('safe') || q.includes('यात्रा') || q.includes('गाड़ी')) {
    if (rain >= 15 || weather.isExtremeRisk) {
      return `⚠️ High Caution for Mandi Transport: Low-lying approach roads to ${location} APMC yard may have water accumulation. If dispatching today, ensure double tarpaulin wrapping tied firmly against ${wind} km/h winds, and confirm mandi auction sheds are open before loading.`;
    }
    return `✓ Good Transport Window: Conditions in ${location} are favorable (${temp}°C, wind ${wind} km/h). Dispatch early morning to avoid traffic and secure an early token at the weighing bridge.`;
  }

  return `Based on current weather in ${location} (${temp}°C, humidity ${weather.humidity ?? 50}%, rain chance ${rainProb}%, wind ${wind} km/h): For your ${cropName}, maintain shade protection, avoid waterlogging in low patches, and ensure tarpaulin coverage during transport.`;
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
    try {
      const { question, crop, location, weather, language, history } = req.body || {};
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      const cropInfo: CropInfo = crop || { name: 'Crop', hindiName: 'फसल' };
      const weatherData: WeatherMetrics = weather || {};
      const loc = location || 'Local Mandi';
      const lang = language || 'en';

      const ai = getGenAI();
      if (!ai) {
        const fallbackAnswer = generateFallbackChatAnswer(question, cropInfo, loc, weatherData);
        return res.json({
          success: true,
          isAIGenerated: false,
          answer: fallbackAnswer,
          audioText: fallbackAnswer,
        });
      }

      const historyFormatted = Array.isArray(history)
        ? history
            .slice(-4)
            .map((h: any) => `Farmer: ${h.question}\nAdvisor: ${h.answer}`)
            .join('\n')
        : '';

      const activeLanguageName = LANGUAGE_NAMES[lang] || 'English';

      const prompt = `You are a practical, trusted Indian Agricultural Meteorologist & Krishi Vigyan Kendra advisor assisting a farmer.
FARMER & WEATHER CONTEXT:
- Selected Crop: ${cropInfo.name} (${cropInfo.hindiName || ''})
- Mandi Zone / Location: ${loc}, India
- Live Weather Data:
  * Temperature: ${weatherData.temperature ?? 30}°C (High: ${weatherData.maxTemperature ?? 34}°C, Low: ${weatherData.minTemperature ?? 22}°C)
  * Relative Humidity: ${weatherData.humidity ?? 50}%
  * Precipitation / Rain: ${weatherData.precipitationSum ?? 0} mm (${weatherData.precipitationProbability ?? 10}% chance of rain)
  * Wind Speed: ${weatherData.windSpeed ?? 14} km/h
  * Current Weather Label: ${weatherData.conditionLabel || 'Normal'}
  * Extreme Risk Active: ${weatherData.isExtremeRisk ? 'YES' : 'NO'}

${historyFormatted ? `PREVIOUS CONVERSATION:\n${historyFormatted}\n` : ''}
FARMER'S NEW QUESTION: "${question}"

CRITICAL LANGUAGE REQUIREMENT:
Respond strictly in ${activeLanguageName}.
The fields "answer" and "audioText" MUST be written 100% in ${activeLanguageName} (using its native regional script if not English) so the farmer reads and listens in their mother tongue.

INSTRUCTIONS:
- Directly answer the farmer's question using the exact weather metrics above (mention temperature, rain chance, or wind speed where relevant).
- Provide practical, actionable farm advice in 2 to 3 concise sentences or short bullet points.
- Avoid generic filler, academic jargon, or disclaimers. Speak with clarity and direct farmer empathy.
- Return ONLY valid raw JSON:
{
  "answer": "Concise 2-3 sentence answer in ${activeLanguageName} with specific weather metrics and clear farmer recommendation",
  "audioText": "Short spoken version of the answer in ${activeLanguageName} for audio playback"
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
        return res.json({
          success: true,
          isAIGenerated: true,
          answer: parsed.answer,
          audioText: parsed.audioText || parsed.answer,
        });
      } catch (parseErr) {
        console.warn('Failed to parse Gemini chat JSON:', parseErr);
        const fallbackAnswer = generateFallbackChatAnswer(question, cropInfo, loc, weatherData);
        return res.json({
          success: true,
          isAIGenerated: false,
          answer: fallbackAnswer,
          audioText: fallbackAnswer,
        });
      }
    } catch (err: any) {
      console.error('Gemini Weather Chat API error:', err?.message || err);
      const { question, crop, location, weather } = req.body || {};
      const fallbackAnswer = generateFallbackChatAnswer(question || '', crop || { name: 'Crop' }, location || '', weather || {});
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
