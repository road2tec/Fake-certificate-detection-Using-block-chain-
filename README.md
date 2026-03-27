# Fake Product Identification System using QR Code & Blockchain

A complete production-ready system for identifying counterfeit products using QR codes and blockchain technology.

![Tech Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Blockchain-Ethereum-3C3C3D?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square)

## 🌟 Features

### User Roles
- **Admin**: Manage manufacturers, view all products, monitor verifications
- **Manufacturer**: Register products, generate QR codes, track products
- **Consumer**: Verify product authenticity by scanning QR codes

### Key Capabilities
- ✅ Blockchain-based product registration (Ethereum/Ganache)
- ✅ Product Image, Batch & Expiry Date tracking
- ✅ Real-time product verification with Photo & Details
- ✅ Robust Counterfeit Detection (Red Alert for invalid codes)
- ✅ Manufacturer approval workflow
- ✅ JWT authentication with role-based access
- ✅ Admin dashboard with statistics and charts
- ✅ Modern UI with glassmorphism design

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python (FastAPI) |
| Frontend | React.js (Vite) |
| Database | MongoDB |
| Blockchain | Ethereum (Ganache) |
| Smart Contracts | Solidity |
| Wallet | MetaMask |
| Styling | Tailwind CSS |
| Animations | Framer Motion |

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config/              # Database & settings
│   │   ├── models/              # Pydantic models
│   │   ├── routes/              # API endpoints
│   │   ├── blockchain/          # Web3 integration
│   │   ├── utils/               # Auth, QR generation
│   │   └── schemas/             # Request/Response schemas
│   ├── contracts/               # Solidity smart contract
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/               # Dashboard pages
    │   ├── components/          # Reusable components
    │   ├── services/            # API services
    │   ├── context/             # Auth context
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)
- Ganache (for local blockchain)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Fake Product Identification System using QR Code & Blockchain"
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -muvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Start Ganache (Optional - for blockchain)
```bash
# Install Ganache CLI
npm install -g ganache

# Start Ganache
ganache --port 7545
```

### 5. Start MongoDB
Make sure MongoDB is running on `mongodb://localhost:27017`

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123

*Admin account is created automatically on first startup*

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | User login |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Dashboard statistics |
| GET | `/admin/manufacturers` | List manufacturers |
| PUT | `/admin/approve/{id}` | Approve manufacturer |
| PUT | `/admin/reject/{id}` | Reject manufacturer |
| GET | `/admin/products` | List all products |
| GET | `/admin/verifications` | Verification history |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/product/register` | Register product |
| GET | `/product/my-products` | Get my products |

### Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/verify/product` | Verify product hash |
| GET | `/verify/by-hash/{hash}` | Verify by hash |

## 🎨 UI Theme

The application uses a custom color palette:
- **Background**: Soft cream (`#FDF8F3`)
- **Primary**: Emerald (`#10B981`)
- **Accent**: Coral (`#F97316`)
- **Highlight**: Violet (`#8B5CF6`)
- **Gold**: For warnings (`#F59E0B`)

**No black, blue, or grey colors are used!**

## 📱 Screenshots

### Landing Page
- Hero section with animations
- Features showcase
- How-it-works timeline
- Call-to-action

### Admin Dashboard
- Statistics overview with charts
- Manufacturer approval cards
- Product monitoring
- Verification history table

### Manufacturer Dashboard
- Product registration form with **Image Upload**
- Batch Number & Expiry Date tracking
- QR code preview
- Blockchain transaction display
- Product list

### Consumer Dashboard
- QR code scanner (Camera & Drag-and-Drop) / hash input
- Verification result with **Product Image Display**
- Detailed authentication report (Batch #, Expiry, Timestamp)
- **Counterfeit Alert System** for invalid/fake QRs
- Verification history

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=fake_product_db
SECRET_KEY=your-secret-key
GANACHE_URL=http://127.0.0.1:7545
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## 🧪 Testing the Flow

1. **Start all services** (MongoDB, Ganache, Backend, Frontend)

2. **Login as Admin** (admin@example.com / admin123)

3. **Create a Manufacturer Account**
   - Go to Signup → Select Manufacturer
   - Fill in company details
   - Account will be pending

4. **Approve Manufacturer** (as Admin)
   - Go to Admin Dashboard → Manufacturers
   - Click Approve

5. **Login as Manufacturer**
   - Register a product
   - View generated QR code
   - Note the product hash

6. **Login as Consumer** (or create new account)
   - Go to Verify Product
   - Paste the product hash
   - View verification result

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ using FastAPI, React, and Blockchain Technology
