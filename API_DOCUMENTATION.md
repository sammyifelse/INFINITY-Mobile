# 📚 API Documentation - Raj Shop Order Management System

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Shopkeeper Login/Registration
**Endpoint:** `POST /api/auth/shopkeeper/login`

**Description:** Login or register as a shopkeeper. Creates account if phone number doesn't exist.

**Request Body:**
```json
{
  "name": "John Doe",
  "shopName": "John's Mobile Shop",
  "phoneNumber": "1234567890"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1a",
    "name": "John Doe",
    "shopName": "John's Mobile Shop",
    "phoneNumber": "1234567890",
    "role": "shopkeeper"
  }
}
```

---

### 2. Admin Login
**Endpoint:** `POST /api/auth/admin/login`

**Description:** Login as an admin user.

**Request Body:**
```json
{
  "username": "admin01",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4a1b",
    "name": "Admin User",
    "username": "admin01",
    "role": "admin"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Superadmin Login
**Endpoint:** `POST /api/auth/superadmin/login`

**Description:** Login as a superadmin user.

**Request Body:**
```json
{
  "username": "superadmin",
  "password": "SuperAdmin@123"
}
```

**Response:** Same structure as Admin Login

---

## 📦 Order Endpoints

### 1. Create Order
**Endpoint:** `POST /api/orders`

**Authentication:** Required (Shopkeeper)

**Request Body:**
```json
{
  "orderContent": "CC Board - 10 pieces\nDisplay - 5 pieces\nBattery - 20 pieces",
  "notes": "Urgent delivery needed"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "60d5ec49f1b2c72b8c8e4a1c",
    "shopkeeper": "60d5ec49f1b2c72b8c8e4a1a",
    "shopkeeperName": "John Doe",
    "shopName": "John's Mobile Shop",
    "phoneNumber": "1234567890",
    "orderContent": "CC Board - 10 pieces\nDisplay - 5 pieces\nBattery - 20 pieces",
    "notes": "Urgent delivery needed",
    "status": "Pending",
    "createdAt": "2023-06-25T10:30:00.000Z",
    "updatedAt": "2023-06-25T10:30:00.000Z"
  }
}
```

---

### 2. Get All Orders
**Endpoint:** `GET /api/orders`

**Authentication:** Required (All roles)

**Description:** 
- Shopkeepers see only their orders
- Admins and Superadmins see all orders

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "orders": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1c",
      "shopkeeper": "60d5ec49f1b2c72b8c8e4a1a",
      "shopkeeperName": "John Doe",
      "shopName": "John's Mobile Shop",
      "phoneNumber": "1234567890",
      "orderContent": "CC Board - 10 pieces",
      "status": "Pending",
      "createdAt": "2023-06-25T10:30:00.000Z",
      "deliveredBy": null,
      "completedBy": null
    }
  ]
}
```

---

### 3. Get Single Order
**Endpoint:** `GET /api/orders/:id`

**Authentication:** Required

**Description:** Get details of a specific order. Marks order as viewed by admin/superadmin.

**Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "_id": "60d5ec49f1b2c72b8c8e4a1c",
    "shopkeeper": {
      "_id": "60d5ec49f1b2c72b8c8e4a1a",
      "name": "John Doe",
      "shopName": "John's Mobile Shop",
      "phoneNumber": "1234567890"
    },
    "orderContent": "CC Board - 10 pieces",
    "status": "Pending",
    "notes": "Urgent delivery",
    "viewedBy": [
      {
        "user": "60d5ec49f1b2c72b8c8e4a1b",
        "viewedAt": "2023-06-25T10:35:00.000Z"
      }
    ]
  }
}
```

---

### 4. Mark Order as Delivered
**Endpoint:** `PUT /api/orders/:id/deliver`

**Authentication:** Required (Admin only)

**Description:** Admin marks an order as delivered.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order marked as delivered",
  "order": {
    "_id": "60d5ec49f1b2c72b8c8e4a1c",
    "status": "Delivered",
    "deliveredBy": "60d5ec49f1b2c72b8c8e4a1b",
    "deliveredAt": "2023-06-25T11:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Order is not in pending state"
}
```

---

### 5. Mark Order as Completed
**Endpoint:** `PUT /api/orders/:id/complete`

**Authentication:** Required (Superadmin only)

**Description:** Superadmin confirms order completion after admin delivery.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Order marked as completed",
  "order": {
    "_id": "60d5ec49f1b2c72b8c8e4a1c",
    "status": "Completed",
    "completedBy": "60d5ec49f1b2c72b8c8e4a1d",
    "completedAt": "2023-06-25T12:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Order must be delivered before completion"
}
```

---

### 6. Get Order Statistics
**Endpoint:** `GET /api/orders/stats/dashboard`

**Authentication:** Required (Admin/Superadmin)

**Description:** Get statistics for dashboard.

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "total": 150,
    "pending": 25,
    "delivered": 30,
    "completed": 95
  }
}
```

