import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    ProgressBarAndroid,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    StyleSheet,
    Navigator,
    AsyncStorage,
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import Header from '../components/HomeNavigation';
import ImagePicker from 'react-native-image-picker';
import UselessTextInput from '../components/UselessTextInput';
import { observable, computed, action, runInAction } from 'mobx';
var FileUpload = require('NativeModules').FileUpload;

@observer
export default class ServOffer extends PureComponent {

    render() {
        let defaultName = 'firstPageName';
        let defaultComponent = FirstPageComponent;
        return (
            <Navigator
                initialRoute={{ name: defaultName, component: defaultComponent }}　　//初始化导航器Navigator,指定默认的页面
                configureScene={
                    (route) => {
                        return Navigator.SceneConfigs.FloatFromRight;　　//配置场景动画，页面之间跳转时候的动画
                    }
                }
                renderScene={
                    (route, navigator) => {
                        let Component = route.component;
                        return <Component{...route.params} navigator={navigator} />　　//渲染场景
                    }
                }
            />
        );
    }
}

//第一个页面
class FirstPageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_desc: this.props.serv_desc,
        }
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "SecondPageComponent",
                component: SecondPageComponent,
                params: {
                    serv_title: this.state.serv_title,
                    serv_desc: this.state.serv_desc
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Sell a service'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../resource/t_text.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>What's the service?</Text>

                <Text style={{ color: "#a8a6b9" }}>I will </Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={(val) => this.setState({ serv_title: val })}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>min.15 characters</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>62</Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 20, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}
//第二个页面
class SecondPageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_desc: this.props.serv_desc,
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_desc: this.props.serv_desc,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ThirdPageComponent",
                component: ThirdPageComponent,
                params: {
                    serv_title: this.state.serv_title,
                    serv_desc: this.state.serv_desc,
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Sell a service'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../resource/t_heart.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>What makes it special?</Text>

                <Text style={{ color: "#a8a6b9" }}>Tell us more about this skill or service and \n
                    what makes it special.Price,type,time or other. </Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    onChangeText={(val) => this.setState({ serv_desc: val })}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>min.60 characters</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>62</Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 20, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}
//第三个页面
class ThirdPageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
                    serv_title: this.props.serv_title,
                    serv_desc: this.props.serv_desc,
        }
    }

    componentDidMount() {
        this.setState({
                    serv_title: this.props.serv_title,
                    serv_desc: this.props.serv_desc,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ForthPageComponent",
                component: ForthPageComponent,
                params: {
                    serv_title: this.state.serv_title,
                    serv_desc: this.state.serv_desc,
                }
            });
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Sell a service'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 80, height: 80, alignSelf: 'center' }} source={require('../resource/t_loaction.png')} />

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>How will you provide this service?</Text>

                <Text style={{ color: "#a8a6b9" }}>Tell us more about this skill or service and \n
                    what makes it special.Price,type,time or other. </Text>


                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>Remotely/online</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>Locally</Text>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this.clickJump.bind(this)}>
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}
//第四个页面
class ForthPageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
                    serv_title: this.props.serv_title,
                    serv_desc: this.props.serv_desc,
            serv_imges: this.props.serv_imges,
            errors: this.props.errors,
            fileName: this.props.fileName,
            avatarSource: this.props.avatarSource,
            imgBase64: this.props.imgBase64,
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_desc: this.props.serv_desc,
            serv_imges: this.props.serv_imges,
            errors: this.props.errors,
            fileName: this.props.fileName,
            avatarSource: this.props.avatarSource,
            imgBase64: this.props.imgBase64,
        });
    }

    clickJump() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();　　//navigator.pop 使用当前页面出栈, 显示上一个栈内页面.
        }
    }

    selectPhotoTapped() {
        const options = {
            title: '请选择',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择相册',
            quality: 0.75,
            maxWidth: 500,
            maxHeight: 500,
            allowsEditing: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
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
                    source = { uri: response.uri, isStatic: true };
                } else {
                    source = { uri: response.uri.replace('file://', ''), isStatic: true };
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

async onServOfferPres() {
    this.setState({showProgress: true})
    try {
        
      
      let response = await fetch('http://123.56.157.233:3000/serv_offers', {
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body:JSON.stringify({
                                    serv_offer:{
                                      serv_title: this.state.serv_title,
                                      serv_desc: this.state.serv_desc,
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Sell a service'
                    leftIcon={require('../resource/t_header_arrow_left.png')}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Text style={{ alignSelf: 'center', color: "#a8a6b9", fontSize: 12 }}>Sell this Audio & sound service to customers</Text>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../resource/t_text.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_title}</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../resource/t_heart.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>{this.state.serv_desc}</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../resource/t_loaction.png')} />
                    <Text style={{ color: "#a8a6b9" }}>I will</Text>
                    <Text style={{ color: "#000000" }}>XXX</Text>
                </View>

                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, alignSelf: 'center' }} source={require('../resource/t_img.png')} />
                    <Text style={{ color: "#a8a6b9" }}>Add photos or documents</Text>
                    <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                        <View style={[styles.avatar, styles.avatarContainer, { marginBottom: 20 }]}>
                            {
                                this.state.avatarSource === null ? <Text>选择图片</Text> :
                                    <Image style={styles.avatar} source={this.state.avatarSource} />
                            }
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableHighlight style={{ backgroundColor: '#81d49c', marginTop: 60, alignSelf: 'stretch' }} onPress={this.onServOfferPres.bind(this)} >
                    <Text style={{ fontSize: 22, color: '#FFF', alignSelf: 'center', backgroundColor: '#81d49c', }}>
                        下一步
                  </Text>
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
})