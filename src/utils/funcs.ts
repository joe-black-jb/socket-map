export const getJwtFromCookie = () => {
  const jwtFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  return jwtFromCookie;
};

export const clearJwtFromCookie = () => {
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

export const checkLoggedIn = (): boolean => {
  const jwt = getJwtFromCookie();
  if (jwt) {
    return true;
  }
  return false;
};