---

## 👥 Admin Management Endpoints

### 1. Get All Admins
**Endpoint:** `GET /api/admin/list`

**Authentication:** Required (Superadmin only)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "admins": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1b",
      "name": "Admin User",
      "username": "admin01",
      "role": "admin",
      "isActive": true,
      "createdBy": {
        "_id": "60d5ec49f1b2c72b8c8e4a1d",
        "name": "Super Administrator"
      },
      "createdAt": "2023-06-25T09:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Admin
**Endpoint:** `POST /api/admin/create`

**Authentication:** Required (Superadmin only)

**Request Body:**
```json
{
  "name": "New Admin",
  "username": "newadmin",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "admin": {
    "id": "60d5ec49f1b2c72b8c8e4a1e",
    "name": "New Admin",
    "username": "newadmin",
    "role": "admin",
    "isActive": true
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Username already exists"
}
```

---

### 3. Deactivate Admin
**Endpoint:** `PUT /api/admin/:id/deactivate`

**Authentication:** Required (Superadmin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin deactivated successfully"
}
```

---

### 4. Activate Admin
**Endpoint:** `PUT /api/admin/:id/activate`

**Authentication:** Required (Superadmin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin activated successfully"
}
```

---

### 5. Delete Admin
**Endpoint:** `DELETE /api/admin/:id`

**Authentication:** Required (Superadmin only)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications
**Endpoint:** `GET /api/notifications?limit=50`

**Authentication:** Required (Admin/Superadmin)

**Query Parameters:**
- `limit` (optional): Maximum number of notifications (default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "unreadCount": 3,
  "notifications": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4a1f",
      "type": "new_order",
      "order": {
        "_id": "60d5ec49f1b2c72b8c8e4a1c",
        "shopkeeperName": "John Doe",
        "shopName": "John's Mobile Shop",
        "status": "Pending"
      },
      "title": "New Order Received",
      "message": "New order from John's Mobile Shop (John Doe)",
      "recipient": "all",
      "readBy": [],
      "createdAt": "2023-06-25T10:30:00.000Z"
    }
  ]
}
```

---

### 2. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:id/read`

**Authentication:** Required (Admin/Superadmin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 3. Mark All Notifications as Read
**Endpoint:** `PUT /api/notifications/read-all`

**Authentication:** Required (Admin/Superadmin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## 🔌 WebSocket Events (Socket.IO)

### Client → Server Events

#### Join Room
```javascript
socket.emit('joinRoom', 'admin'); // or 'superadmin'
```

### Server → Client Events

#### New Order
```javascript
socket.on('newOrder', (data) => {
  // data: { orderId, shopName, shopkeeperName }
});
```

#### Order Delivered
```javascript
socket.on('orderDelivered', (data) => {
  // data: { orderId, shopName }
});
```

#### Order Completed
```javascript
socket.on('orderCompleted', (data) => {
  // data: { orderId, shopName }
});
```

---

## 📋 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  role: "shopkeeper" | "admin" | "superadmin",
  
  // Shopkeeper fields
  shopName: String,
  phoneNumber: String,
  
  // Admin/Superadmin fields
  username: String,
  password: String (hashed),
  
  isActive: Boolean,
  createdBy: ObjectId,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  shopkeeper: ObjectId,
  shopkeeperName: String,
  shopName: String,
  phoneNumber: String,
  orderContent: String,
  status: "Pending" | "Delivered" | "Completed" | "Cancelled",
  deliveredBy: ObjectId,
  deliveredAt: Date,
  completedBy: ObjectId,
  completedAt: Date,
  notes: String,
  viewedBy: [{
    user: ObjectId,
    viewedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  _id: ObjectId,
  type: "new_order" | "order_delivered" | "order_completed",
  order: ObjectId,
  title: String,
  message: String,
  recipient: "admin" | "superadmin" | "all",
  readBy: [{
    user: ObjectId,
    readAt: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error or invalid operation"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token" 
}
```

### 403 Forbidden
```json
{
  "message": "User role 'shopkeeper' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message"
}
```

---

## 📝 Example Usage with JavaScript

### Login Example
```javascript
const response = await fetch('http://localhost:3000/api/auth/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin01',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;
```

### Create Order Example
```javascript
const response = await fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    orderContent: 'CC Board - 10 pieces\nDisplay - 5 pieces',
    notes: 'Urgent'
  })
});

const data = await response.json();
```

### WebSocket Connection Example
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: yourToken }
});

socket.on('connect', () => {
  socket.emit('joinRoom', 'admin');
});

socket.on('newOrder', (data) => {
  console.log('New order from:', data.shopName);
  // Update UI
});
```

---

## 🧪 Testing with Postman

1. Import the endpoints into Postman
2. Create an environment with:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (will be set after login)
3. Test the flow:
   - Login → Save token
   - Create order
   - Get orders
   - Update order status

---

**API Version:** 1.0.0  
**Last Updated:** 2025
