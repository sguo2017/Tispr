
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
    ADDRESS_COMPONENT: 'ADDRESS_COMPONENT',
    HAS_SEEN_SWIPER_USER: 'HAS_SEEN_SWIPER_USER',
    HAS_SEEN_TOTAL_RESTIMES_PAGE: 'HAS_SEEN_TOTAL_RESTIMES_PAGE',
}

let orderStatus = {
    INQUIRIED : "inquiried",
    OFFERED : "offered",
    CONFIRMED : "confirmed"
}
/*
    A|a|1 ：对应场景00A 某人新增goods[serv_catagory=serv_request]，由系统向同城人新建一条此类型的数据,user_id=新增人，accept_user_id=推送同城人；
    B|b|2 ：对应场景00B 在pc端由管理员新建消息，发布范围：所有人、按区域选择接受人
    C|c|3 ：对应场景00C 动态消息列表
    ALL|all|0 ：得到全部信息
*/
let sysMsgCatalog = {
    PRIVATE: '1',
    SYSTEM: '2',
    PUBLIC: '3',
    ALL: '0'
}

let sys_msgs_status = {
    CREATED: 'created',
    UNREAD: 'unread',
    READ: 'read',
    DISCARDED: 'discarded',
    FINISHED: 'finished'
}

let serv_qry_type = {
    OFFER: '1', //我的->服务
    REQUEST: '2',//我的->需求
}

let order_qry_type = {
    PERSONAL: 'personal', //消息->消息
    BIDDER: 'bidder',//动态->卡片->邀标列表
}

let error_type = {
    USER_IS_NIL: -101,
    DEFAULT: -1,
}

let default_img={
    AVATAR:'http://47.92.27.52:8080/group1/M00/00/04/ezid6Vk98BqAFb5QAAAQGOym6eI771.jpg'
}
let url = {
    // //////////////////<<<<   图片服务器  >>>>>//////////////////////////////
    //  IMG_SERV_ADDR: "123.56.157.233",
    //  IMG_SERV_PORT: "9090",
    //  SERV_API_IMG_UPLOAD_SERVLET: `/FastDFSWeb/servlet/imageUploadServlet`,//图片上传接口
    //  //////////////////<<<<   API接口  >>>>>//////////////////////////////
    //  SERV_API_ADDR: `123.56.157.233`,
    //  SERV_API_PORT: `8082`,
     //////////////////<<<<   图片服务器  >>>>>//////////////////////////////
     IMG_SERV_ADDR: "47.92.27.52",
     IMG_SERV_PORT: "9090",
     SERV_API_IMG_UPLOAD_SERVLET: `/FastDFSWeb/servlet/imageUploadServlet`,//图片上传接口
     //////////////////<<<<   API接口  >>>>>//////////////////////////////
     SERV_API_ADDR: `47.92.27.52`,
     SERV_API_PORT: `8081`,
     SERV_API_USER_LOGIN: `/api/users/sessions`,//登录接口
     SERV_API_USER_REGI: `/api/users/registrations`, //注册接口
     SERV_API_USER_PASSWORD: `/api/users/passwords`,//忘记密码接口
     SERV_API_CHECK_PASSWORD: `/api/users/sessions?check_password=1`,//验证密码接口
     SERV_API_SERV_OFFER_ADD: `/api/goods/serv_offers?token=`,//服务提供的新增接口
     SERV_API_SERV_OFFER_EDIT:`/api/goods/serv_offers/`,//服务的更新接口
     SERV_API_SERV_OFFER_INDEX: `/api/goods/serv_offers?token=`,//服务提供的list接口
	 SERV_API_SERV_OFFER_MARKS: `/api/me/favorites.json?token=`,//服务提供的收藏展示接口
     SERV_API_AVAT_UPDATE: `/api/users/registrations/`,//头像更新接口
     SERV_API_SYS_MSG: `/api/sys/sys_msgs?token=`,//系统消息接口
     SERV_API_ORDER_CREATE: `/api/orders/orders.json?token=`,//订单新增接口
     SERV_API_ORDER_LIST: `/api/orders/orders.json?token=`,//订单查询接口
     SERV_API_CHAT: `/api/chats/chats.json?token=`,//订单聊天沟通详情列表接口
     SERV_API_CHAT_ADD: `/api/chats/chats?token=`,//订单聊天沟通详情新增接口
     SERV_API_SERV_OFFER_COLLECT:`/api/me/favorites?token=`,//收藏服务提供的接口
     SERV_API_SERV_OFFER_COLLECT_CANCEL:`/api/me/favorites`,//取消收藏服务提供的接口
     SERV_API_ORDER_UPDATE:`/api/orders/orders`,//订单询价更新状态接口
     SERV_API_SMS_SEND_ADD:`/api/sys/sms_sends.json`,//登录生成短信验证码
     SERV_API_SMS_SEND_CHANGE_PHONE:`/api/sys/sms_sends?change_phone=1`,//更改手机号生成短信验证码
     SERV_SPI_SMS_SEND_REGISTER_PHONE:`/api/sys/sms_sends?register_phone=1`,//注册生成短信验证码
     SERV_API_PHONE_LOGIN:`/api/users/phone_login`,//短信验证码登录
     SERV_API_CHANGE_PHONE:`/api/users/sms_login?change_phone=1`,//更换手机号码接口
     SERV_API_TOKEN_LOGIN: `/api/users/token_login?token=`,//token登录
     SERV_API_GOODS_CATALOG:`/api/goods/goods_catalogs?token=`,//商品分类
     SERV_API_SYS_MSGS_QUERIES:`/api/sys_msgs_timelines/sys_msgs_queries?token=`,//系统消息查询API
     SSRV_API_SYS_MSGS_TIMELINES:`/api/sys_msgs_timelines/sys_msgs_timelines/`,//系统消息操作API
     SERV_API_SUGGESTION:`/api/suggestion/suggestions?token=`,//反馈意见API
     SERV_API_REPORT:`/api/suggestion/reports?token=`,//举报API
     SERV_API_PHONE_SETTING: `/api/users/phone_call/`,//接听电话时间设置API
     SERV_API_PERSON_INFO: `/api/users/users/`,//用户信息API
     //////////////////<<<<   GEOAPI服务器  >>>>>//////////////////////////////
     GEO_LOCATION_ADDR: "http://api.map.baidu.com/geocoder/v2/?output=json&pois=1&ak=ZFFEI4cl338WSpoGsGSuHhpxiQpuEnfe"
     
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
    ingredientMapper: mapper,
    sysMsgCatalog: sysMsgCatalog,
    sys_msgs_status: sys_msgs_status,
    serv_qry_type: serv_qry_type,
    default_img: default_img,
    orderStatus: orderStatus,
    order_qry_type: order_qry_type,
    error_type: error_type
}