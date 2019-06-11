import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Route, withRouter, Redirect, Switch } from 'react-router-dom';
import MapTab from './mapstab';
import FormTab from './formtab';
import ImageTab from './imagestab';
import requireAuth from '../../hocs/requireAuth';

const CreateEvent = (props) => {
  return (
    <Container style={{ paddingBottom: '16vh' }} data-test="component-create-event">
      <br />
      <Switch>
        <Route path={`${props.match.path}/location`} component={MapTab} data-test="maptab-route" />
        <Route path={`${props.match.path}/details`} component={FormTab} data-test="formtab-route" />
        <Route path={`${props.match.path}/images`} component={ImageTab} data-test="imagetab-route" />
        <Route render={() => (<Redirect to={`${props.match.path}/location`} />)} />
      </Switch>
    </Container>
  );
};


const mapStateToProps = state => ({
  tabs: state.createEvents.tabs,
});

export default {
  component: withRouter(connect(mapStateToProps)(requireAuth(CreateEvent))),
};
