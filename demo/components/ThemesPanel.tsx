import * as React from 'react';
import Modal from 'react-modal';
import { Accordion, AccordionItem } from 'react-sanfona';
import { CopyButtonWrapper } from '../../src/common-elements/CopyButtonWrapper';
import { RedocRawOptions } from '../../src/services/RedocNormalizedOptions';
import styled, { createGlobalStyle, withProps } from '../../src/styled-components';
import defaultTheme, { resolveTheme } from '../../src/theme';
import { mergeObjects } from '../../src/utils';
import { CONFIG, ConfigItem, getFontsByType, presets } from '../config';
import { generateFonts, getPageHtml, getValue, setValue } from '../helpers';
import Checkbox from './Checkbox';
import ColorsOption from './ColorsOption';
import FontFamilyOption from './FontFamilyOption';
import FontSizeOption from './FontSizeOption';
import Presets from './Presets';
import Range from './Range';
import TextInput from './TextInput';
import TextTransformOption from './TextTransformOption';

const defaultOptions = {
  untrustedSpec: false,
  suppressWarnings: false,
  hideHostname: false,
  expandResponses: '',
  requiredPropsFirst: false,
  sortPropsAlphabetically: false,
  pathInMiddlePanel: false,
  hideLoading: false,
  nativeScrollbars: false,
  hideDownloadButton: false,
  disableSearch: false,
  onlyRequiredInSamples: false,
  theme: resolveTheme(mergeObjects({}, defaultTheme)),
};

createGlobalStyle`
  body {
    &.ReactModal__Body--open {
      overflow: hidden;
    }
  }
`;

export interface ThemesPanelProps {
  isOpen: boolean;

  onClose?: () => void;
  onChange?: (options: RedocRawOptions) => void;
}

export interface ThemesPanelState {
  options: RedocRawOptions;
  modalIsOpen: boolean;
}

export default class ThemesPanel extends React.Component<ThemesPanelProps, ThemesPanelState> {
  state = {
    options: {},
    modalIsOpen: false,
  };

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.options);
      for (const font of generateFonts(this.state.options)) {
        const id = 'redoc_font_link__' + font.fontName;
        if (!document.getElementById(id)) {
          document.head!.insertAdjacentHTML('beforeend', font.html(id));
        }
      }
    }
  };

  handleOptionChange = (val: boolean | string | object, path: string) => {
    setValue(this.state.options, val, path);
    this.setState({ options: { ...this.state.options } });
    this.handleChange();
  };

  handleModalOpen = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  renderItem = (item: ConfigItem) => {
    const props = {
      title: item.title,
      // tslint:disable-next-line
      onChange: value => this.handleOptionChange(value, item.path),
      defaultValue: getValue(defaultOptions, item.path),
      value: getValue(this.state.options, item.path) || getValue(defaultOptions, item.path),
    };

    if (item.type === 'colors') {
      return <ColorsOption {...props} />;
    }

    if (item.type === 'font-family' || item.type === 'font-family-mono') {
      const fontsArray = getFontsByType(item.type);
      return <FontFamilyOption {...props} fontsList={fontsArray} />;
    }

    if (item.type === 'font-size') {
      return <FontSizeOption {...props} />;
    }

    if (item.type === 'range') {
      return <Range {...props} step={item.step} max={item.max} min={item.min} units={item.units} />;
    }

    if (item.type === 'text-transform') {
      return <TextTransformOption {...props} />;
    }

    if (item.type === 'checkbox') {
      return <Checkbox {...props} description={item.description} />;
    }

    if (item.type === 'text-input') {
      return <TextInput {...props} placeholder={item.placeholder} />;
    }
  };

  renderInnerCopyButton = ({ renderCopyButton }) => {
    return (
      <Button minWidth="90px" padding="0">
        {renderCopyButton()}
      </Button>
    );
  };

  render() {
    const codeSnippet = getPageHtml(this.state.options);
    return this.props.isOpen ? (
      <PanelWrap>
        <div>
          <CloseButton onClick={this.handleClose}>
            <span />
            <span />
          </CloseButton>
        </div>
        {/* tslint:disable-next-line */}
        <Presets presets={presets} onChange={theme => this.handleOptionChange(theme, 'theme')} />
        <AccordionWrap>
          <StyledAccordion>
            {CONFIG.map(group => {
              return (
                <StyledAccordionItem
                  key={group.title}
                  title={group.title}
                  expanded={CONFIG[0] === group}
                >
                  {group.items.map(item => (
                    <StyledBoxItem key={item.path}>{this.renderItem(item)}</StyledBoxItem>
                  ))}
                </StyledAccordionItem>
              );
            })}
          </StyledAccordion>
        </AccordionWrap>
        <Button onClick={this.handleModalOpen} width="100%" padding="7px 15px">
          Copy code snippet
        </Button>
        <StyledModal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.handleModalClose}
          ariaHideApp={false}
          shouldCloseOnOverlayClick={true}
          style={{
            overlay: {
              zIndex: 5,
            },
          }}
        >
          <div>
            <CloseButton onClick={this.handleModalClose}>
              <span />
              <span />
            </CloseButton>
          </div>
          <CodeWrap>
            <Code defaultValue={codeSnippet} />
            <CopyButtonWrapper data={codeSnippet}>{this.renderInnerCopyButton}</CopyButtonWrapper>
          </CodeWrap>
        </StyledModal>
      </PanelWrap>
    ) : null;
  }
}

