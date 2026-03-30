<template>
  <div :style="wrapStyle">
    <!-- grain overlay -->
    <div :style="grainStyle" />


    <!-- ── INTRO ── -->
    <div v-if="phase === 'intro'" style="max-width:660px;margin:0 auto;padding:64px 24px 80px;animation:fadeUp .8s ease">
      <div style="font-size:11px;letter-spacing:4px;color:#d0ccc6;text-transform:uppercase;margin-bottom:28px">纳维明 NavMind AI · 父母罗盘</div>
      <h1 style="font-size:clamp(28px,5vw,44px);font-weight:700;line-height:1.25;color:#f5f0e8;margin-bottom:24px">
        你的孩子<br /><span style="color:#c0392b">2035年</span>会在哪里？
      </h1>
      <div style="width:48px;height:2px;background:#c0392b;margin-bottom:28px" />
      <p style="font-size:16px;line-height:1.9;color:#ccc;margin-bottom:14px">你的孩子今年12—18岁。</p>
      <p style="font-size:16px;line-height:1.9;color:#ccc;margin-bottom:14px">2035年，他/她22—27岁。那是第一个人生节点——职业确立、财富分化、阶层显形。</p>
      <p style="font-size:16px;line-height:1.9;color:#e8e8e0;margin-bottom:36px">这30道题，不测你的教育理念，它测你<strong>真实的行为</strong>——然后告诉你，那些行为正在把孩子推向哪个2035年画像。</p>
      <div style="background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.3);border-radius:8px;padding:18px 22px;margin-bottom:40px">
        <p style="font-size:13px;color:#e87c6a;margin:0;line-height:1.85">⚠️ 警告：这套题里有陷阱。你以为做对的事，可能恰恰是问题所在。<br />请如实作答——欺骗的只有你的孩子。</p>
      </div>
      <div style="display:flex;gap:32px;margin-bottom:44px;flex-wrap:wrap">
        <div v-for="[n,l] in [['30','道题'],['3','个部分'],['10','分钟']]" :key="l">
          <div style="font-size:32px;font-weight:700;color:#e8c97a">{{ n }}</div>
          <div style="font-size:11px;color:#d0ccc6;letter-spacing:2px;margin-top:4px">{{ l }}</div>
        </div>
      </div>
      <button @click="startQuiz" class="next-btn" style="background:#c0392b;color:#fff;border:none;border-radius:4px;padding:16px 40px;font-size:16px;cursor:pointer;font-family:inherit;letter-spacing:1px">
        开始测评 →
      </button>
    </div>

    <!-- ── SECTION BANNER ── -->
    <div v-if="showSectionBanner && sec" :style="{ position:'fixed', inset:0, background:sec.color, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:100, animation:'fadeUp .4s ease' }">
      <div style="font-size:11px;letter-spacing:5px;color:rgba(255,255,255,.6);text-transform:uppercase;margin-bottom:14px">{{ sec.label }}</div>
      <h2 :style="{ fontSize:'clamp(28px,6vw,52px)', fontWeight:700, color:'#fff', margin:0 }">{{ sec.title }}</h2>
      <p style="font-size:16px;color:rgba(255,255,255,.75);margin-top:16px;text-align:center;line-height:1.8">{{ sec.sub }}<br />{{ sec.sub2 }}</p>
    </div>

    <!-- ── QUIZ ── -->
    <div v-if="phase === 'quiz' && !showSectionBanner" :style="{ maxWidth:'720px', margin:'0 auto', padding:'40px 20px 80px', opacity: fadeIn ? 1 : 0, transition:'opacity .28s' }">
      <!-- progress bar -->
      <div style="margin-bottom:32px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:11px;color:#ccc;letter-spacing:3px;text-transform:uppercase">{{ sec?.label }} · {{ sec?.title }}</span>
          <span style="font-size:12px;color:#d0ccc6">{{ currentQ + 1 }} / {{ shuffledQuestions.length }}</span>
        </div>
        <div style="height:2px;background:rgba(255,255,255,.08);border-radius:1px">
          <div :style="{ height:'100%', background: sec?.accent || '#c0392b', width: progressPct + '%', transition:'width .4s ease', borderRadius:'1px' }" />
        </div>
      </div>

      <!-- section intro for first Q -->
      <div v-if="isNewSection && currentQ === 0" style="margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.06)">
        <div :style="{ fontSize:'11px', letterSpacing:'4px', color: sec.accent, textTransform:'uppercase', marginBottom:'8px' }">{{ sec.label }}</div>
        <h2 style="font-size:28px;font-weight:700;color:#f5f0e8;margin:0 0 8px">{{ sec.title }}</h2>
        <p style="margin:0;font-size:14px;color:#ccc">{{ sec.sub }}{{ sec.sub2 }}</p>
      </div>

      <div style="font-size:11px;letter-spacing:3px;color:#ccc;text-transform:uppercase;margin-bottom:16px">
        第 {{ q.id }} 题{{ q.section === 1 ? ' — 陷阱题' : q.section === 3 ? ' — 判决' : '' }}
      </div>
      <h3 style="font-size:clamp(18px,3vw,24px);font-weight:600;line-height:1.65;color:#f0ece0;margin-bottom:28px">{{ q.question }}</h3>

      <!-- options -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        <button
          v-for="opt in q.options" :key="opt.label"
          @click="handleSelect(opt)"
          :class="['opt-btn', selected?.label === opt.label ? 'opt-selected' : '', selected !== null && selected?.label !== opt.label ? 'opt-disabled' : '']"
          :style="{ display:'flex', alignItems:'flex-start', gap:'16px', padding:'16px 20px', background:'rgba(255,255,255,.02)', borderRadius:'6px', cursor: selected !== null && selected?.label !== opt.label ? 'not-allowed' : 'pointer', textAlign:'left', fontFamily:'inherit', color:'#e8e8e0' }"
        >
          <span :style="{ fontSize:'12px', fontWeight:700, color: selected?.label === opt.label ? '#e8c97a' : '#4a4a4a', minWidth:'20px', paddingTop:'2px', letterSpacing:'1px' }">{{ opt.label }}</span>
          <span style="font-size:15px;line-height:1.75">{{ opt.text }}</span>
        </button>
      </div>

      <!-- Section 1 trap reveal -->
      <div v-if="showReveal && q.section === 1 && q.reveal" style="background:rgba(192,57,43,.10);border:1px solid rgba(192,57,43,.38);border-radius:8px;padding:20px 22px;margin-bottom:24px;animation:fadeUp .4s ease">
        <div style="font-size:13px;font-weight:700;color:#e87c6a;margin-bottom:10px">⚠️ 陷阱揭示 · {{ q.revealTitle }}</div>
        <p style="font-size:14px;line-height:1.9;color:#d0ccc6;margin:0">{{ q.reveal }}</p>
      </div>

      <!-- Section 3 correct answer -->
      <div v-if="showReveal && q.section === 3 && q.verdict" style="background:rgba(41,128,185,.10);border:1px solid rgba(41,128,185,.38);border-radius:8px;padding:20px 22px;margin-bottom:24px;animation:fadeUp .4s ease">
        <div style="font-size:13px;font-weight:700;color:#5dade2;margin-bottom:10px">💡 {{ q.revealTitle }}</div>
        <p style="font-size:14px;line-height:1.9;color:#d0ccc6;margin:0">{{ q.verdict }}</p>
      </div>

      <!-- Section 2 dual fate -->
      <div v-if="selected && q.section === 2 && q.zhangmo" style="animation:fadeUp .4s ease;margin-bottom:24px">
        <!-- mirror -->
        <div v-if="q.isMirror" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:20px 22px">
          <div style="font-size:12px;letter-spacing:2px;color:#ccc;margin-bottom:12px;text-transform:uppercase">镜子</div>
          <p style="font-size:15px;line-height:1.9;color:#ccc;margin:0 0 8px">{{ q.zhangmo }}</p>
          <p style="font-size:15px;line-height:1.9;color:#e8c97a;margin:0;font-style:italic">{{ q.linchen }}</p>
        </div>
        <!-- dual path -->
        <div v-else style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.24);border-radius:8px;padding:16px 18px">
            <div style="font-size:11px;color:#e87c6a;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase">张默 · 2035</div>
            <p style="font-size:13px;line-height:1.8;color:#ccc;margin:0">{{ q.zhangmo }}</p>
          </div>
          <div style="background:rgba(39,174,96,.08);border:1px solid rgba(39,174,96,.24);border-radius:8px;padding:16px 18px">
            <div style="font-size:11px;color:#58d68d;letter-spacing:2px;margin-bottom:10px;text-transform:uppercase">林晨 · 2035</div>
            <p style="font-size:13px;line-height:1.8;color:#ccc;margin:0">{{ q.linchen }}</p>
          </div>
        </div>
      </div>

      <button v-if="selected" @click="handleNext" class="next-btn"
        :style="{ background: sec?.accent || '#c0392b', color:'#fff', border:'none', borderRadius:'4px', padding:'14px 36px', fontSize:'15px', cursor:'pointer', fontFamily:'inherit', animation:'fadeUp .3s ease' }">
        {{ currentQ + 1 >= shuffledQuestions.length ? '查看我孩子的2035年画像 →' : '下一题 →' }}
      </button>
    </div>

    <!-- ── RESULT ── -->
    <div v-if="phase === 'result'" style="max-width:820px;margin:0 auto;padding:60px 24px 80px;animation:fadeUp .8s ease">
      <div style="font-size:11px;letter-spacing:4px;color:#d0ccc6;text-transform:uppercase;margin-bottom:20px">测评结果 · 纳维明 NavMind AI</div>

      <!-- tagline -->
      <div style="background:rgba(255,255,255,.04);border-left:3px solid #e8c97a;padding:14px 18px;margin-bottom:32px;border-radius:0 6px 6px 0">
        <p style="font-size:14px;line-height:1.85;color:#ddd8d0;margin:0;font-style:italic">
          这不是给孩子打分，而是在判断：<strong style="color:#e8c97a">你的教育路径，能不能让孩子在AI时代真正独立立足。</strong>
        </p>
      </div>

      <!-- 5-tier bar -->
      <div style="margin-bottom:36px">
        <div style="display:flex;gap:3px;margin-bottom:20px">
          <div v-for="(tier, i) in tiers" :key="tier.label" style="flex:1;text-align:center">
            <div :style="{
              height:'6px', borderRadius:'3px', marginBottom:'6px',
              background: isTierActive(i) ? tier.color : 'rgba(255,255,255,.08)',
              boxShadow: isTierActive(i) ? '0 0 12px ' + tier.color + '88' : 'none',
              transition:'all .4s ease'
            }" />
            <div :style="{ fontSize:'11px', color: isTierActive(i) ? tier.color : '#bbb', letterSpacing:'1px', fontWeight: isTierActive(i) ? 700 : 500 }">
              {{ tier.label }}
            </div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:20px">
          <div style="flex-shrink:0;text-align:center">
            <div :style="{
              width:'90px', height:'90px', borderRadius:'50%',
              background: verdict.color + '14',
              border: '3px solid ' + verdict.color,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              boxShadow: '0 0 24px ' + verdict.color + '55'
            }">
              <div :style="{ fontSize:'28px', fontWeight:700, color: verdict.color, lineHeight:1 }">{{ totalScore }}</div>
              <div style="font-size:13px;color:#fff;font-weight:600;margin-top:3px;letter-spacing:0.5px">/ 120分</div>
            </div>
            <div :style="{
              marginTop:'10px', fontSize:'11px', fontWeight:700,
              color: verdict.survivalColor,
              background: verdict.survivalColor + '1a',
              border: '1px solid ' + verdict.survivalColor + '55',
              borderRadius:'20px', padding:'3px 10px',
              letterSpacing:'0.5px', whiteSpace:'nowrap'
            }">{{ verdict.survivalLabel }}</div>
          </div>
          <div style="padding-top:4px">
            <div :style="{ fontSize:'11px', letterSpacing:'3px', color: verdict.color, textTransform:'uppercase', marginBottom:'8px' }">{{ verdict.label }}</div>
            <h2 style="font-size:clamp(17px,3.5vw,26px);font-weight:700;color:#f5f0e8;margin:0;line-height:1.4">{{ verdict.title }}</h2>
          </div>
        </div>
      </div>
      <div :style="{ width:'48px', height:'2px', background: verdict.color, marginBottom:'32px' }" />

      <!-- score meaning -->
      <div :style="{ background:'rgba(255,255,255,.02)', border:'1px solid ' + verdict.survivalColor + '33', borderRadius:'8px', padding:'14px 18px', marginBottom:'20px', display:'flex', alignItems:'flex-start', gap:'12px' }">
        <div style="font-size:20px;flex-shrink:0;margin-top:1px">📊</div>
        <p style="font-size:13px;line-height:1.85;color:#ccc;margin:0">
          <strong :style="{ color: verdict.survivalColor }">{{ verdict.survivalLabel }}</strong>
          <br />{{ verdict.survivalDesc }}
        </p>
      </div>

      <!-- portrait -->
      <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:26px 24px;margin-bottom:20px">
        <div style="font-size:11px;letter-spacing:3px;color:#d0ccc6;text-transform:uppercase;margin-bottom:18px">{{ verdict.tag }}</div>
        <p v-for="(line, i) in verdict.portrait" :key="i"
          :style="{ fontSize:'15px', lineHeight:1.9, color: i === verdict.portrait.length - 1 ? '#e8c97a' : '#b8b4ad', margin:'0 0 10px', fontStyle: i === verdict.portrait.length - 1 ? 'italic' : 'normal' }">
          {{ line }}
        </p>
      </div>

      <!-- reversible -->
      <div style="background:rgba(232,201,122,.06);border:1px solid rgba(232,201,122,.25);border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="font-size:13px;line-height:1.85;color:#ddd8d0;margin:0">{{ verdict.reversible }}</p>
      </div>

      <!-- must-do -->
      <div :style="{ background: verdict.color + '0e', border:'1px solid ' + verdict.color + '44', borderRadius:'8px', padding:'14px 20px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'14px' }">
        <div :style="{ fontSize:'11px', letterSpacing:'2px', color: verdict.color, textTransform:'uppercase', whiteSpace:'nowrap', flexShrink:0 }">必做动作</div>
        <div :style="{ width:'1px', height:'32px', background: verdict.color + '44', flexShrink:0 }" />
        <p style="font-size:14px;font-weight:600;color:#e8e8e0;margin:0;line-height:1.6">{{ verdict.mustDo }}</p>
      </div>

      <!-- weakness + strength -->
      <div style="display:grid;grid-template-columns:1.1fr .9fr;gap:16px;margin-bottom:20px">
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:22px 20px">
          <div style="font-size:11px;letter-spacing:3px;color:#d0ccc6;text-transform:uppercase;margin-bottom:16px">三项最薄弱维度</div>
          <div v-for="(item, i) in topWeakness" :key="item.key" style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:#ccc">{{ i + 1 }}. {{ item.label }}</span>
              <span :style="{ fontSize:'12px', color: verdict.color }">{{ item.pct }}%</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px">
              <div :style="{ width: item.pct + '%', height:'100%', background: verdict.color, borderRadius:'2px' }" />
            </div>
          </div>
          <p style="margin:10px 0 0;font-size:12px;color:#d0ccc6;line-height:1.7">分值越低，越可能成为孩子未来的瓶颈。</p>
        </div>
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:22px 20px">
          <div style="font-size:11px;letter-spacing:3px;color:#d0ccc6;text-transform:uppercase;margin-bottom:16px">你已经做对的部分</div>
          <div v-for="(item, i) in topStrength" :key="item.key" style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:13px;color:#ccc">{{ i + 1 }}. {{ item.label }}</span>
              <span style="font-size:12px;color:#58d68d">{{ item.pct }}%</span>
            </div>
            <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px">
              <div :style="{ width: item.pct + '%', height:'100%', background:'#27ae60', borderRadius:'2px' }" />
            </div>
          </div>
          <p style="margin:10px 0 0;font-size:12px;color:#d0ccc6;line-height:1.7">真正的升级，不是全盘否定，而是保留对的，修正最致命的。</p>
        </div>
      </div>

      <!-- losses + action -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
        <div style="background:rgba(192,57,43,.07);border:1px solid rgba(192,57,43,.22);border-radius:10px;padding:22px 20px">
          <div style="font-size:11px;letter-spacing:3px;color:#e87c6a;text-transform:uppercase;margin-bottom:16px">你正在失去什么</div>
          <p v-for="(line, i) in verdict.losses" :key="i" style="margin:0 0 10px;font-size:13px;line-height:1.85;color:#d4cfc8">• {{ line }}</p>
        </div>
        <div style="background:rgba(39,174,96,.07);border:1px solid rgba(39,174,96,.22);border-radius:10px;padding:22px 20px">
          <div style="font-size:11px;letter-spacing:3px;color:#58d68d;text-transform:uppercase;margin-bottom:16px">现在必须做的事</div>
          <p style="margin:0;font-size:14px;line-height:1.9;color:#ddd8d0;font-weight:600">{{ verdict.mustDo }}</p>
        </div>
      </div>

      <!-- section scores -->
      <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:22px 20px;margin-bottom:20px">
        <div style="font-size:11px;letter-spacing:3px;color:#d0ccc6;text-transform:uppercase;margin-bottom:16px">各部分得分</div>
        <div v-for="item in sectionScores" :key="item.label" style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:13px;color:#ccc">{{ item.label }}</span>
            <span style="font-size:13px;color:#ccc">{{ item.score }}/{{ item.max }}</span>
          </div>
          <div style="height:4px;background:rgba(255,255,255,.06);border-radius:2px">
            <div :style="{ width: Math.round(item.score / item.max * 100) + '%', height:'100%', background: verdict.color, borderRadius:'2px', transition:'width 1s ease' }" />
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div :style="{ background:'rgba(255,255,255,.025)', border:'1px solid ' + verdict.color + '44', borderRadius:'10px', padding:'22px', marginBottom:'28px' }">
        <p style="font-size:15px;line-height:1.9;color:#e4ddd4;font-style:italic;margin:0 0 10px">{{ verdict.cta }}</p>
        <p style="margin:0;font-size:13px;line-height:1.85;color:#ccc">真正拉开差距的，不是你比别的家长更焦虑，而是你能不能更早升级认知、修正路径，把资源投到真正有杠杆的地方。AI时代的教育窗口期，大约还有3—5年。</p>
      </div>

      <!-- footer -->
      <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:26px">
        <div style="font-size:11px;letter-spacing:3px;color:#d0ccc6;text-transform:uppercase;margin-bottom:12px">纳维明 NavMind AI</div>
        <p style="font-size:13px;color:#d0ccc6;line-height:1.85;margin:0 0 20px">纳维明 NavMind AI 旗下「父母罗盘」——AI时代家庭重大决策系统。先校准家长判断，再识别孩子真实方向，再给出可执行路径。</p>
        <div style="display:flex;gap:14px;flex-wrap:wrap">
          <button @click="resetAll" style="background:transparent;color:#ccc;border:1px solid rgba(255,255,255,.1);border-radius:4px;padding:10px 24px;font-size:13px;cursor:pointer;font-family:inherit">重新测评</button>
          <a href="/club.html" target="_blank" :style="{ background: verdict.color, color:'#fff', borderRadius:'4px', padding:'10px 24px', fontSize:'13px', cursor:'pointer', fontFamily:'inherit', textDecoration:'none', display:'inline-block', fontWeight:600 }">获取完整决策方案 →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// ─── DATA ────────────────────────────────────────────────────────────────────

