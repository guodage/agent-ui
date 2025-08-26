'use client'

import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'
import 'katex/dist/katex.min.css'

export default function TestLatexEnvPage() {
  // 测试LaTeX环境格式
  const testContent = `
# LaTeX环境格式测试

这个页面专门测试您发现的新LaTeX格式：\\begin{equation}...\\end{equation} 等环境格式。

## 标准equation环境

以下是使用LaTeX标准equation环境的公式，就像您提供的DOM元素中显示的格式：

\`\`\`
\\begin{equation}
E = mc^2
\\end{equation}
\`\`\`

## align环境测试

\`\`\`
\\begin{align}
\\nabla \\cdot \\vec{E} &= \\frac{\\rho}{\\epsilon_0} \\\\
\\nabla \\cdot \\vec{B} &= 0 \\\\
\\nabla \\times \\vec{E} &= -\\frac{\\partial \\vec{B}}{\\partial t} \\\\
\\nabla \\times \\vec{B} &= \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t}
\\end{align}
\`\`\`

## gather环境测试

\`\`\`
\\begin{gather}
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} \\\\
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
\\end{gather}
\`\`\`

## 混合格式对比测试

### 原来支持的格式

行内公式：\\( \\alpha + \\beta = \\gamma \\)

块级公式：
\\[ \\sum_{k=1}^n k = \\frac{n(n+1)}{2} \\]

### 新的环境格式

\`\`\`
\\begin{equation}
\\sum_{k=1}^n k = \\frac{n(n+1)}{2}
\\end{equation}
\`\`\`

### Markdown格式

$$\\sum_{k=1}^n k = \\frac{n(n+1)}{2}$$

## 嵌套环境测试

\`\`\`
\\begin{equation}
\\begin{split}
(x+y)^2 &= x^2 + 2xy + y^2 \\\\
&= (x+y)(x+y)
\\end{split}
\\end{equation}
\`\`\`
`

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">LaTeX环境格式测试</h1>
        
        {/* 渲染内容 */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <MarkdownRenderer>{testContent}</MarkdownRenderer>
        </div>

        {/* 原始内容显示 */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">原始内容:</h2>
          <pre className="rounded-lg bg-gray-100 p-4 text-sm overflow-x-auto whitespace-pre-wrap">
            {testContent}
          </pre>
        </div>
      </div>
    </div>
  )
}