# 📱 Coop 365 — Resident Mobile App (Flutter API Reference & Integration Guide)

> **Document Purpose:** Complete technical specification for the Flutter mobile application developer to integrate user-side APIs for Coop 365 Resident App.

---

## 🌐 Server Environment & Base Configuration

- **Base URL:** `https://api.coop365.shop/api/v1`
- **Default Headers:**
  ```http
  Content-Type: application/json
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## 📋 Quick API Summary Table

| # | Single-Line API Description | Method | Endpoint | Auth Required |
|---|-----------------------------|--------|----------|---------------|
| 1 | **Get Active Housing Societies** | `GET` | `/auth/public-vendors` | ❌ No |
| 2 | **Firebase Phone OTP Login & Member Verification** | `POST` | `/auth/firebase-login` | ❌ No |
| 3 | **Get Next Available Receipt & Book Number** | `GET` | `/receipts/next-number` | 🔒 Yes (`Bearer`) |
| 4 | **Create & Submit Receipt Voucher** | `POST` | `/receipts` | 🔒 Yes (`Bearer`) |
| 5 | **Fetch Resident Saved History (Receipts List)** | `GET` | `/receipts` | 🔒 Yes (`Bearer`) |
| 6 | **Get Single Receipt Voucher Details** | `GET` | `/receipts/:id` | 🔒 Yes (`Bearer`) |
| 7 | **Stream / Download PDF Receipt Voucher** | `GET` | `/receipts/:id/pdf` | 🔒 Yes (`Bearer` or `?token=`) |
| 8 | **Get Resident Profile & Housing Society Details** | `GET` | `/auth/me` | 🔒 Yes (`Bearer`) |
| 9 | **Update Resident Profile & PAN Attachment** | `PUT` | `/auth/me` | 🔒 Yes (`Bearer`) |

---

## 🚀 Detailed API Specifications

### 1. Get List of Active Housing Societies (Public)
* **Single-line Summary:** `GET /auth/public-vendors` — Retrieves active housing societies for the selection dropdown on the resident login screen.
* **HTTP Method:** `GET`
* **Endpoint:** `/auth/public-vendors`
* **Headers:** `Content-Type: application/json`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Active housing societies fetched from database",
  "data": {
    "vendors": [
      {
        "_id": "66bc901a1b2c3d4e5f6a7b8c",
        "name": "Mandovi Nagar Co-Op. Housing Society Ltd.,",
        "address": "Porvorim, Alto Porvorim, Goa 403521",
        "regNo": "HSG-(a)-70/GOA",
        "status": "ACTIVE"
      }
    ]
  }
}
```

---

### 2. Firebase Phone SMS OTP Login & Member Verification
* **Single-line Summary:** `POST /auth/firebase-login` — Verifies Firebase Phone ID token, auto-creates/maps resident in MongoDB, and returns JWT session token.
* **HTTP Method:** `POST`
* **Endpoint:** `/auth/firebase-login`

#### Request Body
```json
{
  "idToken": "<FIREBASE_SMS_ID_TOKEN>",
  "vendorId": "66bc901a1b2c3d4e5f6a7b8c",
  "phoneNumber": "+918280057771"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Firebase Phone Auth Verified.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66bc902b1b2c3d4e5f6a7b8d",
      "name": "Gyana Singh",
      "email": "8280057771@mandovinagar.org",
      "phone": "+918280057771",
      "role": "MEMBER",
      "flatNo": "Flat A-101",
      "panNo": "AAAAA0000A",
      "panDocUrl": "",
      "vendorId": "66bc901a1b2c3d4e5f6a7b8c",
      "vendorName": "Mandovi Nagar Co-Op. Housing Society Ltd.,",
      "vendorRegNo": "HSG-(a)-70/GOA"
    }
  }
}
```

---