const questions = [
  { id:1, section:1, axis:'monitoring', question:'你每天会问孩子「作业做完没？今天考了多少分？」吗？', options:[{label:'A',text:'每天都问，这是关心的表现',score:0},{label:'B',text:'经常问，但不是每天',score:1},{label:'C',text:'偶尔问，主要看孩子状态',score:3},{label:'D',text:'很少问，我更关注他的状态和想法',score:4}], revealTitle:'你盯住的是结果，却可能丢掉了发动机', reveal:'每日成绩追问是孩子为你学习、而不是为自己学习的最大推手。被高频监控成绩的孩子，失去外部监督的第一年崩溃率是其他孩子的3倍。你越问，孩子越空心。' },
  { id:2, section:1, axis:'oldMap', question:'你为孩子规划好了升学路径吗？（初中→重点高中→985→考公/大厂）', options:[{label:'A',text:'非常清晰，已经规划好了',score:0},{label:'B',text:'大方向有，细节还没定',score:1},{label:'C',text:'有想法，但尊重孩子意见',score:3},{label:'D',text:'没有固定规划，保持开放随时调整',score:4}], revealTitle:'你拿着一张2010年的地图，给孩子导航2035年', reveal:'你的规划基于一个正在消失的世界。大厂裁员潮中受冲击最大的，恰恰是「按路径走」的名校毕业生。你规划得越清晰，孩子撞墙就越疼——因为那堵墙，你根本没见过。' },
  { id:3, section:1, axis:'aiReadiness', question:'孩子用AI工具（ChatGPT / Kimi / 文心）写作业，你怎么看？', options:[{label:'A',text:'坚决禁止，这是作弊，影响基础',score:0},{label:'B',text:'不太支持，担心影响独立思考',score:1},{label:'C',text:'允许，但要求自己先独立思考',score:3},{label:'D',text:'鼓励，并教他如何更高效地使用',score:4}], revealTitle:'你禁止的，是他未来的核心立足技能', reveal:'2035年的职场，AI协作能力是入场门槛，不是加分项。禁止孩子用AI，相当于1995年禁止孩子用计算器。会用AI的人，将管理不会用AI的人。' },
  { id:4, section:1, axis:'drive', question:'孩子成绩中等，但对做视频/写代码/做生意非常着迷。你的态度？', options:[{label:'A',text:'先把成绩搞上去，其他都是玩',score:0},{label:'B',text:'可以玩，但不能耽误学习',score:1},{label:'C',text:'认真了解他在做什么，评估潜力',score:3},{label:'D',text:'积极支持，帮他找资源和导师',score:4}], revealTitle:'你正在扑灭AI时代最稀缺的东西——真实驱动力', reveal:'你描述的那个孩子，在AI时代是稀缺品——他有真实的驱动力，有具体的方向感。「先把成绩搞上去」可能正在扑灭一个创造者的火苗。内驱力一旦被系统性压制，很难复燃。' },
  { id:5, section:1, axis:'stabilityIllusion', question:'如果孩子考进了体制内（公务员/教师编/国企），你会松一口气，觉得「终于稳了」吗？', options:[{label:'A',text:'会，这正是我最希望的结果',score:0},{label:'B',text:'基本满意，至少有保障',score:1},{label:'C',text:'稳定是好事，但我也希望他有其他能力',score:3},{label:'D',text:'不会，稳定从来不是终点，只是起点之一',score:4}], revealTitle:'上一代人也以为铁饭碗是铁的', reveal:'1990年代，数千万国企工人在中年失业——他们进厂时，没有一个人相信这会发生。今天，AI正在对公务员、教师、医生、律师做同样的事。财政收入持续收缩，体制编制只会越来越少。「稳定」不是终点，是起跑线。如果孩子只有一张入场券，没有持续创造价值的能力，那张券失效的那天，他拿什么重新开始？' },
  { id:6, section:2, axis:'agency', question:'孩子放学后有两小时自由时间。你通常怎么安排？', options:[{label:'A',text:'报了补习班/兴趣班，时间基本排满',score:0},{label:'B',text:'让他自己选，但会建议方向',score:2},{label:'C',text:'完全自主，他想做什么做什么',score:3},{label:'D',text:'和他一起讨论，帮他建立自己的计划',score:4}], zhangmo:'课余被排满，成绩稳定。但25岁的张默，在某公司做基础数据分析，月薪9000元。他能完成任务，但从不主动。他从来没有学会「自己决定做什么」——因为从来没人给他练习的机会。', linchen:'那两小时试过很多事，多数没坚持。但有一件事坚持了三年。25岁的林晨，那件事成了他的第一个产品。没有人规定他做，所以他做了；没有人替他负责，所以他认真了。' },
  { id:7, section:2, axis:'realWorld', question:'孩子说想创业——做一个学生互助的小程序。你的反应？', options:[{label:'A',text:'先好好学习，这些以后再说',score:0},{label:'B',text:'想法不错，但现在不是时候',score:1},{label:'C',text:'有兴趣的话周末可以研究',score:2},{label:'D',text:'好！需要什么资源，我们一起想办法',score:4}], zhangmo:'张默的想法被推迟了，他后来没再提。25岁，他偶尔想起那个点子，发现市面上已经有人做了，做得很大。他沉默了很久。', linchen:'林晨的小程序做出来了，用户只有几十个同学。但他学会了产品逻辑、用户反馈、快速迭代——这三样，是任何商学院教不完整的。那是他25岁简历上最重的一行。' },
  { id:8, section:2, axis:'resilience', question:'孩子期末考试排名下滑15名。你第一步做什么？', options:[{label:'A',text:'马上联系老师，安排补课',score:0},{label:'B',text:'严肃谈话，要求下学期必须回来',score:1},{label:'C',text:'先和孩子聊聊，他自己怎么看',score:3},{label:'D',text:'观察一段时间，看他是否能自己调整',score:4}], zhangmo:'张默被安排补课，成绩回来了。但他学到的是：失败=等待外部干预。25岁，第一次被裁员，他在家待了8个月——不是因为找不到工作，而是因为不知道怎么自己站起来。', linchen:'林晨和父母谈了一小时，他说那段时间在专注做一个项目，分心了。父母说：那你自己决定，值不值得。林晨决定了，也承担了。25岁，遇到挫折的第一反应是：「我来复盘一下。」' },
  { id:9, section:2, axis:'thinking', question:'老师反映：孩子「上课爱提问，有时质疑老师的说法」。你怎么回应？', options:[{label:'A',text:'告诉孩子：课堂上要尊重老师，有问题下课问',score:0},{label:'B',text:'跟老师解释，孩子好奇心强',score:1},{label:'C',text:'表扬孩子，同时教他表达方式更成熟',score:3},{label:'D',text:'直接告诉孩子：继续，有想法就说出来',score:4}], zhangmo:'张默学会了闭嘴。他的问题越来越少。25岁在会议室里，永远是最后一个发言的人——不是没有想法，是太习惯等待被允许开口了。', linchen:'林晨25岁时，团队说他最厉害的能力是：永远在问「为什么要这么做」。这个问题，AI永远不会主动问。它是人类在AI时代最后的护城河之一。' },
  { id:10, section:2, axis:'stabilityIllusion', question:'孩子努力备考公务员，上岸成功。你认为这个选择的长期价值有多稳固？', options:[{label:'A',text:'非常稳，进了体制就是铁饭碗',score:0},{label:'B',text:'相对稳，至少比大多数人强',score:1},{label:'C',text:'短期稳，但我也担心长期风险',score:3},{label:'D',text:'这只是起点，他还需要持续建立不可替代的能力',score:4}], zhangmo:'张默28岁上岸，月薪6800元，父母安心了。但AI政务系统正在替代大量审批、文书、数据处理岗位，他所在部门开始精简编制。他没有市场化经验，没有副业，没有可迁移技能。37岁，他第一次意识到：自己像极了当年下岗前的父亲——那时父亲也觉得工厂不会倒。', linchen:'林晨也考了公务员，上岸了。但父母同时帮他保持了一个学习习惯和一个持续输出的方向。他25岁进体制，35岁时所在部门精简——他用三个月完成了平稳切换，因为他从没停止建立「可以带走的能力」。' },
  { id:11, section:2, axis:'riskView', question:'孩子说不想上大学，想直接去一家AI创业公司实习。你怎么看？', options:[{label:'A',text:'绝对不行，没有文凭什么都做不了',score:0},{label:'B',text:'先考完大学，以后再闯也不迟',score:1},{label:'C',text:'认真听他讲这家公司，一起分析利弊',score:3},{label:'D',text:'支持探索，提前进入真实战场有价值',score:4}], zhangmo:'张默上了大学。四年后毕业，那家公司已经是独角兽，早期实习生持有期权。不是说放弃大学是对的——而是那扇窗只开了一次，它关闭时没有任何声音。', linchen:'林晨和父母认真谈了三次。决定：休学一年，设定清晰里程碑，一年后重新评估。那一年，他没有后悔过。他带着真实的战场经验回来了，和那些刚进大学的同学，已经不在同一个维度。' },
  { id:12, section:2, axis:'support', question:'孩子迷上了你完全不懂的领域（Web3、AI绘画、独立游戏开发……）。你怎么做？', options:[{label:'A',text:'这些都是泡沫/玩具，让他别浪费时间',score:0},{label:'B',text:'不反对，但不鼓励，等他自己失去兴趣',score:1},{label:'C',text:'让他给你讲，你认真听',score:3},{label:'D',text:'一起研究，帮他找这个领域的圈子和导师',score:4}], zhangmo:'张默那个方向的热情慢慢冷却。他从来没有深挖过任何一个领域。25岁，他什么都懂一点，什么都不精——在AI时代，这是最危险的能力结构。', linchen:'林晨的父母到现在也没完全搞懂他做的是什么。但他们认真听他讲，帮他找到了一个圈子。父母不需要懂——他们需要的是托底，不是判断。那个圈子，后来是他最重要的资源网络。' },
  { id:13, section:2, axis:'valueCreation', question:'孩子在网上接了一个单，帮人做PPT，赚了200元。你的态度？', options:[{label:'A',text:'这点小钱耽误学习，不值当',score:0},{label:'B',text:'可以，但别上瘾，学习还是第一',score:1},{label:'C',text:'肯定他，顺带问问怎么接到的',score:3},{label:'D',text:'认真复盘：他赚的是什么能力的钱，能不能扩大',score:4}], zhangmo:'张默没把这件事当回事。25岁，领第一份工资时，才第一次感受到「我的能力换来了钱」。这个感受，本可以在16岁就建立。', linchen:'林晨把那200元的底层逻辑想清楚了。16岁开始接单，18岁月入过万，上大学时已有自己的第一批客户。那200元，是他商业认知的真正起点。' },
  { id:14, section:2, axis:'parentGrowth', question:'你有多久没专门研究过「AI对未来职业的影响」？', options:[{label:'A',text:'从来没有专门研究过',score:0},{label:'B',text:'偶尔看过一两篇文章',score:1},{label:'C',text:'最近三个月内认真研究过',score:3},{label:'D',text:'持续关注，是我重要的学习课题',score:4}], zhangmo:'张默的父母不知道孩子应该往哪走，只知道「好好学习」是对的。他们给孩子的，是一张没有更新过的地图。地图越旧，孩子走得越偏——但大家都不知道，直到走远了。', linchen:'林晨的父母不是专家，但他们知道方向在哪，知道哪些技能正在涨价，哪些正在贬值。他们给孩子的不是答案，是视野。视野，决定了孩子能看见的机会的范围上限。' },
  { id:15, section:2, axis:'eliteCareerIllusion', question:'孩子想学医/法律/会计——你认为这类「高壁垒精英职业」足以抵御未来的冲击吗？', options:[{label:'A',text:'绝对稳，这些职业AI很难替代',score:0},{label:'B',text:'大部分还是安全的，局部会受影响',score:1},{label:'C',text:'会有冲击，但核心部分仍有价值',score:3},{label:'D',text:'任何职业都必须叠加AI协作能力才能不被边缘化',score:4}], zhangmo:'张默学了医，六年苦读。25岁进入某三甲医院影像科。但AI诊断系统的准确率已超越大多数住院医生，科室编制持续压缩。他用六年学会的判断，机器3秒完成。他不知道该如何回应这个变化——因为他从来没有学过如何与AI协作。', linchen:'林晨也学了医。但他在实习期就开始研究临床AI系统，与技术团队合作开发辅助诊断工具。25岁，他不只是医生，还是医疗AI场景的设计参与者之一。同样的起点，不同的叠加——他成为了使用工具的人，而不是被工具替代的人。' },
  { id:16, section:2, axis:'communication', question:'孩子愿意跟你聊他真实的想法吗？', options:[{label:'A',text:'不太愿意，一聊学习他就沉默',score:0},{label:'B',text:'有时候聊，但不深入',score:1},{label:'C',text:'基本愿意，但敏感话题会回避',score:3},{label:'D',text:'非常愿意，我们有真实的对话',score:4}], zhangmo:'张默的父母不知道孩子在想什么。他们在做决策，但手里没有数据。25岁的张默，和父母的关系是：礼貌的陌生人。他们以为这很正常。', linchen:'林晨的父母知道他真实的困惑和渴望。每个关键决定，都建立在真实对话上，而不是单方面的判断。这种信息优势，让他们做的每个教育决策都准确了一个维度。' },
  { id:17, section:2, axis:'resilience', question:'孩子失败了（比赛落选、项目夭折、被拒绝）。你的第一句话通常是？', options:[{label:'A',text:'「我早说了吧」/「早听我的就好了」',score:0},{label:'B',text:'「没事的，下次努力」（安慰为主）',score:1},{label:'C',text:'「说说看，发生了什么？你怎么看这件事？」',score:3},{label:'D',text:'「好，我们来复盘，这次学到了什么」',score:4}], zhangmo:'张默学会了：失败=难受，然后翻篇。他从来没学会从失败里提取价值。在AI时代，迭代速度决定成败——而迭代，需要从失败里学习。', linchen:'林晨25岁说过一句话：「我创业失败过两次，那是我最贵的两次MBA。」失败是数据，不是审判——但这个认知，是父母在他失败时一次次塑造的。' },
  { id:18, section:2, axis:'thinking', question:'你愿意在孩子面前承认自己不懂、做错了、或者改变主意吗？', options:[{label:'A',text:'很少，父母要有权威感',score:0},{label:'B',text:'偶尔，但通常选择岔开话题',score:1},{label:'C',text:'愿意，小事上会承认',score:3},{label:'D',text:'完全愿意，我就是他面前活的成长样本',score:4}], zhangmo:'张默学到的榜样是：权威不被质疑，错误需要掩盖。进入职场后，他从不敢在领导面前说「我不知道」。在AI时代，「我不知道，我来学」是最宝贵的能力。', linchen:'林晨从父母身上学到了：承认不懂，是学习的起点。这个习惯，让他在AI时代的学习速度是周围同龄人的三倍。他不怕问蠢问题，因为父母从没让他觉得这丢人。' },
  { id:19, section:2, axis:'realWorld', question:'你有没有带孩子参与过真实的商业活动？（不是课堂模拟）', options:[{label:'A',text:'没有，他还小，这些以后再说',score:0},{label:'B',text:'带他见过一些场合，但没有参与',score:1},{label:'C',text:'偶尔让他参与家里的商业决策讨论',score:3},{label:'D',text:'有意识地创造机会，让他接触真实商业',score:4}], zhangmo:'张默22岁大学毕业，第一次进真实职场，一切都是陌生的。不是能力不够，是「真实感」太陌生。他花了三年才找到感觉。那三年，是最贵的学费。', linchen:'林晨15岁就旁听过真实的商业谈判，哪怕只是端茶倒水。他感受到了「真实决策」的气场。那种感受，任何模拟课程给不了。22岁进职场时，他不需要适应期。' },
  { id:20, section:2, axis:'futureGoal', question:'现在，想象你的孩子25岁。你最希望他是什么状态？', options:[{label:'A',text:'在一家稳定公司，有固定收入，生活规律',score:0},{label:'B',text:'已找到职业方向，正在成长中',score:2},{label:'C',text:'有自己在做的事，不一定大，但有激情',score:3},{label:'D',text:'有一定财务自由度，在做自己真正想做的事',score:4}], zhangmo:'你选的是你的期望。', linchen:'但你前19道题的选择，决定的是你孩子真实的概率。你的期望，和你的行为，一致吗？', isMirror:true },
  { id:21, section:3, axis:'communication', question:'过去一年，你和孩子认真讨论过多少次「他的未来方向」——不是催促，是真正的探讨？', options:[{label:'A',text:'几乎没有，日常都在催学习',score:0},{label:'B',text:'有过，但不成体系',score:1},{label:'C',text:'每月至少一次深度谈话',score:3},{label:'D',text:'这是持续议题，我们一直在共同校准',score:4}], revealTitle:'✅ 正确的做法是', verdict:'每月至少一次非说教式深度对话——不问「成绩怎么样」，而问「你最近在思考什么、对什么感兴趣、有什么卡住的地方」。孩子25岁时的方向感，是从16岁时一次次认真谈话中积累出来的，而不是靠催促。' },
  { id:22, section:3, axis:'parentGrowth', question:'你最近一次「为了更好支持孩子未来」而主动系统性学习，是什么时候？', options:[{label:'A',text:'想不起来了',score:0},{label:'B',text:'看过一些文章，没有系统学习',score:1},{label:'C',text:'最近三个月内有认真学习',score:3},{label:'D',text:'持续在学，这是我的优先项',score:4}], revealTitle:'✅ 正确的做法是', verdict:'把「升级自己的教育认知」当成刚需，而不是偶发行为。父母给孩子的所有建议，质量上限取决于父母自己的认知版本。你的判断系统，比你为孩子花的钱，更决定孩子的方向质量。' },
  { id:23, section:3, axis:'investment', question:'教育投资中，「标准路径」（补课/竞赛/考级）vs「非标能力」（AI技能/创业体验/跨界圈子）的比例？', options:[{label:'A',text:'标准路径占95%+，非标准几乎为零',score:0},{label:'B',text:'标准为主，非标准偶尔尝试',score:1},{label:'C',text:'大概各一半',score:3},{label:'D',text:'非标准能力投入比标准路径更多',score:4}], revealTitle:'✅ 正确的做法是', verdict:'有意识地把至少30%的教育资源投向「未来稀缺能力」——AI协作、真实项目经验、高质量圈层连接。标准路径负责保底，非标准能力负责跃迁。只做标准路径，等于重仓一个正在贬值的资产。' },
  { id:24, section:3, axis:'agency', question:'孩子有没有一件「他真正做主、从头到尾负责」的真实项目——不是学校作业？', options:[{label:'A',text:'没有，他还没到那个阶段',score:0},{label:'B',text:'有过，但都是小事，没当回事',score:1},{label:'C',text:'有一两件，我们支持他做完了',score:3},{label:'D',text:'这是我刻意创造的，他有自己的「战场」',score:4}], revealTitle:'✅ 正确的做法是', verdict:'给孩子搭建一个安全但真实的「战场」——哪怕只是一个小产品、一次活动策划、一个小买卖。主动性不是说教出来的，是一次次被允许负责、被允许失败练出来的。没有这个过程，25岁的执行力再强，也缺少领导力的底层代码。' },
  { id:25, section:3, axis:'thinking', question:'当孩子和你意见相左时，你们通常怎么解决？', options:[{label:'A',text:'我来决定，我经验更多',score:0},{label:'B',text:'我说服他，让他理解我的逻辑',score:1},{label:'C',text:'我们各说理由，一起找更好的答案',score:3},{label:'D',text:'如果他有充分理由，我愿意被他说服',score:4}], revealTitle:'✅ 正确的做法是', verdict:'创造让孩子「通过充分理由赢得父母」的机会。这个过程在训练他最关键的能力——独立判断、有效表达、说服他人。一个从未赢过父母辩论的孩子，未来更难在职场、商场中挑战比自己强的对手。' },
  { id:26, section:3, axis:'drive', question:'你对孩子的期望，是你们共同建立的，还是你单方面设定后他「认可」的？', options:[{label:'A',text:'我设定，他不认可，我们经常摩擦',score:0},{label:'B',text:'我设定，他表面认可，但我不确定内心',score:1},{label:'C',text:'我们有共识，虽然细节有分歧',score:3},{label:'D',text:'期望是我们共同建立的，他有真正的所有权感',score:4}], revealTitle:'✅ 正确的做法是', verdict:'以孩子真实的驱动力为起点，共同构建期望，而不是父母设定后让孩子接受。孩子对「自己参与定义的未来」会有本质不同的投入度。他在完成自己的剧本，还是完成你的剧本，结果天壤之别。' },
  { id:27, section:3, axis:'support', question:'如果孩子今天告诉你要做一件你完全不懂的事，你的第一反应是？', options:[{label:'A',text:'这个我不了解，先别冒险',score:0},{label:'B',text:'让我先研究研究，确认安全再说',score:1},{label:'C',text:'你讲给我听，我努力理解',score:3},{label:'D',text:'你比我更懂这件事，我来给你托底',score:4}], revealTitle:'✅ 正确的做法是', verdict:'父母的角色不是「看懂了才支持」，而是「划清底线，托底探索」。AI时代最大的财富机会，将持续出现在父母完全不懂的领域。如果孩子每次都要等你理解才能行动，他将永远错过指数级变化里最前端的窗口。' },
  { id:28, section:3, axis:'security', question:'你认为孩子真正的「安全感」来自什么？', options:[{label:'A',text:'稳定的职业路径和体制保障',score:0},{label:'B',text:'名校文凭和专业技能',score:1},{label:'C',text:'强大的适应力和持续学习能力',score:3},{label:'D',text:'在任何环境下创造价值的能力和人脉网络',score:4}], revealTitle:'✅ 正确的做法是', verdict:'把「在任何环境下都能创造价值的能力」作为核心安全感来源来培养。位置会消失，学历会贬值，体制会收缩——但一个真正能解决问题、能与人协作、能快速迭代自己的人，在任何时代都不会没有出路。这不是读出来的，是做出来的。' },
  { id:29, section:3, axis:'midlifeRisk', question:'如果孩子35岁时，所在行业被AI大规模替代，你认为他现在是否在建立「重启能力」？', options:[{label:'A',text:'我没想过这个问题，那是很遥远的事',score:0},{label:'B',text:'想过，但不确定如何准备',score:1},{label:'C',text:'我有意识地帮他建立可迁移能力',score:3},{label:'D',text:'这是我现在最核心的培养目标之一',score:4}], revealTitle:'✅ 正确的做法是', verdict:'35岁中年失业，不是概率很低的悲剧——它正在成为AI时代的普遍剧本。医生、律师、会计、公务员，没有哪个行业是绝对安全的。现在最关键的事，是帮孩子建立「可迁移的底层能力」：持续学习力、AI协作能力、跨领域判断力、从零创造价值的能力。进入任何赛道，都必须同时安装这套「应急系统」。' },
  { id:30, section:3, axis:'mirror', question:'2035年，你的孩子回头看自己的成长，他会说哪句话？', options:[{label:'A',text:'「爸妈很爱我，但他们给的路不适合我那个时代」',score:0},{label:'B',text:'「爸妈努力了，有些对有些错，总体还好」',score:1},{label:'C',text:'「爸妈帮我找到了方向，虽然过程有争执」',score:3},{label:'D',text:'「爸妈是我最重要的战略伙伴，没有他们走不到今天」',score:4}], revealTitle:'✅ 正确的目标是', verdict:'成为孩子真正意义上的「战略伙伴」——不只是照顾者，而是能帮他看见方向、识别机会、做出关键决策的人。这不需要你无所不知，只需要你持续升级自己，并且真正尊重孩子的主体性。今天的每个选择，都在预测这个答案。', isFinal:true },
]

