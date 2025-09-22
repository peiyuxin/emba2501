<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :fullscreen="true"
    class="lightbox-dialog"
    @close="handleClose"
  >
    <div class="lightbox-container" @click="handleClose">
      <div class="lightbox-content" @click.stop>
        <!-- 图片显示区域 -->
        <div class="image-container">
          <img 
            v-if="currentPhoto"
            :src="currentPhoto.url || currentPhoto.thumbnail" 
            :alt="currentPhoto.title"
            class="lightbox-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <div v-if="loading" class="loading-overlay">
            <el-icon class="is-loading" size="32"><Loading /></el-icon>
          </div>
        </div>

        <!-- 导航按钮 -->
        <el-button
          v-if="photos.length > 1"
          class="nav-btn prev-btn"
          type="primary"
          size="large"
          circle
          @click="prevPhoto"
          :disabled="currentIndex === 0"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        
        <el-button
          v-if="photos.length > 1"
          class="nav-btn next-btn"
          type="primary"
          size="large"
          circle
          @click="nextPhoto"
          :disabled="currentIndex === photos.length - 1"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>

        <!-- 关闭按钮 -->
        <el-button
          class="close-btn"
          type="danger"
          size="large"
          circle
          @click="handleClose"
        >
          <el-icon><Close /></el-icon>
        </el-button>

        <!-- 图片信息 -->
        <div class="image-info">
          <div class="image-title">{{ currentPhoto?.title }}</div>
          <div class="image-counter">
            {{ currentIndex + 1 }} / {{ photos.length }}
          </div>
        </div>

        <!-- 操作工具栏 -->
        <div class="toolbar">
          <el-button-group>
            <el-button @click="zoomIn" icon="ZoomIn" title="放大" />
            <el-button @click="zoomOut" icon="ZoomOut" title="缩小" />
            <el-button @click="resetZoom" icon="Refresh" title="重置" />
            <el-button @click="rotateLeft" icon="RefreshLeft" title="向左旋转" />
            <el-button @click="rotateRight" icon="RefreshRight" title="向右旋转" />
            <el-button @click="downloadPhoto" icon="Download" title="下载" />
          </el-button-group>
        </div>

        <!-- 缩略图预览 -->
        <div class="thumbnails" v-if="photos.length > 1">
          <div 
            v-for="(photo, index) in photos" 
            :key="photo.id"
            class="thumbnail-item"
            :class="{ active: index === currentIndex }"
            @click="setCurrentPhoto(index)"
          >
            <img :src="photo.thumbnail" :alt="photo.title" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Photo {
  id: number
  title: string
  thumbnail: string
  url?: string
}

interface Props {
  modelValue: boolean
  photos: Photo[]
  currentIndex: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:currentIndex': [value: number]
}>()

const loading = ref(false)
const imageTransform = ref({
  scale: 1,
  rotation: 0
})

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const currentPhoto = computed(() => {
  return props.photos[props.currentIndex]
})

// 监听索引变化，重置变换
watch(() => props.currentIndex, () => {
  resetZoom()
})

// 键盘事件监听
const handleKeydown = (event: KeyboardEvent) => {
  if (!visible.value) return
  
  switch (event.key) {
    case 'Escape':
      handleClose()
      break
    case 'ArrowLeft':
      prevPhoto()
      break
    case 'ArrowRight':
      nextPhoto()
      break
    case '+':
    case '=':
      zoomIn()
      break
    case '-':
      zoomOut()
      break
  }
}

// 监听可见性变化，添加/移除键盘事件
watch(visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})

const handleClose = () => {
  visible.value = false
}

const handleImageLoad = () => {
  loading.value = false
}

const handleImageError = () => {
  loading.value = false
  console.error('图片加载失败:', currentPhoto.value?.url)
}

const prevPhoto = () => {
  if (props.currentIndex > 0) {
    loading.value = true
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

const nextPhoto = () => {
  if (props.currentIndex < props.photos.length - 1) {
    loading.value = true
    emit('update:currentIndex', props.currentIndex + 1)
  }
}

const setCurrentPhoto = (index: number) => {
  if (index !== props.currentIndex) {
    loading.value = true
    emit('update:currentIndex', index)
  }
}

// 图片操作
const zoomIn = () => {
  imageTransform.value.scale = Math.min(imageTransform.value.scale * 1.2, 3)
}

const zoomOut = () => {
  imageTransform.value.scale = Math.max(imageTransform.value.scale / 1.2, 0.5)
}

const resetZoom = () => {
  imageTransform.value = { scale: 1, rotation: 0 }
}

const rotateLeft = () => {
  imageTransform.value.rotation -= 90
}

const rotateRight = () => {
  imageTransform.value.rotation += 90
}

const downloadPhoto = () => {
  if (!currentPhoto.value) return
  
  const link = document.createElement('a')
  link.href = currentPhoto.value.url || currentPhoto.value.thumbnail
  link.download = currentPhoto.value.title || 'photo'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 计算图片样式
const imageStyle = computed(() => ({
  transform: `scale(${imageTransform.value.scale}) rotate(${imageTransform.value.rotation}deg)`,
  transition: 'transform 0.3s ease'
}))
</script>

<style scoped lang="scss">
.lightbox-dialog {
  :deep(.el-dialog) {
    background: rgba(0, 0, 0, 0.95);
    margin: 0;
    overflow: hidden;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }
}

.lightbox-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  
  .lightbox-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .image-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    
    .lightbox-image {
      max-width: 90%;
      max-height: 80%;
      object-fit: contain;
      user-select: none;
      v-bind: imageStyle;
    }
    
    .loading-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
    }
  }
  
  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    
    &.prev-btn {
      left: 20px;
    }
    
    &.next-btn {
      right: 20px;
    }
  }
  
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
  }
  
  .image-info {
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
    z-index: 10;
    
    .image-title {
      font-size: $font-size-lg;
      margin-bottom: $spacing-xs;
    }
    
    .image-counter {
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }
  
  .toolbar {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    
    .el-button-group {
      background: rgba(0, 0, 0, 0.5);
      border-radius: $border-radius-md;
      padding: $spacing-xs;
      
      .el-button {
        background: transparent;
        border-color: rgba(255, 255, 255, 0.3);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
  
  .thumbnails {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: $spacing-xs;
    background: rgba(0, 0, 0, 0.5);
    padding: $spacing-sm;
    border-radius: $border-radius-md;
    max-width: 80%;
    overflow-x: auto;
    z-index: 10;
    
    .thumbnail-item {
      flex-shrink: 0;
      width: 60px;
      height: 40px;
      border-radius: $border-radius-sm;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s ease;
      
      &.active {
        border-color: $primary-color;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }
  }
}

@media (max-width: 768px) {
  .lightbox-container {
    .nav-btn {
      &.prev-btn {
        left: 10px;
      }
      
      &.next-btn {
        right: 10px;
      }
    }
    
    .close-btn {
      top: 10px;
      right: 10px;
    }
    
    .image-info {
      top: 10px;
      left: 10px;
      
      .image-title {
        font-size: $font-size-md;
      }
    }
    
    .toolbar {
      bottom: 100px;
      
      .el-button-group .el-button {
        padding: 8px;
      }
    }
    
    .thumbnails {
      bottom: 10px;
      max-width: 95%;
      
      .thumbnail-item {
        width: 50px;
        height: 35px;
      }
    }
  }
}
</style>
