import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
    Alert,
    TextInput,
    Image,
    ScrollView,
    ToastAndroid,
} from 'react-native'
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import util from '../common/utils'
var Contacts = require('react-native-contacts')
export default class getFriend extends Component {
    constructor(props) {
		super(props);
		this.state =({
           name:'',
           num: '',
           in_village: this.props.village.in_village,
           user_list:[]
		});
	}
    componentWillMount(){
        let v = this.props.village
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_VILLAGE_RECOMMAND+`${v.id}?token=${global.user.authentication_token}`;
        util.get(url,
            (response)=>{
                this.setState({
                    user_list: response.feeds
                })
            },
            (error)=>{

            }
        )
    }
    componentDidMount(){

    }
    join(v_id){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ADD_VILLAGES+`?token=${global.user.authentication_token}`;
        let data={
            user_id: global.user.id,
            village_id: v_id,
        }
        util.post(url, data, (response)=>{
            if(response.status == 0){
                this.setState({
                    in_village:true
                })
                ToastAndroid.show('加入成功',ToastAndroid.LONG);
            }else{
                ToastAndroid.show('加入失败，最多只能加入6个社区',ToastAndroid.LONG);
            }
        },this.props.navigator)
    }
    out(v_id){
        let url = 'http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_DELETE_VILLAGES+`?token=${global.user.authentication_token}`;
        let data={
            user_id: global.user.id,
            village_id: v_id,
        }
        util.post(url, data, (response)=>{
            if(response.status == 0){
                this.setState({
                    in_village:false
                })
                ToastAndroid.show('退出成功',ToastAndroid.LONG);
            }
        },this.props.navigator)
    }
    render(){
        let v = this.props.village
        return(
            <View style={styles.container}>
                <View>
                    <Header
                        title='社区详情'
                        leftIcon={require('../resource/ic_back_white.png')}
                        leftIconAction = {()=>this.props.navigator.pop()}
                    />
                </View>
                <ScrollView style={{padding:10}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Image source={{uri:v.avatar}} style={{ width: 72, height: 72, borderRadius: 36}}/>
                        <View  style={{ flex: 1, justifyContent: 'space-around', marginLeft: 15 }}>
                            <Text style ={{fontSize:18,color:'#000'}}>{v.name}</Text>
                            <Text style ={{fontSize:16}}>{v.city}&nbsp;{v.district}</Text>
                            {
                                this.state.in_village?
                                <Text style={{color:global.gColors.buttonColor}}>已加入</Text>:
                                <Text style={{color:global.gColors.themeColor}}>未加入</Text>
                            }
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    {/*<View style={{marginBottom:20}}>
                        <Text style={{color:'#000',fontSize:16,lineHeight:30}}>关于</Text>
                        <Text style={{lineHeight:30}}>来自邻居们的重点推荐</Text>
                    </View>*/}
                    <Text style={{color:'#000',fontSize:16}}>来自{v.name}推荐的专业人士</Text>
                    {
                        this.state.user_list.map((data, index)=>{
                            return(
                                <View key={index} style={{marginTop:10}}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Image source={{uri:data.avatar}} style={{height:50,width:50,borderRadius:25}}/>
                                        <View style={{justifyContent:'space-between',marginLeft:10}}>
                                            <Text style={{color:'#000',fontSize:16}}>{data.name}</Text>
                                            <Text style={{fontSize:14}}>{data.goods_catalog}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View style={{height:100}}></View>
                </ScrollView>
                {
                    this.state.in_village?
                    <TouchableOpacity onPress={this.out.bind(this,v.id)} style={styles.loginButton}>
                        <Text>退出社区</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity onPress={this.join.bind(this,v.id)} style={styles.loginButton}>
                        <Text>加入社区</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    loginButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.gColors.buttonColor,
        position: 'absolute',
        bottom: 0,
        right:0,
        left: 0,
        height: 44,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
})