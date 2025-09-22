<template>
  <div class="dashboard-simple">
    <div class="page-container" style="padding: 20px;">
      <!-- 欢迎区域 -->
      <div class="welcome-section" style="background: #8C1C13; color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
        <h2>欢迎来到人民大学EMBA2501班</h2>
        <p>今天是{{ currentDate }}，祝您学习愉快！</p>
      </div>

      <!-- 快捷功能 -->
      <div class="quick-actions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div class="action-card" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <h3>课程中心</h3>
          <p>查看课程安排和学习资料</p>
          <el-button type="primary" @click="$router.push('/courses')">进入</el-button>
        </div>
        
        <div class="action-card" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <h3>同学录</h3>
          <p>查看班级成员信息</p>
          <el-button type="primary" @click="$router.push('/students')">进入</el-button>
        </div>
        
        <div class="action-card" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <h3>分组抽签</h3>
          <p>查询您的分组信息</p>
          <el-button type="primary" @click="$router.push('/group-lottery')">查询</el-button>
        </div>
        
        <div class="action-card" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
          <h3>班级相册</h3>
          <p>查看精彩瞬间</p>
          <el-button type="primary" @click="$router.push('/gallery')">查看</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long' 
  })
})
</script>

<style scoped>
.dashboard-simple {
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
}
</style>
