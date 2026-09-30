/**
 * Baalvarta Pro Membership & Subscription Manager
 */

export interface ProSubscription {
  isPro: boolean;
  plan: 'monthly' | 'annual' | null;
  startDate: string | null;
  expiryDate: string | null;
  pricePaid: number;
}

const STORAGE_KEY = 'baalvarta_pro_subscription_v1';
const DOWNLOAD_TRACKER_KEY = 'baalvarta_daily_downloads_v1';

export const PRO_PLANS = {
  monthly: {
    id: 'monthly',
    price: 49,
    originalPrice: 99,
    durationEn: '1 Month',
    durationHi: '1 महीना',
    tagEn: 'Budget Pass',
    tagHi: 'पॉकेट-फ्रेंडली',
    dailyCostEn: 'Only ~₹1.60 / day',
    dailyCostHi: 'केवल ~₹1.60 प्रतिदिन',
    featuresEn: [
      '100% Ad-Free Website & Kid-Safe Environment',
      'Unlimited HD Printable Worksheets & Coloring Sheets',
      'Unlimited Audio Stories & Bedtime Listening Mode',
      'Unlimited AI Baalmitra Questions & Story Builder',
      'Verifiable Gold Student Certificates'
    ],
    featuresHi: [
      '100% विज्ञापन-मुक्त व सुरक्षित बाल वातावरण',
      'असीमित प्रिंटेबल वर्कशीट्स व कलरिंग पेपर्स',
      'असीमित ऑडियो कहानियाँ व बेडटाइम मोड',
      'असीमित AI बालमित्र सवाल व कहानी निर्माण',
      'गोल्ड डिजिटल बाल प्रमाणपत्र'
    ]
  },
  annual: {
    id: 'annual',
    price: 499,
    originalPrice: 799,
    durationEn: '1 Full Year (12 Months)',
    durationHi: 'पूरे 1 साल (12 महीने)',
    tagEn: 'Most Popular • Best Value (Save 15%)',
    tagHi: '🌟 सबसे लोकप्रिय • बेस्ट वैल्यू प्लान',
    dailyCostEn: 'Only ~₹1.36 / day',
    dailyCostHi: 'केवल ~₹1.36 प्रतिदिन (₹41/माह)',
    badge: '👑 VIP FAMILY PASS',
    featuresEn: [
      'All Monthly Plan Features for 12 Full Months',
      'VIP Gold Badge on Student Profile & Certificates',
      'Early Access to New Illustrated Storybooks & Quizzes',
      'Classroom & Family Multi-device Access',
      'Offline Download Pack for Long Trips'
    ],
    featuresHi: [
      'मासिक प्लान की सभी सुविधाएं पूरे 12 महीनों के लिए',
      'प्रोफाइल व सर्टिफिकेट पर स्पेशल VIP गोल्ड बैज',
      'नई किताबों व क्विज़ का सबसे पहले एक्सेस',
      'पूरे परिवार और स्कूल में मल्टी-डिवाइस एक्सेस',
      'ऑफलाइन उपयोग के लिए स्पेशल डाउनलोड पैक'
    ]
  }
};

export function getProSubscription(): ProSubscription {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: ProSubscription = JSON.parse(saved);
      // Check expiry if set
      if (parsed.expiryDate) {
        const expiry = new Date(parsed.expiryDate).getTime();
        const now = new Date().getTime();
        if (now > expiry) {
          return { isPro: false, plan: null, startDate: null, expiryDate: null, pricePaid: 0 };
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading pro subscription:', e);
  }
  return { isPro: false, plan: null, startDate: null, expiryDate: null, pricePaid: 0 };
}

export function saveProSubscription(sub: ProSubscription): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    window.dispatchEvent(new Event('baalvarta_pro_status_change'));
  } catch (e) {
    console.error('Error saving pro subscription:', e);
  }
}

export function activateProPlan(plan: 'monthly' | 'annual'): ProSubscription {
  const now = new Date();
  const expiry = new Date();
  if (plan === 'monthly') {
    expiry.setMonth(expiry.getMonth() + 1);
  } else {
    expiry.setFullYear(expiry.getFullYear() + 1);
  }

  const sub: ProSubscription = {
    isPro: true,
    plan,
    startDate: now.toISOString(),
    expiryDate: expiry.toISOString(),
    pricePaid: plan === 'monthly' ? 49 : 499
  };

  saveProSubscription(sub);
  return sub;
}

export function cancelProPlan(): void {
  const sub: ProSubscription = {
    isPro: false,
    plan: null,
    startDate: null,
    expiryDate: null,
    pricePaid: 0
  };
  saveProSubscription(sub);
}

// Daily Download limits for Free users (Max 2 free downloads per day)
export function getDailyDownloadCount(): number {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(DOWNLOAD_TRACKER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayStr) {
        return parsed.count || 0;
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

export function incrementDailyDownloadCount(): number {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const current = getDailyDownloadCount();
    const updated = current + 1;
    localStorage.setItem(DOWNLOAD_TRACKER_KEY, JSON.stringify({ date: todayStr, count: updated }));
    return updated;
  } catch {
    return 1;
  }
}
