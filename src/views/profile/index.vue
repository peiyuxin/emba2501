<template>
  <div class="profile">
    <div class="page-container">
      <!-- 个人信息卡片 -->
      <div class="profile-header card mb-24">
        <div class="profile-avatar">
          <el-avatar :size="120" :src="userInfo.avatar" :icon="UserFilled" />
          <el-button 
            type="primary" 
            size="small" 
            class="change-avatar-btn"
            @click="handleChangeAvatar"
          >
            更换头像
          </el-button>
        </div>
        
        <div class="profile-info">
          <div class="info-header">
            <h1>{{ userInfo.name }}</h1>
            <el-tag :type="getRoleType(userInfo.role)" size="large">
              {{ userInfo.role }}
            </el-tag>
          </div>
          
          <div class="info-content">
            <div class="info-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>{{ userInfo.company }}</span>
            </div>
            <div class="info-item">
              <el-icon><Position /></el-icon>
              <span>{{ userInfo.position }}</span>
            </div>
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <span>{{ userInfo.email }}</span>
            </div>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.coursesCompleted }}</div>
              <div class="stat-label">完成课程</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.activitiesJoined }}</div>
              <div class="stat-label">参与活动</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.postsPublished }}</div>
              <div class="stat-label">发表帖子</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.stats.resourcesShared }}</div>
              <div class="stat-label">共享资源</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <el-row :gutter="24">
        <!-- 左侧：个人设置 -->
        <el-col :xs="24" :lg="8">
          <!-- 快速操作 -->
          <div class="quick-actions card mb-24">
            <h3 class="section-title">快速操作</h3>
            <div class="actions-grid">
              <div 
                v-for="action in quickActions" 
                :key="action.key"
                class="action-item"
                @click="handleQuickAction(action.key)"
              >
                <el-icon :size="20" :color="action.color">
                  <component :is="action.icon" />
                </el-icon>
                <span>{{ action.label }}</span>
              </div>
            </div>
          </div>

          <!-- 学习进度 -->
          <div class="learning-progress card mb-24">
            <h3 class="section-title">学习进度</h3>
            <div class="progress-item">
              <div class="progress-header">
                <span>总体进度</span>
                <span>{{ Math.round(userInfo.learningProgress.overall) }}%</span>
              </div>
              <el-progress 
                :percentage="userInfo.learningProgress.overall"
                :stroke-width="8"
                :color="getProgressColor(userInfo.learningProgress.overall)"
              />
            </div>
            
            <div class="progress-details">
              <div 
                v-for="course in userInfo.learningProgress.courses" 
                :key="course.name"
                class="course-progress"
              >
                <div class="course-info">
                  <span class="course-name">{{ course.name }}</span>
                  <span class="course-percent">{{ course.progress }}%</span>
                </div>
                <el-progress 
                  :percentage="course.progress"
                  :stroke-width="4"
                  :show-text="false"
                  :color="getProgressColor(course.progress)"
                />
              </div>
            </div>
          </div>

          <!-- 我的收藏 -->
          <div class="my-collections card">
            <h3 class="section-title">我的收藏</h3>
            <div class="collection-stats">
              <div 
                v-for="collection in collections" 
                :key="collection.type"
                class="collection-item"
              >
                <el-icon :size="16" :color="collection.color">
                  <component :is="collection.icon" />
                </el-icon>
                <span class="collection-label">{{ collection.label }}</span>
                <span class="collection-count">{{ collection.count }}</span>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：活动记录 -->
        <el-col :xs="24" :lg="16">
          <!-- 最近活动 -->
          <div class="recent-activities card">
            <div class="section-header">
              <h3 class="section-title">最近活动</h3>
              <el-button type="text" size="small" @click="viewAllActivities">
                查看全部
              </el-button>
            </div>
            
            <el-timeline>
              <el-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :timestamp="activity.time"
                :type="getActivityType(activity.type)"
              >
                <div class="timeline-content">
                  <div class="activity-header">
                    <el-icon><component :is="getActivityIcon(activity.type)" /></el-icon>
                    <span class="activity-title">{{ activity.title }}</span>
                  </div>
                  <p class="activity-description">{{ activity.description }}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑个人信息对话框 -->
    <EditProfileDialog
      v-model="editDialogVisible"
      :user-data="userInfo"
      @success="handleEditSuccess"
    />

    <!-- 头像上传对话框 -->
    <AvatarUploadDialog
      v-model="avatarDialogVisible"
      @success="handleAvatarSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import EditProfileDialog from './components/EditProfileDialog.vue'
