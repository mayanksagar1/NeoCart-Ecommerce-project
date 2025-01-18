# NeoCart E-commerce Project

NeoCart is a modern and fully-featured e-commerce platform built with a powerful tech stack. The project includes a dynamic frontend, a robust backend, and seamless integration of essential features to deliver an exceptional online shopping experience.

## 🌟 Features

### User Features
- **User Authentication**: Register, login, and logout functionalities.
- **Profile Management**: Update profile information, manage addresses, and view past orders.
- **Product Browsing**: Explore all products with advanced filtering by category, brand, and price.
- **Favorites**: Add products to your favorites for easy access.
- **Cart Management**: Add/remove products to/from the cart, with the cart synchronized for both logged-in and guest users.
- **Checkout Process**:
  - Multi-step checkout: Address selection/creation, order summary, and payment.
  - Integrated PayPal payment gateway for secure transactions.
- **Order Management**: Track your orders, view order details, and order status.

### Admin Features
- **User Management**: Admins can view, update, and delete user accounts.
- **Category Management**: Add, update, and delete product categories.
- **Product Management**: Create, update, delete, and manage products with image uploads using Cloudinary.
- **Order Management**: View and manage all orders placed by users.

## 💻 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/).
- **State Management**: Redux Toolkit with RTK Query for API calls.
- **Styling**: Tailwind CSS.
- **Other Libraries**: React Router, React Toastify, React Icons, Moment.js.

### Backend
- **Server**: Node.js with Express.
- **Database**: MongoDB (NoSQL) with Mongoose.
- **Authentication**: JWT (JSON Web Tokens) and HTTP-only cookies.
- **File Storage**: Cloudinary for image uploads.
- **Payment Integration**: PayPal REST API.

### Deployment
- **Frontend**: Deployed on [Vercel](https://vercel.com/).
- **Backend**: Deployed on Vercel with API routes.
- **Database**: MongoDB Atlas.

## 🚀 Live Demo
[NeoCart Live](https://neo-cart.vercel.app/)

## 📂 Folder Structure

```plaintext
project-root/
├── frontend/       # React frontend with Vite
├── backend/        # Node.js + Express backend
└── shared/         # Shared configurations (if any)
```

## 🛠️ Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- npm or yarn

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```plaintext
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL = your_frontend_url
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure the following variables:
   ```plaintext
   VITE_BACKEND_URL=your_backend_url
   ```
   Update the `Backend url` in your `.env` file to match your backend's live URL.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Build for Production
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the built files to Vercel or your preferred hosting platform.

## 🧪 Testing
- **Frontend Testing**: Test components and routes using tools like React Testing Library.
- **Backend Testing**: Use Postman to test API endpoints.

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## 📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

## 👤 Author
- **Mayank Sagar**: [GitHub](https://github.com/mayanksagar1)

---

### 🌟 Show Your Support
If you found this project helpful, please give it a ⭐ on [GitHub](https://github.com/mayanksagar1/NeoCart-ecommerce-project.git)!

---

