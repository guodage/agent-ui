# 🚀 更新日志
---

*最后更新：2025年8月28日*

## 2025.08.28 (最新)

### 🚀 新功能
- **Docker Compose 集成**：agent-ui 现已整合到 Docker Compose 配置中，支持一键部署和容器化运行
- **DeepSeek 模型支持**：agent-api 现支持 deepseek-v3.1 作为主要AI模型，提供更强大的对话能力
- **方便的端点选择框**：agent-ui 新增端点选择功能，用户可轻松切换不同API端点

### 🔧 重要修复
- **对话页面布局修复**：解决对话页面向下滚动时出现灰色区域的显示问题

### 🧪 技术改进
- 优化StickToBottom组件的高度管理，防止无限扩展导致的UI问题

## 2025.08.27

### 🔧 重要修复
- **流式传输LaTeX公式渲染**：修复流式SSE响应中LaTeX公式渲染中断的问题
- **JSON解析增强**：改进对包含反斜杠字符的JSON数据解析
- **错误恢复机制**：增强流式传输的稳定性，支持损坏数据的跳过和恢复
- **换行符处理**：修复消息中转义换行符的显示问题

### 🧪 技术改进
- 优化流式传输buffer处理逻辑
- 增强JSON对象边界检测算法
- 改进前后端数据格式一致性

---

## 2025.08.26

### ✨ 新功能
- **数学公式支持**：支持 Markdown 标准的数学公式渲染
- **LaTeX 兼容**：支持 LaTeX 标准下无编号、带编号的数学公式
- **HTTPS 支持**：测试环境端点支持HTTPS，可在官方Playground中查看。

### 🔗 测试地址
* 测试 AgentUI 地址：[https://agent-demo.8btc-ops.com](https://agent-demo.8btc-ops.com)
* Playground端点地址：[https://playground.8btc-ops.com/v1](https://playground.8btc-ops.com/v1)

### 🧪 技术详情
- 集成 KaTeX 数学公式渲染引擎
- 支持多种 LaTeX 公式格式：
  - 行内公式：$E = mc^2$
  - 块级公式：$$\int e^{-x^2}dx = \sqrt{\pi}$$
  - LaTeX 环境：\begin{equation} x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} \end{equation}
- 完善的公式预处理和格式转换

---

## 未来计划

### 📋 即将推出
- 处理文件上传问题
- 添加PlayGround功能
