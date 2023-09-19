import React, { Component } from 'react';
import Switch from 'react-switch';
class CustomSwitch extends Component {
  render() {
    return (
      <Switch
        onChange={this.props.onChange}
        checked={this.props.checked}
        onColor='#70af85'
        onHandleColor='#70af85'
        offColor='#ec4646'
        offHandleColor='#ec4646'
        // handleDiameter='4'
      />
    );
  }
}
export default CustomSwitch;
