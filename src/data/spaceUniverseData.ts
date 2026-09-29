export interface SpaceItem {
  id: string;
  category: 'planets' | 'sun_moon' | 'space_travel' | 'stars_galaxy';
  number: number;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  emoji: string;
  heroFactHi: string;
  heroFactEn: string;
  detailsHi: string;
  detailsEn: string;
  speedInfoHi?: string;
  speedInfoEn?: string;
  distanceInfoHi?: string;
  distanceInfoEn?: string;
  funFactHi: string;
  funFactEn: string;
  color: string;
  badgeHi: string;
  badgeEn: string;
}

export const SPACE_UNIVERSE_ITEMS: SpaceItem[] = [
  {
    id: 'sun',
    category: 'sun_moon',
    number: 1,
    titleHi: '☀️ हमारा सूर्य (The Sun)',
    titleEn: '☀️ The Sun',
    subtitleHi: 'सौरमंडल का राजा और जीवनदाता',
    subtitleEn: 'Center of Solar System & King of Energy',
    emoji: '☀️',
    heroFactHi: 'सूर्य इतना विशाल है कि इसके अंदर 13 लाख पृथ्वी समा सकती हैं!',
    heroFactEn: 'The Sun is so massive that 1.3 million Earths could fit inside it!',
    detailsHi: 'सूर्य हमारे सौरमंडल के केंद्र में स्थित एक विशाल दहकता हुआ तारा है। यह हाइड्रोजन और हीलियम गैसों से बना है। सूर्य के प्रकाश को पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड का समय लगता है।',
    detailsEn: 'The Sun is a giant luminous star of burning plasma at the center of our solar system. Sunlight takes about 8 minutes and 20 seconds to reach Earth.',
    speedInfoHi: 'सतह का तापमान: लगभग 5,500°C',
    speedInfoEn: 'Surface Temp: ~5,500°C',
    distanceInfoHi: 'पृथ्वी से दूरी: लगभग 15 करोड़ किमी',
    distanceInfoEn: 'Distance to Earth: ~150 Million km',
    funFactHi: 'अगर सूर्य की रोशनी न हो, तो पृथ्वी पर कोई भी पेड़-पौधा या जीव जीवित नहीं रह सकता!',
    funFactEn: 'Without sunlight, all life, plants, and water cycles on Earth would freeze!',
    color: 'from-amber-500 to-orange-600',
    badgeHi: 'सौरमंडल का तारा',
    badgeEn: 'Star of System'
  },
  {
    id: 'moon',
    category: 'sun_moon',
    number: 2,
    titleHi: '🌙 चंदा मामा (The Moon)',
    titleEn: '🌙 The Moon',
    subtitleHi: 'पृथ्वी का एकमात्र प्राकृतिक उपग्रह',
    subtitleEn: 'Earth’s Only Natural Satellite',
    emoji: '🌙',
    heroFactHi: 'चाँद पर हवा नहीं है, इसलिए वहाँ अंतरिक्ष यात्रियों के कदमों के निशान लाखों साल तक ऐसे ही रहेंगे!',
    heroFactEn: 'There is no wind on the Moon, so astronaut footprints will remain for millions of years!',
    detailsHi: 'चाँद पृथ्वी का सबसे करीबी पड़ोसी है। यह 27 दिनों में पृथ्वी का एक चक्कर लगाता है। चाँद की अपनी कोई रोशनी नहीं होती, यह सूर्य के प्रकाश को परावर्तित करके रात में चमकता है।',
    detailsEn: 'The Moon orbits Earth every 27.3 days. It has no light of its own and shines at night by reflecting sunlight.',
    speedInfoHi: 'गुरुत्वाकर्षण: पृथ्वी का केवल 1/6 भाग',
    speedInfoEn: 'Gravity: 1/6th of Earth gravity',
    distanceInfoHi: 'पृथ्वी से दूरी: 3,84,400 किमी',
    distanceInfoEn: 'Distance to Earth: 384,400 km',
    funFactHi: 'चाँद पर आपका वजन पृथ्वी के वजन का सिर्फ 1/6 रह जाता है—यानी आप वहाँ बहुत ऊंची छलांग लगा सकते हैं!',
    funFactEn: 'You weigh 6 times lighter on the Moon, allowing you to jump super high into the air!',
    color: 'from-slate-700 to-indigo-900',
    badgeHi: 'प्राकृतिक उपग्रह',
    badgeEn: 'Natural Satellite'
  },
  {
    id: 'earth',
    category: 'planets',
    number: 3,
    titleHi: '🌍 हमारी प्यारी पृथ्वी (Mother Earth)',
    titleEn: '🌍 Planet Earth',
    subtitleHi: 'नीला ग्रह और जीवन का इकलौता घर',
    subtitleEn: 'The Blue Planet & Our Home',
    emoji: '🌍',
    heroFactHi: 'अंतरिक्ष से देखने पर पृथ्वी नीली दिखती है क्योंकि इसकी सतह पर 71% पानी है!',
    heroFactEn: 'Earth looks bright blue from space because 71% of its surface is covered by oceans!',
    detailsHi: 'सूर्य से दूरी के क्रम में पृथ्वी तीसरा ग्रह है। यहाँ सांस लेने के लिए ऑक्सीजन, पीने के लिए पानी और जीने के लिए अनुकूल तापमान है। पृथ्वी 365 दिन 6 घंटे में सूर्य का एक चक्कर पूरा करती है।',
    detailsEn: 'Earth is the third planet from the Sun and the only known planet to harbor life, with abundant liquid water and a protective breathable atmosphere.',
    speedInfoHi: 'घूर्णन गति: 24 घंटे (1 दिन-रात)',
    speedInfoEn: 'Rotation: 24 hours (1 Day-Night)',
    distanceInfoHi: 'सौरमंडल में स्थान: तीसरा ग्रह',
    distanceInfoEn: 'Position: 3rd from Sun',
    funFactHi: 'पृथ्वी अपने अक्ष पर 23.5 डिग्री झुकी हुई है, इसी झुकाव के कारण हमें सर्दी, गर्मी और बारिश के मौसम मिलते हैं!',
    funFactEn: 'Earth’s 23.5-degree axial tilt is the magical reason we experience changing seasons every year!',
    color: 'from-blue-600 to-emerald-600',
    badgeHi: 'नीला ग्रह',
    badgeEn: 'Blue Planet'
  },
  {
    id: 'mars',
    category: 'planets',
    number: 4,
    titleHi: '🔴 मंगल ग्रह (Mars - The Red Planet)',
    titleEn: '🔴 Mars (The Red Planet)',
    subtitleHi: 'लाल ग्रह और मंगलयान का गंतव्य',
    subtitleEn: 'The Red Planet & Destination of Mangalyaan',
    emoji: '🔴',
    heroFactHi: 'मंगल ग्रह पर सौरमंडल का सबसे ऊँचा ज्वालामुखी "ओलंपस मॉन्स" है, जो माउंट एवरेस्ट से 3 गुना ऊँचा है!',
    heroFactEn: 'Mars hosts Olympus Mons, the tallest volcano in the solar system, 3 times taller than Mount Everest!',
    detailsHi: 'मंगल ग्रह की मिट्टी में जंग लगे लोहे (Iron Oxide) की अधिकता के कारण यह लाल दिखता है। भारत के मंगलयान (Mangalyaan) ने अपने पहले ही प्रयास में मंगल की कक्षा में पहुँचकर इतिहास रचा था।',
    detailsEn: 'Mars looks red due to iron oxide rust in its soil. India’s Mangalyaan successfully orbited Mars in its very first attempt, making global history.',
    speedInfoHi: '1 वर्ष: 687 पृथ्वी दिन',
    speedInfoEn: '1 Year: 687 Earth Days',
    distanceInfoHi: 'सौरमंडल में स्थान: चौथा ग्रह',
    distanceInfoEn: 'Position: 4th from Sun',
    funFactHi: 'मंगल ग्रह पर सूर्यास्त (Sunset) नीले रंग का दिखाई देता है!',
    funFactEn: 'Sunsets on Mars glow in beautiful blue hues due to fine atmospheric dust!',
    color: 'from-red-600 to-amber-700',
    badgeHi: 'लाल ग्रह',
    badgeEn: 'Red Planet'
  },
  {
    id: 'jupiter',
    category: 'planets',
    number: 5,
    titleHi: '🪐 बृहस्पति ग्रह (Jupiter - The Giant)',
    titleEn: '🪐 Jupiter (The Giant King)',
    subtitleHi: 'सौरमंडल का सबसे विशालकाय ग्रह',
    subtitleEn: 'Largest Planet in the Solar System',
    emoji: '🪐',
    heroFactHi: 'बृहस्पति इतना बड़ा है कि सौरमंडल के बाकी सभी ग्रह मिलकर भी इसके अंदर आसानी से समा सकते हैं!',
    heroFactEn: 'Jupiter is so immense that all other 7 planets combined could easily fit inside it!',
    detailsHi: 'बृहस्पति सौरमंडल का सबसे भारी और बड़ा गैस दानव (Gas Giant) है। इसके ऊपर 300 साल से भी पुराना एक विशाल तूफ़ान घूम रहा है जिसे "ग्रेट रेड स्पॉट" कहा जाता है। इसके 95 से अधिक चंद्रमा हैं।',
    detailsEn: 'Jupiter is a massive gas giant with the famous Great Red Spot storm raging for over 300 years. It has over 95 moons orbiting it.',
    speedInfoHi: 'दिन की लंबाई: केवल 10 घंटे (सबसे तेज़)',
    speedInfoEn: 'Day length: Just 10 hours (Fastest)',
    distanceInfoHi: 'सौरमंडल में स्थान: 5वां ग्रह',
    distanceInfoEn: 'Position: 5th from Sun',
    funFactHi: 'बृहस्पति अपने विशाल गुरुत्वाकर्षण से खतरनाक उल्कापिंडों को खींचकर पृथ्वी का सुरक्षा कवच बनता है!',
    funFactEn: 'Jupiter acts as a giant cosmic vacuum cleaner, protecting Earth by deflecting dangerous asteroids!',
    color: 'from-amber-600 via-orange-600 to-yellow-700',
    badgeHi: 'सबसे बड़ा ग्रह',
    badgeEn: 'Largest Planet'
  },
  {
    id: 'saturn',
    category: 'planets',
    number: 6,
    titleHi: '💍 शनि ग्रह (Saturn - Ringed Planet)',
    titleEn: '💍 Saturn (The Ringed Jewel)',
    subtitleHi: 'चमकीले छल्लों वाला सबसे सुंदर ग्रह',
    subtitleEn: 'Most Beautiful Ringed Planet',
    emoji: '🪐',
    heroFactHi: 'शनि ग्रह के चारों ओर बर्फ, धूल और पत्थरों के 7 सुंदर चमकीले छल्ले (Rings) हैं!',
    heroFactEn: 'Saturn has 7 spectacular rings made of billions of sparkling ice chunks and space rocks!',
    detailsHi: 'शनि सौरमंडल का दूसरा सबसे बड़ा ग्रह है। यह गैसों से बना है और इतना हल्का है कि यदि कोई इतना बड़ा पानी का टब मिले, तो शनि ग्रह पानी में तैरने लगेगा!',
    detailsEn: 'Saturn is a magnificent gas giant known for its glowing ring system. It is less dense than water and could literally float in a giant bathtub.',
    speedInfoHi: '1 वर्ष: 29.5 पृथ्वी वर्ष',
    speedInfoEn: '1 Year: 29.5 Earth Years',
    distanceInfoHi: 'सौरमंडल में स्थान: 6वां ग्रह',
    distanceInfoEn: 'Position: 6th from Sun',
    funFactHi: 'शनि के 140 से भी ज्यादा चंद्रमा हैं, जिनमें "टाइटन" चंद्रमा पर नदियां और झीलें हैं!',
    funFactEn: 'Saturn has over 140 moons; its largest moon Titan even has rivers and lakes of liquid methane!',
    color: 'from-yellow-600 to-amber-700',
    badgeHi: 'छल्लों वाला ग्रह',
    badgeEn: 'Ringed Planet'
  },
  {
    id: 'chandrayaan',
    category: 'space_travel',
    number: 7,
    titleHi: '🚀 चंद्रयान-3 (Chandrayaan-3 Mission)',
    titleEn: '🚀 Chandrayaan-3 Lunar Mission',
    subtitleHi: 'भारत का गौरव — चाँद के दक्षिणी ध्रुव पर ऐतिहासिक लैंडिंग',
    subtitleEn: 'India’s Historic South Pole Moon Landing',
    emoji: '🚀',
    heroFactHi: 'भारत दुनिया का पहला देश बना जिसने चाँद के रहस्यमयी दक्षिणी ध्रुव (South Pole) पर सॉफ्ट लैंडिंग की!',
    heroFactEn: 'India became the 1st nation in human history to land successfully near the Moon’s South Pole!',
    detailsHi: 'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) द्वारा 23 अगस्त 2023 को विक्रम लैंडर और प्रज्ञान रोवर को चाँद पर उतारा गया। इस ऐतिहासिक दिन को भारत में हर साल "राष्ट्रीय अंतरिक्ष दिवस" के रूप में मनाया जाता है।',
    detailsEn: 'ISRO created world history on 23 August 2023 with Vikram Lander and Pragyan Rover landing near lunar south pole. August 23 is now National Space Day.',
    speedInfoHi: 'रोवर का नाम: प्रज्ञान (Pragyan)',
    speedInfoEn: 'Rover Name: Pragyan (Wisdom)',
    distanceInfoHi: 'स्पेस एजेंसी: इसरो (ISRO - भारत)',
    distanceInfoEn: 'Space Agency: ISRO (India)',
    funFactHi: 'प्रज्ञान रोवर के पहियों में अशोक स्तंभ और इसरो का लोगो था, जिसने चाँद की मिट्टी पर भारत की छाप छोड़ी!',
    funFactEn: 'Pragyan Rover imprinted the National Emblem of India and ISRO logo on the lunar soil forever!',
    color: 'from-orange-500 via-sky-600 to-emerald-600',
    badgeHi: 'इसरो का गौरव',
    badgeEn: 'ISRO Pride'
  },
  {
    id: 'astronauts',
    category: 'space_travel',
    number: 8,
    titleHi: '👨‍🚀 अंतरिक्ष यात्री व रॉकेट्स (Astronauts & Rockets)',
    titleEn: '👨‍🚀 Astronauts & Space Exploration',
    subtitleHi: 'अंतरिक्ष की यात्रा करने वाले साहसी मानव',
    subtitleEn: 'Brave Explorers of the Cosmos',
    emoji: '👨‍🚀',
    heroFactHi: 'राकेश शर्मा अंतरिक्ष में जाने वाले पहले भारतीय थे—जब प्रधानमंत्री ने पूछा भारत कैसा दिखता है, तो उन्होंने कहा "सारे जहाँ से अच्छा"!',
    heroFactEn: 'Rakesh Sharma was India’s 1st astronaut; when asked how India looked from space, he replied "Saare Jahan Se Achha"!',
    detailsHi: 'अंतरिक्ष यात्री खास स्पेससूट पहनते हैं जो उन्हें शून्य तापमान, विकिरण और ऑक्सीजन की कमी से बचाते हैं। कल्पना चावला और सुनीता विलियम्स ने अंतरिक्ष में जाकर दुनिया भर की बेटियों को प्रेरणा दी।',
    detailsEn: 'Astronauts wear pressurized suits providing life support. Legendary Indian-origin astronauts Kalpana Chawla and Sunita Williams inspired millions globally.',
    speedInfoHi: 'रॉकेट की गति: 28,000 किमी/घंटा',
    speedInfoEn: 'Rocket Speed: ~28,000 km/h',
    distanceInfoHi: 'ISS की ऊँचाई: 400 किमी ऊपर',
    distanceInfoEn: 'ISS Altitude: 400 km above Earth',
    funFactHi: 'अंतरिक्ष में गुरुत्वाकर्षण न होने के कारण अंतरिक्ष यात्री हवा में तैरते हुए खाना खाते और सोते हैं!',
    funFactEn: 'In zero gravity, astronauts float around freely while eating, working, and sleeping in sleeping bags tied to walls!',
    color: 'from-purple-600 to-indigo-900',
    badgeHi: 'अंतरिक्ष अन्वेषण',
    badgeEn: 'Human Spaceflight'
  }
];
