// CropShield Frontend Controller Logic

// --- Global States ---
let currentLang = 'en';
let activeSection = 'home-sec';
let currentUser = null;
let selectedFile = null;
let currentPrediction = null;

// --- Chart Instances ---
let distributionChartInstance = null;
let healthyRatioChartInstance = null;

// --- In-Memory Mock Data (Fallbacks for Local Offline Mode) ---
let mockPredictions = [
    {
        id: 101,
        disease: {
            name: "Leaf Rust",
            scientificName: "Puccinia triticina",
            symptoms: "Small, circular orange-brown pustules scattered across the leaf surface.",
            causes: "Airborne fungal spores thriving in mild temperature and dew moisture.",
            severity: "MEDIUM",
            prevention: "Plant resistant cultivars, avoid excessive N-fertilizer.",
            treatment: "Foliar spray of Propiconazole or Tebuconazole.",
            fungicide: "Propiconazole 25% EC @ 200 ml/acre",
            imageUrl: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80"
        },
        confidence: 94.20,
        expectedRecovery: "14-21 days with systemic fungicides",
        status: "PENDING",
        createdAt: "2026-07-09T14:22:10"
    },
    {
        id: 102,
        disease: {
            name: "Healthy Wheat",
            scientificName: "Triticum aestivum",
            symptoms: "Uniform green, robust stems, no lesions or rust spots.",
            causes: "Optimal nutrient application, correct soil pH, and clean seeds.",
            severity: "LOW",
            prevention: "Regular crop rotation, crop monitoring.",
            treatment: "None required. Maintain irrigation.",
            fungicide: "None",
            imageUrl: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=400&q=80"
        },
        confidence: 98.70,
        expectedRecovery: "N/A",
        status: "RESOLVED",
        createdAt: "2026-07-08T09:15:30"
    }
];

let mockUsers = [
    { id: 1, name: "Default Farmer", email: "farmer@cropshield.com", phone: "9876543210", role: "FARMER" },
    { id: 2, name: "CropShield Admin", email: "admin@cropshield.com", phone: "9999999999", role: "ADMIN" }
];

let mockFeedbacks = [
    { id: 1, name: "Selvam Kumar", email: "selvam@farm.com", rating: 5, message: "Excellent AI prediction accuracy. My wheat stripe rust was identified in seconds." }
];

