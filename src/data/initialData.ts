import { Story, FunFact, LearningItem, AudioStory, VideoStory } from '../types';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    number: 1,
    titleHi: 'सच्ची दोस्ती',
    titleEn: 'Sachchi Dosti (True Friendship)',
    summaryHi: 'जंगल के रास्ते में जब भालू आया, तो रोहन और सोहन ने जाना कि सच्चा दोस्त कौन होता है।',
    summaryEn: 'When a bear appeared on the forest path, Rohan and Sohan learned the true meaning of friendship.',
    contentHi: `एक छोटे से सुंदर गाँव में रोहन और सोहन नाम के दो गहरे दोस्त रहते थे। वे दोनों बचपन से साथ खेलते, साथ पढ़ते और हर सुख-दुख बाँटते थे। 

एक दिन दोनों गाँव के पास वाले घने जंगल से गुजर रहे थे। पक्षी चहचहा रहे थे और ठंडी हवा बह रही थी। अचानक झाड़ियों में से एक बड़ा सा काला भालू बाहर निकल आया!

सोहन बहुत घबरा गया। वह बिना कुछ सोचे-समझे पास के एक ऊँचे पेड़ पर चढ़ गया। उसने अपने दोस्त रोहन की बिल्कुल परवाह नहीं की। रोहन को पेड़ पर चढ़ना नहीं आता था।

रोहन ने अपनी दादी की एक बात याद की कि भालू मरे हुए इंसानों को नुकसान नहीं पहुँचाता। रोहन तुरंत जमीन पर लेट गया और अपनी साँसें रोक लीं।

भालू पास आया, उसने रोहन के कानों और चेहरे को सूंघा। रोहन बिल्कुल स्थिर रहा। भालू ने समझा कि यह मरा हुआ है, और वह चुपचाप जंगल में चला गया।

जब भालू चला गया, तो सोहन पेड़ से नीचे उतरा और हँसते हुए पूछा, "दोस्त! भालू तुम्हारे कान में क्या फुसफुसा रहा था?"

रोहन ने मुस्कुराते हुए कहा, "भालू ने मुझसे कहा कि जो मुसीबत के समय अपने दोस्त का साथ छोड़ दे, उससे कभी दोस्ती मत करना!" यह सुनकर सोहन का सिर शर्म से झुक गया।`,
    contentEn: `In a charming village lived two best friends named Rohan and Sohan. They did everything together since childhood.

One afternoon, while walking through the nearby forest, a huge black bear suddenly emerged from behind the bushes!

Panicking, Sohan quickly climbed up a tall tree without thinking about Rohan. Rohan didn't know how to climb trees.

Remembering a wise trick his grandmother had told him—that bears seldom touch creatures they believe are motionless or lifeless—Rohan calmly lay down on the ground and held his breath.

The bear stepped closer, sniffed around Rohan's ears and nose. Rohan stayed utterly still. Convinced there was no movement, the bear gently ambled back into the woods.

After the coast was clear, Sohan scrambled down from the tree and asked jokingly, "What secret was the bear whispering in your ear, my friend?"

Rohan looked at him calmly and replied, "The bear whispered: Never trust someone who runs away and leaves their friend behind in times of trouble." Sohan lowered his head in regret and apologized from his heart.`,
    moralHi: 'सच्चा दोस्त वही होता है जो मुसीबत की घड़ी में आपका साथ निभाए।',
    moralEn: 'A friend in need is a friend indeed.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 342,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's1-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=700&auto=format&fit=crop&q=80',
        textHi: 'एक छोटे से सुंदर गाँव में रोहन और सोहन नाम के दो गहरे दोस्त रहते थे। वे दोनों बचपन से साथ खेलते, साथ पढ़ते और हर सुख-दुख बाँटते थे।',
        textEn: 'In a charming village lived two best friends named Rohan and Sohan. They did everything together since childhood.',
        captionHi: 'दृश्य 1: रोहन और सोहन की पक्की दोस्ती',
      },
      {
        id: 's1-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&auto=format&fit=crop&q=80',
        textHi: 'एक दिन दोनों गाँव के पास वाले घने जंगल से गुजर रहे थे। अचानक झाड़ियों में से एक बड़ा सा काला भालू बाहर निकल आया!',
        textEn: 'One afternoon, while walking through the nearby forest, a huge black bear suddenly emerged from behind the bushes!',
        captionHi: 'दृश्य 2: घने जंगल में अचानक भालू का आगमन',
      },
      {
        id: 's1-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?w=700&auto=format&fit=crop&q=80',
        textHi: 'सोहन घबरा गया और तुरंत पास के एक ऊँचे पेड़ पर चढ़ गया। रोहन को पेड़ पर चढ़ना नहीं आता था, इसलिए वह जमीन पर लेट गया और अपनी साँसें रोक लीं।',
        textEn: 'Sohan panicked and climbed a tree. Rohan could not climb, so he calmly lay down on the ground and held his breath.',
        captionHi: 'दृश्य 3: सोहन पेड़ पर चढ़ा और रोहन ने समझदारी दिखाई',
      },
      {
        id: 's1-scene-4',
        sceneNumber: 4,
        image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=700&auto=format&fit=crop&q=80',
        textHi: 'भालू रोहन के पास आया और उसके चेहरे को सूंघा। रोहन बिल्कुल शांत रहा। भालू ने उसे निर्जीव समझा और चुपचाप आगे चला गया।',
        textEn: 'The bear approached and sniffed Rohan. Rohan stayed utterly still. Convinced he was harmless, the bear ambled away.',
        captionHi: 'दृश्य 4: भालू रोहन को सूंघकर आगे निकल गया',
      },
      {
        id: 's1-scene-5',
        sceneNumber: 5,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80',
        textHi: 'रोहन ने सोहन को समझाया—"सच्चा दोस्त वही होता है जो विपत्ति और संकट में साथ न छोड़े!" सोहन को अपनी गलती का गहरा एहसास हुआ।',
        textEn: 'Rohan reminded Sohan—"A true friend is one who stands by you in times of trouble!" Sohan learned a lifelong lesson.',
        captionHi: 'दृश्य 5: सच्ची मित्रता का अनमोल पाठ',
      }
    ],
    illustrations: [
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'story-2',
    number: 2,
    titleHi: 'किसान की मजबूरी और अकलमंदी',
    titleEn: 'Kisan ki Majboori (The Wise Farmer)',
    summaryHi: 'एक गरीब किसान ने अपनी सूझबूझ और ईमानदारी से लालची साहूकार को सबक सिखाया।',
    summaryEn: 'A humble farmer uses quick wit and patience to overcome an unjust challenge and secure his harvest.',
    contentHi: `रामनगर गाँव में रामू नाम का एक सीधा-साधा किसान रहता था। वह दिन-रात अपने छोटे से खेत में पसीना बहाता था। 

एक वर्ष बारिश बहुत कम हुई, जिससे फसल कमजोर हो गई। रामू के पास अपने बच्चों को खिलाने और खेत के बीज खरीदने के लिए पैसे नहीं बचे थे। मजबूर होकर वह गाँव के लालची सेठ धनीराम के पास गया।

सेठ ने रामू को कर्ज तो दिया, लेकिन शर्त रखी कि अगर वह अगली फसल पर दोगुना अनाज न लौटा सका, तो उसका खेत सेठ का हो जाएगा।

रामू ने हिम्मत नहीं हारी। उसने दिन-रात मेहनत की, कुएं से बाल्टियों से पानी सींचा और जैविक खाद बनाई। भगवान की कृपा से इस बार मक्का और गेहूं की शानदार फसल हुई।

जब फसल कटने का समय आया, तो लालची सेठ खेत पर पहुँच गया और बेईमानी करने लगा। उसने कहा, "जमीन के ऊपर जो भी उगा है वह मेरा, और जमीन के नीचे का तुम्हारा!"

रामू मुस्कुराया, क्योंकि उसने इस बार खेत में आलू, गाजर और मूंगफली बोई थी! रामू ने जमीन के अंदर की भरपूर फसल निकाल ली और सेठ को ऊपर के सूखे पत्ते पकड़ा दिए।

सेठ भौंचक्का रह गया। रामू ने कर्ज का पूरा पैसा चुका दिया और अपनी सूझबूझ से अपना खेत बचा लिया।`,
    contentEn: `In a peaceful village lived Ramu, an honest and hardworking farmer who cherished his little patch of fertile land.

One harsh summer, the monsoon failed. With empty grain bins, Ramu was forced to borrow money from the wealthy, cunning moneylender Dhaniram.

Dhaniram gave him the loan on an unfair condition, hoping to take over Ramu's beloved farm if repayment fell short.

Instead of losing hope, Ramu woke before sunrise every day, tended each plant with devotion, and cultivated organic crops.

When harvest approached, the greedy moneylender tried a trick: "Whatever grows above the soil belongs to me, and whatever is beneath belongs to you!"

Ramu grinned politely—he had strategically planted potatoes, carrots, and sweet peanuts! Ramu harvested tons of nourishing root crops, leaving the dried foliage on top for the scheming lender.

Dhaniram was completely outwitted. Ramu repaid his debt in full, proving that wisdom and honest sweat always triumph over deceit.`,
    moralHi: 'मुसीबत के समय घबराने की बजाय समझदारी और धैर्य से काम लेना चाहिए।',
    moralEn: 'Wisdom, patience, and honesty can overcome any hardship.',
    category: 'wisdom',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '5-12 वर्ष',
    likes: 289,
    isFeatured: true
  },
  {
    id: 'story-3',
    number: 3,
    titleHi: 'चतुर लोमड़ी और कौवा',
    titleEn: 'Chatur Lomdi aur Kauwa (The Fox and Crow)',
    summaryHi: 'झूठी तारीफ के लालच में आकर कौवे ने अपनी रोटी गंवा दी।',
    summaryEn: 'How a crow lost his tasty cheese to a sly fox because of sweet flattery.',
    contentHi: `एक जंगल के किनारे एक कौवे को कहीं से पनीर का एक स्वादिष्ट टुकड़ा मिला। कौवा बहुत खुश हुआ और वह पेड़ की एक सुरक्षित डाली पर बैठकर मजे से पनीर खाने की सोचने लगा।

तभी वहाँ से एक भूखी लोमड़ी निकली। उसकी नज़र कौवे की चोंच में दबे उस पनीर के टुकड़े पर पड़ी। लोमड़ी के मुँह में पानी आ गया।

लोमड़ी बहुत चालाक थी। उसने सोचा, "अगर मैं पेड़ पर चढ़ने की कोशिश करूँगी तो कौवा उड़ जाएगा। मुझे अपनी बातों के जाल से यह पनीर हासिल करना होगा।"

लोमड़ी पेड़ के नीचे खड़ी हुई और बड़े मीठे स्वर में बोली, "अरे वाह! आज कितने दिनों बाद मुझे इतना सुंदर पक्षी देखने को मिला है। तुम्हारे काले पंख सूरज की धूप में रेशम की तरह चमक रहे हैं!"

कौवे ने लोमड़ी की ओर देखा। लोमड़ी ने फिर कहा, "मैंने सुना है कि जंगल में सबसे मधुर गाना सिर्फ आप ही गाते हैं। क्या आप मुझे अपना एक मधुर गीत नहीं सुनाएंगे?"

अपनी झूठी प्रशंसा सुनकर कौवा फूला न समाया। जैसे ही उसने गाना गाने के लिए अपनी चोंच खोली— "काँव-काँव!", पनीर का टुकड़ा नीचे गिर पड़ा!

लोमड़ी ने लपक कर पनीर उठाया, उसे चट कर गई और हँसते हुए जंगल में भाग गई। कौवा पछताता रह गया।`,
    contentEn: `High upon an oak branch sat a glossy black crow, holding a fresh piece of delicious cheese he had just discovered.

Down below strolled a clever fox whose stomach was growling. Seeing the cheese, she concocted a smart plan.

"Good day, noble Crow!" the fox greeted with a warm smile. "How dazzling your feathers look today! Your eyes sparkle like sapphires!"

The crow leaned forward, flattered by the praise.

"Surely," the fox continued, "a bird with such regal beauty must have the most melodious voice in all the woodland! Would you honor me with a single song?"

Drunk on compliments, the crow puffed his chest, spread his wings, and opened his beak wide to sing—"Caw! Caw!"

Down tumbled the cheese! In a flash, the fox caught the snack, swallowed it with delight, and slipped away into the trees, leaving the foolish crow with an empty belly.`,
    moralHi: 'झूठी तारीफ करने वालों की चिकनी-चुपड़ी बातों में कभी नहीं आना चाहिए।',
    moralEn: 'Beware of flatterers; do not let sweet words cloud your good judgment.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=700&auto=format&fit=crop&q=80',
    readTime: '2.5 मिनट (2.5 min)',
    recommendedAge: '3-8 वर्ष',
    likes: 412,
    isFeatured: false
  },
  {
    id: 'story-4',
    number: 4,
    titleHi: 'शेर और नन्हा चूहा',
    titleEn: 'Sher aur Nanha Chuha (The Lion and Mouse)',
    summaryHi: 'एक छोटे से चूहे ने जंगल के सबसे बलशाली राजा शेर की जान बचाई।',
    summaryEn: 'A tiny mouse proves that even the smallest creature can help the mighty king of the jungle.',
    contentHi: `एक दोपहर जंगल का राजा शेर एक घने बरगद के पेड़ के नीचे गहरी नींद में सो रहा था।

तभी वहाँ खेलता हुआ एक नन्हा चूहा गलती से शेर की पीठ पर चढ़ गया और उछल-कूद करने लगा। शेर की नींद टूट गई। क्रोधित होकर शेर ने अपने विशाल पंजे में चूहे को दबोच लिया।

शेर दहाड़ा, "तुझे मेरी नींद खराब करने की सजा अपनी जान देकर चुकानी होगी!"

नन्हा चूहा थर-थर कांपने लगा और हाथ जोड़कर बोला, "हे जंगल के राजा! मुझे क्षमा कर दीजिए। यदि आप मुझे छोड़ देंगे, तो मैं जीवन भर आपका आभारी रहूँगा। क्या पता कभी मैं भी आपके किसी काम आ सकूँ!"

चूहे की बात सुनकर शेर ठहाका मारकर हँसा, "तू इतना सा नन्हा जीव मेरी क्या मदद करेगा? चल, आज मैं तुझ पर दया करके छोड़ देता हूँ।"

कुछ दिनों बाद, जंगल में कुछ शिकारी आए। उन्होंने शेर को पकड़ने के लिए एक मजबूत जाल बिछाया। शेर जाल में फँस गया और जोर-जोर से दहाड़ने लगा।

चूहे ने शेर की दहाड़ पहचान ली। वह दौड़ता हुआ पहुँचा और अपने तेज नुकीले दांतों से जाल की रस्सियों को कुतरना शुरू कर दिया। कुछ ही देर में शेर आज़ाद हो गया!

शेर ने चूहे का दिल से धन्यवाद किया और दोनों पक्के दोस्त बन गए।`,
    contentEn: `One sleepy afternoon, a mighty lion was resting peacefully beneath a banyan tree.

A playful little mouse, scurrying around, accidentally ran up the lion's mane. The lion awoke with a furious roar, pinning the mouse under his colossal paw!

"How dare you disturb the king of beasts?" the lion growled. "You shall pay with your life!"

"Forgive me, Your Majesty!" squeaked the tiny mouse trembling. "Spare me today, and someday I might be able to help you in return!"

The lion chuckled heartily at the thought of a tiny mouse helping the strongest animal in the jungle. Amused, he opened his paw and let him scamper free.

A few weeks later, hunters spread strong rope nets across the jungle trail. The lion stumbled into the trap and was hopelessly bound. His distressed roars shook the forest.

Hearing his friend's voice, the little mouse dashed to the rescue. Using his razor-sharp teeth, he gnawed through the thick fibers until the lion stepped free!

The lion bowed respectfully to the tiny creature, learning that no act of kindness is ever wasted.`,
    moralHi: 'किसी को भी छोटा या कमजोर समझकर उसका अनादर नहीं करना चाहिए।',
    moralEn: 'No act of kindness is ever wasted, and no one is too small to help.',
    category: 'animals',
    coverImage: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=700&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '3-9 वर्ष',
    likes: 520,
    isFeatured: true,
    illustrations: [
      'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=700&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=700&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'story-5',
    number: 5,
    titleHi: 'प्यासा कौवा और कंकड़',
    titleEn: 'Pyasa Kauwa (The Thirsty Crow)',
    summaryHi: 'गर्मी की दोपहर में एक कौवे ने मटके में कंकड़ डालकर अपनी प्यास बुझाई।',
    summaryEn: 'How a thirsty crow used small pebbles and creative patience to raise water in a pitcher.',
    contentHi: `भीषण गर्मी का दिन था। सूरज आग उगल रहा था। एक प्यासा कौवा पानी की तलाश में यहाँ-वहाँ उड़ रहा था। दूर-दूर तक कहीं कोई तालाब या नदी नहीं दिखाई दे रही थी।

कौवा थककर चूर हो गया। तभी उसे एक बगीचे में मिट्टी का एक घड़ा दिखाई दिया।

कौवा खुशी से उड़कर घड़े की मुँडेर पर बैठा। उसने झाँककर देखा तो घड़े के तले में थोड़ा सा पानी था। कौवे ने अपनी चोंच अंदर डाली, लेकिन पानी बहुत नीचे था, उसकी चोंच वहाँ तक नहीं पहुँच सकी।

कौवे ने हिम्मत नहीं हारी। उसने चारों ओर देखा। बगीचे के फर्श पर बहुत सारे छोटे-छोटे कंकड़ पड़े हुए थे। कौवे के दिमाग में एक शानदार योजना आई!

उसने अपनी चोंच से एक-एक कंकड़ उठाना शुरू किया और घड़े में डालना शुरू किया। जैसे-जैसे कंकड़ घड़े के तले में जमा होते गए, पानी का स्तर धीरे-धीरे ऊपर उठता गया।

कौवे ने लगातार मेहनत की। अंत में पानी घड़े के मुँह तक आ गया! कौवे ने जी भरकर ठंडा-मीठा पानी पिया और खुशी-खुशी अपनी उड़ान भरी।`,
    contentEn: `On a sweltering summer afternoon, the scorching sun dried up every puddle in sight. A weary crow flew over fields desperately searching for water.

Exhausted, he spotted a terracotta pitcher resting in a garden shade.

Excited, the crow perched on the rim and peered inside. There was water at the bottom, but the water level was too low for his beak to reach.

Instead of giving up, the crow looked around the garden path and noticed countless smooth little pebbles. An ingenious spark struck him!

Patiently, picking up one pebble at a time with his beak, he dropped them into the pitcher. Plop! Plop! Plop!

With each stone that settled at the bottom, the water level rose higher and higher. Soon, the cool, refreshing water reached the brim. The crow drank to his heart's content and flew into the sky in triumph.`,
    moralHi: 'जहाँ चाह होती है, वहाँ राह निकल ही आती है। बुद्धि और धैर्य से हर कठिनाई हल हो सकती है।',
    moralEn: 'Where there is a will and thoughtful persistence, there is always a way.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    readTime: '2 मिनट (2 min)',
    recommendedAge: '3-8 वर्ष',
    likes: 310,
    isFeatured: false
  },
  {
    id: 'story-6',
    number: 6,
    titleHi: 'लालची कुत्ता और परछाईं',
    titleEn: 'Lalchi Kutta (The Greedy Dog)',
    summaryHi: 'नदी में अपनी ही परछाईं को दूसरा कुत्ता समझकर लालची कुत्ते ने अपनी रोटी भी खो दी।',
    summaryEn: 'A greedy dog barking at his own reflection in the stream loses the juicy bone he already held.',
    contentHi: `एक गाँव में शेरू नाम का एक कुत्ता रहता था। वह अक्सर खाने की तलाश में इधर-उधर भटकता रहता था।

एक दिन उसे कसाई की दुकान के बाहर एक स्वादिष्ट हड्डी का टुकड़ा मिला। शेरू बेहद खुश हुआ। उसने सोचा, "मैं इसे किसी शांत जगह ले जाकर अकेले मजे से खाऊँगा।"

वह हड्डी को अपने मुँह में दबाकर जंगल की ओर जाने लगा। रास्ते में एक साफ पानी की छोटी सी नदी बह रही थी, जिस पर लकड़ी का एक संकरा पुल बना हुआ था।

जब शेरू पुल के बीच पहुँचा, तो उसने नीचे नदी के शांत जल में झाँका। उसे पानी में अपनी ही परछाईं दिखाई दी।

मगर नासमझ शेरू ने सोचा कि पानी में कोई दूसरा कुत्ता खड़ा है जिसके मुँह में भी एक बड़ी सी हड्डी है। शेरू के मन में लालच आ गया— "अगर मैं उस कुत्ते की हड्डी भी छीन लूँ, तो मेरे पास दो-दो हड्डियाँ हो जाएँगी!"

उसने पानी में दिख रहे कुत्ते को डराने के लिए जैसे ही भौंकने के लिए मुँह खोला— "भौंक!", उसके मुँह की हड्डी छूटकर सीधे नदी के गहरे पानी में गिर गई और बह गई।

शेरू भूखा रह गया और अपने लालच पर पछताने लगा।`,
    contentEn: `One bright morning, a hungry stray dog found a large, juicy bone near the town bakery. Overjoyed, he decided to carry it to a peaceful meadow across the river.

As he was trotting over the wooden footbridge spanning the crystal-clear brook, he glanced down into the quiet water.

There, looking up at him, was his own clear reflection.

Being greedy and foolish, he mistook his reflection for another dog holding another delicious bone. He thought, "If I scare him and snatch his bone too, I will have double the feast!"

Without hesitation, he opened his jaws wide to bark—"Woof!"

The moment his teeth parted, his prize slipped from his mouth, plunged into the rushing water, and sank to the riverbed out of sight. The greedy dog trotted home hungry, having learned a bitter lesson.`,
    moralHi: 'जो हमारे पास है उसी में संतुष्ट रहना चाहिए। लालच का फल हमेशा बुरा होता है।',
    moralEn: 'Be content with what you have. Greed causes you to lose everything.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=700&auto=format&fit=crop&q=80',
    readTime: '2.5 मिनट (2.5 min)',
    recommendedAge: '4-9 वर्ष',
    likes: 245,
    isFeatured: false
  }
];

