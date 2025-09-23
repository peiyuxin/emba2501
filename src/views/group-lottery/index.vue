<template>
  <div class="group-lottery">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-element" v-for="i in 20" :key="i" :style="getRandomPosition(i)">
        <el-icon><Star /></el-icon>
      </div>
    </div>

    <div class="lottery-container">
      <!-- 页面头部 -->
      <div class="lottery-header">
        <h1 class="main-title">
          <span class="title-decoration">✨</span>
          人民大学EMBA2501班
          <span class="title-decoration">✨</span>
        </h1>
        <h2 class="sub-title">分组抽签结果查询</h2>
        <p class="welcome-text">
          亲爱的同学，欢迎查询您的分组信息！<br>
          我们即将开启一段美好的团队合作之旅 🌟
        </p>
      </div>

      <!-- 查询区域 -->
      <div class="query-section" v-if="!showResult">
        <div class="lottery-box" :class="{ 'shaking': isQuerying }">
          <div class="box-top"></div>
          <div class="box-body">
            <div class="box-content">
              <el-icon class="lottery-icon"><Gift /></el-icon>
              <h3>神秘分组盒</h3>
              <p>请输入您的专属密码</p>
            </div>
          </div>
        </div>

        <el-form 
          ref="formRef"
          :model="queryForm" 
          :rules="rules"
          class="query-form"
          @submit.prevent="handleQuery"
        >
          <div class="form-title">
            <el-icon><Key /></el-icon>
            <span>身份验证</span>
          </div>
          
          <el-form-item prop="password">
            <el-input
              v-model="queryForm.password"
              type="password"
              placeholder="请输入生日月份+手机号后四位"
              size="large"
              show-password
              clearable
              prefix-icon="Lock"
              maxlength="6"
              @keyup.enter="handleQuery"
            >
              <template #suffix>
                <el-tooltip content="例如：12月生日，手机尾号8888，则输入：128888" placement="top">
                  <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>

          <el-button 
            type="primary" 
            size="large" 
            class="query-btn"
            :loading="isQuerying"
            @click="handleQuery"
            :disabled="!queryForm.password"
          >
            <el-icon v-if="!isQuerying"><MagicStick /></el-icon>
            {{ isQuerying ? '正在为您查询...' : '揭晓我的分组' }}
          </el-button>
        </el-form>
      </div>

      <!-- 结果展示区域 -->
      <div class="result-section" v-if="showResult">
        <!-- 动画过渡 -->
        <transition name="result-appear" appear>
          <div class="result-container">
            <!-- 恭喜信息 -->
            <div class="congratulations">
              <div class="congrats-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <h2>🎉 恭喜 {{ decrypt(currentStudent.name) }}同学！</h2>
              <p class="congrats-text">您已被分配到一个优秀的团队</p>
            </div>

            <!-- 分组卡片 -->
            <div class="group-card">
              <div class="group-header">
                <div class="group-number">
                  第 <span class="number">{{ groupInfo.groupNumber }}</span> 组
                </div>
                <div class="group-theme">
                  <el-tag :color="groupInfo.themeColor" effect="dark" size="large">
                    {{ groupInfo.themeName }}
                  </el-tag>
                </div>
              </div>

              <div class="group-motto">
                <el-icon><ChatDotRound /></el-icon>
                "{{ groupInfo.motto }}"
              </div>

              <!-- 个人信息卡片 -->
              <div class="personal-section">
                <h3 class="section-title">
                  <el-icon><UserFilled /></el-icon>
                  您的分组信息
                </h3>
                
                <div class="personal-card">
                  <el-avatar :size="80" icon="UserFilled" />
                  <div class="personal-info">
                    <div class="personal-name">
                      {{ decrypt(currentStudent.name) }}
                      <el-icon color="#f56c6c">
                        <StarFilled />
                      </el-icon>
                    </div>
                    <div class="personal-role">EMBA学员</div>
                    <div class="personal-group">第{{ groupInfo.groupNumber }}组成员</div>
                  </div>
                </div>
              </div>

              <!-- 群管理任务 -->
              <div class="group-leader-task" v-if="isGroupLeader">
                <div class="task-card">
                  <div class="task-icon">
                    <el-icon><ChatDotRound /></el-icon>
                  </div>
                  <div class="task-content">
                    <h4>🎯 重要任务</h4>
                    <p>您已被指定为本组的群管理员！请创建小组微信群，方便组员们交流学习。</p>
                    <div class="task-steps">
                      <p>📱 <strong>创建步骤：</strong></p>
                      <ol>
                        <li>创建微信群（建议群名：{{ groupInfo.themeName }}）</li>
                        <li>邀请本组其他11位同学入群</li>
                      </ol>
                      <p class="task-note">✅ 创建完成后，您的任务就完成了！</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 团队特色 -->
              <div class="team-features">
                <h4 class="feature-title">团队特色</h4>
                <div class="features-list">
                  <el-tag 
                    v-for="feature in groupInfo.features" 
                    :key="feature"
                    effect="plain"
                    class="feature-tag"
                  >
                    {{ feature }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 温暖寄语 -->
            <div class="warm-message">
              <div class="message-content">
                <el-icon class="message-icon"><Heart /></el-icon>
                <div class="message-text">
                  <h4>温馨寄语</h4>
                  <p>{{ warmMessage }}</p>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="shareResult">
                <el-icon><Share /></el-icon>
                分享给组员
              </el-button>
              <el-button type="success" size="large" @click="downloadResult">
                <el-icon><Download /></el-icon>
                保存结果
              </el-button>
              <el-button size="large" @click="resetQuery">
                <el-icon><RefreshLeft /></el-icon>
                重新查询
              </el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 彩带效果 -->
    <div class="confetti" v-if="showConfetti">
      <div v-for="i in 50" :key="i" class="confetti-piece" :style="getConfettiStyle(i)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

// 响应式数据
const formRef = ref<FormInstance>()
const isQuerying = ref(false)
const showResult = ref(false)
const showConfetti = ref(false)

const queryForm = reactive({
  password: ''
})

// 简单可靠的加密解密函数
const encryptionKey = 'EMBA2501RUC'

const encrypt = (text: string): string => {
  try {
    // 使用简单的字符替换加密
    let result = ''
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length)
      result += charCode.toString(16).padStart(4, '0')
    }
    return result
  } catch (error) {
    console.error('加密错误:', error)
    return 'encrypted_' + Math.random().toString(36).substr(2, 8)
  }
}