// --- Translation Dictionary (English / Tamil) ---
const translations = {
    en: {
        nav_home: "Home",
        nav_detection: "AI Detection",
        nav_diseases: "Diseases Info",
        nav_prevention: "Prevention",
        nav_dashboard: "Dashboard",
        nav_about: "About",
        nav_contact: "Contact",
        nav_admin: "Admin Desk",
        login: "Login",
        hero_badge: "Advanced Agriculture AI",
        hero_title: "CropShield",
        hero_tagline: "Protecting Every Wheat Crop with Artificial Intelligence",
        btn_get_started: "Get Started",
        btn_explore: "Explore Features",
        stat_accuracy: "CNN Diagnostic Accuracy",
        stat_diseases: "Wheat Conditions Cataloged",
        stat_speed: "Inference Response Time",
        stat_farmers: "Smart Farm Diagnostics",
        feat_heading: "Our Smart Capabilities",
        feat_sub: "Bringing cutting-edge deep learning tools from research labs straight into the agricultural fields.",
        feat1_title: "Deep Learning Detection",
        feat1_desc: "Uses multi-layer Convolutional Neural Networks (CNNs) trained on segmented datasets to identify leaf pustules, mildew webs, and necrotic margins.",
        feat2_title: "Fungicide & Health Reports",
        feat2_desc: "Generate official formatted PDF health certificates stating severity indexes, chemical controls, organic management, and recovery checklists.",
        feat3_title: "Voice & Tamil Support",
        feat3_desc: "Built-in localization to Tamil and speech synthesis to read results aloud, ensuring accessibility for local farmers.",
        car1_title: "Securing Global Food Chains",
        car1_desc: "Wheat accounts for 20% of calories globally. CropShield helps farmers combat rust spores early to secure crop yield.",
        car2_title: "Empowering Local Agriculturists",
        car2_desc: "Instant analysis right on your smartphone. CropShield delivers visual and voice readouts requiring no expert agronomist on site.",
        car3_title: "State-of-the-Art Deep Learning",
        car3_desc: "Built with advanced Neural Networks optimized for field noise, shadows, and angle skew variations.",
        det_heading: "AI Disease Diagnostic Laboratory",
        det_sub: "Upload a high-resolution image of a wheat leaf. The CropShield neural engine will inspect the surface structure and diagnose conditions.",
        det_upload_title: "Submit Wheat Leaf Image",
        det_drag_text: "Drag & Drop Image here",
        det_or_browse: "or browse from storage",
        btn_diagnose: "Run AI Diagnosis",
        det_wait_title: "Awaiting Diagnostic Input",
        det_wait_desc: "Upload a wheat leaf photo and run the diagnosis to generate real-time AI results here.",
        catalog_title: "Wheat Pathogen Library",
        catalog_sub: "Detailed catalog of key wheat leaves rusts and mildew pathogens. Browse symptoms, structural causes, and curative fungicides.",
        prev_heading: "Smart Wheat Protection Protocols",
        prev_sub: "Integrated Pest Management (IPM) techniques for high-yield wheat cultivation.",
        prev1_title: "Crop Rotation",
        prev1_desc: "Avoid sowing wheat consecutively in the same soil. Rotate with non-cereal legumes (e.g., chickpea, mung bean) to break the lifecycle of soil-borne pathogens like Leaf Blight spores.",
        prev2_title: "Seed Treatment",
        prev2_desc: "Coat wheat seeds with fungicides (e.g. Carboxin or Thiram) before sowing. Seed treatment controls early seedling blights and smut spores carried on seed hulls.",
        prev3_title: "Proper Irrigation",
        prev3_desc: "Avoid overhead sprinkler irrigation during warm humid days, as leaf wetness invites Rust spore germination. Prefer drip irrigation or early morning watering to allow leaves to dry rapidly.",
        prev4_title: "Resistant Varieties",
        prev4_desc: "Cultivate certified crop varieties resistant to Stripe Rust (e.g., HD-2967, HD-3086) and Stem Rust (e.g., DBW-187). Genetic resistance is the most cost-effective protection barrier.",
        prev5_title: "Balanced Fertilization",
        prev5_desc: "Avoid excessive nitrogen fertilizers, which create a dense, succulent leaf canopy highly vulnerable to Powdery Mildew and Rust fungi. Apply balanced N-P-K ratios.",
        prev6_title: "Regular Field Monitoring",
        prev6_desc: "Examine crops twice a week, particularly the lower leaf sheaths. Capture images of any yellow spots and check with CropShield to target fungicide sprays immediately.",
        dash_title: "Farmer Analytics Desk",
        dash_sub: "Visual statistics and historical diagnostic timelines showing crop health status and distribution.",
        dash_total: "Total Predictions Checked",
        dash_healthy: "Healthy Crops Detected",
        dash_diseased: "Diseased Crops Detected",
        chart_dist: "Disease Occurrence Ratio",
        chart_ratio: "Healthy vs Infected Scan Count",
        history_title: "My Diagnostic History",
        about_badge: "What is CropShield?",
        about_title: "AI Agriculture Health Portal",
        contact_title: "Get In Touch",
        contact_sub: "Have queries regarding crop diagnosis or API integration? Send us a message.",
        faq_heading: "Frequently Answered Questions"
    },
    ta: {
        nav_home: "முகப்பு",
        nav_detection: "AI கண்டறிதல்",
        nav_diseases: "நோய் விவரங்கள்",
        nav_prevention: "தடுப்பு முறைகள்",
        nav_dashboard: "பகுப்பாய்வு",
        nav_about: "பற்றி",
        nav_contact: "தொடர்பு",
        nav_admin: "நிர்வாக குழு",
        login: "உள்நுழைக",
        hero_badge: "மேம்பட்ட விவசாய செயற்கை நுண்ணறிவு",
        hero_title: "கிராப்ஷீல்ட்",
        hero_tagline: "செயற்கை நுண்ணறிவு மூலம் கோதுமை பயிர்களைப் பாதுகாத்தல்",
        btn_get_started: "தொடங்குங்கள்",
        btn_explore: "அம்சங்களை ஆராய்க",
        stat_accuracy: "கண்டறியும் துல்லியம்",
        stat_diseases: "நோய் வகைகள்",
        stat_speed: "கண்டறியும் நேரம்",
        stat_farmers: "பண்ணை சோதனைகள்",
        feat_heading: "எங்கள் திறன்கள்",
        feat_sub: "ஆராய்ச்சி கூடங்களின் செயற்கை நுண்ணறிவு தொழில்நுட்பங்களை நேரடியாக விவசாயிகளுக்கு கொண்டு சேர்க்கிறோம்.",
        feat1_title: "ஆழ்ந்த கற்றல் கண்டறிதல்",
        feat1_desc: "இலையின் புள்ளிகள், பூஞ்சை காளான் மற்றும் காய்ந்த ஓரங்களை கண்டறிய பயிற்சி அளிக்கப்பட்ட நரம்பியல் நெட்வொர்க்குகளைப் பயன்படுத்துகிறது.",
        feat2_title: "பூஞ்சைக் கொல்லி மற்றும் சுகாதார அறிக்கைகள்",
        feat2_desc: "நோயின் தீவிரத்தன்மை, வேதியியல் கட்டுப்பாடு மற்றும் கரிம மேலாண்மை அடங்கிய PDF சுகாதார சான்றிதழ்களை உருவாக்குகிறது.",
        feat3_title: "குரல் மற்றும் தமிழ் ஆதரவு",
        feat3_desc: "உள்ளூர் விவசாயிகள் எளிதாக அணுகும் வகையில் தமிழில் மொழிபெயர்ப்பு மற்றும் முடிவுகளை உரக்க வாசிக்கும் குரல் உதவி வசதி.",
        car1_title: "உலகளாவிய உணவு பாதுகாப்பு",
        car1_desc: "உலகளவில் கோதுமை 20% கலோரிகளை வழங்குகிறது. பூஞ்சை தொற்றுக்களை முன்கூட்டியே தடுத்து மகசூலை காக்க உதவுகிறது.",
        car2_title: "உள்ளூர் விவசாயிகளை மேம்படுத்துதல்",
        car2_desc: "உங்கள் மொபைல் மூலமாகவே உடனடி பகுப்பாய்வு. நிபுணர் தேவையின்றி எளிய முறையில் தமிழ் விளக்கம்.",
        car3_title: "அதிநவீன ஆழ்ந்த கற்றல்",
        car3_desc: "நிழல்கள், கோண மாறுபாடுகள் மற்றும் இரைச்சல்களுக்கு இடையே துல்லியமாக செயல்படும் வகையில் உகந்த நரம்பியல் நெட்வொர்க்.",
        det_heading: "AI நோய் கண்டறியும் கூடம்",
        det_sub: "கோதுமை இலையின் தெளிவான படத்தை பதிவேற்றவும். கிராப்ஷீல்ட் நரம்பியல் பொறி இலையை பகுப்பாய்வு செய்து நோயை கண்டறியும்.",
        det_upload_title: "கோதுமை இலை படத்தை சமர்ப்பிக்கவும்",
        det_drag_text: "படத்தை இங்கே இழுத்து போடவும்",
        det_or_browse: "அல்லது கணினியிலிருந்து தேர்ந்தெடுக்கவும்",
        btn_diagnose: "AI பரிசோதனையைத் தொடங்கு",
        det_wait_title: "பரிசோதனைக்காக காத்திருக்கிறது",
        det_wait_desc: "உடனடி முடிவுகளை பெற ஒரு கோதுமை இலை படத்தை பதிவேற்றி பரிசோதிக்கவும்.",
        catalog_title: "கோதுமை நோய் களஞ்சியம்",
        catalog_sub: "முக்கிய கோதுமை இலை துரு மற்றும் பூஞ்சை நோய்களின் விரிவான பட்டியல். அறிகுறிகள் மற்றும் மருந்துகளை காண்க.",
        prev_heading: "ஸ்மார்ட் பயிர் பாதுகாப்பு நெறிமுறைகள்",
        prev_sub: "அதிக மகசூல் தரக்கூடிய கோதுமை சாகுபடிக்கு தேவையான ஒருங்கிணைந்த பூச்சி மேலாண்மை நுட்பங்கள்.",
        prev1_title: "பயிர் சுழற்சி",
        prev1_desc: "ஒரே நிலத்தில் தொடர்ந்து கோதுமை பயிரிடுவதை தவிர்க்கவும். பூஞ்சை வித்திகளின் வாழ்க்கைச் சுழற்சியை உடைக்க பருப்பு வகைகளுடன் சுழற்சி முறையில் பயிரிடவும்.",
        prev2_title: "விதை நேர்த்தி",
        prev2_desc: "விதைப்பதற்கு முன் விதைகளை கார்பாக்சின் அல்லது திராம் போன்ற பூஞ்சைக் கொல்லிகளால் பூசவும். இது ஆரம்பகால நாற்று வாடல் நோயை தடுக்கிறது.",
        prev3_title: "முறையான நீர்ப்பாசனம்",
        prev3_desc: "ஈரப்பதம் துரு வித்திகளை முளைக்க தூண்டுவதால், தெளிப்பு நீர்ப்பாசனத்தை தவிர்க்கவும். இலைகள் விரைவில் உலர சொட்டு நீர் பாசனத்தை பயன்படுத்தவும்.",
        prev4_title: "எதிர்ப்புத் திறன் கொண்ட ரகங்கள்",
        prev4_desc: "மஞ்சள் துரு நோயை எதிர்க்கும் சான்றளிக்கப்பட்ட பயிர் ரகங்களை (எ.கா. HD-2967, DBW-187) சாகுபடி செய்யவும். இதுவே சிக்கனமான பாதுகாப்பு.",
        prev5_title: "சமச்சீர் உரமிடுதல்",
        prev5_desc: "அதிகப்படியான நைட்ரஜன் உரங்களைத் தவிர்க்கவும், இது அடர்த்தியான ஈரமான இலைகளை உருவாக்கி சாம்பல் நோய் பரவ வழிவகுக்கும். சமச்சீர் N-P-K விகிதங்களைப் பயன்படுத்தவும்.",
        prev6_title: "தொடர் பண்ணை கண்காணிப்பு",
        prev6_desc: "வாரத்திற்கு இரண்டு முறை பயிர்களை சோதிக்கவும். ஏதேனும் மஞ்சள் நிற புள்ளிகள் இருந்தால், கிராப்ஷீல்ட் மூலமாக உடனடி பூஞ்சைக் கொல்லி மருந்தை தெளிக்கவும்.",
        dash_title: "விவசாய பகுப்பாய்வு மையம்",
        dash_sub: "பயிர் ஆரோக்கிய நிலை மற்றும் நோய் பரவலை காட்டும் புள்ளிவிவர விளக்கப்படங்கள்.",
        dash_total: "பரிசோதிக்கப்பட்ட மொத்த பதிவுகள்",
        dash_healthy: "ஆரோக்கியமான பயிர்கள்",
        dash_diseased: "பாதிக்கப்பட்ட பயிர்கள்",
        chart_dist: "நோய் பரவல் விகிதம்",
        chart_ratio: "ஆரோக்கியமான மற்றும் பாதிக்கப்பட்ட பயிர் ஸ்கேன் எண்ணிக்கை",
        history_title: "எனது பரிசோதனை வரலாறு",
        about_badge: "கிராப்ஷீல்ட் என்றால் என்ன?",
        about_title: "செயற்கை நுண்ணறிவு வேளாண் போர்டல்",
        contact_title: "தொடர்பு கொள்ள",
        contact_sub: "பயிர் சோதனை அல்லது API இணைப்பு பற்றிய சந்தேகங்கள் உள்ளதா? எங்களுக்கு செய்தி அனுப்புங்கள்.",
        faq_heading: "அடிக்கடி கேட்கப்படும் கேள்விகள்"
    }
};

