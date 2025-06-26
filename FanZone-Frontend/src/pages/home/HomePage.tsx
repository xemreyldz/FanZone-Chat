import { useEffect, useState } from 'react';
import "./HomePages.css";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import MyGroup from '../../components/mygroups/MyGroup';
import NewGroups from '../../components/newgroups/NewGroups';
import { useTheme } from '../../components/theme/ThemeContext';
import { fetchUserGroups } from "../../api/authService";
import { useAuth } from '../../context/AuthContext';
import { fetchAvailableGroupsByTeam } from '../../api/authService';

const HomePage = () => {
  const { darkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();  // burada user'ı alıyoruz
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const [newGroups, setNewGroups] = useState<any[]>([]);
  const [loadingNewGroups, setLoadingNewGroups] = useState(false);
  const [newGroupsLoading, setNewGroupsLoading] = useState(false);


  useEffect(() => {
    if (user?.teamId) {
      setLoadingNewGroups(true);
      fetchAvailableGroupsByTeam(user.teamId)
        .then(data => setNewGroups(data))
        .catch(console.error)
        .finally(() => setLoadingNewGroups(false));
    }
  }, [user?.teamId]);


  useEffect(() => {
    fetchUserGroups()
      .then(data => {
        console.log("Kullanıcının grupları:", data);
        setGroups(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLeaveGroup = (leftGroupId: number) => {
    setGroups(prevGroups => prevGroups.filter(g => g.GroupID !== leftGroupId));
  };

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

        <div className='homePage-container-right' style={{ transition: 'padding-left 0.3s ease' }}>
          <Navbar />

          <div className={darkMode ? 'dark-mode' : 'light-mode'}>
            <div className='joinedGroups'>
              <p className='inter'>Katıldıgın Gruplar</p>
            </div>
          </div>

          <div className="mygroup-scroll-container">
            <div className="mygroup-card-container">
              {loading ? (
                <p>Yükleniyor...</p>
              ) : groups.length === 0 ? (
                <p>Henüz katıldığın grup yok.</p>
              ) : (
                groups.map(group => (
                  <div className="mygroup-card-item" key={group.GroupID}>
                    <MyGroup group={group} onLeave={handleLeaveGroup} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={darkMode ? 'dark-mode' : 'light-mode'}>
            <div className='joinedGroups'>
              <p className='inter'>Yeni Grupları Keşfet</p>
            </div>
          </div>

          <div className="newgroups-scroll-container">
            <div className="newgroups-card-container">
              {newGroupsLoading ? (
                <p>Yeni gruplar yükleniyor...</p>
              ) : newGroups.length === 0 ? (
                <p>Yeni grup yok.</p>
              ) : (
                newGroups.map(group => (

                  <div className="mygroup-card-item" key={group.GroupID}>
                    <NewGroups key={group.GroupID} group={group} />
                  </div>

                  
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