const sectionMeta = {
  1: { label:'第一部分', title:'镜子测试', sub:'你以为你做对了——', sub2:'但你真的做对了吗？', color:'#8f2d24', accent:'#c0392b' },
  2: { label:'第二部分', title:'命运分叉', sub:'两个孩子，起点相同，', sub2:'父母的每个选择，推向不同的2035。', color:'#5c245f', accent:'#9a53a2' },
  3: { label:'第三部分', title:'2035年判决', sub:'无论你选了什么——', sub2:'正确的做法是什么。', color:'#174d66', accent:'#2d82ab' },
}

const axisLabels = {
  monitoring:'成绩监控方式', oldMap:'教育路径认知', aiReadiness:'AI时代适配',
  drive:'内驱力保护', agency:'主动性培养', realWorld:'真实世界训练',
  resilience:'失败复盘能力', thinking:'独立判断力', support:'父母托底能力',
  valueCreation:'价值创造意识', parentGrowth:'家长自我升级', communication:'真实对话能力',
  investment:'教育投资结构', riskView:'机会风险判断', security:'安全感认知',
  midlifeRisk:'中年转型准备', futureGoal:'未来目标清晰度',
  stabilityIllusion:'稳定幻觉认知', eliteCareerIllusion:'精英职业误判', mirror:'镜像题',
}

