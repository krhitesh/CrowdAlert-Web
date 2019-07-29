import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import SpamReportModal from '../modal';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const defaultProps = {
  errors: false,
  message: 'Empty message',
};

const reduxPiece = {
  spam: {
    ...defaultProps,
    modal: {
      open: true,
    },
  },
};

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const setupProps = { ...defaultProps, ...props };
  const wrapper = shallow(<SpamReportModal {...setupProps} store={store} />);
  return wrapper;
};

test('does not warn with expected props', () => {
  const expectedProps = {
    ...defaultProps,
    modal: {
      open: true,
    },
    reportSpamModalClose: jest.fn(),
  };

  checkProps(SpamReportModal, expectedProps);
});

describe('render', () => {
  describe('open modal', () => {
    it('renders without error', () => {
      const wrapper = setup({}, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-spamreportmodal')).toHaveLength(1);
    });

    it('renders header without error', () => {
      const wrapper = setup({}, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'component-header')).toHaveLength(1);
    });

    it('renders content without error', () => {
      const wrapper = setup({}, reduxPiece).dive();
      expect(findByTestAttr(wrapper, 'modal-content')).toHaveLength(1);
    });

    describe('renders without error', () => {
      it('renders action without error', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'modal-actions')).toHaveLength(1);
      });

      it('renders without error', () => {
        const wrapper = setup({}, reduxPiece).dive();
        expect(findByTestAttr(wrapper, 'modal-action-btn')).toHaveLength(1);
      });
    });
  });
});

describe('redux props', () => {
  it('has redux piece of state', () => {
    const wrapper = setup({}, reduxPiece);
    const { modal, errors, message } = wrapper.props();
    const reduxProps = {
      spam: {
        modal,
        errors,
        message,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"reportSpamModalClose" action creator', () => {
    const wrapper = setup({}, reduxPiece);
    const reportSpamModalCloseProps = wrapper.props().reportSpamModalClose;
    expect(reportSpamModalCloseProps).toBeInstanceOf(Function);
  });
});
