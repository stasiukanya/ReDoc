import { createMuiTheme } from '@material-ui/core';
import TextField, { StandardTextFieldProps } from '@material-ui/core/TextField';
import { styled } from '../../src';

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#32329f',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

// FIXME: some styled-components + ts issue
export const StyledTextField = styled(TextField as React.ComponentType<StandardTextFieldProps>)`
  && {
    input {
      height: 25px;
      padding: 4px 8px;
    }
  }
`;
