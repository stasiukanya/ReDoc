import * as React from 'react';

import { Checkbox, Grid, Typography } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import styled from '../../src/styled-components';

export interface OptionProps {
  onChange?: (value: boolean) => void;
  value: boolean;
  title: string;
  description?: string;
}

export interface OptionState {
  isChecked?: boolean;
}

export default class CheckboxInput extends React.Component<OptionProps, OptionState> {
  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange(!this.props.value);
    }
  };

  render() {
    const { value, title } = this.props;
    return (
      <Grid container={true} alignItems="flex-start">
        <StyledCheckbox
          color="primary"
          disableRipple={true}
          checked={value}
          onChange={this.handleChange}
          icon={<CheckBoxOutlineBlank fontSize="small" />}
          checkedIcon={<CheckBox fontSize="small" />}
        />
        <div>
          <Typography>{title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {this.props.description}
          </Typography>
        </div>
      </Grid>
    );
  }
}

const StyledCheckbox = styled(Checkbox)`
  && {
    padding: 0 12px 0 0;
  }
`;
