# 🚀 Quick Start Guide - Raj Shop Order Management System

## Step-by-Step Installation

### Step 1: Install Prerequisites

#### Install Node.js
1. Download Node.js from: https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### Install MongoDB
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Choose "MongoDB Community Server"
3. Run the installer
4. During installation, select "Install MongoDB as a Service"
5. Verify installation:
   ```bash
   mongod --version
   ```

### Step 2: Set Up the Project

#### Option A: Using Setup Script (Recommended for Windows)
1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```bash
   cd d:\raj.shop
   ```
3. Run the setup script:
   ```bash
   setup.bat
   ```
4. Follow the on-screen instructions

#### Option B: Manual Setup
1. Open Command Prompt or PowerShell
2. Navigate to the project folder:
   ```bash
   cd d:\raj.shop
   ```
3. Create `.env` file:
   ```bash
   copy .env.example .env
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### Step 3: Configure Environment Variables

1. Open the `.env` file in a text editor
2. Update the following values:

```env
# Change this to a secure random string
JWT_SECRET=your_secure_random_string_here

# MongoDB connection (default is fine for local development)
MONGODB_URI=mongodb://localhost:27017/rajshop

# Change superadmin credentials for security
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=YourSecurePassword123!
SUPERADMIN_NAME=Your Name
```

**Important**: Generate a strong JWT_SECRET. You can use:
- Online generator: https://www.grc.com/passwords.htm
- Or run in Node.js console: `require('crypto').randomBytes(64).toString('hex')`

### Step 4: Start MongoDB

#### Windows
```bash
# If MongoDB is installed as a service (default)
net start MongoDB

# Or manually
mongod
```

#### macOS/Linux
```bash
# Using brew (macOS)
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

### Step 5: Start the Application

#### Option A: Using Start Script (Windows)
```bash
start.bat
```

#### Option B: Manual Start
```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

### Step 6: Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. You should see the Raj Shop welcome page

### Step 7: First Login (Superadmin)

1. Click "Superadmin Login"
2. Enter the credentials from your `.env` file:
   - Username: `superadmin` (or what you set)
   - Password: `SuperAdmin@123` (or what you set)
3. **Important**: Change these credentials immediately!

### Step 8: Create Admin Accounts

1. In the superadmin dashboard, click "Manage Admins"
2. Fill in the form:
   - Name: Admin's full name
   - Username: Login username
   - Password: Minimum 6 characters
3. Click "Create Admin"
4. Share the credentials with your admin staff

## 🎯 Testing the System

### Test as Shopkeeper
1. Open a new browser window (or incognito mode)
2. Go to: `http://localhost:3000`
3. Click "Shopkeeper Login"
4. Enter test details:
   - Name: Test Shopkeeper
   - Shop Name: Test Mobile Shop
   - Phone: 1234567890
5. Create a test order
6. Check if it appears in your orders list

### Test as Admin
1. Open another browser window (or incognito mode)
2. Login with admin credentials
3. Check if you see the test order
4. Try marking it as delivered
5. Check notifications

### Test as Superadmin
1. In your superadmin dashboard
2. Check notifications for the new order
3. Check notifications for the delivered order
4. Try confirming the order as completed

## 🔧 Common Issues and Solutions

### Issue: "Cannot connect to MongoDB"
**Solutions:**
- Ensure MongoDB service is running
- Check if MongoDB is installed correctly
- Verify `MONGODB_URI` in `.env` file
- Try: `net start MongoDB` (Windows)

### Issue: "Port 3000 is already in use"
**Solutions:**
- Change `PORT` in `.env` to another number (e.g., 3001)
- Or find and stop the application using port 3000

### Issue: "Module not found" errors
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue: Login not working
**Solutions:**
- Clear browser cache and localStorage
- Check browser console for errors (F12)
- Verify `.env` file is properly configured
- Restart the server

### Issue: Real-time notifications not working
**Solutions:**
- Check if Socket.IO is connecting (browser console)
- Verify server is running
- Clear browser cache
- Try a different browser

## 📱 Using the System

### For Shopkeepers
1. **Login**: Enter your details (no registration needed)
2. **Create Order**: Type your requirements in the notepad area
3. **Submit**: Click "Submit Order"
4. **Track**: View your order status in "My Orders"

### For Admins
1. **Login**: Use credentials provided by superadmin
2. **View Orders**: See all pending orders
3. **Process**: Click "Mark as Delivered" after delivery
4. **Notifications**: Check bell icon for new orders

### For Superadmin
1. **Login**: Use your superadmin credentials
2. **Monitor Orders**: View all orders and their status
3. **Confirm Deliveries**: Mark delivered orders as completed
4. **Manage Admins**: Create, activate, deactivate admins
5. **Notifications**: Monitor all system activities

## 🔐 Security Best Practices

1. **Change Default Credentials**: Immediately after first login
2. **Use Strong Passwords**: 
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols
3. **Secure JWT_SECRET**: Use a long random string
4. **Regular Backups**: Backup MongoDB database regularly
5. **Update Dependencies**: Keep packages up to date
6. **HTTPS in Production**: Use SSL certificate for production

## 📊 Database Backup

### Backup MongoDB Database
```bash
mongodump --db rajshop --out d:\raj.shop\backups
```

### Restore MongoDB Database
```bash
mongorestore --db rajshop d:\raj.shop\backups\rajshop
```

## 🌐 Production Deployment

### Prepare for Production
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use production MongoDB instance
4. Configure proper firewall rules
5. Use HTTPS (SSL certificate)
6. Set up monitoring and logging

### Recommended Hosting
- **Backend**: Heroku, AWS, DigitalOcean, Azure
- **Database**: MongoDB Atlas (free tier available)
- **Frontend**: Can be served by Express or separately

## 📞 Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check server logs for error messages
4. Verify all prerequisites are installed correctly

## 🎉 Success Checklist

- [ ] Node.js installed and working
- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Server starts without errors
- [ ] Can access `http://localhost:3000`
- [ ] Superadmin login works
- [ ] Admin creation works
- [ ] Shopkeeper can create orders
- [ ] Notifications working
- [ ] Real-time updates working

**Congratulations! Your Raj Shop Order Management System is ready to use! 🎊**

---

**Need help?** Review the troubleshooting section or check server logs for detailed error messages.
