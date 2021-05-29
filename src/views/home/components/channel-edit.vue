<template>
  <div class="channel-edit">
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
          plain
          round
          size="mini"
          type="danger" @click="isEdit = !isEdit">{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
          class="grid-item"
          :class="{active: index == active}"
          :icon="(isEdit && index !== 0)  ? 'clear' : ''"
          v-for="(channel,index) in userChannels"
          :key="index"
          :text="channel.name"
          @click="onUserChannelClick(index)"/>
    </van-grid>

    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
          class="grid-item"
          v-for="(channel,index) in recommendChannels"
          :key="index"
          :text="channel.name"
          @click="onAdd(channel)"/>
    </van-grid>
  </div>
</template>

<script>
import {getAllChannels,addUserChannel,deleteUserChannel} from "../../../api/channel";
import {mapState} from 'vuex'
import {setItem} from "../../../utils/storage";



export default {
  name: "channel-edit",
  data(){
    return {
      allChannels:[],//存放全部数据列表
      isEdit:false,
    }
  },
  props:{
    userChannels:{
      type:Array,
      required:true
    },
    active: {
      type:Number,
      required: true
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods:{
    //加载频道
    async loadAllChannels(){
      const {data} = await getAllChannels()
      this.allChannels = data.data.channels
      console.log(this.allChannels)
    },

    //添加频道
    async onAdd(channel){
      this.userChannels.push(channel)
      if(this.user){
        //登录了，数据存储到线上
        await addUserChannel({
          channels:[
            {id:channel.id, seq:this.userChannels.length}
          ]
        })
      }else {
        //未登录，数据存储到本地
        setItem('user-channels',this.userChannels)
      }

    },

    //在编辑/非编辑的状态下 删除切换频道
    onUserChannelClick(index){
      if (this.isEdit && index !==0){
        //false(编辑) 的状态下 删除频道
        this.deletChannel(index)
      }else {
        //true(完成/非编辑) 的状态下 切换频道
        this.switchChannel(index)
      }
    },

    //删除频道函数
    async deletChannel(index,channel){
      console.log('删除频道')
      if(index <= this.active){
        this.$emit('update-active',this.active -1)
      }
      this.userChannels.splice(index,1)
      if(this.user){
        await deleteUserChannel(channel.id)
      }else {
        setItem('user-channels',this.userChannels)
      }
    },
    //切换频道函数
    switchChannel(index){
      console.log('切换成功')
      //切换频道
      this.$emit('update-active',index)
      // 退出弹出层
      this.$emit('close')
    }
  },
  computed:{
    recommendChannels(){
      //所有频道 - 我的频道 = 剩下的频道
      //filter 方法：过滤数据，根据方法返回的布尔值 true来收集数据
      //filter 方法查找满足条件所有元素
      return this.allChannels.filter(channel => {
        //判断channel 是否属于用户频道
        //find 方法查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          //找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })
      console.log(channel)
      console.log(userChannel)
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding-top: 54px;
  .channel-title{
    font-size: 16px;
    color: #333333;
  }
  .grid-item{
    width: 80px;
    height: 43px;
    /deep/ .van-grid-item__content{
      background-color: #f4f5f6;
      .van-grid-item__text{
        font-size: 14px;
        color: #222;
      }
    }
    /deep/ .van-grid-item__icon{
      position: absolute;
      right: -5px;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }
  .active{
    /deep/ .van-grid-item__text{
      color: red !important;
    }
  }
}
</style>
