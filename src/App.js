import React, {useState, useEffect} from 'react';
import './App.css';
import './FlexboxGrid.css';

const appInfo = {
  title: 'HackerStories',
  subtitle: 'Hack Your Life and Make it Better!',
  createdYear: 2018,
};

const App = () => {
  const stories = [
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

  console.log('render');

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem('search') || 'react'
  );

  useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-2">
      <AppHeader />
      <Search search={searchTerm} onSearch={handleSearch} />
      <Separator />
      <List list={searchedStories} />
    </div>
  );
};

const Separator = () => <hr className="separator" />;

const AppHeader = () => (
  <div>
    <h1>{appInfo.title}</h1>
    <h3 className="nobold">{appInfo.subtitle}</h3>
  </div>
);

const Search = props => (
  <div className="form-control">
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      className="text-input full-width"
      value={props.search}
      onChange={props.onSearch}
    />
  </div>
);

const List = props =>
  props.list.map(item => <Item key={item.objectID} item={item} />);

const Item = ({item}) => (
  <div className="paper p-2 mb-2 flex justify-space-between align-items-center">
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
);
export default App;
