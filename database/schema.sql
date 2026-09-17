-- CropShield MySQL Database Schema & Seed Data

CREATE DATABASE IF NOT EXISTS cropshield_db;
USE cropshield_db;

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'FARMER', -- 'FARMER', 'ADMIN'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table: diseases
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS diseases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(100),
    symptoms TEXT NOT NULL,
    causes TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    prevention TEXT NOT NULL,
    treatment TEXT NOT NULL,
    fungicide VARCHAR(150),
    image_url VARCHAR(255)
);

-- -----------------------------------------------------
-- Table: predictions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    disease_id INT,
    confidence DOUBLE NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    expected_recovery VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'RESOLVED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table: feedbacks
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Seed Data: default admin and farmer accounts
-- -----------------------------------------------------
-- Plain-text passwords for demo simplicity
INSERT INTO users (name, email, phone, password, role) VALUES 
('Default Farmer', 'farmer@cropshield.com', '9876543210', 'farmer123', 'FARMER'),
('CropShield Admin', 'admin@cropshield.com', '9999999999', 'admin123', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- -----------------------------------------------------
-- Seed Data: Wheat Diseases Information
-- -----------------------------------------------------
INSERT INTO diseases (name, scientific_name, symptoms, causes, severity, prevention, treatment, fungicide, image_url) VALUES 
(
  'Healthy Wheat', 
  'Triticum aestivum', 
  'Leaves are uniform bright green, turgid, and free of spots, pustules, or powdery growth. High photosynthetic activity and sturdy stems.', 
  'Optimal growth conditions with balanced nutrients, proper irrigation, and absence of pathogenic spores.', 
  'LOW', 
  'Continue Crop rotation, use certified healthy seed varieties, monitor soil health, and apply balanced N-P-K fertilizer schedules.', 
  'No treatment required. Maintain regular watering and weed control.', 
  'None', 
  '/assets/healthy_wheat.jpg'
),
(
  'Leaf Rust', 
  'Puccinia triticina', 
  'Small, round, orange-brown pustules on the upper leaf surface. Pustules rupture to release powdery orange spores. Leaves may turn yellow and wither prematurely.', 
  'Airborne spores of Puccinia triticina fungus, favored by mild temperatures (15-22°C) and moisture or dew.', 
  'MEDIUM', 
  'Sow rust-resistant varieties, destroy volunteer wheat plants, avoid excess nitrogen fertilizers.', 
  'Apply systemic fungicides at the first sign of pustules. Remove infected debris post-harvest.', 
  'Propiconazole, Tebuconazole, or Triadimefon', 
  '/assets/leaf_rust.jpg'
),
(
  'Stripe Rust', 
  'Puccinia striiformis', 
  'Yellowish-orange pustules arranged in narrow, parallel stripes along the leaf veins and leaf sheaths. Heavy infection causes leaf drying.', 
  'Fungal pathogen Puccinia striiformis, thriving in cool (2-15°C) and wet conditions, common in early spring.', 
  'HIGH', 
  'Plant resistant cultivars, adjust planting date to avoid peak spore load, practice crop rotation.', 
  'Foliar fungicide application is critical. Monitor crops from early spring.', 
  'Tebuconazole + Trifloxystrobin, or Azoxystrobin', 
  '/assets/stripe_rust.jpg'
),
(
  'Stem Rust', 
  'Puccinia graminis', 
  'Elongated, dark reddish-brown pustules on stems and leaf sheaths. Pustules breach the epidermis, exposing dust-like brown spores. Weakens stems, leading to lodging.', 
  'Fungus Puccinia graminis, favored by warm, humid conditions (20-30°C) and late-season dew.', 
  'HIGH', 
  'Eradicate barberry bushes (alternate hosts), grow early-maturing and resistant varieties.', 
  'Apply protective and curative fungicides immediately. Timely harvest prevents severe lodging losses.', 
  'Pyraclostrobin, Propiconazole, or Tebuconazole', 
  '/assets/stem_rust.jpg'
),
(
  'Powdery Mildew', 
  'Blumeria graminis', 
  'White to light gray, powdery, cobweb-like fungal patches on the upper surface of lower leaves, stems, and heads. Patches turn brown/black as they age.', 
  'Fungus Blumeria graminis f. sp. tritici, promoted by cool, humid, and shaded conditions with dense crop canopies.', 
  'MEDIUM', 
  'Avoid dense sowing, maintain proper ventilation, use balanced nitrogen, select resistant varieties.', 
  'Apply systemic fungicides if the infection moves to the upper two leaves before head emergence.', 
  'Triadimenol, Flutriafol, or Propiconazole', 
  '/assets/powdery_mildew.jpg'
),
(
  'Leaf Blight', 
  'Alternaria triticina / Bipolaris sorokiniana', 
  'Oval, dark-brown spots on leaves which enlarge to form irregular, light-brown necrotic blotches with dark margins. Leaf tips dry out and become brittle.', 
  'Seed-borne or crop residue-borne fungal pathogens, favored by warm, humid weather (25-30°C) with frequent rains.', 
  'MEDIUM', 
  'Use clean certified seeds, treat seeds before sowing, practice deep plowing, rotate with non-cereal crops.', 
  'Apply foliar spray of fungicides at early stages of symptom development.', 
  'Mancozeb, Zineb, or Propiconazole', 
  '/assets/leaf_blight.jpg'
),
(
  'Septoria Leaf Blotch', 
  'Septoria tritici', 
  'Speckled, lens-shaped, gray-brown spots (lesions) on leaves. Lesions contain tiny black dots (pycnidia) which are the fruiting bodies of the fungus.', 
  'Fungus Septoria tritici (Mycosphaerella graminicola), spread by splashing rain and high relative humidity.', 
  'HIGH', 
  'Incorporate stubble by deep plowing, rotate crops, space rows to improve aeration, choose resistant varieties.', 
  'Spray protective or systemic fungicides at first node appearance or flag leaf emergence.', 
  'Azoxystrobin + Propiconazole, or Chlorothalonil', 
  '/assets/septoria_blotch.jpg'
)
ON DUPLICATE KEY UPDATE name=name;
