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
    PixelRatio,
    Alert
} from 'react-native'
import { observer } from 'mobx-react/native'
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferDelivory from './delivory';

@observer
export default class ServOfferDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            detail_length: this.props.detail_length,
            avatarSourceArray: this.props.avatarSourceArray,
            test: this.props.test,
            getdata: this.props.getdata
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            avatarSourceArray: this.props.avatarSourceArray,
            test: this.props.test,
            //getdata: this.props.getdata
        });
    }

    clickJump() {
        if(undefined === this.state.serv_detail || this.state.detail_length<20){
            Alert.alert(
                    '提示',
                    '请输入不少于20个字符',
                    [
                        { text: '继续输入', onPress: () => console.log('确定') },
                    ]
                )
            return;
        }
        console.log("back 1");
        let _this = this;
        const { navigator } = this.props;
        console.log("go to delivory");
        console.log("this.props.serv_imges:"+this.props.serv_imges);
        console.log("this.state.serv_imges:"+this.state.serv_imges);
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferDelivory",
                component: ServOfferDelivory,
                params: {
                    serv_title: this.state.serv_title,
                    serv_detail: this.state.serv_detail,
                    serv_imges: this.state.serv_imges,
                    avatarSourceArray: this.state.avatarSourceArray,
                    getdata: (title,detail,imges,SourceArray)=>{
                    _this.setState({
                        serv_title: title,
                        serv_detail: detail,
                        serv_imges: imges,
                        avatarSourceArray: SourceArray
                        })
                    }
                }
            });
        }
    }

    _onBack = () => {
        
        // this.props.setState({
        //     serv_detail: this.state.serv_detail
        // })
        const { navigator } = this.props;
        let title = this.state.serv_title;
        let detail = this.state.serv_detail;
        let imges = this.state.serv_imges;
        let SourceArray = this.state.avatarSourceArray;
        console.log("leave from details");
        console.log("this.props.serv_imges:"+this.props.serv_imges);
        console.log("this.state.serv_imges:"+this.state.serv_imges);
        if (this.props.getdata) {
            this.props.getdata(title, detail,imges, SourceArray);
        }

        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        //console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Service details'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}                                     
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.6} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>60%</Text>

                <Image style={{ width: 50, height: 50, alignSelf: 'center' }} source={require('../../resource/t_heart.png')} />

                <Text style={{  alignSelf: 'center', color: "#000", fontSize: 16, margin: 10 }}>服务有什么特点</Text>

                <Text style={{  alignSelf: 'center', color: "#a8a6b9",paddingLeft: 10}}>详细描述服务内容，包括您的优势，专业性，价格以及时间等</Text>

                <UselessTextInput
                    multiline={true}
                    numberOfLines={3}
                    value ={this.state.serv_detail}
                    onChangeText={(val) => {this.setState({ serv_detail: val,detail_length: val.length })}}
                />

                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ color: "#a8a6b9" }}>不少于60个字符</Text>
                    <Text style={{ alignSelf: 'flex-end', right: 5, justifyContent: 'center', position: 'absolute', color: "#a8a6b9" }}>{this.state.detail_length}</Text>
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