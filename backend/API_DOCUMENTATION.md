# PoojaSetu - Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require Bearer token authentication.

Include in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Endpoints

### 🔐 Authentication

#### POST `/auth/login`
Login or register a user.

**Body:**
```json
{
  "method": "phone|google|facebook",
  "phone": "+919876543210",  // for phone auth
  "email": "user@example.com", // for google/facebook
  "name": "User Name",
  "photo": "https://..."  // optional
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "+919876543210",
    "photo": "https://...",
    "dob": null,
    "pob": null
  }
}
```

#### GET `/auth/me` 🔒
Get current user details.

**Headers:** Requires `Authorization: Bearer TOKEN`

#### PUT `/auth/profile` 🔒
Update user profile.

**Headers:** Requires `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "name": "Updated Name",
  "email": "new@email.com",
  "dob": "1990-01-01",
  "pob": "Mumbai"
}
```

---

### 🏛️ Temples

#### GET `/temples`
Get all temples.

**Response:**
```json
[
  {
    "_id": "...",
    "id": "t1",
    "name": "Dagdusheth Halwai Ganpati",
    "city": "Pune",
    "description": "Famous Ganesh temple...",
    "heroImageUrl": "https://...",
    "rating": 4.8,
    "deities": ["Ganesha"]
  }
]
```

#### GET `/temples/:id`
Get specific temple by ID.

---

### 🪔 Poojas

#### GET `/poojas`
Get all poojas.

**Response:**
```json
[
  {
    "_id": "...",
    "id": "p1",
    "title": "Ganesh Abhishek",
    "templeId": "t1",
    "basePriceINR": 500,
    "durationMinutes": 45,
    "type": "Abhishek",
    "addOns": [
      {
        "id": "a1",
        "name": "Modak Offering",
        "priceINR": 100
      }
    ]
  }
]
```

#### GET `/poojas/:id`
Get specific pooja by ID.

#### GET `/poojas/temple/:templeId`
Get all poojas for a specific temple.

---

### 📅 Bookings

#### POST `/bookings` 🔒
Create a new booking.

**Headers:** Requires `Authorization: Bearer TOKEN`

**Body:**
```json
{
  "poojaId": "p1",
  "templeId": "t1",
  "date": "2025-12-01",
  "slotId": "10:00-10:45",
  "addOnIds": ["a1", "a2"],
  "amountINR": 650,
  "inputs": {
    "gotra": "Bharadwaj",
    "nakshatra": "Ashwini",
    "intentions": "Health and prosperity"
  }
}
```

**Response:**
```json
{
  "id": "...",
  "_id": "...",
  "userId": "...",
  "poojaId": "p1",
  "status": "pending",
  "liveStreamUrl": "https://stream.poojasetu.com/live/...",
  "recordingUrl": null
}
```

#### GET `/bookings` 🔒
Get all bookings for current user.

**Headers:** Requires `Authorization: Bearer TOKEN`

#### GET `/bookings/:id` 🔒
Get specific booking with stream status.

**Headers:** Requires `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "poojaId": "p1",
  "templeId": "t1",
  "date": "2025-12-01",
  "slotId": "10:00-10:45",
  "status": "confirmed",
  "liveStreamUrl": "https://stream.poojasetu.com/live/...",
  "recordingUrl": "https://stream.poojasetu.com/recording/...",
  "streamStatus": "live|upcoming|completed"
}
```

**Stream Status:**
- `upcoming` - Booking is scheduled for future
- `live` - Within 30 mins before or during the pooja
- `completed` - Pooja finished, recording available

---

## Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error

## Error Response Format
```json
{
  "error": "Error message description"
}
```

---

🔒 = Requires Authentication
