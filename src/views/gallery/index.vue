<template>
  <div class="gallery">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>班级相册</h1>
          <p>记录EMBA2501班的美好时光</p>
        </div>
        <div class="page-actions">
          <el-upload
            :before-upload="beforeUpload"
            :show-file-list="false"
            accept="image/*"
            multiple
          >
            <el-button type="primary" icon="Upload">上传照片</el-button>
          </el-upload>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filters card mb-24">
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-select v-model="selectedCategory" placeholder="选择相册分类" @change="filterPhotos">
              <el-option label="全部" value="" />
              <el-option 
                v-for="category in categories" 
                :key="category.value" 
                :label="category.label" 
                :value="category.value" 
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="filterPhotos"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索活动名称"
              clearable
              @input="filterPhotos"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-radio-group v-model="viewMode" @change="handleViewModeChange">
              <el-radio-button value="grid">网格</el-radio-button>
              <el-radio-button value="timeline">时间轴</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>

      <!-- 相册统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in galleryStats" :key="stat.label">
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

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <div 
          v-for="album in filteredAlbums" 
          :key="album.id"
          class="album-card card"
        >
          <div class="album-header">
            <div class="album-info">
              <h3 class="album-title">{{ album.title }}</h3>
              <div class="album-meta">
                <span class="album-date">
                  <el-icon><Calendar /></el-icon>
                  {{ album.date }}
                </span>
                <span class="album-count">
                  <el-icon><Picture /></el-icon>
                  {{ album.photos.length }}张
                </span>
                <el-tag :type="getCategoryType(album.category)" size="small">
                  {{ getCategoryLabel(album.category) }}
                </el-tag>
              </div>
            </div>
            <el-dropdown @command="handleAlbumAction">
              <el-button type="text" icon="MoreFilled" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="`edit:${album.id}`" icon="Edit">编辑</el-dropdown-item>
                  <el-dropdown-item :command="`download:${album.id}`" icon="Download">下载</el-dropdown-item>
                  <el-dropdown-item :command="`delete:${album.id}`" icon="Delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <div class="photo-grid">
            <div 
              v-for="(photo, index) in album.photos.slice(0, 6)" 
              :key="photo.id"
              class="photo-item"
              :class="{ 'more-overlay': index === 5 && album.photos.length > 6 }"
              @click="openLightbox(album, index)"
            >
              <img :src="photo.thumbnail" :alt="photo.title" />
              <div v-if="index === 5 && album.photos.length > 6" class="more-count">
                +{{ album.photos.length - 6 }}
              </div>
            </div>
          </div>
          
          <div class="album-footer">
            <p class="album-description">{{ album.description }}</p>
            <el-button type="primary" size="small" @click="viewAlbum(album)">
              查看相册 ({{ album.photos.length }})
            </el-button>
          </div>
        </div>
      </div>

      <!-- 时间轴视图 -->
      <div v-else class="timeline-view">
        <el-timeline>
          <el-timeline-item
            v-for="album in filteredAlbums"
            :key="album.id"
            :timestamp="album.date"
            placement="top"
          >
            <div class="timeline-album card">
              <div class="timeline-header">
                <h3>{{ album.title }}</h3>
                <el-tag :type="getCategoryType(album.category)" size="small">
                  {{ getCategoryLabel(album.category) }}
                </el-tag>
              </div>
              <div class="timeline-photos">
                <div 
                  v-for="(photo, index) in album.photos.slice(0, 4)" 
                  :key="photo.id"
                  class="timeline-photo"
                  @click="openLightbox(album, index)"
                >
                  <img :src="photo.thumbnail" :alt="photo.title" />
                </div>
                <div v-if="album.photos.length > 4" class="more-photos">
                  +{{ album.photos.length - 4 }}
                </div>
              </div>
              <p>{{ album.description }}</p>
              <el-button type="text" @click="viewAlbum(album)">
                查看全部 {{ album.photos.length }} 张照片
              </el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

    <!-- 灯箱组件 -->
    <PhotoLightbox
      v-model="lightboxVisible"
      :photos="currentPhotos"
      :current-index="currentPhotoIndex"
    />

    <!-- 相册详情对话框 -->
    <AlbumDetailDialog
      v-model="albumDetailVisible"
      :album-data="selectedAlbum"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PhotoLightbox from './components/PhotoLightbox.vue'
import AlbumDetailDialog from './components/AlbumDetailDialog.vue'

