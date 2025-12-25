<template>
  <div class="result-page">
    <h2 class="title">家长测评结果</h2>

    <!-- 顶部说明（可留可删） -->
    <section class="desc">
      <h3>测评说明：</h3>
      <ul>
        <li>本测评包含 <b>6 个核心模块</b></li>
        <li>每题按选项得分累计，结果换算为百分制（0-100）</li>
        <li>
          等级划分：0-49 初步探索｜50-69 基础阶段｜70-84 进阶阶段｜85-94 高级阶段｜95-100 优秀阶段
        </li>
      </ul>
    </section>

    <!-- 雷达图 -->
    <div class="radar-wrap">
      <div ref="radarRef" class="radar"></div>
    </div>

    <!-- 总览表（客观评价：跟分数挂钩） -->
    <section class="table">
      <table>
        <thead>
          <tr>
            <th>模块</th>
            <th>分数</th>
            <th>等级</th>
            <th>客观评价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.module">
            <td>{{ r.module }}</td>
            <td><b>{{ r.score }}</b></td>
            <td>{{ r.level }}</td>
            <td>{{ r.comment }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- 模块卡片区（图一风格：装饰 + 具体建议清单） -->
    <section class="cards">
      <div v-for="r in results" :key="r.module" class="module-card">
        <div class="card-head">
          <div class="card-title">
            <b>{{ r.module }}</b>
            <span class="badge">{{ r.level }} · {{ r.score }}分</span>
          </div>
        </div>

        <div class="comment">
          {{ r.comment }}
        </div>

        <div class="guide" v-if="r.actions && r.actions.length">
          <div class="guide-title">下一步怎么做（建议）</div>
          <ul>
            <li v-for="(a, i) in r.actions" :key="i">✅ {{ a }}</li>
          </ul>
        </div>
      </div>
    </section>

    <div class="actions">
      <button class="btn" @click="goUpgrade">升级解锁完整报告</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()

/** ===================== 六大模块（固定顺序） ===================== */
const MODULES = ['成人', '成才', '成为自己', '幸福力', '家庭责任', '谋生手段']

/** ===================== 等级划分（百分制） ===================== */
function getLevel(score) {
  if (score < 50) return '初步探索'
  if (score < 70) return '基础阶段'
  if (score < 85) return '进阶阶段'
  if (score < 95) return '高级阶段'
  return '优秀阶段'
}

/** 分段（用于客观评价） */
function getBand(score) {
  if (score < 50) return 'low'
  if (score < 70) return 'mid'
  if (score < 85) return 'good'
  if (score < 95) return 'high'
  return 'top'
}

/** 百分制换算：raw/max → 0-100 */
function toPercent(raw, max) {
  const m = Number(max)
  const r = Number(raw)
  if (!Number.isFinite(m) || m <= 0) return 0
  const pct = Math.round((r / m) * 100)
  return Math.min(100, Math.max(0, pct))
}

/** ===================== 客观评价（随分数段变化） ===================== */
const commentMap = {
  成人: {
    low: '成人基础偏弱：规则、边界与自律的稳定性不足，容易被情绪或短期目标带跑。',
    mid: '成人能力在建立：开始重视品格与规则，但执行一致性还不够稳定。',
    good: '成人维度表现不错：能在规则与尊重之间取得平衡，继续强化长期主义与自我管理。',
    high: '成人维度成熟：家庭价值观清晰，孩子更容易形成自律与责任感。',
    top: '成人维度非常强：接近示范型水平，建议把方法沉淀成家庭机制并长期坚持。'
  },
  成才: {
    low: '成才模块偏弱：学习方法与复盘体系不足，容易更依赖“逼”和“补”。',
    mid: '成才模块达标：开始关注方法，但缺少稳定学习系统与可迁移能力训练。',
    good: '成才模块良好：能做方法调整与复盘，建议加速“能力→成果/作品”的转化。',
    high: '成才模块强：学习系统相对成熟，继续强化项目化学习与迁移能力。',
    top: '成才模块极强：能把能力转化为成果与作品集，建议持续输出并获得真实反馈。'
  },
  成为自己: {
    low: '成为自己偏弱：表达与选择空间不足，可能导致依赖或压抑，天赋优势难以被点燃。',
    mid: '成为自己在建立：愿意听见孩子，但“放手+边界”的平衡还需强化。',
    good: '成为自己不错：支持差异化探索，建议用低成本试错机制把兴趣落地成成果。',
    high: '成为自己成熟：尊重差异并能引导自我认知，继续推动“天赋→优势”。',
    top: '成为自己非常强：能稳定激发独特性，建议建立长期成长档案与路径规划。'
  },
  幸福力: {
    low: '幸福力偏弱：情绪识别与陪伴不足，压力管理容易缺位，亲子沟通成本偏高。',
    mid: '幸福力达标：开始关注情绪与沟通，但缺少稳定的调节与复盘机制。',
    good: '幸福力良好：能引导孩子面对压力，建议补齐“情绪→行动”的闭环与表达训练。',
    high: '幸福力强：具备情绪陪伴与修复能力，继续强化家庭氛围的边界与仪式感。',
    top: '幸福力非常强：情绪智慧突出，建议形成家庭情绪沟通规则并长期固化。'
  },
  家庭责任: {
    low: '家庭责任偏弱：规则与分工不清晰、执行随意，容易导致反复消耗与情绪冲突。',
    mid: '家庭责任在建立：规则开始出现，但一致性与复盘机制不足。',
    good: '家庭责任良好：家庭氛围在改善，建议固化“家庭会议+分工+复盘”。',
    high: '家庭责任强：系统稳定运行，孩子责任感更容易被训练出来。',
    top: '家庭责任非常强：家庭系统健康稳定，建议把家风文化沉淀为长期资产。'
  },
  谋生手段: {
    low: '谋生手段偏弱：对未来路径与可变现能力准备不足，容易只押注学业。',
    mid: '谋生手段达标：开始有意识，但项目体验与能力组合还不够系统。',
    good: '谋生手段良好：关注不可替代能力，建议规划年度项目与作品资产。',
    high: '谋生手段强：路径清晰并在推进，继续扩大真实反馈与资源连接。',
    top: '谋生手段非常强：具备“能力组合+成果展示”的系统思维，建议建立个人发展资产包。'
  }
}

/** ===================== 可执行建议（图一风格） ===================== */
const actionMap = {
  成人: {
    初步探索: [
      '本周做一件“说到做到”的小承诺（可写在纸上），完成后让孩子看见你的兑现。',
      '冲突时先暂停10秒：先听完孩子再回应（不插话）。',
      '每天一句“品格肯定”：指出孩子一个具体行为里的责任/诚实/坚持。'
    ],
    基础阶段: [
      '固定1条家庭规则（作息/手机/礼貌）坚持7天，并在周末复盘一次。',
      '用“我感受/我担心/我建议”替代“你必须/你怎么又…”。',
      '把“边界”说清楚：允许什么、不允许什么、违反后果是什么。'
    ],
    进阶阶段: [
      '每周一次“责任复盘”：做得好/做得更好/下周一个微目标。',
      '让孩子参与一次家庭决策：提出方案→比较利弊→共同决定。',
      '建立“自律小系统”：目标-规则-反馈-奖励（贴墙可视化）。'
    ],
    高级阶段: [
      '把价值观沉淀为家庭三条原则（如诚信/责任/尊重），写下来并长期执行。',
      '把惩罚改为“后果教育”：让孩子承担与错误对应的一部分后果并复盘。',
      '引导孩子做一件“对他人有益”的事（帮助/志愿/分享）。'
    ],
    优秀阶段: [
      '固化家庭机制：每周家庭会议+分工+复盘，形成长期制度。',
      '把“责任”外溢到社会：公益/志愿/项目协作，建立社会责任感。',
      '把你的方法写成家庭手册，让其他照护者保持一致执行。'
    ]
  },

  成才: {
    初步探索: [
      '把“只看分数”改为“看过程”：本周只盯一个习惯（如每天20分钟专注）。',
      '每次作业后用3分钟复盘：错在哪/为什么/下次怎么做。',
      '先减少补课加码，把时间腾出来给方法训练。'
    ],
    基础阶段: [
      '建立“学习四步”：目标→计划→执行→复盘，每天做一次小循环。',
      '错题不只是抄：要写“错因一句话+同类题一题”。',
      '每周做一次“迁移”：把学到的方法用到另一学科或生活问题上。'
    ],
    进阶阶段: [
      '训练“拆解能力”：把一周任务拆成每天3个可完成小任务。',
      '建立“时间块”：番茄钟25分钟×2组，结束后再玩。',
      '把一项能力做成成果：写一篇/做一张图/讲解一次/录一段视频。'
    ],
    高级阶段: [
      '引导项目化学习：围绕兴趣做一个小项目（PPT/作品/小工具/小报告）。',
      '训练“输出倒逼输入”：学完能讲给别人听才算会。',
      '用AI提升效率：提问-检索-总结-验证-输出（要做核对与纠错）。'
    ],
    优秀阶段: [
      '建立作品集：每月1个可展示成果（文章/项目/作品/比赛）。',
      '增加真实反馈：让老师/同学/用户给反馈，形成迭代闭环。',
      '把学习系统分享给孩子，让他能自我管理并复制。'
    ]
  },

  成为自己: {
    初步探索: [
      '先把“否定/打断”换成一句追问：你为什么这么想？',
      '每天给孩子一次选择权（吃什么/先做哪科/周末去哪）。',
      '记录一条“孩子的优势线索”：他在哪些场景特别投入/有成就感。'
    ],
    基础阶段: [
      '每周一次“兴趣对话”：喜欢什么/为什么/想试什么/下周试一次。',
      '允许小范围试错：用最低成本试一试（1小时/一次体验）。',
      '把“我替你决定”改为“我帮你做决策”：信息-利弊-试一试-复盘。'
    ],
    进阶阶段: [
      '建立“成长档案”：兴趣、作品、反馈、反思，每月更新一次。',
      '把兴趣变成果：一项兴趣做出可展示作品（作品/账号/演讲/小产品）。',
      '明确边界：支持探索，但要有时间预算与规则（不影响底线）。'
    ],
    高级阶段: [
      '用测评/反馈帮助自我认知：优势-短板-价值观-适合环境。',
      '做“天赋×技能堆叠”：在优势上叠加表达/写作/AI工具等通用技能。',
      '为差异化路径做资源匹配：导师/社群/活动/比赛/项目。'
    ],
    优秀阶段: [
      '形成长期路径：季度目标→项目→作品→展示→反馈→迭代。',
      '训练独立判断：让孩子写“我的原则清单”（交友/消费/时间）。',
      '把独特优势对接真实世界：实习/志愿/创业小项目/竞赛赛道。'
    ]
  },

  幸福力: {
    初步探索: [
      '先做“情绪命名”：孩子哭闹时先说出情绪（你是难过/委屈/生气）。',
      '每天10分钟高质量陪伴：不说教，只听他说。',
      '减少压制式语言：把“别哭”换成“我在，我们一起想办法”。'
    ],
    基础阶段: [
      '建立“情绪三步”：感受→表达→方案（先情绪后道理）。',
      '每周一次“压力复盘”：这周最难的是啥？你需要什么支持？',
      '家庭冲突用“暂停词”：谁情绪上来先暂停5分钟再谈。'
    ],
    进阶阶段: [
      '教一个调节方法：呼吸(4-4-6) / 写情绪日记 / 运动释放。',
      '把失败变成学习：发生后复盘“我学到了什么/下次怎么做”。',
      '建立“自我肯定证据库”：记录孩子做成的3件小事，反驳“我不行”。'
    ],
    高级阶段: [
      '固定家庭仪式感：周末散步/家庭电影/睡前分享，增强安全感。',
      '训练压力→行动：压力来了先做一个小行动（5分钟开始法）。',
      '建立沟通规则：不讽刺、不贴标签、不翻旧账。'
    ],
    优秀阶段: [
      '形成情绪机制：家庭情绪会议（每人说一个感受+一个需要）。',
      '把心理韧性系统化：目标-挑战-反馈-复盘循环。',
      '帮助孩子建立意义感：长期目标、对他人的贡献、价值感来源。'
    ]
  },

  家庭责任: {
    初步探索: [
      '从一条规则开始（作息/手机/家务），写下来并让全家签字。',
      '设一个最小家务：每天固定一项（收餐具/倒垃圾），坚持一周。',
      '减少命令式沟通：先说明原因与后果，再执行规则。'
    ],
    基础阶段: [
      '建立“家庭分工表”：谁负责什么、标准是什么、如何验收。',
      '每周一次家庭会议（15分钟）：问题→方案→分工→下周复盘。',
      '电子产品规则：时间+内容+场景（饭桌/睡前禁用）三要素。'
    ],
    进阶阶段: [
      '引入“奖惩与反馈”：做到奖励（积分/特权），违反有对应后果。',
      '让孩子参与决策与执行：提出方案→评估→执行→复盘。',
      '建立“家庭目标”：本月一个共同目标（运动/阅读/整理）。'
    ],
    高级阶段: [
      '规则稳定运行：减少临时决定，所有变更要提前说明并记录。',
      '做家庭财商：零花钱-预算-延迟满足-复盘（小额开始）。',
      '关系经营：每周一次一对一亲子时间（不谈成绩）。'
    ],
    优秀阶段: [
      '沉淀家风文化：家庭价值观、年度目标、家族故事与仪式。',
      '把孩子培养为“家庭合伙人”：能提案、执行、复盘、承担后果。',
      '建立长期系统：规则、沟通、分工、财商、关系经营五件套。'
    ]
  },

  谋生手段: {
    初步探索: [
      '先做未来意识：每周聊一次“这个世界需要什么能力/AI会替代什么”。',
      '从一个可变现技能开始：表达/写作/设计/编程/AI工具任选其一。',
      '让孩子做一次“成果展示”：哪怕只是一个小作品或分享。'
    ],
    基础阶段: [
      '规划一个小项目体验（1-2周）：做一个小工具/小内容/小作品。',
      '建立“技能证据”：作品、截图、链接、讲解视频（留档）。',
      '引导孩子接触真实世界：参观/访谈/志愿/社团项目任选其一。'
    ],
    进阶阶段: [
      '年度规划1-2个真实项目：有目标、有用户/观众、有反馈。',
      '能力组合：天赋方向 + 通用能力（表达/协作/AI工具）叠加。',
      '建立“个人简历雏形”：项目经历、作品、能力、证据。'
    ],
    高级阶段: [
      '形成作品集与持续输出：每月一个成果（产品/内容/比赛/项目）。',
      '获取真实反馈：用户/老师/同伴评价，迭代版本。',
      '做资源连接：导师、社群、比赛、实习机会，形成路径网络。'
    ],
    优秀阶段: [
      '建立个人发展资产包：作品集+简历+项目记录+推荐/反馈。',
      '把项目商业化思维加入：价值点、用户、定价/传播、迭代。',
      '长期赛道聚焦：在一个方向连续做3-6个月，形成护城河。'
    ]
  }
}

/** ===================== 接收 Assessment.vue 传值 ===================== */
const rawScores = route.query.scores ? JSON.parse(route.query.scores) : {}
const maxMapFromQuery = route.query.maxMap ? JSON.parse(route.query.maxMap) : null

/** 兜底：如果没传 maxMap，就按 30题/6维≈5题每维，满分=5*4=20 */
const fallbackMaxPerModule = 5 * 4

/** ===================== 结果结构（含客观评价+建议清单） ===================== */
const results = computed(() => {
  return MODULES.map((module) => {
    const raw = Number(rawScores?.[module] ?? 0)
    const max =
      maxMapFromQuery?.[module] != null
        ? Number(maxMapFromQuery[module])
        : fallbackMaxPerModule

    const score = toPercent(raw, max)
    const level = getLevel(score)
    const band = getBand(score)

    return {
      module,
      raw,
      max,
      score,
      level,
      comment: commentMap[module]?.[band] || '暂无评价',
      actions: actionMap[module]?.[level] || []
    }
  })
})

/** ===================== 雷达图 ===================== */
const radarRef = ref(null)
let chart = null

function renderChart() {
  if (!radarRef.value) return
  if (!chart) chart = echarts.init(radarRef.value)

  chart.setOption({
    tooltip: {},
    radar: {
      indicator: MODULES.map((m) => ({ name: m, max: 100 })),
      radius: '70%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: results.value.map((r) => r.score),
            name: '综合测评'
          }
        ]
      }
    ]
  })
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', () => chart && chart.resize())
})

