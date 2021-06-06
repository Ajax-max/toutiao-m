<template>
  <div class="user-porfile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 导航栏 -->
    <van-cell title="头像" is-link center>
      <van-image
        width="35"
        height="35"
        round
        fit="cover"
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" is-link :value="user.name" @click="isEditNameShow = true"></van-cell>
    <van-cell title="性别" is-link :value="user.gender === 0 ?  '男' : '女'" @click="isEditGenderShow = true"></van-cell>
    <van-cell title="生日" is-link :value="user.birthday" @click="isEditBirthdayShow = true"></van-cell>
<!--    修改年龄-->
    <van-popup v-model="isEditNameShow" position="bottom" :style="{ height: '100%' }" >
        <update-name @close="isEditNameShow = false"
                     v-model="user.name"
                     v-if="isEditNameShow"
                     />
    </van-popup>
<!--    修改年龄-->
<!--      修改性别-->
    <van-popup v-model="isEditGenderShow" position="bottom" :style="{ height: '40%' }" >
      <update-gender v-model="user.gender"
                     @close="isEditGenderShow = false"></update-gender>
    </van-popup>
<!--    修改性别-->
<!--    修改生日-->
    <van-popup v-model="isEditBirthdayShow" position="bottom"  >
      <update-birthday v-model="user.birthday" @close="isEditBirthdayShow = false" v-if="isEditBirthdayShow"/>
    </van-popup>
<!--    修改生日-->
  </div>
</template>

<script>
import {getUserProfile} from '../../api/user'
import updateName from './components/update-name.vue';
import UpdateGender from "./components/update-gender";
import UpdateBirthday from "./components/update-birthday";

export default {
  components: {UpdateBirthday, UpdateGender, updateName },
  name: "UserPorfile",
  data(){
      return {
          user:{},//保存用户数据
          isEditNameShow:false,
          isEditGenderShow:false,
          isEditBirthdayShow:false
      }
  },
  created(){
      this.loadUserProfile()
  },
  methods:{
      async loadUserProfile(){
          const {data} = await getUserProfile()
          console.log(data);
          this.user = data.data
      }
  }
};
</script>

<style lang="less" scoped>
.van-popup{
    background-color: #f5f7f9 ;
}
</style>
