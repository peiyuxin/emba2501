<template>
  <div class="layout-container">
    <el-container>
      <!-- 移动端遮罩 -->
      <div 
        v-if="isMobile && !isCollapse" 
        class="mobile-overlay"
        @click="toggleSidebar"
      ></div>
      
      <!-- 侧边栏 -->
      <el-aside 
        :width="sidebarWidth" 
        class="sidebar-container"
        :class="{ 'mobile-sidebar': isMobile, 'sidebar-open': !isCollapse }"
      >
        <Sidebar :collapse="isCollapse" :mobile="isMobile" />
      </el-aside>
      
      <!-- 主要内容区域 -->
      <el-container class="main-container">
        <!-- 顶部导航 -->
        <el-header class="header-container">
          <Header @toggle-sidebar="toggleSidebar" :mobile="isMobile" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

// 移动端检测
const isMobile = ref(false)
// 侧边栏折叠状态
const isCollapse = ref(false)

// 检测屏幕尺寸
const checkScreenSize = () => {
  const width = window.innerWidth
  const newIsMobile = width <= 768
  
  if (newIsMobile !== isMobile.value) {
    isMobile.value = newIsMobile
    // 移动端默认折叠侧边栏
    if (newIsMobile) {
      isCollapse.value = true
    }
  }
}

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return isCollapse.value ? '0px' : '220px'
  }
  return isCollapse.value ? '64px' : '220px'
})

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  position: relative;
  
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s ease;
  }
  
  .sidebar-container {
    background: $bg-primary;
    border-right: 1px solid $border-color;
    transition: width 0.3s ease;
    
    &.mobile-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      
      &.sidebar-open {
        transform: translateX(0);
      }
    }
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
      
      @media (max-width: $breakpoint-sm) {
        height: $header-height-mobile;
      }
    }
    
    .content-container {
      background: $bg-secondary;
      padding: 0;
    }
  }
}

// 移动端适配
@media (max-width: $breakpoint-sm) {
  .layout-container {
    .main-container {
      .content-container {
        padding: 0;
        overflow-x: hidden;
      }
    }
  }
}
</style>
