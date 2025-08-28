# 使用包含pnpm的Node.js镜像
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 安装pnpm，使用npm全局安装避免corepack网络问题
RUN npm install -g pnpm --registry=https://registry.npmmirror.com

# 安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN pnpm config set registry https://registry.npmmirror.com && pnpm i --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm --registry=https://registry.npmmirror.com

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js 收集匿名遥测数据
# 了解更多: https://nextjs.org/telemetry
# 在构建期间禁用遥测
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm config set registry https://registry.npmmirror.com && pnpm run build

# 生产镜像，复制所有文件并运行 next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# 禁用遥测
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 创建 public 目录（如果不存在）
RUN mkdir -p ./public

# 设置正确的权限并充分利用输出跟踪以减少镜像大小
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 复制CHANGELOG.md文件到生产镜像中
COPY --from=builder --chown=nextjs:nodejs /app/CHANGELOG.md ./CHANGELOG.md

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]