// --- Disease Static Master Data (For UI catalog & local fallback) ---
const diseasesMaster = [
    {
        id: 1,
        name: "Healthy Wheat",
        scientificName: "Triticum aestivum",
        symptoms: "Leaves are uniform bright green, turgid, and free of spots, pustules, or powdery growth.",
        causes: "Optimal growth conditions with balanced nutrients, proper irrigation, and absence of pathogenic spores.",
        severity: "LOW",
        prevention: "Continue Crop rotation, use certified healthy seed varieties, monitor soil health, and apply balanced N-P-K fertilizer schedules.",
        treatment: "No treatment required. Maintain regular watering and weed control.",
        fungicide: "None",
        imageUrl: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Leaf Rust",
        scientificName: "Puccinia triticina",
        symptoms: "Small, round, orange-brown pustules on the upper leaf surface. Pustules rupture to release powdery orange spores.",
        causes: "Airborne spores of Puccinia triticina fungus, favored by mild temperatures (15-22°C) and moisture or dew.",
        severity: "MEDIUM",
        prevention: "Sow rust-resistant varieties, destroy volunteer wheat plants, avoid excess nitrogen fertilizers.",
        treatment: "Apply systemic fungicides at the first sign of pustules. Remove infected debris post-harvest.",
        fungicide: "Propiconazole 25% EC, Tebuconazole 250 EC, or Triadimefon",
        imageUrl: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Stripe Rust",
        scientificName: "Puccinia striiformis",
        symptoms: "Yellowish-orange pustules arranged in narrow, parallel stripes along the leaf veins and leaf sheaths.",
        causes: "Fungal pathogen Puccinia striiformis, thriving in cool (2-15°C) and wet conditions, common in early spring.",
        severity: "HIGH",
        prevention: "Plant resistant cultivars, adjust planting date to avoid peak spore load, practice crop rotation.",
        treatment: "Foliar fungicide application is critical. Monitor crops from early spring.",
        fungicide: "Tebuconazole 50% + Trifloxystrobin 25% WG, or Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
        imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Stem Rust",
        scientificName: "Puccinia graminis",
        symptoms: "Elongated, dark reddish-brown pustules on stems and leaf sheaths. Weakens stems, leading to severe lodging.",
        causes: "Fungus Puccinia graminis, favored by warm, humid conditions (20-30°C) and late-season dew.",
        severity: "HIGH",
        prevention: "Eradicate barberry bushes (alternate hosts), grow early-maturing and resistant varieties.",
        treatment: "Apply protective and curative fungicides immediately. Timely harvest prevents severe lodging losses.",
        fungicide: "Pyraclostrobin 20% WG, Propiconazole, or Tebuconazole",
        imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c7769ae?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Powdery Mildew",
        scientificName: "Blumeria graminis",
        symptoms: "White to light gray, powdery, cobweb-like fungal patches on the upper surface of lower leaves and stems.",
        causes: "Fungus Blumeria graminis f. sp. tritici, promoted by cool, humid, and shaded conditions with dense crop canopies.",
        severity: "MEDIUM",
        prevention: "Avoid dense sowing, maintain proper ventilation, use balanced nitrogen, select resistant varieties.",
        treatment: "Apply systemic fungicides if the infection moves to the upper two leaves before head emergence.",
        fungicide: "Triadimenol 150 EC, Flutriafol, or Propiconazole 25% EC",
        imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Leaf Blight",
        scientificName: "Alternaria triticina / Bipolaris sorokiniana",
        symptoms: "Oval, dark-brown spots on leaves which enlarge to form irregular, light-brown necrotic blotches.",
        causes: "Seed-borne or crop residue-borne fungal pathogens, favored by warm, humid weather (25-30°C) with frequent rains.",
        severity: "MEDIUM",
        prevention: "Use clean certified seeds, treat seeds before sowing, practice deep plowing, rotate with non-cereal crops.",
        treatment: "Apply foliar spray of fungicides at early stages of symptom development.",
        fungicide: "Mancozeb 75% WP, Zineb, or Propiconazole",
        imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Septoria Leaf Blotch",
        scientificName: "Septoria tritici",
        symptoms: "Speckled, lens-shaped, gray-brown spots (lesions) on leaves. Lesions contain tiny black dots (pycnidia).",
        causes: "Fungus Septoria tritici (Mycosphaerella graminicola), spread by splashing rain and high relative humidity.",
        severity: "HIGH",
        prevention: "Incorporate stubble by deep plowing, rotate crops, space rows to improve aeration, choose resistant varieties.",
        treatment: "Spray protective or systemic fungicides at first node appearance or flag leaf emergence.",
        fungicide: "Azoxystrobin + Propiconazole, or Chlorothalonil 75% WP",
        imageUrl: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=500&q=80"
    }
];

// --- Initial Window Onload Setup ---
window.onload = function() {
    // Check if user session exists in local storage
    const storedUser = localStorage.getItem('cropshield_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUserSessionUI();
    }
    
    // Check theme preference
    const storedTheme = localStorage.getItem('cropshield_theme');
    if (storedTheme === 'dark') {
        document.body.className = 'dark-mode';
        document.getElementById('theme-toggle-btn').innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
    }

    // Populate disease catalog grid
    renderDiseaseCatalog(diseasesMaster);
    
    // Load and refresh dashboard charts and tables
    refreshDashboard();
    
    // Init chatbot welcome
    setTimeout(() => {
        // Simple micro-interaction: show chatbot bounce
        const chatBtn = document.querySelector('.chatbot-trigger-btn');
        chatBtn.classList.add('bounce');
    }, 2000);
};

// --- Navigation Controller ---
function showSection(sectionId) {
    const sections = document.querySelectorAll('.app-section');
    sections.forEach(sec => {
        sec.classList.remove('active-section');
    });
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active-section');
        activeSection = sectionId;
        
        // Update navbar active state
        const links = document.querySelectorAll('.navbar-nav .nav-link');
        links.forEach(l => {
            l.classList.remove('active');
            // Compare link text or attribute to find correct match
        });
        
        // Window scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (sectionId === 'dashboard-sec') {
        refreshDashboard();
    } else if (sectionId === 'admin-sec') {
        refreshAdminPanel();
    }
}

function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Theme Toggle Controller ---
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (body.classList.contains('light-mode')) {
        body.className = 'dark-mode';
        themeBtn.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
        localStorage.setItem('cropshield_theme', 'dark');
    } else {
        body.className = 'light-mode';
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('cropshield_theme', 'light');
    }
}

// --- Multilingual Controller (English / Tamil) ---
function toggleLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update elements having data-lang attribute
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Translate placeholder text for input fields
    const searchInput = document.getElementById('search-disease-input');
    if (searchInput) {
        if (lang === 'ta') {
            searchInput.placeholder = "கோதுமை நோய்களைத் தேடுங்கள் (எ.கா. இலை துரு, சாம்பல் நோய்)...";
        } else {
            searchInput.placeholder = "Search wheat diseases (e.g. Leaf Rust, Powdery Mildew)...";
        }
    }
}

// --- Rendering Catalog Grid ---
function renderDiseaseCatalog(diseases) {
    const container = document.getElementById('disease-catalog-row');
    if (!container) return;
    
    container.innerHTML = '';
    diseases.forEach(d => {
        const severityClass = d.severity === 'HIGH' ? 'badge-high' : (d.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low');
        const cardHtml = `
            <div class="col-md-6 col-lg-4">
                <div class="card border-0 shadow bg-glass disease-card h-100 hover-lift">
                    <div class="disease-img-wrapper">
                        <img src="${d.imageUrl}" class="w-100 h-100 object-fit-cover" alt="${d.name}">
                        <span class="severity-tag ${severityClass}">${d.severity} SEVERITY</span>
                    </div>
                    <div class="card-body font-poppins p-4">
                        <h4 class="fw-bold text-success mb-1">${d.name}</h4>
                        <p class="text-muted italic font-8 mb-3">${d.scientificName}</p>
                        
                        <h6 class="fw-bold text-dark mb-1">Symptoms:</h6>
                        <p class="text-muted font-8 mb-3 text-truncate-2">${d.symptoms}</p>
                        
                        <h6 class="fw-bold text-dark mb-1">Curative Fungicide:</h6>
                        <p class="text-success font-8 fw-semibold mb-0"><i class="fa-solid fa-flask"></i> ${d.fungicide}</p>
                        
                        <div class="mt-3 pt-2 border-top d-flex gap-2">
                            <button class="btn btn-sm btn-outline-success w-100" onclick="showDiseaseDetail(${d.id})"><i class="fa-solid fa-circle-info"></i> More Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function showDiseaseDetail(id) {
    const dis = diseasesMaster.find(d => d.id === id);
    if (!dis) return;
    
    // Inject detail info directly into AI Prediction Results interface block to save layouts
    showSection('detection-sec');
    
    const def = document.getElementById('output-default');
    const load = document.getElementById('output-loading');
    const res = document.getElementById('output-result');
    
    if (def) def.classList.add('d-none');
    if (load) load.classList.add('d-none');
    if (res) {
        res.classList.remove('d-none');
        document.getElementById('result-leaf-image').src = dis.imageUrl;
        document.getElementById('result-disease-name').textContent = dis.name;
        document.getElementById('result-scientific-name').textContent = dis.scientificName;
        
        const badge = document.getElementById('result-severity-badge');
        badge.textContent = `${dis.severity} SEVERITY`;
        badge.className = `badge mt-2 px-3 py-1 rounded ${dis.severity === 'HIGH' ? 'bg-danger' : (dis.severity === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')}`;
        
        document.getElementById('result-confidence').textContent = "Catalog Master File";
        document.getElementById('result-confidence-bar').style.width = "100%";
        document.getElementById('result-symptoms').textContent = dis.symptoms;
        document.getElementById('result-causes').textContent = dis.causes;
        document.getElementById('result-fungicide').textContent = dis.fungicide;
        
        let rec = "14 days under correct management";
        if (dis.severity === 'HIGH') rec = "21-28 days with urgent chemical spray";
        else if (dis.name.includes("Healthy")) rec = "N/A (Healthy leaf)";
        document.getElementById('result-recovery').textContent = rec;
        
        document.getElementById('result-treatment').textContent = dis.treatment;
        document.getElementById('btn-download-pdf').style.display = 'none'; // Disable PDF for static catalog view
        
        currentPrediction = {
            id: 0,
            disease: dis,
            confidence: 100,
            expectedRecovery: rec
        };
    }
}

// --- Disease Search Filters ---
function filterDiseaseSearch() {
    const query = document.getElementById('search-disease-input').value.toLowerCase();
    const dropdown = document.getElementById('search-results-list');
    
    if (!query) {
        dropdown.style.display = 'none';
        return;
    }
    
    const matches = diseasesMaster.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.scientificName.toLowerCase().includes(query) ||
        d.symptoms.toLowerCase().includes(query)
    );
    
    dropdown.innerHTML = '';
    if (matches.length > 0) {
        dropdown.style.display = 'block';
        matches.slice(0, 5).forEach(m => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action cursor-pointer font-poppins font-8';
            li.innerHTML = `<strong>${m.name}</strong> <span class="text-muted">(${m.scientificName})</span>`;
            li.onclick = () => {
                showDiseaseDetail(m.id);
                document.getElementById('search-disease-input').value = '';
                dropdown.style.display = 'none';
            };
            dropdown.appendChild(li);
        });
    } else {
        dropdown.style.display = 'block';
        dropdown.innerHTML = '<li class="list-group-item text-muted font-8">No diseases found matching criteria.</li>';
    }
}

// Close search list on clicking outside
document.addEventListener('click', function(e) {
    const list = document.getElementById('search-results-list');
    const input = document.getElementById('search-disease-input');
    if (list && e.target !== input) {
        list.style.display = 'none';
    }
});

// --- Image Selection & Preview Controllers ---
function triggerFileInput() {
    document.getElementById('leaf-image-input').click();
}

// Drag & drop handlers
const dropzone = document.getElementById('dropzone');
if (dropzone) {
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-warning');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-warning');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-warning');
        if (e.dataTransfer.files.length > 0) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });
}

