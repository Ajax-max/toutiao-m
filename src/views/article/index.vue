<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
        class="page-nav-bar"
        left-arrow
        title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->
<!--    关于用户的部分 名字 内容 关注 头像 发布时间 文章评论-->
    <div class="article-wrap">
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{article.aut_name}}</div>
        <van-image slot="icon" class="avatar" round fit="cover" :src="article.aut_photo"></van-image>
        <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
        <van-button class="follow-btn"
                    round
                    size="small"
                    :type="article.is_followed ? 'default' : 'info'"
                    :icon="article.is_followed ? '' : 'plus'"
                    @click="onFollow"
                    :loading="isFollowLoading" >{{article.is_followed ? '已关注' : '关注'}}</van-button>
      </van-cell>
      <div class="markdown-body"
           v-html="article.content"
           ref="article-content"></div>

<!--      文章评论-->
      <comment-list :source="articleId"
                    :list="commentList"
                    @update-total-count="totalCommentCount = $event"
                    @reply-click="onReplyClick"/>
    </div>
    <!--    关于用户的部分 名字 内容 关注 头像 发布时间 文章评论-->

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
          name="comment-o"
          :info="totalCommentCount"
          color="#777"
      />
      <van-icon
          @click="onCollect"
          class="star-o"
          :color="article.is_collected ? 'orange' : '#777'"
          :name="article.is_collected ? 'star' : 'star-o'"
      />
      <van-icon
          class="good-job-o"
          :color="article.attiude === 1 ? 'pink' : '#777'"
          :name="article.attiude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
      />
      <van-icon name="share" color="#777777" class="share"></van-icon>
    </div>
    <!-- /底部区域 -->
<!--    发布评论-->
    <van-popup v-model="isPostShow"
               position="bottom"
    >
      <comment-post :target="articleId"
                    @post-success="onPostSuccess"
                    />
    </van-popup>
<!--    发布评论-->
<!--    评论恢复-->
    <van-popup v-model="isReplyShow"
               position="bottom">
      <comment-reply :comment="replyComment"
                     :article-id="articleId"
                     v-if="isReplyShow"
                     @close="isReplyShow = false"/>
    </van-popup>
<!--    评论恢复-->
  </div>
</template>

<script>
import {deleteCollect,addCollect, getArticleById,addLike,deleteLike} from "../../api/article";
import {ImagePreview} from 'vant'
import {addUser , delUser} from "../../api/user";
import './github-markdown.css'
import CommentList from "./components/comment-list";
import CommentPost from "./components/comment-post";
import CommentReply from "./components/comment-reply";


export default {
  name: "index",
  components: {CommentReply, CommentPost, CommentList},
  props:{
    articleId:{
      type:[String,Number,Object],
      required:true
    }
  },
  data(){
    return {
      article:{},//文章数据对象
      isFollowLoading:false,//关注用户按钮的loading状态
      isCollectLoading:false,//收藏的loading状态
      isPostShow:false,//控制发布评论显示状态
      commentList:[],//文章评论列表
      totalCommentCount:0,//评论的总数量
      isReplyShow:false,//控制评论回复的显示状态
      replyComment:{},//当前回复评论对象
    }
  },
  created() {
    this.loadArticle()
  },
  methods:{
    async loadArticle(){
      const {data} = await getArticleById(this.articleId)
      this.article = data.data
      console.log(this.article)
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },
    handlePerviewImage(){
      //获取文章内容DOM容器
      const articleContent = this.$refs['article-content']
      //得到所有img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = []
      imgs.forEach((img,index) =>{
        imgPaths.push(img.src)
        img.onclick = function (){
          ImagePreview({
            images:imgPaths,
            startPosition:index
          })
        }
      })
    },
    //关注用户函数
    async onFollow(){
      this.isFollowLoading = true
      if(this.article.is_followed){
        //已关注，取消关注
        await delUser(this.article.aut_id)
      }else {
        //没有关注，添加关注
        await addUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    //收藏文章函数
    async onCollect(){
      this.$toast.loading({
        message:'操作中...',
        forbidClick:true
      })
      if(this.article.is_collected){
        //已收藏，取消收藏
        await deleteCollect(this.articleId)
      }else {
        //没有收藏，添加收藏
        await addCollect(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    //给文章点赞函数
    async onLike(){
      this.$toast.loading({
        message:'操作中...',
        forbidClick:true
      })
      if(this.article.is_collected){
        //已点赞，取消点赞
        await deleteLike(this.articleId)
        this.article.artitude = -1
      }else {
        //没有点赞，添加点赞
        await addLike(this.articleId)
        this.article.artitude = 1
      }
      this.$toast.success(`${this.article.artitude === 1 ? '' : '取消'}收藏成功`)
    },
    // 文章数据发布到评论列表顶部 更新评论的总数量 关闭发布评论弹出层
    onPostSuccess(comment){
      console.log(comment)
      //把文章数据发布到评论列表顶部
      this.commentList.unshift(comment)
      //更新评论的总数量
      this.totalCommentCount++
      //关闭发布评论弹出层
      this.isPostShow = false
    },
    // 显示评论回复
    onReplyClick(comment){
      console.log('onReplyShow',comment)
      this.replyComment = comment
      //显示评论回复
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
.article-container{
  .article-wrap{
    position: fixed;
    left: 0px;
    right: 0px;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .title{
    font-size: 24px;
  }
  .user-info{
    .avatar{
      width: 35px;
      height: 35px;
    }
  }
  .markdown-body{
    font-size: 14px;
  }
  .article-bottom{
    //background-color: red;
    background-color: #f6f6f6;
    position: fixed;
    bottom: 0px;

    .comment-btn{
      margin: 5px 5px;
      width: 150px;
    }
    .van-icon{
      margin-left: 11px;
      margin-right: 18px;
      bottom: -12px;
    }
  }
}
</style>