### 3. Get Next Available Receipt & Book Number
* **Single-line Summary:** `GET /receipts/next-number` — Fetches sequential book and receipt voucher numbers for the user's society.
* **HTTP Method:** `GET`
* **Endpoint:** `/receipts/next-number`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Next receipt number retrieved",
  "data": {
    "bookNo": "1",
    "nextReceiptNo": "728"
  }
}
```

---

### 4. Create & Submit Receipt Voucher (Form Fill Up)
* **Single-line Summary:** `POST /receipts` — Submits a new collection receipt entry to backend MongoDB.
* **HTTP Method:** `POST`
* **Endpoint:** `/receipts`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Request Body
```json
{
  "bookNo": "1",
  "receiptNo": "728",
  "date": "2026-08-15",
  "receivedFrom": "Gyana Singh",
  "flatShopNo": "Flat A-101",
  "paymentMode": "Cash",
  "cashChequeNo": "CHK-492018",
  "paymentDate": "2026-08-15",
  "drawnOn": "State Bank of India",
  "sumInWords": "Four Thousand Eight Hundred Fifty Rupees Only",
  "totalAmount": 4850,
  "items": [
    {
      "title": "Maintenance Charges",
      "fromPeriod": "Apr 2026",
      "toPeriod": "Jun 2026",
      "amount": 3500
    },
    {
      "title": "Sinking Fund",
      "fromPeriod": "Apr 2026",
      "toPeriod": "Jun 2026",
      "amount": 1200
    },
    {
      "title": "Interest",
      "fromPeriod": "",
      "toPeriod": "",
      "amount": 150
    }
  ]
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Receipt created successfully",
  "data": {
    "receipt": {
      "_id": "66bc91231b2c3d4e5f6a7b9e",
      "receiptNo": "728",
      "bookNo": "1",
      "totalAmount": 4850,
      "createdAt": "2026-08-15T13:00:00.000Z"
    }
  }
}
```

---

### 5. Fetch Resident Receipt History (Saved History)
* **Single-line Summary:** `GET /receipts` — Queries past receipts belonging to the resident/society with filtering.
* **HTTP Method:** `GET`
* **Endpoint:** `/receipts?vendorId=<SOCIETY_ID>&search=<SEARCH>&page=1&limit=20`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Receipts fetched successfully",
  "data": {
    "total": 5,
    "page": 1,
    "pages": 1,
    "receipts": [
      {
        "_id": "66bc91231b2c3d4e5f6a7b9e",
        "receiptNo": "728",
        "bookNo": "1",
        "date": "2026-08-15",
        "receivedFrom": "Gyana Singh",
        "flatShopNo": "Flat A-101",
        "paymentMode": "Cash",
        "cashChequeNo": "CHK-492018",
        "drawnOn": "State Bank of India",
        "totalAmount": 4850,
        "items": []
      }
    ]
  }
}
```

---

### 6. Get Single Receipt Details
* **Single-line Summary:** `GET /receipts/:id` — Retrieves complete details for a single receipt voucher.
* **HTTP Method:** `GET`
* **Endpoint:** `/receipts/66bc91231b2c3d4e5f6a7b9e`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Receipt details retrieved",
  "data": {
    "receipt": {
      "_id": "66bc91231b2c3d4e5f6a7b9e",
      "receiptNo": "728",
      "receivedFrom": "Gyana Singh",
      "totalAmount": 4850,
      "items": []
    }
  }
}
```

---

### 7. Stream / Download PDF Receipt Voucher
* **Single-line Summary:** `GET /receipts/:id/pdf?token=<TOKEN>` — Streams PDF document for receipt voucher preview or printing.
* **HTTP Method:** `GET`
* **Endpoint:** `/receipts/66bc91231b2c3d4e5f6a7b9e/pdf?token=<TOKEN>`
* **Headers:** `Authorization: Bearer <TOKEN>` or URL Query Parameter `?token=<TOKEN>`
* **Response Header:** `Content-Type: application/pdf`

---

### 8. Get Logged-in Resident Profile & Housing Society Details
* **Single-line Summary:** `GET /auth/me` — Fetches user profile, flat info, and housing society details (Bank Account & UPI QR Code).
* **HTTP Method:** `GET`
* **Endpoint:** `/auth/me`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "user": {
      "_id": "66bc902b1b2c3d4e5f6a7b8d",
      "name": "Gyana Singh",
      "email": "gyana@mandovinagar.org",
      "phone": "+918280057771",
      "role": "MEMBER",
      "flatNo": "Flat A-101",
      "panNo": "AAAAA0000A",
      "panDocUrl": "data:image/png;base64,...",
      "vendorId": {
        "_id": "66bc901a1b2c3d4e5f6a7b8c",
        "name": "Mandovi Nagar Co-Op. Housing Society Ltd.,",
        "address": "Porvorim, Alto Porvorim, Goa 403521",
        "regNo": "HSG-(a)-70/GOA",
        "contactEmail": "secretary@mandovinagar.org",
        "contactPhone": "+91 98221 23456",
        "bankName": "State Bank of India",
        "accountName": "Mandovi Nagar Co-Op. Housing Society Ltd.",
        "accountNo": "38492019482",
        "ifscCode": "SBIN0001234",
        "upiId": "mandovi.society@sbi",
        "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=..."
      }
    }
  }
}
```

---

### 9. Update Resident Profile & PAN Attachment
* **Single-line Summary:** `PUT /auth/me` — Updates resident profile details (Name, Flat Number, Mobile Phone, Email, PAN Number, PAN Image/PDF Attachment).
* **HTTP Method:** `PUT`
* **Endpoint:** `/auth/me`
* **Headers:** `Authorization: Bearer <TOKEN>`

#### Request Body
```json
{
  "name": "Gyana Singh",
  "email": "gyana@mandovinagar.org",
  "phone": "+918280057771",
  "flatNo": "Flat A-101",
  "panNo": "AAAAA0000A",
  "panDocUrl": "data:image/png;base64,..."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": {
      "_id": "66bc902b1b2c3d4e5f6a7b8d",
      "name": "Gyana Singh",
      "email": "gyana@mandovinagar.org",
      "phone": "+918280057771",
      "flatNo": "Flat A-101",
      "panNo": "AAAAA0000A",
      "panDocUrl": "data:image/png;base64,..."
    }
  }
}
```

---

## 🔴 Standard Error Response Payload
```json
{
  "success": false,
  "message": "Error description message"
}
```
