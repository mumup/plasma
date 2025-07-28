# Plasma 超募额度计算器

一个用于计算Plasma项目超募后投入金额能获得多少额度的Web应用。

## 功能特性

- 🔗 **实时数据获取**: 从以太坊主网合约获取最新数据
- 🧮 **智能计算**: 使用精确的数学公式计算超募额度
- 🎨 **现代化UI**: 使用Tailwind CSS构建的美观界面
- ⚡ **高性能**: 基于Next.js 15构建，支持服务端渲染
- 📱 **响应式设计**: 完美适配桌面和移动设备

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **区块链交互**: Ethers.js
- **语言**: TypeScript
- **包管理**: pnpm

## 计算公式

```
用户输入 × (总保证额度 - 已使用额度) ÷ (总筹集金额 - 已使用额度)
```

## 合约信息

- **合约地址**: `0x4d058e2849a7bab450b8eb3c9941064e5abec551`
- **网络**: 以太坊主网
- **数据源**: 
  - `totalAllocation`: 总保证额度
  - `totalBalance`: 目前供筹集的总金额
  - `totalReservedUsed`: 目前已使用的保证额度

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
plasma/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── api/                   # 业务逻辑模块
│   └── blockchain.ts      # 区块链交互
├── abi.json              # 合约ABI
├── build.md              # 项目需求文档
└── package.json          # 项目配置
```

## 开发说明

### 数据获取

应用会从以太坊主网获取实时数据，包括：
- 总保证额度 (totalAllocation)
- 总筹集金额 (totalBalance) 
- 已使用额度 (totalReservedUsed)

### 计算逻辑

1. 用户输入投入金额
2. 系统从合约获取最新数据
3. 应用公式计算可获得的额度
4. 显示计算结果

### 错误处理

- 网络连接失败时显示错误信息
- 数据获取失败时提供重试按钮
- 输入验证确保计算准确性

## 部署

项目可以部署到任何支持Next.js的平台：

- Vercel (推荐)
- Netlify
- 自托管服务器

## 许可证

ISC 