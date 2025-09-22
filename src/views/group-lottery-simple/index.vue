<template>
  <div class="group-lottery-simple">
    <div class="container">
      <h1>人民大学EMBA2501班 - 分组抽签</h1>
      
      <!-- 查询表单 -->
      <div class="query-section" v-if="!showResult">
        <el-form :model="queryForm" class="query-form">
          <el-form-item>
            <el-input
              v-model="queryForm.password"
              placeholder="请输入月份+手机后四位(如：124988)"
              size="large"
              maxlength="6"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-button type="primary" size="large" @click="handleQuery" :loading="isQuerying">
            查询分组
          </el-button>
        </el-form>
      </div>

      <!-- 结果显示 -->
      <div class="result-section" v-if="showResult">
        <h2>🎉 恭喜 {{ currentStudent.name }} 同学！</h2>
        <div class="group-info">
          <h3>您的分组：第{{ groupInfo.groupNumber }}组</h3>
          <p>{{ groupInfo.themeName }}</p>
        </div>
        <el-button @click="resetQuery">重新查询</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const isQuerying = ref(false)
const showResult = ref(false)
const currentStudent = ref<any>({})
const groupInfo = ref<any>({})

const queryForm = reactive({
  password: ''
})

// 简化的学生数据
const studentDatabase: Record<string, any> = {
  '124988': { id: 1, name: '裴宇昕', groupNumber: 1 },
  '066185': { id: 2, name: '时志峰', groupNumber: 2 },
  '013369': { id: 3, name: '段洵', groupNumber: 3 },
  '051697': { id: 4, name: '薛岩铭', groupNumber: 4 }
}

// 分组信息
const groupsData: Record<number, any> = {
  1: { groupNumber: 1, themeName: '创新先锋队' },
  2: { groupNumber: 2, themeName: '价值创造团' },
  3: { groupNumber: 3, themeName: '智慧协作组' },
  4: { groupNumber: 4, themeName: '卓越领航队' }
}

const handleQuery = async () => {
  if (!queryForm.password || queryForm.password.length !== 6) {
    ElMessage.error('请输入正确的6位密码')
    return
  }

  isQuerying.value = true

  // 模拟查询过程
  await new Promise(resolve => setTimeout(resolve, 1000))

  const student = studentDatabase[queryForm.password]
  if (!student) {
    ElMessage.error('密码错误，请重新输入')
    isQuerying.value = false
    return
  }

  currentStudent.value = student
  groupInfo.value = groupsData[student.groupNumber]
  
  isQuerying.value = false
  showResult.value = true
  ElMessage.success('查询成功！')
}

const resetQuery = () => {
  showResult.value = false
  queryForm.password = ''
  currentStudent.value = {}
  groupInfo.value = {}
}
</script>

<style scoped>
.group-lottery-simple {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

h1 {
  color: #8C1C13;
  margin-bottom: 30px;
}

.query-form {
  margin: 30px 0;
}

.query-form .el-input {
  margin-bottom: 20px;
}

.result-section h2 {
  color: #8C1C13;
  margin-bottom: 20px;
}

.group-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.group-info h3 {
  color: #333;
  font-size: 1.5em;
  margin-bottom: 10px;
}
</style>
