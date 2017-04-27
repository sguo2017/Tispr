/**
 * Created by ljunb on 16/5/26.
 */
import {Dimensions, PixelRatio} from 'react-native';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePR: 1 / PixelRatio.get()
}

let colors = {
    themeColor: 'rgb(217, 51, 58)',
}

let storeKeys = {
    SEARCH_HISTORY_KEY: 'SEARCH_HISTORY_KEY',
    ACCESS_TOKEN_TISPR: 'ACCESS_TOKEN_TISPR',
}
let url = {
     SERV_API_ADDR: `123.56.157.233`,
     SERV_API_PORT: `8081`,
     IMG_SERV_ADDR: "123.56.157.233",
     IMG_SERV_PORT: "9090",
     //////////////////<<<<   API接口  >>>>>//////////////////////////////
     SERV_API_USER_LOGIN: `/users/sign_in`,//登录接口
     SERV_API_USER_REGI: `/users.json`, //注册接口
     SERV_API_IMG_UPLOAD_SERVLET: `/FastDFSWeb/servlet/imageUploadServlet`,//图片上传接口
     SERV_API_SERV_OFFER_ADD: `/api/goods/serv_offers?token=`,//服务提供的新增接口
     SERV_API_SERV_OFFER_INDEX: `/api/goods/serv_offers?token=`,//服务提供的list接口
	 SERV_API_SERV_OFFER_MARKS: `/api/me/favorites.json?token=`,//服务提供的收藏展示接口
     SERV_API_AVAT_UPDATE: `/api/session/users/`,//头像更新接口
     SERV_API_SYS_MSG: `/api/sys/sys_msgs?token=`,//系统消息接口
     SERV_API_ORDER_CREATE: `/api/orders/orders.json?token=`,//订单新增接口
     SERV_API_ORDER_LIST: `/api/orders/orders.json?token=`,//订单查询接口
     SERV_API_CHAT: `/api/chats/chats.json?token=`,//订单聊天沟通详情列表接口
     SERV_API_CHAT_ADD: `/api/chats/chats?token=`,//订单聊天沟通详情新增接口
     SERV_API_SERV_OFFER_COLLECT:`/api/me/favorites?token=`,//收藏服务提供的接口
     SERV_API_SERV_OFFER_COLLECT_CANCEL:`/api/me/favorites`,//取消收藏服务提供的接口
     SERV_API_ORDER_UPDATE:`/api/orders/orders`,//订单询价更新状态接口
}

let mapper = {
    'calory': {name: '热量', unit: ''},
    'protein': {name: '蛋白质', unit: '克'},
    'fat': {name: '脂肪', unit: '克'},
    'carbohydrate': {name: '碳水化合物', unit: '克'},
    'fiber_dietary': {name: '膳食纤维', unit: '克'},
    'vitamin_a': {name: '维生素A', unit: 'IU'},
    'vitamin_c': {name: '维生素C', unit: '毫克'},
    'vitamin_e': {name: '维生素E', unit: '毫克'},
    'carotene': {name: '胡萝卜素', unit: '微克'},
    'thiamine': {name: '维生素B1', unit: '毫克'},
    'lactoflavin': {name: '维生素B2', unit: '毫克'},
    'niacin': {name: '烟酸', unit: '毫克'},
    'cholesterol': {name: '胆固醇', unit: '毫克'},
    'magnesium': {name: '镁', unit: '毫克'},
    'calcium': {name: '钙', unit: '毫克'},
    'iron': {name: '铁', unit: '毫克'},
    'zinc': {name: '锌', unit: '毫克'},
    'copper': {name: '铜', unit: '毫克'},
    'manganese': {name: '锰', unit: '毫克'},
    'kalium': {name: '钾', unit: '毫克'},
    'phosphor': {name: '磷', unit: '毫克'},
    'natrium': {name: '钠', unit: '毫克'},
    'selenium': {name: '硒', unit: '毫克'}
}

export default {
    url: url,
    window: window,
    colors: colors,
    storeKeys: storeKeys,
    ingredientMapper: mapper
}