<template>
  <el-drawer
    v-model="visible"
    :title="albumData?.title || '相册详情'"
    size="60%"
    direction="rtl"
    @close="handleClose"
  >
    <div v-if="albumData" class="album-detail">
      <!-- 相册信息 -->
      <div class="album-info mb-24">
        <div class="info-header">
          <h2>{{ albumData.title }}</h2>
          <div class="info-meta">
            <el-tag :type="getCategoryType(albumData.category)" size="large">
              {{ getCategoryLabel(albumData.category) }}
            </el-tag>
          </div>
        </div>
        
        <el-descriptions :column="2" border class="mb-16">
          <el-descriptions-item label="创建时间">{{ albumData.date }}</el-descriptions-item>
          <el-descriptions-item label="照片数量">{{ albumData.photos.length }} 张</el-descriptions-item>
          <el-descriptions-item label="相册分类">{{ getCategoryLabel(albumData.category) }}</el-descriptions-item>
          <el-descriptions-item label="存储大小">{{ calculateSize(albumData.photos.length) }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="album-description">
          <h4>相册描述</h4>
          <p>{{ albumData.description }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons mb-24">
        <el-button type="primary" icon="Download" @click="downloadAlbum">
          下载全部
        </el-button>
        <el-button type="success" icon="Share" @click="shareAlbum">
          分享相册
        </el-button>
        <el-button type="warning" icon="Edit" @click="editAlbum">
          编辑相册
        </el-button>
        <el-popconfirm
          title="确定要删除这个相册吗？"
          @confirm="deleteAlbum"
        >
          <template #reference>
            <el-button type="danger" icon="Delete">删除相册</el-button>
          </template>
        </el-popconfirm>
      </div>

      <!-- 图片网格 -->
      <div class="photos-grid">
        <div class="grid-header">
          <h3>全部照片 ({{ albumData.photos.length }})</h3>
          <div class="grid-controls">
            <el-radio-group v-model="gridSize" size="small">
              <el-radio-button value="small">小图</el-radio-button>
              <el-radio-button value="medium">中图</el-radio-button>
              <el-radio-button value="large">大图</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <div class="photos-container" :class="`grid-${gridSize}`">
          <div
            v-for="(photo, index) in albumData.photos"
            :key="photo.id"
            class="photo-item"
            @click="openPhoto(index)"
          >
            <div class="photo-wrapper">
              <img :src="photo.thumbnail" :alt="photo.title" />
              <div class="photo-overlay">
                <div class="overlay-actions">
                  <el-button type="primary" circle size="small" icon="View" />
                  <el-button type="success" circle size="small" icon="Download" @click.stop="downloadPhoto(photo)" />
                  <el-button type="danger" circle size="small" icon="Delete" @click.stop="deletePhoto(photo)" />
                </div>
              </div>
            </div>
            <div class="photo-title">{{ photo.title }}</div>
          </div>
        </div>
      </div>

      <!-- 评论区域 -->
      <div class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>
        
        <!-- 添加评论 -->
        <div class="add-comment mb-16">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
            maxlength="500"
            show-word-limit
          />
          <div class="comment-actions">
            <el-button type="primary" @click="addComment" :disabled="!newComment.trim()">
              发表评论
            </el-button>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <el-avatar :src="comment.user.avatar" :icon="UserFilled" size="small" />
            <div class="comment-content">
              <div class="comment-header">
                <span class="username">{{ comment.user.name }}</span>
                <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button type="text" size="small" @click="likeComment(comment)">
                  <el-icon><Like /></el-icon>
                  {{ comment.likes }}
                </el-button>
                <el-button type="text" size="small" @click="replyComment(comment)">
                  回复
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 照片灯箱 -->
    <PhotoLightbox
      v-model="lightboxVisible"
      :photos="albumData?.photos || []"
      :current-index="currentPhotoIndex"
      @update:current-index="currentPhotoIndex = $event"
    />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PhotoLightbox from './PhotoLightbox.vue'
import dayjs from 'dayjs'

interface Props {
  modelValue: boolean
  albumData: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const gridSize = ref('medium')
const lightboxVisible = ref(false)
const currentPhotoIndex = ref(0)
const newComment = ref('')

// 模拟评论数据
const comments = ref([
  {
    id: 1,
    user: {
      name: '张三',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    content: '这次活动太精彩了！照片拍得很棒。',
    createdAt: '2024-01-15 14:30:00',
    likes: 5
  },
  {
    id: 2,
    user: {
      name: '李四',
      avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    },
    content: '难忘的回忆，感谢摄影师！',
    createdAt: '2024-01-15 15:20:00',
    likes: 3
  }
])

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleClose = () => {
  visible.value = false
}

const openPhoto = (index: number) => {
  currentPhotoIndex.value = index
  lightboxVisible.value = true
}

const downloadPhoto = (photo: any) => {
  console.log('下载照片:', photo.title)
  // 实现单张照片下载逻辑
}

const deletePhoto = (photo: any) => {
  console.log('删除照片:', photo.title)
  // 实现删除照片逻辑
}

const downloadAlbum = () => {
  console.log('下载整个相册')
  // 实现相册下载逻辑
}

const shareAlbum = () => {
  console.log('分享相册')
  // 实现相册分享逻辑
}

const editAlbum = () => {
  console.log('编辑相册')
  // 打开编辑对话框
}

const deleteAlbum = () => {
  console.log('删除相册')
  // 实现删除相册逻辑
}

const addComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: comments.value.length + 1,
    user: {
      name: '当前用户',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    content: newComment.value,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    likes: 0
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
}

const likeComment = (comment: any) => {
  comment.likes++
}

const replyComment = (comment: any) => {
  console.log('回复评论:', comment.id)
  // 实现回复功能
}

const formatTime = (time: string) => {
  return dayjs(time).format('MM-DD HH:mm')
}

const calculateSize = (photoCount: number) => {
  return `${(photoCount * 2.5).toFixed(1)} MB`
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
.album-detail {
  .album-info {
    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-md;
      
      h2 {
        margin: 0;
        color: $text-primary;
        font-size: $font-size-xxl;
      }
    }
    
    .album-description {
      h4 {
        margin: 0 0 $spacing-sm 0;
        color: $text-primary;
      }
      
      p {
        margin: 0;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }
  
  .photos-grid {
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;
      
      h3 {
        margin: 0;
        color: $text-primary;
      }
    }
    
    .photos-container {
      display: grid;
      gap: $spacing-md;
      
      &.grid-small {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
      
      &.grid-medium {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
      
      &.grid-large {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
      
      .photo-item {
        .photo-wrapper {
          position: relative;
          aspect-ratio: 1;
          border-radius: $border-radius-md;
          overflow: hidden;
          cursor: pointer;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .photo-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            
            .overlay-actions {
              display: flex;
              gap: $spacing-sm;
            }
          }
          
          &:hover {
            img {
              transform: scale(1.05);
            }
            
            .photo-overlay {
              opacity: 1;
            }
          }
        }
        
        .photo-title {
          margin-top: $spacing-xs;
          font-size: $font-size-sm;
          color: $text-secondary;
          text-align: center;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
  }
  
  .comments-section {
    margin-top: $spacing-xl;
    
    h3 {
      margin: 0 0 $spacing-md 0;
      color: $text-primary;
    }
    
    .add-comment {
      .comment-actions {
        margin-top: $spacing-sm;
        text-align: right;
      }
    }
    
    .comments-list {
      .comment-item {
        display: flex;
        gap: $spacing-md;
        margin-bottom: $spacing-lg;
        
        .comment-content {
          flex: 1;
          
          .comment-header {
            display: flex;
            align-items: center;
            gap: $spacing-md;
            margin-bottom: $spacing-xs;
            
            .username {
              font-weight: 500;
              color: $text-primary;
            }
            
            .comment-time {
              font-size: $font-size-sm;
              color: $text-secondary;
            }
          }
          
          .comment-text {
            color: $text-primary;
            line-height: 1.6;
            margin-bottom: $spacing-xs;
          }
          
          .comment-actions {
            display: flex;
            gap: $spacing-md;
            
            .el-button {
              padding: 0;
              height: auto;
              
              .el-icon {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .album-detail {
    .action-buttons {
      .el-button {
        flex: 1;
        min-width: 120px;
      }
    }
    
    .photos-container {
      &.grid-small,
      &.grid-medium,
      &.grid-large {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  }
}
</style>
