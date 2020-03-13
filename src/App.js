import React from 'react';
import './App.css';
import './FlexboxGrid.css';

const appInfo = {
  title: 'HackerStories',
  subtitle: 'Hack Your Life and Make it Better!',
  createdYear: 2018,
};

const topics = [
  'JavaScript',
  'React',
  'Node',
  'Vue',
  'Gatsby',
  'NextJS',
  'CSS',
];

function getCurrentYear() {
  return new Date().getFullYear;
}

function App() {
  return (
    <div className="wrap container-fluid mt-2">
      <h1>{appInfo.title}</h1>
      <h3 className="nobold">{appInfo.subtitle}</h3>

      <div className="form-control">
        <label htmlFor="search">Search: </label>
        <input id="search" type="text" className="text-input" />
      </div>

      <section id="topics" className="mb-4">
        <h3 className="mb-2">Topics</h3>
        {topics.map(topic => (
          <span key={topic} className="inline-block p-1">
            <span className="border border-rounded p-1">{topic}</span>
          </span>
        ))}
      </section>

      <footer>
        <p>
          This project created at {appInfo.createdYear} and now{' '}
          {getCurrentYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
