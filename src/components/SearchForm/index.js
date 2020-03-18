import React from 'react';
import InputLabel from './../shared/InputLabel';
import Button from './../shared/Button';

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

export default SearchForm;
