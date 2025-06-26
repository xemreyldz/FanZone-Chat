export const saveToken = (token: string) => {
  localStorage.setItem('userToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};

export const removeToken = () => {
  localStorage.removeItem('userToken');
};
