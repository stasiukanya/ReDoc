import * as React from 'react';

import { FontInfo } from '../config';
import { FullWidthDropdown, OptionTitle } from './common-components';

export interface OptionProps {
  onChange?: (value: string) => void;
  value: string;
  title: string;
  fontsList: Dict<FontInfo>;
}

export default class FontFamilyOption extends React.Component<OptionProps> {
  handleChangeFont = item => {
    if (this.props.onChange) {
      this.props.onChange(item.value);
    }
  };

  render() {
    let { value } = this.props;
    const { fontsList } = this.props;
    value = value.split(',')[0];

    const options = Object.keys(fontsList).map(name => ({
      label: fontsList[name]!.title,
      value: name,
    }));

    return (
      <>
        <OptionTitle>{this.props.title}</OptionTitle>
        <FullWidthDropdown onChange={this.handleChangeFont} value={value} options={options} />
      </>
    );
  }
}
