# 🩸 LifeConnect: Hemodynamic Logistics & Routing Grid

![React](https://img.shields.io/badge/Frontend-React_18_%7C_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/Database-MySQL_8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Security](https://img.shields.io/badge/Security-AES--256_%7C_JWT-critical?style=for-the-badge&logo=spring-security&logoColor=white)

> A decentralized, real-time medical logistics platform engineered to route blood, plasma, and organs to critical patients using geospatial algorithms and military-grade encryption.

## 🚀 Overview
LifeConnect is an enterprise-grade, full-stack application built to solve the critical "last-mile" problem in medical emergency logistics. By replacing static databases with a **real-time geospatial routing engine**, LifeConnect connects hospitals and patients to the nearest available, verified donors within milliseconds.

The system features live cold-ischemia tracking for organ transport, automated WebSocket dispatch triggers, and a Zero-Trust identity verification system.

## ✨ Enterprise Architecture & Core Features

### 🗺️ Geospatial Routing Engine (Haversine Implementation)
Utilizes the Haversine formula directly at the SQL query layer to calculate spherical distances between geographic coordinates. This allows the system to instantly establish a 10km Geo-Fence and filter thousands of nodes in real-time.

### 🛡️ Military-Grade Security & Zero-Trust
- **AES-256 Encryption:** Patient and donor Personally Identifiable Information (PII), such as phone numbers, are physically scrambled in the MySQL database using custom JPA Attribute Converters.
- **OTP Verification:** Multi-step cryptographic OTP verification ensures high data integrity and eliminates fake emergency requests.
- **Rate Limiting:** IP-based cooldown shields prevent API abuse and SMTP spamming during Emergency SOS Overdrives.

### ⚡ Event-Driven Telemetry (WebSockets)
Bypasses traditional HTTP polling by maintaining a persistent `StompJS/SockJS` WebSocket tunnel. When a critical shortage or SOS is triggered, the Java Spring Boot backend broadcasts a payload that instantly triggers push notifications on all connected frontend clients.

### 🫀 Organ & Plasma Node (Temporal Logistics)
A dedicated micro-system for tracking highly sensitive organ transports. The React frontend utilizes an independent Javascript temporal engine to parse ISO-8601 timestamps from the backend, rendering mathematically accurate, real-time countdowns for Cold Ischemia viability windows.

## 💻 Tech Stack

**Frontend Framework:**
- React (Vite)
- Tailwind CSS v4 (Glassmorphism & Responsive Grids)
- Framer Motion (High-fidelity physics-based animations)
- Zustand (Global State Management)
- Recharts (Dynamic data visualization & ECG monitors)

**Backend Infrastructure:**
- Java 21 / Spring Boot 3
- Spring Data JPA & Hibernate
- WebSockets (Spring Messaging)
- JavaMailSender (Automated SMTP Triggers)
- Swagger / OpenAPI 3.0 (Auto-generated documentation)

**Database:**
- MySQL 8.0 (Relational Data & Geospatial Queries)

---

## 📸 System Modules

### 1. Global Telemetry Command Center
An analytical dashboard for hospital administrators. Features a live Recharts ECG monitor fed by simulated ping latency, and real-time donut charts aggregating global blood capacity directly from live SQL counts.

### 2. Donor Hub & Journey Tracker
A gamified dashboard for verified nodes (donors). Features a "Pizza Tracker" style horizontal stepper for blood transit status, dynamically calculated eligibility countdowns, and animated milestone badges.

### 3. SOS Overdrive
A rate-limited, high-priority emergency endpoint. Bypasses the standard 10km routing constraint to blast emails and WebSocket alerts to every registered node within a 100km radius during critical mass-casualty events.

---

## 🛠️ Installation & Local Development

### Prerequisites
- Java JDK 21+
- Node.js 20+
- MySQL Server 8.0+
- Maven

### 1. Database Setup
Create a new MySQL database:
```sql
CREATE DATABASE lifeconnect_db;
```

### 2. Backend Setup
```bash
# Navigate to the root directory
cd LifeConnect

# The application.properties relies on Environment Variables. 
# For local dev, you can set these in your IDE or terminal:
export DB_URL=jdbc:mysql://localhost:3306/lifeconnect_db
export DB_USER=root
export DB_PASSWORD=your_mysql_password
export MAIL_PASSWORD=your_google_app_password
export FRONTEND_URL=http://localhost:5173

# Run the Spring Boot server
mvn spring-boot:run
```
*(Note: `Hibernate ddl-auto=update` will automatically build your tables upon startup. The `DataSeeder.java` class will populate dummy organs and donors for testing).*

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:8080" > .env
echo "VITE_WS_BASE_URL=ws://localhost:8080" >> .env

# Start the Vite development server
npm run dev
```

## 📖 API Documentation
This project utilizes Springdoc OpenAPI. Once the backend server is running, you can explore the fully interactive API documentation and test endpoints without a frontend client.

Access the Swagger UI here: 👉 `http://localhost:8080/swagger-ui/index.html`

---

## 👨‍💻 Author
**Vaishnav Shah**  
*B.Tech Computer Science Engineering | Microsoft Industry Embedded Program*  

[LinkedIn](https://linkedin.com/in/vaishnav-shah005) | [GitHub](https://github.com/Vaishnav00521)
<br/>
*Built with ❤️ to save lives.*
