import React from 'react';
import './App.css';
import './FlexboxGrid.css';

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
  const date = new Date(value);
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
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initValue
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
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

const API_ENDPOINT = 'http://hn.algolia.com/api/v1/search?query=';

const App = () => {
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  // This will be differ when the saerchTerm changed, run the side effect
  const handleFetchStories = React.useCallback(() => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});

    fetch(url)
      .then(response => response.json())
      .then(result => {
        dispatchStories({type: 'STORIES_FETCH_SUCCESS', payload: result.hits});
      })
      .catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  const handleRemoveItem = item => {
    dispatchStories({type: 'REMOVE_STORY', payload: item});
  };

  return (
    <div className="container mt-2">
      <AppHeader />
      <div className="flex align-items-center">
        <div className="flex-1">
          <InputLabel
            id="search"
            value={searchTerm}
            onInputChange={handleSearchInput}
          />
        </div>
        <div className="pl-2">
          <button
            disabled={!searchTerm}
            className="button small secondary align-self-center"
            onClick={handleSearchSubmit}>
            Search
          </button>
        </div>
      </div>

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

const AppHeader = () => (
  <React.Fragment>
    <h1>{appInfo.title}</h1>
    <h3 className="nobold">{appInfo.subtitle}</h3>
  </React.Fragment>
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

const List = ({list, onRemoveItem}) => {
  if (!list.length) {
    return <EmptyData />;
  }

  return list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));
};

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
        <ion-icon name="trash-outline"></ion-icon>
      </button>
    </div>
  </div>
);

export default App;
