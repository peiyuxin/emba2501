<template>
  <div class="students">
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header mb-24">
        <div class="page-title">
          <h1>同学录</h1>
          <p>EMBA2501班全体同学信息</p>
        </div>
      </div>

      <!-- 搜索筛选 -->
      <div class="filters card mb-24">
        <el-row :gutter="16" align="middle">
          <el-col :span="6">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索姓名或公司"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="industryFilter" placeholder="行业筛选" clearable>
              <el-option label="全部" value="" />
              <el-option label="金融" value="finance" />
              <el-option label="科技" value="technology" />
              <el-option label="制造业" value="manufacturing" />
              <el-option label="房地产" value="real_estate" />
              <el-option label="互联网" value="internet" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="positionFilter" placeholder="职位筛选" clearable>
              <el-option label="全部" value="" />
              <el-option label="CEO" value="ceo" />
              <el-option label="CTO" value="cto" />
              <el-option label="CFO" value="cfo" />
              <el-option label="总经理" value="gm" />
              <el-option label="副总经理" value="vp" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
      </div>

      <!-- 班级统计 -->
      <el-row :gutter="16" class="mb-24">
        <el-col :span="6" v-for="stat in classStats" :key="stat.label">
          <div class="stat-card card">
            <div class="stat-icon">
              <el-icon :size="32" :color="stat.color">
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

      <!-- 同学列表 -->
      <div class="student-grid">
        <div 
          v-for="student in filteredStudents" 
          :key="student.id"
          class="student-card card"
          @click="handleViewDetail(student)"
        >
          <div class="student-avatar">
            <el-avatar :size="80" :src="student.avatar" :icon="UserFilled" />
            <div class="online-status" v-if="student.online"></div>
          </div>
          
          <div class="student-info">
            <h3 class="student-name">{{ student.name }}</h3>
            <p class="student-title">{{ student.position }}</p>
            <p class="student-company">{{ student.company }}</p>
            
            <div class="student-tags">
              <el-tag size="small" :type="getIndustryType(student.industry)">
                {{ getIndustryLabel(student.industry) }}
              </el-tag>
            </div>
            
            <div class="student-contact">
              <el-button 
                type="text" 
                size="small" 
                @click.stop="handleContact(student, 'phone')"
              >
                <el-icon><Phone /></el-icon>
              </el-button>
              <el-button 
                type="text" 
                size="small"
                @click.stop="handleContact(student, 'email')"
              >
                <el-icon><Message /></el-icon>
              </el-button>
              <el-button 
                type="text" 
                size="small"
                @click.stop="handleContact(student, 'wechat')"
              >
                <el-icon><ChatDotSquare /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <el-button 
          type="primary" 
          size="large" 
          @click="loadMore"
          :loading="loading"
        >
          加载更多
        </el-button>
      </div>
    </div>

    <!-- 学生详情对话框 -->
    <StudentDetailDialog
      v-model="detailDialogVisible"
      :student-data="selectedStudent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StudentDetailDialog from './components/StudentDetailDialog.vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const industryFilter = ref('')
const positionFilter = ref('')
const studentList = ref([])
const hasMore = ref(true)
const detailDialogVisible = ref(false)
const selectedStudent = ref(null)

// 班级统计
const classStats = computed(() => [
  {
    label: '班级总人数',
    value: '42',
    icon: 'User',
    color: '#409EFF'
  },
  {
    label: '在线人数',
    value: '28',
    icon: 'Connection',
    color: '#67C23A'
  },
  {
    label: '行业分布',
    value: '8',
    icon: 'OfficeBuilding',
    color: '#E6A23C'
  },
  {
    label: '平均工作经验',
    value: '12年',
    icon: 'TrendCharts',
    color: '#F56C6C'
  }
])

