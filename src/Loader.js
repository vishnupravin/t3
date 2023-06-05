import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';
import LocalConfig from '../LocalConfig';
const Loader = (props) => {
  const { loading, ...attributes } = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color={LocalConfig.COLOR.BLACK}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
  );
};
export default Loader;
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: LocalConfig.COLOR.BLACK,
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});