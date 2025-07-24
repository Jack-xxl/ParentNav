import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * 生成 PDF：包含模块总结与建议、全部题目与解析
 *
 * @param {string} selector      容器的 CSS 选择器（PaidUpgradeInfo.vue 中的 #pdf-report-container）
 * @param {Array}  results       [{ dimension, score, level, suggestion }, …]
 * @param {Array}  fullQuestions 所有题目的数组，来源于 parentnav_questions.json
 */
export async function generatePdfFromElement(
  selector,
  results,
  fullQuestions
) {
  // 1. 截图
  const container = document.querySelector(selector)
  if (!container) return
  const canvas = await html2canvas(container, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')

  // 2. 新建 A4 PDF
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()

  // 3. 居中输出截图
  const props = pdf.getImageProperties(imgData)
  const ratio = props.width / props.height
  let imgW = pageW - 20, imgH = imgW / ratio
  if (imgH > pageH - 20) {
    imgH = pageH - 20
    imgW = imgH * ratio
  }
  pdf.addImage(imgData, 'PNG', (pageW - imgW) / 2, 10, imgW, imgH)

  let y = imgH + 15

  // 4. 模块总结与建议
  if (y > pageH - 30) { pdf.addPage(); y = 20 }
  pdf.setFontSize(16)
  pdf.text('📊 模块总结与建议', 10, y); y += 8
  pdf.setFontSize(12)
  results.forEach(r => {
    if (y > pageH - 20) { pdf.addPage(); y = 20 }
    pdf.text(`• ${r.dimension}：${r.score} 分 （${r.level}）`, 12, y); y += 6
    pdf.splitTextToSize(r.suggestion, pageW - 24).forEach(line => {
      if (y > pageH - 20) { pdf.addPage(); y = 20 }
      pdf.text(`  ${line}`, 14, y); y += 5
    })
    y += 4
  })

  // 5. 全部题目与解析
  if (y > pageH - 30) { pdf.addPage(); y = 20 }
  pdf.setFontSize(16)
  pdf.text('📘 全部题目与解析', 10, y); y += 8
  pdf.setFontSize(12)
  fullQuestions.forEach(q => {
    if (y > pageH - 40) { pdf.addPage(); y = 20 }
    pdf.text(`${q.id}. ${q.question}`, 12, y); y += 6
    q.options.forEach(opt => {
      if (y > pageH - 20) { pdf.addPage(); y = 20 }
      pdf.text(`- ${opt.label} （分值：${opt.value}）`, 14, y); y += 5
    })
    if (y > pageH - 30) { pdf.addPage(); y = 20 }
    pdf.splitTextToSize(`解析：${q.analysis}`, pageW - 24).forEach(line => {
      pdf.text(line, 12, y); y += 5
    })
    y += 8
  })

  // 6. 存盘
  pdf.save('report.pdf')
}
