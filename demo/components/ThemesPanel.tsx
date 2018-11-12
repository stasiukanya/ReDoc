import * as React from 'react';

import {
  Button,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Modal,
  TextField,
  Typography,
} from '@material-ui/core';
import { Close, ExpandMore } from '@material-ui/icons';
import { CopyButtonWrapper } from '../../src/common-elements/CopyButtonWrapper';
import { RedocRawOptions } from '../../src/services/RedocNormalizedOptions';
import styled from '../../src/styled-components';
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

export interface ThemesPanelProps {
  isOpen: boolean;

  onClose?: () => void;
  onChange?: (options: RedocRawOptions) => void;
}

export interface ThemesPanelState {
  options: RedocRawOptions;
  modalIsOpen: boolean;
  expanded: any;
}

export default class ThemesPanel extends React.Component<ThemesPanelProps, ThemesPanelState> {
  state = {
    options: {},
    modalIsOpen: false,
    expanded: null,
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

  handleExpandedChange = panel => (_e, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
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
      <CopyButton color="primary" variant="contained">
        {renderCopyButton()}
      </CopyButton>
    );
  };

  render() {
    const { expanded, modalIsOpen, options } = this.state;
    const codeSnippet = getPageHtml(options);
    return this.props.isOpen ? (
      <PanelWrap>
        <div>
          <CloseIcon onClick={this.handleClose} fontSize="small" />
        </div>
        {/* tslint:disable-next-line */}
        <Presets presets={presets} onChange={theme => this.handleOptionChange(theme, 'theme')} />
        {CONFIG.map(group => {
          return (
            <StyledExpansionPanel
              key={group.title}
              expanded={expanded === group.title}
              defaultExpanded={CONFIG[0] === group}
              onChange={this.handleExpandedChange(group.title)}
            >
              <StyledExpansionPanelSummary
                expandIcon={<ExpandMore />}
                IconButtonProps={{
                  style: {
                    padding: 0,
                    right: 0,
                  },
                }}
              >
                <Typography variant="body1">{group.title}</Typography>
              </StyledExpansionPanelSummary>
              <StyledExpansionPanelDetails>
                {group.items.map(item => (
                  <div key={item.path} style={{ marginTop: 10 }}>
                    {this.renderItem(item)}
                  </div>
                ))}
              </StyledExpansionPanelDetails>
            </StyledExpansionPanel>
          );
        })}
        <Button
          onClick={this.handleModalOpen}
          color="primary"
          variant="contained"
          style={{ marginTop: 10 }}
        >
          Copy code snippet
        </Button>
        <Modal open={modalIsOpen} onClose={this.handleModalClose} disableAutoFocus={true}>
          <ModalInner>
            <CloseIcon onClick={this.handleModalClose} fontSize="small" />
            <Grid container={true} direction="column" alignItems="flex-end">
              <TextField
                defaultValue={codeSnippet}
                multiline={true}
                rowsMax={10}
                autoFocus={true}
                fullWidth={true}
                variant="outlined"
                inputProps={{
                  style: { fontFamily: 'Courier, monospace', fontSize: '13px' },
                }}
              />
              <CopyButtonWrapper data={codeSnippet}>{this.renderInnerCopyButton}</CopyButtonWrapper>
            </Grid>
          </ModalInner>
        </Modal>
      </PanelWrap>
    ) : null;
  }
}

const PanelWrap = styled.div`
  position: sticky;
  top: 50px;
  flex-shrink: 0;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  width: 300px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledExpansionPanel = styled(ExpansionPanel)`
  && {
    box-shadow: none;
    margin: 0;
    &::before {
      content: none;
    }
  }
`;

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)`
  && {
    padding: 0;
    min-height: 40px !important;
    div {
      margin: 0;
    }
  }
`;
const StyledExpansionPanelDetails = styled(ExpansionPanelDetails)`
  && {
    flex-direction: column;
    padding: 0 24px 10px 0;
  }
`;

const ModalInner = styled.div`
  max-width: 70%;
  background: #fff;
  padding: 16px;
  text-align: right;
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  outline: none;
`;

const CloseIcon = styled(Close)`
  margin-bottom: 15px;
  cursor: pointer;
`;

const CopyButton = styled(Button)`
  && {
    padding: 0;
    margin-top: 10px;
    > span {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: 8px 16px;
    }
  }
`;
