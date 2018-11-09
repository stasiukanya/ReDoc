import * as React from 'react';
import { FullWidthDropdown, OptionTitle } from './common-components';

const textTransformValue = ['none', 'uppercase', 'lowercase', 'capitalize', 'inherit'];

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
}

export default class TextTransformOption extends React.Component<OptionProps> {
  handleChange = item => {
    if (this.props.onChange) {
      this.props.onChange(item.value);
    }
  };

  render() {
    const { title, value } = this.props;

    const options = textTransformValue.map(item => ({
      label: item,
      value: item,
    }));

    return (
      <>
        <OptionTitle>{title}</OptionTitle>
        <FullWidthDropdown onChange={this.handleChange} value={value} options={options} />
      </>
    );
  }
}
