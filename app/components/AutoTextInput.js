import React, { Component } from 'react';
import {
  TextInput,
  Platform,
} from 'react-native';

export default class AutoTextInput extends Component {
  constructor(props) {
    super(props);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      height: 0,
    };
  }
  onContentSizeChange(event) {
    if (Platform.OS === 'android') {
      let height = event.nativeEvent.contentSize.height;
      this.changeHeight(height);
    }
  }
  onChange(event) {
    if (Platform.OS === 'android') {
      let height = event.nativeEvent.contentSize.height;
      this.changeHeight(height);
    }
  }
  changeHeight(height) {
    let {
      minHeight = 16,
      maxHeight,
    } = this.props;
    if (height < minHeight) {
      height = minHeight;
    } else if (maxHeight && height > maxHeight) {
      height = maxHeight;
    }
    if (height !== this.state.height) {
      this.setState({height: height});
    }
  }
  focus = () => {
    this.textInput.focus();
  }
  render() {
    let heightStyle = {};
    if (Platform.OS === 'android') {
      heightStyle = { height: this.state.height };
    }
    return (
      <TextInput
        {...this.props}
        ref={(textInput) => { this.textInput = textInput; }}
        multiline
        onContentSizeChange={this.onContentSizeChange}
        onChange={this.onChange}
        style={[this.props.style, heightStyle]}
      />
    )
  }
}