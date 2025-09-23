<template>
  <div class="header">
    <!-- 左侧 -->
    <div class="header-left">
      <el-button
        type="text"
        size="large"
        @click="$emit('toggle-sidebar')"
        class="toggle-btn"
      >
        <el-icon><Menu /></el-icon>
      </el-button>
      
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentRoute.meta?.title">
            {{ currentRoute.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    
    <!-- 中间标题 -->
    <div class="header-title" :class="{ 'mobile-title': mobile }">
      <h1>{{ mobile ? 'EMBA2501' : '人民大学EMBA2501班' }}</h1>
    </div>
    
    <!-- 右侧 -->
    <div class="header-right">
      <!-- 消息通知 -->
      <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification">
        <el-button type="text" size="large">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
      
      <!-- 用户头像和菜单 -->
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="user-avatar">
          <el-avatar :size="mobile ? 28 : 32" :src="userInfo.avatar" :icon="UserFilled" />
          <span v-if="!mobile" class="username">{{ userInfo.name }}</span>
          <el-icon v-if="!mobile"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile" icon="User">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings" icon="Setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" icon="SwitchButton" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Bell, UserFilled, ArrowDown } from '@element-plus/icons-vue'

interface Props {
  mobile?: boolean
}

defineProps<Props>()

// 发出事件
defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const router = useRouter()

// 当前路由
const currentRoute = computed(() => route)

// 用户信息
const userInfo = ref({
  name: '张同学',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 通知数量
const notificationCount = ref(3)

// 处理用户菜单命令
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      // 打开设置对话框
      console.log('打开设置')
      break
    case 'logout':
      // 退出登录逻辑
      console.log('退出登录')
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 $spacing-lg;
  
  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .toggle-btn {
      margin-right: $spacing-md;
      
      &:hover {
        background-color: $bg-hover;
      }
    }
    
    .breadcrumb {
      font-size: $font-size-sm;
    }
  }
  
  .header-title {
    flex: 2;
    text-align: center;
    
    h1 {
      font-size: $font-size-xl;
      color: $primary-color;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    gap: $spacing-md;
    
    .notification {
      .el-button {
        &:hover {
          background-color: $bg-hover;
        }
      }
    }
    
    .user-avatar {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      cursor: pointer;
      padding: $spacing-sm $spacing-md;
      border-radius: $border-radius-md;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: $bg-hover;
      }
      
      .username {
        font-size: $font-size-sm;
        color: $text-primary;
      }
    }
  }
}

// 移动端适配
@media (max-width: $breakpoint-sm) {
  .header {
    padding: 0 $spacing-md;
    
    .header-left {
      flex: 0;
      min-width: auto;
      
      .breadcrumb {
        display: none;
      }
    }
    
    .header-title {
      flex: 1;
      
      &.mobile-title h1 {
        font-size: $font-size-lg;
      }
    }
    
    .header-right {
      flex: 0;
      min-width: auto;
      gap: $spacing-sm;
      
      .notification .el-button {
        padding: $spacing-xs;
      }
      
      .username {
        display: none;
      }
    }
  }
}

@media (max-width: $breakpoint-xs) {
  .header {
    padding: 0 $spacing-sm;
    
    .header-title h1 {
      font-size: $font-size-md;
    }
  }
}
</style>