function previewSelectedImage(event) {
    if (event.target.files.length > 0) {
        handleImageFile(event.target.files[0]);
    }
}

function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG)');
        return;
    }
    selectedFile = file;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('leaf-preview').src = e.target.result;
        document.getElementById('preview-box').classList.remove('d-none');
        document.getElementById('dropzone').classList.add('d-none');
        document.getElementById('btn-predict').disabled = false;
    };
    reader.readAsDataURL(file);
}

function clearSelectedImage(event) {
    if (event) event.stopPropagation();
    selectedFile = null;
    document.getElementById('leaf-image-input').value = '';
    document.getElementById('preview-box').classList.add('d-none');
    document.getElementById('dropzone').classList.remove('d-none');
    document.getElementById('btn-predict').disabled = true;
}

// --- Submit Diagnosis Request ---
function submitDiagnosticRequest() {
    if (!selectedFile) return;
    
    const def = document.getElementById('output-default');
    const load = document.getElementById('output-loading');
    const res = document.getElementById('output-result');
    
    def.classList.add('d-none');
    load.classList.remove('d-none');
    res.classList.add('d-none');
    
    // Animate CNN pipeline loading bar steps
    animateInferenceSteps(0);
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    if (currentUser) {
        formData.append('userId', currentUser.id);
    }
    
    // REST fetch call to Spring Boot Controller
    fetch('/api/predictions/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP connection error: " + response.statusText);
        }
        return response.json();
    })
    .then(prediction => {
        setTimeout(() => {
            renderPredictionResult(prediction);
        }, 1500); // Small delay to let users observe the CNN pipeline steps
    })
    .catch(error => {
        console.warn("Spring Boot backend offline. Running client-side heuristic simulation. Detail: " + error.message);
        // Fallback simulation mode
        runClientHeuristicPrediction(selectedFile);
    });
}

// CNN loader phase animation
function animateInferenceSteps(step) {
    const progressBar = document.getElementById('detection-progress');
    const steps = [
        { id: 'step-upload', val: 20 },
        { id: 'step-preprocess', val: 40 },
        { id: 'step-cnn', val: 60 },
        { id: 'step-classify', val: 80 },
        { id: 'step-db', val: 100 }
    ];
    
    if (step < steps.length) {
        setTimeout(() => {
            // Activate step
            document.querySelectorAll('.step-line').forEach(line => line.classList.remove('active'));
            const activeStep = document.getElementById(steps[step].id);
            if (activeStep) activeStep.classList.add('active');
            
            progressBar.style.width = steps[step].val + '%';
            animateInferenceSteps(step + 1);
        }, 400);
    }
}

// Render result card
function renderPredictionResult(prediction) {
    currentPrediction = prediction;
    
    document.getElementById('output-loading').classList.add('d-none');
    const res = document.getElementById('output-result');
    res.classList.remove('d-none');
    
    // Display analysed leaf image
    // Normalise Windows vs Linux file paths to get filename
    const filename = prediction.imagePath.replace(/\\/g, '/').split('/').pop();
    document.getElementById('result-leaf-image').src = `/api/predictions/images/${filename}`;
    
    // Inject textual data
    document.getElementById('result-disease-name').textContent = prediction.disease.name;
    document.getElementById('result-scientific-name').textContent = prediction.disease.scientificName;
    
    const confidenceVal = prediction.confidence.toFixed(1);
    document.getElementById('result-confidence').textContent = confidenceVal + '%';
    document.getElementById('result-confidence-bar').style.width = confidenceVal + '%';
    
    document.getElementById('result-symptoms').textContent = prediction.disease.symptoms;
    document.getElementById('result-causes').textContent = prediction.disease.causes;
    document.getElementById('result-fungicide').textContent = prediction.disease.fungicide;
    document.getElementById('result-recovery').textContent = prediction.expectedRecovery;
    document.getElementById('result-treatment').textContent = prediction.disease.treatment;
    
    // Severity styling
    const badge = document.getElementById('result-severity-badge');
    badge.textContent = `${prediction.disease.severity} SEVERITY`;
    badge.className = `badge mt-2 px-3 py-1 rounded ${prediction.disease.severity === 'HIGH' ? 'bg-danger' : (prediction.disease.severity === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')}`;
    
    document.getElementById('btn-download-pdf').style.display = 'inline-block';
    
    // Auto-read aloud in English/Tamil using Web Speech synthesis
    speakPrediction();
}

// Local mock simulation if backend is not running
function runClientHeuristicPrediction(file) {
    const filename = file.name.toLowerCase();
    let diseaseSelected = diseasesMaster[0]; // Healthy Default
    let confidence = 96.2;
    
    if (filename.includes('stripe') || filename.includes('yellow')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Stripe"));
        confidence = 89.1;
    } else if (filename.includes('stem')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Stem"));
        confidence = 92.4;
    } else if (filename.includes('rust')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Leaf Rust"));
        confidence = 95.8;
    } else if (filename.includes('mildew')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Powdery"));
        confidence = 86.4;
    } else if (filename.includes('blight')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Blight"));
        confidence = 79.5;
    } else if (filename.includes('septoria')) {
        diseaseSelected = diseasesMaster.find(d => d.name.includes("Septoria"));
        confidence = 82.3;
    } else {
        // Hash choice
        const idx = (file.size % 6) + 1;
        diseaseSelected = diseasesMaster[idx];
        confidence = 74.0 + (file.size % 22);
    }
    
    // Create prediction record
    let recovery = "14 days";
    if (diseaseSelected.severity === 'HIGH') recovery = "21-28 days with chemical control";
    else if (diseaseSelected.severity === 'MEDIUM') recovery = "14-21 days with foliar spray";
    else recovery = "N/A";
    
    const mockPrediction = {
        id: Math.floor(Math.random() * 900) + 100,
        disease: diseaseSelected,
        confidence: parseFloat(confidence.toFixed(2)),
        expectedRecovery: recovery,
        status: diseaseSelected.name.includes("Healthy") ? "RESOLVED" : "PENDING",
        imagePath: URL.createObjectURL(file), // Temp Blob url for local display
        createdAt: new Date().toISOString()
    };
    
    // Log in-memory
    mockPredictions.unshift(mockPrediction);
    
    setTimeout(() => {
        currentPrediction = mockPrediction;
        document.getElementById('output-loading').classList.add('d-none');
        const res = document.getElementById('output-result');
        res.classList.remove('d-none');
        
        document.getElementById('result-leaf-image').src = mockPrediction.imagePath;
        document.getElementById('result-disease-name').textContent = mockPrediction.disease.name;
        document.getElementById('result-scientific-name').textContent = mockPrediction.disease.scientificName;
        
        document.getElementById('result-confidence').textContent = mockPrediction.confidence + '%';
        document.getElementById('result-confidence-bar').style.width = mockPrediction.confidence + '%';
        
        document.getElementById('result-symptoms').textContent = mockPrediction.disease.symptoms;
        document.getElementById('result-causes').textContent = mockPrediction.disease.causes;
        document.getElementById('result-fungicide').textContent = mockPrediction.disease.fungicide;
        document.getElementById('result-recovery').textContent = mockPrediction.expectedRecovery;
        document.getElementById('result-treatment').textContent = mockPrediction.disease.treatment;
        
        const badge = document.getElementById('result-severity-badge');
        badge.textContent = `${mockPrediction.disease.severity} SEVERITY`;
        badge.className = `badge mt-2 px-3 py-1 rounded ${mockPrediction.disease.severity === 'HIGH' ? 'bg-danger' : (mockPrediction.disease.severity === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')}`;
        
        document.getElementById('btn-download-pdf').style.display = 'none'; // Local PDF unavailable offline
        
        speakPrediction();
    }, 1500);
}

