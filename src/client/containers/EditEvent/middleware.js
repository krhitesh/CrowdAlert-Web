/* eslint-disable max-len */
/* eslint-disable consistent-return */
import formValidator from '../CreateEvent/validator';
import {
  changeTabEditEventsForm,
  changeTabValidationEditEventsForm,
  formValidationErrorsEditEvents,
  acceptFormEditEvents,
  submitFormEditEvents,
  updateEventDetailsEditEvents,
  keepOldEvent,
} from './actions';
import { updateOnClick } from '../../components/Map/actions';
import { fetchEventDataFinished } from '../Viewevent/actions';
import {
  EDIT_EVENTS_FORM_SAVE_LOCATION,
  EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT,
  EDIT_EVENTS_FORM_VALIDATE_FORM,
  EDIT_EVENTS_FORM_SUBMIT_SUCCESS,
  EDIT_EVENTS_FORM_SUBMIT,
} from './actionTypes';
import { EVENT_FETCH_EVENT_DATA_FINISHED } from '../Viewevent/actionTypes';

const editEventsMiddleware = store => next => (action) => {
  const { dispatch } = store;
  if (action.type === EVENT_FETCH_EVENT_DATA_FINISHED) {
    const { payload } = action;
    dispatch(keepOldEvent(action.payload));
    dispatch(updateOnClick(payload.location.coords.latitude, payload.location.coords.longitude));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'eventType', value: payload.category } }));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'title', value: payload.title } }));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'description', value: payload.description } }));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'public', checked: payload.public.view, type: 'checkbox' } }));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'help', checked: payload.local_assistance, type: 'checkbox' } }));
    dispatch(updateEventDetailsEditEvents({ target: { name: 'anonymous', checked: payload.reportedBy.original.anonymous || false, type: 'checkbox' } }));
  }
  if (action.type === EDIT_EVENTS_FORM_UPDATE_LOCATION_TEXT) {
    const state = store.getState();

    // Kill the action if form is freezed
    if (state.editEvents.form.isFreezed) {
      return null;
    }
  }
  if (action.type === EDIT_EVENTS_FORM_SAVE_LOCATION) {
    // Jump to event data tab
    dispatch(changeTabEditEventsForm(1));
    // Mark it as validated
    dispatch(changeTabValidationEditEventsForm('location', true));
  }
  if (action.type === EDIT_EVENTS_FORM_VALIDATE_FORM) {
    const state = store.getState();
    const status = formValidator(state.editEvents);
    const eventData = state.editEvents;
    if (!status.validationErrors) {
      // dispatch post request
      dispatch(acceptFormEditEvents());
      dispatch(submitFormEditEvents(eventData));
    } else {
      // dispatch error handler
      dispatch(formValidationErrorsEditEvents(status));
    }
  }
  if (action.type === EDIT_EVENTS_FORM_SUBMIT) {
    dispatch(fetchEventDataFinished({
      ...action.payload.all,
    }));
  }
  if (action.type === EDIT_EVENTS_FORM_SUBMIT_SUCCESS) {
    dispatch(changeTabValidationEditEventsForm('details', true));
    dispatch(changeTabEditEventsForm(2));
  }
  next(action);
};

export default editEventsMiddleware;
