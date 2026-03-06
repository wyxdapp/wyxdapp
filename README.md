# 网约向导（wyxdapp）

基于 uni-app x 开发的完整前端解决方案，一次开发，编译生成 H5、小程序、APP 多端应用，专为旅行社、地陪及工作室提供可私有化部署的商业底座。

🌐 演示网站：[www.wyxdapp.com](https://www.wyxdapp.com)

## 特性

- 🚀 基于 Vue 3 + uni-app x，支持编译为 H5、微信小程序、Android、iOS、鸿蒙多端应用
- 💬 实时聊天：WebSocket 驱动的即时通讯，支持文字、语音、图片、表情、礼物消息
- 📦 订单系统：完整的预约下单、支付（微信/支付宝）、退款、评价流程
- 🎯 向导服务：向导入驻、路线发布、定制行程、在线预约
- 📱 社交互动：动态发布、视频流、关注、评论、点赞、访客记录
- 🔔 消息通知：推送通知、未读数实时提醒、多类型消息分类
- 🎰 营销工具：抽奖活动、推广分销、营销弹窗
- 🔐 安全可靠：Token 管理、HTML 清理、URL 验证、隐私合规
- 🏢 私有化部署：仅需修改两个配置文件即可完成品牌定制

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + uni-app x |
| 语言 | TypeScript / UTS |
| 状态管理 | Pinia |
| 实时通信 | WebSocket |
| 支付 | 微信支付 / 支付宝 |
| 存储 | 腾讯云 COS |
| 地图 | 腾讯地图 / 高德地图 |
| 测试 | Vitest + fast-check |

## 支持平台

| 平台 | 状态 |
|------|------|
| H5（Web） | ✅ |
| 微信小程序 | ✅ |
| Android | ✅ |
| iOS | ✅ |
| 鸿蒙 | ✅ |

## 功能模块

```
首页          向导推荐 / 路线浏览 / 动态发布 / 向导入驻
消息          实时聊天 / 通知中心 / 关注 / 评论 / 访客
订单          下单 / 支付 / 退款 / 评价 / 订单通知
我的          个人资料 / 钱包 / 认证 / 设置 / 收藏
发现          搜索 / 推荐 / 城市选择
视频          短视频流 / 评论互动
运营          签约管理 / 群发消息 / 推广佣金
```

## 快速开始

### 环境要求

- [HBuilderX](https://www.dcloud.io/hbuilderx.html) 最新正式版
- Node.js 16+

### 安装

```bash
cd wyxdapp
npm install
```

### 开发运行

使用 HBuilderX 打开 `wyxdapp/` 目录，选择对应平台运行即可。

### 编译发布

| 平台 | 操作 |
|------|------|
| H5 | HBuilderX → 发行 → 网站-H5手机版 |
| 微信小程序 | HBuilderX → 发行 → 小程序-微信 |
| Android | HBuilderX → 发行 → 原生App-云打包 |
| iOS | HBuilderX → 发行 → 原生App-云打包 |

## 私有化部署

二次开发仅需修改两个核心文件：

- `utils/config.uts` — 运行时配置（商户密钥、域名等）
- `manifest.json` — 平台级配置（应用名称、appid、微信配置等）

详细配置说明见下方。

---

## 二次开发指南

### config.uts 必改配置

打开 `utils/config.uts`，修改以下配置项：

| 配置项 | 当前默认值 | 说明 |
|---|---|---|
| `wyxdkey` | `P679252D0RB7IYBR` | 开放平台商户密钥，从开放平台获取 |

> **注意**：`API_BASE_URL` 和 `WS_BASE_URL` 为平台统一接口地址，无需修改。后端通过 `wyxdkey` 自动路由到对应商户。

### config.uts 可选配置

| 配置项 | 当前默认值 | 说明 |
|---|---|---|
| `MAP_KEY` | `URTBZ-N3HKD-...` | 腾讯地图密钥（建议申请自己的） |
| `AMAP_KEY` | `a71c050754...` | 高德地图密钥（建议申请自己的） |
| `COS_CONFIG` | `{ bucket, region, domain }` | 腾讯云 COS 存储配置（固定，无需修改） |
| `CDN_BASE_URL` | `https://jiasu.wyxdapp.com` | CDN 加速域名（固定，无需修改） |
| `H5_SHARE_BASE_URL` | `https://m.wyxdapp.com` | H5 分享域名，修改为您自己的 |
| `DOWNLOAD_URLS` | `{ android, ios, h5 }` | 应用下载地址 |
| `LEGAL_URLS` | `{ privacyPolicy, userAgreement }` | 隐私政策和用户协议 URL |

### manifest.json 必改配置

| JSON 路径 | 说明 |
|---|---|
| `name` | 应用名称 |
| `appid` | uni-app 应用 ID，在 [DCloud 开发者中心](https://dev.dcloud.net.cn/) 获取 |
| `mp-weixin.appid` | 微信小程序 AppID |
| `h5.oauth.weixin.appid` | H5 微信授权 AppID |
| `h5.oauth.weixin.appsecret` | H5 微信授权 AppSecret |
| `app.distribute.oauth.weixin.appid` | APP 微信登录 AppID |
| `app-android.distribute.packagename` | Android 应用包名 |
| `app-ios.distribute.appid` | iOS Bundle ID |
| `web.title` | Web 端页面标题 |

> 三处腾讯地图密钥（android / ios / web）必须保持一致。

> 隐私政策链接（android / ios 的 `privacy.policy`）必须替换为您自己的，并与 `config.uts` 中 `LEGAL_URLS.privacyPolicy` 保持一致。

## 项目结构

```
wyxdapp/
├── api/                    # API 接口定义
│   └── types/              #   接口类型定义
├── common/                 # 公共模块
│   ├── composables/        #   组合式函数（Vue Composition API）
│   │   └── chat/           #   聊天相关 composables
│   ├── config/             #   公共配置常量
│   ├── services/           #   核心业务服务（聊天、支付、通知等）
│   ├── styles/             #   公共样式
│   ├── types/              #   公共类型定义
│   └── utils/              #   工具函数
│       └── security/       #   安全工具（Token、HTML清理、URL验证）
├── components/             # 公共组件
│   ├── base/               #   基础 UI 组件（Avatar、Button、Modal 等）
│   ├── business/           #   业务组件（订单、向导、动态等）
│   ├── chat/               #   聊天组件（消息气泡、输入框、语音等）
│   ├── lottery/            #   抽奖组件
│   └── common/             #   通用业务组件（分享、投诉、下单等）
├── pages/                  # 主 Tab 页面（首页、消息、订单、我的）
├── pagesBusiness/          # 业务页面（向导、发现、搜索、视频、运营）
├── pagesTrade/             # 交易页面（支付、退款、评价、礼物）
├── pagesUser/              # 用户页面（登录、个人中心、钱包、设置）
├── stores/                 # Pinia 状态管理
├── utils/                  # 工具函数和配置中心
│   ├── config.uts          #   ⭐ 核心配置文件（二次开发必改）
│   ├── request.uts         #   HTTP 请求封装
│   └── upload/             #   文件上传（腾讯云 COS）
├── static/                 # 静态资源
├── uni_modules/            # uni-app 插件
├── manifest.json           # ⭐ 应用清单配置（二次开发必改）
├── pages.json              # 页面路由配置
├── App.uvue                # 应用入口
└── main.uts                # 主入口文件
```

## 许可证

[MIT License](LICENSE)

## 联系方式

- 演示网站：[www.wyxdapp.com](https://www.wyxdapp.com)
- 商户注册：[www.wyxdapp.com](https://www.wyxdapp.com)