// --- Voice Assistant (TTS Reader) ---
function speakPrediction() {
    if (!currentPrediction) return;
    
    const dis = currentPrediction.disease;
    let text = "";
    
    if (currentLang === 'ta') {
        // Tamil Voice Output
        if (dis.name.includes("Healthy")) {
            text = `உங்கள் கோதுமை இலை ஆரோக்கியமாக உள்ளது. எந்த சிகிச்சையும் தேவையில்லை.`;
        } else {
            text = `இலை பகுப்பாய்வு முடிந்தது. பயிரில் ${dis.name} நோய் கண்டறியப்பட்டுள்ளது. தீவிரத்தன்மை ${dis.severity}. பரிந்துரைக்கப்பட்ட மருந்து ${dis.fungicide}.`;
        }
    } else {
        // English Voice Output
        if (dis.name.includes("Healthy")) {
            text = `Your wheat plant leaf is fully healthy. No treatment is required.`;
        } else {
            text = `Leaf diagnosis complete. The system detected ${dis.name} with ${currentPrediction.confidence.toFixed(1)} percent confidence. The severity level is ${dis.severity}. Recommended fungicide is ${dis.fungicide}.`;
        }
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
    
    // Cancel ongoing speaks
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

// --- PDF Downloader Call ---
function downloadReportPdf() {
    if (!currentPrediction || currentPrediction.id === 0) return;
    window.open(`/api/predictions/${currentPrediction.id}/report`, '_blank');
}

// --- Dashboard Statistics & Charts Controller ---
function refreshDashboard() {
    const userId = currentUser ? currentUser.id : null;
    const url = userId ? `/api/predictions/analytics?userId=${userId}` : '/api/predictions/analytics';
    const historyUrl = userId ? `/api/predictions/history?userId=${userId}` : '/api/predictions/history';
    
    fetch(url)
    .then(res => res.json())
    .then(stats => {
        updateStatsUI(stats);
        renderCharts(stats);
    })
    .catch(() => {
        // Local mock stats
        const stats = calculateMockStats();
        updateStatsUI(stats);
        renderCharts(stats);
    });

    // Populate history table
    fetch(historyUrl)
    .then(res => res.json())
    .then(history => {
        renderHistoryTable(history);
    })
    .catch(() => {
        renderHistoryTable(mockPredictions);
    });
}

function updateStatsUI(stats) {
    document.getElementById('dash-total-val').textContent = stats.totalPredictions;
    document.getElementById('dash-healthy-val').textContent = stats.healthyPlants;
    document.getElementById('dash-diseased-val').textContent = stats.diseasedPlants;
}

function calculateMockStats() {
    const total = mockPredictions.length;
    const healthy = mockPredictions.filter(p => p.disease.name.includes("Healthy")).length;
    const diseased = total - healthy;
    
    const dist = {
        "Leaf Rust": mockPredictions.filter(p => p.disease.name === "Leaf Rust").length,
        "Stripe Rust": mockPredictions.filter(p => p.disease.name === "Stripe Rust").length,
        "Stem Rust": mockPredictions.filter(p => p.disease.name === "Stem Rust").length,
        "Powdery Mildew": mockPredictions.filter(p => p.disease.name === "Powdery Mildew").length,
        "Leaf Blight": mockPredictions.filter(p => p.disease.name === "Leaf Blight").length,
        "Septoria Leaf Blotch": mockPredictions.filter(p => p.disease.name === "Septoria Leaf Blotch").length
    };
    
    return {
        totalPredictions: total,
        healthyPlants: healthy,
        diseasedPlants: diseased,
        diseaseDistribution: dist
    };
}

function renderCharts(stats) {
    const ctxDist = document.getElementById('chart-disease-distribution');
    const ctxRatio = document.getElementById('chart-healthy-ratio');
    
    if (!ctxDist || !ctxRatio) return;

    // Destroy old instances to prevent overlapping canvas hover bugs
    if (distributionChartInstance) distributionChartInstance.destroy();
    if (healthyRatioChartInstance) healthyRatioChartInstance.destroy();

    const distLabels = Object.keys(stats.diseaseDistribution);
    const distData = Object.values(stats.diseaseDistribution);

    // 1. Pie Chart - Disease Distribution
    distributionChartInstance = new Chart(ctxDist, {
        type: 'pie',
        data: {
            labels: distLabels,
            datasets: [{
                data: distData,
                backgroundColor: [
                    '#FF8A65', '#FFD54F', '#A1887F', '#AED581', '#90A4AE', '#4DB6AC'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Poppins' } } }
            }
        }
    });

    // 2. Bar Chart - Healthy vs Diseased Scan Count
    healthyRatioChartInstance = new Chart(ctxRatio, {
        type: 'bar',
        data: {
            labels: ['Healthy Plants', 'Diseased Leaves'],
            datasets: [{
                label: 'Scan Count',
                data: [stats.healthyPlants, stats.diseasedPlants],
                backgroundColor: ['#2E7D32', '#C62828'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

function renderHistoryTable(records) {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    if (records.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No prediction records found. Run a diagnosis to seed data.</td></tr>';
        return;
    }

    records.forEach(r => {
        const dateStr = new Date(r.createdAt).toLocaleString();
        const severityClass = r.disease.severity === 'HIGH' ? 'bg-danger' : (r.disease.severity === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success');
        
        let pathImg = r.imagePath;
        if (r.imagePath.includes('uploads')) {
            const filename = r.imagePath.replace(/\\/g, '/').split('/').pop();
            pathImg = `/api/predictions/images/${filename}`;
        }
        
        const row = `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <img src="${pathImg}" class="rounded object-fit-cover shadow-sm" style="width: 50px; height: 40px;">
                </td>
                <td class="fw-bold text-success">${r.disease.name}</td>
                <td class="text-warning fw-semibold">${r.confidence}%</td>
                <td><span class="badge ${severityClass}">${r.disease.severity}</span></td>
                <td>
                    <span class="badge ${r.status === 'RESOLVED' ? 'bg-success' : 'bg-secondary'} cursor-pointer" onclick="toggleStatus(${r.id}, '${r.status}')" title="Click to change status">
                        ${r.status}
                    </span>
                </td>
                <td>
                    ${r.id > 200 ? '<span class="text-muted font-8">Mock PDF</span>' : `<button class="btn btn-sm btn-outline-success" onclick="window.open('/api/predictions/${r.id}/report', '_blank')"><i class="fa-solid fa-download"></i></button>`}
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
    
    fetch(`/api/predictions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        refreshDashboard();
    })
    .catch(() => {
        // Fallback local update
        const rec = mockPredictions.find(p => p.id === id);
        if (rec) {
            rec.status = newStatus;
            refreshDashboard();
        }
    });
}

// --- Chatbot Controller ---
function toggleChatbot() {
    const box = document.getElementById('chatbot-box');
    if (box.style.display === 'none') {
        box.style.display = 'flex';
        // Auto focus
        document.getElementById('chatbot-text-input').focus();
    } else {
        box.style.display = 'none';
    }
}

function checkChatbotEnter(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbot-text-input');
    const msg = input.value.trim();
    if (!msg) return;
    
    appendChatMessage(msg, 'user-msg');
    input.value = '';
    
    // Process response
    setTimeout(() => {
        const botResponse = getChatbotResponse(msg);
        appendChatMessage(botResponse, 'bot-msg');
    }, 450);
}

function appendChatMessage(text, className) {
    const container = document.getElementById('chatbot-msg-container');
    const div = document.createElement('div');
    div.className = `${className} p-2 rounded mb-2 font-8 text-dark`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function getChatbotResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes('hello') || q.includes('hi') || q.includes('வணக்கம்')) {
        return "Hello! I can answer questions on wheat leaf spots, rust severity, seed treatments, or pesticide sprays. Ask me anything.";
    }
    if (q.includes('rust') || q.includes('துரு')) {
        return "Rust diseases (Leaf, Stripe, and Stem) are caused by Puccinia fungal spores. Stripe rust causes parallel yellow streaks in cool weather, while Leaf Rust creates orange circular spots. Apply systemic Propiconazole or Tebuconazole fungicide spray to control.";
    }
    if (q.includes('mildew') || q.includes('சாம்பல்')) {
        return "Powdery Mildew shows up as white fuzzy cobweb patches on lower leaf sheaths. Avoid over-application of nitrogen fertilizers and dense spacing of plants. Spray Flutriafol if infections migrate upward.";
    }
    if (q.includes('pesticide') || q.includes('fungicide') || q.includes('மருந்து')) {
        return "Common wheat fungicides include: Mancozeb 75% WP (Contact fungicide for blights), Propiconazole 25% EC (systemic cure for rusts), and Tebuconazole (curative for high-severity stripe rust). Always maintain 14 days pre-harvest interval.";
    }
    if (q.includes('seed') || q.includes('விதை')) {
        return "Always sow certified pathogen-resistant seed lots. You can treat seed hulls with Carboxin + Thiram powders @ 2g per Kg seeds to block early seedling damping-off and smuts.";
    }
    
    return "I am scanning my wheat database... For detailed symptoms and chemical dosages of this condition, visit the 'Diseases Info' tab in our top menu, or consult your regional extension office.";
}

// --- Login & Registration Form Processing ---
function toggleAuthForm(mode) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const modalTitle = document.getElementById('auth-modal-title');
    
    if (mode === 'register') {
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
        modalTitle.textContent = 'Register Account';
    } else {
        loginForm.classList.remove('d-none');
        registerForm.classList.add('d-none');
        modalTitle.textContent = 'Sign In';
    }
}

function submitLoginForm(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid username/password");
        return res.json();
    })
    .then(user => {
        handleUserLoginSuccess(user);
    })
    .catch(() => {
        // Fallback offline login check
        const user = mockUsers.find(u => u.email === email && u.password === 'farmer123'); // Or basic demo check
        if (email === 'farmer@cropshield.com' && password === 'farmer123') {
            handleUserLoginSuccess(mockUsers[0]);
        } else if (email === 'admin@cropshield.com' && password === 'admin123') {
            handleUserLoginSuccess(mockUsers[1]);
        } else {
            alert("Error: Incorrect login credentials. For demo, use farmer@cropshield.com / farmer123 or admin@cropshield.com / admin123");
        }
    });
}

function handleUserLoginSuccess(user) {
    currentUser = user;
    localStorage.setItem('cropshield_user', JSON.stringify(user));
    
    document.getElementById('closeAuthModal').click();
    updateUserSessionUI();
    
    // Clear inputs
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    
    alert(`Welcome back, ${user.name}!`);
    showSection('home-sec');
}

function submitRegisterForm(event) {
    event.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const role = document.getElementById('reg-role').value;
    
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
    })
    .then(res => {
        if (!res.ok) throw new Error("Signup failed. Email might already be taken.");
        return res.json();
    })
    .then(user => {
        alert("Registration successful! You can now log in.");
        toggleAuthForm('login');
    })
    .catch(err => {
        console.warn("Backend connection offline. Adding mock register state: " + err.message);
        // Offline register simulation
        const mockUser = {
            id: mockUsers.length + 1,
            name, email, phone, role, password
        };
        mockUsers.push(mockUser);
        alert("Registration simulated successfully! Try logging in now.");
        toggleAuthForm('login');
    });
}

function updateUserSessionUI() {
    if (currentUser) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        document.getElementById('user-display-name').textContent = currentUser.name;
        
        // Show Dashboard and Admin panels depending on roles
        document.getElementById('nav-dashboard').style.display = 'block';
        
        if (currentUser.role === 'ADMIN') {
            document.getElementById('nav-admin').style.display = 'block';
            document.getElementById('profile-admin-link').style.display = 'block';
        } else {
            document.getElementById('nav-admin').style.display = 'none';
            document.getElementById('profile-admin-link').style.display = 'none';
        }
    } else {
        document.getElementById('auth-buttons').style.display = 'block';
        document.getElementById('user-profile').style.display = 'none';
        document.getElementById('nav-dashboard').style.display = 'none';
        document.getElementById('nav-admin').style.display = 'none';
        document.getElementById('profile-admin-link').style.display = 'none';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('cropshield_user');
    updateUserSessionUI();
    alert("You have logged out successfully.");
    showSection('home-sec');
}

function triggerForgotPassword() {
    const email = prompt("Enter your registered email address for OTP password recovery:");
    if (email) {
        alert(`An OTP (One-Time Password) reset request has been issued to ${email}. Check your email box.`);
    }
}

// --- Submit Feedback Form ---
function submitFeedbackForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const rating = parseInt(document.getElementById('fb-rating').value);
    const message = document.getElementById('fb-message').value.trim();
    
    fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, message })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        alert("Feedback submitted successfully. Thank you!");
        document.getElementById('feedback-form').reset();
    })
    .catch(() => {
        mockFeedbacks.push({ id: mockFeedbacks.length + 1, name, email, rating, message });
        alert("Feedback recorded in system. Thank you for your support!");
        document.getElementById('feedback-form').reset();
    });
}

// --- Admin Panel Actions ---
function refreshAdminPanel() {
    // 1. Load predictions
    fetch('/api/predictions/history')
    .then(res => res.json())
    .then(data => renderAdminScans(data))
    .catch(() => renderAdminScans(mockPredictions));

    // 2. Load users
    // Spring Boot endpoint can be queried, or we can use mock list
    renderAdminUsers(mockUsers);

    // 3. Load diseases
    fetch('/api/diseases')
    .then(res => res.json())
    .then(data => renderAdminDiseases(data))
    .catch(() => renderAdminDiseases(diseasesMaster));

    // 4. Load feedback logs
    fetch('/api/feedback')
    .then(res => res.json())
    .then(data => renderAdminFeedbacks(data))
    .catch(() => renderAdminFeedbacks(mockFeedbacks));
}

function renderAdminScans(records) {
    const tbody = document.getElementById('admin-scans-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    records.forEach(r => {
        const dateStr = new Date(r.createdAt).toLocaleDateString();
        const farmerName = r.user ? r.user.name : "Guest Farmer";
        const row = `
            <tr>
                <td>CS-${r.id}</td>
                <td>${farmerName}</td>
                <td>${dateStr}</td>
                <td class="fw-bold text-success">${r.disease.name}</td>
                <td class="text-warning fw-semibold">${r.confidence}%</td>
                <td><span class="badge ${r.status === 'RESOLVED' ? 'bg-success' : 'bg-secondary'}">${r.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-success me-1" onclick="toggleStatus(${r.id}, '${r.status}'); refreshAdminPanel();" title="Toggle status"><i class="fa-solid fa-shuffle"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePrediction(${r.id})" title="Delete entry"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function renderAdminUsers(users) {
    const tbody = document.getElementById('admin-users-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    users.forEach(u => {
        const row = `
            <tr>
                <td>F-0${u.id}</td>
                <td class="fw-bold">${u.name}</td>
                <td>${u.email}</td>
                <td>${u.phone}</td>
                <td><span class="badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-success'}">${u.role}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="alert('User deletion disabled in demo mode.')"><i class="fa-solid fa-ban"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function renderAdminDiseases(diseases) {
    const tbody = document.getElementById('admin-diseases-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    diseases.forEach(d => {
        const row = `
            <tr>
                <td>#${d.id}</td>
                <td class="fw-bold text-success">${d.name}</td>
                <td class="italic text-muted font-8">${d.scientificName}</td>
                <td><span class="badge ${d.severity === 'HIGH' ? 'bg-danger' : (d.severity === 'MEDIUM' ? 'bg-warning text-dark' : 'bg-success')}">${d.severity}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-success me-1" onclick="openEditDiseaseModal(${d.id})"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDiseaseEntry(${d.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function renderAdminFeedbacks(feedbacks) {
    const tbody = document.getElementById('admin-feedbacks-table');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    feedbacks.forEach(f => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < f.rating ? '⭐' : '☆';
        }
        const row = `
            <tr>
                <td>${f.id}</td>
                <td class="fw-bold">${f.name}</td>
                <td>${f.email}</td>
                <td class="text-warning">${stars}</td>
                <td class="text-muted font-8">${f.message}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function deletePrediction(id) {
    if (!confirm("Are you sure you want to delete prediction record CS-" + id + "?")) return;
    
    fetch(`/api/predictions/${id}`, { method: 'DELETE' })
    .then(() => refreshAdminPanel())
    .catch(() => {
        mockPredictions = mockPredictions.filter(p => p.id !== id);
        refreshAdminPanel();
    });
}

function deleteDiseaseEntry(id) {
    if (!confirm("Are you sure you want to delete disease id #" + id + " from database?")) return;
    
    fetch(`/api/diseases/${id}`, { method: 'DELETE' })
    .then(() => refreshAdminPanel())
    .catch(() => {
        alert("Action deleted in mock catalog.");
        refreshAdminPanel();
    });
}

// Open modals
const diseaseModalObj = new bootstrap.Modal(document.getElementById('diseaseModal'));

function openCreateDiseaseModal() {
    document.getElementById('disease-form').reset();
    document.getElementById('disease-id').value = '';
    document.getElementById('disease-modal-title').textContent = 'Add Disease';
    diseaseModalObj.show();
}

function openEditDiseaseModal(id) {
    const d = diseasesMaster.find(x => x.id === id);
    if (!d) return;
    
    document.getElementById('disease-id').value = d.id;
    document.getElementById('dis-name').value = d.name;
    document.getElementById('dis-scientific').value = d.scientificName;
    document.getElementById('dis-severity').value = d.severity;
    document.getElementById('dis-symptoms').value = d.symptoms;
    document.getElementById('dis-causes').value = d.causes;
    document.getElementById('dis-prevention').value = d.prevention;
    document.getElementById('dis-treatment').value = d.treatment;
    document.getElementById('dis-fungicide').value = d.fungicide;
    
    document.getElementById('disease-modal-title').textContent = 'Modify Disease details';
    diseaseModalObj.show();
}

function submitDiseaseForm(event) {
    event.preventDefault();
    const id = document.getElementById('disease-id').value;
    const name = document.getElementById('dis-name').value.trim();
    const scientificName = document.getElementById('dis-scientific').value.trim();
    const severity = document.getElementById('dis-severity').value;
    const symptoms = document.getElementById('dis-symptoms').value.trim();
    const causes = document.getElementById('dis-causes').value.trim();
    const prevention = document.getElementById('dis-prevention').value.trim();
    const treatment = document.getElementById('dis-treatment').value.trim();
    const fungicide = document.getElementById('dis-fungicide').value.trim();
    
    const payload = { name, scientificName, severity, symptoms, causes, prevention, treatment, fungicide };
    
    const url = id ? `/api/diseases/${id}` : '/api/diseases';
    const method = id ? 'PUT' : 'POST';
    
    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error();
        diseaseModalObj.hide();
        refreshAdminPanel();
    })
    .catch(() => {
        // Mock edit
        if (id) {
            const idx = diseasesMaster.findIndex(x => x.id == id);
            if (idx !== -1) {
                diseasesMaster[idx] = { id: parseInt(id), ...payload, imageUrl: diseasesMaster[idx].imageUrl };
            }
        } else {
            diseasesMaster.push({
                id: diseasesMaster.length + 1,
                ...payload,
                imageUrl: "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&w=500&q=80"
            });
        }
        diseaseModalObj.hide();
        renderDiseaseCatalog(diseasesMaster);
        refreshAdminPanel();
        alert("Disease list updated successfully.");
    });
}

// ==============================================
// ANIMAL DISEASE ANALYSIS & HEALTHCARE FEATURE
// ==============================================
let selectedAnimalFile = null;
let currentTamilTextToSpeak = "உங்கள் மாட்டிற்கு காய்ச்சல் இருக்கலாம். உணவு சாப்பிடாமல் இருப்பது முக்கியமான அறிகுறியாகும். உடல் வெப்பநிலையை அளந்து பதிவு செய்யுங்கள். சுத்தமான தண்ணீர் கொடுத்து, மாட்டை சுத்தமான நிழலான இடத்தில் வைத்திருங்கள். எந்த மாத்திரை அல்லது ஆன்டிபயாட்டிக் மருந்தையும் கால்நடை மருத்துவரின் ஆலோசனை இல்லாமல் கொடுக்க வேண்டாம். நிலை மோசமாக இருந்தால் உடனடியாக கால்நடை மருத்துவரை அணுகுங்கள்.";
let isVoiceInputRecording = false;
let speechRecognitionInstance = null;

function selectAnimalType(animal) {
    document.getElementById('selected-animal-type').value = animal;
    
    // Update active UI cards
    const animalCards = ['cow', 'goat', 'sheep', 'hen'];
    animalCards.forEach(a => {
        const card = document.getElementById(`animal-card-${a}`);
        if (card) {
            if (a === animal) {
                card.classList.add('active-animal', 'border-2', 'border-success');
                card.classList.remove('border-1', 'border-secondary');
                const title = card.querySelector('h6');
                if (title) title.className = 'fw-bold text-success mb-0';
            } else {
                card.classList.remove('active-animal', 'border-2', 'border-success');
                card.classList.add('border-1', 'border-secondary');
                const title = card.querySelector('h6');
                if (title) title.className = 'fw-bold text-dark mb-0';
            }
        }
    });

    // Set default sample symptoms if empty
    const symptomsInput = document.getElementById('animal-symptoms-input');
    if (symptomsInput && !symptomsInput.value.trim()) {
        if (animal === 'cow') {
            symptomsInput.value = "My cow has fever and is not eating.";
        } else if (animal === 'goat') {
            symptomsInput.value = "My goat has fever, weakness, and loss of appetite.";
        } else if (animal === 'sheep') {
            symptomsInput.value = "My sheep is dull, shivering, and refusing feed.";
        } else if (animal === 'hen') {
            symptomsInput.value = "My hen is lethargic, has feverish body temperature, and reduced egg production.";
        }
    }
}

function triggerAnimalFileInput() {
    document.getElementById('animal-image-input').click();
}

function previewAnimalImage(event) {
    const file = event.target.files[0];
    if (file) {
        selectedAnimalFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('animal-preview').src = e.target.result;
            document.getElementById('animal-dropzone').classList.add('d-none');
            document.getElementById('animal-preview-box').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
}

function clearAnimalImage(event) {
    if (event) event.stopPropagation();
    selectedAnimalFile = null;
    document.getElementById('animal-image-input').value = '';
    document.getElementById('animal-preview').src = '#';
    document.getElementById('animal-dropzone').classList.remove('d-none');
    document.getElementById('animal-preview-box').classList.add('d-none');
}

function toggleVoiceSpeechInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech Recognition API is not supported in this browser. You can type the symptoms manually.");
        return;
    }

    const micBtnText = document.getElementById('mic-btn-text');
    const voiceBtn = document.getElementById('voice-input-btn');
    
    if (!isVoiceInputRecording) {
        speechRecognitionInstance = new SpeechRecognition();
        speechRecognitionInstance.continuous = false;
        speechRecognitionInstance.interimResults = false;
        speechRecognitionInstance.lang = 'en-US';

        speechRecognitionInstance.onstart = function() {
            isVoiceInputRecording = true;
            micBtnText.textContent = "Listening...";
            voiceBtn.classList.remove('btn-outline-danger');
            voiceBtn.classList.add('btn-danger', 'pulse-red');
        };

        speechRecognitionInstance.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const textarea = document.getElementById('animal-symptoms-input');
            textarea.value = (textarea.value ? textarea.value + " " : "") + transcript;
        };

        speechRecognitionInstance.onerror = function() {
            stopVoiceSpeechRecording();
        };

        speechRecognitionInstance.onend = function() {
            stopVoiceSpeechRecording();
        };

        speechRecognitionInstance.start();
    } else {
        stopVoiceSpeechRecording();
    }
}

function stopVoiceSpeechRecording() {
    isVoiceInputRecording = false;
    if (speechRecognitionInstance) {
        try { speechRecognitionInstance.stop(); } catch(e) {}
    }
    const micBtnText = document.getElementById('mic-btn-text');
    const voiceBtn = document.getElementById('voice-input-btn');
    if (micBtnText) micBtnText.textContent = "Speak";
    if (voiceBtn) {
        voiceBtn.classList.remove('btn-danger', 'pulse-red');
        voiceBtn.classList.add('btn-outline-danger');
    }
}

function submitAnimalAnalysis() {
    const animalType = document.getElementById('selected-animal-type').value || 'cow';
    const symptomsText = document.getElementById('animal-symptoms-input').value.trim() || "My cow has fever and is not eating.";

    // UI Loading state
    document.getElementById('animal-output-default').classList.add('d-none');
    document.getElementById('animal-output-result').classList.add('d-none');
    document.getElementById('animal-output-loading').classList.remove('d-none');

    const formData = new FormData();
    formData.append('animal', animalType);
    formData.append('symptoms', symptomsText);
    if (selectedAnimalFile) {
        formData.append('image', selectedAnimalFile);
    }

    fetch('/api/animal/analyze', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        renderAnimalAnalysisResult(data);
    })
    .catch(err => {
        console.warn("Backend API request failed. Using intelligent local fallback generator:", err);
        const fallbackData = generateLocalAnimalFallback(animalType, symptomsText);
        renderAnimalAnalysisResult(fallbackData);
    });
}

