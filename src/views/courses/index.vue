<template>
  <div class="courses">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>课程中心</h1>
          <p>管理和查看所有课程信息</p>
        </div>
        <div class="page-actions">
          <el-button type="primary" icon="Plus" @click="handleAddCourse">
            添加课程
          </el-button>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="filters card mb-24">
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-select v-model="filters.status" placeholder="课程状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="未开始" value="not_started" />
              <el-option label="进行中" value="in_progress" />
              <el-option label="已结束" value="completed" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="filters.category" placeholder="课程类别" clearable>
              <el-option label="全部" value="" />
              <el-option label="核心课程" value="core" />
              <el-option label="选修课程" value="elective" />
              <el-option label="实践课程" value="practical" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="filters.keyword"
              placeholder="搜索课程名称"
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

      <!-- 课程统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in courseStats" :key="stat.label">
          <div class="stat-card card">
            <div class="stat-number">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 课程列表 -->
      <div class="course-list card">
        <el-table
          :data="courseList"
          v-loading="loading"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="课程名称" min-width="200">
            <template #default="{ row }">
              <div class="course-name">
                <div class="course-title">{{ row.name }}</div>
                <div class="course-code">{{ row.code }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="instructor" label="授课教师" width="120" />
          <el-table-column prop="category" label="课程类别" width="100">
            <template #default="{ row }">
              <el-tag :type="getCategoryType(row.category)">
                {{ getCategoryLabel(row.category) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="schedule" label="上课时间" width="150">
            <template #default="{ row }">
              <div class="schedule">
                <div>{{ row.schedule.time }}</div>
                <div class="location">{{ row.schedule.location }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="课程进度" width="120">
            <template #default="{ row }">
              <el-progress
                :percentage="row.progress"
                :color="getProgressColor(row.progress)"
                :stroke-width="8"
              />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="students" label="学员人数" width="100">
            <template #default="{ row }">
              <span>{{ row.students }}/{{ row.capacity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleViewDetail(row)">
                详情
              </el-button>
              <el-button type="warning" size="small" @click="handleEdit(row)">
                编辑
              </el-button>
              <el-popconfirm
                title="确定要删除这个课程吗？"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 课程详情对话框 -->
    <CourseDetailDialog
      v-model="detailDialogVisible"
      :course-data="selectedCourse"
    />

    <!-- 编辑课程对话框 -->
    <CourseEditDialog
      v-model="editDialogVisible"
      :course-data="selectedCourse"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import CourseDetailDialog from './components/CourseDetailDialog.vue'
import CourseEditDialog from './components/CourseEditDialog.vue'

// 响应式数据
const loading = ref(false)
const courseList = ref([])
const selectedRows = ref([])
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const selectedCourse = ref(null)

// 筛选器
const filters = reactive({
  status: '',
  category: '',
  keyword: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

// 课程统计
const courseStats = computed(() => [
  { label: '总课程数', value: 24 },
  { label: '进行中', value: 8 },
  { label: '已完成', value: 12 },
  { label: '未开始', value: 4 }
])

// 模拟课程数据
const mockCourseList = [
  {
    id: 1,
    name: '战略管理',
    code: 'SM001',
    instructor: '张教授',
    category: 'core',
    schedule: {
      time: '周二 09:00-12:00',
      location: '教学楼A101'
    },
    progress: 75,
    status: 'in_progress',
    students: 35,
    capacity: 40,
    description: '企业战略管理理论与实践'
  },
  {
    id: 2,
    name: '财务管理',
    code: 'FM001',
    instructor: '李教授',
    category: 'core',
    schedule: {
      time: '周四 14:00-17:00',
      location: '教学楼B201'
    },
    progress: 60,
    status: 'in_progress',
    students: 38,
    capacity: 40,
    description: '现代企业财务管理'
  },
  {
    id: 3,
    name: '市场营销',
    code: 'MK001',
    instructor: '王教授',
    category: 'elective',
    schedule: {
      time: '周三 10:00-13:00',
      location: '教学楼A102'
    },
    progress: 100,
    status: 'completed',
    students: 32,
    capacity: 35,
    description: '营销策略与品牌管理'
  }
]

// 生命周期
onMounted(() => {
  loadCourseList()
})

// 方法
const loadCourseList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    courseList.value = mockCourseList
    pagination.total = mockCourseList.length
  } catch (error) {
    console.error('加载课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  loadCourseList()
}

const handleReset = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  loadCourseList()
}

const handleAddCourse = () => {
  selectedCourse.value = null
  editDialogVisible.value = true
}

const handleViewDetail = (row: any) => {
  selectedCourse.value = row
  detailDialogVisible.value = true
}

const handleEdit = (row: any) => {
  selectedCourse.value = row
  editDialogVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    // 模拟删除API
    console.log('删除课程:', row.id)
    loadCourseList()
  } catch (error) {
    console.error('删除课程失败:', error)
  }
}

const handleEditSuccess = () => {
  loadCourseList()
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadCourseList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  loadCourseList()
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
.courses {
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
    text-align: center;
    padding: $spacing-lg;
    
    .stat-number {
      font-size: $font-size-xxl;
      font-weight: 600;
      color: $primary-color;
      margin-bottom: $spacing-sm;
    }
    
    .stat-label {
      color: $text-secondary;
      font-size: $font-size-sm;
    }
  }
  
  .course-name {
    .course-title {
      font-weight: 500;
      margin-bottom: $spacing-xs;
    }
    
    .course-code {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  .schedule {
    .location {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: $spacing-xs;
    }
  }
  
  .pagination-container {
    padding: $spacing-lg;
    text-align: right;
    border-top: 1px solid $border-color;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: $spacing-md;
  }
  
  .filters .el-row {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
