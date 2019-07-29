import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import {
  findByTestAttr,
  storeFactory,
  checkProps,
} from '../../../tests/testUtils';
import ImagesTab from '../imagestab';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const reduxPiece = {
  createEvents: {
    tabs: {},
    details: {
      help: true,
      public: false,
      title: 'title',
      eventType: {},
      anonymous: false,
      description: 'description',
    },
    form: {
      eventID: '',
      imageSelectDisabled: false,
      uploading: false,
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
  const wrapper = shallow(<ImagesTab {...props} store={store} />);
  return wrapper;
};

test('does not throw warning with expected props', () => {
  const expectedProps = {
    tabs: reduxPiece.createEvents.tabs,
    details: reduxPiece.createEvents.details,
    reportForm: reduxPiece.createEvents.form,
    toggleImageUpload: jest.fn(),
  };

  checkProps(ImagesTab, expectedProps);
});

describe('render test', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece).dive();
  });

  it('renders without error', () => {
    expect(findByTestAttr(wrapper, 'component-imagestab')).toHaveLength(1);
  });

  it('renders camera modal without error', () => {
    expect(findByTestAttr(wrapper, 'camera-modal')).toHaveLength(1);
  });

  it('renders dropzone without error', () => {
    expect(findByTestAttr(wrapper, 'dropzone')).toHaveLength(1);
  });

  it('renders upload from device button without error', () => {
    expect(findByTestAttr(wrapper, 'btn-upload-from-device')).toHaveLength(1);
  });

  it('renders image group without error', () => {
    expect(findByTestAttr(wrapper, 'image-group')).toHaveLength(1);
  });

  it('renders upload progress without error', () => {
    const rp = reduxPiece;
    rp.createEvents.form.uploading = true;
    // eslint-disable-next-line no-shadow
    const wrapper = setup({}, rp).dive();
    expect(findByTestAttr(wrapper, 'upload-progress')).toHaveLength(1);
  });

  it('renders action buttons', () => {
    wrapper.setState({
      images: [
        {
          base64: 'base64 string',
          key: 'key',
          isVerified: true,
          isUploaded: true,
        },
      ],
    });

    expect(findByTestAttr(wrapper, 'action-btns')).toHaveLength(1);
  });
});

describe('redux props', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({}, reduxPiece);
  });

  it('has redux piece of state', () => {
    const reduxProps = {
      createEvents: {
        tabs: wrapper.props().tabs,
        details: wrapper.props().details,
        form: wrapper.props().reportForm,
      },
    };

    expect(reduxProps).toEqual(reduxPiece);
  });

  it('"toggleImageUpload" action creator', () => {
    const toggleImageUploadProps = wrapper.props().toggleImageUpload;
    expect(toggleImageUploadProps).toBeInstanceOf(Function);
  });
});
