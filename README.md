# 📱 Raj Shop - Order Management System

A comprehensive web-based order management system for phone parts wholesalers. This system enables market retailers/shopkeepers to place delivery orders for phone parts, while admins and superadmins can efficiently manage and track these orders.

## 🎯 Features

### Shopkeeper Module
- Simple login/registration with name, shop name, and phone number
- Notepad-style order entry interface
- View order history with status tracking
- Real-time order status updates

### Admin Module
- Secure password-based authentication
- View all orders from shopkeepers
- Process and mark orders as delivered
- Real-time notifications for new orders
- Order statistics dashboard
- Filter orders by status

### Superadmin Module
- Complete system oversight
- Admin account management (create, activate, deactivate, delete)
- Final order confirmation after admin delivery
- Monitor all system activities
- Real-time notifications for all order events
- Comprehensive statistics dashboard

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Security**: bcryptjs for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone or Navigate to the Project

```bash
cd d:\raj.shop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
copy .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/rajshop

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# Session
SESSION_TIMEOUT=24h

# Superadmin Initial Credentials
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=SuperAdmin@123
SUPERADMIN_NAME=Super Administrator
```

**Important**: Change the `JWT_SECRET` and superadmin credentials in production!

### 4. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# Or if using MongoDB installed locally
mongod
```

### 5. Start the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📱 Usage Guide

### First Time Setup

1. **Access the Application**: Open your browser and navigate to `http://localhost:3000`

2. **Superadmin Login**: 
   - Click "Superadmin Login"
   - Use the default credentials from your `.env` file
   - **Default**: Username: `superadmin`, Password: `SuperAdmin@123`
   - ⚠️ **Change these credentials immediately after first login**

3. **Create Admin Accounts**:
   - Go to the "Manage Admins" tab
   - Create admin accounts for your staff
   - Each admin will need these credentials to log in

### Shopkeeper Workflow

1. Navigate to `http://localhost:3000`
2. Click "Shopkeeper Login"
3. Enter your details (name, shop name, phone number)
4. Type your order in the notepad-style text area
5. Submit your order
6. Track order status in real-time

### Admin Workflow

1. Navigate to `http://localhost:3000`
2. Click "Admin Login"
3. Enter your username and password (provided by superadmin)
4. View all pending orders
5. Process orders and mark them as delivered
6. Receive real-time notifications for new orders

### Superadmin Workflow

1. Navigate to `http://localhost:3000`
2. Click "Superadmin Login"
3. Enter your credentials
4. **Orders Tab**: Monitor all orders and confirm deliveries
5. **Manage Admins Tab**: Create, activate, deactivate, or delete admin accounts
6. Receive notifications for all system events

## 📊 System Flow

```
Shopkeeper → Places Order (Pending)
     ↓
Admin → Receives Notification
     ↓
Admin → Marks as Delivered
     ↓
Superadmin → Receives Notification
     ↓
Superadmin → Confirms as Completed
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate permissions for each user type
- **Password Hashing**: bcryptjs with salt for password security
- **Session Management**: Configurable session timeout
- **Active Status**: Admins can be deactivated without deletion

## 🔔 Notification System

- Real-time notifications using Socket.IO
- Admins receive notifications for:
  - New orders from shopkeepers
- Superadmin receives notifications for:
  - New orders from shopkeepers
  - Orders delivered by admins
- Visual notification badges
- Notification history panel

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/shopkeeper/login` - Shopkeeper login/registration
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/superadmin/login` - Superadmin login

### Orders
- `GET /api/orders` - Get orders (filtered by role)
- `POST /api/orders` - Create new order (Shopkeeper)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/deliver` - Mark as delivered (Admin)
- `PUT /api/orders/:id/complete` - Mark as completed (Superadmin)
- `GET /api/orders/stats/dashboard` - Get order statistics

### Admin Management
- `GET /api/admin/list` - Get all admins (Superadmin)
- `POST /api/admin/create` - Create new admin (Superadmin)
- `PUT /api/admin/:id/activate` - Activate admin (Superadmin)
- `PUT /api/admin/:id/deactivate` - Deactivate admin (Superadmin)
- `DELETE /api/admin/:id` - Delete admin (Superadmin)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 📁 Project Structure

```
raj.shop/
├── config/
│   ├── database.js          # MongoDB connection
│   └── constants.js         # Application constants
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User model (Shopkeeper/Admin/Superadmin)
│   ├── Order.js             # Order model
│   └── Notification.js      # Notification model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── orders.js            # Order management routes
│   ├── admin.js             # Admin management routes
│   └── notifications.js     # Notification routes
├── public/
│   ├── css/
│   │   └── style.css        # Stylesheet
│   ├── js/
│   │   └── config.js        # Frontend configuration
│   ├── index.html           # Landing page
│   ├── shopkeeper-login.html
│   ├── shopkeeper-dashboard.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── superadmin-login.html
│   └── superadmin-dashboard.html
├── server.js                # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check the `MONGODB_URI` in your `.env` file
- Verify MongoDB is installed correctly

### Port Already in Use
- Change the `PORT` in your `.env` file
- Or stop the application using that port

### Authentication Errors
- Clear browser localStorage
- Check if JWT_SECRET is properly set in `.env`
- Verify user credentials

### Socket.IO Connection Issues
- Ensure the server is running
- Check browser console for connection errors
- Verify SOCKET_URL in `public/js/config.js`

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for auto-reloading on file changes.

### Database Reset
If you need to reset the database:
```bash
# Connect to MongoDB
mongo
# Switch to database
use rajshop
# Drop database
db.dropDatabase()
```
The superadmin account will be recreated on next server start.

## 📝 Default Credentials

**Superadmin** (after first run):
- Username: `superadmin`
- Password: `SuperAdmin@123`

⚠️ **Change these immediately in production!**

## 🌟 Features Highlights

- ✅ Simple notepad-style order entry
- ✅ Real-time notifications
- ✅ Role-based access control
- ✅ Order status tracking
- ✅ Admin management
- ✅ Responsive design
- ✅ Session management
- ✅ Audit trail (who delivered, who completed)
- ✅ Statistics dashboard
- ✅ Order filtering

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints documentation
3. Check server logs for error messages

## 📄 License

ISC

## 🎉 Version

1.0.0

---

**Built with ❤️ for Raj Shop**
