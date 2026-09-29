export interface PlanetItem {
  id: string;
  nameHi: string;
  nameEn: string;
  typeHi: string;
  typeEn: string;
  orderFromSun: number;
  emoji: string;
  color: string;
  bgGradient: string;
  image: string;
  summaryHi: string;
  summaryEn: string;
  detailedHi: string;
  detailedEn: string;
  quickStats: {
    diameter: string;
    dayLength: string;
    yearLength: string;
    moonsCount: number;
    temperature: string;
    funFactHi: string;
    funFactEn: string;
  };
  audioFactHi: string;
}

export interface SpaceMissionItem {
  id: string;
  titleHi: string;
  titleEn: string;
  agency: 'ISRO' | 'NASA' | 'Global';
  year: string;
  badge: string;
  emoji: string;
  image: string;
  summaryHi: string;
  summaryEn: string;
  achievementHi: string;
  achievementEn: string;
  funFactHi: string;
  funFactEn: string;
}

export interface SpaceFunFactItem {
  id: string;
  titleHi: string;
  titleEn: string;
  emoji: string;
  image: string;
  factHi: string;
  factEn: string;
  category: 'cosmos' | 'astronaut' | 'moon_stars' | 'blackhole';
}

export interface SpaceQuizQuestion {
  id: string;
  questionHi: string;
  questionEn: string;
  optionsHi: [string, string, string, string];
  optionsEn: [string, string, string, string];
  correctIndex: number;
  explanationHi: string;
  explanationEn: string;
}

