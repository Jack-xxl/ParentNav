// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

// 基础页面
import Home from './pages/Home.vue'
import Assessment from './pages/Assessment.vue'
import Result from './pages/Result.vue'
import PaidResult from './pages/PaidResult.vue'
import PaidUpgradeInfo from './pages/PaidUpgradeInfo.vue'

// 付费测评相关
import PaidAssessmentFull from './pages/PaidAssessmentFull.vue'
import PaidFullReport from './pages/PaidFullReport.vue'
import Paid199Modules from './pages/Paid199Modules.vue'

// 训练营总览 & 各训练营页面
import ParentnavTrainingCamp from './pages/ParentnavTrainingCamp.vue'
import FamilyStrategyCamp from './pages/FamilyStrategyCamp.vue'
import ParentCoachCamp from './pages/ParentCoachCamp.vue'   // ✅ 新增：父母教练成长营

// AI成长顾问
import AiConsultant from './pages/AiConsultant.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ai-consultant', component: AiConsultant },

  // 评测/结果
  { path: '/assessment', component: Assessment },
  { path: '/result', component: Result },
  { path: '/paid-result', component: PaidResult },
  { path: '/upgrade-info', component: PaidUpgradeInfo },

  // 训练营
  { path: '/training-camp', component: ParentnavTrainingCamp },
  { path: '/camp/strategy', component: FamilyStrategyCamp }, // 家庭战略规划营
  { path: '/camp/coach', component: ParentCoachCamp },       // ✅ 父母教练成长营（新增）

  // 付费测评路由
  { path: '/paid-199-assessment', component: PaidAssessmentFull },
  { path: '/paid-199-report', component: PaidFullReport },
  { path: '/paid199modules', component: Paid199Modules },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})