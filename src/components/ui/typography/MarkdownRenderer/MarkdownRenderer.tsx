import { type FC } from 'react'
import ReactMarkdown from 'react-markdown'

import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import { cn } from '@/lib/utils'
import { preprocessLaTeX } from '@/lib/latex-preprocessor'

import { type MarkdownRendererProps } from './types'
import { inlineComponents } from './inlineStyles'
import { components } from './styles'

// Configure sanitize to allow KaTeX elements
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [
      ...(defaultSchema.attributes?.span || []),
      'className',
      'style',
      ['className', 'katex', 'katex-display', 'katex-mathml', 'katex-html']
    ],
    annotation: ['encoding'],
    math: ['xmlns'],
    semantics: [],
    mrow: [],
    mi: [],
    mo: [],
    msup: [],
    mn: []
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'math',
    'annotation',
    'semantics',
    'mtext',
    'mn',
    'mo',
    'mi',
    'mspace',
    'mover',
    'munder',
    'munderover',
    'msup',
    'msub',
    'msubsup',
    'mfrac',
    'mroot',
    'msqrt',
    'mtable',
    'mtr',
    'mtd',
    'mlabeledtr',
    'mrow',
    'menclose',
    'mstyle',
    'mpadded',
    'mphantom',
    'mglyph'
  ]
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  children,
  classname,
  inline = false
}) => {
  // 预处理 LaTeX 内容，将 \[...\] 和 \(...\) 转换为 Markdown 格式
  const processedContent = typeof children === 'string' 
    ? preprocessLaTeX(children) 
    : children

  return (
    <ReactMarkdown
      className={cn(
        'prose prose-h1:text-xl dark:prose-invert flex w-full flex-col gap-y-5 rounded-lg',
        classname
      )}
      components={{ ...(inline ? inlineComponents : components) }}
      remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
      rehypePlugins={[rehypeRaw, rehypeKatex, [rehypeSanitize, sanitizeSchema]]}
    >
      {processedContent}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
