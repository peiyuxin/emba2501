<template>
  <div class="login">
    <!-- 背景装饰 -->
    <div class="background">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>

    <!-- 登录表单 -->
    <div class="login-container">
      <div class="login-card">
        <!-- Logo和标题 -->
        <div class="login-header">
          <div class="logo">
            <img src="/logo.svg" alt="RUC EMBA" class="logo-img" />
            <div class="logo-text">
              <h1>人民大学EMBA2501班</h1>
              <p>学习交流平台</p>
            </div>
          </div>
        </div>

        <!-- 登录表单 -->
        <el-form 
          ref="loginFormRef"
          :model="loginForm" 
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <div class="form-title">
            <h2>欢迎登录</h2>
            <p>请输入您的登录信息</p>
          </div>

          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名/学号"
              size="large"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              clearable
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-button type="text" @click="handleForgotPassword">
                忘记密码？
              </el-button>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              class="login-btn"
              :loading="loginLoading"
              @click="handleLogin"
            >
              {{ loginLoading ? '登录中...' : '立即登录' }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 快速登录 -->
        <div class="quick-login">
          <div class="divider">
            <span>或者</span>
          </div>
          
          <div class="quick-actions">
            <el-button 
              size="large" 
              class="guest-btn"
              @click="handleGuestLogin"
            >
              <el-icon><View /></el-icon>
              访客浏览
            </el-button>
            <el-button 
              size="large" 
              class="lottery-btn"
              @click="handleGoToLottery"
            >
              <el-icon><Gift /></el-icon>
              分组查询
            </el-button>
          </div>
        </div>

        <!-- 帮助信息 -->
        <div class="login-footer">
          <p>如有问题，请联系班级管理员</p>
          <div class="contact-info">
            <span>📧 admin@ruc-emba2501.com</span>
            <span>📞 010-12345678</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>&copy; 2024 人民大学EMBA2501班. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Gift } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loginLoading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名或学号', trigger: 'blur' },
    { min: 3, message: '用户名长度不能少于3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
}

// 模拟用户数据
const mockUsers = [
  { username: 'peixinxin', password: '123456', name: '裴心心' },
  { username: 'zhangsan', password: '123456', name: '张三' },
  { username: 'admin', password: 'admin123', name: '管理员' }
]

// 登录方法
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loginLoading.value = true

    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 验证用户信息
    const user = mockUsers.find(u => 
      u.username === loginForm.username && 
      u.password === loginForm.password
    )

    if (user) {
      // 登录成功
      ElMessage.success(`欢迎回来，${user.name}！`)
      
      // 存储登录信息
      if (loginForm.remember) {
        localStorage.setItem('loginInfo', JSON.stringify({
          username: loginForm.username,
          remember: true
        }))
      }
      
      // 跳转到首页
      router.push('/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loginLoading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage.info('请联系班级管理员重置密码')
}

// 访客登录
const handleGuestLogin = () => {
  ElMessage.success('以访客身份进入系统')
  router.push('/dashboard')
}

// 跳转到分组查询
const handleGoToLottery = () => {
  router.push('/group-lottery')
}

// 初始化：检查是否有记住的登录信息
const initLoginInfo = () => {
  const savedInfo = localStorage.getItem('loginInfo')
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo)
      if (info.remember) {
        loginForm.username = info.username
        loginForm.remember = true
      }
    } catch (error) {
      console.error('解析保存的登录信息失败:', error)
    }
  }
}

// 初始化
initLoginInfo()
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .wave {
      position: absolute;
      bottom: -150px;
      width: 200%;
      height: 200px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: wave 8s ease-in-out infinite;

      &.wave1 {
        animation-delay: 0s;
        left: -50%;
      }

      &.wave2 {
        animation-delay: -2s;
        left: -40%;
        background: rgba(255, 255, 255, 0.05);
      }

      &.wave3 {
        animation-delay: -4s;
        left: -30%;
        background: rgba(255, 255, 255, 0.03);
      }
    }

    @keyframes wave {
      0%, 100% {
        transform: translateX(0) rotate(0deg);
      }
      50% {
        transform: translateX(-20px) rotate(180deg);
      }
    }
  }

  .login-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    position: relative;
    z-index: 1;

    .login-card {
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: $spacing-xl;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  .login-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .logo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-md;

      .logo-img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: $primary-color;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: $font-size-xl;

        // 如果没有实际logo图片，显示文字
        &::after {
          content: 'R';
        }
      }

      .logo-text {
        h1 {
          margin: 0;
          font-size: $font-size-xl;
          color: $text-primary;
          font-weight: 600;
        }

        p {
          margin: 0;
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
    }
  }

  .login-form {
    .form-title {
      text-align: center;
      margin-bottom: $spacing-xl;

      h2 {
        margin: 0 0 $spacing-sm 0;
        color: $text-primary;
        font-size: $font-size-xxl;
      }

      p {
        margin: 0;
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }

    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .login-btn {
      width: 100%;
      height: 48px;
      border-radius: 24px;
      font-size: $font-size-md;
      font-weight: 600;
      background: linear-gradient(45deg, $primary-color, $primary-light);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .quick-login {
    margin-top: $spacing-xl;

    .divider {
      text-align: center;
      margin: $spacing-lg 0;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: $border-color;
      }

      span {
        background: rgba(255, 255, 255, 0.95);
        padding: 0 $spacing-md;
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }

    .quick-actions {
      display: flex;
      gap: $spacing-md;

      .guest-btn,
      .lottery-btn {
        flex: 1;
        height: 44px;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-xs;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
        }
      }

      .guest-btn {
        background: rgba($info-color, 0.1);
        color: $info-color;
        border: 1px solid rgba($info-color, 0.3);

        &:hover {
          background: rgba($info-color, 0.2);
        }
      }

      .lottery-btn {
        background: rgba($warning-color, 0.1);
        color: $warning-color;
        border: 1px solid rgba($warning-color, 0.3);

        &:hover {
          background: rgba($warning-color, 0.2);
        }
      }
    }
  }

  .login-footer {
    text-align: center;
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 1px solid $border-light;

    p {
      margin: 0 0 $spacing-sm 0;
      color: $text-secondary;
      font-size: $font-size-sm;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      span {
        font-size: $font-size-sm;
        color: $text-placeholder;
      }
    }
  }

  .copyright {
    text-align: center;
    padding: $spacing-lg;
    color: rgba(255, 255, 255, 0.8);
    font-size: $font-size-sm;
    position: relative;
    z-index: 1;

    p {
      margin: 0;
    }
  }
}

// 表单样式调整
:deep(.el-form-item) {
  margin-bottom: $spacing-lg;

  .el-input__wrapper {
    border-radius: 12px;
    box-shadow: none;
    border: 1px solid $border-color;
    transition: all 0.3s ease;

    &:hover,
    &.is-focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 1px rgba($primary-color, 0.2);
    }
  }
}

:deep(.el-checkbox) {
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: $primary-color;
    border-color: $primary-color;
  }
}

@media (max-width: 768px) {
  .login {
    .login-container {
      padding: $spacing-lg;

      .login-card {
        padding: $spacing-lg;
      }
    }

    .quick-actions {
      flex-direction: column;

      .guest-btn,
      .lottery-btn {
        flex: none;
      }
    }

    .login-footer {
      .contact-info {
        span {
          font-size: $font-size-xs;
        }
      }
    }
  }
}
</style>
