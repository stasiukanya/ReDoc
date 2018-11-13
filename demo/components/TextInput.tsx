import * as React from 'react';

import { Typography } from '@material-ui/core';
import { StyledTextField } from './common-components';

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
  placeholder?: string;
}

export default class TextInput extends React.Component<OptionProps> {
  handleChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  };

  render() {
    const { placeholder, title, value } = this.props;
    return (
      <>
        <Typography gutterBottom={true}>{title}</Typography>
        <StyledTextField
          type="text"
          placeholder={placeholder}
          onChange={this.handleChange}
          value={value}
        />
      </>
    );
  }
}