const PanelWrap = styled.div`
  font-family: Montserrat, sans-serif;
  font-size: 14px;

  position: sticky;
  top: 50px;
  flex-shrink: 0;
  max-height: calc(100vh - 50px);
  width: 300px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledBoxItem = styled.div`
  margin-top: 10px;
`;

const CloseButton = styled.div`
  height: 10px;
  margin-bottom: 15px;
  cursor: pointer;
  display: inline-block;
  padding: 5px 0 0;
  cursor: pointer;
  span {
    display: block;
    height: 3px;
    width: 15px;
    background-color: #333;
    border-radius: 30px;
    &:first-child {
      transform: rotate(45deg) translateY(2px);
    }
    &:nth-child(2) {
      transform: rotate(-45deg) translateY(-2px);
    }
  }
`;

const Button = withProps<{ width?: string; minWidth?: string; padding?: string }>(styled.button)`
  border: 1px solid #32329f;
  background-color: transparent;
  color: #32329f;
  font-weight: normal;
  margin-top: 20px;
  padding:  ${props => props.padding};
  display: inline-block;
  -webkit-text-decoration: none;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  min-width: ${props => props.minWidth};
  width: ${props => props.width};
  flex-shrink: 0;
  span {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 7px 15px;
  }
`;

const StyledAccordion = styled(Accordion)`
  width: 100%;
`;

const StyledAccordionItem = styled(AccordionItem)`
  padding: 10px 0;
  .react-sanfona-item-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    font-weight: 400;
    transition: opacity 0.35s ease;
    &:hover {
      opacity: 0.7;
    }
    &::after {
      content: '';
      display: block;
      margin-left: 10px;
      width: 10px;
      height: 10px;
      background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%20284.929%20284.929%22%3E%3Cpath%20d%3D%22M282.082%2076.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856-2.471%200-4.661.95-6.563%202.856L142.466%20174.441%2030.262%2062.241c-1.903-1.906-4.093-2.856-6.567-2.856-2.475%200-4.665.95-6.567%202.856L2.856%2076.515C.95%2078.417%200%2080.607%200%2083.082c0%202.473.953%204.663%202.856%206.565l133.043%20133.046c1.902%201.903%204.093%202.854%206.567%202.854s4.661-.951%206.562-2.854L282.082%2089.647c1.902-1.903%202.847-4.093%202.847-6.565%200-2.475-.945-4.665-2.847-6.571z%22%20fill%3D%22%23333%22%2F%3E%3C%2Fsvg%3E');
      background-repeat: no-repeat;
      background-size: contain;
      transition: transform 0.35s ease;
    }
  }
  &.react-sanfona-item-expanded {
    .react-sanfona-item-body {
      max-height: none !important;
    }
    .react-sanfona-item-title::after {
      transform: rotate(-180deg);
    }
  }
`;

const AccordionWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  margin: 0 -30px;
  padding: 0 30px;
`;

const StyledModal = styled(Modal)`
  opacity: 0;
  max-width: 70%;
  width: 100%;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  overflow-y: auto;
  position: absolute;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: all 0.35s ease;
  &.ReactModal__Content--after-open {
    opacity: 1;
  }

  &.ReactModal__Content--before-close {
    opacity: 0;
  }
`;

const CodeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

const Code = styled.textarea`
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  min-height: 60vh;
  color: #333;
  overflow-x: auto;
  font-family: Courier, monospace;
  font-size: 13px;
  line-height: 1.4;
  white-space: pre;
  resize: none;
`;