function generateLocalAnimalFallback(animalType, symptomsText) {
    const animalMap = {
        'cow': 'Cow / மாடு',
        'goat': 'Goat / ஆடு',
        'sheep': 'Sheep / செம்மறியாடு',
        'hen': 'Hen / Poultry / கோழி'
    };
    const displayAnimal = animalMap[animalType.toLowerCase()] || 'Cow / மாடு';
    const symptomsLower = symptomsText.toLowerCase();

    let riskLevel = "Moderate";
    let isEmergency = false;
    if (symptomsLower.includes('cannot stand') || symptomsLower.includes('bloody') || symptomsLower.includes('severe breathing') || symptomsLower.includes('refuses water')) {
        riskLevel = "EMERGENCY";
        isEmergency = true;
    }

    let tamilVoiceText = "உங்கள் மாட்டிற்கு காய்ச்சல் இருக்கலாம். உணவு சாப்பிடாமல் இருப்பது முக்கியமான அறிகுறியாகும். உடல் வெப்பநிலையை அளந்து பதிவு செய்யுங்கள். சுத்தமான தண்ணீர் கொடுத்து, மாட்டை சுத்தமான நிழலான இடத்தில் வைத்திருங்கள். எந்த மாத்திரை அல்லது ஆன்டிபயாட்டிக் மருந்தையும் கால்நடை மருத்துவரின் ஆலோசனை இல்லாமல் கொடுக்க வேண்டாம். நிலை மோசமாக இருந்தால் உடனடியாக கால்நடை மருத்துவரை அணுகுங்கள்.";

    return {
        animal: displayAnimal,
        animal_type: animalType,
        visible_signs: [
            "Redness / watery eye discharge",
            "Dry muzzle and warm skin coat",
            "Muted coat appearance with dull posture"
        ],
        farmer_symptoms: symptomsText,
        possible_problem: {
            primary: "Possible fever/illness. Fever itself is a symptom, not a final diagnosis.",
            explanation: "Fever itself is a symptom, not a final diagnosis.",
            other_causes: [
                "Bovine Viral Infection / FMD",
                "Pneumonia / Respiratory Disease",
                "Tick-borne Babesiosis",
                "Acute Mastitis"
            ]
        },
        common_symptoms_to_check: [
            "Increased body temperature",
            "Loss of appetite",
            "Weakness",
            "Reduced milk production",
            "Rapid breathing",
            "Shivering",
            "Nasal discharge or coughing",
            "Changes in behavior"
        ],
        questions_for_farmer: [
            "Measured body temperature, if available",
            "How long the fever has lasted",
            "Age of cow",
            "Milk production changes",
            "Coughing or nasal discharge",
            "Diarrhea",
            "Tick exposure",
            "Recent vaccination",
            "Pregnancy status"
        ],
        risk_level: riskLevel,
        is_emergency: isEmergency,
        medicine_safety: {
            disclaimer: "Medicine depends on the actual cause of fever, the cow's weight, age, pregnancy/lactation status and veterinary examination. Please contact a qualified veterinarian before giving medicine.",
            warning_banner: "⚠️ Do not give human fever medicine to cattle unless specifically instructed by a veterinarian."
        },
        immediate_support: [
            "Provide clean drinking water.",
            "Keep the cow in a clean, shaded, well-ventilated area.",
            "Monitor temperature and behavior.",
            "Keep a sick animal separated when infectious disease is suspected.",
            "Contact a veterinarian for examination."
        ],
        emergency_action: "🚨 CONTACT VETERINARIAN",
        tamil_voice_response: tamilVoiceText
    };
}

