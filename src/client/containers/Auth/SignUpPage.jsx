import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Grid, Segment, Header, Image, Button, Responsive, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import meerkat from '../../meerkat.svg';
import { setBottomBarVisibility, removeBottomBarVisibility } from '../../components/Sidebar/actions';
import SignUpForm from './SignUpform';
import style from './styles';
import OAuth from './OAuth';
import getWidth from '../../utils/width';
import { DOMAIN_NAME } from '../../utils/apipaths';
import SEO from '../../components/SEO';

const isBrowser = () => typeof window !== 'undefined';
const getWidth = () => {
  if (isBrowser()) return window.innerWidth;
  return Infinity;
};

class LoginPage extends Component {
  componentDidMount() {
    this.props.removeBottomBarVisibility();
  }
  componentWillUnmount() {
    this.props.setBottomBarVisibility();
  }
  // eslint-disable-next-line class-methods-use-this
  head() {
    return (
      <SEO
        title="Sign Up | CrowdAlert"
        url={`${DOMAIN_NAME}/signup`}
        description="Sign Up for CrowdAlert."
      />
    );
  }
  render() {
    return (
      <Container>
        <Responsive fireOnMount getWidth={getWidth} minWidth={900}>
          <Grid columns={3} stackable verticalAlign="middle" centered>
            <Grid.Row>
              <Grid.Column width={3} />
              <Grid.Column width={10}>
                <Grid columns={2} style={{ padding: '1.4rem' }}>
                  <Grid.Row stretched>
                    <Grid.Column width={7} style={style.meerkatImage} />
                    <Grid.Column width={9}>
                      <Segment.Group style={{ marginLeft: '-1.2rem', marginRight: '-1.2rem' }}>
                        <Segment color="teal" textAlign="center" style={{ minHeight: '10vh' }}>
                          <Header as="h3">CrowdAlert</Header>
                        </Segment>
                        <Segment>
                          <SignUpForm data-test="component-signup-form" />
                        </Segment>
                        <Segment secondary attached basic style={{ minHeight: '20vh' }}>
                          <OAuth data-test="component-oauth" />
                        </Segment>
                      </Segment.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
              <Grid.Column width={3} />
            </Grid.Row>
          </Grid>
        </Responsive>
        <Responsive fireOnMount getWidth={getWidth} maxWidth={900}>
          <Grid style={{ padding: '1.4rem' }}>
            <Grid.Row>
              <Grid.Column>
                <Segment.Group style={{ marginLeft: '-1.2rem', marginRight: '-1.2rem' }}>
                  <Segment color="teal" textAlign="center" style={{ padding: '2vh' }}>
                    <Image src={meerkat} size="small" circular bordered centered />
                    <Header as="h3">CrowdAlert</Header>
                  </Segment>
                  <Segment>
                    <SignUpForm data-test="res-signup-form" />
                  </Segment>
                  <Segment secondary attached basic style={{ padding: '2vh' }}>
                    <Link to="/login" data-test="link-login">
                      <Button secondary fluid basic>
                        Login
                      </Button>
                    </Link>
                    <Divider horizontal>Or</Divider>
                    <OAuth data-test="res-component-oauth" />
                  </Segment>
                </Segment.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Responsive>
      </Container>
    );
  }
}

LoginPage.propTypes = {
  removeBottomBarVisibility: PropTypes.func.isRequired,
  setBottomBarVisibility: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    removeBottomBarVisibility,
    setBottomBarVisibility,
  }, dispatch)
);

export default {
  component: connect(null, mapDispatchToProps)(LoginPage),
};
