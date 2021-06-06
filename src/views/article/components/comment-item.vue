<template>
<!--  文章评论项-->
  <van-cell class="comment-item">
    <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        width="36"
        height="36"
        src='https://img01.yzcdn.cn/vant/cat.jpeg'
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{comment.aut_name}}</div>
        <div class="like-wrap">
          <van-icon :name="comment.is_liking ? 'good-job' : 'good-job-o'"
                    :class="{liked:comment.is_liking}"
                    class="like-icon" @click="onCommentLike"/>
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{comment.content}}</div>
      <div>
        <span class="pibdate">{{comment.pubdate | datetime('MM:DD HH:mm')}}</span>
        <van-button round
                    size="mini"
                    class="reply-btn"
                    @click="$emit('reply-click',comment)">
          {{comment.reply_count}}回复
        </van-button>
      </div>
    </div>

  </van-cell>
</template>

<script>
import {addCommentLike,deleteCommentLike} from "../../../api/comment";

export default {
  name: "comment-item",
  props:{
    comment:{
      type:Object,
      required:true
    }
  },
  methods:{
    async onCommentLike(){
      const commentId = this.comment.com_id.toString()
      if(this.comment.is_liking){
        // 已点赞 取消点赞
        await deleteCommentLike(commentId)
        this.comment.reply_count--
      }else {
        //没有点赞 添加点赞
        await addCommentLike(commentId)
        this.comment.reply_count++
      }
      //更新视图
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style scoped lang="less">
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  //.reply-btn {
  //  width: 35px;
  //  height: 48px;
  //  line-height: 48px;
  //  //font-size: 21px;
  //  color: #222;
  //}
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
</style>
