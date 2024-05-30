export function decodeJWT(token) {
    if (!token) {
      console.error("No token provided");
      return null;
    }
  
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error("Invalid token format: Token should have three parts");
      return null;
    }
  
    try {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  }
  