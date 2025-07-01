import axiosClient from './axiosClient';


//Giriş İşlemi
export const loginUser = async (username: string, password: string) => {
  const response = await axiosClient.post('/login', { username, password });
  return response.data;
};

export const logoutUser = async (userId: number) => {
  const response = await axiosClient.post('/logout', { userId });
  return response.data;
};

// Kayıt işlemi
export const registerUser = async (values: {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  teamID: number;
  kosullariKabul: boolean;
  saygiliIletisim: boolean;
}) => {
  const response = await axiosClient.post('/register', values);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosClient.post('/forgot-password/request-password-reset', { email });
  return response.data;
};

export const fetchGroups = async () => {
  const response = await axiosClient.get('/groups');
  return response.data;
};

export const fetchUserGroups = async () => {
  const response = await axiosClient.get('/groups/user');
  return response.data;
};

export const fetchMessagesByGroupId = async (groupId: number) => {
  const response = await axiosClient.get(`/messages/${groupId}`);
  return response.data;  // Burada mesajlar array olarak dönmeli
};





export const fetchLastMessagesForAllGroups = async () => {
  const response = await axiosClient.get('/messages/last/all');
  return response.data;
};

export const createGroup = async (formData: FormData) => {
  const response = await axiosClient.post('/addgroup', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; // örnek: { filePath: "/uploads/abc.jpg" }
};


export const fetchGroupMembers = async (groupId: number) => {
  const response = await axiosClient.get(`/getgroupmembers/${groupId}/members`);
  return response.data;
};

export const leaveGroup = async (groupId: number) => {
  const response = await axiosClient.delete(`/groups/${groupId}/leave`);
  return response.data;
};

export const fetchAvailableGroupsByTeam = async (teamId: number) => {
  const response = await axiosClient.get(`/groups/available-by-team?teamId=${teamId}`);
  return response.data; // buradan gruplar gelir
};

export const joinGroup = async (groupId: number) => {
  const response = await axiosClient.post(`/groups/${groupId}/join`);
  return response.data;
};

// Kullanıcı bilgilerini getir
export const fetchUserInfo = async () => {
  const response = await axiosClient.get('/userinfo/user/me');
  return response.data; // backend’den dönen kullanıcı objesi
};

// Kullanıcı bilgilerini güncelle
export const updateUserInfo = async (formData: FormData) => {
  const response = await axiosClient.put('/updateuser/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axiosClient.put('/user/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};


export const deleteAccount = async () => {
  const response = await axiosClient.delete('/user/delete-account');
  return response.data;
};


// Varsayılan tema
export const getDefaultTheme = async () => {
  const response = await axiosClient.get('/themes/default');
  return response.data;
};

// Takım teması (token'dan teamId backend'de alınıyor)
export const getTeamTheme = async () => {
  try {
    const response = await axiosClient.get('/themes/team');
    return response.data;
  } catch (error) {
    console.error('Takım teması alınırken hata:', error);
    return null;
  }
};


export const searchUsers = async (query: string) => {
  const response = await axiosClient.get('/users/search', {
    params: { query } // teamId backend’den token ile alınıyor artık
  });
  return response.data;
}

// Yeni: Belirli kullanıcıyı gruba davet et
export const inviteUserToGroup = async (userId: number, groupId: number) => {
  return axiosClient.post('/users/invite', { userId, groupId });
};

export const getNotifications = async () => {
  const response = await axiosClient.get('/notifications');
  return response.data;
};

export const acceptInvitation = async (groupId: number, notificationId: number) => {
  const response = await axiosClient.post('/notifications/accept-invitation', {
    groupId,
    notificationId,
  });
  return response.data;
};

export const ignoreNotification = async (notificationId: number, groupId: number) => {
  const response = await axiosClient.post('/notifications/ignore', {
    notificationId,
    groupId,
  });
  return response.data;
};