import { createMuiTheme, TextField } from '@material-ui/core';
import styled from 'styled-components';

import { StyledDropdown } from '../../src/common-elements/dropdown';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#32329f',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export const Dropdown = styled(StyledDropdown)`
  .Dropdown-control {
    margin-top: 0;
  }
`;

export const FullWidthDropdown = styled(Dropdown)`
  width: 100%;
`;

export const OptionTitle = styled.div`
  margin: 0 0 10px;
  color: #333;
  font-size: 13px;

  &::after {
    content: ':';
  }
`;

export const OptionDescription = styled.p`
  margin: 3px 0 10px;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #999;
`;

export const OptionValue = styled.div`
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #333;
  margin: 0;
  margin-left: 20px;
`;

export const Input = styled.input`
  box-sizing: border-box;
  padding: 4px;
  border: 1px solid #a5a9ac;
  height: 25px;
  outline: none;

  &:hover,
  &:focus {
    box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12);
    border: 1px solid ${({ theme }) => theme.colors.primary.main};
  }
`;

export const CheckboxButton = styled.button`
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  padding: 0;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  transition: background-color 0.35s ease, border-color 0.35s ease;
  cursor: pointer;
  outline: none;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.checked {
    background-color: #32329f;
    border-color: #32329f;
    span {
      opacity: 1;
      visibility: visible;
    }
  }
  span {
    background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2026%2026%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cpath%20d%3D%22M.3%2014c-.2-.2-.3-.5-.3-.7s.1-.5.3-.7l1.4-1.4c.4-.4%201-.4%201.4%200l.1.1%205.5%205.9c.2.2.5.2.7%200L22.8%203.3h.1c.4-.4%201-.4%201.4%200l1.4%201.4c.4.4.4%201%200%201.4l-16%2016.6c-.2.2-.4.3-.7.3-.3%200-.5-.1-.7-.3L.5%2014.3.3%2014z%22%20fill%3D%22%23FFF%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.35s ease, visibility 0.35s ease;
    display: block;
    width: 9px;
    height: 10px;
  }
  input {
    opacity: 0;
    position: absolute;
    width: 100%;
    margin: 0;
    cursor: pointer;
  }
`;

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledTextField = styled(TextField)`
  && {
    input {
      height: 25px;
      padding: 4px 8px;
    }
  }
`;
