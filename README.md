# 底座模板二次开发指南

本文档帮助二次开发者快速了解项目结构，并完成配置变更和部署。二次开发仅需修改两个核心文件：

- `utils/config.uts` — 运行时配置（API 地址、密钥、域名等）
- `manifest.json` — 平台级配置（应用名称、appid、微信配置等）

---

## 一、快速开始

### 1.1 config.uts 必改配置

打开 `utils/config.uts`，修改以下配置项：

| 配置项 | 当前默认值 | 说明 |
|---|---|---|
| `wyxdkey` | `P679252D0RB7IYBR` | 开放平台商户密钥，从开放平台获取 |

> **注意**：`API_BASE_URL` 和 `WS_BASE_URL` 为平台统一接口地址，无需修改。后端通过 `wyxdkey` 自动路由到对应商户。

### 1.2 config.uts 可选配置

以下配置项根据实际需要修改，不修改也可正常运行：

| 配置项 | 当前默认值 | 说明 |
|---|---|---|
| `MAP_KEY` | `URTBZ-N3HKD-CRC4M-P6ET7-5HORV-V3FFU` | 腾讯地图密钥（当前为演示密钥，建议申请自己的） |
| `AMAP_KEY` | `a71c0507543cc343fb8dc50f2d41312e` | 高德地图密钥（当前为演示密钥，建议申请自己的） |
| `COS_CONFIG` | `{ bucket, region, domain }` | 腾讯云 COS 存储配置（固定，无需修改） |
| `CDN_BASE_URL` | `https://jiasu.wyxdapp.com` | CDN 加速域名（固定，无需修改） |
| `H5_SHARE_BASE_URL` | `https://m.wyxdapp.com` | H5 分享域名，修改为您自己的 H5 域名 |
| `DOWNLOAD_URLS` | `{ android, ios, h5 }` | 应用下载地址，修改为您自己的应用下载链接 |
| `LEGAL_URLS` | `{ privacyPolicy, userAgreement }` | 隐私政策和用户协议 URL |

### 1.3 manifest.json 必改配置

打开 `manifest.json`，按下表修改对应字段：