const verdictLevels = [
  { range:[0,28], label:'极度危险', tag:'你孩子的2035年画像', title:'当前路径下，孩子在AI时代建立稳定谋生能力的概率极低', color:'#8b0000', survivalLabel:'谋生能力极度不足', survivalColor:'#c0392b', survivalDesc:'满分120分，当前分数区间（0–28分）意味着：孩子正在建立的能力结构，在AI替代浪潮下几乎没有抵御能力。这不是孩子的问题——是路径选错了。', reversible:'⚠️ 但这是可以改变的。路径调整越早，代价越小。大多数家庭通过系统性决策重构，可在6–12个月内完成跨档跃迁。', mustDo:'立即停止当前路径，重新评估整体教育方向', portrait:['2035年，他很努力，但方向从一开始就错了。他可能考进了一个「看起来安全」的赛道，却不知道那条赛道正在被AI系统性替代。','他有文凭，有证书，但缺少在环境变化时重新找到方向的能力。行业一旦收缩，他会发现自己没有备用的路——因为没有人在他最关键的成长期，训练过这件事。','最危险的不是他不够聪明，而是他不知道自己缺什么。'], losses:['孩子当前路径在AI时代的立足稳定性极低','内驱力与创造力的关键窗口期正在关闭','大量教育资源被投入正在加速贬值的方向'], cta:'窗口还没彻底关闭，但正在关闭。现在最关键的不是补更多课，而是重建整个决策系统。' },
  { range:[29,52], label:'高风险', tag:'你孩子的2035年画像', title:'立足稳定性极低——行业一旦波动，孩子极可能成为第一批出局的人', color:'#c0392b', survivalLabel:'谋生能力严重不足', survivalColor:'#e74c3c', survivalDesc:'满分120分，当前分数区间（29–52分）意味着：孩子具备一定基础，但在AI替代趋势下，这点基础不足以抵御真实的职业冲击。', reversible:'📌 这是可以改变的。你已经有一定基础，方向调整的成本相对可控。6–12个月的系统性路径修正，可以显著提升孩子的立足稳定性。', mustDo:'调整核心方向，补齐关键能力——越快越好', portrait:['2035年，他能找到工作，但他的岗位处于AI替代的高风险区。他做的事，机器做得更快、更便宜。他的价值，正在以他看不见的方式贬值。','他不是坏孩子，也不是懒孩子。他只是用了一套在旧时代有效、在新时代失效的立足逻辑。而这套逻辑，是你一步步帮他建立的。','35岁，他可能第一次意识到：他一直在努力，但努力的方向，从一开始就错了。'], losses:['孩子缺乏真正可迁移的核心能力','当前教育投资结构重仓了正在贬值的方向','孩子内驱力和项目经验的建立严重滞后'], cta:'你的孩子还有机会，但窗口正在收窄。现在不是微调的时候，是系统性重建的时候。' },
  { range:[53,75], label:'警戒线', tag:'你孩子的2035年画像', title:'勉强维系生计，随时面临失守风险——没有真正的安全边界', color:'#d35400', survivalLabel:'谋生能力薄弱，随时面临失守', survivalColor:'#e67e22', survivalDesc:'满分120分，当前分数区间（53–75分）意味着：孩子在风平浪静时尚能维持，但一旦所在行业受到AI冲击，极可能成为第一批被替代的人。', reversible:'📌 好消息是：你已经做对了一部分事情。这个分数区间的家庭，通过精准的路径优化，往往是提升最快的一组。', mustDo:'优化路径结构，重点补齐最薄弱的3个维度', portrait:['2035年，他在求职市场上处于高压区——既要面对AI系统的直接替代，又要面对大量同水平竞争者的挤压。他不一定找不到工作，但很可能长期处于「勉强维系生计」的状态。','他在30多岁可能感受到一种无力感：比上面的人努力，收入却在下滑；比下面的人资历深，却又不如AI高效。没有差异化的武器，就只能在夹缝里消耗。','这种处境，不是突然发生的——它在今天一个个教育决策里，就已经悄悄写好了。'], losses:['孩子处于「够用但不稀缺」的高危区间','缺乏真实项目经验，职场适应成本极高','能力结构过于标准化，差异化竞争力不足'], cta:'你的基础不差，这恰恰是最危险的地方——容易以为安全，却在不知不觉中被超越。' },
  { range:[76,95], label:'基础谋生 ✅', tag:'你孩子的2035年画像', title:'具备独立谋生能力，但尚无真正的安全边界——仍处于可替代风险的边缘', color:'#27ae60', survivalLabel:'✅ 具备基础谋生能力，仍在可替代边缘', survivalColor:'#2ecc71', survivalDesc:'满分120分，当前分数区间（76–95分）是本测评中首个「可谋生」档位。孩子具备基本谋生能力——这已好过大多数家庭，但「独立谋生」不等于「拥有安全边界」。', reversible:'📌 你已经做对了很多事。现在的关键不是从头开始，而是把现有优势系统化、放大化，真正建立不可替代的竞争壁垒。', mustDo:'放大现有优势，从「独立谋生」升级到「真正不可替代」', portrait:['2035年，他在就业市场上有一定竞争力，但「有竞争力」不等于「能找到好工作」。在AI大量替代的就业环境下，这个分数段的孩子仍面临真实的就业压力。','他比大多数人做了更多正确的事，但「正确」的标准也在快速抬高。他更可能成为「驾驭AI的那个人」——但这需要持续维护，不是一劳永逸。','现实是：即便到了这个分数，孩子依然没有真正的安全边界。这不是在否定你，而是在告诉你还剩多少路要走。'], losses:['从「基础谋生」到「真正不可替代」之间，还有一道必须跨越的坎','能力优势尚未系统化，在激烈竞争中容易被后来者追平','家庭资源还可以更精准地投向高杠杆位置'], cta:'你已经做对了很多。但在AI时代，「够用」是最危险的状态——因为「够用」的标准每年都在升高。' },
  { range:[96,120], label:'跃迁潜力 ✅', tag:'你孩子的2035年画像', title:'具备跨时代迁移能力——窗口期需要立即放大', color:'#f39c12', survivalLabel:'✅ 具备跨时代迁移能力', survivalColor:'#f1c40f', survivalDesc:'满分120分，当前分数区间（96–120分）意味着：孩子正在建立真正稀缺的核心能力，具备在任何环境下重新创造价值的底层系统——这是AI时代最贵的资产。', reversible:'🚀 你已经站在正确的位置上。现在最关键的事：立即进行路径放大——先行者的优势窗口，不等人。', mustDo:'立即放大路径优势，抢占窗口——先行者红利正在计时', portrait:['2035年，他不只靠一份岗位定义自己。他靠能力、项目、判断力和网络持续创造价值——在任何环境下。','当AI替代浪潮席卷他所在的行业，他不会想着保住位置，他会思考如何成为重组资源、定义新规则的那个人。','你给他最贵的礼物，不是某个稳定职位，而是一套在任何时代都能重新启动的底层能力系统。'], losses:['先行者优势的窗口期正在快速收窄，需要立即放大','高水平的优势如果不系统化，会随时间自然稀释','孩子的路径还需要更精准的赛道校准和资源匹配'], cta:'你已经不在普通教育思维里了。下一步，是把优势系统化，真正把孩子送入跃迁轨道——窗口期不等人。' },
]

