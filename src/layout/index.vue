<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="sidebarWidth" class="sidebar-container">
        <Sidebar :collapse="isCollapse" />
      </el-aside>
      
      <!-- 主要内容区域 -->
      <el-container class="main-container">
        <!-- 顶部导航 -->
        <el-header class="header-container">
          <Header @toggle-sidebar="toggleSidebar" />
        </el-header>
        
        <!-- 内容区域 -->
        <el-main class="content-container">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

// 侧边栏折叠状态
const isCollapse = ref(false)

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  return isCollapse.value ? '64px' : '220px'
})

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  
  .sidebar-container {
    background: $bg-primary;
    border-right: 1px solid $border-color;
    transition: width 0.3s ease;
  }
  
  .main-container {
    flex: 1;
    
    .header-container {
      background: $bg-primary;
      border-bottom: 1px solid $border-color;
      padding: 0;
      height: $header-height;
      display: flex;
      align-items: center;
    }
    
    .content-container {
      background: $bg-secondary;
      padding: 0;
    }
  }
}
</style>
