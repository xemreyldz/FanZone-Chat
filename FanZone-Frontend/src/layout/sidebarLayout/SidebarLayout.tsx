import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { useTheme } from '../../components/theme/ThemeContext';
import "../../pages/home/HomePages.css"

interface SidebarLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarLayout = ({ children, sidebarOpen, toggleSidebar }: SidebarLayoutProps) => {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <div className='homePage-container'>
        <div
          className='homePage-container-left-menu'
          style={{
            width: sidebarOpen ? '250px' : '80px',
            transition: 'width 0.3s ease',
            flexShrink: 0,
          }}
        >
          <Sidebar open={sidebarOpen} toggleDrawer={toggleSidebar} />
        </div>

        <div className='homePage-container-right'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
