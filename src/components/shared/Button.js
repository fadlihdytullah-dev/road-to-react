import styled, {css} from 'styled-components';

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

export default Button;
