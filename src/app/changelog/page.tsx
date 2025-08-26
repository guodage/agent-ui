import MarkdownRenderer from '@/components/ui/typography/MarkdownRenderer/MarkdownRenderer'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import Link from 'next/link'
import { readFileSync } from 'fs'
import { join } from 'path'
import 'katex/dist/katex.min.css'

// 读取CHANGELOG.md文件内容
function getChangelogContent() {
  try {
    const changelogPath = join(process.cwd(), 'CHANGELOG.md')
    const content = readFileSync(changelogPath, 'utf8')
    return content
  } catch (error) {
    console.error('Error reading CHANGELOG.md:', error)
    return `# 🚀 更新日志

无法读取更新日志文件。请检查 CHANGELOG.md 是否存在。`
  }
}

export default function ChangelogPage() {
  // 从文件系统读取更新日志内容
  const changelogContent = getChangelogContent()

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent"
              >
                <Icon type="chevron-up" size="xs" className="rotate-90" />
                返回
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Icon type="agno" size="xs" />
              <span className="text-sm font-medium">Agent UI</span>
            </div>
          </div>
          <h1 className="text-lg font-semibold">更新日志</h1>
          <div className="w-16" /> {/* 占位符保持居中 */}
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-border/40 bg-card/50 p-6 shadow-sm">
          <MarkdownRenderer>{changelogContent}</MarkdownRenderer>
        </div>
      </div>
    </div>
  )
}