<template>
  <div class="activities">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>班级活动</h1>
          <p>记录我们一起走过的美好时光</p>
        </div>
        <div class="page-actions">
          <el-button type="primary" icon="Plus" @click="handleCreateActivity">
            创建活动
          </el-button>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filters card mb-24">
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-select v-model="filters.status" placeholder="活动状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="即将开始" value="upcoming" />
              <el-option label="进行中" value="ongoing" />
              <el-option label="已结束" value="finished" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.type" placeholder="活动类型" clearable>
              <el-option label="全部" value="" />
              <el-option label="学术讲座" value="lecture" />
              <el-option label="企业参访" value="visit" />
              <el-option label="团建活动" value="team" />
              <el-option label="文化交流" value="culture" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="filters.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 活动统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in activityStats" :key="stat.label">
          <div class="stat-card card">
            <div class="stat-icon">
              <el-icon :size="28" :color="stat.color">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 活动列表 -->
      <div class="activities-grid">
        <div 
          v-for="activity in filteredActivities" 
          :key="activity.id"
          class="activity-card card"
        >
          <!-- 活动头部 -->
          <div class="activity-header">
            <div class="activity-image">
              <img :src="activity.image" :alt="activity.title" />
              <div class="activity-status" :class="activity.status">
                {{ getStatusLabel(activity.status) }}
              </div>
            </div>
          </div>

          <!-- 活动内容 -->
          <div class="activity-content">
            <div class="activity-meta">
              <el-tag :type="getTypeColor(activity.type)" size="small">
                {{ getTypeLabel(activity.type) }}
              </el-tag>
              <span class="activity-date">
                <el-icon><Calendar /></el-icon>
                {{ activity.date }}
              </span>
            </div>

            <h3 class="activity-title">{{ activity.title }}</h3>
            <p class="activity-description">{{ activity.description }}</p>

            <div class="activity-details">
              <div class="detail-item">
                <el-icon><LocationInformation /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="detail-item">
                <el-icon><Clock /></el-icon>
                <span>{{ activity.time }}</span>
              </div>
              <div class="detail-item">
                <el-icon><User /></el-icon>
                <span>{{ activity.participants }}/{{ activity.capacity }}人</span>
              </div>
            </div>
          </div>

          <!-- 活动操作 -->
          <div class="activity-actions">
            <el-button 
              type="primary" 
              size="small"
              @click="handleViewDetail(activity)"
            >
              查看详情
            </el-button>
            <el-button 
              v-if="activity.status === 'upcoming'"
              type="success" 
              size="small"
              @click="handleJoinActivity(activity)"
              :disabled="activity.participants >= activity.capacity"
            >
              {{ activity.isJoined ? '已报名' : '立即报名' }}
            </el-button>
            <el-button 
              v-if="activity.status === 'finished'"
              type="info" 
              size="small"
              @click="handleViewPhotos(activity)"
            >
              查看照片
            </el-button>
          </div>
        </div>
      </div>

      <!-- 暂无数据 -->
      <el-empty v-if="filteredActivities.length === 0" description="暂无活动数据" />
    </div>

    <!-- 活动详情对话框 -->
    <ActivityDetailDialog
      v-model="detailDialogVisible"
      :activity-data="selectedActivity"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
// import ActivityDetailDialog from './components/ActivityDetailDialog.vue'

// 响应式数据
const detailDialogVisible = ref(false)
const selectedActivity = ref<any>(null)

const filters = reactive({
  status: '',
  type: '',
  dateRange: null as [string, string] | null
})

// 活动统计
const activityStats = computed(() => [
  {
    label: '总活动数',
    value: '18',
    icon: 'Calendar',
    color: '#409EFF'
  },
  {
    label: '即将开始',
    value: '3',
    icon: 'Timer',
    color: '#E6A23C'
  },
  {
    label: '我的参与',
    value: '12',
    icon: 'UserFilled',
    color: '#67C23A'
  },
  {
    label: '活动照片',
    value: '286',
    icon: 'Picture',
    color: '#F56C6C'
  }
])

// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '腾讯总部企业参访',
    description: '深入了解科技巨头的企业文化和创新理念，与高管面对面交流',
    type: 'visit',
    status: 'upcoming',
    date: '2024-02-15',
    time: '09:00-17:00',
    location: '深圳腾讯总部',
    capacity: 30,
    participants: 25,
    isJoined: true,
    image: 'https://picsum.photos/400/200?random=1'
  },
  {
    id: 2,
    title: '数字化转型专题讲座',
    description: '邀请行业专家分享数字化转型的实践经验和未来趋势',
    type: 'lecture',
    status: 'ongoing',
    date: '2024-02-10',
    time: '14:00-16:00',
    location: '学术报告厅',
    capacity: 50,
    participants: 42,
    isJoined: true,
    image: 'https://picsum.photos/400/200?random=2'
  },
  {
    id: 3,
    title: '班级新春联欢会',
    description: '辞旧迎新，同学们欢聚一堂，共度美好时光',
    type: 'culture',
    status: 'finished',
    date: '2024-01-20',
    time: '18:00-21:00',
    location: '文化会堂',
    capacity: 60,
    participants: 55,
    isJoined: true,
    image: 'https://picsum.photos/400/200?random=3'
  },
  {
    id: 4,
    title: '户外团建拓展活动',
    description: '通过团队协作游戏增进同学友谊，提升团队凝聚力',
    type: 'team',
    status: 'finished',
    date: '2024-01-15',
    time: '10:00-16:00',
    location: '怀柔拓展基地',
    capacity: 40,
    participants: 38,
    isJoined: true,
    image: 'https://picsum.photos/400/200?random=4'
  }
]

