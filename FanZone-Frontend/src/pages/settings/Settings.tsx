import React, { useState } from 'react';
import SidebarLayout from '../../layout/sidebarLayout/SidebarLayout';
import SettingsSidebar from '../../components/settingssidebar/SettingsSidebar';
import AccountSettings from "../../components/accountsettings/AccountSettings";
import Navbar from '../../components/navbar/Navbar';
import PrivacySettings from "../../components/privacysettings/PrivacySettings"
import ThemeSettings from '../../components/themesettings/ThemeSettings'
import { useTheme } from '../../components/theme/ThemeContext';


const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('account');

  const { darkMode } = useTheme(); // ✅ isTeamTheme eklendi

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'account': return <AccountSettings />;
      case 'privacy': return <PrivacySettings />;
      case 'theme': return <ThemeSettings />;
      default: return null;
    }
  };

  return (
    <SidebarLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "17px", color:darkMode?"white":"black" }}>
        <div style={{ paddingLeft: "20px" }}>
          <h2>Ayarlar</h2>
        </div>
        <div>
          <Navbar showText={false} />
        </div>

      </div>
      <div style={{ display: 'flex', height: '75%', backgroundColor:darkMode?"black":"white" }}>
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ flex: 1, padding: '1rem' }}>
          {renderActiveTab()}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
