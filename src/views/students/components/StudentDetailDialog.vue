<template>
  <el-dialog
    v-model="visible"
    :title="`${studentData?.name} - 详细资料`"
    width="800px"
    @close="handleClose"
  >
    <div v-if="studentData" class="student-detail">
      <!-- 学生基本信息 -->
      <div class="student-header mb-24">
        <div class="student-avatar">
          <el-avatar :size="100" :src="studentData.avatar" :icon="UserFilled" />
          <div class="online-status" v-if="studentData.online">
            <el-tag type="success" size="small">在线</el-tag>
          </div>
        </div>
        
        <div class="student-info">
          <h2>{{ studentData.name }}</h2>
          <div class="student-meta">
            <div class="meta-item">
              <el-icon><Suitcase /></el-icon>
              <span>{{ studentData.position }}</span>
            </div>
            <div class="meta-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>{{ studentData.company }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Trophy /></el-icon>
              <span>{{ studentData.experience }} 工作经验</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细信息标签页 -->
      <el-tabs v-model="activeTab" class="detail-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="tab-content">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="姓名">{{ studentData.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ getGender(studentData.gender) }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ studentData.age }}岁</el-descriptions-item>
              <el-descriptions-item label="生日">{{ studentData.birthday }}</el-descriptions-item>
              <el-descriptions-item label="学历">{{ studentData.education }}</el-descriptions-item>
              <el-descriptions-item label="专业">{{ studentData.major }}</el-descriptions-item>
              <el-descriptions-item label="毕业院校">{{ studentData.university }}</el-descriptions-item>
              <el-descriptions-item label="入学时间">{{ studentData.enrollmentDate }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>

        <!-- 工作信息 -->
        <el-tab-pane label="职业经历" name="career">
          <div class="tab-content">
            <div class="career-section">
              <h4>当前职位</h4>
              <div class="current-job card-light">
                <div class="job-header">
                  <h5>{{ studentData.position }}</h5>
                  <el-tag type="primary">{{ studentData.industry }}</el-tag>
                </div>
                <p class="company-name">{{ studentData.company }}</p>
                <p class="job-description">{{ studentData.jobDescription || '负责公司整体战略规划和日常经营管理，带领团队实现业务目标。' }}</p>
              </div>
            </div>

            <div class="achievements-section">
              <h4>主要成就</h4>
              <div class="achievements-list">
                <div 
                  v-for="achievement in studentData.achievements" 
                  :key="achievement"
                  class="achievement-item"
                >
                  <el-icon><Trophy /></el-icon>
                  <span>{{ achievement }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 联系方式 -->
        <el-tab-pane label="联系方式" name="contact">
          <div class="tab-content">
            <div class="contact-info">
              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon><Phone /></el-icon>
                </div>
                <div class="contact-details">
                  <div class="contact-label">手机号码</div>
                  <div class="contact-value">{{ studentData.phone }}</div>
                  <el-button type="text" size="small" @click="handleCall(studentData.phone)">
                    拨打电话
                  </el-button>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon><Message /></el-icon>
                </div>
                <div class="contact-details">
                  <div class="contact-label">邮箱地址</div>
                  <div class="contact-value">{{ studentData.email }}</div>
                  <el-button type="text" size="small" @click="handleEmail(studentData.email)">
                    发送邮件
                  </el-button>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon><ChatDotSquare /></el-icon>
                </div>
                <div class="contact-details">
                  <div class="contact-label">微信号</div>
                  <div class="contact-value">{{ studentData.wechat }}</div>
                  <el-button type="text" size="small" @click="handleWechat(studentData.wechat)">
                    添加微信
                  </el-button>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon><LocationInformation /></el-icon>
                </div>
                <div class="contact-details">
                  <div class="contact-label">办公地址</div>
                  <div class="contact-value">{{ studentData.address || '北京市海淀区中关村大街' }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 个人简介 -->
        <el-tab-pane label="个人简介" name="bio">
          <div class="tab-content">
            <div class="bio-content">
              <p>{{ studentData.bio }}</p>
            </div>

            <!-- 专业领域 -->
            <div class="expertise-section">
              <h4>专业领域</h4>
              <div class="expertise-tags">
                <el-tag 
                  v-for="skill in studentData.skills" 
                  :key="skill"
                  type="info"
                  effect="plain"
                  class="expertise-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
            </div>

            <!-- 兴趣爱好 -->
            <div class="interests-section">
              <h4>兴趣爱好</h4>
              <div class="interests-tags">
                <el-tag 
                  v-for="interest in studentData.interests" 
                  :key="interest"
                  type="warning"
                  effect="plain"
                  class="interest-tag"
                >
                  {{ interest }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleAddFriend">
          <el-icon><UserFilled /></el-icon>
          加为好友
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: boolean
  studentData: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const activeTab = ref('basic')

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleClose = () => {
  visible.value = false
  activeTab.value = 'basic'
}

const handleCall = (phone: string) => {
  console.log('拨打电话:', phone)
  // 在移动端可以直接拨打电话
  if (window.navigator.userAgent.includes('Mobile')) {
    window.location.href = `tel:${phone}`
  } else {
    // 在桌面端复制到剪贴板
    navigator.clipboard?.writeText(phone).then(() => {
      console.log('电话号码已复制到剪贴板')
    })
  }
}

const handleEmail = (email: string) => {
  window.location.href = `mailto:${email}`
}

const handleWechat = (wechat: string) => {
  console.log('添加微信:', wechat)
  // 复制微信号到剪贴板
  navigator.clipboard?.writeText(wechat).then(() => {
    console.log('微信号已复制到剪贴板')
  })
}

const handleAddFriend = () => {
  console.log('添加好友:', props.studentData?.name)
  // 实现添加好友逻辑
}

const getGender = (gender: string) => {
  const genderMap: Record<string, string> = {
    male: '男',
    female: '女',
    other: '其他'
  }
  return genderMap[gender] || '未知'
}
</script>

<style scoped lang="scss">
.student-detail {
  .student-header {
    display: flex;
    gap: $spacing-lg;
    padding: $spacing-lg;
    background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($accent-color, 0.1));
    border-radius: $border-radius-lg;
    border: 1px solid rgba($primary-color, 0.2);
    
    .student-avatar {
      position: relative;
      flex-shrink: 0;
      
      .online-status {
        position: absolute;
        top: -5px;
        right: -5px;
      }
    }
    
    .student-info {
      flex: 1;
      
      h2 {
        margin: 0 0 $spacing-md 0;
        color: $text-primary;
        font-size: $font-size-xxl;
      }
      
      .student-meta {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          color: $text-secondary;
          
          .el-icon {
            color: $primary-color;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  
  .detail-tabs {
    .tab-content {
      padding: $spacing-lg 0;
    }
  }
  
  .career-section {
    margin-bottom: $spacing-xl;
    
    h4 {
      margin: 0 0 $spacing-md 0;
      color: $text-primary;
      border-left: 4px solid $primary-color;
      padding-left: $spacing-sm;
    }
    
    .current-job {
      padding: $spacing-lg;
      background: rgba($primary-color, 0.05);
      border: 1px solid rgba($primary-color, 0.1);
      border-radius: $border-radius-md;
      
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-sm;
        
        h5 {
          margin: 0;
          color: $text-primary;
          font-size: $font-size-lg;
        }
      }
      
      .company-name {
        margin: 0 0 $spacing-sm 0;
        color: $primary-color;
        font-weight: 500;
      }
      
      .job-description {
        margin: 0;
        color: $text-secondary;
        line-height: 1.6;
      }
    }
  }
  
  .achievements-section {
    h4 {
      margin: 0 0 $spacing-md 0;
      color: $text-primary;
      border-left: 4px solid $accent-color;
      padding-left: $spacing-sm;
    }
    
    .achievements-list {
      .achievement-item {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm 0;
        border-bottom: 1px solid $border-light;
        
        &:last-child {
          border-bottom: none;
        }
        
        .el-icon {
          color: $accent-color;
          flex-shrink: 0;
        }
        
        span {
          color: $text-primary;
        }
      }
    }
  }
  
  .contact-info {
    .contact-item {
      display: flex;
      align-items: center;
      gap: $spacing-lg;
      padding: $spacing-lg;
      border-bottom: 1px solid $border-light;
      
      &:last-child {
        border-bottom: none;
      }
      
      .contact-icon {
        width: 40px;
        height: 40px;
        background: rgba($primary-color, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        .el-icon {
          color: $primary-color;
          font-size: $font-size-lg;
        }
      }
      
      .contact-details {
        flex: 1;
        
        .contact-label {
          font-size: $font-size-sm;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }
        
        .contact-value {
          font-size: $font-size-md;
          color: $text-primary;
          margin-bottom: $spacing-xs;
          font-weight: 500;
        }
      }
    }
  }
  
  .bio-content {
    margin-bottom: $spacing-xl;
    
    p {
      margin: 0;
      color: $text-primary;
      line-height: 1.8;
      font-size: $font-size-md;
    }
  }
  
  .expertise-section,
  .interests-section {
    margin-bottom: $spacing-lg;
    
    h4 {
      margin: 0 0 $spacing-md 0;
      color: $text-primary;
      font-size: $font-size-lg;
    }
    
    .expertise-tags,
    .interests-tags {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      
      .expertise-tag,
      .interest-tag {
        margin: 0;
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
  }
}

:deep(.el-descriptions-item__label) {
  font-weight: 500;
  color: $text-primary;
}

:deep(.el-descriptions-item__content) {
  color: $text-secondary;
}

@media (max-width: 768px) {
  .student-detail {
    .student-header {
      flex-direction: column;
      text-align: center;
      
      .student-meta {
        align-items: center;
      }
    }
    
    .contact-item {
      flex-direction: column;
      text-align: center;
      
      .contact-details {
        text-align: center;
      }
    }
  }
}
</style>
