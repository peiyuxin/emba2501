<template>
  <el-dialog
    v-model="visible"
    title="课程详情"
    width="800px"
    @close="handleClose"
  >
    <div v-if="courseData" class="course-detail">
      <div class="basic-info mb-24">
        <h3 class="section-title">基本信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="课程名称">{{ courseData.name }}</el-descriptions-item>
          <el-descriptions-item label="课程代码">{{ courseData.code }}</el-descriptions-item>
          <el-descriptions-item label="授课教师">{{ courseData.instructor }}</el-descriptions-item>
          <el-descriptions-item label="课程类别">
            <el-tag :type="getCategoryType(courseData.category)">
              {{ getCategoryLabel(courseData.category) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上课时间">{{ courseData.schedule?.time }}</el-descriptions-item>
          <el-descriptions-item label="上课地点">{{ courseData.schedule?.location }}</el-descriptions-item>
          <el-descriptions-item label="课程状态">
            <el-tag :type="getStatusType(courseData.status)">
              {{ getStatusLabel(courseData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="学员人数">{{ courseData.students }}/{{ courseData.capacity }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="course-progress mb-24">
        <h3 class="section-title">课程进度</h3>
        <el-progress
          :percentage="courseData.progress"
          :color="getProgressColor(courseData.progress)"
          :stroke-width="12"
          text-inside
        />
        <p class="progress-text">当前进度：{{ courseData.progress }}%</p>
      </div>

      <div class="course-description mb-24">
        <h3 class="section-title">课程描述</h3>
        <p>{{ courseData.description || '暂无描述' }}</p>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleEnroll" v-if="courseData?.status === 'not_started'">
        报名课程
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
  courseData: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleClose = () => {
  visible.value = false
}

const handleEnroll = () => {
  console.log('报名课程:', props.courseData?.id)
  // 实现报名逻辑
}

// 辅助函数
const getCategoryType = (category: string) => {
  const typeMap: Record<string, any> = {
    core: 'danger',
    elective: 'warning',
    practical: 'success'
  }
  return typeMap[category] || 'info'
}

const getCategoryLabel = (category: string) => {
  const labelMap: Record<string, string> = {
    core: '核心课程',
    elective: '选修课程',
    practical: '实践课程'
  }
  return labelMap[category] || '未知'
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    not_started: 'info',
    in_progress: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    not_started: '未开始',
    in_progress: '进行中',
    completed: '已结束'
  }
  return labelMap[status] || '未知'
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}
</script>

<style scoped lang="scss">
.course-detail {
  .section-title {
    margin: 0 0 $spacing-md 0;
    color: $text-primary;
    font-size: $font-size-lg;
    border-left: 4px solid $primary-color;
    padding-left: $spacing-md;
  }
  
  .progress-text {
    margin-top: $spacing-sm;
    color: $text-secondary;
    font-size: $font-size-sm;
  }
}
</style>
