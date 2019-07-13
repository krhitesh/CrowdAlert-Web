export default () => {
  const google = {
    maps: {
      Point: class {}
    }
  }

  global.google = google;
};