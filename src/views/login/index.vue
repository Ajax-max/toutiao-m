<template>
  <div class="login-index">
    <!--    导航-->
    <van-nav-bar
        class="app-nav-bar"
        title="登录/注册"
        left-arrow
        @click-left="$router.back()"
    />
    <van-form
              :show-error="false"
              ref="login-from"
              :show-error-message="false"
              @failed="onFailed"
              @submit="onLogin">
      <!--      登录表单-->
      <van-field
          v-model="user.mobile"
          left-icon="phone-o"
          placeholder="输入手机号"
          name="mobile"
          :rules="forRules.mobile"
      />
      <van-field
          v-model="user.code"
          clearable
          left-icon="exchange"
          placeholder="请输入验证码"
          name="code"
          :rules="forRules.code"
      >
        <template #button>
          <van-count-down
          :time="1000 * 60"
          format="ss s"
          v-if="isCountDownShow"
          @finish="isCountDownShow = false"
          />
          <van-button size="mini"
                      round
                      :loading="isSendSmsLoading"
                      @click.prevent="onSendSms"
                      v-else>发送验证码</van-button>
        </template>
      </van-field>
    <!--    按钮-->
    <div class="login-btn-wrap">
      <van-button class="login-btn" type="info" block>登录</van-button>
    </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms} from "../../api/user";
import {Toast} from 'vant'


export default {
  name: "login-index",
  comments:{},
  props:{},
  data(){
    return {
      user:{
        mobile:"",
        code:""
      },
      // 判断倒计时显示
      isCountDownShow:false,
      isSendSmsLoading: false,
      forRules:{
        mobile: [
          {required:true, message:'请输入手机号'},
          {pattern:/^1[3|5|7|8|9]\d{9}$/,message: '手机格式错误'}
        ],
        code:[
          {required:true, message:'请输入密码'},
          {pattern:/^\d{6}$/, message: '手机号码错误'}
        ]
      }
    }
  },
  methods:{
    //1.找到数据接口
    //2.封装请求方法
    //3.请求调用登录
    async onLogin(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration:0
      })
      try {
        const {data} = await login(this.user)
        // console.log(data)
        // console.log(data.data)
        // 将后端返回的用户登录状态（token等数据）放到Vuex容器里
        this.$store.commit('setUser',data.data)
        // 登录成功跳转到原来页面
        this.$router.back()
        Toast.success('登录成功')
      } catch (err){
        // console.log(err)
        // console.log('登录失败')
        Toast.fail('登录失败')
      }
      // const res = await login(this.user)
      // console.log(res)
      //4.处理响应结果
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    async onSendSms(){
      try{
        //检验手机号码
        await this.$refs['login-from'].validate('mobile')
        const res = await sendSms(this.user.mobile)
        console.log(res)
        // 短信发出去时隐藏按钮显示倒计时
        this.isCountDownShow = true
      }catch (err){
        console.dir(err)
        let message = ''
        if(err && err.response && err.response.status === 429){
          // 发送短信失败的错误
          message = '发送太频繁了'
        }else if (err.name === 'mobile'){
          message = err.message
        }else {
          message = "发送失败"
        }
        this.isSendSmsLoading = false
        //提示用户手机号码有误
        this.$toast({
          message:message,
          position:'top'
        })
      }
    }
  },
}
</script>

<style scoped lang="less">

.login-field{
  .van-button{
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text{
      font-size: 11px;
      color: #666666;
    }
  }
}

.login-btn-wrap{
  padding: 16px 26px;
  .login-btn{
    background-color: #6db4fb;
    border: none;
    .van-button__text{
      font-size: 15px;
    }
  }
}
</style>
