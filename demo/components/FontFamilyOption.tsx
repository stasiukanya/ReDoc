import * as React from 'react';

import { MenuItem, Select, Typography } from '@material-ui/core';
import { FontInfo } from '../config';

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
  fontsList: Dict<FontInfo>;
}

export interface OptionState {
  selectValue: string;
}

export default class FontFamilyOption extends React.Component<OptionProps, OptionState> {
  state = {
    selectValue: this.props.value.split(',')[0],
  };

  handleChangeFont = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    this.setState({
      selectValue: e.target.value,
    });
  };

  render() {
    let { value } = this.props;
    const { fontsList, title } = this.props;
    const { selectValue } = this.state;

    value = value.split(',')[0];

    return (
      <>
        <Typography gutterBottom={true}>{title}</Typography>
        <Select onChange={this.handleChangeFont} value={selectValue} style={{ width: '100%' }}>
          {Object.keys(fontsList).map(name => (
            <MenuItem value={name} key={name}>
              {fontsList[name]!.title}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  }
}
