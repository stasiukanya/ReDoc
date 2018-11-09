import * as React from 'react';

import { CheckboxButton, OptionWrapper, OptionDescription, OptionTitle } from './common-components';

export interface OptionProps {
  onChange?: (value: boolean) => void;
  value: boolean;
  title: string;
  description?: string;
}

export interface OptionState {
  isChecked?: boolean;
}

export default class Checkbox extends React.Component<OptionProps, OptionState> {
  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange(!this.props.value);
    }
  };

  render() {
    const checkedClass = this.props.value ? 'checked' : '';
    return (
      <OptionWrapper style={{ alignItems: 'start' }}>
        <CheckboxButton onClick={this.handleChange} className={checkedClass}>
          <span />
        </CheckboxButton>
        <div>
          <OptionTitle>{this.props.title}</OptionTitle>
          <OptionDescription>{this.props.description}</OptionDescription>
        </div>
      </OptionWrapper>
    );
  }
}