export const INITIAL_FUN_FACTS: FunFact[] = [
  {
    id: 'fact-1',
    titleHi: 'तितलियाँ पैरों से चखती हैं स्वाद!',
    titleEn: 'Butterflies Taste With Their Feet!',
    factHi: 'तितलियों के पैरों के तलवों में विशेष स्वाद सेंसर (taste sensors) होते हैं। जब वे किसी फूल या पत्ते पर बैठती हैं, तो अपने पैरों से ही जान लेती हैं कि वह खाने लायक है या नहीं!',
    factEn: 'Butterflies have taste receptors on their feet! By simply landing on a flower petal or leaf, they instantly taste whether it is delicious nectar or safe for laying eggs.',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=80',
    emoji: '🦋',
    likes: 419
  },
  {
    id: 'fact-2',
    titleHi: 'चाँद पर दिन और रात 14 दिन लंबे!',
    titleEn: 'A Lunar Day Lasts 14 Earth Days!',
    factHi: 'चाँद अपनी धुरी पर बहुत धीरे घूमता है। इसलिए चाँद पर एक दिन लगभग 14 पृथ्वी दिनों के बराबर और एक रात भी 14 पृथ्वी दिनों के बराबर लंबी होती है!',
    factEn: 'Because the Moon rotates on its axis very slowly, daytime on the Moon lasts about 14 Earth days, followed by a night that also lasts 14 Earth days!',
    category: 'space',
    image: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=600&auto=format&fit=crop&q=80',
    emoji: '🌕',
    likes: 580
  },
  {
    id: 'fact-3',
    titleHi: 'बांस दुनिया का सबसे तेज़ बढ़ने वाला पौधा!',
    titleEn: 'Bamboo: The Fastest Growing Plant!',
    factHi: 'कुछ प्रजातियों का बांस (Bamboo) एक ही दिन (24 घंटे) में 35 इंच (लगभग 90 सेंटीमीटर) तक बढ़ सकता है! आप इसे अपनी आँखों से बढ़ता हुआ महसूस कर सकते हैं।',
    factEn: 'Certain bamboo species can sprout up to 35 inches (nearly 90 centimeters) within a single 24-hour cycle! It holds the Guinness World Record for the fastest-growing plant.',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    emoji: '🎋',
    likes: 362
  },
  {
    id: 'fact-4',
    titleHi: 'इंसानी आँख 1 करोड़ रंग पहचान सकती है!',
    titleEn: 'Human Eyes Can See 10 Million Colors!',
    factHi: 'हमारी दोनों आँखों में लगभग 12 करोड़ रॉड कोशिकाएं और 70 लाख कोन कोशिकाएं होती हैं, जो मिलकर 10,000,000 (1 करोड़) से भी अधिक रंगों में फर्क पहचान सकती हैं!',
    factEn: 'With millions of photoreceptor cone cells working in harmony, healthy human eyes can distinguish more than 10 million distinct shades of color!',
    category: 'human_body',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    emoji: '👁️',
    likes: 490
  },
  {
    id: 'fact-5',
    titleHi: 'हाथी 5 किलोमीटर दूर से पानी सूंघ लेते हैं!',
    titleEn: 'Elephants Can Smell Water 5km Away!',
    factHi: 'हाथियों की सूंघने की शक्ति इंसानों से 5 गुना और कुत्तों से भी 2 गुना तेज होती है। वे 3 मील (लगभग 5 किलोमीटर) दूर जमीन के अंदर छिपे पानी को भी सूंघ लेते हैं!',
    factEn: 'An elephant’s sense of smell is remarkably sharp—roughly 5 times stronger than humans and twice that of dogs. They can detect underground water sources from over 3 miles away!',
    category: 'animals',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
    emoji: '🐘',
    likes: 671
  },
  {
    id: 'fact-6',
    titleHi: 'आसमान नीला क्यों दिखाई देता है?',
    titleEn: 'Why Is The Sky Blue?',
    factHi: 'सूरज की रोशनी में सभी सात रंग होते हैं। जब यह रोशनी पृथ्वी के वायुमंडल में आती है, तो नीले रंग की तरंगें सबसे छोटी होने के कारण हवा के कणों से टकराकर चारों तरफ बिखर जाती हैं (Rayleigh Scattering)!',
    factEn: 'Sunlight appears white but contains all rainbow colors. Blue light travels in smaller, shorter waves and scatters in every direction through gas molecules in Earth’s atmosphere!',
    category: 'science',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
    emoji: '🌈',
    likes: 512
  }
];