// ─── STATE ───────────────────────────────────────────────────────────────────

const phase = ref('intro')
const currentQ = ref(0)
const selected = ref(null)
const showReveal = ref(false)
const answerRecords = ref([])
const totalScore = ref(0)
const fadeIn = ref(true)
const showSectionBanner = ref(false)

// ─── COMPUTED ────────────────────────────────────────────────────────────────

const q = computed(() => shuffledQuestions.value[currentQ.value])
const sec = computed(() => q.value ? sectionMeta[q.value.section] : null)
const isNewSection = computed(() =>
  currentQ.value === 0 || shuffledQuestions.value[currentQ.value - 1]?.section !== q.value?.section
)
const progressPct = computed(() => Math.round(((currentQ.value + 1) / shuffledQuestions.value.length) * 100))

const verdict = computed(() =>
  verdictLevels.find(v => totalScore.value >= v.range[0] && totalScore.value <= v.range[1]) || verdictLevels[0]
)

const evidenceMap = computed(() => {
  const map = {}
  answerRecords.value.forEach(({ axis, score }) => {
    if (!map[axis]) map[axis] = { score: 0, max: 0 }
    map[axis].score += score
    map[axis].max += 4
  })
  return map
})

const evidenceRank = computed(() =>
  Object.entries(evidenceMap.value)
    .filter(([key]) => key !== 'mirror' && key !== 'futureGoal')
    .map(([key, val]) => ({ key, label: axisLabels[key] || key, pct: Math.round((val.score / val.max) * 100) }))
    .sort((a, b) => a.pct - b.pct)
)

