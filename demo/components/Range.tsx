import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import styled from '../../src/styled-components';

export interface OptionProps {
  onChange: (value: string) => void;
  value: string;
  title: string;
  step?: number;
  max?: number;
  min?: number;
  units?: string;
}

export default class Range extends React.Component<OptionProps> {
  handleChangeWidth = e => {
    this.setState({
      rangeValue: e.target.value,
    });
    if (this.props.onChange) {
      this.props.onChange(e.target.value + this.props.units);
    }
  };

  render() {
    const { min, max, step, units, value, title } = this.props;
    const parsedValue = parseInt(value, 10);

    return (
      <>
        <Typography gutterBottom={true}>{title}</Typography>
        <Grid container={true} alignItems="center">
          <Input
            type="range"
            value={parsedValue}
            step={step}
            min={min}
            max={max}
            onChange={this.handleChangeWidth}
          />
          <Typography variant="body2" style={{ marginLeft: 10 }}>
            {`${parsedValue} ${units}`}
          </Typography>
        </Grid>
      </>
    );
  }
}

const Input = styled.input`
  -webkit-appearance: none;
  background: transparent;
  width: 65%;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    margin-top: -6px;
    border: 1px solid #999;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #999;
    border-radius: 1px;
  }
`;
