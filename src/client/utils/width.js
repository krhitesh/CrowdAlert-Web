const getWidth = () => {
  if (process.env.BROWSER) {
    return window.innerWidth;
  }
  const { isMobile } = process.env;
  if (isMobile) {
    return 0;
  }
  return Infinity;
};

export default getWidth;
