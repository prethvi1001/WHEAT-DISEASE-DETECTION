# CropShield User Manual

This manual explains how to interact with the **CropShield** system as a Farmer or an Administrator.

---

## 1. Farmer Role Guide

### 1.1 Creating an Account & Login
1. Click **Login** on the top right.
2. If you don't have an account, click **Register here**, fill in your details (Name, Email, Phone, Password), choose the **Farmer** role, and submit.
3. Log in with your email and password (or use the default credentials: `farmer@cropshield.com` / `farmer123`).
4. Once authenticated, your name will appear in the top-right button, and your **My Health Desk (Dashboard)** link will become visible.

### 1.2 Running an AI Crop Diagnosis
1. Click **AI Detection** on the navigation bar.
2. Drag and drop your wheat leaf photo onto the green dashed dropzone, or click inside the zone to browse and select a file.
3. Once the leaf preview appears, click **Run AI Diagnosis**.
4. The system will animate the pipeline phases (Uploading, Preprocessing, CNN Feature extraction, Softmax classification).
5. Review the resulting diagnosis:
   - **Disease Name and Scientific classification**
   - **Confidence Score (%)**
   - **Severity Index (LOW, MEDIUM, HIGH)**
   - **Detailed Symptoms, Causes, and Recovery time**
   - **Recommended Fungicide dosage**
6. Click the **Speech Button** (speaker icon) to have the AI read the findings aloud.
7. Click the **PDF Button** to download a print-ready crop certificate.

### 1.3 Using the Farmer Dashboard
1. Click the **Dashboard** link on the navigation menu.
2. View analytics widgets (Total scans, healthy vs diseased ratios).
3. Interact with dynamic pie charts showing crop health trends.
4. Scroll to **My Diagnostic History** to view past reports. Click on the status badge (e.g. `PENDING`) to change it to `RESOLVED` once you spray the recommended fungicide.

### 1.4 Smart Chatbot Helper
1. Click the floating chat bubble on the bottom right.
2. Type queries regarding your crop symptoms (e.g., "tell me about yellow rust" or "seed treatment fungicide") to chat with the smart agronomy assistant.

---

## 2. Administrator Role Guide

### 2.1 Sign In as Admin
1. Log in using Admin credentials (default: `admin@cropshield.com` / `admin123`).
2. An **Admin Panel** link will appear in the navbar.

### 2.2 Scan Stream Auditing
1. Navigate to **Admin Panel** -> **Scan Monitoring**.
2. View all diagnostics performed by local farmers.
3. Change prediction status (e.g. toggle resolved/pending) or delete faulty entries.

### 2.3 Managing the Disease Database
1. Go to **Manage Catalog**.
2. To edit existing entries, click the green edit pencil icon.
3. To add a new wheat condition, click **Add Disease**, fill in the symptoms, severity classification, and chemical recommendations, and save.

### 2.4 Feedbacks and System Ratings
1. Go to the **User Feedbacks** tab.
2. Read system reviews, suggestions, and star ratings submitted by farmers via the contact form.
