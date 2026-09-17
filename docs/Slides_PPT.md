# Presentation Slide Deck: CropShield

AI-Powered Wheat Disease Detection & Smart Crop Health Management System

---

## Slide 1: Title
**CropShield**
*AI-Powered Wheat Disease Detection & Smart Crop Health Management*
- **Presented for:** Final Year Engineering Project / Smart India Hackathon (SIH)
- **Tagline:** "Protecting Every Wheat Crop with Artificial Intelligence"
- **Focus:** Deep Learning and Computer Vision for Wheat Pathogen Classification.

---

## Slide 2: Problem Statement
- **Food Security Threat:** Wheat represents 20% of global caloric intake, yet up to 21% of crop yield is lost annually to leaf rusts and mildew pathogens.
- **Delayed Diagnoses:** Traditional lab assays require days, while manual inspections by agronomists are subjective and scarce in remote villages.
- **Inadequate Treatments:** Farmers struggle to differentiate between Stripe, Leaf, and Stem rust, leading to incorrect pesticide dosages and soil degradation.

---

## Slide 3: Solution - The CropShield Ecosystem
- **Instant AI Diagnostics:** Web-based portal enabling farmers to drag and drop leaf images for instant results.
- **Heuristic Image Preprocessing:** Integrates OpenCV to resize, remove camera noise using Gaussian filters, and normalize lighting.
- **Dual Language & Voice Assistance:** Includes full Tamil translation and text-to-speech feedback for accessibility.
- **Actionable Advice:** Returns scientific names, severity indexes, expected recovery timelines, and specific fungicide quantities.

---

## Slide 4: System Architecture
```text
  [ Farmer Browser ] <--- REST/JSON ---> [ Spring Boot Backend ]
                                                 |
                                         REST    |    JPA/JDBC
                                         Port    v       v
                                     [ Flask AI ]   [ MySQL DB ]
                                     (TensorFlow)  (predictions, users)
```
- **Microservices Model:** Keeps the AI model inference pipeline separate from business database operations.
- **Single JAR Deployment:** Frontend is embedded in Spring Boot static resources for ease of deployment.

---

## Slide 5: Deep Learning CNN Pipeline
- **Image Preprocessing:**
  1. **Resize:** Standardized to $224 \times 224$ pixels.
  2. **Denoise:** $5 \times 5$ Gaussian kernel filter.
  3. **Normalize:** RGB channels normalized to range $[0.0, 1.0]$.
- **CNN Layers Configuration:**
  - **Input Layer:** $224 \times 224 \times 3$ matrix.
  - **Conv2D + ReLU:** 32 filters, extract structural leaf boundaries.
  - **MaxPooling:** $2 \times 2$ stride, pool parameters.
  - **Conv2D + ReLU:** 64 filters, extract rust pustule textures.
  - **MaxPooling:** $2 \times 2$ stride.
  - **Conv2D + ReLU:** 128 filters, classify complex mildew spore shapes.
  - **Flatten:** Convert 2D feature map to 1D vector.
  - **Dense Layer:** 128 hidden neurons.
  - **Dropout:** 0.5 rate (prevents model overfitting).
  - **Softmax Output:** Probability distribution over 7 classes.

---

## Slide 6: Target Wheat Conditions
1. **Healthy Wheat:** Smooth green surfaces, optimal chlorophyll activity.
2. **Leaf Rust:** Small round orange-brown pustules (*Puccinia triticina*).
3. **Stripe Rust:** Yellowish-orange narrow parallel pustule lines (*Puccinia striiformis*).
4. **Stem Rust:** Elongated dark-brown tears on stems and sheaths (*Puccinia graminis*).
5. **Powdery Mildew:** White-gray fuzzy cobweb coatings (*Blumeria graminis*).
6. **Leaf Blight:** Oval dark-brown lesions with necrotic margins (*Alternaria triticina*).
7. **Septoria Leaf Blotch:** Speckled gray-brown blotches with tiny black pycnidia points.

---

## Slide 7: Database Architecture
- **Users:** Credentials, phone details, and roles (Farmer, Admin).
- **Diseases:** Catalog definitions, prevention measures, and chemical controls.
- **Predictions:** Inference history logs, confidence metrics, and recovery dates.
- **Feedbacks:** Farmers rating records.
- **Technologies:** MySQL 8.x schema with automatic JPA DDL updates.

---

## Slide 8: Technical Stack
- **Frontend:** HTML5, CSS3 (Glassmorphism & Theme variables), JS, Bootstrap 5, Chart.js.
- **Backend:** Java Spring Boot, Hibernate ORM, Spring Data JPA, Apache PDFBox.
- **AI Core:** Python 3, Flask, TensorFlow, Keras, OpenCV-Python, NumPy.
- **Database:** MySQL.

---

## Slide 9: Project Innovation & Highlights
- **Accessibility:** Instant translation to Tamil.
- **Voice synthesis:** Readouts remove literacy barriers.
- **Dynamic Diagnostics Reports:** One-click PDF certification containing chemical dosages.
- **AI Chatbot Agent:** Floating crop assistant for smart agricultural queries.
- **Offline Fallback:** Client-side heuristics guarantee live evaluation without server configuration.

---

## Slide 10: Conclusion & Future Scope
- **Conclusion:** CropShield delivers a reliable, production-ready AI solution that connects deep learning models to local farms, reducing diagnostic lag from days to seconds.
- **Future Scope:**
  1. Integrate drone-based multi-spectral aerial field mapping.
  2. Implement WhatsApp/SMS push notifications.
  3. Deploy Edge-AI on mobile apps for offline GPU prediction.
