import * as React from 'react';

import { MenuItem, Select, Typography } from '@material-ui/core';

const textTransformValue = ['none', 'uppercase', 'lowercase', 'capitalize', 'inherit'];

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
}

export interface OptionState {
  selectValue: string;
}

export default class TextTransformOption extends React.Component<OptionProps, OptionState> {
  state = {
    selectValue: this.props.value,
  };

  handleChange = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    this.setState({
      selectValue: e.target.value,
    });
  };

  render() {
    const { title } = this.props;
    const { selectValue } = this.state;
    return (
      <>
        <Typography gutterBottom={true}>{title}</Typography>
        <Select onChange={this.handleChange} value={selectValue} style={{ width: '100%' }}>
          {textTransformValue.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  }
}
