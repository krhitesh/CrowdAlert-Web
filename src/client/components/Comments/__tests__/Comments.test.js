import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
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
  test('does not throw warning with expected props', () => {
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
      }
    };
    checkProps(CommentsSection, expectedProps);
  });

  describe('renders zero comments without error', () => {
    describe('renders loader without error', () => {
      const wrapper = setup(
        { threadId: '' },
        { comment: '' },
      );
  
      test('renders loading without error', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section-loading').length).toBe(1);
      });
      
      test('does not render comments', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section').length).toBe(0);
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
              photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png'
            }
          }
        }
      );

      test('does not render loading', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section-loading').length).toBe(0);
      });
  
      test('does render nothing here', () => {
        expect(findByTestAttr(wrapper, 'jsx-nothing-here').length).toBe(1);
      });
  
      test('does not render errors block', () => {
        expect(findByTestAttr(wrapper, 'jsx-error-block').length).toBe(0);
      });
    
      test('render comments section', () => {
        expect(findByTestAttr(wrapper, 'component-comments-section').length).toBe(1);
      });
  
      test('renders user image without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-user-image').length).toBe(1);
      });
  
      test('renders post comment button without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-btn-responsive').length).toBe(2);
      });
  
      test('renders comment input field without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-comment-input').length).toBe(1);
      });
  
      test('renders comment group', () => {
        expect(findByTestAttr(wrapper, 'jsx-comments-group').length).toBe(1);
      });
  
      test('renders comments without error', () => {
        expect(findByTestAttr(wrapper, 'jsx-comment').length).toBe(0);
      });

      test('renders upvotes without error', () => {
        expect(findByTestAttr(wrapper, 'component-upvote').length).toBe(0);
      });

      test('renders upvotes without error', () => {
        expect(findByTestAttr(wrapper, 'component-spamreport-flag').length).toBe(0);
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
            photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png'
          }
        }
      }
    );

    test('does not render loading', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section-loading').length).toBe(0);
    });

    test('render errors block', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-block').length).toBe(1);
    });

    test('render error message', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-msg').dive().text()).toEqual('Error message');
    });
  });

  describe('renders non zero comments without error', () => {
    const comments = [];
    const userData = {};
    const count = Math.floor(Math.random()*20);
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
        photoURL: `https://assets2.razerzone.com/images/blade-15/logo-nvidia-geforce-rtx.png`,
      }
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
            photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png'
          }
        }
      }
    );

    test('does not render loading', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section-loading').length).toBe(0);
    });

    test('does not render nothing here', () => {
      expect(findByTestAttr(wrapper, 'jsx-nothing-here').length).toBe(0);
    });

    test('does not render errors block', () => {
      expect(findByTestAttr(wrapper, 'jsx-error-block').length).toBe(0);
    });
  
    test('render comments section', () => {
      expect(findByTestAttr(wrapper, 'component-comments-section').length).toBe(1);
    });

    test('renders user image without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-user-image').length).toBe(1);
    });

    test('renders post comment button without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-btn-responsive').length).toBe(2);
    });

    test('renders comment input field without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-comment-input').length).toBe(1);
    });

    test('renders comment group', () => {
      expect(findByTestAttr(wrapper, 'jsx-comments-group').length).toBe(1);
    });

    test('renders comments without error', () => {
      expect(findByTestAttr(wrapper, 'jsx-comment').length).toBe(count);
    });

    test('renders upvotes without error', () => {
      expect(findByTestAttr(wrapper, 'component-upvote').length).toBe(count);
    });

    test('renders upvotes without error', () => {
      expect(findByTestAttr(wrapper, 'component-spamreport-flag').length).toBe(count);
    });

  });
});

describe('redux props', () => {
  test('has redux piece of state', () => {
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
          photoURL: 'http://holdenc.altervista.org/avalanche/images/bitmap_seq1_108000000_500us.png'
        }
      }
    };

    const wrapper = setup(
      { threadId: '' },
      null,
      reduxPiece
    )
    const reduxProp = {
      comments: wrapper.instance().props.comments,
      auth: wrapper.instance().props.auth,
    }

    expect(reduxProp).toEqual(reduxPiece);
  });

  test('"fetchCommentsThread" action creator', () => {
    const wrapper = setup(
      { threadId: '' }
    );

    const fetchCommentsThreadProp = wrapper.instance().props.fetchCommentsThread;
    expect(fetchCommentsThreadProp).toBeInstanceOf(Function);
  });

  test('"fetchCommentsThreadCancel" action creator', () => {
    const wrapper = setup(
      { threadId: '' }
    );

    const fetchCommentsThreadCancelProp = wrapper.instance().props.fetchCommentsThreadCancel;
    expect(fetchCommentsThreadCancelProp).toBeInstanceOf(Function);
  });

  test('"postCommentToThread" action creator', () => {
    const wrapper = setup(
      { threadId: '' }
    );

    const postCommentToThreadProp = wrapper.instance().props.postCommentToThread;
    expect(postCommentToThreadProp).toBeInstanceOf(Function);
  });
});
