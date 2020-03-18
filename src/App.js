import React from 'react';
import axios from 'axios';
// This is first comment in VIM
import './App.css';
import './FlexboxGrid.css';
import styles from './CSSModule.module.css';
import Separator from './components/shared/Separator';
import Error from './components/shared/Error';
import Loading from './components/shared/Loading';
import List from './components/List';
import SearchForm from './components/SearchForm';

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

const AppHeader = React.memo(() => (
  <React.Fragment>
    <h1>{appInfo.title}</h1>
    <h3 className="nobold">{appInfo.subtitle}</h3>
  </React.Fragment>
));

export default App;
