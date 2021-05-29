// 用户相关请求模块
import request from "../utils/request";
// 在非组件模块中获取store必须通过这种方法
// 这里单独加载store和在组件中this.$store一个东西
import store from '../store'
// 登录/注册
export const login = data =>{
    return request({
        method: 'POST',
        url: "/app/v1_0/authorizations",
        data
    })
}

//发送验证码
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user',
        // 发送请求头数据
        // headers: {
        //     // 注意：该接口需要授权才能访问
        //     //       token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

/**
 * 获取用户列表信息
 */
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels',
    })
}
