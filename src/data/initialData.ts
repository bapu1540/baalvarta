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
    coverImage: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80',
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
  },
  {
    id: 'story-7',
    number: 7,
    titleHi: 'कछुआ और घमंडी खरगोश',
    titleEn: 'Kachhua aur Ghamandi Khargosh (The Tortoise and the Hare)',
    summaryHi: 'तेज दौड़ने वाले अहंकारी खरगोश और शांत व निरंतर चलने वाले कछुए की अमर दौड़ की कहानी।',
    summaryEn: 'The timeless fable of an overconfident hare and a persistent, slow tortoise who won the race.',
    contentHi: `सुंदरवन के एक हरे-भरे जंगल में चीकू नाम का एक फुर्तीला खरगोश रहता था। उसे अपनी तेज रफ्तार पर बहुत घमंड था। वह अक्सर जंगल के अन्य छोटे जानवरों का मजाक उड़ाता था।

एक दिन चीकू ने कछुए 'धीरू' को धीरे-धीरे सड़क पर चलते देखा। चीकू खिलखिलाकर हँसा और बोला, "अरे धीरू भाई! अगर तुम इतनी धीमी चाल चलोगे, तो किसी दिन रास्ता ही भूल जाओगे!"

धीरू कछुए ने शांत भाव से मुस्कुराते हुए कहा, "चीकू भाई, घमंड अच्छा नहीं होता। अगर तुम्हें अपनी चाल पर इतना ही भरोसा है, तो आओ उस पहाड़ी के बरगद तक दौड़ लगा लें!"

चीकू ने ठहाका लगाया, "मुझसे दौड़? चलो, आज तुम्हारा वहम दूर कर देता हूँ!" 

जंगल के सभी जानवर—लोमड़ी, भालू, हिरण दौड़ देखने इकट्ठा हुए। सीटी बजते ही चीकू हवा से बातें करने लगा और पलक झपकते ही बहुत आगे निकल गया। उसने पीछे मुड़कर देखा, धीरू अभी बहुत दूर धीरे-धीरे रेंग रहा था।

चीकू ने सोचा, "धीरू को यहाँ पहुँचने में घंटों लगेंगे। क्यों न इस घने पेड़ की ठंडी छाँव में थोड़ी देर झपकी ले लूँ!" ठंडी हवा के झोंकों में खरगोश को गहरी नींद आ गई।

उधर, धीरू कछुआ बिना रुके, बिना थके लगातार कदम बढ़ाता रहा। वह सोए हुए खरगोश के पास से चुपचाप आगे निकल गया और बरगद के पेड़ पर पहुँचकर जीत का झंडा छू लिया।

जब चीकू की आँख खुली और उसने धीरू को जीतते देखा, तो उसका घमंड हमेशा के लिए चूर-चूर हो गया।`,
    contentEn: `In a green woodland lived Chiku, a swift young hare who was very proud of his lightning speed. He constantly mocked other animals for being slow.

One morning, Chiku encountered Dheeru the tortoise, ambling peacefully on the mossy trail. Chiku laughed out loud, "Hey Dheeru! At your pace, you might reach tomorrow by next week!"

Dheeru looked up calmly with gentle eyes, "Pride comes before a fall, friend Chiku. If you are so certain of your speed, why not race me to the ancient banyan tree on the hilltop?"

Chiku laughed heartily and accepted the challenge. All the forest creatures gathered at the starting line.

At the signal, Chiku bolted forward like an arrow. Within minutes, he was far ahead. Looking back, the tortoise was merely a tiny speck in the distance.

"I have plenty of time," thought Chiku. "The breeze under this leafy mango tree is so soothing. I'll take a quick nap." Soon, he was snoring deeply.

Meanwhile, Dheeru plodded on steadily, step by step, never pausing to rest or boast. He quietly bypassed the sleeping hare and touched the victory post!

When Chiku awoke and saw the woodland cheering for Dheeru, he hung his ears in shame, having learned that patience and consistency always win.`,
    moralHi: 'लगातार और धैर्यपूर्वक किया गया प्रयास हमेशा सफलता दिलाता है। अहंकार का अंत बुरा होता है।',
    moralEn: 'Slow and steady wins the race. Overconfidence leads to downfall.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 480,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's7-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
        textHi: 'चीकू खरगोश को अपनी तेज रफ्तार पर बहुत घमंड था और वह धीरू कछुए की धीमी चाल का मजाक उड़ाता था।',
        textEn: 'Chiku the hare was proud of his speed and made fun of slow and patient Dheeru the tortoise.',
        captionHi: 'दृश्य 1: चीकू खरगोश और धीरू कछुआ',
      },
      {
        id: 's7-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80',
        textHi: 'दौड़ शुरू हुई, खरगोश पेड़ के नीचे सो गया जबकि कछुआ बिना रुके धीरे-धीरे आगे बढ़ता रहा।',
        textEn: 'The race began; the hare fell asleep under a tree while the tortoise kept marching steadily.',
        captionHi: 'दृश्य 2: पेड़ की छाँव में गहरी नींद',
      },
      {
        id: 's7-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80',
        textHi: 'धीरू कछुए ने अंतिम रेखा छूकर दौड़ जीत ली और सभी जानवरों ने उसका स्वागत किया।',
        textEn: 'Dheeru touched the finish line first and the entire forest celebrated his victory!',
        captionHi: 'दृश्य 3: कछुए की शानदार जीत',
      },
    ],
  },
  {
    id: 'story-8',
    number: 8,
    titleHi: 'एकता में बल (कबूतर और शिकारी का जाल)',
    titleEn: 'Ekta me Bal (Unity is Strength - The Pigeons in the Net)',
    summaryHi: 'शिकारी के जाल में फँसे कबूतरों ने मिलकर एक साथ उड़ान भरी और पूरे जाल को ही उड़ा ले गए।',
    summaryEn: 'How a flock of trapped pigeons discovered that working together in harmony can break any trap.',
    contentHi: `नीलगिरी के जंगल में एक विशाल पीपल के पेड़ पर कबूतरों का एक बड़ा झुंड रहता था। उनके मुखिया एक वयोवृद्ध और बुद्धिमान कबूतर थे।

एक दिन भोजन की तलाश में उड़ते हुए कबूतरों ने नीचे जमीन पर बिखरे हुए ढेर सारे सुनहरे गेहूं के दाने देखे। छोटे कबूतर खुशी से चिल्लाए, "अरे वाह! इतना सारा अनाज!"

बूढ़े मुखिया ने समझाया, "घने जंगल के बीच इतने सारे दाने पड़े होना सामान्य नहीं है। मुझे किसी शिकारी का षड्यंत्र लगता है। नीचे मत जाओ।"

लेकिन भूख से बेहाल कबूतरों ने चेतावनी नहीं मानी और दाना चुगने नीचे उतर आए। जैसे ही उन्होंने दाना चुगना शुरू किया, झाड़ियों के पीछे छिपे शिकारी का भारी जाल उन पर गिर पड़ा!

सभी कबूतर जाल में छटपटाने लगे। शिकारी लाठी लेकर दौड़ता हुआ आ रहा था। सब रोने लगे, "अब हम कभी बच नहीं पाएंगे!"

तभी मुखिया ने हिम्मत बंधाई, "घबराओ मत! अकेले-अकेले फड़फड़ाओगे तो शिकारी तुम्हें पकड़ लेगा। जब मैं 'एक, दो, तीन' कहूँ, तो सब अपनी पूरी ताकत से एक ही दिशा में ऊपर की ओर पंख फड़फड़ाना!"

जैसे ही मुखिया ने इशारा किया, सभी कबूतरों ने मिलकर एक साथ जोर लगाया। चमत्कार हो गया—पूरा का पूरा जाल जमीन से उठ गया और सभी कबूतर जाल को लेकर आकाश में उड़ चले!

शिकारी आँखें फाड़कर देखता रह गया। कबूतर अपने मित्र हिरण्यक चूहे के बिल के पास उतरे, जिसने अपने तेज दांतों से जाल काटकर सबको आजाद कर दिया।`,
    contentEn: `In a vast banyan forest lived a peaceful flock of pigeons guided by a wise old leader named Chitragriva.

One morning, the younger birds spotted a sparkling carpet of golden grain scattered across a clearing. Overjoyed, they prepared to descend.

The wise leader cautioned them, "Why would grains lie in abundance in the middle of a remote jungle? It smells like a hunter's snare. Be cautious."

Tempted by hunger, the younger pigeons ignored the advice and swooped down. The moment their beaks touched the grain, a heavy woven net dropped over them!

Panicking, the birds fluttered frantically as a hunter approached with a club. Despair filled the air.

The old leader shouted calmly, "Stop fluttering in different directions! If we unite our strength, we can overcome this net. On my mark of three, flap your wings upward together toward the sky!"

"One, two, three... LIFT!" Every pigeon beat its wings in perfect unison. A miracle happened—the entire net lifted off the ground, carrying the flock safely into the clouds!

The hunter stood dumbfounded on the forest floor. The pigeons flew to the hill burrow of their faithful mouse friend Hiranyaka, who swiftly gnawed through the ropes and set every bird free.`,
    moralHi: 'संगठन और एकता में अपार शक्ति होती है। मिलकर काम करने से बड़े से बड़ा संकट भी दूर हो जाता है।',
    moralEn: 'United we stand, divided we fall. Together, any obstacle can be conquered.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '5-11 वर्ष',
    likes: 512,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's8-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
        textHi: 'कबूतरों ने जमीन पर बिखरे सुनहरे दाने देखे और मुखिया की चेतावनी के बावजूद नीचे उतर आए।',
        textEn: 'The pigeons spotted golden grains on the ground and landed despite the elder bird’s warning.',
        captionHi: 'दृश्य 1: दाने का प्रलोभन',
      },
      {
        id: 's8-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        textHi: 'शिकारी का जाल कबूतरों पर गिर गया और सभी पक्षी भयभीत होकर फड़फड़ाने लगे।',
        textEn: 'The hunter’s trap fell over them, trapping the helpless flock in the ropes.',
        captionHi: 'दृश्य 2: जाल में फँसना',
      },
      {
        id: 's8-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        textHi: 'सभी कबूतरों ने मिलकर एक साथ जोर लगाया और जाल को लेकर खुले आसमान में उड़ चले।',
        textEn: 'Flapping in unison, the united pigeons lifted the entire net into the sunny sky!',
        captionHi: 'दृश्य 3: एकता की विजयी उड़ान',
      },
    ],
  },
  {
    id: 'story-9',
    number: 9,
    titleHi: 'सोने के अंडे देने वाली हंस',
    titleEn: 'Sone ke Ande (The Goose that Laid Golden Eggs)',
    summaryHi: 'लालची किसान ने एक ही दिन में धनवान बनने के चक्कर में सोने का अंडा देने वाली हंस खो दी।',
    summaryEn: 'How a greedy farmer destroyed his fortune by seeking all the golden eggs in a single day.',
    contentHi: `एक छोटे से गाँव में मदन नाम का एक साधारण किसान अपनी पत्नी के साथ रहता था। उनके पास एक सुंदर सफेद हंस थी।

एक सुबह जब मदन हंस के बाड़े में गया, तो उसकी आँखें फटी की फटी रह गईं। घोंसले में एक चमचमाता हुआ शुद्ध सोने का अंडा रखा हुआ था!

मदन ने वह अंडा बाजार में बेचा और उसे बहुत सारे रुपये मिले। अगली सुबह फिर वैसा ही हुआ—हंस ने फिर से एक चमकीला सोने का अंडा दिया।

अब रोज़ सुबह हंस एक सोने का अंडा देती और मदन उसे बेचकर अमीर होता गया। उसने एक बड़ा पक्का मकान बनवा लिया और उसके पास नौकर-चाकर आ गए।

लेकिन धन के साथ-साथ मदन का लालच भी बढ़ता गया। एक शाम उसने अपनी पत्नी से कहा, "यह हंस रोज़ सिर्फ एक ही अंडा देती है। इसके पेट में तो सैकड़ों सोने के अंडों का खजाना होगा! क्यों न हम इसका पेट चीरकर सारे अंडे एक ही बार में निकाल लें? हम पूरे राज्य के सबसे अमीर इंसान बन जाएंगे!"

पत्नी ने मना किया, पर अंधे लालच में मदन ने उसकी एक न सुनी। उसने एक तेज चाकू उठाया और बेचारी हंस का पेट चीर दिया।

लेकिन अंदर क्या मिला? अंदर कोई खजाना नहीं था, वह एक सामान्य हंस जैसी ही थी! मदन की जादुई हंस मर चुकी थी।

मदन सिर पकड़कर रोने लगा, "हाय! मैंने अपने ही हाथों अपनी सुख-शांति और दौलत खत्म कर दी!" पर अब पछताने से क्या लाभ?`,
    contentEn: `In a quiet hamlet lived Madan, a humble farmer who owned a magnificent snow-white goose.

One morning, while collecting eggs, Madan froze in astonishment. Sitting in the straw nest was a gleaming, heavy egg made of pure gold!

He took the egg to the city jeweler, who weighed it and paid a king's ransom. The next morning, the miracle repeated itself—another solid gold egg lay sparkling in the nest.

Day after day, the wondrous goose laid a single golden egg. Madan built a grand mansion, bought fine silks, and lived in luxury.

Yet, wealth bred greed in his heart. One evening, he paced restlessly and said to his wife, "Why settle for one egg a day? Inside her belly must be a treasure vault of hundreds of gold eggs! If we cut her open, we will possess all the gold in an instant!"

His wife pleaded with him to be grateful, but blinded by avarice, Madan seized a sharp kitchen knife.

Tragically, when he cut open the goose, he found her insides no different from any ordinary bird. There were no golden eggs inside, and the wondrous creature was dead.

Madan wept bitterly in the empty barn, clutching bloodied feathers. His insatiable greed had destroyed the blessing that made him rich.`,
    moralHi: 'अति लालच मनुष्य की बुद्धि हर लेता है और सर्वनाश की ओर ले जाता है। संतोष ही सबसे बड़ा धन है।',
    moralEn: 'Greed overreaches itself. Be content with steady blessings, for greed brings regret.',
    category: 'wisdom',
    coverImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '5-12 वर्ष',
    likes: 395,
    isFeatured: false,
    format: 'picture_book',
    scenes: [
      {
        id: 's9-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
        textHi: 'मदन किसान को हंस के घोंसले में रोज़ एक चमचमाता हुआ शुद्ध सोने का अंडा मिलता था।',
        textEn: 'Farmer Madan discovered a sparkling golden egg in the goose’s nest every morning.',
        captionHi: 'दृश्य 1: जादुई सोने का अंडा',
      },
      {
        id: 's9-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        textHi: 'सोने के अंडे बेचकर मदन अमीर हो गया, लेकिन उसके मन में सारा सोना एक साथ पाने का लालच आ गया।',
        textEn: 'Madan became wealthy, yet greed tempted him to seize all eggs at once.',
        captionHi: 'दृश्य 2: बढ़ता हुआ लालच',
      },
      {
        id: 's9-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
        textHi: 'अति लालच के कारण उसने अपनी जादुई हंस खो दी और हाथ मलकर रोता रह गया।',
        textEn: 'Blind greed cost him his precious goose, leaving him with empty hands and sorrow.',
        captionHi: 'दृश्य 3: पछतावा और पश्चाताप',
      },
    ],
  },
  {
    id: 'story-10',
    number: 10,
    titleHi: 'जामुन का पेड़ और चतुर बंदर',
    titleEn: 'Jamun ka Ped aur Chatur Bandar (The Monkey and the Crocodile)',
    summaryHi: 'नदी के मगरमच्छ ने धोखे से बंदर को मारना चाहा, लेकिन बंदर ने अपनी बुद्धि से अपनी जान बचाई।',
    summaryEn: 'How a clever monkey saved his life from a treacherous crocodile with quick thinking.',
    contentHi: `गंगा नदी के किनारे मीठे जामुन का एक बहुत बड़ा पेड़ था। उस पेड़ पर 'रक्तमुख' नाम का एक होशियार बंदर रहता था। नदी में 'करालमुख' नाम का एक मगरमच्छ भी रहता था।

बंदर रोज़ मीठे पके जामुन तोड़कर मगरमच्छ को खिलाता था। दोनों में गहरी मित्रता हो गई। मगरमच्छ कुछ जामुन अपनी पत्नी के लिए भी ले जाता था।

एक दिन मगरमच्छ की पत्नी ने मीठे जामुन खाकर कहा, "जो बंदर रोज़ इतने रसीले जामुन खाता है, उसका दिल कितना मीठा होगा! मुझे उस बंदर का दिल खाना है। तुम उसे घर बुलाओ, नहीं तो मैं भूखी रहूँगी!"

मगरमच्छ पहले तो बहुत दुखी हुआ, पर पत्नी की जिद के आगे मजबूर होकर वह बंदर के पास गया और बोला, "मित्र बंदर! मेरी पत्नी ने तुम्हारे लिए एक शानदार दावत रखी है। तुम मेरी पीठ पर बैठ जाओ, मैं तुम्हें घर ले चलता हूँ।"

बंदर खुशी-खुशी मगरमच्छ की पीठ पर बैठ गया। जब वे नदी के गहरे बीच में पहुँचे, तो मगरमच्छ बोला, "मित्र, सच तो यह है कि मेरी पत्नी तुम्हारा मीठा दिल खाना चाहती है!"

बंदर भीतर से कांप उठा, लेकिन उसने बिल्कुल चेहरे पर घबराहट नहीं आने दी। वह हँसते हुए बोला, "अरे मेरे प्यारे मित्र! यह बात तुमने पहले क्यों नहीं बताई? मैं तो अपना दिल जामुन के पेड़ की खोह में ही सुरक्षित रखकर आया हूँ! चलो तुरंत वापस मुड़ो, ताकि मैं अपना दिल लेकर आ सकूँ!"

मूर्ख मगरमच्छ तुरंत नदी के किनारे की ओर वापस मुड़ गया। जैसे ही किनारा आया, बंदर ने एक लंबी छलांग लगाई और पेड़ की सबसे ऊँची शाखा पर जा बैठा!

बंदर ने ऊपर से चिल्लाकर कहा, "मूर्ख मगरमच्छ! क्या किसी का दिल शरीर से अलग रह सकता है? तूने दोस्ती में गद्दारी की है, आज से हमारी मित्रता समाप्त!"`,
    contentEn: `On the banks of a mighty river grew a lush rose-apple (Jamun) tree, home to a friendly monkey named Raktamukha. In the gentle currents below lived a crocodile named Karalamukha.

Every afternoon, the monkey plucked clusters of sweet purple berries and tossed them down. The two became dearest companions, sharing stories and laughter. The crocodile often brought berries home to his wife.

One evening, savoring the juicy fruit, the crocodile's wife thought maliciously, "If this monkey eats nectar-sweet apples all day, how delicious his heart must taste! Bring him to me so I may feast upon his heart!"

Reluctantly, the crocodile returned to the shore. "Dear brother, my wife has prepared a feast in your honor. Climb onto my back; I shall ferry you across the river."

Delighted, the trusting monkey hopped onto the scaly back. Midstream, surrounded by deep water, the crocodile confessed, "Forgive me, friend, but my wife demands your heart for dinner."

The monkey’s blood ran cold, but his sharp mind stayed alert. Smiling nonchalantly, he said, "Oh friend, why didn't you mention this earlier? We monkeys keep our delicate hearts safe in the hollow branch of the Jamun tree! Turn back at once so I may retrieve it for your lady!"

Believing the clever ruse, the foolish crocodile swam hastily back to the bank. The instant they touched the shore, the monkey leaped like lightning high into the safety of the banyan branches!

"You treacherous fool!" the monkey laughed from above. "Can any creature live without a heart inside its chest? Your deceit has shattered our friendship forever. Begone!"`,
    moralHi: 'विपत्ति के समय धैर्य और प्रत्युत्पन्नमति (Quick Wit) से काम लेने पर जीवन की रक्षा संभव है।',
    moralEn: 'Presence of mind and quick thinking can save you from the deepest perils.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '5-12 वर्ष',
    likes: 610,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's10-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&auto=format&fit=crop&q=80',
        textHi: 'पेड़ पर रहने वाला बंदर रोज़ नदी में तैरते मगरमच्छ को मीठे पके जामुन तोड़कर खिलाता था।',
        textEn: 'The friendly monkey plucked sweet berries daily for the visiting crocodile.',
        captionHi: 'दृश्य 1: जामुन के पेड़ पर मित्रता',
      },
      {
        id: 's10-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        textHi: 'नदी के बीच में मगरमच्छ ने पत्नी के लिए बंदर का दिल मांगने का रहस्य खोला।',
        textEn: 'In deep water, the crocodile revealed his treacherous plan to take the monkey’s heart.',
        captionHi: 'दृश्य 2: नदी के गहरे पानी में धोखा',
      },
      {
        id: 's10-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&auto=format&fit=crop&q=80',
        textHi: 'चतुर बंदर ने पेड़ पर दिल छूटे होने की बात कहकर छलांग लगाई और अपनी जान बचा ली।',
        textEn: 'With sharp wit, the monkey leaped back onto his tree and outsmarted the predator!',
        captionHi: 'दृश्य 3: चतुराई से जीवन रक्षा',
      },
    ],
  },
  {
    id: 'story-11',
    number: 11,
    titleHi: 'ईमानदार लकड़हारा और जल देवता',
    titleEn: 'Imandar Lakadhara (The Honest Woodcutter and the Golden Axe)',
    summaryHi: 'नदी में गिरी लोहे की कुल्हाड़ी के बदले सोने-चाँदी की कुल्हाड़ी ठुकराकर लकड़हारे ने अपनी ईमानदारी साबित की।',
    summaryEn: 'A poor woodcutter’s steadfast honesty earns him blessings and golden rewards from the river deity.',
    contentHi: `एक घने जंगल के किनारे मंगलू नाम का एक गरीब लेकिन सच्चा लकड़हारा रहता था। वह दिन भर जंगल से सूखी लकड़ियां काटता और शाम को बाजार में बेचकर अपने परिवार का पेट भरता था।

एक दिन वह नदी के किनारे खड़े एक पुराने पेड़ पर चढ़कर लकड़ी काट रहा था। अचानक उसके हाथ से पसीना छूटा और उसकी पुरानी लोहे की कुल्हाड़ी छिटककर नदी के गहरे पानी में गिर गई।

नदी बहुत गहरी थी। मंगलू नदी किनारे बैठकर फूट-फूट कर रोने लगा, "हे भगवान! मेरी इकलौती कुल्हाड़ी चली गई। अब मैं अपने बच्चों को रोटी कैसे खिलाऊँगा?"

मंगलू की सच्ची पुकार सुनकर नदी के जल में से एक दिव्य प्रकाश चमका और साक्षात जल देवता प्रकट हुए। उन्होंने पूछा, "वत्स, तुम क्यों रो रहे हो?" मंगलू ने अपनी व्यथा सुनाई।

जल देवता नदी के गहरे जल में उतरे और कुछ ही क्षणों में एक चमचमाती सोने की कुल्हाड़ी लेकर बाहर आए। उन्होंने पूछा, "क्या यह तुम्हारी कुल्हाड़ी है?"
मंगलू ने हाथ जोड़कर कहा, "नहीं प्रभु, यह सोने की कुल्हाड़ी मेरी नहीं है।"

जल देवता फिर पानी में गए और इस बार एक चमकदार चाँदी की कुल्हाड़ी लेकर आए। मंगलू ने फिर सिर हिलाया, "नहीं भगवन, यह भी मेरी नहीं है।"

तीसरी बार जल देवता ने पानी से वही पुरानी जंग लगी लोहे की कुल्हाड़ी निकाली। उसे देखते ही मंगलू खुशी से उछल पड़ा, "हाँ प्रभु! यही मेरी अपनी कुल्हाड़ी है! आपका लाख-लाख धन्यवाद!"

जल देवता मंगलू की निश्छल ईमानदारी से अत्यंत प्रसन्न हुए। उन्होंने कहा, "तुम्हारी सच्चाई ने मेरा मन मोह लिया है। यह लोहे की कुल्हाड़ी तो तुम्हारी है ही, इनाम के रूप में यह सोने और चाँदी की कुल्हाड़ियाँ भी मैं तुम्हें भेंट करता हूँ!"

मंगलू की ईमानदारी ने उसकी दरिद्रता सदा के लिए मिटा दी।`,
    contentEn: `Near a whispering pine forest lived Manglu, a poor woodcutter renowned for his pure heart and integrity. He supported his family by collecting dry fallen branches.

One afternoon, while trimming an overhanging branch beside a rushing river, the wooden handle slipped from his sweaty palm. Splash! His iron axe sank into the swirling depths.

The river was treacherous and deep. Distraught, Manglu knelt on the gravel bank and wept, "O God! My only means of earning food for my starving children is lost!"

Moved by his sincere grief, the river deity emerged from the foaming water in a halo of golden light. "Why do you weep, good man?"

Manglu explained his plight. The deity dove into the riverbed and resurfaced holding an axe forged of solid, shimmering gold. "Is this your axe?"

Manglu folded his hands humbly, "No, kind spirit, such a priceless golden axe could never be mine."

The deity submerged again, returning with a polished axe of gleaming silver. Again Manglu replied softly, "No, Lord, that is not mine either."

For the third time, the spirit reached into the currents and lifted out the worn, rusty iron axe with its frayed wooden handle. Manglu’s eyes filled with joy, "Yes! That is indeed my beloved axe! Thank you from the bottom of my soul!"

Delighted by his unshakeable honesty, the river spirit smiled, "Your truthfulness is rarer than gold. Take your iron axe, and receive both the gold and silver axes as rewards for your noble soul!"

Manglu returned to his cottage enriched forever by the supreme virtue of honesty.`,
    moralHi: 'सच्चाई और ईमानदारी सबसे बड़ा धन है। ईमानदार मनुष्य को ईश्वर का आशीर्वाद अवश्य मिलता है।',
    moralEn: 'Honesty is the highest virtue. Truthful deeds bring divine rewards.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '4-11 वर्ष',
    likes: 540,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's11-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        textHi: 'गरीब लकड़हारे की लोहे की कुल्हाड़ी नदी में गिर गई और वह किनारे बैठकर रोने लगा।',
        textEn: 'The poor woodcutter lost his iron axe in the deep river and wept on the bank.',
        captionHi: 'दृश्य 1: नदी किनारे विलाप',
      },
      {
        id: 's11-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&auto=format&fit=crop&q=80',
        textHi: 'जल देवता ने सोने और चाँदी की कुल्हाड़ियाँ दिखाईं, पर लकड़हारे ने लालच किए बिना मना कर दिया।',
        textEn: 'The water deity presented golden and silver axes, but the honest man refused them.',
        captionHi: 'दृश्य 2: ईमानदारी की परीक्षा',
      },
      {
        id: 's11-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        textHi: 'अपनी लोहे की कुल्हाड़ी पहचानते ही देवता ने प्रसन्न होकर तीनों कुल्हाड़ियाँ उपहार में दे दीं।',
        textEn: 'Delighted by his purity, the spirit gifted him all three axes as a reward.',
        captionHi: 'दृश्य 3: ईमानदारी का पुरस्कार',
      },
    ],
  },
  {
    id: 'story-12',
    number: 12,
    titleHi: 'नन्हा हाथी और दर्जी की दुकान',
    titleEn: 'Gajraj aur Darji (The Elephant and the Tailor)',
    summaryHi: 'दर्जी के बेटे की एक शरारत ने हाथी को दुखी किया, और हाथी ने कीचड़ का पानी छिड़क कर सबक सिखाया।',
    summaryEn: 'How an elephant taught a tailor’s mischievous son a muddy lesson about mutual respect.',
    contentHi: `चंदनपुर कस्बे में गजराज नाम का एक बहुत ही शांत और समझदार हाथी रहता था। वह हर सुबह नदी पर नहाने जाता था।

रास्ते में करीम चाचा नाम के एक दयालु दर्जी की दुकान पड़ती थी। करीम चाचा रोज़ गजराज की सूंड में कभी रसीला केला, तो कभी मीठा गन्ना प्यार से दिया करते थे। गजराज अपनी सूंड उठाकर करीम चाचा को सलाम करता था। दोनों में बड़ा स्नेह था।

एक दिन करीम चाचा किसी काम से बाहर गए हुए थे और दुकान पर उनका शरारती बेटा आसिफ बैठा हुआ था।

जब गजराज नदी से नहाकर लौटा और उसने प्यार से अपनी सूंड दुकान के दरवाजे पर बढ़ाई, तो आसिफ ने केला देने के बजाय अपनी सिलाई की नुकीली सुई गजराज की सूंड में चुभो दी!

गजराज को तेज दर्द हुआ। उसकी आँखों में आँसू आ गए। लेकिन उस भले हाथी ने वहाँ कोई उपद्रव नहीं किया। वह चुपचाप नदी की ओर वापस चला गया।

नदी पर पहुँचकर गजराज ने अपनी सूंड में ढेर सारा गंदा और कीचड़ भरा पानी भर लिया।

वह सीधे दर्जी की दुकान पर लौटा। आसिफ कुर्सी पर बैठकर ग्राहकों के नए-नए सिले हुए कीमती रेशमी कुर्ते और लहंगे सजा रहा था।

गजराज ने दुकान के अंदर अपनी सूंड घुमाई और "फूssss!" करके सारा कीचड़ का पानी दुकान के अंदर नए कपड़ों पर छिड़क दिया! सारे नए कपड़े खराब हो गए और आसिफ भी कीचड़ से सन गया।

आसिफ रोने लगा। तभी करीम चाचा आ गए। पूरी बात जानकर उन्होंने अपने बेटे को डांटा, "जैसा व्यवहार तुम दूसरों के साथ करोगे, वैसा ही बदला तुम्हें मिलेगा! बेज़ुबान जीवों को कभी सताना नहीं चाहिए।"

आसिफ ने कान पकड़कर गजराज से माफ़ी माँगी।`,
    contentEn: `In a bustling town lived Gajraj, a gentle temple elephant beloved by everyone. Every morning, he strolled gracefully to the sacred river for his bath.

Along the bazaar street was the shop of Master Karim, an affectionate old tailor. Every day, Karim offered Gajraj a ripe banana or fresh sugarcane stalks. The elephant would trumpet softly and salute with his trunk.

One afternoon, Karim traveled to the wholesale market, leaving his mischievous son Asif in charge of the counter.

When Gajraj paused by the shop window and extended his trunk expecting a snack, Asif giggled maliciously and jabbed a sharp tailoring needle into the tender tip of the elephant's trunk!

Pain shot through Gajraj. Tears welled in his large brown eyes, but instead of retaliating in anger, he turned around quietly and padded back to the riverbank.

At the water's edge, Gajraj sucked gallons of murky, muddy pond water into his long trunk.

He marched back to the tailor’s stall. Asif was proudly ironing expensive silk dresses and embroidered sherwanis meant for an upcoming wedding.

With a thunderous whoosh, Gajraj sprayed the muddy torrent across the entire shop! The pristine silks were ruined, and Asif was drenched from head to toe in brown muck.

Asif wailed in dismay just as his father Karim walked in. Hearing the truth, Karim scolded his son severely, "You reap what you sow! Cruelty to innocent creatures always returns tenfold."

Ashamed and weeping, Asif bowed before Gajraj and begged for forgiveness, learning never to mistreat any living being again.`,
    moralHi: 'जैसा व्यवहार हम दूसरों के साथ करते हैं, वैसा ही परिणाम हमें भुगतना पड़ता है। बेज़ुबान प्राणियों के प्रति सदैव दयालु रहें।',
    moralEn: 'Treat others as you wish to be treated. Cruelty invites its own punishment.',
    category: 'animals',
    coverImage: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 475,
    isFeatured: false,
    format: 'picture_book',
    scenes: [
      {
        id: 's12-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
        textHi: 'हाथी रोज़ दर्जी की दुकान पर रुकता था और दर्जी उसे प्यार से मीठे फल खिलाता था।',
        textEn: 'Every morning, the tailor treated the gentle elephant to fresh bananas.',
        captionHi: 'दृश्य 1: दर्जी और हाथी की दोस्ती',
      },
      {
        id: 's12-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
        textHi: 'शरारती बेटे ने फल देने की जगह हाथी की सूंड में नुकीली सुई चुभो दी।',
        textEn: 'The tailor’s naughty son pricked the elephant’s trunk with a sharp needle.',
        captionHi: 'दृश्य 2: सुई चुभाने की शरारत',
      },
      {
        id: 's12-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
        textHi: 'हाथी ने नदी का कीचड़ भरा पानी लाकर दुकान पर छिड़क दिया और बेटे को गलती का एहसास हुआ।',
        textEn: 'The elephant returned with muddy water and taught the boy a memorable lesson.',
        captionHi: 'दृश्य 3: जैसे को तैसा सबक',
      },
    ],
  },
  {
    id: 'story-13',
    number: 13,
    titleHi: 'चतुर बीरबल और कौवों की गिनती',
    titleEn: 'Birbal aur Kauwo ki Ginti (Birbal and the Crows of the Kingdom)',
    summaryHi: 'बादशाह अकबर ने पूछा कि हमारे राज्य में कितने कौवे हैं? बीरबल ने अपनी अद्भुत बुद्धि से लाजवाब उत्तर दिया।',
    summaryEn: 'Emperor Akbar tests his court with an impossible question, and witty Birbal provides a brilliant answer.',
    contentHi: `बादशाह अकबर और उनके नवरत्नों में सबसे चतुर मंत्री बीरबल के किस्से पूरे हिंदुस्तान में मशहूर थे।

एक सुहावनी सुबह, बादशाह अकबर बीरबल के साथ शाही महल के बगीचे में टहल रहे थे। चारों तरफ रंग-बिरंगे फूल खिले थे और पेड़ों पर बहुत सारे काले कौवे काँव-काँव कर रहे थे।

बादशाह अकबर के मन में बीरबल की परीक्षा लेने का विचार आया। उन्होंने अचानक रुककर बीरबल से पूछा, "बीरबल! तुम बहुत बुद्धिमान हो। क्या तुम बता सकते हो कि हमारे पूरे आगरा राज्य में कुल कितने कौवे हैं?"

दरबार के अन्य दरबारी जो पीछे चल रहे थे, मन ही मन हँसने लगे कि अब बीरबल फँस गया! आसमान में उड़ते कौवों को कौन गिन सकता है?

बीरबल ने एक क्षण के लिए अपनी आँखें बंद कीं, आसमान की ओर देखा और फिर मुस्कुराते हुए सिर झुकाकर बोले, "जहाँपनाह! हमारे राज्य में कुल मिलाकर छियानवे हजार चार सौ बासठ (96,462) कौवे हैं!"

अकबर हैरान रह गए। उन्होंने बीरबल की आँखों में देखते हुए पूछा, "बीरबल, तुम इतने विश्वास के साथ यह संख्या कैसे कह सकते हो? यदि गिनती में कौवे कम या ज्यादा निकले तो?"

बीरबल ने बड़ी चतुराई से उत्तर दिया, "आलमपनाह! यदि कौवों की संख्या ज्यादा निकलती है, तो इसका अर्थ है कि उनके रिश्तेदार दूसरे राज्यों से उनसे मिलने आए हुए हैं। और यदि संख्या कम निकलती है, तो इसका अर्थ है कि हमारे राज्य के कौवे अपने रिश्तेदारों से मिलने दूसरे राज्यों में छुट्टियाँ मनाने गए हैं!"

यह सुनकर बादशाह अकबर और सभी दरबारी ठहाका मारकर हँस पड़े। अकबर ने खुश होकर अपने गले का कीमती मोतियों का हार उतारकर बीरबल को भेंट कर दिया।`,
    contentEn: `In the majestic imperial gardens of Agra, Emperor Akbar was enjoying a tranquil dawn promenade accompanied by his counselor Birbal.

Looking up into the boughs of fruit trees where countless crows were chirping, an impish idea crossed the Emperor’s mind. Turning to Birbal, he posed a tricky challenge:

"Tell me, wise Birbal, you claim to have answers to all queries. Can you calculate the precise number of crows residing within our vast capital city?"

Courtiers walking behind smiled quietly, confident that Birbal was finally trapped by an unanswerable question.

Birbal paused, looked up into the branches, closed his eyes for a few moments, and bowed reverently, "Your Imperial Majesty! There are exactly ninety-six thousand, four hundred and sixty-two (96,462) crows in the city."

Akbar raised an eyebrow with amusement, "How can you be so certain? What if upon counting, we discover more or fewer crows than your claim?"

Birbal smiled smoothly, "If there are more crows, My Lord, it simply means their cousins from neighboring provinces have arrived on holiday. And if there are fewer, it means our local crows have traveled to visit their relatives abroad!"

A roar of delighted laughter broke out across the court. Emperor Akbar patted Birbal’s shoulder with admiration and draped his own pearl necklace over his clever advisor.`,
    moralHi: 'सच्ची बुद्धि और हाज़िरजवाबी से असंभव प्रतीत होने वाली स्थिति का भी सुंदर और सकारात्मक समाधान निकल आता है।',
    moralEn: 'Quick wit, cheerful humor, and intelligence can turn any difficult trial into triumph.',
    category: 'wisdom',
    coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '6-13 वर्ष',
    likes: 580,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's13-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
        textHi: 'बादशाह अकबर ने बगीचे में टहलते हुए बीरबल से राज्य के सभी कौवों की गिनती पूछी।',
        textEn: 'Emperor Akbar challenged Birbal to count the total crows in the capital kingdom.',
        captionHi: 'दृश्य 1: शाही बगीचे में सवाल',
      },
      {
        id: 's13-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
        textHi: 'पेड़ों पर बैठे कौवों को देखकर बीरबल ने तुरंत 96,462 कौवों की सटीक संख्या बता दी।',
        textEn: 'Birbal announced the exact figure of 96,462 crows without hesitation.',
        captionHi: 'दृश्य 2: बीरबल का सटीक जवाब',
      },
      {
        id: 's13-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
        textHi: 'कौवों के रिश्तेदारों की चतुराई भरी दलील सुनकर बादशाह अकबर ने बीरबल को मोतियों का हार दिया।',
        textEn: 'Delighted by Birbal’s humorous logic, Akbar rewarded him with precious royal pearls.',
        captionHi: 'दृश्य 3: सम्मान और पुरस्कार',
      },
    ],
  },
  {
    id: 'story-14',
    number: 14,
    titleHi: 'परिश्रमी चींटी और आलसी टिड्डा',
    titleEn: 'Parishrami Cheenti (The Ant and the Grasshopper)',
    summaryHi: 'गर्मियों में मेहनत करके चींटी ने अनाज जमा किया, जबकि टिड्डा नाचता रहा। सर्दियों में टिड्डे को समझ आई मेहनत की कीमत।',
    summaryEn: 'While the prudent ant stores grain for winter, the carefree grasshopper sings away the summer.',
    contentHi: `वसंत और गर्मी के सुहावने दिन थे। खेतों में सुनहरी धूप खिली थी और रंग-बिरंगे फूल महक रहे थे।

एक खेत में 'पिंकी' नाम की एक नन्ही चींटी दिन-रात पसीना बहाकर अपने बिल में अनाज के भारी दाने ढो रही थी। वह अपने वजन से दोगुने दाने अपनी पीठ पर उठाकर ले जाती थी।

वहीं पास की हरी घास पर 'टिंकू' नाम का एक टिड्डा बैठा हुआ था। वह गिटार बजाता, गाना गाता और दिन भर नाचता रहता था।

टिंकू ने चींटी को देखकर हँसते हुए कहा, "अरे पिंकी बहन! इतनी प्यारी धूप है, मौसम कितना खुशनुमा है। तुम क्यों दिन भर मजदूरी कर रही हो? आओ मेरे साथ झूमो, गाओ और जिंदगी का मजा लो!"

चींटी ने हाँफते हुए कहा, "टिंकू भाई, अभी गर्मी के दिन हैं इसलिए भोजन आसानी से मिल रहा है। जब कड़ाके की ठंड और बर्फबारी होगी, तो बाहर खाने को एक तिनका भी नहीं मिलेगा। मैं सर्दियों के लिए खाना जमा कर रही हूँ। तुम्हें भी कुछ तैयारी कर लेनी चाहिए।"

टिड्डा खिलखिलाकर हँसा, "सर्दियाँ अभी बहुत दूर हैं! कल की चिंता आज क्यों करूँ?" और वह फिर गाने लगा।

महीने बीत गए। आसमान में काले बादल छा गए और बर्फीली हवाएं चलने लगीं। हर तरफ बर्फ की सफेद चादर बिछ गई।

टिंकू टिड्डे को खाने के लिए एक दाना या हरी पत्ती भी नहीं मिली। वह भूख और ठंड से ठिठुरने लगा। जब उसकी जान पर बन आई, तो वह कांपते हुए पिंकी चींटी के बिल पर पहुँचा और गिड़गिड़ाया, "बहन! मुझे कुछ खाने को दे दो, वरना मैं ठंड और भूख से मर जाऊँगा!"

दयालु चींटी ने उसे अंदर बुलाया, गर्म सूप और मक्का का दलिया खिलाया। उसने कहा, "टिंकू भाई, मौज-मस्ती बुरी नहीं है, लेकिन समय रहते भविष्य की तैयारी करना सबसे जरूरी है।" टिड्डे ने कान पकड़े और मेहनत का महत्व समझा।`,
    contentEn: `In a bright clover field, warm summer sunbeams danced over golden wildflowers.

A tiny, hardworking ant named Pinky was toiling from dawn to dusk, carrying heavy wheat kernels twice her size back to her underground granary.

Lounging on a tall blade of meadow grass was Tinku the grasshopper, chirping carefree tunes and dancing in the breeze.

"Why sweat under the scorching sun, little neighbor?" laughed Tinku. "Summer is a carnival! Drop that heavy grain and sing with me!"

Pinky paused, wiping her brow, "Winter is coming, Tinku. When cold blizzards freeze the earth, there will be no food anywhere. I am preparing so my family survives. You ought to store some food too."

Tinku shrugged, "Winter is months away! Why spoil today worrying about tomorrow?" and continued plucking his grass-leaf fiddle.

Soon, the warm days faded. Icy gales roared across barren plains, blanketing the fields in deep white frost.

Tinku searched desperately, but every bush was bare. Shivering violently with hunger and frostbite, he stumbled to Pinky's warm door and knocked feebly, "Kind friend, spare a crust of bread, or I shall perish!"

The compassionate ant welcomed him inside, handed him a bowl of steaming corn soup, and said softly, "Fun has its place, Tinku, but honest labor secures tomorrow." Humbled and grateful, the grasshopper vowed never to idle away precious time again.`,
    moralHi: 'आज की मेहनत ही कल का सुख सुनिश्चित करती है। समय रहते की गई तैयारी हमें संकट से बचाती है।',
    moralEn: 'Work today to enjoy tomorrow. Prudence and diligence conquer hardship.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 490,
    isFeatured: false,
    format: 'picture_book',
    scenes: [
      {
        id: 's14-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
        textHi: 'गर्मियों में चींटी दिन भर मेहनत करके अनाज जमा करती रही, जबकि टिड्डा केवल नाचता और गाता रहा।',
        textEn: 'During warm summer, the diligent ant gathered grain while the grasshopper sang idle tunes.',
        captionHi: 'दृश्य 1: चींटी का परिश्रम',
      },
      {
        id: 's14-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=800&auto=format&fit=crop&q=80',
        textHi: 'कड़ाके की सर्दियाँ आईं और चारों तरफ बर्फ जम गई; टिड्डे को खाने के लिए एक दाना भी नहीं मिला।',
        textEn: 'Harsh winter blanketed the land with snow; the hungry grasshopper found nothing to eat.',
        captionHi: 'दृश्य 2: बर्फीली सर्दी का संकट',
      },
      {
        id: 's14-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
        textHi: 'दयालु चींटी ने टिड्डे को भोजन दिया और टिड्डे ने जीवन भर मेहनत करने का संकल्प लिया।',
        textEn: 'The kind ant shared her meal, teaching the grasshopper the lifelong value of hard work.',
        captionHi: 'दृश्य 3: दया और सीख',
      },
    ],
  },
  {
    id: 'story-15',
    number: 15,
    titleHi: 'बगुला भगत और समझदार केकड़ा',
    titleEn: 'Bagula Bhagat aur Kekda (The Heron and the Crab)',
    summaryHi: 'धूर्त बगुले ने सूखे का बहाना बनाकर मछलियों को छल से खाया, पर चतुर केकड़े ने अपनी सूझबूझ से पाखंडी का अंत किया।',
    summaryEn: 'How an alert crab saw through the false pretenses of a hypocritical heron and saved the pond.',
    contentHi: `एक बहुत सुंदर झील में सैकड़ों रंग-बिरंगी मछलियाँ, मेंढक और केकड़े खुशी से रहते थे। उसी झील के किनारे एक बूढ़ा बगुला रहता था, जो शिकार करने में असमर्थ हो चुका था।

भूख से परेशान बगुले ने एक कुटिल योजना बनाई। वह झील के किनारे एक पैर पर खड़ा होकर आँखों से आँसू बहाने लगा और तपस्वी की तरह शांत दिखने का ढोंग करने लगा।

एक केकड़े ने बगुले के पास जाकर पूछा, "बगुला मामा! आज तुम मछलियों का शिकार करने की बजाय रो क्यों रहे हो?"

बगुला भारी मन से बोला, "बेटा! मैंने ज्योतिषियों से सुना है कि इस वर्ष बारह वर्षों का भयानक सूखा पड़ने वाला है। यह झील पूरी तरह सूख जाएगी और तुम सब तड़प-तड़प कर मर जाओगे। मुझे तुम सब की बहुत चिंता हो रही है।"

झील के सभी जीव डर गए और रोने लगे। बगुले ने कहा, "घबराओ मत! यहाँ से कुछ दूर पहाड़ों के पीछे एक कभी न सूखने वाली गहरी झील है। यदि तुम चाहो तो मैं रोज़ कुछ-कुछ जीवों को अपनी चोंच में बिठाकर वहाँ पहुँचा सकता हूँ।"

नासमझ मछलियों ने बगुले पर भरोसा कर लिया। बगुला रोज़ कुछ मछलियों को अपनी चोंच में उठाता और दूर एक बड़ी पहाड़ी शिला पर ले जाकर उन्हें चट कर जाता! कुछ ही हफ्तों में बगुला मोटा-ताजा हो गया।

एक दिन केकड़े ने कहा, "मामा! आज मेरी बारी है, मुझे भी उस नई झील में ले चलो।" बगुले ने सोचा, "रोज़ मछली खाकर ऊब गया हूँ, आज केकड़े का स्वादिष्ट मांस खाऊँगा।"

बगुला केकड़े को अपनी गर्दन पर बिठाकर उड़ा। उड़ते समय केकड़े ने नीचे देखा तो वहाँ कोई झील नहीं थी, बल्कि एक पहाड़ी पत्थर पर मछलियों के ढेरों कांटे और हड्डियाँ बिखरी हुई थीं!

केकड़ा तुरंत समझ गया कि यह दुष्ट सबको धोखे से मारकर खा रहा है। जैसे ही बगुला पत्थर पर उतरने लगा, केकड़े ने अपने दोनों मजबूत और तेज पंजों से बगुले की गर्दन को कसकर दबा दिया!

बगुला तड़पने लगा और जमीन पर गिर पड़ा। केकड़ा सुरक्षित झील पर लौटा और उसने सभी जीवों को धूर्त बगुले की सच्चाई बताकर उनकी जान बचा ली।`,
    contentEn: `In a shimmering lotus lake lived schools of silver fish, frogs, and an observant old crab. On the grassy bank perched an aged heron who was too weak to catch fish.

Driven by hunger, the heron devised a deceitful plan. Standing on one leg with closed eyes, he let tears roll down his beak, pretending to be a saintly ascetic.

The crab crawled up and asked, "Uncle Heron, why do you weep instead of hunting today?"

The heron sighed, "Alas, my heart breaks! A prophet told me a twelve-year drought will dry this lake to dust. All my dear aquatic neighbors will perish. My grief knows no bounds."

Panic swept through the pond. The heron offered a solution: "Fear not! Over the northern hills lies an emerald mountain lake fed by eternal springs. I can carry a few of you each day to that safe paradise."

Gullible fish lined up eagerly. Day after day, the heron flew off with a mouthful of fish, landed on a secluded rock, and devoured them. He grew plump and sleek.

Eventually, the crab requested, "Uncle, today is my turn to visit the mountain paradise." The heron thought, "I have grown tired of fish; crab meat will be a welcome delicacy!"

The crab grasped the heron's neck as they soared into the blue sky. Looking down, the crab saw no lake, but a rocky ledge littered with fish bones and skeletal remains!

Realizing the wicked deception, the crab did not panic. Just as the heron tilted his wings to swoop down, the crab clamped his razor-sharp pincers around the heron’s throat with all his might!

Choking, the treacherous bird collapsed onto the earth. The crab made his way back to the pond and exposed the villain's scheme, preserving the lives of all remaining creatures.`,
    moralHi: 'धूर्त और पाखंडी लोगों की चिकनी बातों पर कभी अंधविश्वास न करें। सजगता और साहस से हर धोखे का मुकाबला किया जा सकता है।',
    moralEn: 'Never place blind trust in smooth-talking hypocrites. Courage and vigilance defeat deceit.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '6-12 वर्ष',
    likes: 530,
    isFeatured: false,
    format: 'picture_book',
    scenes: [
      {
        id: 's15-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        textHi: 'बूढ़े बगुले ने सूखे का झूठा डर दिखाकर झील की भोली-भाली मछलियों को अपने जाल में फँसाया।',
        textEn: 'The cunning heron manufactured a false drought story to deceive the innocent pond fish.',
        captionHi: 'दृश्य 1: पाखंडी बगुले का छल',
      },
      {
        id: 's15-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
        textHi: 'हवा में उड़ते हुए केकड़े ने नीचे पहाड़ी पर मछलियों के कांटे देखे और बगुले की धूर्तता भांप ली।',
        textEn: 'In mid-air, the vigilant crab spotted fish skeletons and realized the treacherous trap.',
        captionHi: 'दृश्य 2: सच्चाई का पर्दाफाश',
      },
      {
        id: 's15-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        textHi: 'केकड़े ने अपने तेज पंजों से बगुले को सबक सिखाया और लौटकर सभी मित्रों की जान बचाई।',
        textEn: 'Clamping his claws, the brave crab defeated the villain and saved his pond friends.',
        captionHi: 'दृश्य 3: साहस और विजय',
      },
    ],
  },
  {
    id: 'story-16',
    number: 16,
    titleHi: 'जादुई सुनहरी चिड़िया और दयालु राजकुमारी',
    titleEn: 'Jadui Chidiya (The Golden Bird and the Kind Princess)',
    summaryHi: 'घायल जादुई चिड़िया की सेवा करने वाली राजकुमारी को चिड़िया ने पूरे राज्य की रक्षा का वरदान दिया।',
    summaryEn: 'A compassionate princess nurses an injured enchanted bird, whose magical melody saves the kingdom.',
    contentHi: `रूपनगर राज्य में राजकुमारी तारा रहती थी। वह जितनी रूपवती थी, उससे कहीं अधिक उसका हृदय दया और करुणा से भरा था। वह पशु-पक्षियों और पेड़-पौधों से बहुत प्रेम करती थी।

एक शाम राजमहल के बगीचे में टहलते समय तारा ने गुलाब की झाड़ियों में एक नन्हीं सुनहरी चिड़िया को तड़पते देखा। किसी शिकारी का तीर उसके पंख में लगा हुआ था और वह खून से लथपथ थी। उसके पंख सोने की तरह चमक रहे थे।

राजकुमारी ने तुरंत दौड़कर चिड़िया को अपनी हथेली पर उठाया। उसने राजवैद्य से जड़ी-बूटियाँ मंगवाईं, चिड़िया के घाव धोए, मरहम लगाया और रेशमी कपड़े पर सुलाया। तारा रात भर जागकर चिड़िया की सेवा करती रही।

कुछ ही दिनों में चिड़िया पूरी तरह स्वस्थ हो गई। जब राजकुमारी ने उसे उड़ने के लिए खिड़की पर बैठाया, तो चिड़िया मनुष्य की मीठी वाणी में बोली, "राजकुमारी तारा! मैं परियों के देश की जादुई सुनहरी चिड़िया हूँ। तुम्हारी निस्वार्थ दया ने मेरे प्राण बचाए हैं। जब भी तुम्हारे राज्य पर कोई संकट आए, तो मुझे याद करना।" यह कहकर वह आसमान में उड़ गई।

एक वर्ष बाद, रूपनगर में भयंकर सूखा पड़ा। नदियाँ सूख गईं, खेत बंजर हो गए और प्रजा दाने-दाने को तरसने लगी। राजा और मंत्री बेबस हो गए।

तारा को जादुई चिड़िया की याद आई। उसने बगीचे में खड़े होकर सच्चे दिल से पुकारा, "हे सुनहरी चिड़िया! मेरी प्रजा भूख-प्यास से तड़प रही है, कृपया हमारी सहायता करो!"

पलक झपकते ही आसमान से एक स्वर्णिम प्रकाश उतरा और वही सुनहरी चिड़िया प्रकट हुई! उसने आकाश में उड़ते हुए एक अत्यंत मधुर और अलौकिक संगीत गाना शुरू किया।

उस जादुई गीत के गूंजते ही आसमान में ठंडे, जल से भरे काले-काले मेघ उमड़ पड़े। झमाझम मूसलाधार अमृत वर्षा होने लगी! नदियाँ-तालाब लबालब भर गए, खेत हरे-भरे हो गए और पूरी प्रजा में खुशहाली लौट आई।

राजकुमारी तारा की दयालुता ने पूरे राज्य को नया जीवन प्रदान किया।`,
    contentEn: `In the kingdom of Roopnagar lived Princess Tara, whose radiant beauty was matched only by her gentle compassion toward every living creature.

One twilight, walking through the palace rose gardens, she found an enchanted golden bird fluttering helplessly with an arrow lodged in its wing. Its feathers glowed with celestial luminescence.

Cradling the delicate creature in her silk scarf, Tara cleansed the wound with rosewater, applied soothing herbal balms, and nursed it through the night with drops of sweet honey.

Within a fortnight, the bird was fully healed. As Tara placed it on the marble windowsill to fly free, the bird spoke in a bell-like voice, "Kind Princess, I am the Golden Bird of the Faerie Realm. Your selfless mercy has saved my life. Whenever your kingdom faces despair, call upon me."

A year later, an unforgiving drought struck the land. Reservoirs ran dry, fields turned to dust, and famine threatened the realm.

Remembering the vow, Princess Tara stood beneath the palace sky and called from her heart, "O Golden Bird, come to our aid; my people thirst and starve!"

In a flash of golden dawn, the magnificent bird descended! Hovering above the citadel, it sang an enchanting melody so pure that clouds gathered like billowing silver silks.

Sweet rain poured over the parched hills, filling rivers to their brims and turning the withered plains into lush emerald pastures. The kingdom rejoiced in peace and abundance, forever thankful for the princess’s loving heart.`,
    moralHi: 'दया और करुणा में संसार की सबसे बड़ी शक्ति है। बेज़ुबान जीवों पर किया गया उपकार कभी व्यर्थ नहीं जाता।',
    moralEn: 'Compassion is the truest royalty. Kindness shown to the humble returns as blessings.',
    category: 'bedtime',
    coverImage: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '4-12 वर्ष',
    likes: 640,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's16-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
        textHi: 'राजकुमारी तारा ने बगीचे में घायल सुनहरी चिड़िया को उठाया और प्यार से उसका इलाज किया।',
        textEn: 'Princess Tara found the injured golden bird and nursed it back to health with tender care.',
        captionHi: 'दृश्य 1: घायल चिड़िया की सेवा',
      },
      {
        id: 's16-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=800&auto=format&fit=crop&q=80',
        textHi: 'स्वस्थ होकर चिड़िया ने विपत्ति के समय सहायता करने का वचन दिया और आकाश में उड़ गई।',
        textEn: 'Healed, the golden bird promised to return in times of need and flew into the sky.',
        captionHi: 'दृश्य 2: आभार और वचन',
      },
      {
        id: 's16-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
        textHi: 'सूखे के समय चिड़िया ने मधुर गीत गाकर बारिश बुलाई और पूरे राज्य को हरा-भरा कर दिया।',
        textEn: 'During drought, the bird sang an enchanting song, bringing rain and prosperity to the realm.',
        captionHi: 'दृश्य 3: अमृत वर्षा और खुशहाली',
      },
    ],
  },

  // =========================================================================
  // 17. 🦊 चालाक लोमड़ी और खट्टे अंगूर (THE FOX AND SOUR GRAPES)
  // =========================================================================
  {
    id: 'story-17',
    number: 17,
    titleHi: 'चालाक लोमड़ी और खट्टे अंगूर',
    titleEn: 'Chalak Lomdi (The Fox and the Sour Grapes)',
    summaryHi: 'ऊँचे मचान पर लटके रसीले अंगूर जब लोमड़ी की पहुँच से बाहर रहे, तो उसने बहाना बनाया कि अंगूर खट्टे हैं।',
    summaryEn: 'Unable to reach the luscious purple grapes dangling on high vines, a cunning fox pretends they are sour.',
    contentHi: `पतझड़ की एक सुनहरी दोपहर में लोमड़ी 'रूपा' जंगल के किनारे घूम रही थी। सुबह से उसे खाने के लिए कुछ नहीं मिला था और उसके पेट में चूहे कूद रहे थे।

घूमते-घूमते वह एक सुंदर अंगूर के बगीचे में पहुँची। वहाँ एक ऊँचे मचान पर पके, रसीले, बैंगनी अंगूरों के बड़े-बड़े गुच्छे लटक रहे थे। धूप में चमकते अंगूरों को देखकर रूपा के मुँह में पानी भर आया।

"वाह! क्या बात है! ऐसे मीठे और रसीले अंगूर मिल जाएँ तो आज का दिन बन जाए!" रूपा ने मन ही मन सोचा।

उसने अंगूर के गुच्छे को निशाना बनाया और 'ज़ूम!' करके ऊपर छलांग लगाई। लेकिन हाय! अंगूर मचान पर बहुत ऊँचे थे और उसकी छलांग थोड़ी छोटी रह गई।

लोमड़ी ने हार नहीं मानी। वह चार कदम पीछे हटी, तेज़ी से दौड़ी और पूरी ताकत से दोबारा उछली। इस बार भी उसके पंजे अंगूरों से बस एक बित्ता दूर रह गए।

उसने बार-बार, दसियों बार छलांग लगाई—कभी दाईं ओर से, कभी बाईं ओर से। लेकिन अंगूर बहुत ऊँचाई पर थे। अंत में लोमड़ी पसीने से लथपथ होकर जमीन पर गिर पड़ी। उसके पैर काँपने लगे थे।

जब उसे यकीन हो गया कि वह किसी भी तरह अंगूरों तक नहीं पहुँच सकती, तो उसने अपनी पूँछ उठाई, अपनी नाक सिकोड़ी और घमंड से बोली, "हूँ! इन अंगूरों के लिए इतनी मेहनत कौन करे? मुझे पता है कि ये अंगूर बिल्कुल कच्चे और खट्टे हैं! इन्हें खाऊँगी तो मेरा गला खराब हो जाएगा!"

यह कहकर वह अपने झूठे अहंकार को तसल्ली देती हुई वहाँ से चुपचाप चली गई।`,
    contentEn: `On a golden autumn afternoon, Rupa the fox trotted along the forest boundary. Her belly rumbled loudly, for she had tasted not a scrap of food since sunrise.

Presently, she slipped into an expansive orchard vineyard. High upon an overhead wooden arbor hung pendulous clusters of ripe, dark purple grapes, glistening in the warm sunshine. The sight made her jaws water.

"My goodness!" thought Rupa, smacking her lips. "Those look like nectar fit for royalty!"

She took aim, crouched, and leapt into the air with all her might. Alas, the arbor was lofty, and her paws snatched empty breeze just inches below the fruit.

Not one to quit easily, Rupa retreated several strides, took a running sprint, and sprang skyward again. Snip! Her teeth snapped shut on thin air.

Time after time she jumped—bounding from the left, leaping from the right—until her breath was ragged, her fur soaked in sweat, and her limbs trembling with exhaustion.

Realizing the fruit hung hopelessly out of reach, she smoothed her tail, curled her snout dismissively, and announced to the trees, "Bah! Why waste precious energy on such worthless fruit? I can see from here they are dreadfully sour! Eating them would only set my teeth on edge!"

With her pride comforted by a petty excuse, she strutted away with her chin held high.`,
    moralHi: 'जब कोई अपनी कमज़ोरी या असफलता स्वीकार नहीं कर पाता, तो वह चीज़ में ही खोट निकालने लगता है। बहाने बनाने के बजाय अपनी कमियों को पहचानना चाहिए।',
    moralEn: 'It is easy to despise what you cannot get. Blaming the goal instead of working on your own limits is foolish pride.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '3-9 वर्ष',
    likes: 580,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's17-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80',
        textHi: 'भूखी लोमड़ी ने बगीचे में ऊँचे मचान पर लटके रसीले अंगूर देखे और ललचा गई।',
        textEn: 'A hungry fox wandered into an orchard and spotted juicy grapes high on a vine.',
        captionHi: 'दृश्य 1: रसीले अंगूरों का दीदार',
      },
      {
        id: 's17-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80',
        textHi: 'लोमड़ी ने बार-बार ऊँची छलांग लगाई लेकिन अंगूर बहुत ऊँचाई पर थे।',
        textEn: 'She sprang into the air repeatedly, but could not touch the lofty clusters.',
        captionHi: 'दृश्य 2: बार-बार विफल प्रयास',
      },
      {
        id: 's17-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80',
        textHi: 'थककर लोमड़ी ने बहाना बनाया—"अंगूर खट्टे हैं, मुझे नहीं चाहिए!" और चली गई।',
        textEn: 'Exhausted, she walked away claiming the grapes were sour and unworthy.',
        captionHi: 'दृश्य 3: खट्टे अंगूरों का झूठा बहाना',
      },
    ],
    vocabulary: [
      { word: 'मचान (Arbor/Trellis)', meaningHi: 'बेल चढ़ाने का लकड़ी का ढाँचा', meaningEn: 'Climbing vine trellis' },
      { word: 'अहंकार (Ego/Pride)', meaningHi: 'घमंड', meaningEn: 'False pride' },
      { word: 'रसीले (Juicy)', meaningHi: 'रस से भरे हुए', meaningEn: 'Succulent' },
    ],
    discussionQuestions: [
      'लोमड़ी अंगूरों तक क्यों नहीं पहुँच सकी?',
      'उसने अंगूरों को खट्टा क्यों कहा?',
    ],
  },

  // =========================================================================
  // 18. 🕊️ परोपकारी चींटी और दयालु कबूतर (THE ANT AND THE DOVE)
  // =========================================================================
  {
    id: 'story-18',
    number: 18,
    titleHi: 'परोपकारी चींटी और दयालु कबूतर',
    titleEn: 'Chinti aur Kabutar (The Ant and the Dove)',
    summaryHi: 'डूबती चींटी को कबूतर ने पत्ता डालकर बचाया; बाद में चींटी ने शिकारी के पैर में काटकर कबूतर की जान बचाई।',
    summaryEn: 'A dove drops a leaf to rescue a drowning ant; the grateful ant repays the favor by stinging an archer.',
    contentHi: `एक घने जंगल की शांत नदी किनारे पीपल का एक बड़ा पेड़ था। उस पेड़ पर एक सफेद और दयालु कबूतर घोंसला बनाकर रहता था। पेड़ की जड़ों के पास चींटियों की एक बस्ती थी।

एक दिन नन्ही चींटी पानी पीने के लिए नदी की धार पर गई। अचानक पानी की तेज़ लहर आई और चींटी बहते हुए गहरे पानी में गिर गई। वह पानी में हाथ-पैर मारने लगी और डूबने की कगार पर पहुँच गई।

पेड़ की डाल पर बैठे कबूतर ने चींटी को तड़पते देखा। उसका दिल भर आया। उसने तुरंत पेड़ से एक बड़ा, सूखा पीपल का पत्ता तोड़ा और अपनी चोंच में दबाकर नदी में चींटी के ठीक आगे गिरा दिया।

चींटी ने समझदारी दिखाई और तैरकर उस सूखे पत्ते पर चढ़ गई। पत्ता बहते-बहते किनारे की रेत पर जा टिका। चींटी सकुशल जमीन पर आ गई। उसने आसमान में देखकर कबूतर को दिल से धन्यवाद दिया।

कुछ हफ्तों बाद, जंगल में एक शिकारी आया। उसने पेड़ की डाल पर शांति से बैठे उसी सफेद कबूतर को देखा। शिकारी ने चुपके से अपना धनुष उठाया और कबूतर की ओर बाण का सटीक निशाना साधा।

कबूतर को इस खतरे की ज़रा भी भनक नहीं थी। लेकिन नीचे घूम रही उसी नन्ही चींटी ने शिकारी को बाण साधते देख लिया।

चींटी ने एक पल भी नहीं गँवाया। वह बिजली की गति से दौड़ी और सीधे शिकारी के नंगे पैर की उँगली पर चढ़कर अपनी पूरी ताकत से 'कटाक!' करके ज़ोर से काट लिया!

"आहहह!" शिकारी दर्द से चीख पड़ा और उसका हाथ काँप गया। उसका बाण निशाने से भटककर दूर झाड़ियों में जा लगा। आवाज़ सुनकर कबूतर सतर्क हो गया और फड़फड़ाते हुए सुरक्षित नीले आकाश में उड़ गया।

नन्ही चींटी ने साबित कर दिया कि निस्वार्थ भलाई कभी व्यर्थ नहीं जाती।`,
    contentEn: `Beside a tranquil forest stream stood a sacred fig tree, home to a pure white dove with a tender heart. Near its gnarled roots flourished a busy colony of ants.

One sweltering noon, a tiny ant climbed down the bank to sip water. A sudden ripple caught her foot, sweeping her into the swirling current. Thrashing frantically, she began to sink beneath the rapids.

Perched above, the dove noticed the little creature’s plight. Heart aching with pity, he swiftly plucked a broad green leaf and dropped it into the water right beside the ant.

Clambering aboard the floating raft, the ant rode the leaf safely to the sandy shoreline. Stepping onto dry grass, she looked up toward the branches with eyes full of unspoken gratitude.

A fortnight later, a hunter crept into the glade carrying a bow and feathered arrow. Spotting the peaceful dove roosting unaware, the poacher drew his bowstring back, aiming right at the bird’s breast.

The dove sensed nothing of the impending doom. But the little ant, scouring seeds nearby, saw the danger clearly.

Without a second’s hesitation, she dashed toward the archer, crawled onto his bare foot, and sank her tiny jaws deep into his flesh with all her might!

"Ouch!" cried the hunter, dropping his aim in agony. The arrow shot wildly into the ferns. Alerted by the commotion, the dove snapped open his snowy wings and flew high into the sanctuary of the heavens.

The good deed of yesterday had returned as a shield of life today.`,
    moralHi: 'कर भला तो हो भला। दूसरों की भलाई करने पर संकट के समय ईश्वर किसी न किसी रूप में हमारी रक्षा करते हैं।',
    moralEn: 'One good turn deserves another. Kindness ripples outward and returns when you need it most.',
    category: 'moral',
    coverImage: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '4-9 वर्ष',
    likes: 620,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's18-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
        textHi: 'डूबती चींटी को बचाने के लिए कबूतर ने पेड़ से सूखा पत्ता पानी में गिराया।',
        textEn: 'The kind dove dropped a leaf to rescue the drowning ant in the stream.',
        captionHi: 'दृश्य 1: कबूतर का उपकार',
      },
      {
        id: 's18-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
        textHi: 'पत्ते पर चढ़कर चींटी सकुशल किनारे पहुँच गई और कबूतर का आभार माना।',
        textEn: 'The ant floated safely to the dry shore upon the leaf.',
        captionHi: 'दृश्य 2: जीवनदान और आभार',
      },
      {
        id: 's18-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        textHi: 'शिकारी के निशाना साधते ही चींटी ने उसके पैर में काटा और कबूतर की जान बच गई।',
        textEn: 'The ant bit the hunter’s foot, spoiling his aim and saving the dove.',
        captionHi: 'दृश्य 3: भलाई का बदला भलाई',
      },
    ],
    vocabulary: [
      { word: 'परोपकारी (Benevolent)', meaningHi: 'दूसरों का भला करने वाला', meaningEn: 'Kind/Helpful to others' },
      { word: 'सकुशल (Safely)', meaningHi: 'बिना किसी चोट के ठीक-ठाक', meaningEn: 'Safe and sound' },
      { word: 'निशाना (Aim)', meaningHi: 'लक्ष्य साधना', meaningEn: 'Target' },
    ],
    discussionQuestions: [
      'कबूतर ने चींटी को नदी में डूबने से कैसे बचाया?',
      'चींटी ने कबूतर की जान शिकारी से कैसे बचाई?',
    ],
  },

  // =========================================================================
  // 19. 🐱 दो बिल्लियाँ और समझदार बंदर का तराजू (TWO CATS AND THE MONKEY)
  // =========================================================================
  {
    id: 'story-19',
    number: 19,
    titleHi: 'दो बिल्लियाँ और बंदर का तराजू',
    titleEn: 'Do Billiyan aur Bandar (Two Cats and the Monkey)',
    summaryHi: 'रोटी के बँटवारे पर आपस में झगड़ने वाली दो बिल्लियों की रोटी चालाक बंदर ने तराजू में बराबर तौलने के बहाने पूरी खा ली।',
    summaryEn: 'Two quarreling cats ask a sly monkey to divide a loaf of bread equally; nibble by nibble, he eats the entire prize.',
    contentHi: `एक बस्ती में 'मीनी' और 'किट्टी' नाम की दो प्यारी बिल्लियाँ रहती थीं। दोनों में अच्छी दोस्ती थी और वे मिलकर शिकार ढूंढती थीं।

एक दिन उन्हें एक रसोईघर की खिड़की के पास ताज़ी और खुशबूदार रोटी का एक बड़ा टुकड़ा मिला। दोनों बिल्लियों ने मिलकर रोटी को बाहर निकाला।

लेकिन जब खाने की बारी आई, तो दोनों में झगड़ा शुरू हो गया। मीनी बोली, "रोटी को पहले मैंने देखा था, इसलिए बड़ा टुकड़ा मैं लूँगी!" किट्टी गुर्राई, "नहीं! खिड़की से खींचकर मैंने बाहर निकाला था, इसलिए ज़्यादा हिस्सा मेरा है!"

दोनों बिल्लियाँ ज़ोर-ज़ोर से म्याऊँ-म्याऊँ करके लड़ने लगीं। पास के पेड़ पर बैठा 'कालू' नाम का एक चालाक बंदर यह सब देख रहा था।

बंदर झट से नीचे उतरा और मीठी आवाज़ में बोला, "अरे बहनों! तुम दोनों आपस में क्यों लड़ रही हो? मैं पंच बनकर तुम दोनों में रोटी का बिल्कुल बराबर-बराबर बँटवारा कर देता हूँ!"

बिल्लियाँ राज़ी हो गईं। बंदर तुरंत पेड़ के खोखल से अपना पुराना तराजू निकाल लाया।

बंदर ने रोटी के दो टुकड़े किए और तराजू के दोनों पलड़ों पर एक-एक टुकड़ा रख दिया। एक पलड़ा थोड़ा भारी हो गया और नीचे झुक गया।

बंदर ने सिर हिलाया, "ओह! यह टुकड़ा थोड़ा भारी है। रुको, मैं इसे काटकर बराबर कर देता हूँ।" उसने भारी वाले टुकड़े में से एक बड़ा कौर अपने मुँह में ठूँस लिया।

अब दूसरा पलड़ा भारी हो गया! बंदर ने कहा, "अरे! अब यह पलड़ा भारी हो गया!" उसने दूसरे टुकड़े में से भी एक बड़ा हिस्सा चबा लिया।

बंदर बार-बार कभी दाएँ पलड़े से तो कभी बाएँ पलड़े से रोटी खाता रहा। दोनों बिल्लियाँ बेबसी से अपनी रोटी को छोटा होते देखती रहीं।

जब रोटी के दो बहुत छोटे-छोटे टुकड़े बचे, तो बिल्लियाँ गिड़गिड़ाकर बोलीं, "बंदर भाई! बस करो, अब हम बचे हुए टुकड़े खुद बाँट लेंगे!"

बंदर हँसकर बोला, "और मेरी न्याय करने की मेहनत की मजदूरी कौन देगा? ये दो टुकड़े मेरी फीस हैं!" यह कहकर बंदर ने दोनों टुकड़े भी अपने मुँह में डाले और पेड़ पर चढ़ गया।

दोनों बिल्लियाँ अपना सिर पकड़कर पछताती रह गईं कि काश उन्होंने आपस में शांति से रोटी बाँट ली होती!`,
    contentEn: `In a quiet neighborhood lived two companion cats named Meeni and Kitty. Though friendly, neither liked to compromise.

One morning outside a bakery sill, they discovered a large, fragrant, golden loaf of flatbread. Together they dragged the prize into a shaded alley.

When it came time to feast, rivalry flared. Meeni hissed, "I spotted the bread first, so the larger half is mine!" Kitty arched her back, "Nonsense! My claws pulled it off the sill, so I deserve the lion’s share!"

As their fur bristled and claws unsheathed, a clever monkey named Kalu observed them from the boughs of a fig tree.

Leaping down with a conciliatory smile, the monkey purred, "Sisters, sisters! Why fight like foes over food? Let me act as your impartial judge and divide the loaf into two flawless, equal halves."

Relieved, the cats agreed. The monkey produced a pair of brass balance scales.

Breaking the bread in two, he placed a piece onto each pan. Naturally, one pan sank lower under slightly more weight.

"Tsk, tsk," clucked the monkey thoughtfully. "This left side is a trifle heavier. Let me adjust it." He snapped off a hefty mouthful from the heavier side and swallowed it greedily.

Now the right side tipped downwards! "Gracious me, now the right side is too heavy!" declared the monkey, taking an even bigger bite from the second slice.

Back and forth went the scale, and snap after bite went the monkey’s jaws. The cats watched in horror as their magnificent feast shrank to mere crumbs.

When only two pea-sized morsels remained, the cats cried out, "Stop, Master Monkey! We are satisfied—give us the crumbs and we shall manage!"

The monkey chuckled, pop! "And what of my consultation fee for rendering impartial justice? These crumbs belong to the judge!" He tossed both crumbs into his mouth and bounded merrily up into the tree.

Left with hollow bellies, the two cats sat in the dust, lamenting the folly of their selfish quarrel.`,
    moralHi: 'आपस की फूट और झगड़े में हमेशा किसी तीसरे का ही फ़ायदा होता है। आपस में मिल-बाँटकर प्रेम से रहना चाहिए।',
    moralEn: 'When two quarrel over spoils, a cunning third party walks away with the whole prize. Always share in peace.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '4-9 वर्ष',
    likes: 690,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's19-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
        textHi: 'दो बिल्लियों को रोटी मिली और वे बँटवारे को लेकर आपस में झगड़ने लगीं।',
        textEn: 'Two cats found a piece of bread and began fighting over who got the bigger share.',
        captionHi: 'दृश्य 1: रोटी पर आपसी झगड़ा',
      },
      {
        id: 's19-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&auto=format&fit=crop&q=80',
        textHi: 'चालाक बंदर तराजू लेकर आया और दोनों पलड़ों को बराबर करने के बहाने रोटी खाता रहा।',
        textEn: 'A cunning monkey brought scales and nibbled from each pan under the guise of balancing.',
        captionHi: 'दृश्य 2: चालाक बंदर का तराजू',
      },
      {
        id: 's19-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
        textHi: 'अंत में बंदर पूरी रोटी खा गया और दोनों बिल्लियाँ भूखी पछताती रह गईं।',
        textEn: 'The monkey devoured the entire bread, leaving both cats hungry and regretful.',
        captionHi: 'दृश्य 3: आपसी फूट का नुकसान',
      },
    ],
    vocabulary: [
      { word: 'तराजू (Balance Scales)', meaningHi: 'वजन तौलने का यंत्र', meaningEn: 'Weighing scales' },
      { word: 'बँटवारा (Division/Sharing)', meaningHi: 'आपस में बाँटना', meaningEn: 'Partition/Distribution' },
      { word: 'पछताना (To Regret)', meaningHi: 'गलती पर दुखी होना', meaningEn: 'To repent or lament' },
    ],
    discussionQuestions: [
      'बिल्लियाँ आपस में क्यों लड़ रही थीं?',
      'बंदर ने तराजू के बहाने क्या चालाकी की?',
    ],
  },

  // =========================================================================
  // 20. 🍲 बीरबल की खिचड़ी और दूर का दीया (BIRBAL'S KHICHDI)
  // =========================================================================
  {
    id: 'story-20',
    number: 20,
    titleHi: 'बीरबल की खिचड़ी और दूर का दीया',
    titleEn: 'Birbal ki Khichdi (Birbal’s Famous Khichdi)',
    summaryHi: 'कड़ाके की ठंड में यमुना के बर्फीले पानी में खड़े गरीब धोबी को इनाम दिलाने के लिए बीरबल ने पकाई अनोखी खिचड़ी।',
    summaryEn: 'To secure justice for a poor washerman who braved freezing waters, Birbal cooks his legendary high-hanging khichdi.',
    contentHi: `आगरा में कड़ाके की सर्दी पड़ रही थी। यमुना नदी का पानी बर्फ जैसा ठंडा था। एक शाम बादशाह अकबर ने दरबार में घोषणा की, "जो कोई इस कड़कड़ाती ठंड में रात भर यमुना के बर्फीले पानी में खड़ा रहेगा, उसे एक हज़ार सोने के सिक्के इनाम में दिए जाएँगे!"

दीनू नाम का एक गरीब धोबी अपने बीमार परिवार की मदद के लिए तैयार हो गया। वह पूरी रात काँपते हुए बर्फीले पानी में खड़ा रहा। दूर राजमहल की छत पर एक छोटा सा दीया टिमटिमा रहा था, जिसे देखकर दीनू ने मन ही मन साहस बटोरा और पूरी रात काट ली।

सुबह दीनू जब राजदरबार में इनाम लेने पहुँचा, तो अकबर ने पूछा, "तुम इतनी ठंड में पूरी रात कैसे खड़े रहे?"
दीनू ने हाथ जोड़कर कहा, "जहाँपनाह! मैं महल की छत पर जलते हुए दीये को देखकर अपना हौसला बढ़ाता रहा।"

एक दरबारी ने तुरंत कान भर दिए, "हुज़ूर! इसका मतलब है कि इसे महल के दीये से गर्मी मिल रही थी! इसे इनाम नहीं मिलना चाहिए!" अकबर ने दीनू को बिना इनाम के लौटा दिया।

बीरबल को यह अन्याय बहुत बुरा लगा। अगले दिन बीरबल दरबार नहीं आए। अकबर ने सैनिक भेजे, तो खबर मिली कि बीरबल अपनी खिचड़ी पका रहे हैं। दोपहर हो गई, शाम हो गई, पर बीरबल नहीं आए।

अकबर खुद बीरबल के घर पहुँचे। उन्होंने देखा कि ज़मीन पर एक छोटी सी आग जल रही थी, और उससे पाँच फुट ऊपर बाँस के खंभे पर खिचड़ी की हाँडी लटकी हुई थी!

अकबर ने हँसकर कहा, "बीरबल! तुम पागल हो गए हो क्या? इतनी दूर आग से यह खिचड़ी कभी नहीं पक सकती!"

बीरबल ने हाथ जोड़कर अत्यंत विनम्रता से कहा, "जहाँपनाह! अगर यमुना के बर्फीले पानी में खड़े दीनू को एक मील दूर महल की छत पर जलते छोटे से दीये से गर्मी मिल सकती है, तो मेरी यह हाँडी तो आग से सिर्फ पाँच फुट ही ऊपर है! यह खिचड़ी क्यों नहीं पकेगी?"

बादशाह अकबर को अपनी गलती का गहरा एहसास हुआ। उन्होंने तुरंत दीनू धोबी को बुलवाया और उसे सोने के सिक्कों की पूरी थैली देकर सम्मानित किया।`,
    contentEn: `Winter in Agra was bitter and icy. Strolling along the Yamuna riverbank, Emperor Akbar proclaimed a challenge: "Whosoever stands overnight in the freezing river waters shall receive a reward of one thousand gold mohurs!"

A destitute washerman named Deenu accepted the trial to buy medicine for his ailing daughter. Shivering to his bones, he stood waist-deep in the glacial waters through the night. Far across the city, a tiny earthen lamp flickered on the high terrace of the royal citadel. Gazing at that distant speck of light, Deenu kept his courage alive until dawn.

When Deenu arrived at court to claim his prize, Akbar asked how he survived the ordeal. Deenu bowed, "Majesty, I fixed my eyes upon the distant palace lamp, which gave my heart hope."

A jealous courtier interjected, "Then he absorbed the warmth of your royal lamp! He cheated and deserves no coin!" Akbar dismissed the poor man empty-handed.

Pained by this cruelty, Birbal stayed away from court the following day. When messengers reported that Birbal was busy cooking khichdi, Akbar rode to his advisor’s garden in curiosity.

There stood Birbal beside a blazing fire. But hanging from a bamboo tripod five feet in the air was a small clay cooking pot!

Akbar laughed aloud, "Have you lost your senses, Birbal? How can heat travel through five feet of winter air to boil rice?"

Birbal turned with a calm, piercing gaze, "Your Highness, if a poor man freezing in the river can absorb comforting warmth from a tiny lamp shining a mile away atop your fortress, surely this pot hanging mere feet above a blazing fire will cook in no time!"

Chastened and humbled, Emperor Akbar realized the injustice of his judgment. He summoned Deenu to the imperial throne room and bestowed upon him a velvet sack of one thousand gold coins.`,
    moralHi: 'सच्चे न्याय में बुद्धि और संवेदनशीलता होनी चाहिए। निर्दोष को उसके हक से वंचित नहीं करना चाहिए।',
    moralEn: 'True justice requires wisdom and empathy. Never deny honest labor its rightful reward.',
    category: 'wisdom',
    coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '5-12 वर्ष',
    likes: 740,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's20-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        textHi: 'दीनू धोबी रात भर यमुना के बर्फीले पानी में महल के दूर टिमटिमाते दीये को देखकर खड़ा रहा।',
        textEn: 'Deenu braved the freezing river through the night, gazing at the distant palace light.',
        captionHi: 'दृश्य 1: कड़ाके की ठंड में साहस',
      },
      {
        id: 's20-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800&auto=format&fit=crop&q=80',
        textHi: 'बीरबल ने आग से पाँच फुट ऊपर हाँडी टांगकर अनोखी खिचड़ी पकाने का नाटक किया।',
        textEn: 'Birbal suspended his cooking pot five feet above the flames to prove a point.',
        captionHi: 'दृश्य 2: बीरबल की अनोखी खिचड़ी',
      },
      {
        id: 's20-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        textHi: 'अकबर को अपनी गलती का एहसास हुआ और उन्होंने दीनू को एक हज़ार सोने के सिक्के दिए।',
        textEn: 'Akbar acknowledged the wisdom and rewarded Deenu with a thousand gold coins.',
        captionHi: 'दृश्य 3: न्याय की विजय',
      },
    ],
    vocabulary: [
      { word: 'कड़ाके की सर्दी (Bitter Cold)', meaningHi: 'अत्यधिक ठंड', meaningEn: 'Freezing winter' },
      { word: 'हौसला (Courage)', meaningHi: 'हिम्मत और आत्मबल', meaningEn: 'Inner strength' },
      { word: 'न्याय (Justice)', meaningHi: 'सत्य और धर्म का फैसला', meaningEn: 'Righteous judgment' },
    ],
    discussionQuestions: [
      'अकबर ने गरीब धोबी को इनाम देने से पहले क्यों मना किया?',
      'बीरबल ने आग से इतनी दूर हाँडी क्यों बाँधी थी?',
    ],
  },

  // =========================================================================
  // 21. 🐴 गधा और शेर की खाल (THE DONKEY IN LION'S SKIN)
  // =========================================================================
  {
    id: 'story-21',
    number: 21,
    titleHi: 'गधा और शेर की खाल',
    titleEn: 'Gadha aur Sher ki Khaal (The Donkey in Lion’s Skin)',
    summaryHi: 'शेर की खाल ओढ़कर सबको डराने वाला गधा जब खुशी में ढेंचू-ढेंचू रेंकने लगा, तो उसकी पोल खुल गई।',
    summaryEn: 'Draped in a lion’s pelt, a foolish donkey terrifies the countryside until he brays and reveals his identity.',
    contentHi: `एक धोबी के पास 'धौंकू' नाम का एक बहुत आलसी गधा था। दिन भर भारी कपड़ों का बोझ ढोने के कारण वह दुबला-पतला रहता था।

एक दिन जंगल के रास्ते से लौटते समय धोबी को एक मृत शेर की सूखी खाल मिली। धोबी के दिमाग में एक खुराफात आई। उसने वह खाल अपने गधे धौंकू की पीठ पर ओढ़ा दी।

अगली शाम धोबी ने गधे को पास के गाँव के लहलहाते गेहूँ के खेतों में छोड़ दिया। खेत के रखवालों ने जब देखा कि खेत में एक खूंखार शेर घूम रहा है, तो वे डर के मारे लाठियाँ फेंककर भाग खड़े हुए!

गधे को मज़ा आ गया। वह रात भर ताज़ा, हरी-भरी फसल खाता और दिन भर आराम करता। धीरे-धीरे वह मोटा-ताज़ा हो गया। जंगल के सियार, लोमड़ियाँ और गाँव के कुत्ते भी उसे सचमुच का शेर समझकर दूर से ही थर-थर काँपते थे।

इस झूठे सम्मान से गधे का दिमाग सातवें आसमान पर पहुँच गया। वह सोचने लगा कि वह सचमुच जंगल का राजा बन चुका है।

एक पूर्णिमा की चांदनी रात में, जब गधा खेत में घास चर रहा था, दूर जंगल से कुछ जंगली गधों के 'ढेंचू... ढेंचू... ढेंचू!' रेंकने की आवाज़ आई।

अपनी बिरादरी की आवाज़ सुनकर धौंकू गधा खुद को रोक न सका। उसके कान खड़े हो गए, उसकी पूँछ तन गई, और उसने अपना मुँह आसमान की ओर उठाकर पूरी ताकत से चिल्लाना शुरू कर दिया—"ढेंचू... ढेंचू... ढेंचू!"

गाँव के किसानों ने आवाज़ सुनी तो चौंक गए। "अरे! यह शेर नहीं, यह तो शेर की खाल ओढ़े कोई ढोंगी गधा है!"

किसानों ने लाठियाँ उठा लीं और दौड़ पड़े। उन्होंने धौंकू गधे की ऐसी खातिरदारी की कि उसकी खाल उतर गई और वह लंगड़ाता हुआ वापस धोबी के घर भागा। उस दिन के बाद उसने कभी नकली रूप धारण नहीं किया।`,
    contentEn: `A village washerman owned an indolent donkey named Dhaunku. Worn down by stacks of dirty laundry, the beast was thin and wretched.

One evening on a forest trail, the washerman found the intact skin of a lion. A deceitful plan took root in his mind. He draped the golden pelt over his donkey’s back.

At dusk, the man turned the disguised donkey loose into the fertile wheat pastures of neighboring farmers. Spotting what appeared to be an apex predator prowling among the stalks, the guards abandoned their posts and fled in sheer terror!

Dhaunku was overjoyed. Night after night he grazed upon sweet corn and clover, growing plump and sleek. Even the prowling jackals and ferocious village mastiffs scattered in dread whenever he trotted past.

Swollen with conceit, the foolish donkey convinced himself that he truly was the sovereign monarch of the beasts.

One moonlit night, while feasting in an alfalfa meadow, the distant braying of wild donkeys drifted across the hills: "Hee-haw! Hee-haw!"

Hearing the familiar chorus of his kind, Dhaunku could not restrain his natural instinct. His ears twitched, his tail stiffened, and thrusting his snout toward the stars, he unleashed a deafening bray: "Hee-haw! Hee-haw! HEE-HAW!"

The farmers stopped in their tracks. "That is no lion's roar! That is an impostor donkey wearing a mask!"

Grabbing stout cudgels, the angry villagers charged the field and drove the impostor out with blows. Limping back to his master, the bruised donkey learned that a borrowed costume cannot hide one's true nature.`,
    moralHi: 'नकली रूप और झूठा दिखावा ज़्यादा दिन नहीं चलता। अपनी असलियत छिपाने वाले का एक न एक दिन पर्दाफ़ाश हो ही जाता है।',
    moralEn: 'Fine feathers do not make fine birds. Borrowed disguises cannot conceal foolish nature for long.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 660,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's21-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        textHi: 'धोबी ने गधे को शेर की खाल पहनाकर गाँव के लहलहाते खेतों में चरने के लिए छोड़ दिया।',
        textEn: 'The washerman disguised his donkey in a lion skin and let him graze in cornfields.',
        captionHi: 'दृश्य 1: शेर की खाल में गधा',
      },
      {
        id: 's21-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80',
        textHi: 'शेर समझकर सभी किसान और जानवर डरकर भाग जाते थे और गधा मजे से फसल खाता रहा।',
        textEn: 'Believing him to be a lion, everyone fled while the donkey grazed peacefully.',
        captionHi: 'दृश्य 2: झूठा रोब और दबदबा',
      },
      {
        id: 's21-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
        textHi: 'दूसरे गधों की आवाज़ सुनकर वह रेंकने लगा; किसानों ने पोल खुलते ही उसे भगा दिया।',
        textEn: 'Hearing fellow donkeys, he brayed out loud, exposing his disguise to the angry farmers.',
        captionHi: 'दृश्य 3: असलियत का पर्दाफ़ाश',
      },
    ],
    vocabulary: [
      { word: 'ढोंगी (Impostor)', meaningHi: 'नकली रूप बनाकर छल करने वाला', meaningEn: 'Pretender/Fraud' },
      { word: 'रेंकना (To Bray)', meaningHi: 'गधे की बोलने की आवाज़', meaningEn: 'Donkey bray' },
      { word: 'पर्दाफ़ाश (Exposed)', meaningHi: 'सच्चाई सामने आना', meaningEn: 'Unmasked/Revealed' },
    ],
    discussionQuestions: [
      'गधे ने लोगों को डराने के लिए क्या पहना था?',
      'गधे की पोल किस बात से खुली?',
    ],
  },

  // =========================================================================
  // 22. 🐸 घमंडी मेंढक और विशाल बैल (THE FROG AND THE OX)
  // =========================================================================
  {
    id: 'story-22',
    number: 22,
    titleHi: 'घमंडी मेंढक और विशाल बैल',
    titleEn: 'Ghamandi Mendhak (The Frog and the Enormous Ox)',
    summaryHi: 'विशालकाय बैल की बराबरी करने के लिए अपने पेट में हवा भरकर फूलने वाले मेंढक का घमंड कैसे टूटा।',
    summaryEn: 'Attempting to match the towering size of a meadow ox, an envious frog puffs himself up until disaster strikes.',
    contentHi: `एक सुंदर तालाब के किनारे पानी के लिली के पत्तों पर मेंढकों का एक बड़ा परिवार रहता था। उनका मुखिया था 'टिल्लू' मेंढक। टिल्लू को अपने गोल-मटोल शरीर और तेज टर्र-टर्र की आवाज़ पर बहुत घमंड था। वह हमेशा खुद को तालाब का सबसे महान जीव समझता था।

एक दोपहर, पास के खेत से एक बहुत बड़ा, हट्टा-कट्टा और सींगों वाला काला बैल तालाब पर पानी पीने आया। बैल के भारी कदमों से धरती काँप रही थी।

छोटे नन्हे मेंढकों ने जब पहली बार उस विशालकाय जीव को देखा, तो वे हक्के-बक्के रह गए। वे दौड़कर अपने पिता टिल्लू के पास गए और चिल्लाए, "पिताजी! पिताजी! हमने अभी-अभी दुनिया का सबसे बड़ा दैत्य देखा! उसके चार खंभे जैसे पैर थे और सिर पर तीखे सींग!"

टिल्लू मेंढक को यह बात बिल्कुल पसंद नहीं आई कि उसके बच्चे किसी और जीव की तारीफ करें। उसने अपनी नाक फुलाई और कहा, "अरे! वह इतना बड़ा भी नहीं होगा! क्या वह मुझसे भी बड़ा था?"

बच्चों ने कहा, "हाँ पिताजी! वह आपसे सैकड़ों गुना बड़ा था!"

टिल्लू ने गहरी साँस खींची और अपना पेट फुला लिया, "क्या वह इतना बड़ा था?"
बच्चों ने सिर हिलाया, "नहीं पिताजी! वह इससे कहीं बहुत बड़ा था!"

टिल्लू ने और जोर से हवा अंदर भरी। उसका पेट एक गुब्बारे की तरह फूल गया, उसकी आँखें बाहर निकल आईं। "अब बताओ! क्या वह इतना बड़ा था?"
बच्चों ने गिड़गिड़ाकर कहा, "पिताजी! बस कीजिए, वह आपसे बहुत विशाल था! आप उसकी बराबरी नहीं कर सकते!"

लेकिन ईर्ष्या और घमंड में अंधे टिल्लू ने बच्चों की बात नहीं मानी। उसने अपनी सारी ताकत लगाकर और ज़्यादा हवा अंदर खींच ली...

'फटाक!' जैसे ही उसने अतिरिक्त हवा भरी, उसका गुब्बारे जैसा पेट ज़ोर से फट गया और वह दर्द से कराहता हुआ पानी में गिर पड़ा। वह कई दिनों तक बीमार रहा और उसने कसम खाई कि वह कभी दूसरों से झूठी बराबरी करने का घमंड नहीं करेगा।`,
    contentEn: `Upon the broad lily pads of a crystal woodland pond dwelt a prosperous frog family headed by Tillu. Vain and pompous, Tillu took immense pride in his mottled green belly and booming croak, constantly lecturing his tadpoles that frogs were nature's pinnacle.

One scorching midday, a massive black draught ox strolled down to the shallows to quench his thirst. His heavy hooves shook the mossy earth, and his curving horns glinted like polished ebony.

Gasping in awe at the monumental beast, the little froglets scurried back to their father: "Father! Father! We have just witnessed a titan! He has limbs like ancient oak trunks and a mountain for a back!"

Offended that his offspring dared admire another creature, Tillu scowled, "Nonsense! Merely a bloated clodhopper. Was he as majestic as I?"

"Far larger, Father! A hundred times over!" chorused the young ones.

Tillu took a deep gulp of air, expanding his mottled throat and sides. "Was he this big?"
"Much bigger!" they answered truthfully.

Snorting in jealousy, Tillu sucked in another great lungful of breeze until his skin stretched taut like a drum and his golden eyes bulged. "What of now? Am I not his equal?"
"Stop, Father, please!" pleaded the children. "You are hurting yourself; you can never equal his stature!"

Deaf to wisdom, poisoned by vanity, Tillu drew in one final, frantic breath with all his might...

Pop! With a sudden burst like an overfilled balloon, his stretched belly ruptured. Gasping in pain, the humiliated frog tumbled into the reeds. Bedridden for weeks, Tillu learned the bitter truth that envy destroys those who strive beyond their natural measure.`,
    moralHi: 'दूसरों की देखा-देखी झूठी बराबरी करने की कोशिश कभी नहीं करनी चाहिए। अपनी सीमाओं को पहचानना और संतोष रखना ही सच्ची समझदारी है।',
    moralEn: 'Do not attempt the impossible out of petty envy. Contentment within one’s nature brings lasting peace.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800&auto=format&fit=crop&q=80',
    readTime: '3 मिनट (3 min)',
    recommendedAge: '4-9 वर्ष',
    likes: 590,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's22-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80',
        textHi: 'तालाब किनारे पानी पीने आए विशालकाय बैल को देखकर नन्हे मेंढक हैरान रह गए।',
        textEn: 'The little frogs were astonished by the immense ox drinking at the pond.',
        captionHi: 'दृश्य 1: विशाल बैल का आगमन',
      },
      {
        id: 's22-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800&auto=format&fit=crop&q=80',
        textHi: 'घमंडी मेंढक ने बैल की बराबरी करने के लिए अपने पेट में हवा भरकर फुलाना शुरू किया।',
        textEn: 'Envious of the ox, the proud frog puffed his belly with air to match his size.',
        captionHi: 'दृश्य 2: ईर्ष्या में पेट फुलाना',
      },
      {
        id: 's22-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800&auto=format&fit=crop&q=80',
        textHi: 'हद से ज्यादा हवा भरने पर मेंढक का पेट फट गया और उसका घमंड चूर-चूर हो गया।',
        textEn: 'Puffing beyond his limit, the frog burst his belly and learned a painful lesson.',
        captionHi: 'दृश्य 3: घमंड का कड़वा फल',
      },
    ],
    vocabulary: [
      { word: 'विशालकाय (Gigantic/Colossal)', meaningHi: 'बहुत बड़े शरीर वाला', meaningEn: 'Enormous stature' },
      { word: 'ईर्ष्या (Envy/Jealousy)', meaningHi: 'दूसरों की उन्नति से जलना', meaningEn: 'Resentful longing' },
      { word: 'बराबरी (Equality/Matching)', meaningHi: 'समान होने की चेष्टा', meaningEn: 'Attempting to match' },
    ],
    discussionQuestions: [
      'मेंढक ने अपना पेट क्यों फुलाया था?',
      'इस कहानी से बच्चों को क्या सीख मिलती है?',
    ],
  },

  // =========================================================================
  // 23. 🕳️ बोलती गुफा और चतुर सियार (THE CAVE THAT TALKED)
  // =========================================================================
  {
    id: 'story-23',
    number: 23,
    titleHi: 'बोलती गुफा और चतुर सियार',
    titleEn: 'Bolti Gufa (The Cave That Talked)',
    summaryHi: 'गुफा में छिपे खूंखार शेर की उपस्थिति का पता लगाने के लिए सियार ने गुफा से बात करने की चतुर तरकीब लगाई।',
    summaryEn: 'Suspecting a predator lurks inside his cave, a witty jackal outfoxes a hungry lion with a clever verbal trap.',
    contentHi: `एक घने जंगल की पहाड़ी पर 'चीकू' नाम का एक बहुत ही बुद्धिमान और सतर्क सियार रहता था। उसने एक सुंदर और ठंडी चट्टानी गुफा को अपना घर बना रखा था।

उसी जंगल में एक बूढ़ा शेर भोजन की तलाश में भटक रहा था। दिन ढल चुका था और शेर को कोई शिकार नहीं मिला था। अचानक उसकी नज़र उस गुफा पर पड़ी।

शेर ने सोचा, "यह गुफा ज़रूर किसी जानवर का घर है। शाम होने पर वह जानवर अपने घर लौटेगा। क्यों न मैं गुफा के अंदर छिपकर बैठ जाऊँ? जैसे ही वह अंदर आएगा, मैं उस पर झपट पडूँगा!" शेर गुफा के अंदर जाकर अंधेरे कोने में दुबक कर बैठ गया।

शाम ढलते ही चीकू सियार अपनी गुफा की ओर लौटा। लेकिन वह बहुत होशियार था। गुफा के प्रवेश द्वार पर पहुँचते ही उसने रेत पर पंजों के निशान देखे।

सियार ने ध्यान से देखा—शेर के भारी पंजों के निशान गुफा के अंदर जाने के तो थे, लेकिन बाहर आने का एक भी निशान नहीं था! सियार समझ गया कि अंदर कोई भयानक शिकारी घात लगाए बैठा है।

लेकिन पक्का सबूत पाने के लिए सियार ने एक लाजवाब चाल चली। वह थोड़ी दूरी पर खड़ा हुआ और ज़ोर से चिल्लाया, "ओ मेरी प्यारी गुफा! ओ गुफा! तुम आज इतनी चुप क्यों हो?"

गुफा से कोई आवाज़ नहीं आई। सियार फिर बोला, "गुफा! रोज़ तो जब मैं बाहर से लौटता हूँ, तो तुम प्यार से मुझे पुकारती हो और कहती हो—'आओ चीकू, तुम्हारा स्वागत है!' आज तुम कुछ बोल क्यों नहीं रही हो? अगर तुम मुझे नहीं बुलाओगी, तो मैं किसी दूसरी गुफा में रहने चला जाऊँगा!"

गुफा के अंदर बैठा भूखा शेर घबरा गया। उसने सोचा, "अरे! लगता है यह गुफा रोज़ इस सियार से बात करती है! आज मेरे डर से यह चुप है। अगर मैंने जवाब नहीं दिया, तो यह सियार भाग जाएगा!"

शेर ने भारी और गूँजती हुई आवाज़ में दहाड़कर कहा, "आओ मेरे प्यारे मित्र सियार! अंदर आ जाओ, तुम्हारा स्वागत है!"

शेर की दहाड़ सुनते ही पूरी पहाड़ी गूँज उठी। सियार हँस पड़ा और बोला, "मूर्ख शेर! क्या कभी पत्थर की बेजान गुफा भी बोला करती है?" यह कहकर सियार बिजली की गति से हवा में उड़ता हुआ भाग निकला और शेर हाथ मलता रह गया।`,
    contentEn: `Upon a rocky cliff nestled in a jungle lived Chiku, a jackal celebrated among woodland creatures for his prudence. His sanctuary was a cool, sheltered cavern beneath the crags.

One twilight, an aged lion traversed the ridge, famished after an unsuccessful hunt. Spying the cavern mouth, his golden eyes gleamed.

"This lair surely belongs to some creature who must return at dusk," reasoned the predator. "I shall wait in the shadows within and ambush my dinner as it steps across the threshold." Padding silently inside, the lion crouched in the dark recesses.

Presently, Chiku bounded up the winding path toward home. Ever vigilant, he halted near the threshold to inspect the earth. There in the soft red loam lay fresh, unmistakable paw-prints of a giant lion leading into the darkness.

Chiku peered closer: every claw mark entered the cavern, but not a single track led outward!

Suspecting danger yet desiring absolute certainty before abandoning his beloved den, the clever jackal devised a witty stratagem. Stepping back, he called out toward the aperture:

"O my faithful Cave! O dear home! Why do you maintain such cold silence tonight?"

Silence answered. Chiku projected his voice again: "Beloved Cave! Have you forgotten our sacred compact? Every sunset when I return from the meadows, you warmly welcome me saying, 'Enter, dear Chiku, you are safe!' If you will not greet me tonight, I shall seek shelter in another cavern!"

Deep in the shadows, the hungry lion trembled with anxiety. "Aha! This enchanted cave must converse with the jackal daily! Perchance my royal presence has frightened it into silence. If I do not reply on its behalf, my dinner will slip away!"

Clearing his gravelly throat, the lion roared out in his most welcoming register: "Enter, beloved friend! Come inside; you are warmly welcome!"

The ground shook beneath the thunderous roar, sending flocks of bats flapping from the roof.

Chiku chuckled gleefully, shouting from a safe distance: "O foolish king of beasts! Since when did hollow stone caves learn to talk?" With that, the nimble jackal vanished into the thickets, leaving the duped predator starving in the dark.`,
    moralHi: 'संकट के समय घबराने के बजाय अपनी बुद्धि और सतर्कता का प्रयोग करना चाहिए। समझदारी से बड़ी से बड़ी विपत्ति को टाला जा सकता है।',
    moralEn: 'Presence of mind in danger preserves life. Wit effortlessly exposes clumsy deceit.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '4-11 वर्ष',
    likes: 710,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's23-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80',
        textHi: 'भूखा शेर सियार का शिकार करने के लिए गुफा के अंधेरे में छिपकर बैठ गया।',
        textEn: 'A hungry lion crept into the cave to ambush the unsuspecting jackal.',
        captionHi: 'दृश्य 1: गुफा में शेर की घात',
      },
      {
        id: 's23-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
        textHi: 'सियार ने शेर के पंजों के निशान देखे और गुफा से बात करने का चतुर नाटक रचा।',
        textEn: 'Spotting inward tracks, the witty jackal pretended to talk to the cave.',
        captionHi: 'दृश्य 2: सियार की चतुर परीक्षा',
      },
      {
        id: 's23-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80',
        textHi: 'शेर के दहाड़ते ही सियार उसकी मूर्खता पर हँसकर अपनी जान बचाकर भाग निकला।',
        textEn: 'When the lion roared in reply, the jackal mocked his folly and bolted free.',
        captionHi: 'दृश्य 3: बुद्धि से जीवन रक्षा',
      },
    ],
    vocabulary: [
      { word: 'सतर्कता (Vigilance)', meaningHi: 'सावधानी व चौकसी', meaningEn: 'Careful watchfulness' },
      { word: 'घात लगाना (To Ambush)', meaningHi: 'छिपकर वार करने की तैयारी', meaningEn: 'To lie in wait' },
      { word: 'लाजवाब (Brilliant/Matchless)', meaningHi: 'जिसका कोई जवाब न हो', meaningEn: 'Incomparable' },
    ],
    discussionQuestions: [
      'सियार को कैसे पता चला कि गुफा में शेर है?',
      'शेर ने गुफा बनकर क्यों जवाब दिया?',
    ],
  },

  // =========================================================================
  // 24. 🐢 हंस और बातूनी कछुआ (THE SWANS AND THE CHATTY TORTOISE)
  // =========================================================================
  {
    id: 'story-24',
    number: 24,
    titleHi: 'हंस और बातूनी कछुआ',
    titleEn: 'Hans aur Baatuni Kachhua (The Swans and the Chatty Tortoise)',
    summaryHi: 'आसमान में लकड़ी के सहारे उड़ते समय नीचे लोगों की बातें सुनकर मुँह खोलने पर बातूनी कछुए का क्या हश्र हुआ।',
    summaryEn: 'A talkative tortoise takes flight gripping a stick between two swans, but falls when he cannot keep his mouth shut.',
    contentHi: `एक मनोरम झील में 'कंबू' नाम का एक कछुआ रहता था। उसी झील के किनारे 'संकट' और 'विकट' नाम के दो सुंदर सफेद हंस भी रहते थे। तीनों में बहुत पक्की मित्रता थी। कंबू कछुआ स्वभाव से बहुत बातूनी था; वह बिना रुके दिन भर बातें करता रहता था।

एक वर्ष उस क्षेत्र में भयंकर सूखा पड़ा। बारिश की एक बूँद भी नहीं गिरी। धीरे-धीरे झील का पानी सूखने लगा और कीचड़ नज़र आने लगा। मछलियाँ और जलजीव मरने लगे।

हंसों ने कछुए से कहा, "मित्र! यहाँ का पानी सूख रहा है। हमें बहुत दूर वाली एक सदाबहार नीली झील में जाना होगा, जहाँ भरपूर पानी है।"

कंबू कछुआ रोने लगा, "मित्रों! तुम तो उड़कर चले जाओगे, लेकिन मैं पानी के बिना यहाँ तड़पकर मर जाऊँगा! क्या तुम मुझे अपने साथ नहीं ले चलोगे?"

हंसों ने अपने मित्र की जान बचाने के लिए एक उपाय सोचा। वे एक मजबूत लकड़ी की डंडी लेकर आए और बोले, "कंबू! हम इस लकड़ी के दोनों सिरों को अपनी-अपनी चोंच से पकड़ लेंगे। तुम इस लकड़ी के बीच के हिस्से को अपने मुँह से मजबूती से पकड़ लेना। हम तुम्हें उड़ाकर नई झील तक ले चलेंगे।"

लेकिन हंसों ने एक कड़ी चेतावनी दी: "याद रखना कंबू! रास्ते में चाहे कुछ भी हो जाए, तुम्हें अपना मुँह बिल्कुल नहीं खोलना है! अगर तुमने एक शब्द भी बोला, तो तुम सीधे नीचे गिर पड़ोगे!" कछुए ने सिर हिलाकर वादा किया।

हंसों ने लकड़ी पकड़ी, कछुए ने अपने दाँतों से बीच का हिस्सा दबाया, और तीनों ने आसमान में उड़ान भरी। वे बादलों के बीच से उड़ते हुए एक शहर के ऊपर से गुज़रे।

नीचे ज़मीन पर खड़े लोगों ने जब आसमान में दो हंसों को एक कछुए को ले जाते देखा, तो वे ताली बजाकर चिल्लाने लगे, "देखो-देखो! आसमान में उड़ता हुआ कछुआ! क्या गज़ब का नज़ारा है!"

लोगों का शोर सुनकर कंबू कछुए से चुप नहीं रहा गया। उसका बातूनी स्वभाव उस पर हावी हो गया। उसने चिल्लाकर कहना चाहा, "अरे मूर्खों! तुम क्या चिल्ला रहे हो..."

लेकिन जैसे ही उसने मुँह खोला, लकड़ी से उसकी पकड़ छूट गई और वह ज़मीन पर धड़ाम से गिर पड़ा! हंस बेबसी से देखते रह गए।`,
    contentEn: `In a tranquil highland lake lived a tortoise named Kambu alongside two majestic white swans, Sankat and Vikat. The trio spent peaceful years together. Kambu had one incorrigible flaw: he was utterly loquacious and could never hold his tongue.

A severe drought descended upon the province. Rivers vanished and the lake dwindled into cracked, sun-baked mud. Water lilies withered and survival became impossible.

The swans announced sorrowfully, "Dear friend, this lake is dying. We must migrate across the mountains to a vast turquoise reservoir that never runs dry."

Kambu wept, "You will soar aloft on your snowy wings, but without water I shall perish in the dust! Will you abandon your companion?"

Pitying his tears, the swans devised an ingenious scheme. Procuring a supple wooden branch, they instructed: "We shall clamp the two ends firmly in our beaks. You must bite hard upon the center. As we flap together, we will carry you safely across the peaks."

They added a stern, life-saving warning: "Mark our words, Kambu! Throughout the journey you must remain utterly silent! Speak not a syllable, or you shall plummet to destruction." Kambu nodded solemnly in consent.

Taking off into the blue heavens, the sight was breathtaking. Presently, they passed over a crowded market town.

Gazing skyward, townsfolk began whistling and shouting in amusement: "Look up! Look at the flying turtle! What a ridiculous circus!"

The noisy taunts stung Kambu’s fragile ego. Forgetting his sacred vow and his friends' counsel, his talkative temper flared. He opened his jaws to snap, "You insolent fools, what are you gaping at..."

The instant his jaws parted, his grip vanished. Plunging like a stone through the empty sky, he crashed upon the earth below. High above, the weeping swans mourned the friend who perished because he could not control his tongue.`,
    moralHi: 'समय और परिस्थिति देखकर बोलना चाहिए। जो व्यक्ति बिना सोचे-समझे अनुचित समय पर बोलता है, वह अपना ही विनाश कर बैठता है।',
    moralEn: 'Silence is golden when prudence demands it. An uncontrolled tongue leads to ruin.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '4-10 वर्ष',
    likes: 675,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's24-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=800&auto=format&fit=crop&q=80',
        textHi: 'सूखे के कारण झील सूख गई तो हंसों ने कछुए को डंडी के सहारे उड़ाकर ले जाने की तरकीब निकाली।',
        textEn: 'When the lake dried up, the kind swans devised a way to airlift the tortoise with a stick.',
        captionHi: 'दृश्य 1: अनोखी उड़ान की योजना',
      },
      {
        id: 's24-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
        textHi: 'हंसों ने कछुए को समझाया कि आसमान में उड़ते समय मुँह बिल्कुल बंद रखना।',
        textEn: 'The swans strictly warned the tortoise never to open his mouth during flight.',
        captionHi: 'दृश्य 2: बादलों के बीच उड़ान',
      },
      {
        id: 's24-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
        textHi: 'लोगों की आवाज़ सुनकर जैसे ही कछुआ बोला, डंडी छूट गई और वह नीचे गिर पड़ा।',
        textEn: 'Provoked by noisy crowds, the tortoise opened his mouth to shout and fell.',
        captionHi: 'दृश्य 3: बातूनीपन का दुखद अंत',
      },
    ],
    vocabulary: [
      { word: 'बातूनी (Loquacious/Talkative)', meaningHi: 'बहुत अधिक बोलने वाला', meaningEn: 'Overly talkative' },
      { word: 'सदाबहार (Perennial/Evergreen)', meaningHi: 'जो कभी न सूखे, हमेशा हरा रहे', meaningEn: 'Never-drying' },
      { word: 'चेतावनी (Warning)', meaningHi: 'सावधान करने वाली सीख', meaningEn: 'Cautionary advice' },
    ],
    discussionQuestions: [
      'हंसों ने कछुए को क्या जरूरी चेतावनी दी थी?',
      'कछुए ने आसमान में मुँह क्यों खोला?',
    ],
  },

  // =========================================================================
  // 25. 🐐 ब्राह्मण और तीन चतुर ठग (THE BRAHMIN AND THE THREE ROGUES)
  // =========================================================================
  {
    id: 'story-25',
    number: 25,
    titleHi: 'ब्राह्मण और तीन चतुर ठग',
    titleEn: 'Brahmin aur Teen Thag (The Brahmin and the Three Rogues)',
    summaryHi: 'तीन चालाक ठगों ने बार-बार बकरी को कुत्ता कहकर एक सीधे-साधे ब्राह्मण को भ्रमित कर दिया और उसकी बकरी हड़प ली।',
    summaryEn: 'Through persistent psychological deception, three confidence tricksters convince a simple priest his healthy goat is a dog.',
    contentHi: `प्राचीन काल में एक गाँव में मित्रशर्मा नाम के एक सीधे-साधे और धार्मिक ब्राह्मण रहते थे। एक यजमान ने पूजा से प्रसन्न होकर उन्हें एक सुंदर, तगड़ी और सफेद बकरी भेंट की।

ब्राह्मण देवता खुशी-खुशी उस बकरी को अपने कंधों पर लादकर अपने घर की ओर चल पड़े। रास्ते में तीन शातिर ठगों की नज़र उस मोटी-ताज़ी बकरी पर पड़ी। उनके मुँह में पानी आ गया।

ठगों के सरदार ने कहा, "हम इस ब्राह्मण से सीधे लड़कर बकरी नहीं छीन सकते, लेकिन अपनी चालबाज़ी से इसे आसानी से बेवकूफ बना सकते हैं!" तीनों ठग योजना बनाकर रास्ते में थोड़ी-थोड़ी दूरी पर खड़े हो गए।

कुछ दूर चलने पर पहला ठग ब्राह्मण के सामने आया और चौंककर बोला, "अरे पंडित जी! प्रणाम! पर यह आप क्या कर रहे हैं? आप इतने पूज्य ब्राह्मण होकर अपने पवित्र कंधों पर यह गंदा कुत्ता उठाकर कहाँ ले जा रहे हैं?"

ब्राह्मण ने गुस्से में कहा, "अंधे हो क्या? यह कुत्ता नहीं, यजमान द्वारा दी गई सुंदर बकरी है!" ठग मुस्कुराते हुए चला गया।

ब्राह्मण थोड़ा आगे बढ़ा, तो दूसरा ठग रास्ते में मिला। उसने अपनी आँखें मटकाते हुए कहा, "हे भगवान! कलियुग आ गया! एक ज्ञानी ब्राह्मण अपने कंधे पर मरा हुआ कुत्ता ढो रहा है! क्या आपको ज़रा भी लज्जा नहीं आती?"

अब ब्राह्मण के मन में हल्का सा संशय पैदा हुआ। उसने बकरी को नीचे उतारा, उसे चारों तरफ से देखा। वह बकरी ही थी। उसने फिर उसे कंधे पर रख लिया और आगे बढ़ा।

आधे मील बाद तीसरा ठग पेड़ की छांव से बाहर निकला और जोर-जोर से हँसने लगा, "हाहाहा! पंडित जी! आपका दिमाग तो ठीक है? जो व्यक्ति गधे या कुत्ते को कंधे पर उठाकर घूमे, उसे गाँव वाले क्या कहेंगे?"

अब ब्राह्मण का विश्वास पूरी तरह डगमगा गया। उसने सोचा, "एक व्यक्ति झूठ बोल सकता है, दो बोल सकते हैं, लेकिन तीन अलग-अलग अजनबी एक ही बात कैसे कह सकते हैं? ज़रूर यह कोई मायावी भूत या भयानक कुत्ता ही है जो बकरी का रूप बदलकर मेरे कंधे पर चढ़ बैठा है!"

भय और वहम के मारे ब्राह्मण ने बकरी को वहीं रास्ते पर पटक दिया और जान बचाकर उल्टे पाँव अपने घर की तरफ भाग खड़ा हुआ!

तीनों ठग झाड़ियों से बाहर निकले, हँसते-हँसते लोटपोट हो गए और मज़े से उस बकरी को लेकर दावत उड़ाने चले गए।`,
    contentEn: `In an ancient valley lived Mitrasharma, a devout and pious priest. Pleased by a solemn ceremony, a wealthy patron gifted him a plump, snowy-white young goat.

Beaming with delight, the priest slung the animal comfortably over his shoulders and took the forest trail homeward. Nearby, three seasoned con artists observed the prize with watering mouths.

"We cannot rob the priest by force," whispered the chief rogue. "Instead, we shall weaponize his own doubts and swindle the beast from his shoulders!" The three scattered along the footpath at half-mile intervals.

Presently, the first rogue greeted the traveler: "Greetings, reverend scholar! Yet why does a man of holy scriptures carry a filthy mongrel dog across his pure shoulders?"

Mitrasharma snapped irritably, "Are you blind, fool? This is a healthy young goat gifted from a royal sacrifice, not a dog!" Shrugging, the rogue strolled away.

Further along, the second rogue gasped in mock horror: "Alas! The end of righteousness is near! A venerable sage openly hauling an unclean hound through the public way! Have you abandoned all shame?"

Now a seed of unease sprouted in the priest’s heart. Lowering the creature, he examined its hooves, horns, and bleating muzzle. Reassured that it truly was a goat, he hoisted it back up and pressed on.

Near the crossroad, the third swindler burst into mocking laughter: "By the heavens, Panditji! Have you lost your faculties? What madness drives an honorable man to carry a stray cur upon his neck?"

The priest's certainty crumbled into superstitious terror. He reasoned: "One traveler might mistake an animal, two might jest, but how could three independent strangers all see a dog? This creature must be a shapeshifting phantom in disguise!"

Paralyzed by superstition, the terrified priest dropped the goat into the dust and bolted for his life without looking back.

Emerging from the brush, the three scoundrels gathered the prize, laughing heartily at how easily collective falsehood can conquer solitary truth.`,
    moralHi: 'दूसरों की कही-सुनी बातों और अफ़वाहों पर कभी आँख मूँदकर भरोसा नहीं करना चाहिए। अपनी आँखों और बुद्धि पर हमेशा विश्वास रखें।',
    moralEn: 'Do not let manipulative rumors shake your own senses. Mob opinion can make the foolish abandon truth.',
    category: 'panchatantra',
    coverImage: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80',
    readTime: '4 मिनट (4 min)',
    recommendedAge: '5-12 वर्ष',
    likes: 685,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's25-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80',
        textHi: 'ब्राह्मण यजमान से मिली सफेद बकरी को कंधे पर लादकर खुशी-खुशी घर जा रहा था।',
        textEn: 'The pious priest happily carried his gifted young goat homeward on his shoulders.',
        captionHi: 'दृश्य 1: उपहार में मिली बकरी',
      },
      {
        id: 's25-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        textHi: 'तीन ठगों ने बारी-बारी से बकरी को कुत्ता बताकर ब्राह्मण के मन में गहरा वहम पैदा किया।',
        textEn: 'Three rogues in turn falsely claimed the goat was a dog, seeding doubt.',
        captionHi: 'दृश्य 2: ठगों का झूठा प्रपंच',
      },
      {
        id: 's25-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80',
        textHi: 'भयभीत ब्राह्मण ने बकरी को भूत समझकर छोड़ दिया और ठगों ने बकरी हड़प ली।',
        textEn: 'Terrified by rumors, the priest dropped the goat and the tricksters feasted.',
        captionHi: 'दृश्य 3: अफवाहों का शिकार',
      },
    ],
    vocabulary: [
      { word: 'यजमान (Patron/Host)', meaningHi: 'पूजा कराने वाला गृहस्थ', meaningEn: 'Religious patron' },
      { word: 'संशय (Doubt/Skepticism)', meaningHi: 'संदेह या वहम', meaningEn: 'Uncertainty/Suspicion' },
      { word: 'मायावी (Shapeshifting/Magical)', meaningHi: 'जादुई रूप बदलने वाला', meaningEn: 'Illusionary entity' },
    ],
    discussionQuestions: [
      'तीनों ठगों ने ब्राह्मण को क्या कहकर डराया?',
      'ब्राह्मण ने अपनी असली बकरी क्यों छोड़ दी?',
    ],
  },

  // =========================================================================
  // 26. 👑 तेनालीराम और शाही दावत (TENALI RAMAN AND THE ROYAL FEAST)
  // =========================================================================
  {
    id: 'story-26',
    number: 26,
    titleHi: 'तेनालीराम और शाही दावत',
    titleEn: 'Tenali Raman aur Shahi Dawat (Tenali Raman and the Royal Feast)',
    summaryHi: 'विजयनगर के राजा कृष्णदेव राय के अजीब शर्त पर तेनालीराम ने अपनी अनोखी बुद्धिमानी और हास्य से सबका दिल जीत लिया।',
    summaryEn: 'When King Krishna Deva Raya challenges his court with a bizarre banquet riddle, witty Tenali Raman turns it into merriment.',
    contentHi: `दक्षिण भारत के प्रतापी साम्राज्य विजयनगर के सम्राट कृष्णदेव राय की सभा में अष्टदिग्गजों में तेनालीराम अपनी अनुपम बुद्धिमत्ता और हास्य-विनोद के लिए विख्यात थे।

एक बार सम्राट ने अपने राजमहल में एक भव्य शाही दावत का आयोजन किया। देश-विदेश के कई पंडित, मंत्री और विद्वान आमंत्रित थे। मेज़ों पर छप्पन प्रकार के स्वादिष्ट व्यंजन, गरम-गरम रसगुल्ले, गुलाब जामुन और सोने की थालियों में आम का रस सजाया गया था।

भोजन शुरू होने से पहले महाराज कृष्णदेव राय ने मुस्कुराते हुए एक अजीब शर्त रख दी:
"हमारे सभी सम्मानित मेहमानों का स्वागत है! लेकिन आज भोजन करने का एक कड़ा नियम है—किसी भी अतिथि को अपने हाथ की कोहनी (Elbow) बिल्कुल नहीं मोड़नी है! जो कोहनी मोड़े बिना भोजन कर सकेगा, वही दावत का आनंद ले पाएगा!"

सभी दरबारी और विद्वान सिर खुजलाने लगे। "भला कोहनी मोड़े बिना कोई भोजन अपने मुँह तक कैसे पहुँचा सकता है?" अगर हाथ सीधा रहेगा, तो चम्मच या मिठाई मुँह तक आ ही नहीं सकती थी! कुछ लोगों ने कोशिश की तो मिठाई उनके गालों पर और कपड़ों पर गिर गई। सब भूखे बेबस खड़े रह गए।

तभी तेनालीराम मुस्कुराते हुए आगे आए। उन्होंने अपने सामने बैठे मंत्री जी की थाली से एक रसीला, गरमा-गरम रसगुल्ला उठाया। उन्होंने अपना हाथ सीधा रखा, कोहनी बिल्कुल नहीं मोड़ी, और बड़े प्यार से सामने बैठे मंत्री जी के खुले मुँह में रसगुल्ला खिला दिया!

मंत्री जी ने स्वाद लेकर खाया और मुस्कुराए। तेनालीराम ने इशारा किया, तो मंत्री जी ने भी अपनी थाली से एक स्वादिष्ट मिठाई उठाई और बिना कोहनी मोड़े तेनालीराम के मुँह में खिला दी!

यह देखकर पूरे दरबार में तालियों की गड़गड़ाहट गूँज उठी। बाकी सभी मेहमानों ने भी बात समझ ली। सबने अपने सामने बैठे साथी को बिना कोहनी मोड़े भोजन कराना शुरू कर दिया। देखते ही देखते सबने हँसते-गाते हुए पूरी दावत का आनंद लिया।

महाराज कृष्णदेव राय तेनालीराम की इस सूझबूझ से अत्यंत प्रसन्न हुए। उन्होंने कहा, "तेनाली! तुमने फिर साबित कर दिया कि जहाँ स्वार्थ में समस्या होती है, वहाँ परोपकार और सहयोग से हर कठिनाई का सुंदर समाधान निकल आता है!"`,
    contentEn: `In the golden court of the Vijayanagara Empire, Emperor Krishna Deva Raya treasured Tenali Raman above all his royal gems for his quick wit and philosophical humor.

One season, the Emperor hosted a sumptuous royal banquet. The marble pavilion overflowed with silver tureens of fragrant biryani, sweet dumplings, syrupy rasgullas, and mango nectar.

Before the feast commenced, Emperor Raya announced an unexpected decree with a mischievous twinkle:
"Welcome, distinguished scholars and noble lords! Tonight comes with one strict stipulation: no guest may bend their elbows while dining! Whosoever enjoys this feast without flexing their elbow joints shall win royal acclaim!"

Puzzled murmurs filled the hall. How could anyone convey food from plate to lips with straight arms? Guests who attempted it tossed sweets over their own shoulders or splattered cream upon their silk robes. Embarrassed, the assembly stood famished.

Stepping forward with a courtly bow, Tenali Raman sat opposite a senior minister.

Keeping his arm rigid and unbent, Tenali lifted a golden rasgulla and leaned gently forward, placing the sweet delicately into the mouth of the minister facing him!

The minister savored the delicacy, smiled with enlightenment, and reciprocating, extended his own unbent arm to feed Tenali a sweet delicacy in turn!

Delighted laughter erupted across the pavilion. Understanding the secret, every courtier and guest paired with their neighbor across the tables, joyfully feeding each other without bending an elbow. The banquet hall rang with laughter and brotherhood.

Emperor Krishna Deva Raya applauded warmly: "Once more, Tenali, your wit teaches us a sublime truth—when selfish greed sees only impossible barriers, mutual generosity and love turn every hardship into a banquet!"`,
    moralHi: 'सच्चा सुख और समाधान आपसी सहयोग, प्रेम और दूसरों की सेवा में ही छिपा है। मिल-जुलकर रहने से कठिन से कठिन समस्या भी हल हो जाती है।',
    moralEn: 'Selfishness creates impossible barriers; mutual cooperation and sharing nourish everyone.',
    category: 'wisdom',
    coverImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
    readTime: '3.5 मिनट (3.5 min)',
    recommendedAge: '4-12 वर्ष',
    likes: 760,
    isFeatured: true,
    format: 'picture_book',
    scenes: [
      {
        id: 's26-scene-1',
        sceneNumber: 1,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        textHi: 'महाराज कृष्णदेव राय ने बिना कोहनी मोड़े भोजन करने की विचित्र शर्त रखी।',
        textEn: 'The Emperor challenged the banquet guests to dine without bending their elbows.',
        captionHi: 'दृश्य 1: शाही दावत की अजीब शर्त',
      },
      {
        id: 's26-scene-2',
        sceneNumber: 2,
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
        textHi: 'तेनालीराम ने सामने बैठे साथी को सीधा हाथ करके मिठाई खिलाई और उपाय सिखाया।',
        textEn: 'Tenali reached across with straight arms to feed his neighbor, demonstrating mutual sharing.',
        captionHi: 'दृश्य 2: तेनालीराम का अद्भुत उपाय',
      },
      {
        id: 's26-scene-3',
        sceneNumber: 3,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&auto=format&fit=crop&q=80',
        textHi: 'सभी मेहमानों ने एक-दूसरे को खिलाया और राजा ने तेनालीराम की प्रशंसा की।',
        textEn: 'Guests fed one another happily, and the Emperor praised Tenali’s wisdom.',
        captionHi: 'दृश्य 3: सहयोग और आनंद',
      },
    ],
    vocabulary: [
      { word: 'अष्टदिग्गज (Eight Giants of Literature)', meaningHi: 'राजा कृष्णदेव राय के आठ प्रमुख विद्वान', meaningEn: 'Eight royal court scholars' },
      { word: 'पारस्परिक सहयोग (Mutual Cooperation)', meaningHi: 'एक-दूसरे की सहायता करना', meaningEn: 'Working together selflessly' },
      { word: 'विख्यात (Celebrated/Famous)', meaningHi: 'प्रसिद्ध', meaningEn: 'Renowned' },
    ],
    discussionQuestions: [
      'महाराज ने दावत में क्या अनोखी शर्त रखी थी?',
      'तेनालीराम ने बिना कोहनी मोड़े भोजन कैसे कराया?',
    ],
  },
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
  },
  // General Knowledge (GK) Items
  {
    id: 'gk-1',
    module: 'gk',
    symbol: '🐅',
    name: 'National Animal - Bengal Tiger (बाघ)',
    pronunciation: 'Tai-ger',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    imageOrEmoji: '🐅',
    words: ['National Animal', 'Royal Bengal Tiger', 'Strong & Brave'],
    story: 'The Royal Bengal Tiger is the National Animal of India, known for its grace, strength, and agility.',
  },
  {
    id: 'gk-2',
    module: 'gk',
    symbol: '🦚',
    name: 'National Bird - Indian Peacock (मोर)',
    pronunciation: 'Pee-kok',
    color: 'bg-sky-100 text-sky-800 border-sky-300',
    imageOrEmoji: '🦚',
    words: ['National Bird', 'Peacock', 'Beautiful Feathers'],
    story: 'The Peacock is the National Bird of India, famous for its colorful feathers and joyful dance during rain.',
  },
  {
    id: 'gk-3',
    module: 'gk',
    symbol: '🇮🇳',
    name: 'National Flag - Tiranga (तिरंगा)',
    pronunciation: 'Ti-ran-ga',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    imageOrEmoji: '🇮🇳',
    words: ['Saffron (केसरिया)', 'White (सफ़ेद)', 'Green (हरा)', 'Ashoka Chakra'],
    story: 'Our Indian flag has three colors: Saffron represents courage, White peace, and Green prosperity, with the 24-spoke Ashoka Chakra.',
  },
  {
    id: 'gk-4',
    module: 'gk',
    symbol: '🪷',
    name: 'National Flower - Lotus (कमल)',
    pronunciation: 'Low-tus',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    imageOrEmoji: '🪷',
    words: ['National Flower', 'Sacred Lotus', 'Purity & Beauty'],
    story: 'The sacred Lotus is the National Flower of India, symbolizing purity, spirituality, and triumph.',
  },
  {
    id: 'gk-5',
    module: 'gk',
    symbol: '🪐',
    name: 'Solar System - 8 Planets (सौरमंडल)',
    pronunciation: 'So-lar Sis-tem',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    imageOrEmoji: '🪐',
    words: ['Mercury', 'Venus', 'Earth (पृथ्वी)', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    story: 'Our Solar System consists of the Sun and 8 planets revolving around it. Earth is our home planet!',
  },
  {
    id: 'gk-6',
    module: 'gk',
    symbol: '🌈',
    name: 'Rainbow - 7 Colors (इंद्रधनुष / VIBGYOR)',
    pronunciation: 'Rain-bow',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    imageOrEmoji: '🌈',
    words: ['Violet', 'Indigo', 'Blue', 'Green', 'Yellow', 'Orange', 'Red'],
    story: 'A rainbow appears when sunlight passes through raindrops in the sky, splitting light into 7 vibrant colors.',
  },
  {
    id: 'gk-7',
    module: 'gk',
    symbol: '🌍',
    name: 'Planet Earth - Our Blue Home (पृथ्वी)',
    pronunciation: 'Urth',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    imageOrEmoji: '🌍',
    words: ['7 Continents', '5 Oceans', 'Water & Oxygen'],
    story: 'Earth is the only known planet that supports life, with 70% of its surface covered by ocean waters.',
  },
  {
    id: 'gk-8',
    module: 'gk',
    symbol: '🥭',
    name: 'National Fruit - Mango (आम - फलों का राजा)',
    pronunciation: 'Man-go',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    imageOrEmoji: '🥭',
    words: ['King of Fruits', 'Sweet Mango', 'Summer Season'],
    story: 'Mango is the delicious National Fruit of India, loved by kids and adults for its sweetness.',
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


