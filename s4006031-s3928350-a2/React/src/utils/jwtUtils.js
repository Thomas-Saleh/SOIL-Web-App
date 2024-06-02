export function decodeJWT(token) {
  // Check if a token is provided
  if (!token) {
    console.error("No token provided");
    return null;
  }

  // Split the token into its parts
  const parts = token.split('.');
  // Check if the token has three parts
  if (parts.length !== 3) {
    console.error("Invalid token format: Token should have three parts");
    return null;
  }

  try {
    // Decode the base64Url part of the token
    const base64Url = parts[1];
    // Convert base64Url to base64 format
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64 and convert to JSON format
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // Parse the JSON payload and return
    return JSON.parse(jsonPayload);
  } catch (error) {
    // Log any decoding errors
    console.error("Failed to decode JWT:", error);
    return null;
  }
}
