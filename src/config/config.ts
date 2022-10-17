let BACKEND_URL: string | undefined;
if (process.env.NODE_ENV === 'production') {
  BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
} else {
  BACKEND_URL = process.env.REACT_APP_DEV_BACKEND_URL;
}
export { BACKEND_URL };