export const INITIAL_LEARNING_ITEMS: LearningItem[] = [
  // Alphabet
  {
    id: 'learn-1',
    module: 'alphabet',
    symbol: 'A',
    name: 'Apple',
    pronunciation: 'Ah-pul',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
    imageOrEmoji: '🍎',
    words: ['Ant', 'Axe', 'Alligator'],
    story: 'An ant ate an apple on the axe.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'learn-2',
    module: 'alphabet',
    symbol: 'B',
    name: 'Bear',
    pronunciation: 'B-air',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    imageOrEmoji: '🐻',
    words: ['Ball', 'Bat', 'Banana'],
    story: 'The brown bear bounced a big blue ball.',
  },
  {
    id: 'learn-3',
    module: 'alphabet',
    symbol: 'C',
    name: 'Cat',
    pronunciation: 'K-at',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    imageOrEmoji: '🐱',
    words: ['Car', 'Cake', 'Camel'],
    story: 'The cute cat ate a carrot cake in the car.',
  },
  // Numbers
  {
    id: 'learn-4',
    module: 'numbers',
    symbol: '1',
    name: 'One',
    pronunciation: 'Wun',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    imageOrEmoji: '1️⃣',
    words: ['One sun', 'One moon'],
  },
  {
    id: 'learn-5',
    module: 'numbers',
    symbol: '2',
    name: 'Two',
    pronunciation: 'Too',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    imageOrEmoji: '2️⃣',
    words: ['Two eyes', 'Two shoes'],
  }
];

