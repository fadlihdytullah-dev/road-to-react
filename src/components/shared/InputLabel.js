import React from 'react';
import Text from './Text';

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

export default InputLabel;
