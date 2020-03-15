import React, {useState, useEffect, useReducer} from 'react';
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

const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({data: {stories: initialStories}});
      // reject('Error');
    }, 2000);
  });

const useSemiPersistentState = (key, initValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;

    case 'REMOVE_STORY':
      return state.filter(story => story.objectID !== action.payload.objectID);

    default:
      throw new Error();
  }
};

const initialStateCount = {count: 0};
const countReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {count: state.count + 1};

    case 'DECREMENT':
      return {count: state.count - 1};

    default:
      throw new Error();
  }
};

const App = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [countState, dispatchCount] = useReducer(
    countReducer,
    initialStateCount
  );

  useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then(result => {
        dispatchStories({type: 'SET_STORIES', payload: result.data.stories});
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleRemoveItem = item => {
    dispatchStories({type: 'REMOVE_STORY', payload: item});
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderedStories = () => {
    if (isError) {
      return <Error />;
    }
    if (isLoading) {
      return <Loading />;
    }

    return <List list={searchedStories} onRemoveItem={handleRemoveItem} />;
  };

  return (
    <div className="container mt-2">
      <AppHeader />

      <p>
        <strong>Count: {countState.count}</strong>
      </p>
      <button onClick={() => dispatchCount({type: 'INCREMENT'})}>
        Increment
      </button>
      <button onClick={() => dispatchCount({type: 'DECREMENT'})}>
        Decrement
      </button>

      <InputLabel
        id="search"
        label="Search"
        value={searchTerm}
        onInputChange={handleSearch}
      />

      <Separator />

      {renderedStories()}
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
  label,
  isFocused = false,
  onInputChange,
}) => {
  const inputRef = React.useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="form-control">
      <label htmlFor={id}>
        <Text>{label}</Text>
      </label>
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
    <div className="paper p-2 mb-2 flex flex-1 justify-space-between align-items-center">
      <div>
        <span className="paper-title no-margin">
          <a href={item.url}>{item.title}</a>
        </span>
        <span className="text-muted">
          author: <span className="semibold">{item.author}</span>
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
        Dismiss
      </button>
    </div>
  </div>
);

export default App;
