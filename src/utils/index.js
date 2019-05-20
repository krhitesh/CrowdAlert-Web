/* eslint-disable import/prefer-default-export */
/* eslint-disable no-plusplus */
export const getCookie = (cookie, cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};
