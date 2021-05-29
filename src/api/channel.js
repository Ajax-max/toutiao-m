// 用户相关请求模块
import request from "../utils/request";

// 获取所以频道列表
export function getAllChannels () {
    return request({
        method: 'GET',
        url: '/app/v1_0/channels'
    })
}
export const addUserChannel = data =>{
    return request({
        method:"PATCH",
        url:"/app/v1_0/user/channels",
        data
    })
}
/**
 * 删除用户频道
 */
export const deleteUserChannel = channelId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/channels/${channelId}`
    })
}