export const SOLAR_PLANETS: PlanetItem[] = [
  {
    id: 'sun',
    nameHi: 'सूर्य (Sun)',
    nameEn: 'The Sun',
    typeHi: 'हमारा चमकीला तारा',
    typeEn: 'Our Bright Star',
    orderFromSun: 0,
    emoji: '☀️',
    color: 'from-amber-500 via-orange-500 to-yellow-400',
    bgGradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'सूर्य हमारे सौरमंडल का केंद्र और सबसे बड़ा तारा है। यह सभी ग्रहों को रोशनी और जीवन देता है।',
    summaryEn: 'The Sun is at the center of our solar system and provides light, warmth, and energy to all planets.',
    detailedHi: 'सूर्य आग का एक बहुत विशाल गोला है जो मुख्य रूप से हाइड्रोजन और हीलियम गैस से बना है। सूर्य के अंदर 13 लाख पृथ्वियां समा सकती हैं! सूर्य की रोशनी को पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड लगते हैं।',
    detailedEn: 'The Sun is a giant ball of hot glowing gases. It is so huge that 1.3 million Earths could fit inside it! Sunlight takes about 8 minutes and 20 seconds to reach Earth.',
    quickStats: {
      diameter: '13,92,700 किमी',
      dayLength: '27 दिन (घूर्णन)',
      yearLength: '23 करोड़ वर्ष (आकाशगंगा चक्कर)',
      moonsCount: 0,
      temperature: 'सतह: 5,500°C / केंद्र: 1.5 करोड़°C',
      funFactHi: 'अगर सूर्य न हो, तो पृथ्वी पर चारों तरफ बर्फ और घनघोर अंधेरा छा जाएगा।',
      funFactEn: 'Without the Sun, Earth would freeze and be in total darkness.',
    },
    audioFactHi: 'सूर्य हमारे सौरमंडल का राजा है। इसके अंदर तेरह लाख पृथ्वियां समा सकती हैं।',
  },
  {
    id: 'mercury',
    nameHi: 'बुध ग्रह (Mercury)',
    nameEn: 'Mercury',
    typeHi: 'सूर्य का सबसे करीबी ग्रह',
    typeEn: 'Closest to the Sun',
    orderFromSun: 1,
    emoji: '🌑',
    color: 'from-stone-500 to-slate-700',
    bgGradient: 'bg-gradient-to-br from-stone-600 to-zinc-800',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'बुध सौरमंडल का सबसे छोटा और सूर्य के सबसे पास स्थित ग्रह है।',
    summaryEn: 'Mercury is the smallest planet in the solar system and closest to the Sun.',
    detailedHi: 'बुध ग्रह पर कोई वायुमंडल (हवा) नहीं है। दिन के समय यहाँ भीषण गर्मी (430°C) और रात में भयानक ठंड (-180°C) होती है। यह सूर्य का एक चक्कर सिर्फ 88 दिनों में पूरा कर लेता है।',
    detailedEn: 'Mercury has no atmosphere to trap heat, so days are boiling hot and nights are freezing cold. It orbits the Sun in just 88 Earth days.',
    quickStats: {
      diameter: '4,879 किमी',
      dayLength: '59 पृथ्वी दिन',
      yearLength: '88 पृथ्वी दिन',
      moonsCount: 0,
      temperature: '-180°C से +430°C',
      funFactHi: 'बुध ग्रह पर आपका वजन पृथ्वी के वजन का केवल 38% ही रह जाएगा!',
      funFactEn: 'On Mercury, you would weigh only 38% of your weight on Earth!',
    },
    audioFactHi: 'बुध सूर्य के सबसे पास है और केवल अट्ठासी दिनों में सूर्य का चक्कर लगा लेता है।',
  },
  {
    id: 'venus',
    nameHi: 'शुक्र ग्रह (Venus)',
    nameEn: 'Venus',
    typeHi: 'सबसे गर्म व चमकीला ग्रह',
    typeEn: 'Hottest & Brightest Planet',
    orderFromSun: 2,
    emoji: '⭐',
    color: 'from-amber-600 via-yellow-600 to-orange-700',
    bgGradient: 'bg-gradient-to-br from-amber-600 to-yellow-800',
    image: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'शुक्र को भोर का तारा (Morning Star) और पृथ्वी की जुड़वां बहन भी कहा जाता है।',
    summaryEn: 'Venus is known as the Morning/Evening Star and Earth’s twin sister in size.',
    detailedHi: 'शुक्र सौरमंडल का सबसे गर्म ग्रह है (लगभग 465°C)। इसके वातावरण में कार्बन डाइऑक्साइड गैस का घना बादल है जो गर्मी को बाहर नहीं जाने देता। शुक्र बाकी सभी ग्रहों से उल्टी दिशा (पूर्व से पश्चिम) में घूमता है।',
    detailedEn: 'Venus is the hottest planet in the Solar System because of its thick greenhouse atmosphere. It also spins backward compared to most other planets.',
    quickStats: {
      diameter: '12,104 किमी',
      dayLength: '243 पृथ्वी दिन',
      yearLength: '225 पृथ्वी दिन',
      moonsCount: 0,
      temperature: '465°C (सीसे को भी पिघला दे)',
      funFactHi: 'शुक्र ग्रह पर एक दिन उसके एक साल से भी बड़ा होता है!',
      funFactEn: 'A single day on Venus is longer than its whole year!',
    },
    audioFactHi: 'शुक्र सौरमंडल का सबसे गर्म और आकाश में सबसे चमकीला ग्रह है।',
  },
  {
    id: 'earth',
    nameHi: 'पृथ्वी ग्रह (Earth)',
    nameEn: 'Earth - Our Home',
    typeHi: 'हमारा नीला प्यारा घर',
    typeEn: 'Our Blue Planet',
    orderFromSun: 3,
    emoji: '🌍',
    color: 'from-blue-600 via-teal-500 to-emerald-600',
    bgGradient: 'bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-700',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'पृथ्वी पूरे ब्रह्मांड का एकमात्र ज्ञात ग्रह है जहाँ पानी, हवा और सुंदर जीवन मौजूद है।',
    summaryEn: 'Earth is our precious home planet and the only place known to have water, air, and life.',
    detailedHi: 'पृथ्वी की सतह का 71% हिस्सा पानी से ढका हुआ है, इसलिए अंतरिक्ष से यह चमकीले नीले रंग की दिखती है। हमारे पास सांस लेने के लिए ऑक्सीजन और जीने के लिए अनुकूल तापमान है। पृथ्वी का एक उपग्रह है जिसे हम चंदा मामा (Moon) कहते हैं।',
    detailedEn: 'About 71% of Earth is covered with water, giving it the name Blue Planet. It has breathable oxygen and protective atmosphere supporting millions of living species.',
    quickStats: {
      diameter: '12,742 किमी',
      dayLength: '24 घंटे',
      yearLength: '365.25 दिन',
      moonsCount: 1,
      temperature: 'औसत 15°C (-88°C से 58°C)',
      funFactHi: 'पृथ्वी अपनी धुरी पर 1,600 किमी प्रति घंटे की रफ्तार से लगातार घूम रही है!',
      funFactEn: 'Earth is spinning at around 1,600 km/h right now without us feeling it!',
    },
    audioFactHi: 'हमारी पृथ्वी नीले रंग का सुंदर ग्रह है जहाँ पेड़, पौधे, जानवर और हम सब रहते हैं।',
  },
  {
    id: 'mars',
    nameHi: 'मंगल ग्रह (Mars)',
    nameEn: 'Mars - Red Planet',
    typeHi: 'लाल ग्रह (The Red Planet)',
    typeEn: 'The Red Planet',
    orderFromSun: 4,
    emoji: '🪐',
    color: 'from-red-600 via-rose-600 to-amber-700',
    bgGradient: 'bg-gradient-to-br from-red-600 to-amber-800',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'मंगल की मिट्टी में लोहे की जंग (Iron Oxide) होने के कारण यह लाल रंग का दिखता है।',
    summaryEn: 'Mars is known as the Red Planet due to reddish iron oxide rust on its surface.',
    detailedHi: 'मंगल पर सौरमंडल का सबसे ऊँचा ज्वालामुखी और पर्वत "ओलंपस मॉन्स" है, जो माउंट एवरेस्ट से 3 गुना ऊँचा है! भारत के मंगलयान (Mangalyaan) ने पहली ही कोशिश में मंगल की कक्षा में पहुँचकर इतिहास रचा था।',
    detailedEn: 'Mars has Olympus Mons, the tallest volcano in the solar system, three times taller than Mount Everest! Scientists are looking for signs of past microbial life on Mars.',
    quickStats: {
      diameter: '6,779 किमी',
      dayLength: '24 घंटे 37 मिनट',
      yearLength: '687 पृथ्वी दिन',
      moonsCount: 2,
      temperature: '-60°C (ठंडा और सूखा)',
      funFactHi: 'मंगल पर सूर्यास्त नीले रंग (Blue Sunset) का दिखाई देता है!',
      funFactEn: 'Sunsets on Mars appear blue due to fine dust in its atmosphere!',
    },
    audioFactHi: 'मंगल ग्रह को लाल ग्रह कहते हैं और भारत ने पहली ही कोशिश में यहाँ मंगलयान भेजा था।',
  },
  {
    id: 'jupiter',
    nameHi: 'बृहस्पति ग्रह (Jupiter)',
    nameEn: 'Jupiter - Giant King',
    typeHi: 'सौरमंडल का सबसे बड़ा दैत्य',
    typeEn: 'King of All Planets',
    orderFromSun: 5,
    emoji: '🌀',
    color: 'from-amber-700 via-orange-600 to-stone-700',
    bgGradient: 'bg-gradient-to-br from-amber-700 to-stone-800',
    image: 'https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'बृहस्पति सभी ग्रहों का राजा है। यह इतना विशाल है कि इसमें बाकी सभी ग्रह समा सकते हैं।',
    summaryEn: 'Jupiter is the largest planet in our solar system, more massive than all other planets combined.',
    detailedHi: 'बृहस्पति गैस का एक विशाल गोला है जिस पर कोई ठोस जमीन नहीं है। इस पर एक विशाल लाल तूफान (Great Red Spot) 300 से अधिक सालों से लगातार घूम रहा है, जो पृथ्वी से भी बड़ा है! इसके 95 चंद्रमा हैं।',
    detailedEn: 'Jupiter is a gas giant with no solid surface. It has a famous storm called Great Red Spot that has raged for centuries. Jupiter has 95 known moons!',
    quickStats: {
      diameter: '1,39,820 किमी',
      dayLength: '9 घंटे 55 मिनट (सबसे तेज घूमता है)',
      yearLength: '12 पृथ्वी वर्ष',
      moonsCount: 95,
      temperature: '-110°C',
      funFactHi: 'बृहस्पति पर दिन केवल 10 घंटे का होता है, यह सबसे तेज घूमने वाला ग्रह है!',
      funFactEn: 'Jupiter has the shortest day in the solar system, rotating once in under 10 hours!',
    },
    audioFactHi: 'बृहस्पति सौरमंडल का सबसे बड़ा ग्रह है और इसके पास पचानवे चंद्रमा हैं।',
  },
  {
    id: 'saturn',
    nameHi: 'शनि ग्रह (Saturn)',
    nameEn: 'Saturn - Ring King',
    typeHi: 'सुंदर छल्लों (Rings) वाला ग्रह',
    typeEn: 'Jewel of the Solar System',
    orderFromSun: 6,
    emoji: '🪐',
    color: 'from-yellow-600 via-amber-500 to-stone-600',
    bgGradient: 'bg-gradient-to-br from-yellow-600 to-amber-800',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'शनि अपने खूबसूरत बर्फ और चट्टानों से बने चमकीले छल्लों (Rings) के लिए प्रसिद्ध है।',
    summaryEn: 'Saturn is famous for its breathtaking rings made of countless chunks of ice and rock.',
    detailedHi: 'शनि के छल्ले बर्फ के लाखों टुकड़ों और धूल से मिलकर बने हैं जो बहुत चमकीले दिखते हैं। शनि इतना हल्का है (कम घनत्व) कि अगर इसे पानी के विशाल टब में रख दिया जाए, तो यह पानी पर तैरने लगेगा! इसके 146 ज्ञात चंद्रमा हैं।',
    detailedEn: 'Saturn’s rings are dazzling sheets of ice and rock orbiting the planet. Saturn is so light that if you placed it in a huge bathtub of water, it would float!',
    quickStats: {
      diameter: '1,16,460 किमी',
      dayLength: '10.7 घंटे',
      yearLength: '29.5 पृथ्वी वर्ष',
      moonsCount: 146,
      temperature: '-140°C',
      funFactHi: 'शनि पानी से भी हल्का है, यह पानी में तैर सकता है!',
      funFactEn: 'Saturn is less dense than water, meaning it would float in an ocean!',
    },
    audioFactHi: 'शनि के चारों तरफ बर्फ के जादुई छल्ले हैं और इसके पास एक सौ छियालीस चंद्रमा हैं।',
  },
  {
    id: 'uranus',
    nameHi: 'अरुण ग्रह (Uranus)',
    nameEn: 'Uranus - Ice Giant',
    typeHi: 'बर्फीला और लेटा हुआ ग्रह',
    typeEn: 'Tilted Ice Giant',
    orderFromSun: 7,
    emoji: '🌀',
    color: 'from-cyan-500 via-sky-600 to-teal-700',
    bgGradient: 'bg-gradient-to-br from-cyan-500 to-teal-800',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'अरुण एक बर्फीला विशाल ग्रह है जो अपनी कक्षा में 98 डिग्री झुका हुआ (लेटा हुआ) घूमता है।',
    summaryEn: 'Uranus is an icy giant that spins on its side, rolling like a ball around the Sun.',
    detailedHi: 'अरुण के वातावरण में मीथेन गैस होने के कारण यह सुंदर हल्के नीले-हरे रंग का दिखाई देता है। यह सौरमंडल का सबसे ठंडा ग्रह माना जाता है जहाँ तापमान -224°C तक गिर जाता है।',
    detailedEn: 'Methane gas in Uranus’s atmosphere gives it a lovely cyan blue color. It has the coldest planetary atmosphere in the solar system reaching -224°C.',
    quickStats: {
      diameter: '50,724 किमी',
      dayLength: '17 घंटे 14 मिनट',
      yearLength: '84 पृथ्वी वर्ष',
      moonsCount: 28,
      temperature: '-224°C (सबसे ठंडा)',
      funFactHi: 'अरुण ग्रह पर एक ध्रुव पर 42 साल तक लगातार दिन और 42 साल तक लगातार रात रहती है!',
      funFactEn: 'Because of its extreme tilt, each pole gets 42 years of continuous sunlight then 42 years of darkness!',
    },
    audioFactHi: 'अरुण ग्रह अपनी कक्षा में लेटा हुआ घूमता है और यहाँ भयंकर बर्फीली ठंड होती है।',
  },
  {
    id: 'neptune',
    nameHi: 'वरुण ग्रह (Neptune)',
    nameEn: 'Neptune - Windy Giant',
    typeHi: 'नीला बर्फीला तूफानी ग्रह',
    typeEn: 'Farthest Windy Planet',
    orderFromSun: 8,
    emoji: '🌊',
    color: 'from-blue-700 via-indigo-600 to-sky-900',
    bgGradient: 'bg-gradient-to-br from-blue-700 to-indigo-900',
    image: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'वरुण सूर्य से सबसे दूर स्थित आठवां ग्रह है जहाँ सौरमंडल की सबसे तेज हवाएं (2,100 किमी/घंटा) चलती हैं।',
    summaryEn: 'Neptune is the farthest planet from the Sun and home to the fastest supersonic winds.',
    detailedHi: 'वरुण का गहरा नीला रंग मीथेन गैस के कारण है। सूर्य से बहुत दूर होने के कारण यह सूर्य का एक चक्कर लगाने में 165 पृथ्वी वर्ष लगाता है। यहाँ बर्फीले तूफान और बादलों की तेज धाराएं बहती हैं।',
    detailedEn: 'Neptune is a vivid deep blue gas and ice world. It takes 165 Earth years to complete one orbit around the Sun! Supersonic winds roar faster than the speed of sound.',
    quickStats: {
      diameter: '49,244 किमी',
      dayLength: '16 घंटे 6 मिनट',
      yearLength: '165 पृथ्वी वर्ष',
      moonsCount: 16,
      temperature: '-214°C',
      funFactHi: 'वरुण ग्रह पर हवाएं 2,000 किमी प्रति घंटे की रफ्तार से चलती हैं, जो जेट प्लेन से भी तेज हैं!',
      funFactEn: 'Winds on Neptune whip faster than 2,000 km/h, faster than a supersonic fighter jet!',
    },
    audioFactHi: 'वरुण सूर्य से सबसे दूर है और यहाँ सौरमंडल की सबसे तेज बर्फीली हवाएं चलती हैं।',
  },
  {
    id: 'moon',
    nameHi: 'चंदा मामा (Moon)',
    nameEn: 'The Moon',
    typeHi: 'पृथ्वी का प्यारा साथी उपग्रह',
    typeEn: 'Earth’s Natural Satellite',
    orderFromSun: 3.5,
    emoji: '🌙',
    color: 'from-slate-400 via-gray-300 to-zinc-600',
    bgGradient: 'bg-gradient-to-br from-slate-400 to-zinc-700',
    image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'चाँद पृथ्वी का एकमात्र प्राकृतिक उपग्रह है जो रात के आकाश में सबसे चमकीला दिखता है।',
    summaryEn: 'The Moon is Earth’s only natural satellite, orbiting us every 27.3 days.',
    detailedHi: 'चाँद का अपना कोई प्रकाश नहीं होता, यह सूर्य की रोशनी को परावर्तित करता है। चाँद पर गुरुत्वाकर्षण पृथ्वी का केवल 1/6 है, यानी अगर आप पृथ्वी पर 1 फुट उछलते हैं, तो चाँद पर 6 फुट ऊँची छलांग लगा सकते हैं! भारत के चंद्रयान-3 ने चाँद के दक्षिणी ध्रुव पर तिरंगा फहराया है।',
    detailedEn: 'The Moon reflects sunlight. Its gravity is 1/6th of Earth’s, so you could leap super high! India made history by soft-landing Chandrayaan-3 near the lunar South Pole.',
    quickStats: {
      diameter: '3,474 किमी',
      dayLength: '27.3 पृथ्वी दिन',
      yearLength: '27.3 दिन (पृथ्वी का चक्कर)',
      moonsCount: 0,
      temperature: '-130°C से +120°C',
      funFactHi: 'चाँद पर अंतरिक्ष यात्रियों के पैरों के निशान लाखों सालों तक वैसे ही रहेंगे क्योंकि वहाँ कोई हवा नहीं है!',
      funFactEn: 'Footprints left by astronauts on the Moon will stay for millions of years because there is no wind!',
    },
    audioFactHi: 'चाँद पर हवा नहीं है और भारत के चंद्रयान-3 ने चाँद के दक्षिणी ध्रुव पर इतिहास रचा है।',
  },
];

