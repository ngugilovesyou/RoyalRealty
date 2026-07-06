# 🏡 Royal Realty

A modern real estate platform built to connect property buyers and sellers. Royal Realty provides a seamless experience for discovering land properties and connecting with real estate professionals.

**Website:** [https://royalrealty.co.ke/](https://royalrealty.co.ke/)

---

## 🎯 Features

- **Property Listings** - Browse and filter approved land properties with detailed information
- **Seller Dashboard** - Submit land properties for sale with comprehensive details and media uploads
- **Contact Management** - Inquire about properties and connect with the team
- **Authentication** - Secure user registration and login with JWT-based authentication
- **Admin Review System** - Approval workflow for submitted properties
- **SEO Optimized** - Dynamic sitemap generation for better search engine visibility
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **GSAP** - Advanced animation library
- **Lucide React** - Beautiful icon set
- **React Hot Toast** - Toast notifications

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-SQLAlchemy** - SQLAlchemy integration
- **Flask-RESTful** - REST API extension
- **Flask-Migrate** - Database migrations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-Bcrypt** - Password hashing
- **Flask-Mail** - Email support
- **CORS** - Cross-origin resource sharing

### Languages
- JavaScript: 85.9%
- Python: 13.9%
- Other: 0.2%

---

## 📁 Project Structure

```
RoyalRealty/
├── client/                    # React frontend application
│   ├── src/                   # React components and pages
│   ├── public/                # Static assets
│   ├── index.html             # HTML entry point
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── Routes.jsx             # Application routing
│
└── server/                    # Flask backend application
    ├── models/                # Database models
    ├── routes/                # API endpoints
    │   ├── auth_routes.py     # Authentication endpoints
    │   ├── land_routes.py     # Land property endpoints
    │   └── contact_routes.py  # Contact form endpoints
    ├── services/              # Business logic layer
    ├── utils/                 # Utility functions
    ├── migrations/            # Database migrations
    ├── logs/                  # Application logs
    ├── app.py                 # Flask app initialization
    ├── config.py              # Configuration settings
    ├── extensions.py          # Extension initialization
    ├── requirements.txt       # Python dependencies
    └── Pipfile                # Pipenv configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.12+ (for backend)
- npm or yarn (for frontend package management)
- pip or pipenv (for Python dependencies)

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with API configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies using pipenv:
```bash
pipenv install
```

Or using pip:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file with necessary configuration:
```env
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
DATABASE_URL=sqlite:///realty.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

4. Initialize the database:
```bash
flask db upgrade
```

5. Start the Flask development server:
```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

---

## 📖 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Land Property Routes
- `GET /api/lands` - Get all approved properties
- `GET /api/lands/<slug>` - Get property details
- `POST /api/lands` - Submit a new property (authenticated)
- `PUT /api/lands/<id>` - Update property (authenticated)

### Contact Routes
- `POST /api/contact` - Submit contact form

### Additional Routes
- `GET /sitemap.xml` - Dynamic sitemap for SEO
- `GET /static/uploads/<filename>` - Serve uploaded files

---

## 🔐 Authentication

Royal Realty uses JWT (JSON Web Tokens) for secure authentication:
- Passwords are hashed using bcrypt
- JWT tokens are issued upon successful login
- Protected routes require valid JWT in Authorization header
- CORS is configured for specified domains

---

## 📸 Media Management

The application supports file uploads with:
- Secure file handling
- File validation
- Organized storage in `/static/uploads/`
- Public access through dedicated endpoint

---

## 🌐 SEO Features

- **Dynamic Sitemap** - Auto-generated based on approved properties
- **Static Pages** - Homepage, Properties, Contact, Projects
- **Meta Tags** - React Helmet for managing page metadata
- **Slug URLs** - Clean, readable URLs for properties

---

## 📝 Development Scripts

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Backend
```bash
python app.py                 # Run Flask app
flask db upgrade              # Apply database migrations
flask db migrate -m "message" # Create new migration
```

---

## 🚢 Deployment

The application is configured for production deployment:
- Frontend: Built as static files, served by frontend server
- Backend: Configured with Passenger WSGI (see `passenger_wsgi.py`)
- Database: Supports PostgreSQL, MySQL, SQLite
- Logging: Error logs stored in `/server/logs/`

---

## 📞 Support

For issues, feature requests, or inquiries:
- Visit: https://royalrealty.co.ke/
- Use the contact form on the website

---

## 📄 License

This project is the property of Royal Realty. All rights reserved.

---

## 👨‍💻 Author

**Ngugi Loves You** - [@ngugilovesyou](https://github.com/ngugilovesyou)

---

## 🎨 UI/UX Highlights

- Modern, clean design with Tailwind CSS
- Smooth animations using Framer Motion and GSAP
- Responsive layout for all screen sizes
- Intuitive navigation and user flows
- Toast notifications for user feedback
- Beautiful icon system with Lucide React

---

**Last Updated:** July 2026
