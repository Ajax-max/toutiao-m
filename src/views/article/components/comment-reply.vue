<template>
<!--  文章评论回复-->
  <div class="comment-reply">
<!--    头部信息-->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross"/>
    </van-nav-bar>
<!--    头部信息-->
<!--    当前评论项-->
    <comment-item :comment="comment"/>
    <comment-list :source="comment.com_id"
                  type="c"
                  :list="commentList"/>
<!--    当前评论项-->
<!--    底部评论-->
    <div class="article-bottom">
      <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
      >写评论</van-button>
    </div>
<!--    底部评论-->
<!--    发布回复-->
<!--    发布回复-->
    <van-popup v-model="isPostShow"
               position="bottom">
      <comment-post :target="comment.com_id"
                    :article-id="articleId"
                    @post-success="onPostSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import CommentPost from "./comment-post";
export default {
  name: "comment-reply",
  components: {CommentPost, CommentList, CommentItem},
  props:{
    comment:{
      type:Object,
      required:true
    },
    articleId:{
      type:[Object,Number,String],
      required: true
    }
  },
  data(){
    return{
      isPostShow:false,
      commentList:[],//评论的回复列表
    }
  },
  methods:{
    onPostSuccess(comment) {
      //把文章数据发布到评论列表顶部
      this.commentList.unshift(comment)
      //更新评论的总数量
      this.comment.reply_count++
      //关闭发布评论弹出层
      this.isPostShow = false
    }
  }
}
</script>

<style scoped lang="less">
.article-bottom{
  background-color: #f6f6f6;
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items:center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn{
    width: 200px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
}
</style>
