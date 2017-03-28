
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Platform,
  Image,
  Alert
} from 'react-native'
import {observable, computed, action, runInAction} from 'mobx';
import ImagePicker from 'react-native-image-picker';
var FileUpload = require('NativeModules').FileUpload;


export default class ServOffer extends Component {
	constructor() {
		super();

		this.state = {
			serv_name: "",
			serv_title: "",
			serv_imges: "",
			errors: [],
      fileName: "",
      avatarSource: null,
      imgBase64: '',
		}
	}

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source, temp, fName;
        // You can display the image using either:
        //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        temp = response.data;

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        fName = response.fileName;
        this.setState({
          avatarSource: source,
          imgBase64: temp,
          fileName: fName
        });
      }
    });
  }

uploadImage(){  
  let formData = new FormData();  
  let url = "http://localhost:8080/FastDFSWeb/servlet/imageUploadServlet";
  console.log("uri:"+this.state.avatarSource.uri+" name:"+this.state.fileName)
  let file = {uri: this.state.avatarSource.uri, type: 'multipart/form-data', name: this.state.fileName};  
  
  formData.append("images",file);  
  
  fetch(url,{  
    method:'POST',  
    mode: "cors", 
    headers:{  
        'Content-Type':'multipart/form-data',  
    },  
    body:formData,  
  })  
  .then((response) => response.text() )  
  .then((responseData)=>{    
    console.log('responseData',responseData);  
    this.setState({
          serv_imges: JSON.parse(responseData).images
        });
    
    console.log('this.state.serv_imges：',this.state.serv_imges);  
    
  })  
  .catch((error)=>{console.error('error',error)});  
  
}  

async onServOfferPres() {
    this.setState({showProgress: true})
    try {
        
      
      let response = await fetch('http://123.56.157.233:3000/serv_offers/1', {
                              method: 'PATCH',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body:JSON.stringify({
                                    serv_offer:{
                                      serv_name: this.state.serv_name,
                                      serv_title: this.state.serv_title,
                                      serv_imges: this.state.serv_imges,
                                    }
                                  })
                            });


      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
          //Handle success
          let accessToken = res;
          console.log(accessToken);

         Alert.alert(
                '提示',
                '上传成功',
                [
                  {text: '服务发布成功', onPress: () => console.log('确定')},
                ]
              )
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        this.setState({error: error});
        console.log("error " + error);
        this.setState({showProgress: false});
    }
  }

	render(){
		return(
			
			<View style={styles.container}>
				<TextInput 
					onChangeText={(val) => this.setState({serv_name: val})}
					style={styles.input}
					placeholder="服务名称：">
				</TextInput>
				<TextInput 
					onChangeText={(val) => this.setState({serv_title: val})}
					style={styles.input}
					placeholder="服务标题：">
				</TextInput>

        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
          { 
            this.state.avatarSource === null ? <Text>选择图片</Text> :
            <Image style={styles.avatar} source={this.state.avatarSource} />
          }
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor:'yellow', width:60, height:20,marginTop:20,justifyContent: 'center',
        alignItems: 'center'}} onPress={this.uploadImage.bind(this)}>
          <Text>上 传</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor:'yellow',width:60, height:20, marginTop:20,justifyContent: 'center',
        alignItems: 'center'}} onPress={this.props.cancel}>
          <Text>取 消</Text>
        </TouchableOpacity>

				<TouchableHighlight onPress={this.onServOfferPres.bind(this)} style={styles.button}>
					<Text style={styles.buttonText}>
						服务修改
					</Text>
				</TouchableHighlight>



				<Text style={styles.error}>
					{this.state.error}
				</Text>


				
			</View>
		)
	}

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
	alignSelf: 'stretch',
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }  
});