const allActivities = ref(mockActivities)

// 计算属性 - 过滤后的活动
const filteredActivities = computed(() => {
  let filtered = allActivities.value

  if (filters.status) {
    filtered = filtered.filter(activity => activity.status === filters.status)
  }

  if (filters.type) {
    filtered = filtered.filter(activity => activity.type === filters.type)
  }

  if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
    filtered = filtered.filter(activity => {
      const activityDate = new Date(activity.date)
      const startDate = new Date(filters.dateRange![0])
      const endDate = new Date(filters.dateRange![1])
      return activityDate >= startDate && activityDate <= endDate
    })
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 生命周期
onMounted(() => {
  // 初始化数据
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在 computed 中实现
}

const handleReset = () => {
  Object.assign(filters, {
    status: '',
    type: '',
    dateRange: null
  })
}

const handleCreateActivity = () => {
  console.log('创建新活动')
  // 实现创建活动逻辑
}

const handleViewDetail = (activity: any) => {
  selectedActivity.value = activity
  detailDialogVisible.value = true
}

const handleJoinActivity = (activity: any) => {
  if (!activity.isJoined && activity.participants < activity.capacity) {
    activity.isJoined = true
    activity.participants += 1
    console.log('报名活动:', activity.title)
  }
}

const handleViewPhotos = (activity: any) => {
  console.log('查看活动照片:', activity.title)
  // 跳转到相册页面
}

// 辅助函数
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    finished: '已结束'
  }
  return labelMap[status] || '未知'
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    lecture: '学术讲座',
    visit: '企业参访',
    team: '团建活动',
    culture: '文化交流'
  }
  return labelMap[type] || '其他'
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, any> = {
    lecture: 'primary',
    visit: 'success',
    team: 'warning',
    culture: 'danger'
  }
  return colorMap[type] || 'info'
}
</script>

<style scoped lang="scss">
.activities {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .page-title {
      h1 {
        margin: 0 0 $spacing-sm 0;
        color: $text-primary;
      }
      
      p {
        margin: 0;
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    
    .stat-info {
      .stat-number {
        font-size: $font-size-xl;
        font-weight: 600;
        color: $text-primary;
        margin-bottom: $spacing-xs;
      }
      
      .stat-label {
        color: $text-secondary;
        font-size: $font-size-sm;
      }
    }
  }
  
  .activities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: $spacing-lg;
    
    .activity-card {
      transition: all 0.3s ease;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-medium;
      }
      
      .activity-header {
        position: relative;
        
        .activity-image {
          position: relative;
          height: 200px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          &:hover img {
            transform: scale(1.05);
          }
          
          .activity-status {
            position: absolute;
            top: $spacing-md;
            right: $spacing-md;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: $font-size-sm;
            font-weight: 500;
            color: white;
            
            &.upcoming {
              background: $warning-color;
            }
            
            &.ongoing {
              background: $success-color;
            }
            
            &.finished {
              background: $info-color;
            }
          }
        }
      }
      
      .activity-content {
        padding: $spacing-lg;
        
        .activity-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: $spacing-md;
          
          .activity-date {
            display: flex;
            align-items: center;
            gap: 4px;
            color: $text-secondary;
            font-size: $font-size-sm;
          }
        }
        
        .activity-title {
          margin: 0 0 $spacing-sm 0;
          color: $text-primary;
          font-size: $font-size-lg;
          line-height: 1.4;
        }
        
        .activity-description {
          margin: 0 0 $spacing-md 0;
          color: $text-secondary;
          font-size: $font-size-sm;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .activity-details {
          display: flex;
          flex-direction: column;
          gap: $spacing-xs;
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: $spacing-xs;
            color: $text-secondary;
            font-size: $font-size-sm;
            
            .el-icon {
              color: $primary-color;
              flex-shrink: 0;
            }
          }
        }
      }
      
      .activity-actions {
        padding: 0 $spacing-lg $spacing-lg $spacing-lg;
        display: flex;
        gap: $spacing-sm;
        
        .el-button {
          flex: 1;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .activities {
    .activities-grid {
      grid-template-columns: 1fr;
      
      .activity-card {
        margin-bottom: $spacing-md;
      }
    }
    
    .filters .el-row {
      flex-direction: column;
      gap: $spacing-md;
    }
    
    .page-header {
      flex-direction: column;
      gap: $spacing-md;
    }
  }
}
</style>
