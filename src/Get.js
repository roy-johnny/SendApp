import React, {Component} from 'react';
import {
  Alert,
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import {checklink} from './global';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PermissionsAndroid} from 'react-native';

class Get extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loaded: false,
    };
  }

  async requestPermission() {
    try {
      const os = Platform.OS; // android or ios
      if (os === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Write External Storage Permission',
            message: 'If you want to save files to your phone, please allow.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission accepted.');
        } else {
          console.log('Permission failed.');
        }
      } else {
        console.log('Permission exist.');
      }
    } catch (err) {
      console.log(err.toString());
    }
  }

  componentDidMount() {
    this.requestPermission();
    if (checklink(this.props.route.params.link)) {
      fetch(this.props.route.params.link + '?app=true')
        .then((response) => response.json())
        .then((json) => {
          this.setState({files: json.files, loaded: true});
        });
    } else {
      alert('Invalid link!');
      this.props.navigation.goBack();
    }
  }

  download = (i) => {
    var tmpfiles = this.state.files;
    tmpfiles[i].dling = true;
    this.setState({
      files: tmpfiles,
    });
    fetch(baseUrl + 'share/file', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.state.files[i]._id,
        pid: this.state.files[i].pid,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        data = data.slice(data.indexOf(';base64,') + 8);
        let filepath =
          RNFS.DocumentDirectoryPath + '/' + this.state.files[i].name;
        if (RNFS.DownloadDirectoryPath) {
          filepath =
            RNFS.DownloadDirectoryPath + '/' + this.state.files[i].name;
        }
        RNFS.writeFile(filepath, data, 'base64')
          .then((success) => {
            Alert.alert('Success', 'File has been stored at ' + filepath);
          })
          .catch((err) => {
            console.log(err.message);
          });
        tmpfiles[i].expire = true;
        this.setState({
          files: tmpfiles,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    var files = [];
    for (var i = 0; i < this.state.files.length; i++) {
      files.push(
        <View
          style={[
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: '3%',
              alignItems: 'center',
            },
            styles.width,
          ]}
          key={i}>
          <Text style={{width: '67%'}}>{this.state.files[i].name}</Text>
          <Text style={{width: '20%', marginRight: '2%'}}>
            {this.state.files[i].size}
          </Text>
          <TouchableOpacity
            style={[
              this.state.files[i].expire
                ? {backgroundColor: '#9fa5ab'}
                : {backgroundColor: '#28a745'},
              {
                paddingVertical: 5,
                paddingHorizontal: '3%',
                borderRadius: 5,
              },
            ]}
            onPress={this.download.bind(this, i)}>
            {/*<Text style={{color: 'white'}}>X</Text>*/}
            {this.state.files[i].expire ? (
              <Icon name="check" size={15} color="white" />
            ) : this.state.files[i].dling ? (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                animating={true}
                style={{width: 15, height: 15}}
              />
            ) : (
              <Icon name="download" size={15} color="white" />
            )}
          </TouchableOpacity>
        </View>,
      );
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        {this.state.files.length === 0 && this.state.loaded && (
          <Text style={{fontSize: 20}}>
            The share expired or doesn't exist.
          </Text>
        )}
        <View>{files}</View>
        {this.state.loaded && (
          <View style={{width: '80%'}}>
            <Text> </Text>
            <Button
              style={styles.button}
              color={'#D0D3D4'}
              title={'Back'}
              titleColor={'black'}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
  },
  width: {
    width: '80%',
  },
});

export default Get;
