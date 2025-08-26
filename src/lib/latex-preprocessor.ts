/**
 * LaTeX 公式预处理工具
 * 将不同格式的 LaTeX 公式统一转换为 Markdown 支持的格式
 */

/**
 * 将 LaTeX 格式的括号表达式转换为 Markdown 格式
 * \[...\] -> $$...$$
 * \(...\) -> $...$
 */
export function escapeBrackets(text: string): string {
  const pattern = /(```[\S\s]*?```|`.*?`)|\\\[([\S\s]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (
      match: string,
      codeBlock: string | undefined,
      squareBracket: string | undefined,
      roundBracket: string | undefined,
    ): string => {
      if (codeBlock != null) {
        // 保护代码块不被处理
        return codeBlock;
      } else if (squareBracket != null) {
        // 将 \[...\] 转换为 $$...$$
        return `$$${squareBracket}$$`;
      } else if (roundBracket != null) {
        // 将 \(...\) 转换为 $...$
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

/**
 * 处理特殊的化学公式函数，添加额外的转义
 */
export function escapeMhchem(text: string): string {
  return text.replaceAll('$\\ce{', '$\\\\ce{').replaceAll('$\\pu{', '$\\\\pu{');
}

/**
 * 将 LaTeX 环境格式转换为 Markdown 格式
 * \begin{equation}...\end{equation} -> $$...$$
 * \begin{align}...\end{align} -> $$...$$
 * 等其他数学环境
 */
export function escapeLatexEnvironments(text: string): string {
  // 匹配数学环境：equation, align, gather, multline, split 等
  const mathEnvironments = ['equation', 'align', 'gather', 'multline', 'split', 'eqnarray', 'displaymath'];
  
  for (const env of mathEnvironments) {
    const pattern = new RegExp(`\\\\begin\\{${env}\\*?\\}([\\s\\S]*?)\\\\end\\{${env}\\*?\\}`, 'g');
    text = text.replace(pattern, (match, content) => {
      // 如果内容已经是$$格式，不重复包装
      if (content.trim().startsWith('$$') && content.trim().endsWith('$$')) {
        return content;
      }
      return `$$${content}$$`;
    });
  }
  
  return text;
}

/**
 * LaTeX 公式预处理主函数
 * 统一处理各种 LaTeX 格式，转换为 Markdown 支持的格式
 */
export function preprocessLaTeX(content: string): string {
  // 步骤一：保护代码块
  const codeBlocks: string[] = [];
  content = content.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match, code) => {
    codeBlocks.push(code);
    return `<<CODE_BLOCK_${codeBlocks.length - 1}>>`;
  });

  // 步骤二：保护已存在的 LaTeX 表达式（Markdown 格式的数学公式）
  const latexExpressions: string[] = [];
  content = content.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\(.*?\\\))/g, (match) => {
    latexExpressions.push(match);
    return `<<LATEX_${latexExpressions.length - 1}>>`;
  });

  // 步骤三：将内容中后跟数字的 $（如 $100）转义为 \$，以避免将其误认为是 LaTeX 行内公式的分隔符
  content = content.replace(/\$(?=\d)/g, '\\$');

  // 步骤四：将占位符 <<LATEX_n>> 替换回原始的 LaTeX 表达式，确保数学公式内容恢复
  content = content.replace(/<<LATEX_(\d+)>>/g, (_, index) => latexExpressions[parseInt(index)]);

  // 步骤五：将占位符 <<CODE_BLOCK_n>> 替换回原始代码块内容
  content = content.replace(/<<CODE_BLOCK_(\d+)>>/g, (_, index) => codeBlocks[parseInt(index)]);

  // 步骤六：将 \[...\] 和 \(...\) 转换为 $$...$$ 和 $...$
  content = escapeBrackets(content);
  
  // 步骤七：将 LaTeX 环境转换为 $$...$$ 格式
  content = escapeLatexEnvironments(content);
  
  // 步骤八：对化学公式中的 \ce{} 和 \pu{} 命令添加额外的反斜杠转义
  content = escapeMhchem(content);

  return content;
}