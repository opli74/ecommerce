// src/components/react/Dashboard.tsx

import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Loader } from './loader';

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


const Users = (
    { users }: UsersProps
) => 
(
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

const Products = (

) => 
(
  <div>
    <h2>Products Management</h2>
    <p>This is the products section where you manage products.</p>
  </div>
);

const Profile = (

) => 
(
  <div>
    <h2>Profile Management</h2>
    <p>This is the profile section where you manage your profile.</p>
  </div>
);

const DashboardContent = (
    {users}: UsersProps
) => 
{
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
    setIsClient(true);
  }, []);

  if (!isClient) 
    return <Loader colorMode={false}/>;

  return <DashboardContent users={users}/>;
};

export default Dashboard;
