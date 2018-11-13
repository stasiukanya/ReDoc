import * as React from 'react';
import { render } from 'react-dom';
import { resolve as urlResolve } from 'url';
import { RedocStandalone, styled, ThemeProvider } from '../src';
import { RedocRawOptions } from '../src/services/RedocNormalizedOptions';

import { Button, Checkbox, FormControlLabel, FormGroup, MuiThemeProvider } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import ComboBox from './components/ComboBox';
import { muiTheme } from './components/common-components';
import ThemesPanel from './components/ThemesPanel';

import defaultTheme, { resolveTheme } from '../src/theme';

const demos = [
  { value: 'https://api.apis.guru/v2/specs/instagram.com/1.0.0/swagger.yaml', label: 'Instagram' },
  {
    value: 'https://api.apis.guru/v2/specs/googleapis.com/calendar/v3/swagger.yaml',
    label: 'Google Calendar',
  },
  { value: 'https://api.apis.guru/v2/specs/slack.com/1.0.6/swagger.yaml', label: 'Slack' },
  { value: 'https://api.apis.guru/v2/specs/zoom.us/2.0.0/swagger.yaml', label: 'Zoom.us' },
  {
    value: 'https://api.apis.guru/v2/specs/graphhopper.com/1.0/swagger.yaml',
    label: 'GraphHopper',
  },
];

const DEFAULT_SPEC = 'openapi.yaml';

class DemoApp extends React.Component<
  {},
  {
    specUrl: string;
    dropdownOpen: boolean;
    cors: boolean;
    isOpen: boolean;
    options: RedocRawOptions;
  }
> {
  constructor(props) {
    super(props);

    let parts = window.location.search.match(/url=([^&]+)/);
    let url = DEFAULT_SPEC;
    if (parts && parts.length > 1) {
      url = decodeURIComponent(parts[1]);
    }

    parts = window.location.search.match(/[?&]nocors(&|#|$)/);
    let cors = true;
    if (parts && parts.length > 1) {
      cors = false;
    }

    this.state = {
      specUrl: url,
      dropdownOpen: false,
      cors,
      isOpen: false,
      options: {},
    };
  }

  handleChange = (url: string) => {
    this.setState({
      specUrl: url,
    });
    window.history.pushState(
      undefined,
      '',
      updateQueryStringParameter(location.search, 'url', url),
    );
  };

  toggleCors = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cors = e.currentTarget.checked;
    this.setState({
      cors,
    });
    window.history.pushState(
      undefined,
      '',
      updateQueryStringParameter(location.search, 'nocors', cors ? undefined : ''),
    );
  };

  handleOpenPanel = () => {
    this.setState({
      isOpen: true,
    });
  };

  handleClosePanel = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleApply = (options: RedocRawOptions) => {
    this.setState({
      options,
    });
  };

  render() {
    const { specUrl, cors, options } = this.state;
    let proxiedUrl = specUrl;
    if (specUrl !== DEFAULT_SPEC) {
      proxiedUrl = cors
        ? '\\\\cors.apis.guru/' + urlResolve(window.location.href, specUrl)
        : specUrl;
    }

    return (
      <ThemeProvider theme={resolveTheme(defaultTheme)}>
        <MuiThemeProvider theme={muiTheme}>
          <>
            <Heading>
              <a href=".">
                <Logo src="https://github.com/Rebilly/ReDoc/raw/master/docs/images/redoc-logo.png" />
              </a>
              <ControlsContainer>
                <ComboBox
                  placeholder={'URL to a spec to try'}
                  options={demos}
                  onChange={this.handleChange}
                  value={specUrl === DEFAULT_SPEC ? '' : specUrl}
                />
                <FormGroup row={true} style={{ marginLeft: 15 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        type="checkbox"
                        onChange={this.toggleCors}
                        checked={cors}
                        disableRipple={true}
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox fontSize="small" />}
                        color="primary"
                      />
                    }
                    label="CORS"
                  />
                </FormGroup>
                <Button
                  onClick={this.handleOpenPanel}
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  Customize
                </Button>
              </ControlsContainer>
              <iframe
                src="https://ghbtns.com/github-btn.html?user=Rebilly&amp;repo=ReDoc&amp;type=star&amp;count=true&amp;size=large"
                frameBorder="0"
                scrolling="0"
                width="150px"
                height="30px"
              />
            </Heading>
            <MainWrapper>
              <RedocStandalone specUrl={proxiedUrl} options={options} />
              <ThemesPanel
                isOpen={this.state.isOpen}
                onClose={this.handleClosePanel}
                onChange={this.handleApply}
              />
            </MainWrapper>
          </>
        </MuiThemeProvider>
      </ThemeProvider>
    );
  }
}

/* ====== Styled components ====== */

const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin: 0 15px;
  align-items: center;
`;

const Heading = styled.nav`
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  background: white;
  border-bottom: 1px solid #cccccc;
  z-index: 10;
  padding: 5px;

  display: flex;
  align-items: center;
  font-family: 'Lato';
`;

const Logo = styled.img`
  height: 40px;
  width: 124px;
  display: inline-block;
  margin-right: 15px;

  @media screen and (max-width: 950px) {
    display: none;
  }
`;

render(<DemoApp />, document.getElementById('container'));

/* ====== Helpers ====== */
function updateQueryStringParameter(uri, key, value) {
  const keyValue = value === '' ? key : key + '=' + value;
  const re = new RegExp('([?|&])' + key + '=?.*?(&|#|$)', 'i');
  if (uri.match(re)) {
    if (value !== undefined) {
      return uri.replace(re, '$1' + keyValue + '$2');
    } else {
      return uri.replace(re, (_, separator: string, rest: string) => {
        if (rest.startsWith('&')) {
          rest = rest.substring(1);
        }
        return separator === '&' ? rest : separator + rest;
      });
    }
  } else {
    if (value === undefined) {
      return uri;
    }
    let hash = '';
    if (uri.indexOf('#') !== -1) {
      hash = uri.replace(/.*#/, '#');
      uri = uri.replace(/#.*/, '');
    }
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    return uri + separator + keyValue + hash;
  }
}
