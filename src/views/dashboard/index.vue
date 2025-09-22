<template>
  <div class="dashboard">
    <div class="page-container">
      <!-- 欢迎区域 -->
      <div class="welcome-section card mb-24">
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userInfo.name }}</h2>
            <p>今天是{{ currentDate }}，祝您学习愉快！</p>
          </div>
          <div class="welcome-stats">
            <div class="stat-item">
              <span class="stat-number">{{ stats.totalCourses }}</span>
              <span class="stat-label">总课程数</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ stats.completedCourses }}</span>
              <span class="stat-label">已完成</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ stats.attendanceRate }}%</span>
              <span class="stat-label">出勤率</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计卡片 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :xs="24" :sm="12" :md="6" v-for="item in statCards" :key="item.title">
          <div class="stat-card card">
            <div class="stat-card-content">
              <div class="stat-card-icon" :style="{ backgroundColor: item.color }">
                <el-icon :size="24"><component :is="item.icon" /></el-icon>
              </div>
              <div class="stat-card-info">
                <h3>{{ item.value }}</h3>
                <p>{{ item.title }}</p>
                <span class="stat-change" :class="item.trend">
                  <el-icon><component :is="item.trend === 'up' ? 'TrendCharts' : 'Bottom'" /></el-icon>
                  {{ item.change }}
                </span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 主要内容区域 -->
      <el-row :gutter="16">
        <!-- 左侧 -->
        <el-col :xs="24" :lg="16">
          <!-- 近期课程 -->
          <div class="recent-courses card mb-24">
            <div class="card-header">
              <h3>近期课程</h3>
              <el-button type="primary" size="small" @click="$router.push('/courses')">
                查看全部
              </el-button>
            </div>
            <div class="course-list">
              <div 
                v-for="course in recentCourses" 
                :key="course.id"
                class="course-item"
              >
                <div class="course-info">
                  <div class="course-title">{{ course.title }}</div>
                  <div class="course-meta">
                    <span class="course-time">
                      <el-icon><Clock /></el-icon>
                      {{ course.time }}
                    </span>
                    <span class="course-location">
                      <el-icon><LocationInformation /></el-icon>
                      {{ course.location }}
                    </span>
                  </div>
                </div>
                <el-tag :type="getCourseStatusType(course.status)">
                  {{ course.status }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 学习进度 -->
          <div class="learning-progress card">
            <div class="card-header">
              <h3>学习进度</h3>
            </div>
            <div class="progress-chart">
              <v-chart :option="progressChartOption" style="height: 300px;" />
            </div>
          </div>
        </el-col>

        <!-- 右侧 -->
        <el-col :xs="24" :lg="8">
          <!-- 通知公告 -->
          <div class="notifications card mb-24">
            <div class="card-header">
              <h3>通知公告</h3>
              <el-button type="text" size="small">更多</el-button>
            </div>
            <div class="notification-list">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="notification-item"
              >
                <div class="notification-content">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-time">{{ notification.time }}</div>
                </div>
                <el-badge 
                  v-if="!notification.read" 
                  is-dot 
                  class="notification-badge"
                />
              </div>
            </div>
          </div>

          <!-- 班级活动 -->
          <div class="activities card">
            <div class="card-header">
              <h3>近期活动</h3>
              <el-button type="text" size="small" @click="$router.push('/activities')">
                更多
              </el-button>
            </div>
            <div class="activity-list">
              <div 
                v-for="activity in upcomingActivities" 
                :key="activity.id"
                class="activity-item"
              >
                <div class="activity-date">
                  <div class="activity-day">{{ activity.day }}</div>
                  <div class="activity-month">{{ activity.month }}</div>
                </div>
                <div class="activity-info">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-location">{{ activity.location }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import dayjs from 'dayjs'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

// 用户信息
const userInfo = ref({
  name: '张同学'
})

// 当前日期
const currentDate = computed(() => {
  return dayjs().format('YYYY年MM月DD日 dddd')
})

// 统计数据
const stats = ref({
  totalCourses: 24,
  completedCourses: 18,
  attendanceRate: 95
})

// 统计卡片数据
const statCards = ref([
  {
    title: '本月课程',
    value: '8',
    change: '+12%',
    trend: 'up',
    color: '#409EFF',
    icon: 'Reading'
  },
  {
    title: '作业完成',
    value: '15/18',
    change: '+5%',
    trend: 'up', 
    color: '#67C23A',
    icon: 'DocumentChecked'
  },
  {
    title: '讨论参与',
    value: '23',
    change: '+8%',
    trend: 'up',
    color: '#E6A23C',
    icon: 'ChatDotSquare'
  },
  {
    title: '活动参与',
    value: '6/7',
    change: '0%',
    trend: 'stable',
    color: '#F56C6C',
    icon: 'Trophy'
  }
])

// 近期课程
const recentCourses = ref([
  {
    id: 1,
    title: '战略管理',
    time: '2024-01-15 09:00',
    location: '教学楼A101',
    status: '进行中'
  },
  {
    id: 2,
    title: '财务管理',
    time: '2024-01-16 14:00',
    location: '教学楼B201',
    status: '未开始'
  },
  {
    id: 3,
    title: '市场营销',
    time: '2024-01-14 10:00',
    location: '教学楼A102',
    status: '已结束'
  }
])

// 通知公告
const notifications = ref([
  {
    id: 1,
    title: '期末考试安排通知',
    time: '2024-01-12',
    read: false
  },
  {
    id: 2,
    title: '寒假实践活动报名',
    time: '2024-01-10',
    read: false
  },
  {
    id: 3,
    title: '图书馆闭馆通知',
    time: '2024-01-08',
    read: true
  }
])

// 近期活动
const upcomingActivities = ref([
  {
    id: 1,
    title: '企业参访活动',
    location: '腾讯总部',
    day: '20',
    month: '01月'
  },
  {
    id: 2,
    title: '学术讲座',
    location: '国际会议厅',
    day: '25',
    month: '01月'
  }
])

// 学习进度图表配置
const progressChartOption = ref({
  title: {
    text: '课程完成情况',
    left: 'center',
    textStyle: {
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'horizontal',
    bottom: 10
  },
  series: [
    {
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'],
      data: [
        { value: 18, name: '已完成', itemStyle: { color: '#67C23A' } },
        { value: 4, name: '进行中', itemStyle: { color: '#E6A23C' } },
        { value: 2, name: '未开始', itemStyle: { color: '#F56C6C' } }
      ]
    }
  ]
})

// 获取课程状态类型
const getCourseStatusType = (status: string) => {
  const statusMap: Record<string, any> = {
    '进行中': 'warning',
    '未开始': 'info',
    '已结束': 'success'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped lang="scss">
.dashboard {
  .welcome-section {
    background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
    color: white;
    
    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .welcome-text {
        h2 {
          font-size: $font-size-xxl;
          margin-bottom: $spacing-sm;
        }
        
        p {
          opacity: 0.9;
          font-size: $font-size-md;
        }
      }
      
      .welcome-stats {
        display: flex;
        gap: $spacing-xl;
        
        .stat-item {
          text-align: center;
          
          .stat-number {
            display: block;
            font-size: $font-size-xxl;
            font-weight: 600;
            margin-bottom: $spacing-xs;
          }
          
          .stat-label {
            font-size: $font-size-sm;
            opacity: 0.8;
          }
        }
      }
    }
  }
  
  .stat-card {
    .stat-card-content {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      
      .stat-card-icon {
        width: 60px;
        height: 60px;
        border-radius: $border-radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .stat-card-info {
        flex: 1;
        
        h3 {
          font-size: $font-size-xl;
          margin: 0 0 $spacing-xs 0;
          color: $text-primary;
        }
        
        p {
          margin: 0 0 $spacing-xs 0;
          color: $text-secondary;
          font-size: $font-size-sm;
        }
        
        .stat-change {
          font-size: $font-size-xs;
          display: flex;
          align-items: center;
          gap: 2px;
          
          &.up {
            color: $success-color;
          }
          
          &.down {
            color: $danger-color;
          }
          
          &.stable {
            color: $text-secondary;
          }
        }
      }
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    h3 {
      margin: 0;
      font-size: $font-size-lg;
      color: $text-primary;
    }
  }
  
  .course-list {
    .course-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;
      
      &:last-child {
        border-bottom: none;
      }
      
      .course-info {
        .course-title {
          font-weight: 500;
          margin-bottom: $spacing-xs;
        }
        
        .course-meta {
          display: flex;
          gap: $spacing-md;
          font-size: $font-size-sm;
          color: $text-secondary;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
  }
  
  .notification-list {
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;
      
      &:last-child {
        border-bottom: none;
      }
      
      .notification-content {
        flex: 1;
        
        .notification-title {
          font-weight: 500;
          margin-bottom: $spacing-xs;
        }
        
        .notification-time {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
    }
  }
  
  .activity-list {
    .activity-item {
      display: flex;
      gap: $spacing-md;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-date {
        background: $bg-hover;
        border-radius: $border-radius-md;
        padding: $spacing-sm;
        text-align: center;
        min-width: 60px;
        
        .activity-day {
          font-size: $font-size-lg;
          font-weight: 600;
          color: $primary-color;
        }
        
        .activity-month {
          font-size: $font-size-xs;
          color: $text-secondary;
        }
      }
      
      .activity-info {
        flex: 1;
        
        .activity-title {
          font-weight: 500;
          margin-bottom: $spacing-xs;
        }
        
        .activity-location {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    .welcome-content {
      flex-direction: column;
      text-align: center;
      gap: $spacing-lg;
      
      .welcome-stats {
        gap: $spacing-md;
      }
    }
    
    .stat-card-content {
      .stat-card-icon {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>
