<template>
  <div class="resources">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>学习资源</h1>
          <p>汇聚优质学习资料，助力知识成长</p>
        </div>
        <div class="page-actions">
          <el-button type="primary" icon="Upload" @click="handleUploadResource">
            上传资源
          </el-button>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filters card mb-24">
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-select v-model="filters.category" placeholder="资源分类" clearable>
              <el-option label="全部" value="" />
              <el-option label="课程课件" value="courseware" />
              <el-option label="案例分析" value="case_study" />
              <el-option label="学术论文" value="paper" />
              <el-option label="视频教程" value="video" />
              <el-option label="电子书籍" value="ebook" />
              <el-option label="工具模板" value="template" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.subject" placeholder="学科领域" clearable>
              <el-option label="全部" value="" />
              <el-option label="战略管理" value="strategy" />
              <el-option label="财务管理" value="finance" />
              <el-option label="市场营销" value="marketing" />
              <el-option label="人力资源" value="hr" />
              <el-option label="运营管理" value="operations" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索资源名称"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 资源统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in resourceStats" :key="stat.label">
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

      <!-- 快速分类 -->
      <div class="quick-categories mb-24">
        <div 
          v-for="category in quickCategories" 
          :key="category.value"
          class="category-item"
          @click="handleCategoryClick(category.value)"
        >
          <div class="category-icon">
            <el-icon :size="24" :color="category.color">
              <component :is="category.icon" />
            </el-icon>
          </div>
          <div class="category-info">
            <div class="category-name">{{ category.label }}</div>
            <div class="category-count">{{ category.count }} 个资源</div>
          </div>
        </div>
      </div>

      <!-- 资源列表 -->
      <div class="resources-list">
        <div 
          v-for="resource in filteredResources" 
          :key="resource.id"
          class="resource-item card"
        >
          <!-- 资源图标 -->
          <div class="resource-icon">
            <el-icon :size="32" :color="getResourceColor(resource.type)">
              <component :is="getResourceIcon(resource.type)" />
            </el-icon>
          </div>

          <!-- 资源信息 -->
          <div class="resource-info">
            <div class="resource-header">
              <h3 class="resource-title">{{ resource.title }}</h3>
              <div class="resource-meta">
                <el-tag :type="getCategoryType(resource.category)" size="small">
                  {{ getCategoryLabel(resource.category) }}
                </el-tag>
                <span class="resource-size">{{ resource.size }}</span>
              </div>
            </div>
            
            <p class="resource-description">{{ resource.description }}</p>
            
            <div class="resource-details">
              <div class="detail-item">
                <el-icon><User /></el-icon>
                <span>{{ resource.uploader }}</span>
              </div>
              <div class="detail-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ resource.uploadDate }}</span>
              </div>
              <div class="detail-item">
                <el-icon><View /></el-icon>
                <span>{{ resource.viewCount }} 次查看</span>
              </div>
              <div class="detail-item">
                <el-icon><Download /></el-icon>
                <span>{{ resource.downloadCount }} 次下载</span>
              </div>
            </div>
          </div>

          <!-- 资源操作 -->
          <div class="resource-actions">
            <el-button 
              type="primary" 
              size="small"
              @click="handleDownload(resource)"
            >
              <el-icon><Download /></el-icon>
              下载
            </el-button>
            <el-button 
              type="info" 
              size="small"
              @click="handlePreview(resource)"
            >
              <el-icon><View /></el-icon>
              预览
            </el-button>
            <el-button 
              type="text" 
              size="small"
              @click="handleCollect(resource)"
            >
              <el-icon :class="{ 'collected': resource.isCollected }">
                <component :is="resource.isCollected ? 'StarFilled' : 'Star'" />
              </el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 暂无数据 -->
      <el-empty v-if="filteredResources.length === 0" description="暂无学习资源" />

      <!-- 分页 -->
      <div class="pagination-container" v-if="filteredResources.length > 0">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 上传资源对话框 -->
    <UploadResourceDialog
      v-model="uploadDialogVisible"
      @success="handleUploadSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
