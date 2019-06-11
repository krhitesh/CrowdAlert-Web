const getWidth = () => {
  if (process.env.BROWSER) {
    return window.innerWidth;
  }
  return Infinity;
};

export default getWidth;
