import React, { Component } from 'react';
import { AppRegistry, View, TextInput } from 'react-native';

export default class UselessTextInput extends Component {
  render() {
    return (
      <TextInput
        {...this.props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
        editable = {true}
        //maxLength = {40}
      />
    );
  }
}