// import AvatarUploadDialog from './components/AvatarUploadDialog.vue'

// 响应式数据
const editDialogVisible = ref(false)
const avatarDialogVisible = ref(false)

// 用户信息
const userInfo = ref({
  name: '裴心心',
  role: '学员',
  company: '北京科技有限公司',
  position: 'CEO',
  phone: '138****4988',
  email: 'peixinxin@example.com',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
  stats: {
    coursesCompleted: 18,
    activitiesJoined: 12,
    postsPublished: 8,
    resourcesShared: 5
  },
  learningProgress: {
    overall: 75.5,
    courses: [
      { name: '战略管理', progress: 85 },
      { name: '财务管理', progress: 70 },
      { name: '市场营销', progress: 92 },
      { name: '人力资源', progress: 60 }
    ]
  }
})

// 快速操作
const quickActions = [
  { key: 'edit_profile', label: '编辑资料', icon: 'Edit', color: '#409EFF' },
  { key: 'change_password', label: '修改密码', icon: 'Lock', color: '#E6A23C' },
  { key: 'notification_settings', label: '通知设置', icon: 'Bell', color: '#67C23A' },
  { key: 'privacy_settings', label: '隐私设置', icon: 'View', color: '#F56C6C' },
  { key: 'download_data', label: '数据导出', icon: 'Download', color: '#909399' },
  { key: 'help_center', label: '帮助中心', icon: 'QuestionFilled', color: '#606266' }
]

// 收藏统计
const collections = [
  { type: 'resources', label: '学习资源', count: 23, icon: 'Document', color: '#409EFF' },
  { type: 'posts', label: '讨论帖子', count: 15, icon: 'ChatDotRound', color: '#67C23A' },
  { type: 'activities', label: '班级活动', count: 8, icon: 'Calendar', color: '#E6A23C' },
  { type: 'photos', label: '精彩照片', count: 45, icon: 'Picture', color: '#F56C6C' }
]

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'course',
    title: '完成战略管理课程',
    description: '完成了《企业战略管理》课程的所有章节学习，获得优秀成绩',
    time: '2024-01-16 14:30'
  },
  {
    id: 2,
    type: 'activity',
    title: '参与企业参访活动',
    description: '参加了腾讯总部企业参访活动，收获颇丰',
    time: '2024-01-15 09:00'
  },
  {
    id: 3,
    type: 'post',
    title: '发表讨论帖子',
    description: '在论坛发表了关于数字化转型的思考和实践经验',
    time: '2024-01-14 16:20'
  },
  {
    id: 4,
    type: 'resource',
    title: '分享学习资源',
    description: '上传了财务分析Excel模板，帮助同学们学习',
    time: '2024-01-13 11:45'
  }
])

// 生命周期
onMounted(() => {
  // 初始化数据
})

// 方法
const handleChangeAvatar = () => {
  avatarDialogVisible.value = true
}

const handleQuickAction = (actionKey: string) => {
  switch (actionKey) {
    case 'edit_profile':
      editDialogVisible.value = true
      break
    case 'change_password':
      console.log('修改密码')
      break
    case 'notification_settings':
      console.log('通知设置')
      break
    case 'privacy_settings':
      console.log('隐私设置')
      break
    case 'download_data':
      console.log('数据导出')
      break
    case 'help_center':
      console.log('帮助中心')
      break
  }
}

const handleEditSuccess = (newUserInfo: any) => {
  Object.assign(userInfo.value, newUserInfo)
  console.log('个人信息更新成功')
}

const handleAvatarSuccess = (newAvatar: string) => {
  userInfo.value.avatar = newAvatar
  console.log('头像更新成功')
}

const viewAllActivities = () => {
  console.log('查看所有活动记录')
}

