<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户名:{{ this.$store.getters.username }}</div>
    <div class="dashboard-text">昵称:{{ this.$store.getters.nickname }}</div>
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
