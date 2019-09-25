import React from 'react';
import { Card, Item, Image, Dimmer, Loader } from 'semantic-ui-react';
import propTypes from 'prop-types';
import paragraph from './paragraph.png';
import styleSheet from './style';

/**
 * [LoaderCard A card component with a circlular loader, placeholder for a
 * detailed card component, which requires data to be fetched asynchonously]
 * @param {Object} props
 */
const LoaderCard = props => (
  <Card style={styleSheet.cardContainer} data-test="component-loading-card">
    <Item.Content>
      <Item.Description>
        <Image src={paragraph} data-test="component-image" />
        <Dimmer active={props.loading} inverted data-test="component-dimmer">
          <Loader data-test="component-loader" />
        </Dimmer>
      </Item.Description>
    </Item.Content>
  </Card>
);
LoaderCard.propTypes = {
  /* Boolean representing whether the card should show the spinner or not */
  loading: propTypes.bool.isRequired,
};
export default LoaderCard;
