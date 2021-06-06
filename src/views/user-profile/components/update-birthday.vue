<template>
  <div class="update-birthday">
    <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
    />
  </div>
</template>

<script>
import {updateUserProfile} from "../../../api/user";
import dayjs from "dayjs";

export default {
  name: "update-birthday",
  props:{
    value:{
      type:String,
      required:true
    }
  },
  created() {
    console.log(this.value)
  },
  data() {
    return {
      minDate: new Date(1500,4,20),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods:{
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止点击背景
      });
      const data = dayjs(this.currentDate).format('YYYY-MM-DD')
      //请求提交更新用户昵称
      await updateUserProfile({
        birthday:data
      });
      //提示保存成功
      this.$emit('input',data)
      this.$emit("close");
      this.$toast.success("保存成功");
    },
  }
}
</script>

<style scoped>

</style>
