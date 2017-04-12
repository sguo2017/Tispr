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
import { observable, computed, action, runInAction } from 'mobx';
import ImagePicker from 'react-native-image-picker';
import Header from '../../components/HomeNavigation';
import UselessTextInput from '../../components/UselessTextInput';
import ServOfferConfirm from './confirm';

@observer
export default class ServOfferDelivory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            avatarSourceArray: this.props.avatarSourceArray,
        }
    }

    componentDidMount() {
        this.setState({
            serv_title: this.props.serv_title,
            serv_detail: this.props.serv_detail,
            serv_imges: this.props.serv_imges,
            avatarSourceArray: this.props.avatarSourceArray,
        });
    }

    clickJump() {
        let _this = this;
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                name: "ServOfferConfirm",
                component: ServOfferConfirm,
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
        const { navigator } = this.props;
        let title = this.state.serv_title;
        let detail = this.state.serv_detail;
        let imges = this.state.serv_imges;
        let SourceArray = this.state.avatarSourceArray;
        console.log("leave from delivory");
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
    //    console.log("this.state.avatarSourceArray: "+this.state.avatarSourceArray);
        return (
            <View style={{ flex: 1 }}>
                <Header
                    title='Delivory detail'
                    leftIcon={require('../../resource/t_header_arrow_left.png')}
                    leftIconAction = {this._onBack}
                />

                <ProgressBarAndroid color="#60d795" styleAttr='Horizontal' progress={0.9} indeterminate={false} style={{ marginTop: -10 }} />

                <Text style={{ alignSelf: 'flex-end', color: "#a8a6b9" }}>90%</Text>

                <Image style={{ width: 80, height: 80, alignSelf: 'center' }} source={require('../../resource/t_loaction.png')} />

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