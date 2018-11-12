import * as React from 'react';

import { Grid, MenuItem, Select, Typography } from '@material-ui/core';
import { StyledTextField } from './common-components';

const fontUnits = ['px', 'em'];

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
}
export interface OptionState {
  selectValue: string;
}

function parseUnit(val: string) {
  return val.replace(/[0-9]|\.|\,/g, '');
}

export default class FontSizeOption extends React.Component<OptionProps, OptionState> {
  state = {
    selectValue: parseUnit(this.props.value),
  };

  handleChangeSize = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value + parseUnit(this.props.value));
    }
  };

  handleChangeUnits = e => {
    // when switch units change default size approprietly
    const fontSizeValue = e.target.value === 'px' ? 16 : 1.2;
    if (this.props.onChange) {
      this.props.onChange(fontSizeValue + e.target.value);
    }
    this.setState({ selectValue: e.target.value });
  };

  render() {
    const { title, value } = this.props;
    const { selectValue } = this.state;
    const unit = parseUnit(value);
    const step = unit === 'px' ? 1 : 0.1;

    const parsedValue = parseFloat(value);
    return (
      <>
        <Typography gutterBottom={true}>{title}</Typography>
        <Grid container={true} spacing={8} justify="space-between" alignItems="flex-end">
          <Grid item={true} xs={8}>
            <StyledTextField
              type="number"
              step={step}
              onChange={this.handleChangeSize}
              value={parsedValue}
            />
          </Grid>
          <Grid item={true} xs={4}>
            <Select onChange={this.handleChangeUnits} value={selectValue} style={{ width: '100%' }}>
              {fontUnits.map(u => (
                <MenuItem key={u} value={u}>
                  {u}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </>
    );
  }
}
