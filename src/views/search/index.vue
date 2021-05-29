<template>
  <div class="search-contaier">
<!--    搜索框-->
    <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        show-action
        @focus="isResultShow = false"/>
<!--    /搜索框-->


<!--    联想建议-->
    <search-result v-if="isResultShow"
                   :search-text="searchText"/>
<!--    /联想建议-->

<!--    历史记录-->
    <search-suggestion
        v-else-if="searchText"
        :search-text="searchText"
        @search="onSearch"
        @update-histories="searchHistories = $event"/>
<!--    /历史记录-->


<!--    搜索结果-->
    <search-history
        v-else
        :search-histories="searchHistories" />
<!--    @search="onSearch"-->
<!--    /搜索结果-->
  </div>
</template>

<script>
import SearchSuggestion from "./components/search-suggestion";
import SearchHistory from "./components/search-history";
import SearchResult from "./components/search-result";
import {setItem,getItem} from "../../utils/storage";
// import {getSearchHistories} from "../../api/searchs";
import {mapState} from 'vuex'

export default {
  name: "SearchIndex",
  components: {SearchResult, SearchHistory, SearchSuggestion},
  data(){
    return {
      searchText:'',
      isResultShow:false,
      searchHistories:[]
    }
  },
  computed:{
    ...mapState(['user'])
  },
  methods:{
    onSearch(searchText){
      //把输入框变搜索的文本
      this.searchText = searchText
      const index = this.searchHistories.indexOf(searchText)
      if(index !==-1){
        //把重复项删除
        this.searchHistories.splice(index,1)
      }
      //把重复的搜索历史记录放到顶部
      this.searchHistories.unshift(searchText)

      // setItem('search-histories',this.searchHistories)


      //展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHisories(){
      let searchHistories = getItem('search-histories') || []
      // if(this.user){
      //   const {data} = await getSearchHistories()
      //   //合并数组：[...数组，...数组]
      //   //把Set转为数组；[...Set对象]
      //   //数组去重；[...new Set([...数组，...数组])]
      //   this.searchHistories = [...new Set([...searchHistories,...data.data.keywords])]
      // }
      // console.log(searchHistories)
      this.searchHistories = searchHistories
    },
    onCancel(){
      console.log('Cancel')
    }
  },
  created(){
    this.loadSearchHisories()
  },
  watch:{
    searchHistories(){
      setItem('search-histories',this.searchHistories)
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  .van-search__action {
    color: #fff;
  }
}
</style>
