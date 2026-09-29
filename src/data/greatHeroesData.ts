export interface GreatHeroItem {
  id: string;
  nameHi: string;
  nameEn: string;
  childhoodNameHi: string;
  childhoodNameEn: string;
  titleBadgeHi: string;
  titleBadgeEn: string;
  eraHi: string;
  eraEn: string;
  image: string;
  heroColor: string;
  solidColor: string;
  borderClass: string;
  childhoodKeyTraitHi: string;
  childhoodKeyTraitEn: string;
  shortSummaryHi: string;
  shortSummaryEn: string;
  childhoodStoryHi: string;
  childhoodStoryEn: string;
  moralLessonHi: string;
  moralLessonEn: string;
  famousQuoteHi: string;
  famousQuoteEn: string;
  keyFacts: Array<{ titleHi: string; titleEn: string; descHi: string; descEn: string }>;
  audioSummaryHi: string;
}

export const GREAT_HEROES_LIST: GreatHeroItem[] = [
  {
    id: 'shivaji-maharaj',
    nameHi: 'छत्रपति शिवाजी महाराज',
    nameEn: 'Chhatrapati Shivaji Maharaj',
    childhoodNameHi: 'नन्हे शिवा (Shiva)',
    childhoodNameEn: 'Young Shiva',
    titleBadgeHi: '🚩 बाल वीर व स्वराज्य संस्थापक',
    titleBadgeEn: '🚩 Brave Prince of Swarajya',
    eraHi: 'शिवनेरी दुर्ग, महाराष्ट्र',
    eraEn: 'Shivneri Fort, Maharashtra',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-amber-500 to-orange-600',
    solidColor: 'bg-orange-500',
    borderClass: 'border-orange-400',
    childhoodKeyTraitHi: 'निडरता, माता का आदर और अन्याय के विरुद्ध संकल्प',
    childhoodKeyTraitEn: 'Courage, mother’s devotion, and justice',
    shortSummaryHi: 'माँ जीजाबाई से रामायण व महाभारत की वीर गाथाएँ सुनकर नन्हे शिवा ने बचपन में ही स्वराज्य स्थापित करने का संकल्प लिया था।',
    shortSummaryEn: 'Inspired by epic tales from his mother Jijabai, young Shivaji vowed to liberate his people and establish righteous rule.',
    childhoodStoryHi: `शिवाजी महाराज का जन्म शिवनेरी के किले में हुआ था। उनकी माँ जीजाबाई एक अत्यंत विदुषी और वीर महिला थीं। बचपन में वे शिवा को लोरी में रामायण, महाभारत और भगवान राम व कृष्ण की वीरता की कहानियाँ सुनाया करती थीं।

नन्हे शिवा अपने हमउम्र मावला साथियों (गाँव के बच्चों) के साथ किलों की चढ़ाई करने, तलवारबाजी और घुड़सवारी का खेल खेलते थे। जब दूसरे बच्चे सिर्फ खेल में व्यस्त रहते थे, तब शिवा सह्याद्रि की पहाड़ियों और गुप्त रास्तों का नक्शा अपने दिमाग में बैठा रहे थे।

एक बार बचपन में जब उन्होंने दरबार में एक कसाई को निर्दोष गाय को सताते देखा, तो नन्हे शिवा ने बिना किसी डर के कसाई को रोक दिया और गाय की रक्षा की। मात्र 16 वर्ष की छोटी उम्र में उन्होंने तोरणा किले पर विजय पताका फहराकर 'हिन्दवी स्वराज्य' की नींव रखी।`,
    childhoodStoryEn: `Shivaji was born at Shivneri Fort. His mother, Queen Jijabai, nurtured him with stories of valor from the Ramayana and Mahabharata. 

While ordinary children played simple games, young Shiva organized games of conquering hill forts, horse riding, and swordsmanship with his village friends (Mavalas). He learned every hill path and mountain pass like the back of his hand. 

At just 16 years of age, fueled by his mother's ideals and extraordinary leadership, young Shivaji captured the impregnable Torna Fort and laid the foundation of Swarajya (Self-Rule).`,
    moralLessonHi: 'बचपन में सीखी अच्छी बातें और माता-पिता के संस्कार जीवन में सबसे बड़े लक्ष्य को हासिल करने की शक्ति देते हैं।',
    moralLessonEn: 'Values instilled by parents in early childhood become the greatest foundation for extraordinary leadership.',
    famousQuoteHi: '"जब इरादे पक्के हों, तो पहाड़ भी रास्ता दे देते हैं!"',
    famousQuoteEn: '"When resolve is unshakable, even mountains yield a path!"',
    keyFacts: [
      {
        titleHi: 'माँ जीजाबाई का संस्कार',
        titleEn: 'Mother’s Mentorship',
        descHi: 'माँ जीजाबाई ने बचपन में ही उन्हें धर्म, न्याय और सभी धर्मों का सम्मान करना सिखाया।',
        descEn: 'Jijabai taught him righteousness, compassion, and respect for all people.',
      },
      {
        titleHi: '16 की उम्र में पहला किला',
        titleEn: 'First Fort at 16',
        descHi: 'मात्र 16 साल की उम्र में तोरणा किला जीतकर स्वराज्य का बिगुल फूंका।',
        descEn: 'Captured Torna fort at age 16 with pure strategy and trusted childhood friends.',
      },
    ],
    audioSummaryHi: 'छत्रपति शिवाजी महाराज ने बचपन में माँ जीजाबाई से वीरता के संस्कार सीखे और सोलह वर्ष की उम्र में तोरणा किला जीता।',
  },
  {
    id: 'apj-abdul-kalam',
    nameHi: 'डॉ. ए. पी. जे. अब्दुल कलाम',
    nameEn: 'Dr. A. P. J. Abdul Kalam',
    childhoodNameHi: 'नन्हे कलाम (Young Kalam)',
    childhoodNameEn: 'Young Kalam',
    titleBadgeHi: '🚀 मिसाइल मैन व जनता के राष्ट्रपति',
    titleBadgeEn: '🚀 Missile Man of India',
    eraHi: 'रामेश्वरम, तमिलनाडु',
    eraEn: 'Rameswaram, Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-blue-600 to-cyan-600',
    solidColor: 'bg-blue-600',
    borderClass: 'border-blue-400',
    childhoodKeyTraitHi: 'कड़ा परिश्रम, पढ़ाई के प्रति लगन और सादगी',
    childhoodKeyTraitEn: 'Hard work, curiosity, and immense humility',
    shortSummaryHi: 'रामेश्वरम में अखबार बांटने से लेकर भारत के सबसे बड़े वैज्ञानिक और राष्ट्रपति बनने तक का चमत्कारी प्रेरणादायक सफर।',
    shortSummaryEn: 'From distributing newspapers at dawn in Rameswaram to becoming India’s Missile Man and beloved President.',
    childhoodStoryHi: `अब्दुल कलाम का जन्म रामेश्वरम के एक साधारण नाविक परिवार में हुआ था। घर की आर्थिक स्थिति तंग थी, इसलिए नन्हे कलाम सुबह 4 बजे उठकर पहले गणित की ट्यूशन जाते, फिर रेलवे स्टेशन जाकर अखबार के बंडल लाते और रामेश्वरम की गलियों में घर-घर अखबार बांटते थे। 

इसके बाद वे स्कूल जाते और शाम को पढ़ाई करते थे। एक दिन स्कूल में उनके शिक्षक श्री शिवसुब्रमण्यम अय्यर ने बोर्ड पर पक्षी के उड़ने का चित्र बनाया, लेकिन बच्चों को समझ नहीं आया। तब वे सभी बच्चों को समुद्र किनारे ले गए जहाँ उड़ते हुए सीगल पक्षियों को देखकर नन्हे कलाम के दिल में उड़ान भरने और वैज्ञानिक बनने का सपना जाग उठा।

कलाम साहब ने कभी गरीबी को अपनी पढ़ाई के रास्ते में नहीं आने दिया। उन्होंने भारत को परमाणु शक्ति और अंतरिक्ष में मिसाइलें देकर दुनिया में सिरमौर बनाया और अंत तक बच्चों के प्यारे शिक्षक बने रहे।`,
    childhoodStoryEn: `Born into a humble family in Rameswaram, young Kalam woke up at 4 AM every day. He collected fresh newspaper bundles from the train and delivered them across town to fund his education before going to school.

One day, his science teacher took the class to the seashore to show how seagulls fly using lift and tail control. That live demonstration sparked Kalam’s lifelong passion for flight and aeronautics.

He never let poverty limit his vision. He went on to build India's space launch vehicles, missiles, and became the People's President.`,
    moralLessonHi: 'सपने वे नहीं होते जो हम सोते हुए देखते हैं, सपने वो होते हैं जो हमें सोने नहीं देते!',
    moralLessonEn: 'Dreams are not what you see in sleep, dreams are what do not let you sleep!',
    famousQuoteHi: '"यदि आप सूरज की तरह चमकना चाहते हैं, तो पहले सूरज की तरह जलना सीखिए।"',
    famousQuoteEn: '"If you want to shine like a sun, first burn like a sun."',
    keyFacts: [
      {
        titleHi: 'सुबह का अखबार वितरक',
        titleEn: 'Early Morning Paper Boy',
        descHi: 'पढ़ाई की फीस जुटाने के लिए वे बचपन में रोज़ अखबार बांटते थे।',
        descEn: 'Delivered newspapers early morning to support his school fees.',
      },
      {
        titleHi: 'पक्षियों से मिली वैज्ञानिक प्रेरणा',
        titleEn: 'Inspired by Birds',
        descHi: 'समुद्र तट पर पक्षियों की उड़ान देखकर विमान और रॉकेट बनाने का सपना देखा।',
        descEn: 'Watching shore birds fly inspired him to pursue aeronautical engineering.',
      },
    ],
    audioSummaryHi: 'डॉ. अब्दुल कलाम बचपन में अखबार बांटते थे और पक्षियों को देखकर वैज्ञानिक बनने का सपना देखा था।',
  },
  {
    id: 'swami-vivekananda',
    nameHi: 'स्वामी विवेकानंद',
    nameEn: 'Swami Vivekananda',
    childhoodNameHi: 'नन्हे नरेंद्र (Naren)',
    childhoodNameEn: 'Little Naren',
    titleBadgeHi: '⚡ प्रखर तेजस्वी बाल सन्यासी व युगदृष्टा',
    titleBadgeEn: '⚡ Fearless Youth Icon',
    eraHi: 'कोलकाता, पश्चिम बंगाल',
    eraEn: 'Kolkata, West Bengal',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-amber-600 to-rose-600',
    solidColor: 'bg-amber-600',
    borderClass: 'border-amber-400',
    childhoodKeyTraitHi: 'निडरता, गहरा ध्यान और जिज्ञासु वैज्ञानिक सोच',
    childhoodKeyTraitEn: 'Fearlessness, deep meditation, and truth seeking',
    shortSummaryHi: 'बचपन में चंपा के पेड़ पर भूतों के डर को गलत साबित करने वाले और गहरी समाधि लगाने वाले नन्हे नरेंद्र की कहानी।',
    shortSummaryEn: 'Fearless young Naren tested superstitious myths himself and possessed an extraordinary photographic memory.',
    childhoodStoryHi: `स्वामी विवेकानंद के बचपन का नाम नरेंद्रनाथ दत्त था। नन्हे नरेंद्र बचपन से ही बहुत नटखट लेकिन अत्यंत दयालु और निडर थे। 

एक बार उनके दोस्त के दादाजी ने बच्चों को चंपा के पेड़ पर चढ़ने से रोकने के लिए कहा कि 'पेड़ पर ब्रह्मराक्षस (भूत) रहता है, जो बच्चों को खा जाता है।' सभी बच्चे डरकर भाग गए, लेकिन नन्हे नरेंद्र चुपचाप पेड़ पर चढ़कर डालियों पर झूलने लगे। जब दोस्तों ने पूछा तो उन्होंने हँसकर कहा—'अगर दादाजी की बात सच होती, तो राक्षस मुझे कब का खा चुका होता! बिना खुद परखे किसी डर पर विश्वास मत करो।'

नरेंद्र बचपन से ही आँखें बंद करके घंटों ध्यान में बैठ जाते थे। वे किसी भी किताब को एक बार पढ़कर पूरा याद कर लेते थे। आगे चलकर उन्होंने शिकागो में 'मेरे अमेरिकी भाइयों और बहनों' कहकर भारत की सनातन संस्कृति का डंका पूरे विश्व में बजाया।`,
    childhoodStoryEn: `Known as Narendranath in his childhood, little Naren was full of boundless energy, fearlessness, and compassion. 

When a neighbor told the boys that a ghost lived in the Champak tree to scare them away, all friends fled. But Naren climbed right to the top branch! He smiled and said: 'If the ghost were real, my neck would have been broken by now. Never believe superstition without finding the truth yourself.'

Naren also loved deep meditation from early childhood and possessed astonishing focus. Later, he inspired millions worldwide with Indian spiritual wisdom.`,
    moralLessonHi: 'अंधविश्वास और डर से दूर रहो; सच्चाई और आत्मविश्वास के साथ हमेशा आगे बढ़ो।',
    moralLessonEn: 'Never succumb to superstition or blind fear; always seek truth with confidence and reason.',
    famousQuoteHi: '"उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए!"',
    famousQuoteEn: '"Arise, awake, and stop not till the goal is reached!"',
    keyFacts: [
      {
        titleHi: 'निडर तार्किक बुद्धि',
        titleEn: 'Logical Fearlessness',
        descHi: 'बचपन में किसी भी बात को बिना तर्क और जांच के स्वीकार नहीं करते थे।',
        descEn: 'Questioned blind beliefs and insisted on direct truth and logic.',
      },
      {
        titleHi: 'अद्भुत एकाग्रता व ध्यान',
        titleEn: 'Photographic Memory',
        descHi: 'बचपन में ध्यान लगाने में इतने मग्न हो जाते थे कि पास से सांप गुजरने पर भी नहीं हिलते थे।',
        descEn: 'His concentration in meditation was so deep he remained completely unflinching.',
      },
    ],
    audioSummaryHi: 'स्वामी विवेकानंद बचपन में नन्हे नरेंद्र कहलाते थे और किसी भी अंधविश्वास से नहीं डरते थे।',
  },
  {
    id: 'rani-lakshmibai',
    nameHi: 'रानी लक्ष्मीबाई',
    nameEn: 'Rani Lakshmibai of Jhansi',
    childhoodNameHi: 'मनु बाई (Chhabili Manu)',
    childhoodNameEn: 'Young Manu',
    titleBadgeHi: '⚔️ वीरांगना व स्वतंत्रता सेनानी',
    titleBadgeEn: '⚔️ Warrior Queen of Jhansi',
    eraHi: 'वाराणसी व बिठूर',
    eraEn: 'Varanasi & Bithoor',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-rose-600 to-red-700',
    solidColor: 'bg-rose-600',
    borderClass: 'border-rose-400',
    childhoodKeyTraitHi: 'घुड़सवारी, अस्त्र-शस्त्र में निपुणता और असीम साहस',
    childhoodKeyTraitEn: 'Horse riding, martial arts, and iron will',
    shortSummaryHi: 'बचपन में गुड़ियों की जगह तलवार, धनुष और घोड़ों से खेलने वाली नटखट छबीली मनु की वीरता की दास्तान।',
    shortSummaryEn: 'Young Manu practiced sword fighting and horse riding alongside boys, defying conventional limits.',
    childhoodStoryHi: `रानी लक्ष्मीबाई के बचपन का नाम मणिकर्णिका (मनु) था। उनका बचपन बिठूर में पेशवा बाजीराव के संरक्षण में बीता। पेशवा उन्हें प्यार से 'छबीली' कहते थे। 

जब उस ज़माने में लड़कियाँ केवल घर के काम करती थीं, तब मनु अपने भाई नाना साहेब और तात्या टोपे के साथ मलखंब, तीरंदाजी, तलवारबाजी और घुड़सवारी का अभ्यास करती थीं। वे हवा की रफ्तार से दौड़ते घोड़े की लगाम अपने मुँह में दबाकर दोनों हाथों से तलवार चलाने में माहिर थीं।

एक बार जब नाना साहेब ने उन्हें हाथी की सवारी कराने से मना कर दिया, तो नन्ही मनु ने गर्व से कहा—'मेरे भाग्य में एक नहीं, दस-दस हाथी लिखे हैं!' आगे चलकर उन्होंने 1857 के प्रथम स्वतंत्रता संग्राम में अंग्रेजों के छक्के छुड़ा दिए और अमर वीरांगना बनीं।`,
    childhoodStoryEn: `Born as Manikarnika and affectionately called Manu or Chhabili, she grew up in Bithoor. 

Instead of traditional pastime toys, Manu trained alongside Nana Saheb and Tatya Tope in swordsmanship, gymnastics (Malkhamb), and archery. She became an elite horsewoman capable of controlling galloping horses while wielding two swords.

When teased as a girl, young Manu declared: 'Destiny has ten elephants written in my name, not just one!' She proved it by leading the 1857 war of independence against colonial rule.`,
    moralLessonHi: 'लड़कियाँ किसी से कम नहीं होतीं; साहस, आत्मरक्षा और विद्या से बेटियाँ इतिहास रच सकती हैं।',
    moralLessonEn: 'Bravery has no gender; with self-belief and rigorous training, girls can conquer the world.',
    famousQuoteHi: '"मैं अपनी झाँसी कभी नहीं दूँगी!"',
    famousQuoteEn: '"I shall never surrender my Jhansi!"',
    keyFacts: [
      {
        titleHi: 'दोनों हाथों से तलवारबाजी',
        titleEn: 'Dual-Sword Mastery',
        descHi: 'बचपन में ही दोनों हाथों से तलवार चलाने और अचूक निशानेबाजी में निपुण हो गई थीं।',
        descEn: 'Mastered dual sword fighting while riding horses at full gallop.',
      },
      {
        titleHi: 'आत्मविश्वास की प्रतिमूर्ति',
        titleEn: 'Unyielding Confidence',
        descHi: 'बचपन में किसी भी बाधा या संकट के आगे कभी हार नहीं मानी।',
        descEn: 'Turned every childhood challenge into an opportunity for strength.',
      },
    ],
    audioSummaryHi: 'रानी लक्ष्मीबाई बचपन में मनु कहलाती थीं और घुड़सवारी व तलवारबाजी में सबसे आगे थीं।',
  },
  {
    id: 'mahatma-gandhi',
    nameHi: 'महात्मा गांधी',
    nameEn: 'Mahatma Gandhi',
    childhoodNameHi: 'नन्हे मोहनदास (Moniya)',
    childhoodNameEn: 'Young Moniya',
    titleBadgeHi: '🕊️ राष्ट्रपिता व सत्य-अहिंसा के पुजारी',
    titleBadgeEn: '🕊️ Father of the Nation',
    eraHi: 'पोरबंदर, गुजरात',
    eraEn: 'Porbandar, Gujarat',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-emerald-600 to-teal-700',
    solidColor: 'bg-emerald-600',
    borderClass: 'border-emerald-400',
    childhoodKeyTraitHi: 'सत्य बोलना, गलती स्वीकारना और विनम्रता',
    childhoodKeyTraitEn: 'Truthfulness, admitting mistakes, and gentle empathy',
    shortSummaryHi: 'राजा हरिश्चंद्र का नाटक देखकर जीवन भर सत्य बोलने का अटल संकल्प लेने वाले नन्हे मोहन की कहानी।',
    shortSummaryEn: 'How seeing the play of King Harishchandra inspired young Mohandas to commit to lifelong truth.',
    childhoodStoryHi: `महात्मा गांधी का बचपन पोरबंदर में बीता। उनके घर वाले उन्हें प्यार से 'मोनिया' बुलाते थे। बचपन में मोहन बहुत शर्मीले स्वभाव के थे और स्कूल की घंटी बजते ही सीधे घर भाग आते थे ताकि किसी से फालतू बातें न करनी पड़ें।

बचपन में उन्होंने 'सत्यवादी राजा हरिश्चंद्र' और 'श्रवण कुमार' का नाटक देखा। हरिश्चंद्र के सत्य की राह पर चलने के कष्टों को देखकर नन्हे मोहन के मन में विचार आया—'सभी लोग हरिश्चंद्र की तरह सत्यवादी क्यों नहीं बन सकते?' उन्होंने उसी दिन तय किया कि चाहे कुछ भी हो जाए, वे जीवन भर कभी झूठ नहीं बोलेंगे।

एक बार बचपन में भाई का कर्ज चुकाने के लिए उन्होंने सोने के कड़े का एक छोटा टुकड़ा चुरा लिया था। लेकिन उनका मन इतना व्याकुल हुआ कि उन्होंने एक पत्र लिखकर अपने पिताजी के सामने अपनी गलती कबूल कर ली और रो पड़े। पिताजी ने उन्हें गले से लगा लिया। मोहन ने सीखा कि गलती स्वीकारना ही सच्ची बहादुरी है।`,
    childhoodStoryEn: `Growing up in Porbandar, young Mohandas was extremely shy. He rushed straight home after school to avoid idle chatter.

Watching the drama of King Harishchandra deeply stirred his young conscience. He asked himself: 'Why shouldn't everyone follow truth like Harishchandra?' That day he resolved never to utter a falsehood.

Once, feeling guilty after taking a tiny piece of gold to pay a debt, he wrote a heartfelt confession letter to his ill father, ready for any punishment. His father wept tears of love and forgave him. Mohandas learned that honest confession is the highest courage.`,
    moralLessonHi: 'गलती हर इंसान से होती है, लेकिन अपनी गलती को सच-सच मान लेना और माफी मांगना सबसे बड़ा गुण है।',
    moralLessonEn: 'Making a mistake is human, but confessing it with complete honesty is true nobility.',
    famousQuoteHi: '"सत्य ही ईश्वर है और अहिंसा ही सबसे बड़ा धर्म है।"',
    famousQuoteEn: '"Truth is God and non-violence is the supreme virtue."',
    keyFacts: [
      {
        titleHi: 'सत्यवादी हरिश्चंद्र का प्रभाव',
        titleEn: 'Harishchandra’s Impact',
        descHi: 'नाटक देखकर हमेशा सच बोलने का आजीवन नियम बना लिया।',
        descEn: 'Vowed lifelong honesty after watching the moral play of King Harishchandra.',
      },
      {
        titleHi: 'पिताजी से सच्ची माफी',
        titleEn: 'Honest Confession',
        descHi: 'गलती होने पर कभी छुपाया नहीं, बल्कि पत्र लिखकर सच बताया।',
        descEn: 'Wrote a confession note to his father rather than hiding his wrongdoing.',
      },
    ],
    audioSummaryHi: 'महात्मा गांधी बचपन में शर्मीले थे और राजा हरिश्चंद्र से प्रेरित होकर हमेशा सच बोलते थे।',
  },
  {
    id: 'bhagat-singh',
    nameHi: 'शहीद भगत सिंह',
    nameEn: 'Shaheed Bhagat Singh',
    childhoodNameHi: 'नन्हे भागनवाला (Bhaga)',
    childhoodNameEn: 'Young Bhaga',
    titleBadgeHi: '🇮🇳 अमर शहीद व क्रांतिदूत',
    titleBadgeEn: '🇮🇳 Immortal Freedom Fighter',
    eraHi: 'बंगा गाँव, लायलपुर (पंजाब)',
    eraEn: 'Banga, Punjab',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-red-600 to-amber-600',
    solidColor: 'bg-red-600',
    borderClass: 'border-red-400',
    childhoodKeyTraitHi: 'असीम देशभक्ति, किताबों से प्यार और क्रांतिकारी सोच',
    childhoodKeyTraitEn: 'Fierce patriotism, love for books, and fearless vision',
    shortSummaryHi: 'बचपन में खेत में "बंदूकें बोने" की बात करने वाले और जलियांवाला बाग की मिट्टी को माथे पर लगाने वाले भगत सिंह की गाथा।',
    shortSummaryEn: 'How young Bhagat Singh dreamed of planting guns to liberate his motherland from colonial tyranny.',
    childhoodStoryHi: `भगत सिंह का जन्म देशभक्तों के परिवार में हुआ था। जब वे मात्र तीन वर्ष के थे, तो अपने पिता सरदार किशन सिंह के साथ खेत में गए। जब पिताजी ने गेहूँ के बीज बोए, तो नन्हे भगत ने छोटी-छोटी लकड़ियों को मिट्टी में गाड़ना शुरू कर दिया। 

पिताजी ने हँसकर पूछा—'बेटा, यह क्या कर रहे हो?' नन्हे भगत ने मासूमियत से जवाब दिया—'बापूजी, मैं खेत में बंदूकें बो रहा हूँ, जिससे ढेर सारी बंदूकें उगेंगी और हम अंग्रेजों को अपने देश से भगा देंगे!' यह सुनकर सभी दंग रह गए।

12 वर्ष की उम्र में जब जलियांवाला बाग का नरसंहार हुआ, तो नन्हा भगत स्कूल छोड़कर कई मील पैदल चलकर वहाँ पहुँचा। उन्होंने खून से सनी मिट्टी को एक शीशी में भरा और रोज सुबह उस मिट्टी का तिलक लगाकर देश को आजाद कराने की प्रतिज्ञा लेते थे।`,
    childhoodStoryEn: `At just three years old, young Bhagat went to the farm with his father. While his father sowed wheat seeds, little Bhagat began planting dry twigs into the soil.

When his father asked what he was doing, little Bhagat replied with fiery innocence: 'Father, I am planting guns so that thousands of rifles will grow to free our motherland!'

At age 12, shaken by the Jallianwala Bagh massacre, he walked miles alone to the site, collected the blood-soaked sacred soil in a glass vial, and took a daily vow to liberate India.`,
    moralLessonHi: 'मातृभूमि के प्रति प्रेम और निःस्वार्थ सेवा ही जीवन का सबसे पावन कर्तव्य है।',
    moralLessonEn: 'Love for one’s nation and selfless dedication to human dignity are the highest callings.',
    famousQuoteHi: '"इंकलाब जिंदाबाद! क्रांति की तलवार विचारों की सान पर तेज होती है।"',
    famousQuoteEn: '"Inquilab Zindabad! Long Live the Revolution!"',
    keyFacts: [
      {
        titleHi: 'खेत में बंदूकें बोना',
        titleEn: 'Planting Freedom',
        descHi: '3 साल की उम्र में देश को आजाद कराने की अनोखी सोच दिखाई।',
        descEn: 'Expressed his desire for freedom at just three years old.',
      },
      {
        titleHi: 'जलियांवाला बाग की मिट्टी',
        titleEn: 'Sacred Soil of Freedom',
        descHi: 'शहीदों के खून से सनी मिट्टी को शीशी में भरकर रोज तिलक लगाते थे।',
        descEn: 'Kept blood-soaked soil as a sacred reminder of his mission.',
      },
    ],
    audioSummaryHi: 'शहीद भगत सिंह ने बचपन में ही देश की आजादी के लिए जीवन समर्पित करने की शपथ ली थी।',
  },
  {
    id: 'kalpana-chawla',
    nameHi: 'कल्पना चावला',
    nameEn: 'Kalpana Chawla',
    childhoodNameHi: 'नन्ही मोंटू (Monto)',
    childhoodNameEn: 'Young Monto',
    titleBadgeHi: '🚀 अंतरिक्ष की पहली भारतीय बेटी',
    titleBadgeEn: '🚀 First Indian-Born Woman in Space',
    eraHi: 'करनाल, हरियाणा',
    eraEn: 'Karnal, Haryana',
    image: 'https://images.unsplash.com/photo-1517976487507-59a5d11bd295?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-indigo-600 to-purple-600',
    solidColor: 'bg-indigo-600',
    borderClass: 'border-indigo-400',
    childhoodKeyTraitHi: 'सपनों पर विश्वास, गणित-विज्ञान में रुचि और असीम जिज्ञासा',
    childhoodKeyTraitEn: 'Curiosity, stellar imagination, and determination',
    shortSummaryHi: 'करनाल की छत पर लेटकर तारों को निहारने वाली और कागज़ के हवाई जहाज़ उड़ाने वाली नन्ही मोंटू की अंतरिक्ष यात्रा।',
    shortSummaryEn: 'From gazing at stars on warm summer nights in Karnal to soaring beyond Earth aboard NASA’s Space Shuttle.',
    childhoodStoryHi: `कल्पना चावला का जन्म हरियाणा के छोटे से शहर करनाल में हुआ था। घर में सब उन्हें प्यार से 'मोंटू' बुलाते थे। गर्मियों की रातों में जब पूरा परिवार छत पर सोता था, तब नन्ही कल्पना सोती नहीं थी बल्कि टकटकी लगाकर चमकते तारों को देखती रहती थी।

वह ड्राइंग क्लास में फूल और बगीचों की जगह हमेशा हवाई जहाज, रॉकेट और अंतरिक्ष के चित्र बनाती थी। करनाल फ्लाइंग क्लब में जब विमान उड़ते थे, तो वह दौड़ी चली जाती थी और सोचती थी—'एक दिन मैं इन बादलों के पार तारों को छूऊँगी।'

उस समय जब लड़कियों को इंजीनियरिंग नहीं कराई जाती थी, कल्पना ने एरोनॉटिकल इंजीनियरिंग चुनी और नासा (NASA) की अंतरिक्ष यात्री बनकर इतिहास के पन्नों में अपना नाम अमर कर दिया।`,
    childhoodStoryEn: `Growing up in Karnal, young Kalpana (fondly called Monto) spent summer nights sleeping under open skies, fascinated by the twinkling constellations.

In art class, while others drew landscapes, Kalpana drew planes, stars, and space shuttles. She visited the local flying club to watch small airplanes take off.

Defying the expectations of her era, she pursued aeronautical engineering, moved to NASA, and flew twice aboard the Space Shuttle Columbia.`,
    moralLessonHi: 'रास्ते में कितनी भी बाधाएँ आएं, अगर आपके सपने सच्चे हैं तो पूरा ब्रह्मांड आपका रास्ता बनाएगा।',
    moralLessonEn: 'The path from dreams to success does exist. You only need the courage to get on it.',
    famousQuoteHi: '"मैं अंतरिक्ष के लिए ही बनी हूँ और इसी के लिए जिऊँगी।"',
    famousQuoteEn: '"I was made for space and I will live for it."',
    keyFacts: [
      {
        titleHi: 'छत पर तारों को देखना',
        titleEn: 'Star Gazer',
        descHi: 'बचपन में रात भर आसमान के तारों को निहारकर अंतरिक्ष में जाने का सपना देखा।',
        descEn: 'Gazed at the night sky in Karnal dreaming of touching distant stars.',
      },
      {
        titleHi: 'रॉकेट और विमान की ड्राइंग',
        titleEn: 'Aviation Art',
        descHi: 'ड्राइंग में केवल उड़ते हुए विमान और बादलों के चित्र बनाती थीं।',
        descEn: 'Fascinated by flying machines and aeronautics from grade school.',
      },
    ],
    audioSummaryHi: 'कल्पना चावला बचपन में छत से तारों को देखकर अंतरिक्ष में जाने का सपना बुनती थीं।',
  },
  {
    id: 'dr-ambedkar',
    nameHi: 'डॉ. भीमराव आंबेडकर',
    nameEn: 'Dr. B. R. Ambedkar',
    childhoodNameHi: 'नन्हे भीवा (Bhiwa)',
    childhoodNameEn: 'Young Bhiwa',
    titleBadgeHi: '📜 संविधान निर्माता व ज्ञान के महासागर',
    titleBadgeEn: '📜 Architect of Indian Constitution',
    eraHi: 'महू, मध्य प्रदेश व सतारा',
    eraEn: 'Mhow & Satara',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    heroColor: 'from-blue-700 to-indigo-800',
    solidColor: 'bg-blue-700',
    borderClass: 'border-blue-500',
    childhoodKeyTraitHi: 'कठिनाइयों में भी पढ़ाई की तपस्या, समानता और ज्ञान की प्यास',
    childhoodKeyTraitEn: 'Relentless thirst for knowledge, grit, and equality',
    shortSummaryHi: 'भेदभाव और गरीबी के बावजूद क्लास के बाहर बैठकर पढ़ने वाले और दुनिया के सबसे बड़े संविधान के निर्माता बनने की गौरव गाथा।',
    shortSummaryEn: 'Overcoming deep discrimination to become the chief architect of the Indian Constitution and symbol of knowledge.',
    childhoodStoryHi: `बाबासाहेब आंबेडकर के बचपन का नाम भीमराव (भीवा) था। उनके पिता सूबेदार रामजी सकपाल थे। बचपन में जब वे स्कूल जाते थे, तो समाज में फैले भेदभाव के कारण उन्हें कक्षा के अंदर बैठने की इजाजत नहीं थी। उन्हें अपनी खुद की बोरी (टाट) घर से लेकर कक्षा के बाहर दरवाजे के पास बैठना पड़ता था।

उन्हें नल का पानी छूने की मनाही थी, जब स्कूल का चपरासी ऊपर से पानी डालता तभी वे पी सकते थे। लेकिन नन्हे भीवा ने इन अपमानों से हिम्मत नहीं हारी। उन्होंने तय किया कि 'शिक्षा ही वह शेरनी का दूध है जो पिएगा वह दहाड़ेगा!'

वे रात-रात भर लैंप की रोशनी में पढ़ाई करते रहे। उन्होंने कोलंबिया यूनिवर्सिटी और लंदन स्कूल ऑफ इकोनॉमिक्स से डॉक्टरेट की डिग्रियां हासिल कीं और स्वतंत्र भारत के पहले कानून मंत्री व संविधान के मुख्य शिल्पकार बने।`,
    childhoodStoryEn: `Born in Mhow, young Bhimrao (affectionately Bhiwa) faced harsh social discrimination. In school, he was not allowed to sit inside the classroom and had to bring his own gunny sack to sit by the doorway.

He was not permitted to touch the water vessel; water was poured from above by the peon. Despite these painful injustices, young Bhimrao resolved that education was his greatest weapon for equality.

He studied tirelessly under street lamps, went on to earn multiple doctorates from world-renowned universities, and drafted the Constitution of India guaranteeing dignity for all citizens.`,
    moralLessonHi: 'शिक्षा दुनिया का सबसे शक्तिशाली हथियार है, जिससे किसी भी अन्याय और गरीबी को मिटाया जा सकता है।',
    moralLessonEn: 'Education is the supreme tool of empowerment to triumph over every adversity.',
    famousQuoteHi: '"शिक्षित बनो, संगठित रहो और संघर्ष करो!"',
    famousQuoteEn: '"Educate, Agitate, Organise!"',
    keyFacts: [
      {
        titleHi: 'पढ़ाई की अटूट लगन',
        titleEn: 'Relentless Scholarship',
        descHi: 'कक्षा के बाहर बैठकर भी सबसे अव्वल दर्जे की लगन से पढ़ाई की।',
        descEn: 'Mastered lessons even while forced to sit outside the classroom door.',
      },
      {
        titleHi: 'ज्ञान से रचा इतिहास',
        titleEn: 'Constitution Maker',
        descHi: 'दुनिया के सबसे बड़े लोकतांत्रिक संविधान का निर्माण किया।',
        descEn: 'Wrote the Constitution of India guaranteeing justice, liberty, and equality.',
      },
    ],
    audioSummaryHi: 'डॉ. भीमराव आंबेडकर ने बचपन की कठिनाइयों को हराकर शिक्षा के बल पर भारत का संविधान रचा।',
  },
];
