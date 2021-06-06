<template>
  <div class="ypdate-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>

    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入留言"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from "../../../api/user";

export default {
  name: "UpdateName",
  data() {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中",
        forbidclick: true, //禁止点击背景
      });
      try {
        //请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName,
        });
        //提示保存成功
        this.$emit('input',this.localName)
        this.$emit("close");
        this.$toast.success("保存成功");
      }catch(err){
          if(err && err.response && err.response.status === 409 ){
              this.$toast.fail('昵称已存在')
          }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.name-field-wrap {
  padding: 10px;
}
</style>
