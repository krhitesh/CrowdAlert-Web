import { FETCH_UPVOTES_SUCCESS } from './actionTypes';
import { fetchUpvotesStart } from './actions';

const upvoteMiddleware = store => next => (action) => {
  if (action.type === FETCH_UPVOTES_SUCCESS) {
    const state = store.getState();
    if (state.upvotes.longpoll) {
      const { uuid, count } = action.payload.response;
      // console.log(action.payload);
      if (count !== null) {
        store.dispatch(fetchUpvotesStart(uuid, count, false));
      } else {
        store.dispatch(fetchUpvotesStart(uuid, 0, false));
      }
    }
  }
  next(action);
};

export default upvoteMiddleware;