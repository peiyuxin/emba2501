<template>
  <div class="not-found">
    <!-- 背景装饰 -->
    <div class="background">
      <div class="floating-elements">
        <div v-for="i in 15" :key="i" class="floating-element" :style="getElementStyle(i)">
          <el-icon><component :is="getRandomIcon(i)" /></el-icon>
        </div>
      </div>
    </div>

    <!-- 404 内容 -->
    <div class="not-found-container">
      <!-- 404 图形 -->
      <div class="error-graphic">
        <div class="error-number">
          <span class="number four">4</span>
          <span class="number zero">
            <div class="zero-face">
              <div class="eye eye-left"></div>
              <div class="eye eye-right"></div>
              <div class="mouth"></div>
            </div>
          </span>
          <span class="number four">4</span>
        </div>
        
        <div class="error-animation">
          <div class="cloud cloud1"></div>
          <div class="cloud cloud2"></div>
          <div class="cloud cloud3"></div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div class="error-content">
        <h1>哎呀！页面走丢了 😅</h1>
        <p class="error-message">
          看起来您访问的页面不存在，可能是链接错误或者页面已经被移除了。
          <br>
          不过别担心，让我们帮您找到正确的方向！
        </p>

        <!-- 建议操作 -->
        <div class="suggestions">
          <h3>您可以尝试：</h3>
          <ul class="suggestion-list">
            <li>
              <el-icon><House /></el-icon>
              <span>回到首页重新开始</span>
            </li>
            <li>
              <el-icon><Back /></el-icon>
              <span>返回上一页继续浏览</span>
            </li>
            <li>
              <el-icon><Search /></el-icon>
              <span>使用搜索功能查找内容</span>
            </li>
            <li>
              <el-icon><Service /></el-icon>
              <span>联系管理员寻求帮助</span>
            </li>
          </ul>
        </div>

        <!-- 快速导航 -->
        <div class="quick-nav">
          <h3>快速导航：</h3>
          <div class="nav-buttons">
            <el-button 
              type="primary" 
              size="large"
              @click="goHome"
            >
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
            
            <el-button 
              size="large"
              @click="goBack"
            >
              <el-icon><Back /></el-icon>
              返回上页
            </el-button>
            
            <el-button 
              type="success" 
              size="large"
              @click="goToLottery"
            >
              <el-icon><Gift /></el-icon>
              分组查询
            </el-button>
          </div>
        </div>

        <!-- 热门页面 -->
        <div class="popular-pages">
          <h3>热门页面：</h3>
          <div class="page-links">
            <router-link 
              v-for="page in popularPages" 
              :key="page.path"
              :to="page.path"
              class="page-link"
            >
              <el-icon><component :is="page.icon" /></el-icon>
              <span>{{ page.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面底部 -->
    <div class="not-found-footer">
      <p>如果问题持续存在，请联系技术支持：tech-support@ruc-emba2501.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 热门页面
const popularPages = [
  { path: '/dashboard', title: '首页看板', icon: 'House' },
  { path: '/courses', title: '课程中心', icon: 'Reading' },
  { path: '/students', title: '同学录', icon: 'User' },
  { path: '/activities', title: '班级活动', icon: 'Calendar' },
  { path: '/forum', title: '讨论论坛', icon: 'ChatDotSquare' },
  { path: '/gallery', title: '班级相册', icon: 'Picture' }
]

// 随机图标列表
const iconList = [
  'Star', 'Heart', 'Gift', 'Trophy', 'Sunny', 'Moon', 
  'CloudyNight', 'Lightning', 'Umbrella', 'Bicycle'
]

// 方法
const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  if (history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const goToLottery = () => {
  router.push('/group-lottery')
}

// 获取随机图标
const getRandomIcon = (index: number) => {
  return iconList[index % iconList.length]
}

// 获取随机元素样式
const getElementStyle = (index: number) => {
  const positions = [
    { top: '10%', left: '5%' },
    { top: '15%', right: '10%' },
    { top: '25%', left: '15%' },
    { top: '35%', right: '5%' },
    { top: '45%', left: '8%' },
    { top: '55%', right: '15%' },
    { top: '65%', left: '12%' },
    { top: '75%', right: '8%' },
    { bottom: '20%', left: '5%' },
    { bottom: '30%', right: '12%' },
    { bottom: '10%', left: '20%' },
    { bottom: '15%', right: '6%' },
    { top: '20%', left: '85%' },
    { top: '60%', left: '88%' },
    { bottom: '40%', right: '3%' }
  ]
  
  const position = positions[index % positions.length]
  const size = Math.random() * 20 + 15
  const opacity = Math.random() * 0.3 + 0.1
  const animationDelay = Math.random() * 5
  
  return {
    ...position,
    fontSize: size + 'px',
    opacity: opacity,
    animationDelay: animationDelay + 's'
  }
}

// 添加一些交互效果
onMounted(() => {
  // 可以添加一些页面加载动画
  console.log('404页面已加载')
})
</script>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  color: white;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .floating-elements {
      width: 100%;
      height: 100%;
      position: relative;

      .floating-element {
        position: absolute;
        color: rgba(255, 255, 255, 0.2);
        animation: float 6s ease-in-out infinite alternate;

        @keyframes float {
          from { 
            transform: translateY(0px) rotate(0deg); 
          }
          to { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
      }
    }
  }

  .not-found-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    position: relative;
    z-index: 1;

    .error-graphic {
      margin-bottom: $spacing-xl;
      position: relative;

      .error-number {
        display: flex;
        align-items: center;
        gap: $spacing-lg;
        font-size: 8rem;
        font-weight: 700;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

        .number {
          position: relative;
          
          &.zero {
            .zero-face {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.9);
              color: $primary-color;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              animation: wobble 2s ease-in-out infinite;

              .eye {
                width: 12px;
                height: 12px;
                background: $primary-color;
                border-radius: 50%;
                position: absolute;
                animation: blink 3s ease-in-out infinite;

                &.eye-left {
                  left: 30%;
                  top: 35%;
                }

                &.eye-right {
                  right: 30%;
                  top: 35%;
                }
              }

              .mouth {
                width: 30px;
                height: 15px;
                border: 2px solid $primary-color;
                border-top: none;
                border-radius: 0 0 30px 30px;
                position: absolute;
                bottom: 25%;
                left: 50%;
                transform: translateX(-50%);
              }

              @keyframes wobble {
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
              }

              @keyframes blink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
              }
            }
          }
        }
      }

      .error-animation {
        position: absolute;
        top: -50px;
        left: 50%;
        transform: translateX(-50%);
        width: 400px;
        height: 100px;

        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          animation: cloudFloat 4s ease-in-out infinite;

          &::before,
          &::after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
          }

          &.cloud1 {
            width: 50px;
            height: 20px;
            left: 10%;
            animation-delay: 0s;

            &::before {
              top: -10px;
              left: 5px;
              width: 25px;
              height: 25px;
            }

            &::after {
              top: -15px;
              right: 5px;
              width: 30px;
              height: 30px;
            }
          }

          &.cloud2 {
            width: 40px;
            height: 15px;
            right: 20%;
            animation-delay: -1s;

            &::before {
              top: -8px;
              left: 3px;
              width: 20px;
              height: 20px;
            }

            &::after {
              top: -12px;
              right: 3px;
              width: 25px;
              height: 25px;
            }
          }

          &.cloud3 {
            width: 35px;
            height: 12px;
            left: 50%;
            animation-delay: -2s;

            &::before {
              top: -6px;
              left: 2px;
              width: 15px;
              height: 15px;
            }

            &::after {
              top: -10px;
              right: 2px;
              width: 20px;
              height: 20px;
            }
          }

          @keyframes cloudFloat {
            0%, 100% { transform: translateX(0) translateY(0); }
            33% { transform: translateX(10px) translateY(-5px); }
            66% { transform: translateX(-5px) translateY(3px); }
          }
        }
      }
    }

    .error-content {
      text-align: center;
      max-width: 800px;

      h1 {
        font-size: 2.5rem;
        margin-bottom: $spacing-lg;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      }

      .error-message {
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: $spacing-xl;
        opacity: 0.9;
      }

      .suggestions,
      .quick-nav,
      .popular-pages {
        margin-bottom: $spacing-xl;
        text-align: left;

        h3 {
          font-size: 1.3rem;
          margin-bottom: $spacing-md;
          color: $accent-light;
          text-align: center;
        }

        .suggestion-list {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
            padding: $spacing-sm 0;
            font-size: 1.1rem;
            opacity: 0.9;

            .el-icon {
              color: $accent-color;
              flex-shrink: 0;
            }
          }
        }

        .nav-buttons {
          display: flex;
          gap: $spacing-md;
          justify-content: center;
          flex-wrap: wrap;

          .el-button {
            border-radius: 25px;
            padding: 12px 24px;
            font-weight: 500;

            &:hover {
              transform: translateY(-2px);
            }
          }
        }

        .page-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: $spacing-md;
          justify-content: center;

          .page-link {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
            padding: $spacing-md;
            background: rgba(255, 255, 255, 0.1);
            border-radius: $border-radius-md;
            color: white;
            text-decoration: none;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);

            &:hover {
              background: rgba(255, 255, 255, 0.2);
              transform: translateY(-2px);
            }

            .el-icon {
              color: $accent-color;
            }

            span {
              font-weight: 500;
            }
          }
        }
      }
    }
  }

  .not-found-footer {
    text-align: center;
    padding: $spacing-lg;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;

    p {
      margin: 0;
      opacity: 0.7;
      font-size: $font-size-sm;
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    .not-found-container {
      padding: $spacing-lg;

      .error-graphic {
        .error-number {
          font-size: 5rem;
          gap: $spacing-md;

          .number.zero .zero-face {
            width: 80px;
            height: 80px;
          }
        }
      }

      .error-content {
        h1 {
          font-size: 1.8rem;
        }

        .error-message {
          font-size: 1rem;
        }

        .nav-buttons {
          flex-direction: column;
          
          .el-button {
            width: 100%;
          }
        }

        .page-links {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>