// import UploadResourceDialog from './components/UploadResourceDialog.vue'

// 响应式数据
const uploadDialogVisible = ref(false)

const filters = reactive({
  category: '',
  subject: '',
  keyword: ''
})

const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

// 资源统计
const resourceStats = computed(() => [
  {
    label: '总资源数',
    value: '342',
    icon: 'FolderOpened',
    color: '#409EFF'
  },
  {
    label: '今日新增',
    value: '8',
    icon: 'Plus',
    color: '#67C23A'
  },
  {
    label: '下载次数',
    value: '1,286',
    icon: 'Download',
    color: '#E6A23C'
  },
  {
    label: '存储空间',
    value: '15.6GB',
    icon: 'Coin',
    color: '#F56C6C'
  }
])

// 快速分类
const quickCategories = [
  { label: '课程课件', value: 'courseware', icon: 'Reading', color: '#409EFF', count: 89 },
  { label: '案例分析', value: 'case_study', icon: 'DataAnalysis', color: '#67C23A', count: 67 },
  { label: '学术论文', value: 'paper', icon: 'Document', color: '#E6A23C', count: 45 },
  { label: '视频教程', value: 'video', icon: 'VideoPlay', color: '#F56C6C', count: 38 },
  { label: '电子书籍', value: 'ebook', icon: 'Notebook', color: '#909399', count: 56 },
  { label: '工具模板', value: 'template', icon: 'Grid', color: '#606266', count: 47 }
]

// 模拟资源数据
const mockResources = [
  {
    id: 1,
    title: '企业战略管理经典案例集',
    description: '汇集国内外知名企业战略管理成功案例，深入分析决策过程和执行策略',
    category: 'case_study',
    subject: 'strategy',
    type: 'pdf',
    size: '12.5MB',
    uploader: '张教授',
    uploadDate: '2024-01-15',
    viewCount: 256,
    downloadCount: 89,
    isCollected: true
  },
  {
    id: 2,
    title: '财务分析与企业估值模型',
    description: 'Excel财务分析模板，包含完整的企业估值模型和敏感性分析工具',
    category: 'template',
    subject: 'finance',
    type: 'excel',
    size: '3.2MB',
    uploader: '李教授',
    uploadDate: '2024-01-14',
    viewCount: 189,
    downloadCount: 156,
    isCollected: false
  },
  {
    id: 3,
    title: '数字营销策略与实践',
    description: '深度解析数字化时代的营销策略，包含社交媒体、内容营销等前沿实践',
    category: 'video',
    subject: 'marketing',
    type: 'mp4',
    size: '256MB',
    uploader: '王教授',
    uploadDate: '2024-01-13',
    viewCount: 423,
    downloadCount: 234,
    isCollected: true
  }
]

const allResources = ref(mockResources)

// 计算属性 - 过滤后的资源
const filteredResources = computed(() => {
  let filtered = allResources.value

  if (filters.category) {
    filtered = filtered.filter(resource => resource.category === filters.category)
  }

  if (filters.subject) {
    filtered = filtered.filter(resource => resource.subject === filters.subject)
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(keyword) ||
      resource.description.toLowerCase().includes(keyword)
    )
  }

  return filtered.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
})

// 生命周期
onMounted(() => {
  pagination.total = allResources.value.length
})

// 方法
const handleSearch = () => {
  // 搜索逻辑已在 computed 中实现
}

const handleReset = () => {
  Object.assign(filters, {
    category: '',
    subject: '',
    keyword: ''
  })
}

const handleUploadResource = () => {
  uploadDialogVisible.value = true
}

const handleCategoryClick = (category: string) => {
  filters.category = category
}

const handleDownload = (resource: any) => {
  resource.downloadCount += 1
  console.log('下载资源:', resource.title)
  // 实现下载逻辑
}

