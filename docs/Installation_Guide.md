# Installation and Developer Setup Guide - CropShield

This document guides you through setting up and running the **CropShield** Wheat Disease Detection and Smart Crop Health Management System locally.

---

## Prerequisites

Before starting, ensure your system has:
1. **Java Development Kit (JDK) 17** or higher.
2. **Apache Maven 3.8+** (for dependency resolution and building the backend).
3. **Python 3.8 - 3.11** (recommended for running TensorFlow/OpenCV).
4. **MySQL Database Server 8.0+**.
5. Modern Web Browser (Chrome, Edge, or Firefox).

---

## 1. Database Setup (MySQL)

1. Open your MySQL client (CLI, Workbench, or phpMyAdmin).
2. Log in as an administrator (default username `root`, password `root` or your password).
3. Execute the schema script:
   ```sql
   SOURCE database/schema.sql;
   ```
   *Note: If your local MySQL root password differs, update the connection parameters in `cropshield-backend/src/main/resources/application.properties` (lines `spring.datasource.username` and `spring.datasource.password`).*

---

## 2. Setting Up Python AI Microservice (`cropshield-ai`)

1. Open your terminal/command prompt and navigate to the AI service folder:
   ```powershell
   cd cropshield-ai
   ```
2. Create a virtual environment (optional but recommended):
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install the required libraries:
   ```powershell
   pip install -r requirements.txt
   ```
4. Install TensorFlow if you wish to run the real training script (otherwise, the system automatically uses OpenCV histogram fallbacks):
   ```powershell
   pip install tensorflow
   ```
5. Run the model training script to generate the trained network file (`model/wheat_disease_model.h5`):
   ```powershell
   python train.py
   ```
6. Start the Flask prediction server:
   ```powershell
   python app.py
   ```
   *The Flask service runs on `http://localhost:5000`.*

---

## 3. Setting Up Spring Boot Backend & Frontend (`cropshield-backend`)

1. Open a new terminal and navigate to the backend directory:
   ```powershell
   cd cropshield-backend
   ```
2. Build the project using Maven to download all dependencies (Spring Boot starter web, JPA, PDFBox, Lombok, etc.) and package the application:
   ```powershell
   mvn clean package
   ```
3. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   *The Spring Boot Tomcat web container boots up on `http://localhost:8080`.*

---

## 4. Verification & Testing

1. Open your web browser and navigate to:
   ```text
   http://localhost:8080
   ```
2. You will be greeted by the **CropShield Portal** landing page.
3. **Demo Accounts to Test:**
   - **Farmer Account:**
     - Email: `farmer@cropshield.com`
     - Password: `farmer123`
   - **Admin Account:**
     - Email: `admin@cropshield.com`
     - Password: `admin123`
4. Upload any image of a leaf:
   - To test specific diseases during offline simulation (without Flask active), save your files named with keywords such as `"stripe_rust.jpg"`, `"powdery_mildew.jpg"`, or `"leaf_blight.jpg"`. The visual preprocessor will read these and return correct matching predictions.
5. In the Admin Panel, you can add new diseases, delete old predictions, or inspect ratings.
