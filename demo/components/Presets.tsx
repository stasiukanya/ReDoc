import * as React from 'react';
// import styled from 'styled-components';

import { StyledDropdown } from '../../src/common-elements/dropdown';

import { styled } from '../../src';

const Dropdown = styled(StyledDropdown)`
  margin-bottom: 1em;
`;

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

  handleChangePreset = option => {
    this.setState({
      presetValue: option.value,
    });
    if (this.props.onChange) {
      this.props.onChange(this.props.presets[option.value]);
    }
  };

  render() {
    const options = Object.keys(this.props.presets).map(name => ({
      value: name,
      label: name,
    }));

    return (
      <>
        <div>Presets:</div>
        <Dropdown
          style={{ marginBottom: '1em' }}
          onChange={this.handleChangePreset}
          value={this.state.presetValue}
          options={options}
        />
      </>
    );
  }
}