// 响应式数据
const selectedCategory = ref('')
const dateRange = ref<[string, string] | null>(null)
const searchKeyword = ref('')
const viewMode = ref('grid')
const lightboxVisible = ref(false)
const albumDetailVisible = ref(false)
const currentPhotos = ref([])
const currentPhotoIndex = ref(0)
const selectedAlbum = ref(null)

// 分类选项
const categories = [
  { label: '开学典礼', value: 'opening' },
  { label: '课程学习', value: 'study' },
  { label: '企业参访', value: 'visit' },
  { label: '团建活动', value: 'team_building' },
  { label: '毕业典礼', value: 'graduation' },
  { label: '其他活动', value: 'other' }
]

// 相册统计
const galleryStats = computed(() => [
  {
    label: '总相册数',
    value: '24',
    icon: 'FolderOpened',
    color: '#409EFF'
  },
  {
    label: '总照片数',
    value: '1,286',
    icon: 'Picture',
    color: '#67C23A'
  },
  {
    label: '本月新增',
    value: '156',
    icon: 'Plus',
    color: '#E6A23C'
  },
  {
    label: '存储空间',
    value: '2.4GB',
    icon: 'Coin',
    color: '#F56C6C'
  }
])

// 模拟相册数据
const mockAlbums = [
  {
    id: 1,
    title: '开学典礼盛况',
    description: '2024年EMBA2501班开学典礼，全体同学和老师合影留念',
    date: '2024-03-01',
    category: 'opening',
    photos: [
      { id: 1, title: '开学典礼现场', thumbnail: 'https://picsum.photos/300/200?random=1', url: 'https://picsum.photos/800/600?random=1' },
      { id: 2, title: '校长致辞', thumbnail: 'https://picsum.photos/300/200?random=2', url: 'https://picsum.photos/800/600?random=2' },
      { id: 3, title: '班级合影', thumbnail: 'https://picsum.photos/300/200?random=3', url: 'https://picsum.photos/800/600?random=3' },
      { id: 4, title: '同学交流', thumbnail: 'https://picsum.photos/300/200?random=4', url: 'https://picsum.photos/800/600?random=4' },
      { id: 5, title: '签到现场', thumbnail: 'https://picsum.photos/300/200?random=5', url: 'https://picsum.photos/800/600?random=5' },
      { id: 6, title: '欢迎晚宴', thumbnail: 'https://picsum.photos/300/200?random=6', url: 'https://picsum.photos/800/600?random=6' },
      { id: 7, title: '活动花絮', thumbnail: 'https://picsum.photos/300/200?random=7', url: 'https://picsum.photos/800/600?random=7' }
    ]
  },
  {
    id: 2,
    title: '腾讯总部企业参访',
    description: '走进腾讯总部，了解科技巨头的发展历程和企业文化',
    date: '2024-04-15',
    category: 'visit',
    photos: [
      { id: 8, title: '腾讯大厦', thumbnail: 'https://picsum.photos/300/200?random=8', url: 'https://picsum.photos/800/600?random=8' },
      { id: 9, title: '高管交流', thumbnail: 'https://picsum.photos/300/200?random=9', url: 'https://picsum.photos/800/600?random=9' },
      { id: 10, title: '参观展厅', thumbnail: 'https://picsum.photos/300/200?random=10', url: 'https://picsum.photos/800/600?random=10' }
    ]
  },
  {
    id: 3,
    title: '第一学期期末聚餐',
    description: '庆祝第一学期顺利结束，同学们欢聚一堂',
    date: '2024-06-30',
    category: 'team_building',
    photos: [
      { id: 11, title: '聚餐现场', thumbnail: 'https://picsum.photos/300/200?random=11', url: 'https://picsum.photos/800/600?random=11' },
      { id: 12, title: '同学合影', thumbnail: 'https://picsum.photos/300/200?random=12', url: 'https://picsum.photos/800/600?random=12' }
    ]
  }
]

const allAlbums = ref(mockAlbums)

// 计算属性 - 过滤后的相册
const filteredAlbums = computed(() => {
  let filtered = allAlbums.value

  // 按分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(album => album.category === selectedCategory.value)
  }

  // 按日期范围筛选
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    filtered = filtered.filter(album => {
      const albumDate = new Date(album.date)
      const startDate = new Date(dateRange.value![0])
      const endDate = new Date(dateRange.value![1])
      return albumDate >= startDate && albumDate <= endDate
    })
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(album => 
      album.title.toLowerCase().includes(keyword) ||
      album.description.toLowerCase().includes(keyword)
    )
  }

  // 按日期降序排列
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 生命周期
onMounted(() => {
  // 初始化数据
})