// 辅助函数
const getRoleType = (role: string) => {
  const typeMap: Record<string, any> = {
    '学员': 'primary',
    '导师': 'success',
    '管理员': 'warning'
  }
  return typeMap[role] || 'info'
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  return '#67C23A'
}

const getActivityType = (type: string) => {
  const typeMap: Record<string, any> = {
    course: 'success',
    activity: 'primary',
    post: 'warning',
    resource: 'info'
  }
  return typeMap[type] || 'info'
}

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    course: 'Reading',
    activity: 'Calendar',
    post: 'ChatDotRound',
    resource: 'Document'
  }
  return iconMap[type] || 'InfoFilled'
}
</script>

<style scoped lang="scss">
.profile {
  .profile-header {
    display: flex;
    gap: $spacing-xl;
    padding: $spacing-xl;
    
    .profile-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-md;
      flex-shrink: 0;
      
      .change-avatar-btn {
        border-radius: 20px;
      }
    }
    
    .profile-info {
      flex: 1;
      
      .info-header {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
        
        h1 {
          margin: 0;
          color: $text-primary;
          font-size: 2rem;
        }
      }
      
      .info-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: $spacing-md;
        margin-bottom: $spacing-xl;
        
        .info-item {
          display: flex;
          align-items: center;
          gap: $spacing-sm;
          color: $text-secondary;
          
          .el-icon {
            color: $primary-color;
          }
        }
      }
      
      .profile-stats {
        display: flex;
        gap: $spacing-xl;
        
        .stat-item {
          text-align: center;
          
          .stat-number {
            font-size: 2rem;
            font-weight: 600;
            color: $primary-color;
            margin-bottom: $spacing-xs;
          }
          
          .stat-label {
            color: $text-secondary;
            font-size: $font-size-sm;
          }
        }
      }
    }
  }
  
  .section-title {
    margin: 0 0 $spacing-md 0;
    color: $text-primary;
    font-size: $font-size-lg;
    border-left: 4px solid $primary-color;
    padding-left: $spacing-sm;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .section-title {
      margin: 0;
    }
  }
  
  .quick-actions {
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-md;
      
      .action-item {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-md;
        border: 1px solid $border-color;
        border-radius: $border-radius-md;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: $primary-color;
          transform: translateY(-2px);
          box-shadow: $shadow-light;
        }
        
        span {
          font-size: $font-size-sm;
          color: $text-primary;
        }
      }
    }
  }
  
  .learning-progress {
    .progress-item {
      margin-bottom: $spacing-lg;
      
      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-sm;
        font-weight: 500;
        color: $text-primary;
      }
    }
    
    .progress-details {
      .course-progress {
        margin-bottom: $spacing-md;
        
        .course-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: $spacing-xs;
          
          .course-name {
            font-size: $font-size-sm;
            color: $text-primary;
          }
          
          .course-percent {
            font-size: $font-size-sm;
            color: $text-secondary;
          }
        }
      }
    }
  }
  
  .my-collections {
    .collection-stats {
      .collection-item {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm 0;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .collection-label {
          flex: 1;
          font-size: $font-size-sm;
          color: $text-primary;
        }
        
        .collection-count {
          font-size: $font-size-sm;
          color: $text-secondary;
          font-weight: 500;
        }
      }
    }
  }
  
  .recent-activities {
    .timeline-content {
      .activity-header {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-sm;
        
        .activity-title {
          font-weight: 500;
          color: $text-primary;
        }
        
        .el-icon {
          color: $primary-color;
        }
      }
      
      .activity-description {
        margin: 0;
        color: $text-secondary;
        font-size: $font-size-sm;
        line-height: 1.6;
      }
    }
  }
}

:deep(.el-timeline-item__timestamp) {
  color: $text-secondary;
  font-size: $font-size-sm;
}

@media (max-width: 768px) {
  .profile {
    .profile-header {
      flex-direction: column;
      text-align: center;
      
      .profile-info {
        .info-content {
          grid-template-columns: 1fr;
        }
        
        .profile-stats {
          justify-content: space-around;
        }
      }
    }
    
    .quick-actions {
      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
