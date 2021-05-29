<template>
  <div class="search-result">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell
          v-for="(article,index) in list"
          :key="index"
          :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import {getSearchResult} from "../../../api/searchs";


export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText:{
      type:String,
      required:true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page:1,
      perPage:10
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      //1.请求获取资源
      const {data} = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.q // 搜索关键字
      })
      console.log(data)
      //2.将数据放到数据列表中
      const { results } = data.data
      //ES6
      this.list.push(...results)

      //3.关闭本次的loading
      this.loading = false

      //4.判断是否还有数据
      if(results.length){
        //如果有，则更新获取下一页数据的页码
        this.page++
      }else {
        //如果没有，则把finished设置为true,关闭加载跟多
        this.finished = true
      }
    }
  }
}
</script>

<style scoped lang="less">
</style>
