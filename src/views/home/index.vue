<template>
  <div class="home-index">
    <meta name="referrer" content="no-referrer" />
<!--    搜索部分-->
    <van-nav-bar class="app-nav-bar">
      <van-button
          class="search-btn"
          slot="title"
          icon="search"
          type="info"
          to="/search"
          round>搜索
      </van-button>
    </van-nav-bar>
<!--    搜索部分-->
<!--    文章标签列表-->
    <van-tabs
        v-model="active"
        class="channel-tabs">
      <van-tab :title="channel.name"
               v-for="channel in channels"
               :key="channel.id"
               class="tab-item"
               >
<!--        文章列表-->
        <article-list :channel="channel"/>
<!--        文章列表-->
      </van-tab>
      <div
          slot="nav-right"
          class="wap-nav-placeholder"></div>
      <div
          slot="nav-right"
          @click="isChannelEditShow = true"
          class="wap-nav-wrap">
        <van-icon name="wap-nav"></van-icon>
      </div>
    </van-tabs>
<!--    文章标签列表-->
    <van-popup v-model="isChannelEditShow"
               position="bottom"
               class="channel-edit-show"
               closeable
               get-container="body"
               style="height: 100%">
      <channel-edit
          :user-channels="channels"
          :active="active"
          @close="isChannelEditShow = false"
          @update-active="active = $event"/>
    </van-popup>
  </div>
</template>

<script>
import {getUserChannels} from "../../api/user";
import {getItem} from "../../utils/storage";
import ArticleList from "../my/components/article-list";
import ChannelEdit from "./components/channel-edit";
import {mapState} from 'vuex'


export default {
  name: "home-index",
  components: {ChannelEdit, ArticleList},
  comments: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,//控制被激活的标签
      channels: [],//频道列表
      isChannelEditShow: false//控制弹出层
    }
  },
  computed:{
    ...mapState(['user'])
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的频道数据
        const {data} = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录
        const localChannels = getItem('channels')
        if (localChannels) {
          // 有本地频道数据，则使用
          channels = localChannels
        } else {
          // 没有本地频道数据，则请求获取默认推荐的频道列表
          const {data} = await getUserChannels()
          channels = data.data.channels
        }
      }
      this.channels = channels
    }
  }
}
</script>

<style scoped lang="less">
.home-index{
  /deep/ .app-nav-bar{
    .van-nav-bar__title{
      max-width: unset;
    }
    .search-btn{
      width: 277px;
      height: 32px;
      background: #5babfb;
      border: none;
      .van-button__text{
        font-size: 14px;
      }
      .van-icon{
        font-size: 16px;
      }
    }
  }
  .channel-tabs{
    /deep/.van-tab{
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line{
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background: #3296fa;
    }
  }
  .wap-nav-wrap{
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: .9;
  }
  .wap-nav-placeholder{
    width: 33px;
    flex-shrink: 0;
  }
}
</style>
