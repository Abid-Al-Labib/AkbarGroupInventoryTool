// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import PartsPage from './pages/PartsPage';
// import EditPartPage from './pages/EditPartPage';
// import OrderPage from './pages/OrderPage';
// import CreateOrderPage from './pages/CreateOrderPage';
// import ViewOrderPage from './pages/ViewOrderPage';
// import ManageOrderPage from './pages/ManageOrderPage';
// import ViewPartPage from './pages/ViewPartPage';
// import AddPartPage from './pages/AddPartPage';
// import StoragePage from './pages/StoragePage';
// import MachinePage from './pages/MachinePage';
// import DamagedPartsPage from './pages/DamagedPartsPage';
// import { AuthProvider } from './context/AuthContext';
// import ProfilePage from './pages/ProfilePage';

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/parts" element={<PartsPage />} />
//           <Route path="/addpart" element={<AddPartPage />} />
//           <Route path="/editpart/:id" element={<EditPartPage />} />
//           <Route path="/viewpart/:id" element={<ViewPartPage />} />
//           <Route path="/orders" element={<OrderPage />} />
//           <Route path="/createorder" element={<CreateOrderPage />} />
//           <Route path="/vieworder/:id" element={<ViewOrderPage />} />
//           <Route path="/manageorder/:id" element={<ManageOrderPage />} />
//           <Route path="/storage" element={<StoragePage />} />
//           <Route path="/machine" element={<MachinePage />} />
//           <Route path="/damagedparts" element={<DamagedPartsPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//         </Routes>
//       </Router>
//     </AuthProvider>

//   );
// };

// export default App;


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PartsPage from './pages/PartsPage';
import EditPartPage from './pages/EditPartPage';
import OrderPage from './pages/OrderPage';
import CreateOrderPage from './pages/CreateOrderPage';
import ViewOrderPage from './pages/ViewOrderPage';
import ManageOrderPage from './pages/ManageOrderPage';
import ViewPartPage from './pages/ViewPartPage';
import AddPartPage from './pages/AddPartPage';
import StoragePage from './pages/StoragePage';
import MachinePage from './pages/MachinePage';
import DamagedPartsPage from './pages/DamagedPartsPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/customui/routing/PrivateRouting'; // Import PrivateRoute component
import InvoicePage from './pages/InvoicePage';
import ManagementPage from './pages/ManagementPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/parts"
            element={
              <PrivateRoute>
                <PartsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/addpart"
            element={
              <PrivateRoute>
                <AddPartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/editpart/:id"
            element={
              <PrivateRoute>
                <EditPartPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewpart/:id"
            element={
              <PrivateRoute>
                <ViewPartPage />
              </PrivateRoute>
            }
          />
          <Route  
            path="/invoice/:id"
            element={
              <PrivateRoute>
                <InvoicePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/management"
            element={
              <PrivateRoute>
                <ManagementPage/>
              </PrivateRoute>
            }
          />
          <Route
            path="/createorder"
            element={
              <PrivateRoute>
                <CreateOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/vieworder/:id"
            element={
              <PrivateRoute>
                <ViewOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/manageorder/:id"
            element={
              <PrivateRoute>
                <ManageOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/storage"
            element={
              <PrivateRoute>
                <StoragePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/machine"
            element={
              <PrivateRoute>
                <MachinePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/damagedparts"
            element={
              <PrivateRoute>
                <DamagedPartsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