const topWeakness = computed(() => evidenceRank.value.slice(0, 3))
const topStrength = computed(() => [...evidenceRank.value].sort((a, b) => b.pct - a.pct).slice(0, 3))

const sectionScores = computed(() => [
  { label:'镜子测试（1-5题）', score: answerRecords.value.slice(0,5).reduce((a,r) => a+r.score, 0), max:20 },
  { label:'命运分叉（6-20题）', score: answerRecords.value.slice(5,20).reduce((a,r) => a+r.score, 0), max:60 },
  { label:'2035判决（21-30题）', score: answerRecords.value.slice(20,30).reduce((a,r) => a+r.score, 0), max:40 },
])

// ─── TIER BAR ────────────────────────────────────────────────────────────────

const tiers = [
  { label:'极度危险', color:'#8b0000' },
  { label:'高风险', color:'#c0392b' },
  { label:'警戒线', color:'#d35400' },
  { label:'基础谋生', color:'#27ae60' },
  { label:'跃迁潜力', color:'#f39c12' },
]
const tierRanges = [[0,28],[29,52],[53,75],[76,95],[96,120]]
const isTierActive = (i) => totalScore.value >= tierRanges[i][0] && totalScore.value <= tierRanges[i][1]

// ─── STYLES ──────────────────────────────────────────────────────────────────