// 方法
const filterPhotos = () => {
  // 筛选逻辑已在 computed 中实现
}

const handleViewModeChange = () => {
  // 视图模式切换逻辑
}

const beforeUpload = (file: File) => {
  console.log('上传文件:', file.name)
  // 实现文件上传逻辑
  return false // 阻止默认上传行为
}

const openLightbox = (album: any, photoIndex: number) => {
  currentPhotos.value = album.photos
  currentPhotoIndex.value = photoIndex
  lightboxVisible.value = true
}

const viewAlbum = (album: any) => {
  selectedAlbum.value = album
  albumDetailVisible.value = true
}

const handleAlbumAction = (command: string) => {
  const [action, albumId] = command.split(':')
  console.log(`执行操作: ${action}, 相册ID: ${albumId}`)
  
  switch (action) {
    case 'edit':
      // 编辑相册
      break
    case 'download':
      // 下载相册
      break
    case 'delete':
      // 删除相册
      break
  }
}

// 辅助函数
const getCategoryType = (category: string) => {
  const typeMap: Record<string, any> = {
    opening: 'danger',
    study: 'primary',
    visit: 'success',
    team_building: 'warning',
    graduation: 'info',
    other: ''
  }
  return typeMap[category] || ''
}

const getCategoryLabel = (category: string) => {
  const labelMap: Record<string, string> = {
    opening: '开学典礼',
    study: '课程学习',
    visit: '企业参访',
    team_building: '团建活动',
    graduation: '毕业典礼',
    other: '其他活动'
  }
  return labelMap[category] || '未分类'
}
</script>

<style scoped lang="scss">
.gallery {
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
  
  .grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: $spacing-lg;
    
    .album-card {
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-medium;
      }
      
      .album-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: $spacing-md;
        
        .album-info {
          flex: 1;
          
          .album-title {
            margin: 0 0 $spacing-sm 0;
            color: $text-primary;
            font-size: $font-size-lg;
          }
          
          .album-meta {
            display: flex;
            align-items: center;
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
      
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
        margin-bottom: $spacing-md;
        border-radius: $border-radius-md;
        overflow: hidden;
        
        .photo-item {
          position: relative;
          aspect-ratio: 1;
          cursor: pointer;
          overflow: hidden;
          
          &:first-child {
            grid-column: span 2;
            grid-row: span 2;
          }
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          &:hover img {
            transform: scale(1.05);
          }
          
          &.more-overlay {
            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
            }
            
            .more-count {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-size: $font-size-xl;
              font-weight: 600;
              z-index: 1;
            }
          }
        }
      }
      
      .album-footer {
        .album-description {
          margin: 0 0 $spacing-md 0;
          color: $text-secondary;
          font-size: $font-size-sm;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
  
  .timeline-view {
    max-width: 800px;
    margin: 0 auto;
    
    .timeline-album {
      .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-md;
        
        h3 {
          margin: 0;
          color: $text-primary;
        }
      }
      
      .timeline-photos {
        display: flex;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
        
        .timeline-photo {
          width: 80px;
          height: 60px;
          border-radius: $border-radius-sm;
          overflow: hidden;
          cursor: pointer;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          &:hover img {
            transform: scale(1.1);
          }
        }
        
        .more-photos {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 60px;
          background: $bg-hover;
          border-radius: $border-radius-sm;
          color: $text-secondary;
          font-size: $font-size-sm;
        }
      }
      
      p {
        margin: 0 0 $spacing-md 0;
        color: $text-secondary;
        font-size: $font-size-sm;
        line-height: 1.6;
      }
    }
  }
}

:deep(.el-timeline-item__timestamp) {
  color: $accent-color;
  font-weight: 500;
}

:deep(.el-timeline-item__node) {
  background-color: $accent-color;
  border-color: $accent-color;
}

@media (max-width: 768px) {
  .grid-view {
    grid-template-columns: 1fr;
    
    .album-card .photo-grid {
      grid-template-columns: repeat(2, 1fr);
      
      .photo-item:first-child {
        grid-column: span 1;
        grid-row: span 1;
      }
    }
  }
  
  .filters .el-row {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
