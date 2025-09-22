<template>
  <div class="sidebar">
    <!-- Logo区域 -->
    <div class="logo" :class="{ collapse: collapse }">
      <img src="/logo.svg" alt="RUC" class="logo-img" />
      <span v-if="!collapse" class="logo-text">EMBA2501</span>
    </div>
    
    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="route in menuRoutes" :key="route.path">
        <el-menu-item :index="route.path" v-if="!route.children">
          <el-icon><component :is="route.meta?.icon" /></el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
        
        <el-sub-menu :index="route.path" v-else>
          <template #title>
            <el-icon><component :is="route.meta?.icon" /></el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>
          <el-menu-item
            v-for="child in route.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon><component :is="child.meta?.icon" /></el-icon>
            <template #title>{{ child.meta?.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  collapse: boolean
}

defineProps<Props>()

const route = useRoute()
const router = useRouter()

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 获取菜单路由
const menuRoutes = computed(() => {
  const routes = router.getRoutes()
  const layoutRoute = routes.find(r => r.name === 'Layout')
  if (layoutRoute && layoutRoute.children) {
    return layoutRoute.children.filter(child => !child.meta?.hidden)
  }
  return []
})
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .logo {
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    padding: 0 $spacing-md;
    border-bottom: 1px solid $border-color;
    transition: all 0.3s ease;
    
    &.collapse {
      padding: 0;
      
      .logo-text {
        display: none;
      }
    }
    
    .logo-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: $primary-color;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: $font-size-lg;
      
      // 如果没有实际logo图片，显示文字
      &::after {
        content: 'R';
      }
    }
    
    .logo-text {
      font-size: $font-size-lg;
      font-weight: 600;
      color: $primary-color;
      white-space: nowrap;
      overflow: hidden;
      transition: all 0.3s ease;
    }
  }
  
  .sidebar-menu {
    flex: 1;
    border-right: none;
    overflow-y: auto;
    
    :deep(.el-menu-item) {
      height: 56px;
      line-height: 56px;
      
      &:hover {
        background-color: $bg-hover;
      }
      
      &.is-active {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        border-right: 3px solid $primary-color;
      }
    }
    
    :deep(.el-sub-menu__title) {
      height: 56px;
      line-height: 56px;
      
      &:hover {
        background-color: $bg-hover;
      }
    }
    
    // 折叠状态下的样式
    &.el-menu--collapse {
      width: 64px;
      
      :deep(.el-menu-item) {
        padding: 0 20px !important;
        text-align: center;
      }
      
      :deep(.el-sub-menu) {
        .el-sub-menu__title {
          padding: 0 20px !important;
          text-align: center;
        }
      }
    }
  }
}

// 暗色主题（可选）
.sidebar.dark {
  background: #001529;
  
  .logo {
    background: #002140;
    border-bottom-color: #001529;
    
    .logo-text {
      color: white;
    }
  }
  
  .sidebar-menu {
    background: #001529;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.85);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      &.is-active {
        background-color: $primary-color;
        color: white;
      }
    }
    
    :deep(.el-sub-menu__title) {
      color: rgba(255, 255, 255, 0.85);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