const handlePreview = (resource: any) => {
  resource.viewCount += 1
  console.log('预览资源:', resource.title)
  // 实现预览逻辑
}

const handleCollect = (resource: any) => {
  resource.isCollected = !resource.isCollected
  console.log(resource.isCollected ? '收藏资源' : '取消收藏', resource.title)
}

const handleUploadSuccess = () => {
  // 刷新资源列表
  console.log('资源上传成功')
}

// 辅助函数
const getCategoryLabel = (category: string) => {
  const categoryMap = quickCategories.find(cat => cat.value === category)
  return categoryMap ? categoryMap.label : '未分类'
}

const getCategoryType = (category: string) => {
  const typeMap: Record<string, any> = {
    courseware: 'primary',
    case_study: 'success',
    paper: 'warning',
    video: 'danger',
    ebook: 'info',
    template: ''
  }
  return typeMap[category] || 'info'
}

const getResourceIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'Document',
    doc: 'Document',
    docx: 'Document',
    excel: 'Grid',
    ppt: 'Document',
    mp4: 'VideoPlay',
    mp3: 'Microphone',
    zip: 'FolderOpened',
    image: 'Picture'
  }
  return iconMap[type] || 'Document'
}

const getResourceColor = (type: string) => {
  const colorMap: Record<string, string> = {
    pdf: '#E74C3C',
    doc: '#3498DB',
    docx: '#3498DB',
    excel: '#27AE60',
    ppt: '#E67E22',
    mp4: '#9B59B6',
    mp3: '#F39C12',
    zip: '#34495E',
    image: '#1ABC9C'
  }
  return colorMap[type] || '#95A5A6'
}
</script>

<style scoped lang="scss">
.resources {
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
  
  .quick-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-md;
    
    .category-item {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      padding: $spacing-md;
      background: $bg-primary;
      border-radius: $border-radius-md;
      border: 1px solid $border-color;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-light;
        border-color: $primary-color;
      }
      
      .category-info {
        .category-name {
          font-weight: 500;
          color: $text-primary;
          margin-bottom: 2px;
        }
        
        .category-count {
          font-size: $font-size-sm;
          color: $text-secondary;
        }
      }
    }
  }
  
  .resources-list {
    .resource-item {
      display: flex;
      align-items: flex-start;
      gap: $spacing-lg;
      padding: $spacing-lg;
      margin-bottom: $spacing-md;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-medium;
      }
      
      .resource-icon {
        flex-shrink: 0;
        width: 60px;
        height: 60px;
        background: $bg-hover;
        border-radius: $border-radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .resource-info {
        flex: 1;
        
        .resource-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: $spacing-sm;
          
          .resource-title {
            margin: 0;
            color: $text-primary;
            font-size: $font-size-lg;
            line-height: 1.4;
          }
          
          .resource-meta {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
            
            .resource-size {
              font-size: $font-size-sm;
              color: $text-secondary;
            }
          }
        }
        
        .resource-description {
          margin: 0 0 $spacing-md 0;
          color: $text-secondary;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .resource-details {
          display: flex;
          gap: $spacing-lg;
          
          .detail-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: $font-size-sm;
            color: $text-secondary;
            
            .el-icon {
              color: $primary-color;
            }
          }
        }
      }
      
      .resource-actions {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        flex-shrink: 0;
        
        .collected {
          color: $warning-color;
        }
      }
    }
  }
  
  .pagination-container {
    padding: $spacing-xl 0;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .resources {
    .quick-categories {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: $spacing-sm;
    }
    
    .resource-item {
      flex-direction: column;
      
      .resource-actions {
        flex-direction: row;
        align-self: stretch;
        
        .el-button {
          flex: 1;
        }
      }
      
      .resource-details {
        flex-wrap: wrap;
        gap: $spacing-md;
      }
    }
    
    .filters .el-row {
      flex-direction: column;
      gap: $spacing-md;
    }
  }
}
</style>
