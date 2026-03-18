// JWT is now managed via httpOnly cookie sent automatically by the browser.
// This function returns an empty object for backward compatibility with
// service files that still call authHeader().
export default function authHeader() {
    return {};
  }
