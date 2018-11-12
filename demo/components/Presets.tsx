import * as React from 'react';

import { MenuItem, Select, Typography } from '@material-ui/core';

export interface OptionProps {
  onChange?: (value: object) => void;
  presets: object;
}

export interface OptionState {
  presetValue?: string;
}

export default class Presets extends React.Component<OptionProps, OptionState> {
  constructor(props) {
    super(props);

    const defaultValue = Object.keys(this.props.presets)[0];

    this.state = {
      presetValue: defaultValue,
    };
  }

  handleChangePreset = e => {
    this.setState({
      presetValue: e.target.value,
    });
    if (this.props.onChange) {
      this.props.onChange(this.props.presets[e.target.value]);
    }
  };

  render() {
    return (
      <>
        <Typography>Presets:</Typography>
        <Select
          style={{ margin: '1em 0', flexShrink: 0 }}
          onChange={this.handleChangePreset}
          value={this.state.presetValue}
        >
          {Object.keys(this.props.presets).map(name => (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  }
}
