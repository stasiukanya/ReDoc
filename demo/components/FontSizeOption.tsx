import * as React from 'react';
import { Dropdown, OptionWrapper, Input, OptionTitle } from './common-components';

const fontUnits = ['px', 'em'];

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
}

function parseUnit(val: string) {
  return val.replace(/[0-9]|\.|\,/g, '');
}

export default class FontSizeOption extends React.Component<OptionProps> {
  handleChangeSize = e => {
    if (this.props.onChange) {
      this.props.onChange(e.target.value + parseUnit(this.props.value));
    }
  };

  handleChangeUnits = item => {
    // when switch units change default size approprietly
    const fontSizeValue = item.value === 'px' ? 16 : 1.2;
    if (this.props.onChange) {
      this.props.onChange(fontSizeValue + item.value);
    }
  };

  render() {
    const { title, value } = this.props;
    const unit = parseUnit(value);
    const step = unit === 'px' ? 1 : 0.1;

    const parsedValue = parseFloat(value);
    return (
      <>
        <OptionTitle>{title}</OptionTitle>
        <OptionWrapper style={{ justifyContent: 'space-between' }}>
          <Input type="number" step={step} onChange={this.handleChangeSize} value={parsedValue} />
          <Dropdown
            onChange={this.handleChangeUnits}
            value={unit}
            options={fontUnits.map(u => ({ label: u, value: u }))}
          />
        </OptionWrapper>
      </>
    );
  }
}
