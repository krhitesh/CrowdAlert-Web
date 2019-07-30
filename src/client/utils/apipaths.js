/**
 * Contains API paths, which can be imported as required
 */
const DOMAIN_NAME = 'https://crowdalert.herokuapp.com';
const DOMAIN_NAME_TO_PROXY = 'http://0.0.0.0:8000';
const websocketURL = 'wss://crowdalert.herokuapp.com';
const WS_NAME_TO_PROXY = 'ws://0.0.0.0:8000';
// const DOMAIN_NAME = 'http://localhost:3000';
// const DOMAIN_NAME_TO_PROXY = 'http://localhost:8000';
// const websocketURL = 'ws://localhost:3000';
// const WS_NAME_TO_PROXY = 'ws://localhost:8000';
// const domainNameL = 'https://192.168.0.4:8000';
const domainNameL = DOMAIN_NAME;

/**
 * [GET_LOCATION_BY_IP: request to get approximate location information]
 * @type {String}
 */
const GET_LOCATION_BY_IP = `${DOMAIN_NAME}/api/location/get_location`;
/**
 * [GET_EVENT_BY_ID: Do GET request with event id as a url parameter]
 * @type {String}
 */
const GET_EVENT_BY_ID = `${domainNameL}/api/events/incident`;
/**
 * [GET_IMAGE_URLS Do GET request with image uuid to get the iamge urls]
 * @type {String}
 */
const GET_IMAGE_URLS = `${domainNameL}/api/images/image`;

const UPLOAD_IMAGES = `${domainNameL}/api/images/image`;
/**
 * [REVERSE_GEOCODE returns the reverse geocode for a given pair of coordinates
 * If accuracy=high, it uses google apis to reverse geocode]
 * @type {String}
 */
const REVERSE_GEOCODE = `${domainNameL}/api/location/reverse_geocode`;
/**
 * [GET_DIRECTIONS returns the Google maps direction API \
 * response for a given bi-pair of coordinates]
 * @type {String}
 */
const GET_DIRECTIONS = `${domainNameL}/api/location/get_directions`;
/**
 * [GET_EVENTS_BY_LOCATION returns a list of events for a given pair of
 * coordinates with a valid proximity]
 * @type {String}
 */
const GET_EVENTS_BY_LOCATION = `${domainNameL}/api/events/geteventsbylocation`;

/**
 * [GET_EVENTS_BY_LOCATION opens a socket connection for the
 * events app
 * coordinates with a valid proximity]
 * @type {String}
 */
const WS_GET_EVENTS_BY_LOCATION = `${websocketURL}/ws/events/geteventsbylocation`;

const STATIC_IMAGES = `${domainNameL}/static/images`;

const USER_PROFILES = `${domainNameL}/api/users/user`;

const WS_COMMENTS = `${websocketURL}/ws/comments`;

const COMMENTS = `${domainNameL}/api/comments/comment`;

const UPVOTE = `${domainNameL}/api/upvote/upvote`;

const SPAM_REPORT = `${domainNameL}/api/spam/report`;

const FCM_TOKEN = `${domainNameL}/api/notifications/register`;

export {
  GET_LOCATION_BY_IP,
  GET_EVENT_BY_ID,
  GET_IMAGE_URLS,
  REVERSE_GEOCODE,
  GET_DIRECTIONS,
  GET_EVENTS_BY_LOCATION,
  WS_GET_EVENTS_BY_LOCATION,
  UPLOAD_IMAGES,
  STATIC_IMAGES,
  USER_PROFILES,
  COMMENTS,
  WS_COMMENTS,
  UPVOTE,
  SPAM_REPORT,
  FCM_TOKEN,
  DOMAIN_NAME,
  DOMAIN_NAME_TO_PROXY,
  WS_NAME_TO_PROXY,
};
