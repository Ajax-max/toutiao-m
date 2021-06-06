<template>
  <div class="update-gender">
    <van-picker
        show-toolbar
        :columns="columns"
        :datafld-index="defaultIndex"
        @confirm="onConfirm"
        @cancel="$emit('close')"
        @change="onGenderChange"
    />
  </div>
</template>

<script>
import {updateUserProfile} from "../../../api/user";

export default {
  name: "update-gender",
  props:{
    value:{
      type:Number,
      required:true
    }
  },
  data(){
    return {
      columns:['男','女'],
      defaultIndex:this.value
    }
  },
  methods: {
    onGenderChange(picker,value,index){
      this.defaultIndex = index
    },

    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止点击背景
      });
        //请求提交更新用户昵称
        await updateUserProfile({
          gender:this.defaultIndex
        });
        //提示保存成功
        this.$emit('input',this.defaultIndex)
        this.$emit("close");
        this.$toast.success("保存成功");
    },
  },
}
</script>

<style scoped>

</style>
