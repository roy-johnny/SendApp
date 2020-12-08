import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

class Scan extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      flashMode: RNCamera.Constants.FlashMode.off,
      used: false,
    };
  }

  onSuccess = (e) => {
    this.setState({used: true});
    this.props.navigation.navigate('Get', {
      link: e.data,
    });
  };

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (this.state.used) {
        this.props.navigation.goBack();
      }
    });
  }

  render() {
    return (
      <View style={{backgroundColor: 'black', flex: 1}}>
        <QRCodeScanner
          onRead={this.onSuccess}
          flashMode={this.state.flashMode}
          topContent={
            <View style={{flexDirection: 'row', flexWrap: 'wrap', flex: 1}}>
              <TouchableOpacity
                style={[{backgroundColor: 'green'}, styles.touch]}
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  this.state.flashMode === RNCamera.Constants.FlashMode.off
                    ? {backgroundColor: 'black'}
                    : {backgroundColor: 'orange'},
                  styles.touch,
                ]}
                onPress={() => {
                  this.setState({
                    flashMode:
                      this.state.flashMode === RNCamera.Constants.FlashMode.off
                        ? RNCamera.Constants.FlashMode.torch
                        : RNCamera.Constants.FlashMode.off,
                  });
                }}>
                <Text style={styles.buttonText}>
                  {this.state.flashMode === RNCamera.Constants.FlashMode.off
                    ? 'Flash OFF'
                    : 'Flash ON'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              marginHorizontal: '6%',
              marginBottom: '10%',
            }}>
            Please point your camera at QR code to scan it.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 21,
    color: 'white',
    top: '-25%',
  },
  touch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Scan;
