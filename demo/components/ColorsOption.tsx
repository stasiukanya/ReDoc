import * as React from 'react';
import { ChromePicker } from 'react-color';
import styled, { withProps } from '../../src/styled-components';
import { OptionWrapper, OptionTitle, OptionValue } from './common-components';

export interface OptionProps {
  onChange: (value: string) => void;
  title: string;
  value: string;
}

export interface OptionState {
  mainColor?: string;
  displayColorPicker: boolean;
}

export default class ColorsOption extends React.Component<OptionProps, OptionState> {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
  }

  handleChangeColor = color => {
    if (this.props.onChange) {
      this.props.onChange(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
    }
  };

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleClose = () => {
    this.setState({
      displayColorPicker: false,
    });
  };

  render() {
    const { value, title } = this.props;
    return (
      <>
        <OptionTitle>{title}</OptionTitle>
        <div>
          <OptionWrapper>
            <Button onClick={this.handleClick} buttonBackground={value} />
            <OptionValue>{value}</OptionValue>
          </OptionWrapper>
          {this.state.displayColorPicker ? (
            <>
              <Cover onClick={this.handleClose} />
              <StyledBlockPicker color={value} onChange={this.handleChangeColor} />
            </>
          ) : null}
        </div>
      </>
    );
  }
}

const Button = withProps<{ buttonBackground?: string }>(styled.div)`
  background-color: ${props => props.buttonBackground};
  height: 15px;
  width: 30px;
  border: 2px solid #fff;
  border-radius: 2px;
  box-shadow: 0px 0px 0px 1px #ddd;
  cursor: pointer;
`;

const StyledBlockPicker = withProps<{ color?: string }>(styled(ChromePicker))`
  font-family: Roboto, sans-serif;
  margin-top: 15px;
  position: relative;
  z-index: 2;
  box-shadow: none!important;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
