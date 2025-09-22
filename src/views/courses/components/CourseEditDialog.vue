<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑课程' : '添加课程'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入课程名称" />
      </el-form-item>

      <el-form-item label="课程代码" prop="code">
        <el-input v-model="form.code" placeholder="请输入课程代码" />
      </el-form-item>

      <el-form-item label="授课教师" prop="instructor">
        <el-input v-model="form.instructor" placeholder="请输入授课教师" />
      </el-form-item>

      <el-form-item label="课程类别" prop="category">
        <el-select v-model="form.category" placeholder="请选择课程类别">
          <el-option label="核心课程" value="core" />
          <el-option label="选修课程" value="elective" />
          <el-option label="实践课程" value="practical" />
        </el-select>
      </el-form-item>

      <el-form-item label="上课时间" prop="scheduleTime">
        <el-input v-model="form.scheduleTime" placeholder="如：周二 09:00-12:00" />
      </el-form-item>

      <el-form-item label="上课地点" prop="scheduleLocation">
        <el-input v-model="form.scheduleLocation" placeholder="请输入上课地点" />
      </el-form-item>

      <el-form-item label="课程状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择课程状态">
          <el-option label="未开始" value="not_started" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已结束" value="completed" />
        </el-select>
      </el-form-item>

      <el-form-item label="容量人数" prop="capacity">
        <el-input-number
          v-model="form.capacity"
          :min="1"
          :max="100"
          placeholder="请输入容量人数"
        />
      </el-form-item>

      <el-form-item label="当前人数" prop="students">
        <el-input-number
          v-model="form.students"
          :min="0"
          :max="form.capacity"
          placeholder="请输入当前人数"
        />
      </el-form-item>

      <el-form-item label="课程进度" prop="progress">
        <el-slider
          v-model="form.progress"
          :min="0"
          :max="100"
          show-input
          :show-input-controls="false"
        />
      </el-form-item>

      <el-form-item label="课程描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入课程描述"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        {{ isEdit ? '更新' : '创建' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  modelValue: boolean
  courseData?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.courseData?.id)

// 表单数据
const form = reactive({
  name: '',
  code: '',
  instructor: '',
  category: '',
  scheduleTime: '',
  scheduleLocation: '',
  status: 'not_started',
  capacity: 40,
  students: 0,
  progress: 0,
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入课程代码', trigger: 'blur' }],
  instructor: [{ required: true, message: '请输入授课教师', trigger: 'blur' }],
  category: [{ required: true, message: '请选择课程类别', trigger: 'change' }],
  scheduleTime: [{ required: true, message: '请输入上课时间', trigger: 'blur' }],
  scheduleLocation: [{ required: true, message: '请输入上课地点', trigger: 'blur' }],
  status: [{ required: true, message: '请选择课程状态', trigger: 'change' }],
  capacity: [{ required: true, message: '请输入容量人数', trigger: 'blur' }]
}

// 监听课程数据变化，更新表单
watch(() => props.courseData, (newData) => {
  if (newData) {
    Object.assign(form, {
      name: newData.name || '',
      code: newData.code || '',
      instructor: newData.instructor || '',
      category: newData.category || '',
      scheduleTime: newData.schedule?.time || '',
      scheduleLocation: newData.schedule?.location || '',
      status: newData.status || 'not_started',
      capacity: newData.capacity || 40,
      students: newData.students || 0,
      progress: newData.progress || 0,
      description: newData.description || ''
    })
  } else {
    // 重置表单
    Object.assign(form, {
      name: '',
      code: '',
      instructor: '',
      category: '',
      scheduleTime: '',
      scheduleLocation: '',
      status: 'not_started',
      capacity: 40,
      students: 0,
      progress: 0,
      description: ''
    })
  }
}, { immediate: true })

const handleClose = () => {
  visible.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 构建提交数据
    const submitData = {
      ...form,
      schedule: {
        time: form.scheduleTime,
        location: form.scheduleLocation
      }
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEdit.value) {
      console.log('更新课程:', props.courseData?.id, submitData)
    } else {
      console.log('创建课程:', submitData)
    }

    emit('success')
    handleClose()
    
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.el-form {
  .el-form-item {
    margin-bottom: $spacing-lg;
  }
}
</style>
