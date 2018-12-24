<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:{{ this.$store.getters.name }}</div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
