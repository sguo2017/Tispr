import React, { Component, PureComponent } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	TouchableHighlight
} from 'react-native'
import Header from '../components/HomeNavigation';
import MyRecommand from './account/MyRecommand';
import MyFavorite from './account/MyFavorite';
import MyRequest from './account/MyRequest';
import MarkList from  '../explore/MarkList';
import setting from  './Setting';
export default class Setting extends Component {

	constructor(props) {
		super(props);

	}

	_onBack = () => {
		const { navigator } = this.props;
		if (this.props.getdata) {
                this.props.getdata(global.user.avatar, global.user.profile, global.user.website, global.user.name);
        }
		navigator.pop();
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					title='更多'
					leftIcon={require('../resource/ic_back_white.png')}
					leftIconAction={this._onBack.bind(this)}
				/>
				<ScrollView ref='_scrollView'>
					<TouchableOpacity style={[styles.rectangle_view, { borderTopColor: '#dedfe0', borderTopWidth: 1 }]} onPress={() => this.props.navigator.push({component:MyRecommand})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text}>我的推荐</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:MyRecommand})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								我的社区
			  			</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
                    <TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:MarkList,name:'MarkList'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								我的收藏
			  				</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
                    <TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:MyRequest,name:'MyRequest'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								我的需求
			  				</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.rectangle_view} onPress={() => this.props.navigator.push({component:MyFavorite,name:'MyFavorite'})}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								需求存档
			  				</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
					
					<TouchableOpacity 
                    style={[styles.rectangle_view, { marginTop: 10}]}
                    onPress={()=>this.props.navigator.push({component:setting})}
                    >
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={styles.rectangle_text} >
								设置
							</Text>
						</View>
						<Image source={require('../resource/g_chevron right.png')} style={{ alignSelf: 'center', width: 20, height: 20 }} />
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f7f7f7',
	},
	three_image_view: {
		paddingTop: 15,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: 'white',
	},
	vertical_view: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		paddingBottom: 15,
	},
	top_text: {
		marginTop: 5,
		color: 'black',
		fontSize: 16,
		textAlign: 'center'
	},
	rectangle_view: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 10,
		paddingRight: 15,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: 'white',
		borderBottomColor: '#eeeeee',
		borderBottomWidth: 1,
		height:50
	},
	rectangle_text: {
		color: '#1b2833',
		fontSize: 16,
		textAlign: 'center',
		paddingLeft: 8,
	},
	button: {
		margin: 7,
		padding: 5,
		alignItems: 'center',
		backgroundColor: '#eaeaea',
		borderRadius: 3,
	},

});