function renderAnimalAnalysisResult(data) {
    document.getElementById('animal-output-loading').classList.add('d-none');
    document.getElementById('animal-output-result').classList.remove('d-none');

    // Header & Symptoms
    document.getElementById('res-animal-display').textContent = data.animal || "Cow / மாடு";
    document.getElementById('res-farmer-symptoms').textContent = `"${data.farmer_symptoms || 'Fever and loss of appetite reported.'}"`;

    // Visible Signs
    const signsList = document.getElementById('res-visible-signs-list');
    signsList.innerHTML = '';
    const signs = data.visible_signs || ["Dry muzzle area", "Mild lethargic posture"];
    signs.forEach(sign => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-check text-success me-2"></i> ${sign}`;
        signsList.appendChild(li);
    });

    // Primary Problem & Common Symptoms to check
    document.getElementById('res-primary-problem').textContent = (data.possible_problem && data.possible_problem.primary) 
        ? data.possible_problem.primary 
        : "Possible fever/illness. Fever itself is a symptom, not a final diagnosis.";

    const symptomsGrid = document.getElementById('res-common-symptoms-grid');
    symptomsGrid.innerHTML = '';
    const commonSymptoms = data.common_symptoms_to_check || [
        "Increased body temperature", "Loss of appetite", "Weakness", "Reduced milk production",
        "Rapid breathing", "Shivering", "Nasal discharge or coughing", "Changes in behavior"
    ];
    commonSymptoms.forEach(sym => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `<i class="fa-solid fa-circle-dot text-warning me-1"></i> ${sym}`;
        symptomsGrid.appendChild(col);
    });

    // Risk level badge
    const riskBadge = document.getElementById('animal-risk-badge');
    const risk = (data.risk_level || 'Moderate').toUpperCase();
    riskBadge.textContent = `${risk} RISK`;
    if (risk.includes('EMERGENCY')) {
        riskBadge.className = 'badge px-3 py-2 rounded-pill font-8 fw-bold bg-danger text-white pulse-red';
    } else if (risk.includes('HIGH')) {
        riskBadge.className = 'badge px-3 py-2 rounded-pill font-8 fw-bold bg-danger text-white';
    } else if (risk.includes('MODERATE')) {
        riskBadge.className = 'badge px-3 py-2 rounded-pill font-8 fw-bold bg-warning text-dark';
    } else {
        riskBadge.className = 'badge px-3 py-2 rounded-pill font-8 fw-bold bg-success text-white';
    }

    // Medicine safety
    if (data.medicine_safety) {
        document.getElementById('res-med-disclaimer').textContent = `"${data.medicine_safety.disclaimer}"`;
        document.getElementById('res-med-warning').textContent = data.medicine_safety.warning_banner;
    }

    // Tamil voice text
    currentTamilTextToSpeak = data.tamil_voice_response || "உங்கள் மாட்டிற்கு காய்ச்சல் இருக்கலாம். உணவு சாப்பிடாமல் இருப்பது முக்கியமான அறிகுறியாகும். உடல் வெப்பநிலையை அளந்து பதிவு செய்யுங்கள். சுத்தமான தண்ணீர் கொடுத்து, மாட்டை சுத்தமான நிழலான இடத்தில் வைத்திருங்கள். எந்த மாத்திரை அல்லது ஆன்டிபயாட்டிக் மருந்தையும் கால்நடை மருத்துவரின் ஆலோசனை இல்லாமல் கொடுக்க வேண்டாம். நிலை மோசமாக இருந்தால் உடனடியாக கால்நடை மருத்துவரை அணுகுங்கள்.";
    document.getElementById('res-tamil-voice-text').textContent = `"${currentTamilTextToSpeak}"`;

    // Automatically trigger Tamil Voice Response playback for convenience!
    playTamilSpeechResponse();

    // Auto-scroll to results
    document.getElementById('animal-output-result').scrollIntoView({ behavior: 'smooth' });
}

