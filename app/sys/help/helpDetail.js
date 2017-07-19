import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Header from '../../components/HomeNavigation';

export default class HelpDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: this.props.num,
            answers: ['在动态区的顶部查看项目需求卡，通过左右滑动循环浏览雇主发布的项目需求卡；点击需求卡右上角黄色图标后，将删除该需求卡。需求卡为实时更新，为保证您能即时接收到项目信息，强烈建议您在手机设置【通知】中，打开奇客-【允许通知】，即时接收到最新项目需求。',
                '当收到客户需求卡后，点击【联系TA】并发送沟通信息后，则为竞标该项目。发布项目方可以与竞标者在线沟通，双方协商具体服务价格及细节。如双方达成合作意向，任何一方可以发起一个交易协议，经双方确认后交易生效。服务费用为双方线下自行结算。',
                '平台暂不提供在线支付服务。请竞标双方通过平台聊天功能进行充分沟通，线下自行完成交付与交易结算。给您带来不便敬请谅解',
                '平台暂不收取任何服务费用。',
                '服务方目前最多发布4个服务。',
                '发布服务/需求需要审核通过。我们希望服务/需求发布者本着真实、诚信的原则，发布自己最擅长的专业服务/或真实需求，并配有清晰精美图片及相关说明。审核时间为24小时内。审核未通过者系统会退回，您可以改进后重发。平台对扰乱秩序，发布虚假信息等不良行为采取账号永久封禁处理，希望用户珍惜自己的使用机会。感谢您的配合！']
        }
    }

    _onBack = () => {
        const { navigator } = this.props;
		navigator.pop()
	}

    render() {
        console.log(this.props.question_num)
        return(
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <Header
					title='帮助'
					leftIcon={require('../../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
                <View style={styles.container}>
                    <Text style={styles.answer}>{this.state.answers[this.state.num]}</Text>
                </View>
            </View>
        )
    }
} 

const styles = StyleSheet.create({
        answer: {
            color: 'black',
            fontSize: 16,
        },
        container: {
            flex: 1,
            padding: 16
        }
    })