export const SPACE_MISSIONS: SpaceMissionItem[] = [
  {
    id: 'chandrayaan-3',
    titleHi: 'चंद्रयान-3 (Chandrayaan-3)',
    titleEn: 'Chandrayaan-3 Lunar Mission',
    agency: 'ISRO',
    year: '23 अगस्त 2023',
    badge: '🇮🇳 भारत का ऐतिहासिक गौरव',
    emoji: '🚀',
    image: 'https://images.unsplash.com/photo-1517976487507-59a5d11bd295?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'भारत चाँद के दक्षिणी ध्रुव (South Pole) पर उतरने वाला दुनिया का पहला देश बना!',
    summaryEn: 'India became the first nation to successfully land near the lunar South Pole.',
    achievementHi: 'विक्रम लैंडर और प्रज्ञान रोवर ने चाँद पर सल्फर, एल्युमिनियम और मिट्टी के तापमान का सफल अध्ययन किया।',
    achievementEn: 'Vikram Lander and Pragyan Rover analyzed lunar soil and discovered essential elements.',
    funFactHi: 'जिस जगह विक्रम लैंडर उतरा था, उस बिंदु को "शिव शक्ति पॉइंट" नाम दिया गया है!',
    funFactEn: 'The touchdown point of Vikram Lander was proudly named Shiv Shakti Point!',
  },
  {
    id: 'mangalyaan',
    titleHi: 'मंगलयान (Mangalyaan - MOM)',
    titleEn: 'Mars Orbiter Mission',
    agency: 'ISRO',
    year: '24 सितंबर 2014',
    badge: '🔴 पहली कोशिश में मंगल विजय',
    emoji: '🛰️',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'भारत ने पहली ही बार में मंगल की कक्षा में पहुंचकर पूरी दुनिया को चौंका दिया था।',
    summaryEn: 'India became the first nation to reach Mars orbit on its maiden attempt.',
    achievementHi: 'यह मिशन हॉलीवुड की अंतरिक्ष फिल्म से भी कम लागत (केवल ₹450 करोड़) में पूरा हुआ था।',
    achievementEn: 'Completed at a fraction of the cost of typical interplanetary missions.',
    funFactHi: 'मंगलयान की लागत लगभग ₹7 प्रति किलोमीटर थी, जो ऑटो रिक्शा के किराये से भी सस्ती थी!',
    funFactEn: 'The Mars mission cost roughly ₹7 per km, cheaper than an auto-rickshaw fare!',
  },
  {
    id: 'aditya-l1',
    titleHi: 'आदित्य-L1 (Aditya-L1)',
    titleEn: 'Aditya-L1 Solar Mission',
    agency: 'ISRO',
    year: '2 सितंबर 2023',
    badge: '☀️ सूर्य का पहला भारतीय वेधशाला',
    emoji: '☀️',
    image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'सूर्य की किरणों और सौर ज्वालाओं का अध्ययन करने वाला भारत का पहला अंतरिक्ष मिशन।',
    summaryEn: 'India’s dedicated solar observatory situated at Sun-Earth Lagrange Point 1 (L1).',
    achievementHi: 'पृथ्वी से 15 लाख किलोमीटर दूर लैग्रेंज पॉइंट 1 (L1) पर सफलतापूर्वक तैनात हुआ।',
    achievementEn: 'Orbiting L1 point 1.5 million km away from Earth with an uninterrupted view of the Sun.',
    funFactHi: 'L1 बिंदु पर सूर्य पर कभी ग्रहण नहीं लगता, इसलिए आदित्य-L1 24 घंटे लगातार सूर्य को देखता रहता है!',
    funFactEn: 'From the L1 vantage point, there are no eclipses, allowing 24/7 continuous solar study!',
  },
  {
    id: 'gaganyaan',
    titleHi: 'गगनयान (Gaganyaan)',
    titleEn: 'Gaganyaan Human Spaceflight',
    agency: 'ISRO',
    year: 'आगामी 2025-26',
    badge: '🧑‍🚀 भारत का मानव अंतरिक्ष मिशन',
    emoji: '🇮🇳',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    summaryHi: 'भारतीय अंतरिक्ष यात्रियों (व्योमनॉट्स) को अंतरिक्ष में ले जाने वाला भारत का महत्वाकांक्षी मिशन।',
    summaryEn: 'India’s upcoming crewed orbital spacecraft to carry Indian astronauts into Low Earth Orbit.',
    achievementHi: 'भारतीय अंतरिक्ष यात्रियों को 400 किमी की कक्षा में 3 दिनों के लिए ले जाना और सुरक्षित समुद्र में उतारना।',
    achievementEn: 'Designed to send 3 crew members into space for 3 days and safely recover them.',
    funFactHi: 'इस मिशन के लिए एक खास महिला रोबोट बनाई गई है जिसका नाम "व्योममित्र" (Vyommitra) है!',
    funFactEn: 'ISRO created a friendly humanoid robot named Vyommitra to test space conditions first!',
  },
];