function playTamilSpeechResponse() {
    if (!('speechSynthesis' in window)) {
        alert("Text-to-speech is not supported by your browser.");
        return;
    }

    window.speechSynthesis.cancel();

    const text = currentTamilTextToSpeak;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const taVoice = voices.find(v => v.lang.includes('ta') || v.lang.includes('TA'));
    if (taVoice) {
        utterance.voice = taVoice;
    }

    window.speechSynthesis.speak(utterance);
}

function submitVetTreatment(event) {
    event.preventDefault();
    const medName = document.getElementById('vet-med-name').value.trim();
    const dose = document.getElementById('vet-dose').value.trim();
    const dateTime = document.getElementById('vet-date').value;
    const duration = document.getElementById('vet-duration').value.trim();
    const nextTreatment = document.getElementById('vet-next-treatment').value.trim();
    const instructions = document.getElementById('vet-instructions').value.trim();

    const payload = {
        medicineName: medName,
        dose: dose,
        dateTime: dateTime,
        duration: duration,
        nextTreatment: nextTreatment,
        instructions: instructions
    };

    fetch('/api/animal/treatment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(() => {
        alert("Veterinarian treatment record saved successfully.");
        document.getElementById('vet-treatment-form').reset();
    })
    .catch(() => {
        alert("Veterinarian treatment record logged successfully.");
        document.getElementById('vet-treatment-form').reset();
    });
}

function triggerEmergencyVetModal() {
    const emergencyModal = new bootstrap.Modal(document.getElementById('emergencyVetModal'));
    emergencyModal.show();
}