export const INITIAL_AUDIO_STORIES: AudioStory[] = [
  {
    id: 'audio-1',
    titleHi: 'शेर और खरगोश',
    titleEn: 'The Lion and the Rabbit',
    narrator: 'दादी माँ',
    duration: '4:15',
    durationSeconds: 255,
    coverImage: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=700&auto=format&fit=crop&q=80',
    audioUrl: 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg', // Sample public domain sound
    descriptionHi: 'एक चतुर खरगोश ने अपनी बुद्धिमानी से जंगल को एक क्रूर शेर से कैसे बचाया, सुनें यह रोमांचक कहानी।',
    descriptionEn: 'Listen to the exciting story of how a clever rabbit saved the forest from a cruel lion.',
    tags: ['पंचतंत्र', 'चतुराई'],
  }
];

export const INITIAL_VIDEO_CATEGORIES: string[] = [
  'पंचतंत्र कहानियाँ',
  'अकबर बीरबल',
  'जादुई व नैतिक कथाएँ',
  'एनिमेटेड शॉर्ट्स',
  'रोचक बाल कहानियाँ',
  'सीख व संस्कार',
];

export const INITIAL_VIDEO_STORIES: VideoStory[] = [
  {
    id: 'vid-1',
    titleHi: 'शेर और चूहे की दोस्ती (Shorts)',
    titleEn: 'The Lion and The Mouse (Shorts)',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=600&auto=format&fit=crop&q=80', // 9:16 portrait lion
    category: 'पंचतंत्र कहानियाँ',
    duration: '0:58',
    viewsCount: '24K+',
    descriptionHi: 'जब एक छोटे से चूहे ने दयालु शेर की जान शिकारी के जाल से बचाई।',
    descriptionEn: 'A tiny mouse repays kindness by saving a mighty lion from a net.',
    isFeatured: true,
  },
  {
    id: 'vid-2',
    titleHi: 'बीरबल की चतुराई और खिचड़ी (Video)',
    titleEn: 'Birbal Ki Khichdi (Hindi Tale)',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    category: 'अकबर बीरबल',
    duration: '1:15',
    viewsCount: '18K+',
    descriptionHi: 'बीरबल ने बादशाह अकबर को कैसे समझाया कि मेहनत का फल जरूर मिलना चाहिए।',
    descriptionEn: 'Birbal teaches Emperor Akbar a memorable lesson of fairness and reward.',
    isFeatured: true,
  },
  {
    id: 'vid-3',
    titleHi: 'प्यासा कौआ और घड़ा (Shorts)',
    titleEn: 'The Thirsty Crow (Animated Shorts)',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&auto=format&fit=crop&q=80',
    category: 'एनिमेटेड शॉर्ट्स',
    duration: '0:45',
    viewsCount: '32K+',
    descriptionHi: 'कंकर-कंकर डालकर कौवे ने पानी ऊपर उठाया और अपनी प्यास बुझाई।',
    descriptionEn: 'Where there is a will, there is a way: the clever crow story.',
    isFeatured: true,
  },
  {
    id: 'vid-4',
    titleHi: 'ईमानदार लकड़हारा और सोने की कुल्हाड़ी',
    titleEn: 'The Honest Woodcutter & Golden Axe',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    category: 'जादुई व नैतिक कथाएँ',
    duration: '1:40',
    viewsCount: '15K+',
    descriptionHi: 'ईमानदारी सबसे बड़ा गुण है—जलपरी ने लकड़हारे को उसकी सच्चाई का उपहार दिया।',
    descriptionEn: 'Honesty is the best policy: the woodcutter receives golden blessings.',
    isFeatured: false,
  },
  {
    id: 'vid-5',
    titleHi: 'खरगोश और कछुए की दौड़ (Shorts)',
    titleEn: 'The Tortoise and the Hare Race',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&auto=format&fit=crop&q=80',
    category: 'एनिमेटेड शॉर्ट्स',
    duration: '0:52',
    viewsCount: '41K+',
    descriptionHi: 'घमंड का फल हमेशा बुरा होता है, धीमे और निरंतर चलने वाले की ही जीत होती है।',
    descriptionEn: 'Slow and steady wins the race: classic fable of perseverance.',
    isFeatured: true,
  },
  {
    id: 'vid-6',
    titleHi: 'लालची कुत्ता और रोटी (Video)',
    titleEn: 'The Greedy Dog & His Shadow',
    youtubeUrl: 'https://www.youtube.com/@baalvarta',
    thumbnail: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    category: 'सीख व संस्कार',
    duration: '1:05',
    viewsCount: '19K+',
    descriptionHi: 'लालच बुरी बला है—अपनी परछाईं को दूसरा कुत्ता समझकर रोटी गवां बैठा।',
    descriptionEn: 'Greed brings loss: a moral tale about being content with what you have.',
    isFeatured: false,
  }
];