watch(results, () => {
  // 当路由query变化导致results变动时，重绘
  renderChart()
})

function goUpgrade() {
  router.push('/upgrade-info')
}
</script>

<style scoped>
.result-page {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px 16px;
}
.title {
  margin: 0 0 12px;
  font-size: 20px;
}

/* 说明区 */
.desc {
  background: rgba(0, 0, 0, 0.03);
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 16px;
}
.desc ul {
  margin: 8px 0 0;
  padding-left: 18px;
}

/* 雷达图 */
.radar-wrap {
  margin: 16px 0 20px;
}
.radar {
  width: 100%;
  height: 360px;
}

/* 表格 */
.table table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  border-radius: 10px;
}
.table th,
.table td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  text-align: left;
  padding: 10px 10px;
  font-size: 14px;
  vertical-align: top;
}
.table th {
  background: rgba(0, 0, 0, 0.03);
}

/* 卡片区（图一风格：装饰） */
.cards {
  margin-top: 18px;
  display: grid;
  gap: 14px;
}
.module-card {
  border-radius: 14px;
  padding: 14px 14px 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.01));
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}
.module-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, rgba(60, 120, 255, 0.9), rgba(0, 200, 160, 0.9));
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}
.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(60, 120, 255, 0.08);
}
.comment {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.03);
  line-height: 1.55;
}
.guide-title {
  font-weight: 600;
  margin: 10px 0 6px;
}
.guide ul {
  margin: 0;
  padding-left: 16px;
}
.guide li {
  margin: 6px 0;
}

/* 底部按钮 */
.actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
.btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
</style>
