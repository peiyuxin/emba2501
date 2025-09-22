<template>
  <div class="test-page">
    <h1>测试页面</h1>
    <p>如果你能看到这个页面，说明Vue应用正常工作。</p>
    <el-button type="primary">测试按钮</el-button>
  </div>
</template>

<script setup lang="ts">
console.log('测试页面加载成功')
</script>

<style scoped>
.test-page {
  padding: 20px;
  text-align: center;
}
</style>
