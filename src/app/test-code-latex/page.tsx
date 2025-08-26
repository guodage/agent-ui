'use client'

import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'
import 'katex/dist/katex.min.css'

export default function TestCodeLatexPage() {
  // 测试代码块中包含LaTeX公式的内容
  const testContent = `
# 代码块中的LaTeX公式测试

这个页面专门测试代码块中包含LaTeX公式的情况，就像您提供的DOM元素中显示的那样。

## 包含LaTeX公式的代码块

以下是一个包含LaTeX公式的代码块，应该被自动检测并渲染为数学公式：

\`\`\`
爱因斯坦著名的质能等价公式是：

\\[ E = mc^2 \\]

其中：
- \\( E \\) 表示能量，
- \\( m \\) 表示质量，  
- \\( c \\) 表示光速（在真空中约为 \\( 3 \\times 10^8 \\) 米每秒）。

这个公式表达了质量和能量之间的关系，说明质量可以转化为能量，能量也可以转化为质量。
\`\`\`

## 另一个包含公式的代码块

\`\`\`
麦克斯韦方程组：

\\[\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0}\\]

\\[\\nabla \\cdot \\vec{B} = 0\\]

\\[\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}\\]

\\[\\nabla \\times \\vec{B} = \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t}\\]
\`\`\`

## 单个LaTeX公式在代码块中

\`\`\`
\\[\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}\\]
\`\`\`

## 行内LaTeX公式在代码块中

\`\`\`
质量能量关系：\\( E = mc^2 \\)
\`\`\`

## 普通代码块（应该保持不变）

\`\`\`javascript  
const message = "Hello World";
console.log(message);
\`\`\`

## 混合内容测试

这是正常文本，包含行内公式：\\( \\alpha + \\beta = \\gamma \\)

这是块级公式：
\\[\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}\\]
`

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">代码块LaTeX公式测试</h1>
        
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