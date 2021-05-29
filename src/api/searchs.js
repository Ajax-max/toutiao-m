// 用户相关请求模块
import request from "../utils/request";

// 获取所以频道列表
export const getSearchSuggestions = q => {
    return request({
        method: 'GET',
        url: '/app/v1_0/suggestion',
        params:{
            q
        }
    })
}
