# 🌾 CropShield — Wheat Disease Detection & Smart Crop Health Management System

[![Java](https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.2-black?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.9-red?logo=opencv&logoColor=white)](https://opencv.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-informational?logo=mysql&logoColor=white)](https://www.mysql.com/)

CropShield is a full-stack, AI-powered agricultural diagnostic and crop health management platform designed for wheat farmers and agricultural administrators. It allows instant detection of wheat leaf diseases through image analysis, provides tailored fungicide treatments, generates printable diagnostic reports, and offers continuous health tracking.

---

## 🌟 Key Features

- **🔬 AI Leaf Disease Detection**:
  - Image preprocessing: Gaussian blur noise removal, 224x224 resizing, pixel normalization.
  - Multi-class classification: Supports **Healthy Wheat**, **Leaf Rust**, **Stripe Rust**, **Stem Rust**, **Powdery Mildew**, **Leaf Blight**, and **Septoria Leaf Blotch**.
  - Intelligent fallback mechanism using OpenCV HSV color analysis when running in lightweight environments.
- **👨‍🌾 Farmer Portal & Dashboard**:
  - Role-based authentication (Farmer and Admin).
  - Drag-and-drop leaf upload with real-time pipeline status animation.
  - Disease report card with severity index, causes, prevention, and fungicide prescriptions.
  - Interactive diagnosis history with status tracking (`PENDING` / `RESOLVED`).
  - Health trend visualization charts.
- **🔊 Accessibility & Reporting**:
  - **Text-to-Speech (TTS)**: Reads diagnosis and treatment steps aloud.
  - **PDF Export**: Instant download of printable diagnostic certificates via Apache PDFBox.
- **💬 Smart Agronomy Chatbot**:
  - Integrated floating conversational assistant for farmer inquiries on wheat pathology and chemical dosages.
- **🛡️ Administrative Management**:
  - Global scan stream monitoring and auditing.
  - Complete disease catalog CRUD management.
  - Farmer feedback and rating inspection.

---

## 🗂️ Project Structure

```text
wheat detection/
├── cropshield-ai/              # Python AI Microservice (Flask, OpenCV, TensorFlow)
│   ├── app.py                  # Prediction API endpoint & HSV fallback logic
│   ├── train.py                # CNN model architecture & training script
│   ├── requirements.txt        # Python dependencies
│   └── model/                  # Model weights destination
│
├── cropshield-backend/         # Spring Boot Enterprise Application
│   ├── pom.xml                 # Maven dependencies (Web, JPA, PDFBox, Lombok)
│   └── src/main/
│       ├── java/com/cropshield/
│       │   ├── controller/     # REST Controllers (Auth, Disease, Prediction, PDF)
│       │   ├── model/          # JPA Entities (User, Disease, Prediction, Feedback)
│       │   ├── repository/     # Spring Data Repositories
│       │   └── service/        # Business Logic & PDF Generation
│       └── resources/
│           ├── application.properties  # Database & server configurations
│           └── static/         # Frontend Web Application
│               ├── index.html  # Responsive single-page interface
│               ├── styles.css  # Modern UI theme, glassmorphism & cards
│               └── app.js      # Client-side state, API integration & charts
│
├── database/
│   └── schema.sql              # MySQL DDL schema and initial seed data
│
├── docs/                       # Project documentation
│   ├── Installation_Guide.md   # Detailed step-by-step setup guide
│   ├── Project_Report.md       # Comprehensive academic project report
│   ├── Slides_PPT.md           # Presentation slides outline
│   └── User_Manual.md          # User & Administrator manual
│
├── .gitattributes              # Git line endings & binary configuration
├── .gitignore                  # Repository file exclusion rules
├── server.ps1                  # Standalone local HTTP server for quick frontend preview
└── README.md                   # Repository overview and setup guide
```

---

## 🦠 Supported Wheat Conditions

| Disease Name | Scientific Classification | Severity | Primary Symptoms |
| :--- | :--- | :--- | :--- |
| **Healthy Wheat** | *Triticum aestivum* | None | Vibrant green leaf, uniform texture, no blemishes |
| **Leaf Rust** | *Puccinia triticina* | Medium | Small, scattered reddish-orange pustules on leaf surface |
| **Stripe (Yellow) Rust** | *Puccinia striiformis* | High | Narrow yellow-orange pustules arranged in linear stripes |
| **Stem (Black) Rust** | *Puccinia graminis* | High | Dark reddish-brown elongated pustules on stems and sheaths |
| **Powdery Mildew** | *Blumeria graminis* | Medium | Fluffy white-to-gray powdery patches on leaves and stems |
| **Leaf Blight** | *Bipolaris sorokiniana* | Medium | Dark brown elongated spots with chlorotic yellow halos |
| **Septoria Leaf Blotch**| *Zymoseptoria tritici* | High | Irregular necrotic brown lesions studded with black specks |

---

## 🚀 Getting Started

### Prerequisites
- **JDK 17+** & **Apache Maven 3.8+**
- **Python 3.8+** & `pip`
- **MySQL Server 8.0+**
- Modern Web Browser (Chrome, Edge, Firefox)

---

### 1. Database Setup
1. Launch MySQL CLI or Workbench and run the database script:
   ```sql
   SOURCE database/schema.sql;
   ```
2. Verify database credentials in `cropshield-backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cropshield_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```

---

### 2. Python AI Service Setup (`cropshield-ai`)
1. Navigate to the AI directory:
   ```bash
   cd cropshield-ai
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask prediction service:
   ```bash
   python app.py
   ```
   *The AI microservice will run on `http://localhost:5000`.*

---

### 3. Spring Boot Backend & Web Portal (`cropshield-backend`)
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd cropshield-backend
   ```
2. Build and run the application with Maven:
   ```bash
   mvn clean spring-boot:run
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:8080
   ```

---

### ⚡ Quick Standalone Frontend Preview (Optional)
To quickly preview the web interface without spinning up Maven or MySQL:
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then visit `http://localhost:8080` in your browser.

---

## 🔑 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Farmer** | `farmer@cropshield.com` | `farmer123` |
| **Administrator** | `admin@cropshield.com` | `admin123` |

---

## 📡 REST API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new farmer or admin |
| `POST` | `/api/auth/login` | Authenticate user credentials |
| `GET` | `/api/diseases` | Retrieve catalog of all diseases |
| `POST` | `/api/diseases` | Add new disease profile (Admin) |
| `POST` | `/api/predict` | Upload leaf image and run AI diagnosis |
| `GET` | `/api/predictions/user/{id}` | Get diagnostic history for farmer |
| `GET` | `/api/predictions/{id}/pdf` | Generate and download PDF health report |
| `POST` | `/api/feedback` | Submit farmer feedback and rating |

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
