// components/MenuToggle.tsx
import React, { useState, useEffect } from 'react';
import { isLoggedIn  } from '../../util/auth';
import type { 
  USER
} from '../../util/types';

interface AuthStatus {
    isLoggedIn: boolean;
    isAdmin: boolean;
    user: USER | null;
  }

const MenuToggle = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isLoggedIn: false,
    isAdmin: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try 
      {
        const result = await isLoggedIn( );
        console.log( result )
        if( result.success && result.data )
            setAuthStatus({
                isLoggedIn: result.success,
                isAdmin: result.data.isAdmin,
                user: result.data,
            });
        else
            setAuthStatus({
                isLoggedIn: false,
                isAdmin: false,
                user: null, 
            });

      } 
      catch (error) 
      {
        console.error('Error fetching auth status:', error);
      }
      finally 
      {
        setIsLoading( false );
      }
    };

    checkAuthStatus();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };    

    // console.log( authStatus );

  return (
    <nav className="navbar p-3 bg-slate-100 h-50 pl-10 pr-10 w-full z-[900] relative">
      <div className="max-w-[1800px] mx-auto flex justify-between items-center relative h-full">
        {/* Logo Section */}
        <div className="ml-1 mr-1">
          <a href="/">
            <img
              width="150"
              height="50"
              alt="Astro ecommerce"
              style={{ objectFit: 'cover' }}
              className="w-[80px] md:w-[100px]"
            />
          </a>
        </div>

        {/* Hamburger Menu Icon for mobile */}
        <button
          className="block md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        //   onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main Menu */}
        <ul className="hidden md:flex w-3/4 h-full justify-evenly items-center relative">
          <li>
            <a href="/products" className="flex items-center gap-1" aria-label="navigate to products">
              Products
            </a>
          </li>
          <li>
            <a href="/" className="flex items-center gap-1">
              Stuff
            </a>
          </li>
          <li>
            <a href="/" className="flex items-center gap-1">
              More Stuff
            </a>
          </li>
          <li>
            {isLoading ? null : authStatus.isLoggedIn ? (
              <>
                {authStatus.isAdmin ? (
                  <a href="/admin" className="flex items-center gap-1">
                    Admin
                  </a>
                ) :
                (
                  <a href="/account" className="flex items-center gap-1">
                    Account
                  </a>
                )}
              </>
            ) : (
              <a href="/login" className="flex items-center gap-1">
                Login
              </a>
            )
            }
          </li>
        </ul>

        {/* Mobile Menu (Full Screen) */}
        <div
          className={`fixed inset-0 z-50 bg-slate-100 transition-transform transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden`}
        >
          <div className="p-5">
            <button className="absolute top-4 right-4 p-2" onClick={toggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Mobile Menu Items */}
            <ul className="flex flex-col items-center space-y-6 mt-10">
              <li>
                <a href="/products" className="text-2xl" onClick={toggleMenu}>
                  Products
                </a>
              </li>
              <li>
                <a href="/" className="text-2xl" onClick={toggleMenu}>
                  Stuff
                </a>
              </li>
              <li>
                <a href="/" className="text-2xl" onClick={toggleMenu}>
                  More Stuff
                </a>
              </li>
              <li>
                {isLoading ? null : authStatus.isLoggedIn ? (
                  <>
                    <a href="/account" className="text-2xl" onClick={toggleMenu}>
                      Account
                    </a>
                    {authStatus.isAdmin && (
                      <a href="/admin" className="text-2xl" onClick={toggleMenu}>
                        Admin
                      </a>
                    )}
                    <a href="/logout" className="text-2xl" onClick={toggleMenu}>
                      Logout
                    </a>
                  </>
                ) : (
                  <a href="/login" className="text-2xl" onClick={toggleMenu}>
                    Login
                  </a>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuToggle;
