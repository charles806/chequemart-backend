import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

/**
 * generateAccessToken
 * Creates a short-lived JWT access token.
 * @param {object} payload - { id, role }
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (payload) => {
  return sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

/**
 * generateRefreshToken
 * Creates a long-lived JWT refresh token.
 * @param {object} payload - { id, role }
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });
};

/**
 * verifyAccessToken
 * Verifies and decodes an access token.
 * @param {string} token - JWT access token
 * @returns {object} Decoded payload or throws error
 */
const verifyAccessToken = (token) => {
  return verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * verifyRefreshToken
 * Verifies and decodes a refresh token.
 * @param {string} token - JWT refresh token
 * @returns {object} Decoded payload or throws error
 */
const verifyRefreshToken = (token) => {
  return verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * setTokenCookies
 * Sends access and refresh tokens as secure HTTP-only cookies.
 * @param {object} res           - Express response object
 * @param {string} accessToken   - JWT access token
 * @param {string} refreshToken  - JWT refresh token
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Access token cookie — expires in 15 minutes
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });

  // Refresh token cookie — expires in 7 days
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

/**
 * clearTokenCookies
 * Clears auth cookies on logout.
 * @param {object} res - Express response object
 */
const clearTokenCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setTokenCookies,
  clearTokenCookies,
};
