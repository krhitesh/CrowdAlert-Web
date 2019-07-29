import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { findByTestAttr, storeFactory, checkProps } from '../../../tests/testUtils';
import CommentsSection from '../index';

Enzyme.configure({ adapter: new EnzymeAdapter() });

/**
 * @function setup
 * @param {object} state - State for this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}, state = null, initialReduxState = {}) => {
  const store = storeFactory(initialReduxState);
  const wrapper = shallow(<CommentsSection {...props} store={store} />).dive();
  if (state) wrapper.setState(state);
  return wrapper;
};

describe('render', () => {
  it('does not throw warning with expected props', () => {
    const expectedProps = {
      fetchCommentsThread: jest.fn(),
      postCommentToThread: jest.fn(),
      fetchCommentsThreadCancel: jest.fn(),
      threadId: '',
      comments: {
        comments: [],
        userData: {},
        loading: false,
        errors: false,
        message: null,
        threadId: '',
        commentsButtonLoading: false,
      },
      auth: {
        user: {},
      },
    };
    checkProps(CommentsSection, expectedProps);
  });

  describe('renders zero comments without error', () => {
    describe('renders loader without error', () => {
      const wrapper = setup(
        { threadId: '' },
        { comment: '' },
      );

      it('renders loading without error', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section-loading')).toHaveLength(1);
      });

      it('does not render comments', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section')).toHaveLength(0);
      });
    });

    describe('renders zero comments section without error', () => {
      const wrapper = setup(
        { threadId: '' },
        { comment: '' },
        {
          comments: {
            comments: [],
            userData: {},
            loading: false,
            errors: false,
            message: null,
            threadId: '',
            commentsButtonLoading: false,
          },
          auth: {
            user: {
              displayName: 'Me',
              photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png',
            },
          },
        },
      );

      it('does not render loading', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section-loading')).toHaveLength(0);
      });

      it('does render nothing here', () => {
        expect(findByTestAttr(wrapper, 'jsx-nothing-here')).toHaveLength(1);
      });

      it('does not render errors block', () => {
        expect(findByTestAttr(wrapper, 'jsx-error-block')).toHaveLength(0);
      });

      it('render comments section', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section')).toHaveLength(1);
      });

      it('renders user image without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-user-image')).toHaveLength(1);
      });

      it('renders post comment button without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-btn-responsive')).toHaveLength(2);
      });

      it('renders comment input field without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-comment-input')).toHaveLength(1);
      });

      it('renders comment group', () => {
        expect(findByTestAttr(wrapper, 'jsx-comments-group')).toHaveLength(1);
      });

      it('renders comments without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-comment')).toHaveLength(0);
      });

      it('renders upvotes without error', () => {
        expect(findByTestAttr(wrapper, 'component-upvote')).toHaveLength(0);
      });

      it('renders spam report flag without error', () => {
        expect(findByTestAttr(wrapper, 'component-spamreport-flag')).toHaveLength(0);
      });
    });
  });

  describe('renders zero comments and error block section without error', () => {
    const wrapper = setup(
      { threadId: '' },
      { comment: '' },
      {
        comments: {
          comments: [],
          userData: {},
          loading: false,
          errors: true,
          message: 'Error message',
          threadId: '',
          commentsButtonLoading: false,
        },
        auth: {
          user: {
            displayName: 'Me',
            photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png',
          },
        },
      },
    );

    it('does not render loading', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section-loading')).toHaveLength(0);
    });

    it('render errors block', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-block')).toHaveLength(1);
    });

    it('render error message', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-msg').dive().text()).toEqual('Error message');
    });
  });

  describe('renders non zero comments without error', () => {
    const comments = [];
    const userData = {};
    const count = Math.floor(Math.random() * 20);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < count; i++) {
      comments.push({
        key: `comment-key-${i}`,
        timestamp: new Date().getTime(),
        text: `comment-text-${i}`,
        spam: {},
        user: `user-${i}`,
      });

      userData[`user-${i}`] = {
        displayName: `John Doe ${i}`,
        photoURL: 'https://assets2.razerzone.com/images/blade-15/logo-nvidia-geforce-rtx.png',
      };
    }

    const wrapper = setup(
      { threadId: '' },
      { comment: '' },
      {
        comments: {
          comments,
          userData,
          loading: false,
          errors: false,
          message: null,
          threadId: '',
          commentsButtonLoading: false,
        },
        auth: {
          user: {
            displayName: 'Me',
            photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png',
          },
        },
      },
    );

    it('does not render loading', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section-loading')).toHaveLength(0);
    });

    it('does not render nothing here', () => {
      expect(findByTestAttr(wrapper, 'jsx-nothing-here')).toHaveLength(0);
    });

    it('does not render errors block', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-block')).toHaveLength(0);
    });

    it('render comments section', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section')).toHaveLength(1);
    });

    it('renders user image without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-user-image')).toHaveLength(1);
    });

    it('renders post comment button without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-btn-responsive')).toHaveLength(2);
    });

    it('renders comment input field without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-comment-input')).toHaveLength(1);
    });

    it('renders comment group', () => {
      expect(findByTestAttr(wrapper, 'jsx-comments-group')).toHaveLength(1);
    });

    it('renders comments without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-comment')).toHaveLength(count);
    });

    it('renders upvotes without error', () => {
      expect(findByTestAttr(wrapper, 'component-upvote')).toHaveLength(count);
    });

    it('renders spam report flag without error', () => {
      expect(findByTestAttr(wrapper, 'component-spamreport-flag')).toHaveLength(count);
    });
  });
});

describe('redux props', () => {
  it('has redux piece of state', () => {
    const reduxPiece = {
      comments: {
        comments: [],
        userData: {},
        loading: false,
        errors: true,
        message: 'Error message',
        threadId: '',
        commentsButtonLoading: false,
      },
      auth: {
        user: {
          displayName: 'Me',
          photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png',
        },
      },
    };

    const wrapper = setup(
      { threadId: '' },
      null,
      reduxPiece,
    );
    const reduxProp = {
      comments: wrapper.instance().props.comments,
      auth: wrapper.instance().props.auth,
    };

    expect(reduxProp).toEqual(reduxPiece);
  });

  it('"fetchCommentsThread" action creator', () => {
    const wrapper = setup({ threadId: '' });

    const fetchCommentsThreadProp = wrapper.instance().props.fetchCommentsThread;
    expect(fetchCommentsThreadProp).toBeInstanceOf(Function);
  });

  it('"fetchCommentsThreadCancel" action creator', () => {
    const wrapper = setup({ threadId: '' });

    const fetchCommentsThreadCancelProp = wrapper.instance().props.fetchCommentsThreadCancel;
    expect(fetchCommentsThreadCancelProp).toBeInstanceOf(Function);
  });

  it('"postCommentToThread" action creator', () => {
    const wrapper = setup({ threadId: '' });

    const postCommentToThreadProp = wrapper.instance().props.postCommentToThread;
    expect(postCommentToThreadProp).toBeInstanceOf(Function);
  });
});
