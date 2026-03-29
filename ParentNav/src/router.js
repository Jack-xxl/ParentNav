import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Assessment from './pages/Assessment.vue'
import Result from './pages/Result.vue'
import PaidResult from './pages/PaidResult.vue'
import PaidUpgradeInfo from './pages/PaidUpgradeInfo.vue'
import PaidAssessmentFull from './pages/PaidAssessmentFull.vue'
import PaidFullReport from './pages/PaidFullReport.vue'
import Paid199Modules from './pages/Paid199Modules.vue'
import ParentnavTrainingCamp from './pages/ParentnavTrainingCamp.vue'
import FamilyStrategyCamp from './pages/FamilyStrategyCamp.vue'
import ParentCoachCamp from './pages/ParentCoachCamp.vue'
import AiConsultant from './pages/AiConsultant.vue'
import ParentQuiz from './pages/ParentQuiz.vue'

const routes = [
  { path: '/', component: ParentQuiz },
  { path: '/home', component: Home },
  { path: '/ai-consultant', component: AiConsultant },
  { path: '/quiz', component: ParentQuiz },

  { path: '/assessment', component: Assessment },
  { path: '/result', component: Result },
  { path: '/paid-result', component: PaidResult },
  { path: '/upgrade-info', component: PaidUpgradeInfo },

  { path: '/training-camp', component: ParentnavTrainingCamp },
  { path: '/camp/strategy', component: FamilyStrategyCamp },
  { path: '/camp/coach', component: ParentCoachCamp },

  { path: '/paid-199-assessment', component: PaidAssessmentFull },
  { path: '/paid-199-report', component: PaidFullReport },
  { path: '/paid199modules', component: Paid199Modules },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})