const wrapStyle = {
  minHeight: '100vh',
  background: '#0a0a0f',
  color: '#e8e8e0',
  fontFamily: "Georgia, 'Songti SC', serif",
  position: 'relative',
  overflow: 'hidden',
}
const grainStyle = {
  position: 'fixed', inset: 0, opacity: 0.04, pointerEvents: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundSize: '150px',
}

// ─── METHODS ─────────────────────────────────────────────────────────────────

watch(currentQ, () => {
  if (phase.value === 'quiz' && isNewSection.value && currentQ.value > 0) {
    showSectionBanner.value = true
    setTimeout(() => { showSectionBanner.value = false }, 4400)
  }
})

const shuffledQuestions = ref([])

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function startQuiz() {
  // shuffle options for each question, reassign A/B/C/D labels
  shuffledQuestions.value = questions.map(q => ({
    ...q,
    options: shuffleArray(q.options).map((opt, i) => ({
      ...opt,
      label: ['A','B','C','D'][i]
    }))
  }))
  fadeIn.value = false
  setTimeout(() => { phase.value = 'quiz'; fadeIn.value = true }, 250)
}

function handleSelect(opt) {
  if (selected.value !== null) return
  selected.value = opt
  if (q.value.section === 1 || q.value.section === 3) showReveal.value = true
}