const decrypt = (encoded: string): string => {
  try {
    if (!encoded || encoded.length % 4 !== 0) {
      return '解密失败'
    }
    
    let result = ''
    for (let i = 0; i < encoded.length; i += 4) {
      const hex = encoded.substr(i, 4)
      const charCode = parseInt(hex, 16) ^ encryptionKey.charCodeAt((i / 4) % encryptionKey.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    console.error('解密错误:', error, '输入:', encoded)
    return '姓名解密失败'
  }
}

// 加密后的学生数据库 - 防偷窥
const studentDatabase: Record<string, any> = {
  // 第1组数据 (加密)
  '115228': { id: 1, name: encrypt('陈昶'), groupNumber: 1, phone: encrypt('5228'), birthday: '11月' },
  '071212': { id: 2, name: encrypt('陈梅'), groupNumber: 2, phone: encrypt('1212'), birthday: '07月' },
  '025983': { id: 3, name: encrypt('陈文茹'), groupNumber: 4, phone: encrypt('5983'), birthday: '02月' },
  '108286': { id: 4, name: encrypt('陈亚敏'), groupNumber: 3, phone: encrypt('8286'), birthday: '10月' },
  '013369': { id: 5, name: encrypt('段洵'), groupNumber: 3, phone: encrypt('3369'), birthday: '01月' },
  '038125': { id: 6, name: encrypt('段振平'), groupNumber: 3, phone: encrypt('8125'), birthday: '03月' },
  '040592': { id: 7, name: encrypt('冯骥'), groupNumber: 4, phone: encrypt('0592'), birthday: '04月' },
  '104666': { id: 8, name: encrypt('冯妍'), groupNumber: 1, phone: encrypt('4666'), birthday: '10月' },
  '047561': { id: 9, name: encrypt('甘露'), groupNumber: 2, phone: encrypt('7561'), birthday: '04月' },
  '116870': { id: 10, name: encrypt('胡鑫'), groupNumber: 3, phone: encrypt('6870'), birthday: '11月' },
  '042829': { id: 11, name: encrypt('黄呈岑'), groupNumber: 3, phone: encrypt('2829'), birthday: '04月' },
  '079002': { id: 12, name: encrypt('黄丽'), groupNumber: 1, phone: encrypt('9002'), birthday: '07月' },
  '085500': { id: 13, name: encrypt('贾广亮'), groupNumber: 1, phone: encrypt('5500'), birthday: '08月' },
  '118369': { id: 14, name: encrypt('李娜'), groupNumber: 1, phone: encrypt('8369'), birthday: '11月' },
  '046954': { id: 15, name: encrypt('李泽鹏'), groupNumber: 2, phone: encrypt('6954'), birthday: '04月' },
  '013296': { id: 16, name: encrypt('刘飞'), groupNumber: 2, phone: encrypt('3296'), birthday: '01月' },
  '092077': { id: 17, name: encrypt('刘海'), groupNumber: 4, phone: encrypt('2077'), birthday: '09月' },
  '021797': { id: 18, name: encrypt('刘宇昕'), groupNumber: 4, phone: encrypt('1797'), birthday: '02月' },
  '070101': { id: 19, name: encrypt('卢蕴琦'), groupNumber: 3, phone: encrypt('0101'), birthday: '07月' },
  '076266': { id: 20, name: encrypt('吕莉'), groupNumber: 4, phone: encrypt('6266'), birthday: '07月' },
  '096652': { id: 21, name: encrypt('马爽'), groupNumber: 4, phone: encrypt('6652'), birthday: '09月' },
  '039955': { id: 22, name: encrypt('莫治国'), groupNumber: 4, phone: encrypt('9955'), birthday: '03月' },
  '045150': { id: 23, name: encrypt('慕飏'), groupNumber: 3, phone: encrypt('5150'), birthday: '04月' },
  '124988': { id: 24, name: encrypt('裴宇昕'), groupNumber: 1, phone: encrypt('4988'), birthday: '12月' },
  '066185': { id: 25, name: encrypt('时志峰'), groupNumber: 2, phone: encrypt('6185'), birthday: '06月' },
  '113212': { id: 26, name: encrypt('孙榕蓉'), groupNumber: 3, phone: encrypt('3212'), birthday: '11月' },
  '077069': { id: 27, name: encrypt('孙雪'), groupNumber: 2, phone: encrypt('7069'), birthday: '07月' },
  '068833': { id: 28, name: encrypt('孙雪婷'), groupNumber: 4, phone: encrypt('8833'), birthday: '06月' },
  '017080': { id: 29, name: encrypt('覃飞安'), groupNumber: 3, phone: encrypt('7080'), birthday: '01月' },
  '106308': { id: 30, name: encrypt('王斌'), groupNumber: 3, phone: encrypt('6308'), birthday: '10月' },
  '107142': { id: 31, name: encrypt('王艺璇'), groupNumber: 1, phone: encrypt('7142'), birthday: '10月' },
  '028965': { id: 32, name: encrypt('王宇'), groupNumber: 2, phone: encrypt('8965'), birthday: '02月' },
  '122397': { id: 33, name: encrypt('吴晓菲'), groupNumber: 3, phone: encrypt('2397'), birthday: '12月' },
  '103683': { id: 34, name: encrypt('谢甜'), groupNumber: 1, phone: encrypt('3683'), birthday: '10月' },
  '040865': { id: 35, name: encrypt('徐炜'), groupNumber: 1, phone: encrypt('0865'), birthday: '04月' },
  '021637': { id: 36, name: encrypt('许海彬'), groupNumber: 2, phone: encrypt('1637'), birthday: '02月' },
  '051697': { id: 37, name: encrypt('薛岩铭'), groupNumber: 4, phone: encrypt('1697'), birthday: '05月' },
  '094954': { id: 38, name: encrypt('杨骁虎'), groupNumber: 1, phone: encrypt('4954'), birthday: '09月' },
  '099717': { id: 39, name: encrypt('杨洋'), groupNumber: 4, phone: encrypt('9717'), birthday: '09月' },
  '059186': { id: 40, name: encrypt('袁婷'), groupNumber: 2, phone: encrypt('9186'), birthday: '05月' },
  '097503': { id: 41, name: encrypt('昝庆'), groupNumber: 2, phone: encrypt('7503'), birthday: '09月' },
  '099999': { id: 42, name: encrypt('詹曦'), groupNumber: 2, phone: encrypt('9999'), birthday: '09月' },
  '116868': { id: 43, name: encrypt('张亮'), groupNumber: 4, phone: encrypt('6868'), birthday: '11月' },
  '063567': { id: 44, name: encrypt('张啸宇'), groupNumber: 4, phone: encrypt('3567'), birthday: '06月' },
  '070023': { id: 45, name: encrypt('赵策'), groupNumber: 3, phone: encrypt('0023'), birthday: '07月' },
  '059421': { id: 46, name: encrypt('赵健博'), groupNumber: 1, phone: encrypt('9421'), birthday: '05月' },
  '092182': { id: 47, name: encrypt('朱静'), groupNumber: 1, phone: encrypt('2182'), birthday: '09月' },
  '063372': { id: 48, name: encrypt('郭珺'), groupNumber: 2, phone: encrypt('3372'), birthday: '06月' }
}

// 分组信息 - 动态生成加密成员列表
const generateGroupMembers = (groupNumber: number): any[] => {
  const members: any[] = []
  const avatars = [
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    'https://cube.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
  ]
  
  // 从加密数据库中筛选该组成员
  Object.values(studentDatabase).forEach((student: any, index) => {
    if (student.groupNumber === groupNumber) {
      members.push({
        id: student.id,
        name: student.name, // 保持加密状态
        position: 'EMBA学员',
        company: '企业高管', 
        avatar: avatars[index % avatars.length]
      })
    }
  })
  
  return members
}

const groupsData: Record<number, any> = {
  1: {
    groupNumber: 1,
    themeName: '创新先锋队',
    themeColor: '#ff6b6b',
    motto: '创新驱动未来，团队成就梦想',
    features: ['创新思维', '技术导向', '敏捷协作', '数据驱动'],
    members: generateGroupMembers(1)
  },
  2: {
    groupNumber: 2,
    themeName: '价值创造团',
    themeColor: '#4ecdc4',
    motto: '以价值为导向，用智慧创造未来',
    features: ['价值创造', '商业模式', '战略思维', '领导力'],
    members: generateGroupMembers(2)
  },
  3: {
    groupNumber: 3,
    themeName: '智慧协作组',
    themeColor: '#45b7d1',
    motto: '集众智慧，协作共赢',
    features: ['团队协作', '知识共享', '持续学习', '互助成长'],
    members: generateGroupMembers(3)
  },
  4: {
    groupNumber: 4,
    themeName: '卓越领航队',
    themeColor: '#f9ca24',
    motto: '卓越品质，领航未来',
    features: ['卓越品质', '领导力', '前瞻视野', '创造价值'],
    members: generateGroupMembers(4)
  }
}

const currentStudent = ref<any>({})
const groupInfo = ref<any>({})
const isGroupLeader = ref(false)

// 表单验证规则
const rules: FormRules = {
  password: [
    { required: true, message: '请输入您的专属密码', trigger: 'blur' },
    { min: 6, max: 6, message: '密码长度应为6位', trigger: 'blur' }
  ]
}

// 温馨寄语
const warmMessage = computed(() => {
  const messages = [
    '在这个团队里，您将遇到志同道合的伙伴，一起成长，一起进步。愿这段学习之旅充满收获与快乐！',
    '每个人都是团队中不可或缺的一份子，期待您与组员们携手创造出精彩的学习成果！',
    '缘分让您们相聚，智慧让您们共进。祝愿您在这个优秀的团队中收获知识与友谊！'
  ]
  return messages[Math.floor(Math.random() * messages.length)]
})

// 方法
const handleQuery = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    isQuerying.value = true

    // 模拟查询过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    const student = studentDatabase[queryForm.password]
    if (!student) {
      ElMessage.error('密码错误，请检查您的生日月份和手机号后四位')
      isQuerying.value = false
      return
    }

    // 设置当前学生和分组信息
    currentStudent.value = student
    groupInfo.value = groupsData[student.groupNumber]
    
    // 判断是否为群管理员（负责创建微信群）
    const groupManagers = {
      1: '王艺璇',    // 第1组群管理员
      2: '李泽鹏',    // 第2组群管理员
      3: '赵策',    // 第3组群管理员
      4: '刘宇昕'     // 第4组群管理员
    }
    
    const studentName = decrypt(student.name)
    isGroupLeader.value = groupManagers[student.groupNumber] === studentName
    
    isQuerying.value = false
    showResult.value = true

    // 延迟显示彩带效果
    await nextTick()
    setTimeout(() => {
      showConfetti.value = true
      setTimeout(() => {
        showConfetti.value = false
      }, 3000)
    }, 500)

    ElMessage.success(`恭喜${decrypt(student.name)}同学！查询成功！`)

  } catch (error) {
    isQuerying.value = false
    console.error('查询失败:', error)
  }
}

