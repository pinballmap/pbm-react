import React from 'react';
import {PropTypes} from 'react';
import {StyleSheet, TouchableOpacity, View, PixelRatio} from 'react-native';

import _ from 'underscore';


const systemButtonOpacity = 0.2;

const Button = React.createClass({
  propTypes: {
    ...TouchableOpacity.propTypes,
    disabled: PropTypes.bool,
    style: Text.propTypes.style,
  },

  render() {
    let touchableProps = {
      activeOpacity: this._computeActiveOpacity(),
    };

    if (!this.props.disabled) {
      touchableProps.onPress = this.props.onPress;
      touchableProps.onPressIn = this.props.onPressIn;
      touchableProps.onPressOut = this.props.onPressOut;
      touchableProps.onLongPress = this.props.onLongPress;
    }

    return (
      <TouchableOpacity {...touchableProps}>
        {this._renderGroupedChildren()}
      </TouchableOpacity>
    );
  },

  _stylesFromType(refinement) {
    return buttonStyles[this.props.type] && buttonStyles[this.props.type][refinement];
  },

  _renderGroupedChildren() {
    let disabledStateStyle = this.props.disabled ? styles.disabledText : null;

    let children = _.flatten([this.props.children]).map((children, index) => {
      return (
        <Text
          key={index}
          allowFontScaling={false}
          style={[{flex: 0, marginHorizontal: 5, textAlign: 'center'}, styles.text, disabledStateStyle, this._stylesFromType('text'), this.props.textStyle]}
        >
          {children}
        </Text>
      );
    });

    switch (children.length) {
      case 0:
        return null;
      default:
        return <View style={[{justifyContent: 'center', alignItems: 'center'}, styles.button, this._stylesFromType('button'), this.props.style]}>{children}</View>;
    }
  },

  _computeActiveOpacity() {
    if (this.props.disabled) {
      return 1;
    }
    return this.props.activeOpacity != null ?
      this.props.activeOpacity :
      systemButtonOpacity;
  },
});

const buttonStyles = {

  primary: {
    button: {
      backgroundColor: 'white',
      borderColor: '#D3ECFF',
      borderWidth: 2,
    },
    text: {
      color: '#433A3A',
    },
  },

  autoWidth: {
    button: {
      flex: 0,
    },
  },

  transparent: {
    button: {
      backgroundColor: 'transparent',
      borderColor: 'white',
    },
  },

};

const styles = StyleSheet.create({

  button: {
    padding: 15,
    borderRadius: 1.5 * PixelRatio.get(),
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 18,
  },

  disabledText: {
    color: '#dcdcdc',
  },
});

export default Button;
