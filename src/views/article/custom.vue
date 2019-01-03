<template>
  <article-list :is-custom="true"/>
</template>

<script>
import ArticleList from './list'

export default {
  name: 'CustomList',
  components: { ArticleList }
}
</script>

