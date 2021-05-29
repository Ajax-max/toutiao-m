<template>
  <div class="search-suggestion">
    <van-cell icon="search"
              v-for="(str,index) in suggestions"
              :key="index"
              @click="$emit('search',str)">
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import {getSearchSuggestions} from "../../../api/searchs";
import {debounce} from 'lodash'

export default {
  name: "SearchSuggestion",
  data(){
    return {
      suggestions:[]//保存接口调来的数据
    }
  },
  props:{
    searchText:{
      type:String,
      required:true
    }
  },
  watch: {
    // 监视的完整写法
    searchText: {
      // 当数据发生变化则会执行 handler处理函数
      handler: debounce(async function () {
        const {data} = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true
    }
  },
  methods:{
    highlight(str){
      return str.replace(new RegExp(this.searchText,'gi'),`<span style="color: red">${this.searchText}</span>`)
    }
  }
}
</script>

<style scoped>

</style>
