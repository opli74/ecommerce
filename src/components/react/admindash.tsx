// src/components/react/Dashboard.tsx

import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

export interface USER
{
    id?: number,
    name: string,
    email: string,
    password?: string,
    isAdmin: boolean,
    createdAt?: string,
    updatedAt?: string, 
};

  
interface UsersProps 
{
    users: USER[];
}


const Users = ({ users }: UsersProps) => (
    <div>
      <h2>Users Management</h2>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email} - {user.createdAt}  - {user.isAdmin ? 'Admin' : 'User'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );

const Products = () => (
  <div>
    <h2>Products Management</h2>
    <p>This is the products section where you manage products.</p>
    {/* Add product management functionalities here */}
  </div>
);

const Profile = () => (
  <div>
    <h2>Profile Management</h2>
    <p>This is the profile section where you manage your profile.</p>
    {/* Add profile management functionalities here */}
  </div>
);

const DashboardContent = ({users}: UsersProps) => {
  return (
    <Router>
      <div className="dashboard">
        {/* Navigation */}
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="accountfefw/users">Users</Link>
            </li>
            <li>
              <Link to="accountfefw/products">Products</Link>
            </li>
            <li>
              <Link to="accountfefw/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="admin-content">
          <Routes>
            <Route path="accountfefw/users" element={<Users users={users}/>} />
            <Route path="accountfefw/products" element={<Products />} />
            <Route path="accountfefw/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Dashboard = ({users}: UsersProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs after the component mounts, so it's guaranteed to be on the client
    setIsClient(true);
  }, []);

  if (!isClient) {
    // While waiting for client-side rendering, you can show a loading state
    return <div>Loading dashboard...</div>;
  }

  // Render the dashboard content on the client
  return <DashboardContent users={users}/>;
};

export default Dashboard;