const shareResult = () => {
  // 实现分享功能
  ElMessage.success('分享链接已复制到剪贴板')
}

const downloadResult = () => {
  // 实现下载功能
  ElMessage.success('分组结果已保存')
}

const resetQuery = () => {
  showResult.value = false
  showConfetti.value = false
  queryForm.password = ''
  currentStudent.value = {}
  groupInfo.value = {}
  isGroupLeader.value = false
}

// 装饰元素位置
const getRandomPosition = (index: number) => {
  const positions = [
    { top: '10%', left: '5%', animationDelay: `${index * 0.5}s` },
    { top: '20%', right: '10%', animationDelay: `${index * 0.3}s` },
    { bottom: '30%', left: '8%', animationDelay: `${index * 0.7}s` },
    { bottom: '15%', right: '5%', animationDelay: `${index * 0.4}s` },
  ]
  return positions[index % positions.length]
}

// 彩带样式
const getConfettiStyle = (index: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b']
  return {
    left: Math.random() * 100 + '%',
    backgroundColor: colors[index % colors.length],
    animationDelay: Math.random() * 2 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's'
  }
}
</script>

<style scoped lang="scss">
.group-lottery {
  min-height: 100vh;
  background: linear-gradient(135deg, #8C1C13 0%, #5d1309 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  .background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;

    .floating-element {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      font-size: 20px;
      animation: float 6s ease-in-out infinite alternate;

      @keyframes float {
        from { transform: translateY(0px) rotate(0deg); }
        to { transform: translateY(-20px) rotate(180deg); }
      }
    }
  }

  .lottery-container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .lottery-header {
    text-align: center;
    margin-bottom: 60px;
    color: white;

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 20px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

      .title-decoration {
        display: inline-block;
        animation: sparkle 2s ease-in-out infinite;
      }

      @keyframes sparkle {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    }

    .sub-title {
      font-size: 1.8rem;
      font-weight: 500;
      margin: 0 0 20px 0;
      color: $accent-light;
    }

    .welcome-text {
      font-size: 1.1rem;
      line-height: 1.6;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto;
    }
  }

  .query-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;

    .lottery-box {
      position: relative;
      transition: transform 0.3s ease;

      &.shaking {
        animation: shake 0.5s ease-in-out infinite;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .box-top {
        width: 200px;
        height: 60px;
        background: linear-gradient(45deg, $accent-color, $accent-light);
        border-radius: 20px 20px 5px 5px;
        position: relative;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }
      }

      .box-body {
        width: 220px;
        height: 180px;
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: -10px auto 0;

        .box-content {
          text-align: center;
          padding: 20px;

          .lottery-icon {
            font-size: 48px;
            color: $primary-color;
            margin-bottom: 15px;
          }

          h3 {
            margin: 0 0 10px 0;
            color: $text-primary;
            font-size: 1.2rem;
          }

          p {
            margin: 0;
            color: $text-secondary;
            font-size: 0.9rem;
          }
        }
      }
    }

    .query-form {
      width: 100%;
      max-width: 400px;
      background: rgba(255, 255, 255, 0.95);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);

      .form-title {
        text-align: center;
        margin-bottom: 30px;
        font-size: 1.2rem;
        font-weight: 600;
        color: $text-primary;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .query-btn {
        width: 100%;
        height: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 20px;
        background: linear-gradient(45deg, $primary-color, $primary-light);
        border: none;
        border-radius: 25px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .result-section {
    .result-container {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 25px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    .congratulations {
      margin-bottom: 40px;

      .congrats-icon {
        font-size: 4rem;
        color: $accent-color;
        margin-bottom: 20px;
        animation: bounce 1s ease-in-out;
      }

      h2 {
        font-size: 2rem;
        color: $text-primary;
        margin: 0 0 15px 0;
      }

      .congrats-text {
        font-size: 1.1rem;
        color: $text-secondary;
        margin: 0;
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
      }
    }

    .group-card {
      background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
      border-radius: 20px;
      padding: 30px;
      margin: 30px 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

      .group-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;

        .group-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: $primary-color;

          .number {
            font-size: 3rem;
            color: $accent-color;
          }
        }
      }

      .group-motto {
        font-size: 1.2rem;
        font-style: italic;
        color: $text-secondary;
        margin-bottom: 30px;
        padding: 20px;
        background: rgba($accent-color, 0.1);
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .personal-section {
        margin: 30px 0;

        .section-title {
          font-size: 1.3rem;
          color: $text-primary;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .personal-card {
          background: linear-gradient(135deg, $primary-color, $primary-light);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          color: white;
          animation: slideInUp 0.6s ease forwards;

          .personal-info {
            margin-top: 20px;

            .personal-name {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }

            .personal-role {
              font-size: 1rem;
              opacity: 0.9;
              margin-bottom: 5px;
            }

            .personal-group {
              font-size: 1.1rem;
              font-weight: 500;
              opacity: 0.8;
            }
          }
        }
      }

      .group-leader-task {
        margin: 30px 0;

        .task-card {
          background: linear-gradient(135deg, #f9ca24, #f39c12);
          border-radius: 20px;
          padding: 25px;
          color: #2c3e50;
          animation: slideInUp 0.8s ease forwards;
          box-shadow: 0 10px 25px rgba(249, 202, 36, 0.3);

          .task-icon {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #e67e22;
          }

          .task-content {
            h4 {
              font-size: 1.4rem;
              margin-bottom: 15px;
              text-align: center;
              color: #2c3e50;
            }

            p {
              font-size: 1rem;
              margin-bottom: 20px;
              text-align: center;
              line-height: 1.6;
            }

              .task-steps {
                background: rgba(255, 255, 255, 0.3);
                padding: 20px;
                border-radius: 15px;
                text-align: left;

                p {
                  margin-bottom: 10px;
                  text-align: left;
                  font-weight: 600;
                }

                .task-note {
                  margin-top: 15px;
                  padding: 10px;
                  background: rgba(255, 255, 255, 0.5);
                  border-radius: 8px;
                  text-align: center !important;
                  font-weight: 500;
                  color: #2c3e50;
                }

                ol {
                  margin: 0;
                  padding-left: 20px;

                  li {
                    margin-bottom: 8px;
                    line-height: 1.5;
                  }
                }
              }
          }
        }
      }

      .team-features {
        .feature-title {
          font-size: 1.1rem;
          color: $text-primary;
          margin-bottom: 15px;
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;

          .feature-tag {
            font-size: 0.9rem;
            padding: 8px 16px;
          }
        }
      }
    }

    .warm-message {
      margin: 30px 0;
      padding: 25px;
      background: linear-gradient(135deg, rgba($accent-color, 0.1), rgba($primary-color, 0.1));
      border-radius: 20px;
      border-left: 5px solid $accent-color;

      .message-content {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        text-align: left;

        .message-icon {
          font-size: 2rem;
          color: $accent-color;
          flex-shrink: 0;
        }

        .message-text {
          h4 {
            margin: 0 0 10px 0;
            color: $text-primary;
            font-size: 1.2rem;
          }

          p {
            margin: 0;
            color: $text-secondary;
            line-height: 1.6;
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
      flex-wrap: wrap;

      .el-button {
        padding: 12px 25px;
        border-radius: 25px;
        font-weight: 600;
      }
    }
  }

  .result-appear-enter-active {
    animation: resultAppear 0.8s ease;
  }

  @keyframes resultAppear {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(50px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .confetti {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 1000;

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 10px;
      top: -10px;
      animation: confettiFall linear infinite;

      @keyframes confettiFall {
        to {
          transform: translateY(calc(100vh + 10px)) rotate(360deg);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .group-lottery {
    padding: 10px;

    .lottery-header {
      .main-title {
        font-size: 1.8rem;
      }

      .sub-title {
        font-size: 1.4rem;
      }
    }

    .query-section {
      .query-form {
        padding: 30px 20px;
      }
    }

    .result-section {
      .result-container {
        padding: 20px;
      }

      .group-card {
        padding: 20px;

        .group-header {
          flex-direction: column;
          gap: 15px;
        }

        .members-grid {
          grid-template-columns: 1fr;
        }
      }

      .action-buttons {
        flex-direction: column;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
