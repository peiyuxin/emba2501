# 人民大学EMBA2501班前端网站

一个基于Vue 3 + TypeScript + Element Plus构建的现代化班级管理平台。

## 🎯 项目概述

本项目是专为人民大学EMBA2501班打造的综合性前端网站，集成了学习管理、社交互动、资源共享等功能模块，旨在为班级成员提供一个高效、便捷的数字化平台。

## ✨ 核心特性

### 🏠 首页看板
- 个性化欢迎界面
- 班级数据统计展示
- 近期课程安排
- 实时通知公告
- 学习进度可视化

### 📚 课程管理
- 完整的课程信息管理
- 课程进度跟踪
- 多维度筛选和搜索
- 课程详情和编辑功能

### 👥 同学录
- 班级成员信息展示
- 多维度筛选（行业、职位）
- 个人详细档案
- 一键联系功能

### 📸 班级相册
- 照片分类管理（开学典礼、企业参访、团建活动等）
- 网格和时间轴双视图
- 全功能照片灯箱
- 相册评论和互动

### 🎯 其他功能模块
- 班级活动管理
- 讨论论坛
- 学习资源库
- 个人中心

## 🛠️ 技术栈

### 前端框架
- **Vue 3.4+** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 极速的前端构建工具

### UI 组件库
- **Element Plus** - 基于 Vue 3 的桌面端组件库
- **@element-plus/icons-vue** - Element Plus 图标集

### 样式方案
- **SCSS** - CSS 预处理器
- **响应式设计** - 兼容桌面端和移动端

### 状态管理
- **Pinia** - Vue 3 官方状态管理库

### 路由管理
- **Vue Router 4** - Vue.js 官方路由管理器

### 数据可视化
- **ECharts 5** - 强大的数据可视化库
- **vue-echarts** - Vue 3 的 ECharts 组件

### 工具库
- **Axios** - HTTP 客户端
- **Day.js** - 轻量级日期处理库

## 🎨 设计理念

### 色彩系统
- **主色调**: 人大红 (#8C1C13) - 体现学校特色
- **金色点缀**: (#BB9C67) - 增添高端感
- **辅助色彩**: 现代化的功能色彩搭配

### 交互设计
- 简洁现代的界面设计
- 流畅的动画过渡效果
- 直观的用户操作体验
- 响应式布局适配

## 📁 项目结构

```
src/
├── components/          # 公共组件
├── layout/             # 布局组件
│   ├── index.vue       # 主布局
│   └── components/     # 布局子组件
│       ├── Header.vue  # 顶部导航
│       └── Sidebar.vue # 侧边栏
├── router/             # 路由配置
├── stores/             # 状态管理
├── styles/             # 样式文件
│   ├── index.scss      # 主样式文件
│   └── variables.scss  # 样式变量
├── views/              # 页面组件
│   ├── dashboard/      # 首页
│   ├── courses/        # 课程管理
│   ├── students/       # 同学录
│   ├── gallery/        # 班级相册
│   ├── activities/     # 班级活动
│   ├── forum/          # 讨论论坛
│   ├── resources/      # 学习资源
│   └── profile/        # 个人中心
└── utils/              # 工具函数
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📈 开发进度

- [x] 项目基础架构搭建
- [x] 核心布局和路由配置
- [x] 样式系统和主题配置
- [x] 首页看板开发
- [x] 课程管理模块
- [x] 同学录功能
- [x] 班级相册模块
- [ ] 班级活动管理
- [ ] 讨论论坛功能
- [ ] 学习资源库
- [ ] 个人中心完善
- [ ] 权限认证系统
- [ ] 后端API对接

## 🔧 开发规范

### 代码风格
- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 开发模式
- 统一的代码格式化和 ESLint 规则

### 组件开发
- 采用单文件组件 (.vue) 格式
- 合理拆分组件，提高复用性
- 良好的 props 类型定义和文档

### 样式规范
- 使用 SCSS 预处理器
- 统一的设计变量和主题色彩
- 响应式设计适配多端

## 🤝 贡献指南

欢迎为项目贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 开发团队

- **项目负责人**: EMBA2501班技术委员会
- **主要开发者**: 班级技术小组

---

**人民大学EMBA2501班** - 打造卓越的数字化学习平台 🎓