| JSON 路径 | 当前值 | 说明 |
|---|---|---|
| `name` | `网约向导` | 应用名称，改为您的应用名 |
| `appid` | `__UNI__0B0B4BB` | uni-app 应用 ID，在 [DCloud 开发者中心](https://dev.dcloud.net.cn/) 创建应用后获取 |
| `description` | `专业的当地向导服务平台` | 应用描述 |
| `mp-weixin.appid` | `wxea01c7c2791737dc` | 微信小程序 AppID，在 [微信公众平台](https://mp.weixin.qq.com/) 获取 |
| `h5.oauth.weixin.appid` | `wx428774d18f12e2b1` | H5 微信授权 AppID，在微信开放平台获取 |
| `h5.oauth.weixin.appsecret` | `YOUR_H5_WECHAT_APPSECRET` | H5 微信授权 AppSecret |
| `app.distribute.oauth.weixin.appid` | `wx4a9aa1fbc92e1054` | APP 微信登录 AppID，在微信开放平台获取 |
| `app.distribute.oauth.weixin.appsecret` | `YOUR_APP_WECHAT_APPSECRET` | APP 微信登录 AppSecret |
| `app-android.distribute.packagename` | `com.wyxdapp.guide` | Android 应用包名 |
| `app-android.distribute.modules.uni-oauth.weixin.appid` | `wx4a9aa1fbc92e1054` | Android 微信 OAuth AppID，改为您自己的微信开放平台 AppID |
| `app-android.distribute.modules.uni-location.tencent.key` | `URTBZ-N3HKD-CRC4M-P6ET7-5HORV-V3FFU` | Android 腾讯地图密钥 |
| `app-android.distribute.privacy.policy` | `https://www.wyxdapp.com/doc/secret.html` | Android 隐私政策链接（⚠️ 必须替换为您自己的隐私政策页面 URL，该链接会在应用首次启动时展示给用户） |
| `app-ios.distribute.appid` | `com.qylvtu.lvtu` | iOS Bundle ID |
| `app-ios.distribute.modules.uni-oauth.weixin.appid` | `wx4a9aa1fbc92e1054` | iOS 微信 OAuth AppID，改为您自己的微信开放平台 AppID |
| `app-ios.distribute.modules.uni-location.tencent.key` | `URTBZ-N3HKD-CRC4M-P6ET7-5HORV-V3FFU` | iOS 腾讯地图密钥 |
| `app-ios.distribute.privacy.policy` | `https://www.wyxdapp.com/doc/secret.html` | iOS 隐私政策链接（⚠️ 必须替换为您自己的隐私政策页面 URL，该链接会在应用首次启动时展示给用户） |
| `web.sdkConfigs.maps.tencent.key` | `URTBZ-N3HKD-CRC4M-P6ET7-5HORV-V3FFU` | Web 端腾讯地图密钥 |
| `web.title` | `网约向导` | Web 端页面标题 |

> **注意**：`app-android`、`app-ios`、`web` 三处腾讯地图密钥必须保持一致。

> **隐私政策说明**：`app-android.distribute.privacy.policy` 和 `app-ios.distribute.privacy.policy` 中的 URL 是应用启动时弹出的隐私政策弹窗链接，必须替换为您自己部署的隐私政策页面地址。同时，`config.uts` 中的 `LEGAL_URLS.privacyPolicy` 也需要同步修改为相同的地址。

---

## 二、配置项说明

### 2.1 config.uts 配置项详解

#### wyxdkey（必改）

开放平台商户密钥，用于标识不同合作商户。通过 HTTP 请求头 `X-Partner-Id` 传递给后端。

获取方式注册获取：www.wyxdapp.com

#### API_BASE_URL（固定，无需修改）

后端 API 基础地址，平台统一提供，所有商户共用同一接口地址。后端通过 `wyxdkey` 自动路由到对应商户数据。

#### WS_BASE_URL（固定，无需修改）

WebSocket 连接地址，平台统一提供，用于聊天消息的实时推送。

#### MAP_KEY（可选）

腾讯地图 JavaScript API 密钥，用于地图展示和定位服务。

获取方式：前往 [腾讯位置服务](https://lbs.qq.com) 注册账号，创建应用后获取 Key。需要同时在 `manifest.json` 的三处地图密钥字段填入相同的值。

#### AMAP_KEY（可选）

高德地图 Web 服务 API 密钥，用于逆地理编码（将经纬度转换为地址文本）。

获取方式：前往 [高德开放平台](https://console.amap.com) 注册账号，创建应用后获取 Key。

#### COS_CONFIG（固定，无需修改）

腾讯云对象存储（COS）配置，平台统一提供，用于图片和文件的上传存储。

#### CDN_BASE_URL（可选）

CDN 加速域名，用于默认头像、分享图片等静态资源的 URL 前缀。

获取方式：在 CDN 服务商处配置加速域名，指向您的 COS 存储桶或静态资源服务器。

#### H5_SHARE_BASE_URL（可选）

H5 分享域名，用于生成微信分享链接和深链接跳转。

获取方式：部署 H5 版本后，使用对应的域名（如 `https://m.yourdomain.com`）。

#### DOWNLOAD_URLS（可选）

应用下载地址配置，包含 Android APK 下载链接、iOS App Store 链接和 H5 下载引导页。

获取方式：
- `android`：将 APK 上传到 COS 或其他文件服务后获取下载链接
- `ios`：在 App Store Connect 上架后获取应用链接
- `h5`：部署下载引导页后获取链接

#### LEGAL_URLS（可选）

隐私政策和用户协议的 URL 地址。

获取方式：编写您自己的隐私政策和用户协议文档，部署到 Web 服务器后获取链接。

> **重要**：修改此项后，需同步修改 `manifest.json` 中 `app-android.distribute.privacy.policy` 和 `app-ios.distribute.privacy.policy` 的值。

### 2.2 manifest.json 配置项详解

#### 应用基本信息

- `name`：应用名称，显示在设备桌面和应用商店
- `appid`：uni-app 应用唯一标识，在 [DCloud 开发者中心](https://dev.dcloud.net.cn/) 创建应用后自动生成
- `description`：应用描述文本

#### 微信相关配置

- `mp-weixin.appid`：微信小程序 AppID，在 [微信公众平台](https://mp.weixin.qq.com/) → 开发管理 → 开发设置中获取
- `h5.oauth.weixin.appid/appsecret`：H5 端微信网页授权配置，在 [微信开放平台](https://open.weixin.qq.com/) 创建网站应用后获取
- `app.distribute.oauth.weixin.appid/appsecret`：APP 端微信登录配置，在微信开放平台创建移动应用后获取
- `app-android/app-ios.distribute.modules.uni-oauth.weixin.appid`：各平台微信 OAuth 模块的 AppID，与 APP 端微信登录 AppID 保持一致

#### 地图密钥

`app-android.distribute.modules.uni-location.tencent.key`、`app-ios.distribute.modules.uni-location.tencent.key`、`web.sdkConfigs.maps.tencent.key` 三处必须填入相同的腾讯地图密钥。

获取方式：前往 [腾讯位置服务](https://lbs.qq.com) 申请。

#### 隐私政策

`app-android.distribute.privacy.policy` 和 `app-ios.distribute.privacy.policy` 是应用首次启动时展示的隐私政策弹窗链接。必须替换为您自己部署的隐私政策页面 URL，并确保与 `config.uts` 中 `LEGAL_URLS.privacyPolicy` 保持一致。

#### 平台标识

- `app-android.distribute.packagename`：Android 应用包名（如 `com.yourcompany.yourapp`）
- `app-ios.distribute.appid`：iOS Bundle ID（如 `com.yourcompany.yourapp`）
- `web.title`：Web 端浏览器标签页标题

---

## 三、项目结构说明

```
wyxdapp/
├── api/                           # API 接口定义
│   ├── types/                     #   API 类型定义
│   │   ├── authTypes.uts         #   认证接口类型
│   │   ├── chatTypes.uts         #   聊天接口类型
│   │   ├── orderTypes.uts        #   订单接口类型
│   │   ├── userTypes.uts         #   用户接口类型
│   │   └── ...                   #   其他业务类型
│   ├── auth.uts                   #   认证相关接口
│   ├── chat.uts                   #   聊天相关接口
│   ├── order.uts                  #   订单相关接口
│   ├── user.uts                   #   用户相关接口
│   └── ...                        #   其他业务接口
├── common/                        # 公共模块
│   ├── composables/               #   组合式函数（Vue Composition API）
│   │   ├── chat/                  #   聊天相关 composables
│   │   │   ├── useChatConnection.uts
│   │   │   ├── useChatMessages.uts
│   │   │   └── ...
│   │   ├── useAuth.uts            #   认证状态管理
│   │   ├── useCurrentUserProfile.uts
│   │   └── ...
│   ├── config/                    #   公共配置
│   │   ├── businessCodes.uts      #   业务码配置
│   │   ├── defaultImages.uts      #   默认图片配置
│   │   ├── errorMessages.uts      #   错误消息配置
│   │   └── ...
│   ├── services/                  #   公共服务
│   │   ├── chatService.uts        #   聊天服务
│   │   ├── paymentService.uts     #   支付服务
│   │   ├── wechatPayService.uts   #   微信支付服务
│   │   └── ...
│   ├── styles/                    #   公共样式
│   │   ├── base.css               #   基础样式
│   │   ├── colors.css             #   颜色变量
│   │   └── ...
│   ├── types/                     #   公共类型定义
│   └── utils/                     #   公共工具函数
│       ├── security/              #   安全工具
│       ├── dateUtils.uts          #   日期工具
│       ├── logger.uts             #   日志工具
│       └── ...
├── components/                    # 公共组件
│   ├── base/                      #   基础组件
│   │   ├── Avatar.uvue
│   │   ├── Button.uvue
│   │   ├── Modal.uvue
│   │   ├── Toast.uvue
│   │   └── ...
│   ├── business/                  #   业务组件
│   │   ├── ChatItem.uvue
│   │   ├── MerchantList.uvue
│   │   ├── OrderItem.uvue
│   │   └── ...
│   ├── chat/                      #   聊天组件
│   │   ├── ChatHeader.uvue
│   │   ├── ChatInput.uvue
│   │   ├── MessageBubble.uvue
│   │   └── ...
│   ├── lottery/                   #   抽奖组件
│   └── ...
├── pages/                         # 主页面（tabBar 页面和基础页面）
│   ├── index/                     #   首页
│   ├── my/                        #   我的
│   ├── news/                      #   消息
│   ├── order/                     #   订单
│   └── ...
├── pagesBusiness/                 # 业务页面（向导、发现、商家等）
│   ├── bookGuide/                 #   预约向导
│   ├── find/                      #   发现
│   ├── guideInfo/                 #   向导详情
│   ├── merchantDetail/            #   商家详情
│   ├── operate/                   #   运营管理
│   ├── videoFeed/                 #   视频流
│   ├── services/                  #   业务服务
│   └── ...
├── pagesTrade/                    # 交易页面（订单、支付、评价等）
│   ├── appraise/                  #   评价
│   ├── giftSend/                  #   送礼
│   ├── orderDetails/              #   订单详情
│   ├── payment/                   #   支付
│   │   ├── payOrder/              #   订单支付
│   │   └── ...
│   ├── services/                  #   交易服务
│   │   ├── wechatPay/             #   微信支付
│   │   └── alipayPay/             #   支付宝支付
│   └── ...
├── pagesUser/                     # 用户页面（个人中心、设置等）
│   ├── login/                     #   登录
│   ├── my/                        #   个人中心
│   │   ├── about/                 #   关于
│   │   ├── profile/               #   个人资料
│   │   ├── setting/               #   设置
│   │   └── ...
│   ├── wallet/                    #   钱包
│   ├── services/                  #   用户服务
│   └── ...
├── stores/                        # 状态管理（Pinia stores）
│   ├── chat.uts                   #   聊天状态
│   ├── user.uts                   #   用户状态
│   ├── websocket.uts              #   WebSocket 连接管理
│   ├── notification.uts           #   通知状态
│   └── ...
├── utils/                         # 工具函数和配置中心
│   ├── config.uts                 #   ⭐ 核心配置文件（二次开发必改）
│   ├── request.uts                #   HTTP 请求封装
│   ├── upload/                    #   文件上传工具
│   │   ├── cosUploader.uts        #   腾讯云 COS 上传
│   │   └── ...
│   └── ...
├── static/                        # 静态资源
│   ├── images/                    #   图片资源
│   │   └── icon/                  #   图标
│   └── editor/
├── uni_modules/                   # uni-app 插件模块
│   ├── tt-wechat-pro/             #   微信专业版插件
│   └── uni-icons/                 #   uni-app 图标库
├── tests/                         # 测试文件
│   └── review/                    #   代码审查测试
├── scripts/                       # 脚本工具
├── manifest.json                  # ⭐ 应用清单配置（二次开发必改）
├── pages.json                     # 页面路由配置
├── App.uvue                       # 应用入口组件
├── main.uts                       # 应用入口文件
├── uni.scss                       # 全局样式变量
└── ...
```

### 关键文件说明

| 文件/目录 | 职责 |
|---|---|
| `utils/config.uts` | 运行时配置中心，所有可变配置的唯一来源 |
| `manifest.json` | 平台级配置，包含应用信息、微信配置、地图密钥等 |
| `utils/request.uts` | HTTP 请求封装，自动携带 Token 和商户密钥 |
| `stores/websocket.uts` | WebSocket 连接管理，用于聊天实时通信 |
| `stores/chat.uts` | 聊天状态管理 |
| `stores/user.uts` | 用户状态管理 |
| `pages.json` | 页面路由和导航栏配置 |
| `App.uvue` | 应用生命周期管理 |
| `api/` | 所有API接口定义目录 |
| `api/types/` | API响应和请求类型定义 |
| `common/composables/` | Vue组合式函数，包含认证、聊天、用户资料等逻辑 |
| `common/services/` | 核心业务服务（聊天、支付、通知等） |
| `common/utils/security/` | 安全工具（HTML清理、令牌管理、URL验证等） |
| `components/base/` | 基础UI组件库 |
| `components/chat/` | 聊天界面专用组件 |
| `pages/` | 主Tab页面 |
| `pagesBusiness/` | 业务功能页面（向导、商家、视频等） |
| `pagesTrade/` | 交易流程页面（订单、支付、评价） |
| `pagesUser/` | 用户相关页面（个人中心、设置、钱包） |
| `utils/upload/` | 文件上传工具（腾讯云COS） |
| `uni_modules/tt-wechat-pro/` | 微信专业版SDK插件 |

---

## 四、部署指南

### 4.1 环境准备

1. 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)（推荐最新正式版）
2. 在 HBuilderX 中安装以下插件：
   - uni-app x 编译器
   - 各平台所需的编译插件（如微信小程序、Android、iOS）
3. 使用 HBuilderX 打开 `wyxdapp/` 目录

### 4.2 安装依赖

在 `wyxdapp/` 目录下执行：

```bash
npm install
```

### 4.3 各平台编译与部署

#### H5（Web）

1. 在 HBuilderX 中选择 **发行 → 网站-H5手机版**
2. 编译完成后，将 `unpackage/dist/build/web/` 目录部署到 Web 服务器
3. 配置 Nginx 或其他 Web 服务器，确保所有路由指向 `index.html`

#### 微信小程序

1. 在 HBuilderX 中选择 **发行 → 小程序-微信**
2. 编译完成后，使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 `unpackage/dist/build/mp-weixin/` 目录
3. 在微信开发者工具中上传代码，然后在微信公众平台提交审核

#### Android

1. 在 HBuilderX 中选择 **发行 → 原生App-云打包**（或本地打包）
2. 选择 Android 平台，配置签名证书
3. 打包完成后获取 APK 文件，上传到应用商店或分发平台

#### iOS

1. 在 HBuilderX 中选择 **发行 → 原生App-云打包**（或本地打包）
2. 选择 iOS 平台，配置开发者证书和描述文件
3. 打包完成后获取 IPA 文件，通过 Xcode 或 Transporter 上传到 App Store Connect
