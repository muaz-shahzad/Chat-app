// Utility function to get a non-HttpOnly cookie
export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  // Usage in a React component
  const token = getCookie('token');
  console.log("Token from cookie:", token);
  