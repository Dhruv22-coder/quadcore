import { ActivePage, Language } from '../types';

export interface NavTranslationItem {
  label: string;
  shortLabel: string;
  desc: string;
}

export interface NavMenuTranslations {
  menuBtn: string;
  closeBtn: string;
  menuHeading: string;
  sectionsCount: string;
  activeBadge: string;
  callHelpline: string;
  stepPrefix: string;
  navItems: Record<ActivePage, NavTranslationItem>;
}

export const NAV_TRANSLATIONS: Record<Language, NavMenuTranslations> = {
  en: {
    menuBtn: 'Menu',
    closeBtn: 'Close',
    menuHeading: 'Navigation Menu',
    sectionsCount: '5 Sections',
    activeBadge: 'Current',
    callHelpline: 'Call Kisan Call Center (1800-180-1551 Toll-Free)',
    stepPrefix: 'Step',
    navItems: {
      crops: {
        label: 'Crops',
        shortLabel: 'Crops',
        desc: 'Select crop & view live mandi rates across India',
      },
      decision: {
        label: 'Sell Decision',
        shortLabel: 'Decision',
        desc: 'Sell today or wait advisory with 7-day price trend',
      },
      profit: {
        label: 'Net Profit',
        shortLabel: 'Profit',
        desc: 'Compare real in-hand cash after diesel & transport costs',
      },
      weather: {
        label: 'Weather & Storage',
        shortLabel: 'Weather',
        desc: 'Rain/heat risk alerts & scientific storage guidelines',
      },
      help: {
        label: 'Kisan Helpline',
        shortLabel: 'Help',
        desc: 'Free toll-free call, SMS alerts & offline USSD tools',
      },
    },
  },
  hi: {
    menuBtn: 'मेनू',
    closeBtn: 'बंद करें',
    menuHeading: 'नेविगेशन मेनू',
    sectionsCount: '5 मुख्य भाग',
    activeBadge: 'यहाँ हैं',
    callHelpline: 'किसान कॉल सेंटर पर फोन करें (1800-180-1551 टोल-फ्री)',
    stepPrefix: 'चरण',
    navItems: {
      crops: {
        label: 'फसलें',
        shortLabel: 'फसल',
        desc: 'फसल चुनें व सभी मंडियों के ताजा भाव देखें',
      },
      decision: {
        label: 'आज का निर्णय',
        shortLabel: 'निर्णय',
        desc: 'आज बेचें या 2-3 दिन रुकें + 7-दिन का भाव ग्राफ',
      },
      profit: {
        label: 'मंडी मुनाफा',
        shortLabel: 'मुनाफा',
        desc: 'किराया व डीजल काटकर हाथ में शुद्ध नकदी देखें',
      },
      weather: {
        label: 'मौसम व भंडारण',
        shortLabel: 'मौसम',
        desc: 'बारिश/धूप का अलर्ट व सुरक्षित वैज्ञानिक भंडारण',
      },
      help: {
        label: 'किसान सहायता',
        shortLabel: 'मदद',
        desc: '1800-180-1551 मुफ्त कॉल, SMS भाव व ऑफलाइन टूल्स',
      },
    },
  },
  mr: {
    menuBtn: 'मेनू',
    closeBtn: 'बंद करा',
    menuHeading: 'नेव्हिगेशन मेनू',
    sectionsCount: '५ मुख्य विभाग',
    activeBadge: 'येथे आहात',
    callHelpline: 'किसान कॉल सेंटरला फोन करा (१८००-१८०-१५५१ मोफत)',
    stepPrefix: 'टप्पा',
    navItems: {
      crops: {
        label: 'पिके',
        shortLabel: 'पीक',
        desc: 'पीक निवडा व बाजार समित्यांचे थेट दर पाहा',
      },
      decision: {
        label: 'विक्री निर्णय',
        shortLabel: 'निर्णय',
        desc: 'आजच विका की २-३ दिवस थांबा + ७ दिवसांचा आलेख',
      },
      profit: {
        label: 'नफा हिशोब',
        shortLabel: 'नफा',
        desc: 'वाहतूक आणि डिझेल खर्च वजा करून प्रत्यक्ष शिल्लक',
      },
      weather: {
        label: 'हवामान व साठा',
        shortLabel: 'हवामान',
        desc: 'पाऊस/उन्हाचा इशारा आणि सुरक्षित वैज्ञानिक साठवणूक',
      },
      help: {
        label: 'शेतकरी मदत कक्ष',
        shortLabel: 'मदत',
        desc: '१८००-१८०-१५५१ मोफत कॉल, SMS दर व ऑफलाइन सुविधा',
      },
    },
  },
  gu: {
    menuBtn: 'મેનુ',
    closeBtn: 'બંધ કરો',
    menuHeading: 'નેવિગેશન મેનુ',
    sectionsCount: '૫ મુખ્ય વિભાગ',
    activeBadge: 'અહીં છો',
    callHelpline: 'કિસાન કૉલ સેન્ટર પર કૉલ કરો (૧૮૦૦-૧૮૦-૧૫૫૧ મફત)',
    stepPrefix: 'પગલું',
    navItems: {
      crops: {
        label: 'પાકો',
        shortLabel: 'પાક',
        desc: 'પાક પસંદ કરો અને માર્કેટ યાર્ડના તાજા ભાવ જુઓ',
      },
      decision: {
        label: 'વેચાણ નિર્ણય',
        shortLabel: 'નિર્ણય',
        desc: 'આજે વેચો કે ૨-૩ દિવસ રાહ જુઓ + ભાવ ટ્રેન્ડ ગ્રાફ',
      },
      profit: {
        label: 'ચોખ્ખો નફો',
        shortLabel: 'નફો',
        desc: 'ભાડું અને ડીઝલ ખર્ચ બાદ કરી હાથમાં ચોખ્ખી રોકડ',
      },
      weather: {
        label: 'હવામાન અને સંગ્રહ',
        shortLabel: 'હવામાન',
        desc: 'વરસાદ/ગરમીની ચેતવણી અને સુરક્ષિત ગોદામ સલાહ',
      },
      help: {
        label: 'ખેડૂત સહાયતા',
        shortLabel: 'મદદ',
        desc: '૧૮૦૦-૧૮૦-૧૫૫૧ મફત કૉલ, SMS ભાવ અને ઑફલાઇન સેવા',
      },
    },
  },
  pa: {
    menuBtn: 'ਮੇਨੂ',
    closeBtn: 'ਬੰਦ ਕਰੋ',
    menuHeading: 'ਨੇਵੀਗੇਸ਼ਨ ਮੇਨੂ',
    sectionsCount: '੫ ਮੁੱਖ ਭਾਗ',
    activeBadge: 'ਇੱਥੇ ਹੋ',
    callHelpline: 'ਕਿਸਾਨ ਕਾਲ ਸੈਂਟਰ ਨੂੰ ਕਾਲ ਕਰੋ (੧੮੦੦-੧੮੦-੧੫੫੧ ਮੁਫ਼ਤ)',
    stepPrefix: 'ਕਦਮ',
    navItems: {
      crops: {
        label: 'ਫ਼ਸਲਾਂ',
        shortLabel: 'ਫ਼ਸਲ',
        desc: 'ਫ਼ਸਲ ਚੁਣੋ ਅਤੇ ਮੰਡੀ ਦੇ ਤਾਜ਼ਾ ਭਾਅ ਦੇਖੋ',
      },
      decision: {
        label: 'ਵੇਚਣ ਦਾ ਫ਼ੈਸਲਾ',
        shortLabel: 'ਫ਼ੈਸਲਾ',
        desc: 'ਅੱਜ ਵੇਚੋ ਜਾਂ ਰੁਕੋ + ੭ ਦਿਨਾਂ ਦਾ ਰੇਟ ਗ੍ਰਾਫ਼',
      },
      profit: {
        label: 'ਅਸਲ ਮੁਨਾਫ਼ਾ',
        shortLabel: 'ਮੁਨਾਫ਼ਾ',
        desc: 'ਕਿਰਾਇਆ ਅਤੇ ਡੀਜ਼ਲ ਕੱਟ ਕੇ ਹੱਥ ਵਿੱਚ ਅਸਲ ਪੈਸੇ',
      },
      weather: {
        label: 'ਮੌਸਮ ਅਤੇ ਭੰਡਾਰਨ',
        shortLabel: 'ਮੌਸਮ',
        desc: 'ਮੀਂਹ/ਧੁੱਪ ਦਾ ਅਲਰਟ ਅਤੇ ਸੁਰੱਖਿਅਤ ਭੰਡਾਰਨ ਸਲਾਹ',
      },
      help: {
        label: 'ਕਿਸਾਨ ਸਹਾਇਤਾ',
        shortLabel: 'ਮਦਦ',
        desc: '੧੮੦੦-੧੮੦-੧੫੫੧ ਮੁਫ਼ਤ ਕਾਲ, SMS ਰੇਟ ਅਤੇ ਔਫਲਾਈਨ ਸੁਵਿਧਾ',
      },
    },
  },
  bn: {
    menuBtn: 'মেনু',
    closeBtn: 'বন্ধ করুন',
    menuHeading: 'নেভিগেশন মেনু',
    sectionsCount: '৫টি মূল বিভাগ',
    activeBadge: 'এখানে আছেন',
    callHelpline: 'কিষাণ কল সেন্টারে ফোন করুন (১৮০০-১৮০-১৫৫১ টোল-ফ্রি)',
    stepPrefix: 'ধাপ',
    navItems: {
      crops: {
        label: 'শস্যসমূহ',
        shortLabel: 'শস্য',
        desc: 'শস্য নির্বাচন করুন এবং বর্তমান বাজার দর দেখুন',
      },
      decision: {
        label: 'বিক্রি সিদ্ধান্ত',
        shortLabel: 'সিদ্ধান্ত',
        desc: 'আজ বিক্রি করবেন নাকি অপেক্ষা করবেন + দর গ্রাফ',
      },
      profit: {
        label: 'নিট লাভ',
        shortLabel: 'লাভ',
        desc: 'পরিবহন ও জ্বালানি খরচ বাদ দিয়ে আসল লাভ হিসাব',
      },
      weather: {
        label: 'আবহাওয়া ও সংরক্ষণ',
        shortLabel: 'আবহাওয়া',
        desc: 'বৃষ্টি/রোদের সতর্কতা এবং নিরাপদ গুদামজাতকরণ',
      },
      help: {
        label: 'কৃষক সহায়তা',
        shortLabel: 'সাহায্য',
        desc: '১৮০০-১৮০-১৫৫১ টোল-ফ্রি কল, SMS দর ও অফলাইন সেবা',
      },
    },
  },
  ta: {
    menuBtn: 'மெனு',
    closeBtn: 'மூடு',
    menuHeading: 'வழிசெலுத்தல் மெனு',
    sectionsCount: '5 முக்கிய பகுதிகள்',
    activeBadge: 'இங்குள்ளீர்கள்',
    callHelpline: 'விவசாயி அழைப்பு மையத்தை அழைக்கவும் (1800-180-1551)',
    stepPrefix: 'படி',
    navItems: {
      crops: {
        label: 'பயிர்கள்',
        shortLabel: 'பயிர்',
        desc: 'பயிரைத் தேர்வுசெய்து நேரடி சந்தை விலையைப் பார்க்கவும்',
      },
      decision: {
        label: 'விற்பனை முடிவு',
        shortLabel: 'முடிவு',
        desc: 'இன்றே விற்பதா அல்லது காத்திருப்பதா + 7 நாள் வரைபடம்',
      },
      profit: {
        label: 'நிகர லாபம்',
        shortLabel: 'லாபம்',
        desc: 'போக்குவரத்து & டீசல் செலவு போக கையில் கிடைக்கும் தொகை',
      },
      weather: {
        label: 'வானிலை & சேமிப்பு',
        shortLabel: 'வானிலை',
        desc: 'மழை/வெப்ப எச்சரிக்கை & அறிவியல் பூர்வ சேமிப்பு முறை',
      },
      help: {
        label: 'விவசாயி உதவி',
        shortLabel: 'உதவி',
        desc: '1800-180-1551 கட்டணமில்லா அழைப்பு & ஆஃப்லைன் உதவி',
      },
    },
  },
  te: {
    menuBtn: 'మెనూ',
    closeBtn: 'మూసివేయి',
    menuHeading: 'నావిగేషన్ మెనూ',
    sectionsCount: '5 ముఖ్య విభాగాలు',
    activeBadge: 'ఇక్కడ ఉన్నారు',
    callHelpline: 'కిసాన్ కాల్ సెంటర్‌కు కాల్ చేయండి (1800-180-1551 ఉచితం)',
    stepPrefix: 'దశ',
    navItems: {
      crops: {
        label: 'పంటలు',
        shortLabel: 'పంట',
        desc: 'పంటను ఎంచుకోండి మరియు మార్కెట్ ధరలను చూడండి',
      },
      decision: {
        label: 'అమ్మకం నిర్ణయం',
        shortLabel: 'నిర్ణయం',
        desc: 'ఈరోజే అమ్మాలా లేదా వేచి ఉండాలా + 7 రోజుల ధరల గ్రాఫ్',
      },
      profit: {
        label: 'నికర లాభం',
        shortLabel: 'లాభం',
        desc: 'రవాణా & డీజిల్ ఖర్చులు పోను చేతికొచ్చే నికర నగదు',
      },
      weather: {
        label: 'వాతావరణం & నిల్వ',
        shortLabel: 'వాతావరణం',
        desc: 'వర్షం/ఎండ హెచ్చరిక మరియు శాస్త్రీయ నిల్వ సలహా',
      },
      help: {
        label: 'రైతు సహాయవాణి',
        shortLabel: 'సహాయం',
        desc: '1800-180-1551 ఉచిత కాల్, SMS ధరలు & ఆఫ్‌లైన్ సేవలు',
      },
    },
  },
  kn: {
    menuBtn: 'ಮೆನು',
    closeBtn: 'ಮುಚ್ಚಿ',
    menuHeading: 'ನ್ಯಾವಿಗೇಷನ್ ಮೆನು',
    sectionsCount: '5 ಮುಖ್ಯ ವಿಭಾಗಗಳು',
    activeBadge: 'ಇಲ್ಲಿರುವಿರಿ',
    callHelpline: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್‌ಗೆ ಕರೆ ಮಾಡಿ (1800-180-1551 ಉಚಿತ)',
    stepPrefix: 'ಹಂತ',
    navItems: {
      crops: {
        label: 'ಬೆಳೆಗಳು',
        shortLabel: 'ಬೆಳೆ',
        desc: 'ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರಗಳನ್ನು ನೋಡಿ',
      },
      decision: {
        label: 'ಮಾರಾಟ ತೀರ್ಮಾನ',
        shortLabel: 'ತೀರ್ಮಾನ',
        desc: 'ಇಂದೇ ಮಾರಾಟವೇ ಅಥವಾ ಕಾಯುವುದೇ + 7 ದಿನದ ದರ ನಕ್ಷೆ',
      },
      profit: {
        label: 'ನಿವ್ವಳ ಲಾಭ',
        shortLabel: 'ಲಾಭ',
        desc: 'ಸಾರಿಗೆ ಮತ್ತು ಇಂಧನ ವೆಚ್ಚ ಕಳೆದು ಕೈಗೆ ಸಿಗುವ ನಗದು',
      },
      weather: {
        label: 'ಹವಾಮಾನ & ಸಂಗ್ರಹಣೆ',
        shortLabel: 'ಹವಾಮಾನ',
        desc: 'ಮಳೆ/ಬಿಸಿಲಿನ ಎಚ್ಚರಿಕೆ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ದಾಸ್ತಾನು ಸಲಹೆ',
      },
      help: {
        label: 'ರೈತ ಸಹಾಯವಾಣಿ',
        shortLabel: 'ಸಹಾಯ',
        desc: '1800-180-1551 ಉಚಿತ ಕರೆ, SMS ದರಗಳು & ಆಫ್‌ಲೈನ್ ಸೇವೆ',
      },
    },
  },
  ml: {
    menuBtn: 'മെനു',
    closeBtn: 'അടയ്ക്കുക',
    menuHeading: 'നാവിഗേഷൻ മെനു',
    sectionsCount: '5 പ്രധാന വിഭാഗങ്ങൾ',
    activeBadge: 'ഇവിടെയുണ്ട്',
    callHelpline: 'കിസാൻ കോൾ സെന്ററിലേക്ക് വിളിക്കുക (1800-180-1551 സൗജന്യം)',
    stepPrefix: 'ഘട്ടം',
    navItems: {
      crops: {
        label: 'വിളകൾ',
        shortLabel: 'വിള',
        desc: 'വിള തിരഞ്ഞെടുത്ത് വിപണി വിലകൾ കാണുക',
      },
      decision: {
        label: 'വിൽപ്പന തീരുമാനം',
        shortLabel: 'തീരുമാനം',
        desc: 'ഇന്ന് വിൽക്കണോ അതോ കാത്തിരിക്കണോ + 7 ദിവസത്തെ വില ഗ്രാഫ്',
      },
      profit: {
        label: 'യഥാർത്ഥ ലാഭം',
        shortLabel: 'ലാഭം',
        desc: 'ഗതാഗത ചെലവ് കഴിഞ്ഞ് കൈയ്യിൽ കിട്ടുന്ന തുക താരതമ്യം ചെയ്യുക',
      },
      weather: {
        label: 'കാലാവസ്ഥ & സംഭരണം',
        shortLabel: 'കാലാവസ്ഥ',
        desc: 'മഴ/ചൂട് മുന്നറിയിപ്പും സുരക്ഷിത സംഭരണ നിർദ്ദേശവും',
      },
      help: {
        label: 'കർഷക സഹായം',
        shortLabel: 'സഹായം',
        desc: '1800-180-1551 സൗജന്യ കോൾ, SMS നിരക്കുകൾ & ഓഫ്‌ലൈൻ',
      },
    },
  },
  or: {
    menuBtn: 'ମେନୁ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
    menuHeading: 'ନ୍ୟାଭିଗେସନ୍ ମେନୁ',
    sectionsCount: '୫ଟି ମୁଖ୍ୟ ବିଭାଗ',
    activeBadge: 'ଏଠାରେ ଅଛନ୍ତି',
    callHelpline: 'କୃଷକ କଲ୍ ସେଣ୍ଟରକୁ କଲ୍ କରନ୍ତୁ (୧୮୦୦-୧୮୦-୧୫୫୧ ନିଃଶୁଳ୍କ)',
    stepPrefix: 'ପଦକ୍ଷେପ',
    navItems: {
      crops: {
        label: 'ଫସଲ',
        shortLabel: 'ଫସଲ',
        desc: 'ଫସଲ ବାଛନ୍ତୁ ଏବଂ ମଣ୍ଡି ଦର ଦେଖନ୍ତୁ',
      },
      decision: {
        label: 'ବିକ୍ରୟ ନିଷ୍ପତ୍ତି',
        shortLabel: 'ନିଷ୍ପତ୍ତି',
        desc: 'ଆଜି ବିକିବେ ନା ଅପେକ୍ଷା କରିବେ + ୭ ଦିନର ଗ୍ରାଫ୍',
      },
      profit: {
        label: 'ନିଟ୍ ଲାଭ',
        shortLabel: 'ଲାଭ',
        desc: 'ଭଡ଼ା ଓ ତେଲ ଖର୍ଚ୍ଚ କାଟି ହାତକୁ ଆସୁଥିବା ଟଙ୍କା',
      },
      weather: {
        label: 'ପାଣିପାଗ ଓ ସଂରକ୍ଷଣ',
        shortLabel: 'ପାଣିପାଗ',
        desc: 'ବର୍ଷା/ଖରା ସତର୍କତା ଓ ସୁରକ୍ଷିତ ଗୋଦାମ ସୂଚନା',
      },
      help: {
        label: 'କୃଷକ ସହାୟତା',
        shortLabel: 'ସାହାଯ୍ୟ',
        desc: '୧୮୦୦-୧୮୦-୧୫୫୧ ନିଃଶୁଳ୍କ କଲ୍, SMS ଦର ଓ ଅଫଲାଇନ୍ ସେବା',
      },
    },
  },
  as: {
    menuBtn: 'মেনু',
    closeBtn: 'বন্ধ কৰক',
    menuHeading: 'নেভিগেচন মেনু',
    sectionsCount: '৫টা মূল ভাগ',
    activeBadge: 'ইয়াত আছে',
    callHelpline: 'কিষাণ কল চেণ্টাৰলৈ কল কৰক (১৮০০-১৮০-১৫৫১ বিনামূলীয়া)',
    stepPrefix: 'খোজ',
    navItems: {
      crops: {
        label: 'শস্যসমূহ',
        shortLabel: 'শস্য',
        desc: 'শস্য বাছনি কৰক আৰু বজাৰ দৰ চাওক',
      },
      decision: {
        label: 'বিক্ৰী সিদ্ধান্ত',
        shortLabel: 'সিদ্ধান্ত',
        desc: 'আজি বিক্ৰী কৰিব নে ৰব + ৭ দিনৰ গ্রাফ',
      },
      profit: {
        label: 'আচল লাভ',
        shortLabel: 'লাভ',
        desc: 'পৰিবহণ খৰচ বাদ দি হাতলৈ অহা আচল নগদ',
      },
      weather: {
        label: 'বতৰ আৰু সংৰক্ষণ',
        shortLabel: 'বতৰ',
        desc: 'বৰষুণ/ৰ\'দৰ সতৰ্কবাণী আৰু সংৰক্ষণৰ পৰামৰ্শ',
      },
      help: {
        label: 'কৃষক সহায়',
        shortLabel: 'সহায়',
        desc: '১৮০০-১৮০-১৫৫১ বিনামূলীয়া কল, SMS আৰু অফলাইন সুবিধা',
      },
    },
  },
  ur: {
    menuBtn: 'مینو',
    closeBtn: 'بند کریں',
    menuHeading: 'نیویگیشن مینو',
    sectionsCount: '5 اہم حصے',
    activeBadge: 'یہاں ہیں',
    callHelpline: 'کسان کال سینٹر کو کال کریں (1800-180-1551 ٹول فری)',
    stepPrefix: 'مرحلہ',
    navItems: {
      crops: {
        label: 'فصلیں',
        shortLabel: 'فصل',
        desc: 'فصل منتخب کریں اور منڈی کے ریٹ دیکھیں',
      },
      decision: {
        label: 'فروخت کا فیصلہ',
        shortLabel: 'فیصلہ',
        desc: 'آج بیچیں یا انتظار کریں + 7 دن کا ٹرینڈ گراف',
      },
      profit: {
        label: 'خالص منافع',
        shortLabel: 'منافع',
        desc: 'کرایہ اور ڈیزل نکال کر ہاتھ میں خالص رقم',
      },
      weather: {
        label: 'موسم اور اسٹوریج',
        shortLabel: 'موسم',
        desc: 'بارش/گرمی کا الرٹ اور محفوظ اسٹوریج ہدایات',
      },
      help: {
        label: 'کسان ہیلپ لائن',
        shortLabel: 'مدد',
        desc: '1800-180-1551 مفت کال، SMS ریٹ اور آف لائن ٹولز',
      },
    },
  },
};
