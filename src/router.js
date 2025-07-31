import { createRouter, createWebHistory } from 'vue-router';

import Home from './pages/Home.vue';
import Assessment from './pages/Assessment.vue';
import Result from './pages/Result.vue';
import PaidResult from './pages/PaidResult.vue';
import PaidUpgradeInfo from './pages/paidUpgradeInfo.vue';

// 付费测评相关引入
import PaidAssessmentFull from './pages/PaidAssessmentFull.vue';
import PaidFullReport from './pages/PaidFullReport.vue';
import Paid199Modules from './pages/Paid199Modules.vue';

// 训练营新引入
import ParentnavTrainingCamp from './pages/ParentnavTrainingCamp.vue';

// 新加这一行，AI成长顾问页面
import AiConsultant from './pages/AiConsultant.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/ai-consultant', component: AiConsultant }, // 新增，路径随意可自定义
  { path: '/assessment', component: Assessment },
  { path: '/result', component: Result },
  { path: '/paid-result', component: PaidResult },
  { path: '/upgrade-info', component: PaidUpgradeInfo },
  { path: '/training-camp', component: ParentnavTrainingCamp },

  // 付费测评路由
  { path: '/paid-199-assessment', component: PaidAssessmentFull },
  { path: '/paid-199-report', component: PaidFullReport },
  { path: '/paid199modules', component: Paid199Modules },
];

export default createRouter({
  history: createWebHistory(),
  routes
});