// 模拟学生数据
const mockStudentList = [
  {
    id: 1,
    name: '张三',
    position: 'CEO',
    company: '北京科技有限公司',
    industry: 'technology',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    wechat: 'zhangsan_wx',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    online: true,
    experience: '15年',
    education: '清华大学 计算机科学',
    achievements: ['2021年度优秀企业家', '科技创新奖'],
    bio: '专注于人工智能和大数据领域的创业者，拥有丰富的技术管理经验。'
  },
  {
    id: 2,
    name: '李四',
    position: 'CFO',
    company: '上海金融集团',
    industry: 'finance',
    phone: '13900139000',
    email: 'lisi@example.com',
    wechat: 'lisi_wx',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    online: false,
    experience: '12年',
    education: '北京大学 金融学',
    achievements: ['金融行业杰出人才', 'CFA证书持有者'],
    bio: '资深金融专家，在投资银行和资产管理方面有着深厚的经验。'
  }
]

// 计算属性
const filteredStudents = computed(() => {
  let filtered = studentList.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter((student: any) => 
      student.name.toLowerCase().includes(keyword) ||
      student.company.toLowerCase().includes(keyword)
    )
  }

  if (industryFilter.value) {
    filtered = filtered.filter((student: any) => student.industry === industryFilter.value)
  }

  if (positionFilter.value) {
    filtered = filtered.filter((student: any) => 
      student.position.toLowerCase().includes(positionFilter.value.toLowerCase())
    )
  }

  return filtered
})

// 生命周期
onMounted(() => {
  loadStudentList()
})

// 方法
const loadStudentList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    studentList.value = [...mockStudentList]
  } catch (error) {
    console.error('加载学生列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索:', searchKeyword.value, industryFilter.value, positionFilter.value)
}

const handleReset = () => {
  searchKeyword.value = ''
  industryFilter.value = ''
  positionFilter.value = ''
}

const handleViewDetail = (student: any) => {
  selectedStudent.value = student
  detailDialogVisible.value = true
}

const handleContact = (student: any, type: string) => {
  switch (type) {
    case 'phone':
      console.log('拨打电话:', student.phone)
      break
    case 'email':
      console.log('发送邮件:', student.email)
      break
    case 'wechat':
      console.log('微信联系:', student.wechat)
      break
  }
}

const loadMore = async () => {
  loading.value = true
  try {
    // 模拟加载更多数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 假设没有更多数据
    hasMore.value = false
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loading.value = false
  }
}

// 辅助函数
const getIndustryType = (industry: string) => {
  const typeMap: Record<string, any> = {
    technology: 'primary',
    finance: 'success',
    manufacturing: 'warning',
    real_estate: 'danger',
    internet: 'info'
  }
  return typeMap[industry] || 'info'
}

const getIndustryLabel = (industry: string) => {
  const labelMap: Record<string, string> = {
    technology: '科技',
    finance: '金融',
    manufacturing: '制造业',
    real_estate: '房地产',
    internet: '互联网'
  }
  return labelMap[industry] || industry
}
</script>

<style scoped lang="scss">
.students {
  .page-header {
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
  
  .student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
    
    .student-card {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-medium;
      }
      
      .student-avatar {
        position: relative;
        display: inline-block;
        margin-bottom: $spacing-md;
        
        .online-status {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          background: $success-color;
          border: 3px solid white;
          border-radius: 50%;
        }
      }
      
      .student-info {
        .student-name {
          margin: 0 0 $spacing-xs 0;
          color: $text-primary;
          font-size: $font-size-lg;
        }
        
        .student-title {
          margin: 0 0 $spacing-xs 0;
          color: $primary-color;
          font-weight: 500;
          font-size: $font-size-md;
        }
        
        .student-company {
          margin: 0 0 $spacing-md 0;
          color: $text-secondary;
          font-size: $font-size-sm;
        }
        
        .student-tags {
          margin-bottom: $spacing-md;
        }
        
        .student-contact {
          display: flex;
          justify-content: center;
          gap: $spacing-sm;
          
          .el-button {
            &:hover {
              color: $primary-color;
            }
          }
        }
      }
    }
  }
  
  .load-more {
    text-align: center;
    padding: $spacing-xl 0;
  }
}

@media (max-width: 768px) {
  .student-grid {
    grid-template-columns: 1fr;
  }
  
  .filters .el-row {
    flex-direction: column;
    gap: $spacing-md;
  }
}
</style>
