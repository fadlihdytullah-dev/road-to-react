import React from 'react';
import axios from 'axios';
// This is first comment in VIM
import './App.css';
import './FlexboxGrid.css';
import styles from './CSSModule.module.css';
import cs from 'classnames';
import {ReactComponent as Check} from './check.svg';
import styled, {css} from 'styled-components';

/*
- Quit and Save and Quit
- Cursor navigation
- Delete current line
- Navigate to first and last
- Skip and prev block of code
- Use numbers at first command
- How to Undo and Redo
- Using dot to re-doing the same action
- Copy and paste
- Using delete command to copy paste 
- Delete lines for number of times
- Deleting lines using Visual
- Go to next/prev words
- Delete next words or prev words
- Go to specific line
- Move to the first word of line or very first (whitespace)
- Move next/prev words by ignore punctuation
- Go to first letter of words, and find
- Find match block, you could delete easily
*/

const getSizeMatcherStyles = size => {
  switch (size) {
    case 'normal':
      return css`
        font-size: 1.4rem;
        min-width: 12rem;
      `;

    case 'small':
      return css`
        min-width: 8rem;
        font-size: 1.2rem;
      `;

    default:
      throw new Error();
  }
};

const getVariantMatcherStyles = variant => {
  const variants = {
    default: css`
      background: #fff;
    `,

    secondary: css`
      background: #222;
      color: #fff;

      &:hover {
        background: #111;
      }
    `,
  };

  return variants[variant];
};

const Button = styled.button`
  ${props => {
    const size = props.size || 'normal';
    return getSizeMatcherStyles(size);
  }};

  ${props => {
    const variant = props.variant || 'default';
    return getVariantMatcherStyles(variant);
  }};

  padding: 1rem 0;
  text-align: center;
  display: inline-block;
  border-radius: 8px;
  font-weight: 500;
  outline: none;
  border: none;
  transition: 0.3s all;

  &:disabled,
  &[disabled] {
    background: #c7c7c7 !important;
  }
`;

const appInfo = {
  title: 'HackerStories',
  subtitle: 'Hack Your Life and Make it Better!',
  createdYear: 2018,
};

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    points: 4,
    num_comments: 3,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    points: 5,
    num_comments: 2,
    objectID: 1,
  },
  {
    title: 'Vue',
    url: 'https://vuejs.org/',
    author: 'Evan You',
    points: 9,
    num_comments: 4,
    objectID: 2,
  },
  {
    title: 'Gatsby',
    url: 'https://www.gatsbyjs.org/',
    author: 'Kyle Mathews',
    points: 6,
    num_comments: 2,
    objectID: 3,
  },
];

const getFormattedDate = value => {
  const date = new Date(value * 1000);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {stories: initialStories}});
      reject('Error');
    }, 2000);
  });

const useSemiPersistentState = (key, initValue) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initValue
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };

    case 'STORIES_FETCH_FAILURE':
      return {...state, isLoading: false, isError: true};

    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => story.objectID !== action.payload.objectID
        ),
      };

    default:
      throw new Error();
  }
};

const getSumComments = stories => {
  console.log('C');

  return stories.reduce((result, value) => result + value.num_comments, 0);
};

const API_ENDPOINT = 'http://hn.algolia.com/api/v1/search?query=';

const App = () => {
  console.log('B:App');

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const sumComments = React.useMemo(() => getSumComments(stories.data), [
    stories,
  ]);

  // This will be differ when the saerchTerm changed, run the side effect
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch (error) {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'});
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  const handleRemoveItem = React.useCallback(item => {
    dispatchStories({type: 'REMOVE_STORY', payload: item});
  }, []);

  return (
    <div className={styles.container}>
      <AppHeader />
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <p>My Hacker Stories with {sumComments} comments.</p>

      <Separator />
      {stories.isError && <Error />}
      {stories.isLoading && <Loading />}
      {!stories.isLoading && !stories.isError && (
        <List list={stories.data} onRemoveItem={handleRemoveItem} />
      )}
    </div>
  );
};

const Separator = () => <hr className="separator" />;

const AppHeader = React.memo(() => (
  <React.Fragment>
    <h1>{appInfo.title}</h1>
    <h3 className="nobold">{appInfo.subtitle}</h3>
  </React.Fragment>
));

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
  <form className="flex align-items-center" onSubmit={onSearchSubmit}>
    <div className="flex-1">
      <InputLabel
        id="search"
        value={searchTerm}
        onInputChange={onSearchInput}
      />
    </div>
    <div className="pl-2 align-self-center">
      <Button
        type="submit"
        disabled={!searchTerm}
        size="small"
        variant="secondary">
        Search
      </Button>
      {/* <button
          type="submit"
          disabled={!searchTerm}
          // className={`${styles.button} ${styles.small} ${styles.secondary}`}>
          className={cs(styles.button, styles.small, styles.secondary)}>
          Search
        </button> */}
    </div>
  </form>
);

const Loading = () => <p className="text-muted">Loading ...</p>;

const Error = () => <h2>Oops, something went wrong.</h2>;

const EmptyData = () => <p>Sorry, there is no data.</p>;

const InputLabel = ({
  id,
  value,
  type = 'text',
  label = '',
  isFocused = false,
  onInputChange,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="form-control">
      {label && (
        <label htmlFor={id}>
          <Text>{label}</Text>
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type={type}
        className="text-input full-width"
        value={value}
        onChange={onInputChange}
      />
    </div>
  );
};

const Text = ({children}) => <span>{children}</span>;

const List = React.memo(({list, onRemoveItem}) => {
  console.log('B:List');

  if (!list.length) {
    return <EmptyData />;
  }

  return list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));
});

// Using PureComponent
/*
class List extends React.PureComponent {
  render() {
    if (!this.props.list.length) {
      return <EmptyData />;
    }

    return this.props.list.map(item => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={this.props.onRemoveItem}
      />
    ));
  }
}
*/

const Item = ({item, onRemoveItem}) => (
  <div className="flex">
    <div className="paper p-3 mb-2 flex flex-1 justify-space-between align-items-center">
      <div className="max-width-80">
        <span className="text-lg block mb-1">
          <a href={item.url}>{item.title}</a>
        </span>
        <span className="text-muted block">
          by: <span className="semibold">{item.author}</span>
          <span className="text-muted ml-1">
            {getFormattedDate(item.created_at_i)}
          </span>
        </span>
      </div>

      <div className="flex text-muted">
        <div className="flex align-items-center mr-2">
          <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
          <span>{item.num_comments}</span>
        </div>

        <div className="flex align-items-center">
          <ion-icon name="star-outline"></ion-icon>
          <span>{item.points}</span>
        </div>
      </div>
    </div>

    <div className="pl-2  align-self-center">
      <button className="button small link" onClick={() => onRemoveItem(item)}>
        <Check height="18" width="18" />
      </button>
    </div>
  </div>
);

export default App;
export {InputLabel, SearchForm, List, Item};
