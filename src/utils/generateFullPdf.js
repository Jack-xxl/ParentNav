
import jsPDF from 'jspdf'

export default function generatePdf(results) {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('育儿素养全面测评报告 - 九大模块建议摘要', 15, 20)
  let y = 30

  Object.entries(results).forEach(([mod, data], idx) => {
    doc.setFontSize(12)
    doc.text(`${idx + 1}. ${mod}`, 15, y)
    y += 8
    doc.setFontSize(10)
    doc.text(`评分：${data.score.toFixed(1)} / 5.0`, 15, y)
    y += 6
    doc.text(`建议：${data.advice}`, 15, y)
    y += 10
    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  doc.setFontSize(8)
  doc.text(`* 本报告为专属生成，仅限本人使用`, 15, 285)
  doc.save('parentnav_full_report.pdf')
}
