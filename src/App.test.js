// describe('Something truthy', () => {
//   it('true to be true', () => {
//     expect(true).toBe(false);
//   });
// });

// describe('Something truthy', () => {
//   test('true to be true', () => {
//     expect(true).toBe(true);
//   });
// });

import React from 'react';
import renderer from 'react-test-renderer';

import App, {SearchForm, InputLabel, List, Item} from './App';

describe('Item', () => {
  const item = {
    title: 'React',
    author: 'Jordan Walke',
    url: 'https://reactjs.org',
    num_comments: 4,
    points: 2,
  };

  it('render all properties', () => {
    const component = renderer.create(<Item item={item} />);

    expect(component.root.findByType('a').props.href).toEqual(
      'https://reactjs.org'
    );

    expect(
      component.root.findAllByType('span')[1].children[1].children[0]
    ).toEqual('Jordan Walke');
  });
});
