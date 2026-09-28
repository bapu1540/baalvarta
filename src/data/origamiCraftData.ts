export interface OrigamiStep {
  stepNumber: number;
  titleHi: string;
  titleEn: string;
  instructionHi: string;
  instructionEn: string;
  icon: string;
}

export interface OrigamiCraftItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'easy' | 'medium' | 'popular';
  categoryLabelHi: string;
  categoryLabelEn: string;
  emoji: string;
  difficulty: 'आसान (Easy)' | 'मध्यम (Medium)';
  timeMinutes: number;
  materialsHi: string[];
  materialsEn: string[];
  descriptionHi: string;
  descriptionEn: string;
  gradient: string;
  steps: OrigamiStep[];
  funTipHi: string;
  funTipEn: string;
}

export const ORIGAMI_CRAFT_ITEMS: OrigamiCraftItem[] = [
  {
    id: 'paper-boat',
    titleHi: '⛵ जादुई कागज़ की नाव',
    titleEn: '⛵ Magic Paper Boat',
    category: 'popular',
    categoryLabelHi: '⭐ सबसे लोकप्रिय',
    categoryLabelEn: '⭐ Most Popular',
    emoji: '⛵',
    difficulty: 'आसान (Easy)',
    timeMinutes: 3,
    materialsHi: ['1 आयताकार या चौकोर कागज़ (A4 या क्राफ्ट पेपर)', 'कलर पेंसिल (सजाने के लिए)'],
    materialsEn: ['1 Rectangular or square paper', 'Color pencils for decoration'],
    descriptionHi: 'पानी में तैरने वाली सबसे प्यारी और आसान कागज़ की नाव बनाएं और बारिश के पानी में तैराएं!',
    descriptionEn: 'Make a floating paper boat in just 5 easy steps and sail it in water!',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    funTipHi: '💡 टिप: नाव के नीचे हल्का मोम (Wax) घिसने से नाव पानी में ज्यादा देर तक बिना भीगे तैरती है!',
    funTipEn: '💡 Tip: Rub a little wax candle at the bottom of the boat to make it waterproof for longer sails!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'कागज़ को बीच से मोड़ें',
        titleEn: 'Fold in half',
        instructionHi: 'एक आयताकार कागज़ लें और उसे ऊपर से नीचे की तरफ ठीक आधा मोड़ें।',
        instructionEn: 'Take a rectangular paper and fold it in half from top to bottom.',
        icon: '📄'
      },
      {
        stepNumber: 2,
        titleHi: 'दोनों कोनों को त्रिकोण बनाएं',
        titleEn: 'Fold top corners inward',
        instructionHi: 'ऊपरी दोनों कोनों को अंदर की तरफ मोड़ें ताकि ऊपर एक त्रिकोण (Triangle) बन जाए।',
        instructionEn: 'Fold the top left and right corners inward to meet in the middle.',
        icon: '📐'
      },
      {
        stepNumber: 3,
        titleHi: 'नीचे की पट्टी को ऊपर मोड़ें',
        titleEn: 'Fold bottom flaps up',
        instructionHi: 'नीचे बची हुई दोनों पट्टियों को ऊपर की तरफ मोड़ें (एक आगे, एक पीछे)। अब यह टोपी जैसा दिखेगा।',
        instructionEn: 'Fold the bottom flaps up on both sides (front and back) like a hat.',
        icon: '🎩'
      },
      {
        stepNumber: 4,
        titleHi: 'टोपी को खोलकर चौकोर बनाएं',
        titleEn: 'Open into a diamond',
        instructionHi: 'टोपी के बीच में हाथ डालकर उसे खोलें और दबाकर चौकोर (Diamond) बना लें। नीचे के कोनों को ऊपर मोड़ें।',
        instructionEn: 'Put your fingers inside the hat, pull open, and flatten into a diamond shape. Fold bottom corners up.',
        icon: '💎'
      },
      {
        stepNumber: 5,
        titleHi: 'दोनों सिरों को धीरे से खींचें',
        titleEn: 'Gently pull the sides apart',
        instructionHi: 'ऊपर के दोनों सिरों को दोनों हाथों से धीरे-धीरे बाहर की ओर खींचें — आपकी जादुई नाव तैयार है!',
        instructionEn: 'Gently pull the top outer corners outward — your magic floating boat is ready!',
        icon: '⛵'
      }
    ]
  },
  {
    id: 'paper-plane',
    titleHi: '✈️ सुपर सोनिक हवाई जहाज़',
    titleEn: '✈️ Super Sonic Paper Airplane',
    category: 'popular',
    categoryLabelHi: '⭐ सुपर फास्ट',
    categoryLabelEn: '⭐ Super Fast',
    emoji: '✈️',
    difficulty: 'आसान (Easy)',
    timeMinutes: 2,
    materialsHi: ['1 सादा A4 कागज़'],
    materialsEn: ['1 Plain A4 sheet'],
    descriptionHi: 'हवा में सबसे दूर और सीधा उड़ने वाला शानदार पेपर प्लेन बनाएं!',
    descriptionEn: 'Create a streamlined paper jet designed to glide long distances smoothly!',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    funTipHi: '💡 टिप: पंखों के पिछले कोनों को हल्का-सा ऊपर मोड़ने से प्लेन हवा में और ऊपर उड़ता है!',
    funTipEn: '💡 Tip: Bend the rear edge of the wings slightly upward for extra lift in the air!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'लंबाई में आधा मोड़ें',
        titleEn: 'Fold lengthwise',
        instructionHi: 'कागज़ को लंबाई में आधा मोड़ें और फिर वापस खोलें ताकि बीच में एक सीधी लाइन बन जाए।',
        instructionEn: 'Fold the paper in half lengthwise and unfold to make a center crease line.',
        icon: '📄'
      },
      {
        stepNumber: 2,
        titleHi: 'ऊपर के दोनों कोने मोड़ें',
        titleEn: 'Fold top corners to crease',
        instructionHi: 'ऊपर के बाएं और दाएं कोनों को मोड़कर बीच वाली लाइन से मिलाएँ।',
        instructionEn: 'Fold the top left and right corners inward along the center line to form a point.',
        icon: '📐'
      },
      {
        stepNumber: 3,
        titleHi: 'त्रिकोण को फिर से मोड़ें',
        titleEn: 'Fold edges again',
        instructionHi: 'अब दोनों तिरछे किनारों को एक बार फिर बीच की लाइन की तरफ मोड़ें ताकि यह नुकीला बन जाए।',
        instructionEn: 'Fold the angled side edges inward again toward the center line to make a sharper point.',
        icon: '🎯'
      },
      {
        stepNumber: 4,
        titleHi: 'प्लेन को आधा बंद करें और पंख बनाएं',
        titleEn: 'Fold in half & create wings',
        instructionHi: 'प्लेन को बीच से बंद करें और दोनों तरफ के पंखों को नीचे की तरफ मोड़ें। आपका प्लेन उड़ने के लिए तैयार है!',
        instructionEn: 'Fold the entire plane in half along the center, then fold down both wings. Ready to fly!',
        icon: '✈️'
      }
    ]
  },
  {
    id: 'jumping-frog',
    titleHi: '🐸 फुदकने वाला कागज़ी मेंढक',
    titleEn: '🐸 Jumping Paper Frog',
    category: 'popular',
    categoryLabelHi: '🎉 मजेदार खेल',
    categoryLabelEn: '🎉 Action Toy',
    emoji: '🐸',
    difficulty: 'मध्यम (Medium)',
    timeMinutes: 4,
    materialsHi: ['1 हरा या रंगीन चौकोर कागज़ (15x15 सेमी)'],
    materialsEn: ['1 Green or colored square paper (15x15 cm)'],
    descriptionHi: 'पीछे से उंगली से दबाते ही हवा में छलांग लगाने वाला असली जैसा मजेदार मेंढक!',
    descriptionEn: 'An amazing action origami toy that genuinely hops when you tap its back!',
    gradient: 'from-emerald-500 via-green-500 to-teal-600',
    funTipHi: '💡 टिप: मेंढक की पीठ पर छोटी आंखें बनाकर दोस्तों के साथ कूदने की रेस लगाएं!',
    funTipEn: '💡 Tip: Draw cute eyes on the frog and organize a frog jumping race with friends!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'चौकोर कागज़ को आधा मोड़ें',
        titleEn: 'Fold square in half',
        instructionHi: 'एक चौकोर हरा कागज़ लें और उसे ऊपर से नीचे आधा मोड़ें।',
        instructionEn: 'Take a square green sheet and fold it in half horizontally.',
        icon: '🟩'
      },
      {
        stepNumber: 2,
        titleHi: 'ऊपर X आकार की क्रीज बनाएं',
        titleEn: 'Make an X crease at top',
        instructionHi: 'ऊपर वाले हिस्से को दोनों तरफ तिरछा मोड़कर X का निशान बनाएं और बीच से दबाकर त्रिकोण बना लें।',
        instructionEn: 'Fold diagonally both ways to form an X crease, then collapse into a waterbomb triangle.',
        icon: '❌'
      },
      {
        stepNumber: 3,
        titleHi: 'मेंढक के आगे के पैर बनाएं',
        titleEn: 'Fold front legs',
        instructionHi: 'त्रिकोण के दोनों कोनों को ऊपर की तरफ मोड़ें, फिर बाहर की तरफ मोड़कर पैर बनाएं।',
        instructionEn: 'Fold the triangle tips upward, then fold them outward to shape the front legs.',
        icon: '🐾'
      },
      {
        stepNumber: 4,
        titleHi: 'स्प्रिंग जैसा फोल्ड (कूदने वाला हिस्सा)',
        titleEn: 'Accordion spring fold',
        instructionHi: 'निचले हिस्से को ऊपर मोड़ें, फिर पीछे आधा मोड़कर ज़िग-ज़ैग स्प्रिंग बना दें।',
        instructionEn: 'Fold the bottom half up, then fold half of it back down to create a spring hinge.',
        icon: '🔄'
      },
      {
        stepNumber: 5,
        titleHi: 'मेंढक को दबाकर कुदाएं!',
        titleEn: 'Tap back to jump!',
        instructionHi: 'मेंढक की पीठ पर उंगली रखकर पीछे खींचकर छोड़ें — वह हवा में उछल जाएगा!',
        instructionEn: 'Place your finger on the back hinge and slide it off — watch your frog jump high!',
        icon: '🐸'
      }
    ]
  },
  {
    id: 'butterfly',
    titleHi: '🦋 रंग-बिरंगी ओरिगेमी तितली',
    titleEn: '🦋 Origami Butterfly',
    category: 'easy',
    categoryLabelHi: '🌸 सुंदर कला',
    categoryLabelEn: '🌸 Beautiful Art',
    emoji: '🦋',
    difficulty: 'आसान (Easy)',
    timeMinutes: 3,
    materialsHi: ['1 चौकोर रंगीन कागज़ (गुलाबी, पीला या नीला)'],
    materialsEn: ['1 Square colored sheet (pink, yellow, or blue)'],
    descriptionHi: 'दीवारों, किताबों और कमरों को सजाने के लिए सुंदर 3D ओरिगेमी तितली बनाएं!',
    descriptionEn: 'Fold a delicate 3D paper butterfly perfect for room decoration and craft projects!',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    funTipHi: '💡 टिप: अलग-अलग रंगों की 5-6 तितलियां बनाकर धागे में पिरोकर कमरे में टांगें!',
    funTipEn: '💡 Tip: Make 5-6 colorful butterflies and string them together as a lovely wall mobile!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'दोनों तरफ तिरछा मोड़ें',
        titleEn: 'Diagonal folds',
        instructionHi: 'चौकोर कागज़ को दोनों दिशाओं में कोने से कोना मिलाकर मोड़ें और खोलें।',
        instructionEn: 'Fold diagonally both ways from corner to corner and unfold.',
        icon: '📐'
      },
      {
        stepNumber: 2,
        titleHi: 'त्रिकोण बेस बनाएं',
        titleEn: 'Collapse into triangle',
        instructionHi: 'कागज़ को बीच से दबाकर एक त्रिकोण बना लें (Triangle Base)।',
        instructionEn: 'Push the sides inward to collapse the paper into a neat triangle base.',
        icon: '🔺'
      },
      {
        stepNumber: 3,
        titleHi: 'पंखों के ऊपरी कोने मोड़ें',
        titleEn: 'Fold top flaps down',
        instructionHi: 'ऊपर की दो परतों को नीचे बीच वाली लाइन की तरफ मोड़ें।',
        instructionEn: 'Fold the two top layer corners down toward the bottom center point.',
        icon: '🦋'
      },
      {
        stepNumber: 4,
        titleHi: 'निचला कोना पीछे से ऊपर लाएं',
        titleEn: 'Wrap bottom tip over top',
        instructionHi: 'पीछे वाले कोने को ऊपर से घुमाकर आगे लाएं और हल्का दबाएं — तितली के पंख खिल जाएंगे!',
        instructionEn: 'Flip over, pull the bottom tip up past the top edge, and tuck it over the center flap.',
        icon: '✨'
      }
    ]
  },
  {
    id: 'paper-crown',
    titleHi: '👑 राजकुमार/राजकुमारी का मुकुट',
    titleEn: '👑 King & Princess Crown',
    category: 'easy',
    categoryLabelHi: '🎉 बर्थडे स्पेशल',
    categoryLabelEn: '🎉 Party Hat',
    emoji: '👑',
    difficulty: 'आसान (Easy)',
    timeMinutes: 3,
    materialsHi: ['1 चमकीला पीला या गोल्डन कागज़'],
    materialsEn: ['1 Shiny yellow or golden paper'],
    descriptionHi: 'जन्मदिन और नाटकों के लिए सिर पर पहनने वाला शानदार राजा का मुकुट!',
    descriptionEn: 'Fold an impressive wearable royal crown for pretend play and birthday celebrations!',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    funTipHi: '💡 टिप: मुकुट पर स्केच पेन से मोती, तारे और अपना नाम लिखकर पहनें!',
    funTipEn: '💡 Tip: Decorate the crown points with drawn jewels, stars, and your name!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'कागज़ को चौकोर मोड़ें',
        titleEn: 'Fold in half',
        instructionHi: 'कागज़ को बीच से मोड़कर आयत बनाएं।',
        instructionEn: 'Fold your paper horizontally in half.',
        icon: '📄'
      },
      {
        stepNumber: 2,
        titleHi: 'मुकुट के तीन शिखर बनाएं',
        titleEn: 'Fold 3 peaks',
        instructionHi: 'कोनों को ऊपर की ओर मोड़कर मुकुट के सुंदर 3 नुकीले शिखर बनाएं।',
        instructionEn: 'Fold the corners upward symmetrically to form three sharp royal peaks.',
        icon: '👑'
      },
      {
        stepNumber: 3,
        titleHi: 'नीचे का घेरा लॉक करें',
        titleEn: 'Lock the headband',
        instructionHi: 'नीचे की पट्टी को दो बार मोड़ें ताकि मुकुट सिर पर टिक सके। आपका मुकुट तैयार है!',
        instructionEn: 'Fold the lower border band twice to lock the base securely. Ready to wear!',
        icon: '🎉'
      }
    ]
  },
  {
    id: 'spinning-pinwheel',
    titleHi: '🎏 हवा में घूमने वाली रंगीन फिरकी',
    titleEn: '🎏 Spinning Windmill / Pinwheel',
    category: 'popular',
    categoryLabelHi: '🌀 हवा का जादू',
    categoryLabelEn: '🌀 Wind Spinner',
    emoji: '🎏',
    difficulty: 'आसान (Easy)',
    timeMinutes: 4,
    materialsHi: ['1 चौकोर कागज़', '1 आलपिन या छोटी कील', '1 स्ट्रॉ या पेंसिल'],
    materialsEn: ['1 Square paper', '1 Pushpin', '1 Straw or pencil with eraser'],
    descriptionHi: 'फूंक मारते ही या हवा चलते ही तेज़ी से गोल-गोल घूमने वाली चकरघिन्नी (फिरकी)!',
    descriptionEn: 'A magical classic paper pinwheel that spins swiftly in the wind or when blown!',
    gradient: 'from-purple-500 via-pink-500 to-amber-500',
    funTipHi: '💡 टिप: फिरकी को लेकर पंखे के नीचे या हवा में दौड़ें, यह बहुत तेज़ घूमेगी!',
    funTipEn: '💡 Tip: Run forward holding the pinwheel outdoors and watch it spin super fast!',
    steps: [
      {
        stepNumber: 1,
        titleHi: 'कोनों से बीच तक 4 कट लगाएं',
        titleEn: 'Cut from 4 corners',
        instructionHi: 'चौकोर कागज़ के चारों कोनों से बीच की ओर 3/4 दूरी तक कैंची से कट लगाएं (बीच में थोड़ा छोड़ दें)।',
        instructionEn: 'Cut from all four corners diagonally toward the center, stopping 1 inch before center.',
        icon: '✂️'
      },
      {
        stepNumber: 2,
        titleHi: 'एक-एक कोना बीच में लाएं',
        titleEn: 'Fold alternating points',
        instructionHi: 'हर कट का एक-एक कोना (वैकल्पिक) उठाकर कागज़ के बिल्कुल बीच में रखें।',
        instructionEn: 'Fold every other point into the center point without creasing the blades.',
        icon: '🌀'
      },
      {
        stepNumber: 3,
        titleHi: 'पिन से स्ट्रॉ में लगाएं',
        titleEn: 'Secure with pin to straw',
        instructionHi: 'बीच में एक आलपिन लगाएं और उसे किसी स्ट्रॉ या पेंसिल के इरेज़र में लगा दें। फिरकी तैयार है!',
        instructionEn: 'Push a pin through all points into a straw or pencil eraser. Blow gently to spin!',
        icon: '🎏'
      }
    ]
  }
];
