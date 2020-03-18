import React from 'react';
import {ReactComponent as Check} from './check.svg';
import EmptyData from './../shared/EmptyData';

const getFormattedDate = value => {
  const date = new Date(value * 1000);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
};

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

export default List;
