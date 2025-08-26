'use client'

import { useState } from 'react'
import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'
import 'katex/dist/katex.min.css'

export default function TestLatexPage() {
  // 测试内容包含各种LaTeX格式
  const markdownStyleContent = `
# Markdown风格的LaTeX公式测试

## 行内公式 (单个$符号)
这是一个行内公式：$E = mc^2$，这是著名的质能方程。

另一个行内公式：$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$

## 块级公式 (双$符号)
这是一个块级公式：

$$\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)$$

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$

## 矩阵公式
$$\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}$$
`

  const latexStyleContent = `
# LaTeX风格的公式测试

## LaTeX行内公式 (\\\\(...\\\\)格式)
这是ChatGPT/DeepSeek常用的行内格式：\\\\(x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\\\)

另一个例子：\\\\(\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1\\\\)

## LaTeX块级公式 (\\\\[...\\\\]格式)
这是ChatGPT/DeepSeek常用的块级格式：

\\\\[\\int_{0}^{1} x^2 dx = \\frac{1}{3}\\\\]

\\\\[\\nabla \\times \\vec{F} = \\left( \\frac{\\partial F_z}{\\partial y} - \\frac{\\partial F_y}{\\partial z} \\right) \\hat{i} + \\left( \\frac{\\partial F_x}{\\partial z} - \\frac{\\partial F_z}{\\partial x} \\right) \\hat{j} + \\left( \\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y} \\right) \\hat{k}\\\\]

## 复杂公式示例
\\\\[\\begin{align}
\\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\vec{B} &= 0 \\\\
\\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\
\\nabla \\times \\vec{B} &= \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t}
\\end{align}\\\\]
`

  const mixedContent = `
# 混合格式测试

这段文本包含了各种不同的公式格式，测试预处理器的兼容性：

## 货币金额保护测试
这个产品价格是 $100，那个产品是 $299.99。这些金额符号不应该被误认为是LaTeX公式。

## 混合公式格式
Markdown格式：$a^2 + b^2 = c^2$

LaTeX格式：\\\\(\\alpha + \\beta = \\gamma\\\\)

块级公式：
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

\\\\[\\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = e^x\\\\]

## 代码块保护测试
这是一段代码，其中包含$符号：
\`\`\`javascript
const price = $100;
const latex = "\\\\(x^2 + y^2 = z^2\\\\)";
\`\`\`

行内代码：\`const formula = "$E = mc^2$";\`

## 代码块中的LaTeX公式测试
以下代码块包含LaTeX公式，应该被渲染为数学公式：

\`\`\`
爱因斯坦著名的质能等价公式是：

\\[ E = mc^2 \\]

其中：
- \\( E \\) 表示能量，
- \\( m \\) 表示质量，
- \\( c \\) 表示光速（在真空中约为 \\( 3 \\times 10^8 \\) 米每秒）。

这个公式表达了质量和能量之间的关系。
\`\`\`

另一个包含公式的代码块：

\`\`\`
麦克斯韦方程组：
\\[\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}\\]
\\[\\nabla \\cdot \\vec{B} = 0\\]
\`\`\`

## 化学公式测试
\\\\[\\ce{CO2 + C -> 2 CO}\\\\]

\\\\[\\pu{123 J}\\\\]
`

  const [activeTab, setActiveTab] = useState<'markdown' | 'latex' | 'mixed'>('markdown')

  const getContent = () => {
    switch (activeTab) {
      case 'markdown':
        return markdownStyleContent
      case 'latex':
        return latexStyleContent
      case 'mixed':
        return mixedContent
      default:
        return markdownStyleContent
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">LaTeX公式渲染测试</h1>
        
        {/* 标签切换 */}
        <div className="mb-6 flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-4 py-2 ${
              activeTab === 'markdown'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Markdown格式
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-4 py-2 ${
              activeTab === 'latex'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            LaTeX格式
          </button>
          <button
            onClick={() => setActiveTab('mixed')}
            className={`px-4 py-2 ${
              activeTab === 'mixed'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            混合格式
          </button>
        </div>

        {/* 渲染内容 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <MarkdownRenderer>{getContent()}</MarkdownRenderer>
        </div>

        {/* 原始内容显示 */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">原始内容:</h2>
          <pre className="rounded-lg bg-gray-100 p-4 text-sm overflow-x-auto">
            {getContent()}
          </pre>
        </div>
      </div>
    </div>
  )
}