function handleNext() {
  const nextRecords = [...answerRecords.value, { axis: q.value.axis, score: selected.value.score }]
  fadeIn.value = false
  setTimeout(() => {
    answerRecords.value = nextRecords
    showReveal.value = false
    selected.value = null
    if (currentQ.value + 1 >= shuffledQuestions.value.length) {
      totalScore.value = nextRecords.reduce((s, r) => s + r.score, 0)
      phase.value = 'result'
    } else {
      currentQ.value++
    }
    fadeIn.value = true
  }, 280)
}

function resetAll() {
  phase.value = 'intro'
  currentQ.value = 0
  selected.value = null
  showReveal.value = false
  answerRecords.value = []
  totalScore.value = 0
  fadeIn.value = true
  shuffledQuestions.value = []
}
</script>

<style>
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
.opt-btn { transition: all .18s ease; border: 1px solid rgba(255,255,255,.10); }
.opt-btn:hover { border-color: rgba(255,255,255,.35); background: rgba(255,255,255,.05) !important; transform: translateX(4px); }
.opt-selected { border-color: #e8c97a !important; background: rgba(232,201,122,.08) !important; }
.opt-disabled { opacity: .42; cursor: not-allowed !important; }
.next-btn { transition: all .2s; }
.next-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.4); }
</style>
