/**
 * Utility to decode JWT tokens and check expiry
 */

export interface JWTPayload {
  user_id: number | string;
  exp: number;
  iat?: number;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const decoded = JSON.parse(atob(parts[1]));
    return decoded as JWTPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload) {
    return true;
  }

  // exp is in seconds, convert to milliseconds
  const expiryTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expiryTime;
};

export const getTokenExpiryTime = (token: string): number | null => {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return payload.exp * 1000; // Convert to milliseconds
};
