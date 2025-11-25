const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // Produce - Fruits
  produce_fruits: [
    'apple', 'banana', 'orange', 'lemon', 'lime', 'grape', 'strawberry',
    'blueberry', 'raspberry', 'watermelon', 'melon', 'cantaloupe', 'honeydew',
    'elma', 'muz', 'portakal', 'limon', 'üzüm', 'uzum', 'çilek', 'cilek', 'armut', 'şeftali',
    'seftali', 'kayısı', 'kayisi', 'erik', 'karpuz', 'kavun', 'kiraz', 'vişne', 'visne',
    'ananas', 'mango', 'avokado'
  ],
  // Produce - Vegetables
  produce_vegetables: [
    'tomato', 'lettuce', 'spinach', 'carrot', 'onion', 'garlic', 'potato',
    'cucumber', 'pepper', 'bell pepper', 'broccoli', 'cauliflower', 'cabbage',
    'celery', 'mushroom', 'leek', 'domates', 'marul', 'ıspanak', 'havuç', 'soğan',
    'sarımsak', 'patates', 'salatalık', 'hiyar', 'biber', 'brokoli',
    'karnabahar', 'lahana', 'kereviz', 'mantar', 'patlıcan', 'kabak', 'fasulye',
    'pırasa', 'pirasa'
  ],
  // Produce - Herbs
  produce_herbs: [
    'basil', 'parsley', 'cilantro', 'mint', 'dill', 'oregano', 'thyme',
    'rosemary', 'sage', 'fesleğen', 'maydanoz', 'nane', 'dereotu', 'kekik'
  ],
  // Meat - Beef
  meat_beef: [
    'beef', 'steak', 'ground beef', 'diced beef', 'beef cubes',
    'biftek', 'dana', 'kıyma', 'roast beef', 'kuşbaşı', 'kusbasi'
  ],
  // Meat - Pork
  meat_pork: [
    'pork', 'bacon', 'ham', 'sausage', 'pork chop', 'domuz', 'pastırma'
  ],
  // Meat - Poultry
  meat_poultry: [
    'chicken', 'turkey', 'chicken breast', 'chicken thigh', 'wings', 'poultry',
    'tavuk', 'tavuk göğsü', 'tavuk but', 'hindi'
  ],
  // Meat - Lamb
  meat_lamb: [
    'lamb', 'lamb rack', 'lamb chop', 'kuzu', 'kuzu eti', 'pirzola'
  ],
  // Meat - Processed
  meat_processed: [
    'salami', 'hot dog', 'burger', 'meatball', 'sosis', 'sucuk', 'köfte',
    'kebap', 'sausage'
  ],
  // Seafood - Fresh
  seafood_fresh: [
    'fish', 'salmon', 'tuna', 'cod', 'tilapia', 'balık', 'somon', 'ton',
    'levrek', 'çupra'
  ],
  // Seafood - Shellfish
  seafood_shellfish: [
    'shrimp', 'prawn', 'crab', 'lobster', 'oyster', 'mussel', 'clam',
    'karides', 'yengeç', 'istiridye', 'midye'
  ],
  // Seafood - Frozen
  seafood_frozen: [
    'frozen fish', 'frozen seafood', 'dondurulmuş balık'
  ],
  // Dairy - Milk & Cream
  dairy_milk_cream: [
    'milk', 'cream', 'sour cream', 'half and half', 'heavy cream', 'süt',
    'krema', 'ekşi krema', 'kaymak'
  ],
  // Dairy - Ayran
  dairy_ayran: [
    'ayran', 'yogurt drink'
  ],
  // Dairy - Eggs
  dairy_eggs_sub: [
    'egg', 'eggs', 'yumurta'
  ],
  // Dairy - Turkish Cheese
  dairy_cheese_turkish: [
    'beyaz peynir', 'kaşar', 'lor', 'labne', 'tulum', 'dil peyniri'
  ],
  // Dairy - International Cheese
  dairy_cheese_international: [
    'cheese', 'mozzarella', 'cheddar', 'parmesan', 'feta', 'ricotta',
    'cottage cheese', 'cream cheese', 'peynir'
  ],
  // Dairy - Yogurt
  dairy_yogurt: [
    'yogurt', 'yoghurt', 'greek yogurt', 'yoğurt'
  ],
  // Dairy - Butter
  dairy_butter: [
    'butter', 'margarine', 'tereyağı', 'margarin'
  ],
  // Bakery - Bread
  bakery_bread: [
    'bread', 'bagel', 'roll', 'bun', 'ekmek'
  ],
  // Bakery - Turkish Bread
  bakery_turkish_bread: [
    'pide', 'simit', 'poğaça', 'açma', 'çörek', 'börek'
  ],
  // Bakery - Flatbreads
  bakery_flatbreads: [
    'pita', 'tortilla', 'lahmacun', 'naan'
  ],
  // Bakery - Pastries
  bakery_pastries: [
    'croissant', 'muffin', 'donut', 'doughnut', 'pastry', 'pretzel'
  ],
  // Bakery - Cakes & Pies
  bakery_cakes_pies: [
    'cake', 'pie', 'kek', 'pasta'
  ],
  // Deli - Sliced Meats
  deli_sliced_meats: [
    'deli meat', 'sliced meat', 'ham', 'turkey', 'roast beef'
  ],
  // Deli - Sliced Cheese
  deli_sliced_cheese: [
    'deli cheese', 'sliced cheese'
  ],
  // Deli - Meze
  deli_meze: [
    'hummus', 'humus', 'mezeler', 'dip', 'spread'
  ],
  // Deli - Salads
  deli_salads: [
    'salad', 'prepared salad', 'salata', 'hazır salata'
  ],
  // Deli - Ready Meals
  deli_ready_meals: [
    'ready to eat', 'prepared', 'rotisserie', 'hazır yemek'
  ],
  // Deli - Sushi
  deli_sushi: [
    'sushi', 'sashimi'
  ],
  // Frozen - Meals
  frozen_meals: [
    'frozen dinner', 'frozen meal', 'dondurulmuş yemek', 'frozen', 'frowzn'
  ],
  // Frozen - Pizza
  frozen_pizza: [
    'frozen pizza', 'dondurulmuş pizza'
  ],
  // Frozen - Vegetables
  frozen_vegetables: [
    'frozen vegetables', 'frozen veg', 'dondurulmuş sebze'
  ],
  // Frozen - Fruit
  frozen_fruit: [
    'frozen fruit', 'frozen berries', 'dondurulmuş meyve'
  ],
  // Frozen - Dessert
  frozen_dessert: [
    'ice cream', 'frozen yogurt', 'gelato', 'dondurma'
  ],
  // Pantry - Pasta
  pantry_pasta: [
    'pasta', 'spaghetti', 'macaroni', 'penne', 'fettuccine', 'makarna'
  ],
  // Pantry - Rice
  pantry_rice: [
    'rice', 'basmati', 'jasmine', 'pirinç'
  ],
  // Pantry - Bulgur
  pantry_bulgur: [
    'bulgur', 'bulgur wheat'
  ],
  // Pantry - Canned Vegetables
  pantry_canned_veg: [
    'canned vegetables', 'canned corn', 'konserve sebze'
  ],
  // Pantry - Canned Tomatoes
  pantry_canned_tomatoes: [
    'canned tomatoes', 'tomato paste', 'tomato sauce', 'domates salçası'
  ],
  // Pantry - Canned Legumes
  pantry_canned_legumes: [
    'canned beans', 'canned chickpeas', 'canned lentils', 'konserve fasulye',
    'konserve nohut', 'konserve mercimek'
  ],
  // Pantry - Canned Olives
  pantry_canned_olive: [
    'olives', 'canned olives', 'zeytin'
  ],
  // Pantry - Canned Meat/Fish
  pantry_canned_meat_fish: [
    'canned tuna', 'canned salmon', 'canned meat', 'konserve ton', 'konserve et'
  ],
  // Pantry - Oils
  pantry_oils: [
    'oil', 'olive oil', 'vegetable oil', 'canola oil', 'yağ', 'zeytinyağı',
    'ayçiçek yağı'
  ],
  // Pantry - Vinegars
  pantry_vinegars: [
    'vinegar', 'balsamic', 'apple cider vinegar', 'sirke'
  ],
  // Pantry - Flour
  pantry_flour: [
    'flour', 'all purpose flour', 'bread flour', 'un', 'beyaz un'
  ],
  // Pantry - Sugar & Sweeteners
  pantry_sugar_sweeteners: [
    'sugar', 'brown sugar', 'honey', 'maple syrup', 'şeker', 'esmer şeker',
    'bal', 'pekmez'
  ],
  // Pantry - Spices
  pantry_spices: [
    'spice', 'herb', 'salt', 'pepper', 'black pepper', 'paprika', 'cumin',
    'tuz', 'karabiber', 'kırmızı biber', 'baharat'
  ],
  // Pantry - Cereal
  pantry_cereal: [
    'cereal', 'breakfast cereal', 'mısır gevreği'
  ],
  // Pantry - Oats
  pantry_oats: [
    'oats', 'oatmeal', 'rolled oats', 'yulaf'
  ],
  // Pantry - Spreads (Sweet)
  pantry_spreads_sweet: [
    'jam', 'jelly', 'marmalade', 'reçel', 'marmelat'
  ],
  // Pantry - Chocolate Spreads
  pantry_chocolate_spreads: [
    'nutella', 'chocolate spread', 'çikolata kreması'
  ],
  // Pantry - Ketchup, Mustard, Mayo
  pantry_ketchup_mustard_mayo: [
    'ketchup', 'mustard', 'mayonnaise', 'mayo', 'ketçap', 'hardal', 'mayonez'
  ],
  // Pantry - Hot Sauces
  pantry_hot_sauces: [
    'hot sauce', 'sriracha', 'tabasco', 'acı sos'
  ],
  // Pantry - Salad Dressings
  pantry_salad_dressings: [
    'salad dressing', 'ranch', 'caesar dressing', 'salata sosu'
  ],
  // Pantry - Pasta Sauce
  pantry_pasta_sauce: [
    'pasta sauce', 'marinara', 'alfredo', 'makarna sosu'
  ],
  // Snacks - Chips
  snacks_chips: [
    'chips', 'potato chips', 'cips', 'patates cipsi'
  ],
  // Snacks - Crackers
  snacks_crackers: [
    'crackers', 'biscuit', 'bisküvi', 'kraker'
  ],
  // Snacks - Nuts & Seeds
  snacks_nuts_seeds: [
    'nuts', 'almonds', 'walnuts', 'peanuts', 'cashews', 'pistachios', 'seeds',
    'fındık', 'fıstık', 'ceviz', 'badem', 'antep fıstığı', 'kuruyemiş'
  ],
  // Snacks - Bars
  snacks_bars: [
    'granola bar', 'energy bar', 'protein bar', 'protein çubuğu'
  ],
  // Snacks - Cookies
  snacks_cookies: [
    'cookies', 'biscuits', 'kurabiye', 'bisküvi'
  ],
  // Snacks - Candy & Chocolate
  snacks_candy_chocolate: [
    'candy', 'chocolate', 'chocolate bar', 'şekerleme', 'çikolata'
  ],
  // Snacks - Turkish Delight
  snacks_turkish_delight: [
    'turkish delight', 'lokum'
  ],
  // Snacks - Dried Fruit
  snacks_dried_fruit: [
    'dried fruit', 'raisins', 'dried apricots', 'kuru meyve', 'kuru üzüm',
    'kuru kayısı'
  ],
  // Beverages - Water
  bev_water: [
    'water', 'bottled water', 'sparkling water', 'su', 'maden suyu'
  ],
  // Beverages - Soda
  bev_soda: [
    'soda', 'cola', 'soft drink', 'carbonated', 'kola', 'gazoz'
  ],
  // Beverages - Juice
  bev_juice: [
    'juice', 'orange juice', 'apple juice', 'meyve suyu', 'portakal suyu'
  ],
  // Beverages - Energy & Sports
  bev_energy_sports: [
    'energy drink', 'sports drink', 'enerji içeceği', 'spor içeceği'
  ],
  // Beverages - Turkish Tea
  bev_tea_turkish: [
    'turkish tea', 'çay', 'türk çayı'
  ],
  // Beverages - Other Tea
  bev_tea_other: [
    'tea', 'green tea', 'black tea', 'herbal tea', 'iced tea', 'soğuk çay'
  ],
  // Beverages - Turkish Coffee
  bev_coffee_turkish: [
    'turkish coffee', 'türk kahvesi'
  ],
  // Beverages - Ground Coffee
  bev_coffee_ground: [
    'coffee', 'ground coffee', 'coffee beans', 'kahve', 'çekirdek kahve'
  ],
  // Beverages - Instant Coffee
  bev_coffee_instant: [
    'instant coffee', 'nescafe', 'hazır kahve'
  ],
  // Beverages - Shelf Stable Milk
  bev_milk_shelf_stable: [
    'shelf stable milk', 'uht milk', 'uzun ömürlü süt'
  ],
  // Alcohol - Beer
  alcohol_beer: [
    'beer', 'lager', 'ale', 'bira'
  ],
  // Alcohol - Wine
  alcohol_wine: [
    'wine', 'red wine', 'white wine', 'şarap', 'kırmızı şarap', 'beyaz şarap'
  ],
  // Alcohol - Raki
  alcohol_raki: [
    'raki', 'rakı'
  ],
  // Alcohol - Spirits
  alcohol_spirits: [
    'whiskey', 'vodka', 'rum', 'gin', 'champagne', 'spirits', 'liquor',
    'viski', 'votka', 'rom', 'cin', 'şampanya', 'alkol'
  ],
  // Household - Cleaning
  household_cleaning: [
    'detergent', 'cleaning', 'all purpose cleaner', 'deterjan', 'temizlik',
    'temizleyici'
  ],
  // Household - Laundry
  household_laundry: [
    'laundry detergent', 'fabric softener', 'bleach', 'çamaşır deterjanı',
    'yumuşatıcı'
  ],
  // Household - Dishwashing
  household_dishwashing: [
    'dish soap', 'dishwasher detergent', 'bulaşık deterjanı', 'bulaşık sabunu'
  ],
  // Household - Paper
  household_paper: [
    'toilet paper', 'paper towel', 'napkins', 'tuvalet kağıdı', 'tuvalet kagidi',
    'tuvalet kagıdı', 'peçete', 'kağıt havlu', 'kagit havlu'
  ],
  // Household - Trash & Storage
  household_trash_storage: [
    'trash bag', 'garbage bag', 'storage bag', 'ziploc', 'çöp poşeti'
  ],
  // Household - Air Care
  household_air_care: [
    'air freshener', 'candle', 'hava spreyi', 'mum'
  ],
  // Health - OTC
  health_otc: [
    'medicine', 'pain reliever', 'cold medicine', 'ilaç', 'ağrı kesici'
  ],
  // Health - Vitamins
  health_vitamins: [
    'vitamin', 'supplement', 'multivitamin', 'vitamin', 'takviye'
  ],
  // Personal - Oral
  personal_oral: [
    'toothpaste', 'toothbrush', 'mouthwash', 'floss', 'toothpick',
    'diş macunu', 'diş fırçası', 'ağız bakım suyu', 'kurdan'
  ],
  // Personal - Hair
  personal_hair: [
    'shampoo', 'conditioner', 'hair spray', 'hair dye', 'hair color',
    'şampuan', 'saç kremi', 'saç spreyi', 'saç boyası', 'sac boyasi',
    'saç boya', 'sac boya'
  ],
  // Personal - Body
  personal_body: [
    'soap', 'body wash', 'lotion', 'sabun', 'vücut şampuanı', 'losyon'
  ],
  // Personal - Deodorant
  personal_deodorant: [
    'deodorant', 'antiperspirant', 'deodorant'
  ],
  // Personal - Shaving
  personal_shaving: [
    'razor', 'shaving cream', 'aftershave', 'tıraş bıçağı', 'tıraş köpüğü'
  ],
  // Personal - Feminine
  personal_feminine: [
    'feminine hygiene', 'tampons', 'pads', 'kadın hijyeni'
  ],
  // Baby - Diapers
  baby_diapers: [
    'diaper', 'diapers', 'bebek bezi'
  ],
  // Baby - Wipes
  baby_wipes: [
    'baby wipes', 'wet wipes', 'bebek mendili', 'islak mendil', 'islak mendil'
  ],
  // Baby - Food
  baby_food: [
    'baby food', 'formula', 'bebek maması', 'mama'
  ],
  // Baby - Care
  baby_care: [
    'baby care', 'baby lotion', 'baby shampoo', 'bebek bakımı'
  ],
  // Pet - Dog
  pet_dog: [
    'dog food', 'dog treat', 'dog toy', 'köpek maması', 'köpek', 'köpek oyuncağı'
  ],
  // Pet - Cat
  pet_cat: [
    'cat food', 'cat treat', 'cat litter', 'cat toy', 'kedi maması', 'kedi',
    'kedi kumu', 'kedi oyuncağı'
  ],
  // Pet - Other
  pet_other: [
    'pet food', 'pet', 'pet supplies', 'evcil hayvan', 'pet malzemeleri'
  ]
};

