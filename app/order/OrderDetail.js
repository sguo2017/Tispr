import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    WebView,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Platform,
    Dimensions,
    TextInput,
    Alert,
    Modal
} from 'react-native';
import Header from '../components/HomeNavigation';
import Constant from '../common/constants';
import CloseDeal from './CloseDeal';
import ProposeDeal from './ProposeDeal'

const screenW = Dimensions.get('window').width;

export default class OrderDetail extends Component {
    constructor(props) {  
        super(props);  
        this.state = {  
        show:false,  
        };  
    }
     _leftButtonClick() {  
      const { navigator } = this.props;
      const { feed } = this.props;
        if (navigator) {
        navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
            name: "ProposeDeal",
            component: ProposeDeal,
            passProps: {feed}
        });
        }
    }  
    _rightButtonClick() {  
        this._setModalVisible();  
    }  
    
    // 显示/隐藏 modal  
    _setModalVisible() {  
        let isShow = this.state.show;  
        this.setState({  
        show:!isShow,  
        });  
    }  

    async clickJump() {
        let isShow = this.state.show;  
        try {         
            let t = global.user.authentication_token;
            let order_id = this.props.feed.id;
            let url ='http://' + Constant.url.SERV_API_ADDR + ':' + Constant.url.SERV_API_PORT + Constant.url.SERV_API_ORDER_UPDATE +'/' +order_id +'?token='+ t;            
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order: {
                        status: '00C',
                    }
                })
            });
             let res = await response.text();
            if (response.status >= 200 && response.status < 300) {
                this.setState({  
                    show:!isShow,  
                });
                const { navigator } = this.props;
                if (navigator) {
                navigator.push({　　//navigator.push 传入name和你想要跳的组件页面
                    name: "CloseDeal",
                    component: CloseDeal,
                });
                }
            } else {
                let error = res;
                throw error;
            }
        } catch (error) {
            this.setState({ error: error });
        } 
    }
    // showAlert(){
    //     Alert.alert(
    //                     'Do you want to confirm the deal?',
    //                         'If everyone confirms, the deal is made and the request is awarded.',
    //                     [
    //                     {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
    //                     {text: 'Yes', onPress: this.clickJump()},
    //                     ]
    //                 )
    // }
    render(){
        const { feed } = this.props;
        return (
            <View>
                <Header
                        leftIconAction={() => this.props.navigator.pop()}
                        title={'Current Proposal'}
                        leftIcon={require('../resource/ic_back_dark.png')}
                        rightIcon={{uri: feed.request_user_avatar}}
                        rightIconSize={26}
                    />
                <View style={[styles.cardImageContent]}>
                    <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={true}
                            contentContainerStyle={{backgroundColor: 'white'}}
                    >
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW}}>
                            <Image style={{width: 50, height: 50, borderRadius:25}} defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.offer_user_avatar}}/>
                            <View style={{paddingLeft: 10}}>
                                <Text style={{fontSize:20, color:'black'}}>{feed.offer_user}</Text>
                                <Text style={{fontSize: 16}}>{feed.serv}</Text>
                            </View>
                            {
                                 feed.bidder== feed.offer_user_id ?
                                <View style={{flexDirection:'row',width:screenW*0.2, justifyContent:'flex-end'}}>
                                    <Image style={{width:30, height: 30}} source={require('../resource/icon_check_img.png')}/>
                                </View> :
                                <View></View>
                            }
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center',padding:10, width: screenW,backgroundColor:'white'}}>
                            <Image style={{width: 50, height: 50, borderRadius:25}} defaultSource={require('../resource/user_default_image.png')} source={{uri: feed.request_user_avatar}}/>
                            <View style={{paddingLeft: 10}}>
                                <Text style={{fontSize:20, color:'black'}}>{feed.request_user}</Text>
                                <Text style={{fontSize: 16}}>{feed.lately_chat_content}</Text>
                            </View>
                            {
                                 feed.bidder== feed.request_user_id ?
                                <View style={{flexDirection:'row',width:screenW*0.2, justifyContent:'flex-end'}}>
                                    <Image style={{width:30, height: 30}} source={require('../resource/icon_check_img.png')}/>
                                </View>:
                                <View></View>
                            }
                        </View>
                        <View style={{flexDirection:'row',paddingTop: 30, paddingLeft: 10,}}>
                            <Text style={{fontSize: 16, color:'black', }}>
                               {feed.lately_chat_content}
                            </Text>
                        </View>
                    </ScrollView>
                    {
                        global.user.id == feed.signature?
                        <View>
                         <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',
                                    justifyContent: 'center',
                                    borderTopColor: '#ccc',
                                    position: 'absolute',
                                    bottom: 5,
                                    backgroundColor: '#665dc6',width: screenW*0.5,height:44}}
                            onPress={this._leftButtonClick.bind(this)}
                        >
                           
                            <Image style={{width:30, height: 30}} source={require('../resource/ic_my_order.png')}/>
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                            新的提议
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.75}
                            style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',borderTopColor: '#ccc',position: 'absolute',
                            bottom: 5,left: screenW*0.5,backgroundColor: '#81d49c',width: screenW*0.5,height:44}}
                            onPress={this._rightButtonClick.bind(this)}
                        >
                        
                            <Image style={{width:30, height: 30}} source={require('../resource/ic_modal_window_submit.png')}/>
                            <Text style={{ fontSize: 22, color: '#FFF' }}>
                            确认交易
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : <View></View>
                    }
                </View>
                 <Modal  
                    animationType='slide'  
                    transparent={true}  
                    visible={this.state.show}  
                    onShow={() => {}}  
                    onRequestClose={() => {}} >  
                    <View style={styles.modalStyle}>  
                        <View style={styles.subView}>  
                        <Text style={styles.titleText}>  
                           您是否确认本次交易？
                        </Text>  
                        <Text style={styles.contentText}>  
                            如果您确认了交易，将会产生订单，并开始分配服务  
                        </Text>  
                        <View style={styles.horizontalLine} />  
                        <View style={styles.buttonView}>  
                            <TouchableHighlight underlayColor='transparent'  
                            style={styles.buttonStyle}  
                            onPress={this._setModalVisible.bind(this)}>  
                            <Text style={styles.buttonText}>  
                                取消  
                            </Text>  
                            </TouchableHighlight>  
                            <View style={styles.verticalLine} />  
                            <TouchableHighlight underlayColor='transparent'  
                            style={styles.buttonStyle}  
                            onPress={this.clickJump.bind(this)}>  
                            <Text style={styles.buttonText}>  
                                确定  
                            </Text>  
                            </TouchableHighlight>  
                        </View>  
                        </View>  
                    </View>  
                    </Modal>  
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
    cardImageContent: {
        height: Constant.window.height - (Platform.OS === 'ios' ? 64 : 50) - 18,
        width: Constant.window.width,
        backgroundColor: '#f5f5f5',
        top: Platform.OS === 'ios' ? 64 : 50,
        position: 'absolute'
    },
    // modal的样式  
  modalStyle: {  
    // backgroundColor:'#ccc',  
    alignItems: 'center',  
    justifyContent:'center',  
    flex:1,  
  },  
  // modal上子View的样式  
  subView:{  
    marginLeft:40,  
    marginRight:40,  
    backgroundColor:'#fff',  
    alignSelf: 'stretch',  
    justifyContent:'center',  
    borderRadius: 10,  
    borderWidth: 0.5,  
    borderColor:'#ccc',  
  },  
  // 标题  
  titleText:{  
    marginTop:10,  
    marginBottom:5,  
    fontSize:18,
    color: 'black',  
    fontWeight:'bold',  
    textAlign:'center',  
  },  
  // 内容  
  contentText:{  
    margin:8,  
    fontSize:18,  
    color:'black',
    textAlign:'center',  
  },  
  // 水平的分割线  
  horizontalLine:{  
    marginTop:5,  
    height:0.5,  
    backgroundColor:'#ccc',  
  },  
  // 按钮  
  buttonView:{  
    flexDirection: 'row',  
    alignItems: 'center',  
  },  
  buttonStyle:{  
    flex:1,  
    height:44,  
    alignItems: 'center',  
    justifyContent:'center',  
  },  
  // 竖直的分割线  
  verticalLine:{  
    width:0.5,  
    height:44,  
    backgroundColor:'#ccc',  
  },  
  buttonText:{  
    fontSize:16,  
    color:'#3393F2',  
    textAlign:'center',  
  }
})