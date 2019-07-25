import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import {
  findByTestAttr,
  storeFactory,
  checkProps
} from "../../../tests/testUtils";
import ImagesTab from "../imagestab";

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
			description: 'description'
		},
		form: {
            eventID: '',
            imageSelectDisabled: false,
            uploading: false,
		}
  }
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
        toggleImageUpload: jest.fn()
    };

    checkProps(ImagesTab, expectedProps);
});

describe('render test', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece).dive();
    });

    test('renders without error', () => {
        expect(findByTestAttr(wrapper, 'component-imagestab').length).toBe(1);
    });

    test('renders camera modal without error', () => {
        expect(findByTestAttr(wrapper, 'camera-modal').length).toBe(1);
    });

    test('renders dropzone without error', () => {
        expect(findByTestAttr(wrapper, 'dropzone').length).toBe(1);
    });

    test('renders upload from device button without error', () => {
        expect(findByTestAttr(wrapper, 'btn-upload-from-device').length).toBe(1);
    });

    test('renders image group without error', () => {
        expect(findByTestAttr(wrapper, 'image-group').length).toBe(1);
    });

    test('renders upload progress without error', () => {
        let rp = reduxPiece;
        rp.createEvents.form.uploading = true;
        const wrapper = setup({}, rp).dive();
        expect(findByTestAttr(wrapper, 'upload-progress').length).toBe(1);
    });

    test('renders action buttons', () => {
        wrapper.setState({
            images: [
                {
                    base64: 'base64 string',
                    key: 'key',
                    isVerified: true,
                    isUploaded: true
                }
            ]
        });

        expect(findByTestAttr(wrapper, 'action-btns').length).toBe(1);
    });
});

describe('redux props', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({}, reduxPiece);
    });

    test('has redux piece of state', () => {
        const reduxProps = {
            createEvents: {
                tabs: wrapper.props().tabs,
                details: wrapper.props().details,
                form: wrapper.props().reportForm
            }
        };

        expect(reduxProps).toEqual(reduxPiece);
    });

    test('"toggleImageUpload" action creator', () => {
        const toggleImageUploadProps = wrapper.props().toggleImageUpload;
        expect(toggleImageUploadProps).toBeInstanceOf(Function);
    });
});
