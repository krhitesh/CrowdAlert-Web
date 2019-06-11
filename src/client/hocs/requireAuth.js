/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default (ChildComponent) => {
  class RequireAuth extends Component {
    render() {
      if (!this.props.isLoggedIn) {
        return <Redirect to="/login/" />;
      }

      return <ChildComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    const { isLoggedIn } = state.auth;
    return {
      isLoggedIn,
    };
  };

  return connect(mapStateToProps)(RequireAuth);
};
