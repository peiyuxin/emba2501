<template>
  <div class="forum">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>讨论论坛</h1>
          <p>学术讨论，思想碰撞，智慧分享</p>
        </div>
        <div class="page-actions">
          <el-button type="primary" icon="EditPen" @click="handleCreatePost">
            发表主题
          </el-button>
        </div>
      </div>

      <!-- 论坛统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in forumStats" :key="stat.label">
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

      <!-- 分类导航 -->
      <div class="category-tabs mb-24">
        <el-tabs v-model="activeCategory" @tab-click="handleTabClick">
          <el-tab-pane 
            v-for="category in categories" 
            :key="category.value"
            :label="category.label" 
            :name="category.value"
          >
            <template #label>
              <span class="tab-label">
                <el-icon><component :is="category.icon" /></el-icon>
                {{ category.label }}
                <el-badge :value="category.count" :hidden="category.count === 0" />
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 热门话题 -->
      <div class="hot-topics card mb-24">
        <div class="section-header">
          <h3>🔥 热门话题</h3>
        </div>
        <div class="topics-list">
          <el-tag 
            v-for="topic in hotTopics" 
            :key="topic"
            class="topic-tag"
            type="warning"
            effect="plain"
            @click="handleTopicClick(topic)"
          >
            {{ topic }}
          </el-tag>
        </div>
      </div>

      <!-- 讨论列表 -->
      <div class="posts-list">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="post-item card"
          @click="handleViewPost(post)"
        >
          <!-- 帖子头部 -->
          <div class="post-header">
            <div class="post-user">
              <el-avatar :src="post.author.avatar" :icon="UserFilled" size="medium" />
              <div class="user-info">
                <div class="username">{{ post.author.name }}</div>
                <div class="user-role">{{ post.author.title }}</div>
              </div>
            </div>
            <div class="post-meta">
              <el-tag :type="getCategoryColor(post.category)" size="small">
                {{ getCategoryLabel(post.category) }}
              </el-tag>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
          </div>

          <!-- 帖子内容 -->
          <div class="post-content">
            <h3 class="post-title">
              {{ post.title }}
              <el-tag v-if="post.isPinned" type="danger" size="small">置顶</el-tag>
              <el-tag v-if="post.isHot" type="warning" size="small">热门</el-tag>
            </h3>
            <p class="post-summary">{{ post.summary }}</p>
            
            <!-- 帖子标签 -->
            <div class="post-tags" v-if="post.tags && post.tags.length">
              <el-tag 
                v-for="tag in post.tags" 
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <!-- 帖子统计 -->
          <div class="post-stats">
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ post.viewCount }}</span>
            </div>
            <div class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.replyCount }}</span>
            </div>
            <div class="stat-item">
              <el-icon><StarFilled /></el-icon>
              <span>{{ post.likeCount }}</span>
            </div>
            <div class="stat-item last-reply">
              <el-icon><Clock /></el-icon>
              <span>{{ formatTime(post.lastReplyAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 暂无数据 -->
      <el-empty v-if="filteredPosts.length === 0" description="暂无讨论帖子" />

      <!-- 分页 -->
      <div class="pagination-container" v-if="filteredPosts.length > 0">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 发帖对话框 -->
    <CreatePostDialog
      v-model="createPostVisible"
      @success="handlePostSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
// import CreatePostDialog from './components/CreatePostDialog.vue'

// 响应式数据
const activeCategory = ref('all')
const createPostVisible = ref(false)

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

// 论坛统计
const forumStats = computed(() => [
  {
    label: '总主题数',
    value: '156',
    icon: 'Document',
    color: '#409EFF'
  },
  {
    label: '总回复数',
    value: '1,286',
    icon: 'ChatDotRound',
    color: '#67C23A'
  },
  {
    label: '活跃用户',
    value: '38',
    icon: 'UserFilled',
    color: '#E6A23C'
  },
  {
    label: '今日新增',
    value: '5',
    icon: 'TrendCharts',
    color: '#F56C6C'
  }
])

// 分类列表
const categories = [
  { label: '全部', value: 'all', icon: 'Menu', count: 156 },
  { label: '学术讨论', value: 'academic', icon: 'Reading', count: 45 },
  { label: '案例分析', value: 'case', icon: 'DataAnalysis', count: 32 },
  { label: '行业资讯', value: 'industry', icon: 'Newspaper', count: 28 },
  { label: '求助问答', value: 'qa', icon: 'QuestionFilled', count: 24 },
  { label: '经验分享', value: 'experience', icon: 'Share', count: 18 },
  { label: '闲聊灌水', value: 'chat', icon: 'ChatSquare', count: 9 }
]

// 热门话题
const hotTopics = [
  '数字化转型', 'AI人工智能', '供应链管理', '企业战略', '领导力',
  '品牌营销', '创新管理', '财务分析', '人才培养', '商业模式'
]

// 模拟帖子数据
const mockPosts = [
  {
    id: 1,
    title: '关于企业数字化转型的思考与实践',
    summary: '结合我公司的数字化转型经验，分享一些心得体会和踩过的坑...',
    content: '',
    category: 'academic',
    author: {
      name: '张三',
      title: 'CEO',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    tags: ['数字化转型', '企业管理', '创新'],
    viewCount: 256,
    replyCount: 18,
    likeCount: 32,
    isPinned: true,
    isHot: true,
    createdAt: '2024-01-15 14:30:00',
    lastReplyAt: '2024-01-16 09:15:00'
  },
  {
    id: 2,
    title: '如何构建高效的企业文化体系？',
    summary: '企业文化是企业发展的根基，如何在快速发展中保持文化传承...',
    content: '',
    category: 'experience',
    author: {
      name: '李四',
      title: 'HR总监',
      avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    },
    tags: ['企业文化', '人力资源', '组织管理'],
    viewCount: 189,
    replyCount: 12,
    likeCount: 25,
    isPinned: false,
    isHot: true,
    createdAt: '2024-01-14 16:20:00',
    lastReplyAt: '2024-01-15 11:30:00'
  },
  {
    id: 3,
    title: 'AI时代下的商业模式创新',
    summary: '人工智能正在重塑各个行业，传统商业模式面临哪些挑战...',
    content: '',
    category: 'industry',
    author: {
      name: '王五',
      title: 'CTO',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    tags: ['人工智能', '商业模式', '科技创新'],
    viewCount: 143,
    replyCount: 8,
    likeCount: 19,
    isPinned: false,
    isHot: false,
    createdAt: '2024-01-13 10:45:00',
    lastReplyAt: '2024-01-14 15:20:00'
  }
]

const allPosts = ref(mockPosts)

// 计算属性 - 过滤后的帖子
const filteredPosts = computed(() => {
  let filtered = allPosts.value

  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(post => post.category === activeCategory.value)
  }

  // 按置顶、热门、时间排序
  return filtered.sort((a, b) => {
    // 置顶帖子优先
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // 热门帖子其次
    if (a.isHot && !b.isHot) return -1
    if (!a.isHot && b.isHot) return 1
    
    // 最后按最新回复时间排序
    return new Date(b.lastReplyAt).getTime() - new Date(a.lastReplyAt).getTime()
  })
})

// 生命周期
onMounted(() => {
  pagination.total = allPosts.value.length
})

// 方法
const handleTabClick = (tab: any) => {
  activeCategory.value = tab.name
}

const handleCreatePost = () => {
  createPostVisible.value = true
}

const handleViewPost = (post: any) => {
  console.log('查看帖子:', post.title)
  // 跳转到帖子详情页
}

const handleTopicClick = (topic: string) => {
  console.log('搜索话题:', topic)
  // 实现话题搜索
}

const handlePostSuccess = () => {
  // 刷新帖子列表
  console.log('发帖成功')
}

// 辅助函数
const getCategoryLabel = (category: string) => {
  const categoryMap = categories.find(cat => cat.value === category)
  return categoryMap ? categoryMap.label : '未分类'
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, any> = {
    academic: 'primary',
    case: 'success',
    industry: 'warning',
    qa: 'danger',
    experience: 'info',
    chat: ''
  }
  return colorMap[category] || 'info'
}

const formatTime = (time: string) => {
  const now = dayjs()
  const postTime = dayjs(time)
  const diffMinutes = now.diff(postTime, 'minute')
  const diffHours = now.diff(postTime, 'hour')
  const diffDays = now.diff(postTime, 'day')

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24) {
    return `${diffHours}小时前`
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return postTime.format('MM-DD HH:mm')
  }
}
</script>

<style scoped lang="scss">
.forum {
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
  
  .category-tabs {
    .tab-label {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }
  }
  
  .hot-topics {
    .section-header {
      margin-bottom: $spacing-md;
      
      h3 {
        margin: 0;
        color: $text-primary;
        font-size: $font-size-lg;
      }
    }
    
    .topics-list {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      
      .topic-tag {
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
  
  .posts-list {
    .post-item {
      margin-bottom: $spacing-md;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-medium;
      }
      
      .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: $spacing-md;
        
        .post-user {
          display: flex;
          align-items: center;
          gap: $spacing-md;
          
          .user-info {
            .username {
              font-weight: 500;
              color: $text-primary;
              margin-bottom: 2px;
            }
            
            .user-role {
              font-size: $font-size-sm;
              color: $text-secondary;
            }
          }
        }
        
        .post-meta {
          display: flex;
          align-items: center;
          gap: $spacing-md;
          
          .post-time {
            font-size: $font-size-sm;
            color: $text-secondary;
          }
        }
      }
      
      .post-content {
        margin-bottom: $spacing-md;
        
        .post-title {
          margin: 0 0 $spacing-sm 0;
          color: $text-primary;
          font-size: $font-size-lg;
          line-height: 1.4;
          display: flex;
          align-items: center;
          gap: $spacing-sm;
        }
        
        .post-summary {
          margin: 0 0 $spacing-sm 0;
          color: $text-secondary;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-xs;
        }
      }
      
      .post-stats {
        display: flex;
        align-items: center;
        gap: $spacing-lg;
        padding-top: $spacing-md;
        border-top: 1px solid $border-light;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: $font-size-sm;
          color: $text-secondary;
          
          .el-icon {
            color: $primary-color;
          }
          
          &.last-reply {
            margin-left: auto;
          }
        }
      }
    }
  }
  
  .pagination-container {
    padding: $spacing-xl 0;
    text-align: center;
  }
}

:deep(.el-tabs__item) {
  font-weight: 500;
  
  &.is-active {
    color: $primary-color;
  }
}

:deep(.el-tabs__active-bar) {
  background-color: $primary-color;
}

@media (max-width: 768px) {
  .forum {
    .post-header {
      flex-direction: column;
      gap: $spacing-md;
    }
    
    .post-stats {
      flex-wrap: wrap;
      gap: $spacing-md;
      
      .last-reply {
        margin-left: 0;
      }
    }
    
    .hot-topics .topics-list {
      gap: $spacing-xs;
    }
  }
}
</style>