export const SPACE_FUN_FACTS: SpaceFunFactItem[] = [
  {
    id: 'sf-1',
    titleHi: 'अंतरिक्ष में कोई आवाज़ नहीं होती',
    titleEn: 'Space is Completely Silent',
    emoji: '🔇',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    factHi: 'अंतरिक्ष में हवा नहीं है, इसलिए ध्वनि की तरंगें यात्रा नहीं कर सकतीं। चाहे कितना भी बड़ा धमाका हो, अंतरिक्ष में सब शांत रहता है!',
    factEn: 'Sound needs molecules to travel. Since space is a vacuum with no air, space is completely silent!',
    category: 'cosmos',
  },
  {
    id: 'sf-2',
    titleHi: 'अंतरिक्ष यात्री कैसे सोते हैं?',
    titleEn: 'How Astronauts Sleep in Zero Gravity',
    emoji: '🛌',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    factHi: 'जीरो ग्रेविटी के कारण अंतरिक्ष में कोई जमीन या बिस्तर नहीं होता। अंतरिक्ष यात्री दीवार से बंधे स्लीपिंग बैग में सोते हैं ताकि वे हवा में तैरकर टकरा न जाएं!',
    factEn: 'In microgravity, astronauts strap their sleeping bags to cabin walls so they do not float away and bump into walls!',
    category: 'astronaut',
  },
  {
    id: 'sf-3',
    titleHi: 'तारों का अपना रंग उनके तापमान को बताता है',
    titleEn: 'Star Colors Reveal Temperature',
    emoji: '✨',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    factHi: 'नीले रंग के तारे सबसे ज्यादा गर्म होते हैं (25,000°C+), पीले तारे मध्यम गर्म (जैसे सूर्य) और लाल रंग के तारे सबसे कम गर्म (3,000°C) होते हैं।',
    factEn: 'Blue stars are the hottest, yellow stars like our Sun are medium hot, and red stars are the coolest.',
    category: 'moon_stars',
  },
  {
    id: 'sf-4',
    titleHi: 'ब्लैक होल का जादुई गुरुत्वाकर्षण',
    titleEn: 'Black Holes Trap Even Light',
    emoji: '🕳️',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&auto=format&fit=crop&q=80',
    factHi: 'ब्लैक होल अंतरिक्ष की वह जगह है जहाँ गुरुत्वाकर्षण इतना ताकतवर होता है कि रोशनी भी इससे बाहर नहीं निकल सकती!',
    factEn: 'A black hole’s gravitational pull is so extreme that nothing, not even speed-of-light photons, can escape it!',
    category: 'blackhole',
  },
];

