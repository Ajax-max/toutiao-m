<template>
    <div class="my-container">
<!--      单元格 div-->
      <van-cell-group class="my-info" v-if="user">
<!--        头像 昵称 编辑资料-->
        <van-cell
            :border="false"
            class="base-info"
            title="单元格"
            value="内容"
            center
        >
          <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="currentUser.photo"
          />
          <div slot="title" class="name">{{currentUser.name}}</div>
          <van-button
              size="small"
              round
              class="update-btn"
              to="/user/profile"
          >编辑资料</van-button>
        </van-cell>
<!--        头像 昵称 编辑资料-->
        <!--        头条关注粉丝获赞-->
        <van-grid :border="false" class="data-info">
          <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
              <div class="count">{{currentUser.art_count}}</div>
              <div class="text">头条</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
              <div class="count">{{currentUser.follow_count}}</div>
              <div class="text">关注</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
              <div class="count">{{ currentUser.fans_count }}</div>
              <div class="text">粉丝</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div slot="text" class="text-wrap">
              <div class="count">{{ currentUser.like_count }}</div>
              <div class="text">获赞</div>
            </div>
          </van-grid-item>
        </van-grid>
        <!--        头条关注粉丝获赞-->
      </van-cell-group>
      <!--      单元格 div-->
<!--      登录/注册-->
      <div v-else class="not-login">
        <div @click="$router.push('/login')">
          <img src="./mobile.png" alt="手机" class="mobile">
        </div>
        <div class="text">登录/注册</div>
      </div>
<!--      登录/注册-->
      <!--        收藏 历史-->
        <van-grid :column-num = 2 class="nav-grid mb-4">
          <van-grid-item icon="star-o" text="收藏" class="nav-grid-item" />
          <van-grid-item icon="browsing-history-o" text="历史" class="nav-grid-item" />
        </van-grid>
<!--        收藏 历史-->
        <van-cell title="消息通知" is-link to="" />
        <van-cell class="mb-4" title="小智同学" is-link to="" />
        <van-cell title="退出登录" class="logout-cell" v-if="user" @click="onLgout"/>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import {getUserInfo} from "../../api/user";


export default {
  name: "my-index",
  data(){
    return {
      currentUser:{}
    }
  },
  computed:{
    ...mapState(['user'])
  },
  methods:{
    onLgout(){
      // 提示确认
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？',
      })
          .then(() => {
            // 确认执行这里
            // on confirm
            this.$store.commit('setUser',null)
          })
          .catch(() => {
            // 退出执行这里
            // on cancel
          });
    },
    async loadCurrentUser(){
      // const res = await getUserInfo()
      // console.log(res)
      // console.log(res.data)
      // console.log(res.data.data)
      const {data} = await getUserInfo()
      this.currentUser = data.data
      console.log(data)
      // console.log(data.data)
    }
  },
  created() {
    this.loadCurrentUser()
  }
}
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;

    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        color: #fff;
      }
      .update-btn {
        height: 16px;
      }
    }
    .data-info{
      .data-info-item{
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          //.count {
          //  font-size: 18px;
          //}
          .text {
            font-size: 11px;
          }
        }
      }
    }
  }
  .not-login{
    height: 180px;
    background: url("banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile{
      width: 66px;
      height: 66px;
    }
    .text{
      font-size: 14px;
      color: #fff;
    }
  }
  /deep/ .van-grid-item__content {
    background-color: unset;
  }

  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
      color: #ed6a0c;
      .van-grid-item__text{
        font-size: 14px;
      }
    }
  }
  .logout-cell{
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
