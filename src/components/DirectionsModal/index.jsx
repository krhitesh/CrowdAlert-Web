/* global document */
import React from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'semantic-ui-react';

/**
* [Directions Directions component for showing the step by step
* directions to the user to reach the destination.]
*
* @param {[type]} props [description]
*/
const DirectionsModal = (props) => {
  const { htmlInstructions } = props;
  return (
    <Modal
      basic
      size="small"
      trigger={props.children}
      header="Directions"
      content={
        htmlInstructions.map(instruction => <p dangerouslySetInnerHTML={{ __html: instruction }} />)
      }
      actions={[{ key: 'done', content: 'Got it', positive: true }]}
    />

  );
};
DirectionsModal.propTypes = {
  /* HTML instructions for a given polyline  */
  htmlInstructions: PropTypes.arrayOf(PropTypes.string),
  /* Should be a single element which triggers the modal */
  children: PropTypes.element.isRequired,
};
DirectionsModal.defaultProps = {
  htmlInstructions: ['No directions available'],
};
export default DirectionsModal;