export const SPACE_QUIZ_QUESTIONS: SpaceQuizQuestion[] = [
  {
    id: 'sq-1',
    questionHi: 'सौरमंडल का सबसे बड़ा ग्रह कौन सा है?',
    questionEn: 'Which is the largest planet in our solar system?',
    optionsHi: ['बृहस्पति (Jupiter)', 'शनि (Saturn)', 'पृथ्वी (Earth)', 'मंगल (Mars)'],
    optionsEn: ['Jupiter', 'Saturn', 'Earth', 'Mars'],
    correctIndex: 0,
    explanationHi: 'बृहस्पति सौरमंडल का सबसे विशाल ग्रह है जिसमें 1,300 पृथ्वियां समा सकती हैं।',
    explanationEn: 'Jupiter is the largest planet, big enough to hold 1,300 Earths inside.',
  },
  {
    id: 'sq-2',
    questionHi: 'भारत के किस मिशन ने चाँद के दक्षिणी ध्रुव पर सॉफ्ट लैंडिंग की?',
    questionEn: 'Which Indian mission soft-landed near the lunar South Pole?',
    optionsHi: ['चंद्रयान-3', 'मंगलयान', 'आदित्य-L1', 'गगनयान'],
    optionsEn: ['Chandrayaan-3', 'Mangalyaan', 'Aditya-L1', 'Gaganyaan'],
    correctIndex: 0,
    explanationHi: '23 अगस्त 2023 को चंद्रयान-3 ने चाँद के दक्षिणी ध्रुव पर उतरकर इतिहास रचा।',
    explanationEn: 'Chandrayaan-3 made historical soft landing near Moon’s South Pole on 23 August 2023.',
  },
  {
    id: 'sq-3',
    questionHi: 'किस ग्रह को "लाल ग्रह (Red Planet)" कहा जाता है?',
    questionEn: 'Which planet is known as the Red Planet?',
    optionsHi: ['मंगल (Mars)', 'शुक्र (Venus)', 'बुध (Mercury)', 'शनि (Saturn)'],
    optionsEn: ['Mars', 'Venus', 'Mercury', 'Saturn'],
    correctIndex: 0,
    explanationHi: 'मंगल की सतह पर आयरन ऑक्साइड (लोहे की जंग) होने के कारण यह लाल रंग का दिखता है।',
    explanationEn: 'Mars appears reddish because of iron oxide rust across its rocky surface.',
  },
  {
    id: 'sq-4',
    questionHi: 'सौरमंडल के किस ग्रह के चारों ओर सबसे सुंदर बर्फीले छल्ले (Rings) हैं?',
    questionEn: 'Which planet has the most famous and beautiful ice rings?',
    optionsHi: ['शनि (Saturn)', 'बृहस्पति (Jupiter)', 'पृथ्वी (Earth)', 'वरुण (Neptune)'],
    optionsEn: ['Saturn', 'Jupiter', 'Earth', 'Neptune'],
    correctIndex: 0,
    explanationHi: 'शनि के चारों ओर बर्फ और चट्टानों के टुकड़ों से बने चमकीले रिंग्स हैं।',
    explanationEn: 'Saturn has the most spectacular system of icy rings orbiting around it.',
  },
  {
    id: 'sq-5',
    questionHi: 'सूर्य की रोशनी को पृथ्वी तक पहुँचने में कितना समय लगता है?',
    questionEn: 'How long does sunlight take to reach Earth?',
    optionsHi: ['लगभग 8 मिनट 20 सेकंड', '1 मिनट', '1 घंटा', 'तुरंत (1 सेकंड)'],
    optionsEn: ['Around 8 mins 20 secs', '1 minute', '1 hour', 'Instant (1 second)'],
    correctIndex: 0,
    explanationHi: 'प्रकाश की गति 3 लाख किमी/सेकंड है, और 15 करोड़ किमी की दूरी तय करने में लगभग 8 मिनट 20 सेकंड लगते हैं।',
    explanationEn: 'Sunlight travels 150 million km in approximately 8 minutes and 20 seconds.',
  },
];