/**
 * Normalizes Turkish characters typed with English keyboard to proper Turkish characters
 * Handles common keyboard layout mismatches like "uzum" -> "üzüm"
 */
const normalizeTurkishChars = (text: string): string => {
  return text
    .replace(/u/g, 'ü')
    .replace(/U/g, 'Ü')
    .replace(/o/g, 'ö')
    .replace(/O/g, 'Ö')
    .replace(/g/g, 'ğ')
    .replace(/G/g, 'Ğ')
    .replace(/s/g, 'ş')
    .replace(/S/g, 'Ş')
    .replace(/c/g, 'ç')
    .replace(/C/g, 'Ç')
    .replace(/i/g, 'ı')
    .replace(/I/g, 'İ');
};

// Cache for online lookups to avoid repeated API calls
const categoryCache = new Map<string, string>();

/**
 * Online lookup for product category using OpenAI API
 * Falls back to "Other" if API key is not available or request fails
 */
const lookupCategoryOnline = async (productName: string): Promise<string | null> => {
  // Check cache first
  const cacheKey = productName.toLowerCase().trim();
  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey) || null;
  }

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      // No API key configured, skip online lookup
      return null;
    }

    // Get all category names for the prompt
    const allCategories = Object.keys(CATEGORY_KEYWORDS).join(', ');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a grocery store categorization assistant. Categorize products into one of these categories: ${allCategories}, Other. Respond with only the category name, nothing else.`
          },
          {
            role: 'user',
            content: `What category does "${productName}" belong to in a grocery store?`
          }
        ],
        max_tokens: 20,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const category = data.choices[0]?.message?.content?.trim().toLowerCase();
    
    // Validate the category is one of our valid categories
    const validCategories = Object.keys(CATEGORY_KEYWORDS);
    if (category && (validCategories.includes(category) || category === 'other')) {
      const finalCategory = category === 'other' ? 'Other' : category;
      categoryCache.set(cacheKey, finalCategory);
      return finalCategory;
    }
  } catch (error) {
    console.error('Online category lookup failed:', error);
  }

  return null;
};

// Synchronous local keyword matching (fast)
const detectCategoryLocal = (productName: string): string | null => {
  if (!productName || productName.trim().length === 0) {
    return 'Other';
  }

  const lowerName = productName.toLowerCase().trim();
  const normalizedName = normalizeTurkishChars(lowerName);
  
  // Collect all keywords with their categories, sorted by length (longest first)
  const allKeywords: Array<{ category: string; keyword: string; length: number }> = [];
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      allKeywords.push({ category, keyword, length: keyword.length });
    }
  }
  
  // Sort by length (longest first) to prioritize specific matches
  allKeywords.sort((a, b) => b.length - a.length);
  
  // Check each keyword (longest first)
  for (const { category, keyword } of allKeywords) {
    const lowerKeyword = keyword.toLowerCase();
    const normalizedKeyword = normalizeTurkishChars(lowerKeyword);
    
    const wordBoundaryRegex = (pattern: string) => {
      const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
    };
    
    const exactMatch = lowerName === lowerKeyword || normalizedName === normalizedKeyword;
    const wordBoundaryMatch = wordBoundaryRegex(lowerKeyword).test(lowerName) || 
                             wordBoundaryRegex(normalizedKeyword).test(normalizedName);
    const containsMatch = lowerName.includes(lowerKeyword) || 
                         normalizedName.includes(lowerKeyword) ||
                         normalizedName.includes(normalizedKeyword);
    
    if (exactMatch || wordBoundaryMatch || (containsMatch && keyword.length >= 4)) {
      return category;
    }
  }

  return null; // No local match found
};

// Async function with online lookup fallback
export const detectCategory = async (productName: string): Promise<string> => {
  // First, try fast local matching
  const localMatch = detectCategoryLocal(productName);
  if (localMatch) {
    return localMatch;
  }

  // If no local match found, try online lookup (only if product name is substantial)
  if (productName.trim().length >= 3) {
    const onlineCategory = await lookupCategoryOnline(productName);
    if (onlineCategory) {
      return onlineCategory;
    }
  }

  return 'Other';
};
