/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Image, Platform, Dimensions, StyleSheet } from 'react-native';
import ParallaxScroll from 'react-native-parallax-scroll';
/* eslint-enable import/no-extraneous-dependencies */

const ANDROID_STATUS_BAR_HEIGHT = 24;

const IS_IOS = Platform.OS === 'ios';

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#eee',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'black',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainerStyle: {
    width: window.width,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const height = 300;

export default function SwipeCard({ children, headerImage, parallaxHeight }) {
  const contentContainerStyle = {
    minHeight: height - parallaxHeight,
  };

  return (
    <ParallaxScroll
      style={styles.wrapper}
      height={height}
      renderHeader={() => (
        <View style={styles.header}>
          <Text style={styles.headerText}>你有重要更新</Text>
        </View>
      )}
      parallaxHeight={parallaxHeight}
      headerBackgroundColor={'#eee'}
      alwaysBounceVertical={false}
      contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
      directionalLockEnabled
      headerFixedBackgroundColor={'rgba(51, 51, 51, 1)'}
    >
      {children}
    </ParallaxScroll>
  );
}

SwipeCard.propTypes = {
  children: PropTypes.element.isRequired,
  headerImage: PropTypes.string.isRequired,
  parallaxHeight: PropTypes.number.isRequired,
};
