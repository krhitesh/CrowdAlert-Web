export const GET_WIDTH_IS_MOBILE = 0;
const getWidth = () => {
  if (process.env.BROWSER) {
    return window.innerWidth;
  }
  const { isMobile } = process.env;
  if (isMobile) {
    return GET_WIDTH_IS_MOBILE;
  }
  return Infinity;
};

export default getWidth;
