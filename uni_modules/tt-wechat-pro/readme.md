# tt-wechat-pro

🚀 **专业版微信SDK插件**，为 uni-app x & uni-app 提供完整的微信集成解决方案，包含登录、分享、支付、小程序等全功能

## 📖 目录
- [SDK版本信息](#sdk版本信息)
- [环境配置](#环境配置)
- [快速开始](#快速开始)
- [基础使用](#基础使用)
- [功能介绍](#功能介绍)
  - [微信授权登录](#微信授权登录)
  - [微信分享功能](#微信分享功能)
  - [微信支付功能](#微信支付功能)
  - [打开微信小程序](#打开微信小程序)
  - [打开微信客服](#打开微信客服)
  - [获取微信开放平台标签启动参数](#获取微信开放平台标签启动参数)
- [错误处理](#错误处理)
- [常见问题](#常见问题)

## SDK版本信息

| 平台 | 版本 | 支持状态 |
|------|------|----------|
| iOS | 2.0.5 | ✅ 完全支持 |
| Android | 6.8.34 | ✅ 完全支持 |
| HarmonyOS | 1.0.15 | ✅ 完全支持 |

📚 **推荐阅读**: [微信官方集成文档](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Development_Guide.html)

## 🚨 重要提示

⚠️ **必须使用自定义基座运行**，否则无法找到插件方法  
⚠️ 测试前需确保应用已通过微信开放平台审核，否则分享可能失败  
⚠️ Android 自定义基座必须使用自签名，勿使用云端签名  
⚠️ **HBuilderX 4.76版本鸿蒙平台编译报错问题**，请升级至4.8x版本  
⚠️ **编译报错排查**：本插件会定期更新至最新版SDK，某些情况下编译报错可能不是插件不可用，而是本地环境问题或与官方插件冲突，遇到此类情况可通过IM联系我协助解决  

## 环境配置

### 前置条件
1. 在[微信开放平台](https://open.weixin.qq.com/)申请移动应用
2. 获取 `AppID`
3. 配置应用包名和签名

### iOS平台配置

#### 1. 配置 URL Scheme
无需在项目根目录添加或修改 `Info.plist`。请直接编辑插件内的 `uni_modules/tt-wechat-pro/utssdk/app-ios/Info.plist`，将以下配置项补充为您的实际值：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>WeChat</key>
    <dict>
      <key>appid</key>
      <string>此处填写您的微信appid</string>
      <key>universalLink</key>
      <string>此处填写您的通用链接</string>
    </dict>
    <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>WeChat</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>此处填写您的微信appid</string>
        </array>
      </dict>
    </array>
    <key>LSApplicationQueriesSchemes</key>
    <array>
      <string>weixinULAPI</string>
      <string>weixinURLParamsAPI</string>
      <string>weixin</string>
    </array>
  </dict>
 </plist>
```

#### 2. 配置通用链接 (Universal Link)
> 📖 详细配置请参考: [uni官方文档-通用链接](https://uniapp.dcloud.net.cn/tutorial/app-ios-capabilities.html#%E9%80%9A%E7%94%A8%E9%93%BE%E6%8E%A5-universal-link)

### Android平台配置
Android平台会自动完成相关配置，确保在微信开放平台正确配置应用包名和签名即可。

### HarmonyOS平台配置

⚠️ **重要授权说明**: 
- **uni-app 项目**: 由于官方目前不支持试用以及普通授权，建议通过示例中的 uni-app x 项目测通后购买源码授权使用
- **uni-app x 项目**: 可直接使用

#### 1. 配置 module.json5

⚠️ **重要提示**: 由于 `harmony-configs/entry/src/main/module.json5` 会完全替换默认配置，需要提供完整的配置文件。

在项目的 `harmony-configs/entry/src/main/module.json5` 文件中使用以下**完整配置**：

```json
{
  "module": {
    "name": "entry",
    "type": "entry",
    "description": "$string:module_desc",
    "mainElement": "EntryAbility",
    "deviceTypes": [
      "phone",
      "tablet",
      "2in1"
    ],
    "deliveryWithInstall": true,
    "installationFree": false,
    "pages": "$profile:main_pages",
    "querySchemes": [
      "weixin"
    ],
    "abilities": [
      {
        "name": "EntryAbility",
        "srcEntry": "./ets/entryability/EntryAbility.ets",
        "description": "$string:EntryAbility_desc",
        "icon": "$media:layered_image",
        "label": "$string:EntryAbility_label",
        "startWindowIcon": "$media:startIcon",
        "startWindowBackground": "$color:start_window_background",
        "exported": true,
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home",
			  "wxentity.action.open"
            ]
          }
        ]
      }
    ],
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      }
    ]
  }
}
```

> 💡 **配置说明**: 
> - **必须使用完整配置**: `module.json5` 会覆盖默认配置，不能只添加部分字段
> - **关键添加项**: 
>   - `querySchemes` 数组包含 `"weixin"` 和 `"wxopensdk"`
>   - `skills` 数组添加 `wxentity.action.open` 配置（用于支持从微信跳转到应用功能）
> - **保留默认配置**: 其他配置项保持与默认模板一致

#### 2. 使用说明

**配置文件覆盖机制**:
- HarmonyOS 的 `harmony-configs/entry/src/main/module.json5` 采用**完全替换**机制
- 一旦创建此文件，会完全覆盖默认的 module.json5 配置
- 因此必须提供完整的配置内容，不能只添加部分字段

**配置要点**:
- ✅ 使用上述提供的完整模板
- ✅ 确保 `querySchemes` 包含微信相关 scheme（`"weixin"`, `"wxopensdk"`）
- ✅ 确保 `skills` 数组包含 `wxentity.action.open` 配置（支持从微信跳转功能）
- ✅ 保留所有默认的 abilities、permissions 等配置
- ❌ 不要只添加部分字段（会导致其他配置丢失）

#### 3. 功能限制
- **音乐分享功能不支持**: HarmonyOS平台暂不支持音乐分享功能

## 快速开始

### 1. 导入插件

#### uni-app x 版本

```typescript
import * as wxsdk from "@/uni_modules/tt-wechat-pro";

export default {
    data() {
        return {
            weChat: null as wxsdk.TTWeChatSDK | null,
        }
    },
    onLoad() {
        // 初始化微信SDK实例
        this.weChat = wxsdk.getTTWeChatSDK()
        // 注册微信SDK
        this.initWeChatSDK()
    },
    methods: {
        // 初始化微信SDK
        initWeChatSDK() {
            // SDK初始化代码见下方
        }
    }
}
```

#### uni-app 版本

```javascript
import * as wxsdk from "@/uni_modules/tt-wechat-pro";

export default {
    data() {
        return {
            weChat: wxsdk.TTWeChatSDK,
        }
    },
    onLoad() {
        // 初始化微信SDK实例
        this.weChat = wxsdk.getTTWeChatSDK()
        // 注册微信SDK
        this.initWeChatSDK()
    },
    methods: {
        // 初始化微信SDK
        initWeChatSDK() {
            // SDK初始化代码见下方
        }
    }
}
```
### 2. 初始化 SDK

#### uni-app x 版本

```typescript
initWeChatSDK() {
    if (this.weChat == null) {
        console.error('微信SDK初始化失败')
        return
    }
    
    this.weChat!.register({
        appid: "您的微信AppID",           // 必填：微信开放平台申请的AppID
        universalLink: "您的通用链接",     // iOS必填：通用链接
        success: (e) => {
            console.log("✅ 微信SDK初始化成功");
            // 可以在这里进行后续操作，如检测微信是否安装
            this.checkWeChatInstalled()
        },
        fail: (err) => {
            console.error("❌ 微信SDK初始化失败:", err);
            uni.showToast({
                title: '微信SDK初始化失败',
                icon: 'error'
            })
        }
    } as wxsdk.TTWeChatRegisterOptions);
}
```

#### uni-app 版本

```javascript
initWeChatSDK() {
    if (this.weChat == null) {
        console.error('微信SDK初始化失败')
        return
    }
    
    this.weChat.register({
        appid: "您的微信AppID",           // 必填：微信开放平台申请的AppID
        universalLink: "您的通用链接",     // iOS必填：通用链接
        success: (e) => {
            console.log("✅ 微信SDK初始化成功");
            // 可以在这里进行后续操作，如检测微信是否安装
            this.checkWeChatInstalled()
        },
        fail: (err) => {
            console.error("❌ 微信SDK初始化失败:", err);
            uni.showToast({
                title: '微信SDK初始化失败',
                icon: 'error'
            })
        }
    });
}
```

## 基础使用

### 检测微信是否安装

#### uni-app x 版本

```typescript
checkWeChatInstalled() {
    const isInstalled = this.weChat?.isInstall()
    if (isInstalled == false) {
        uni.showModal({
            title: '提示',
            content: '请先安装微信客户端',
            showCancel: false
        })
        return false
    }
    return true
}
```

#### uni-app 版本

```javascript
checkWeChatInstalled() {
    const isInstalled = this.weChat.isInstall()
    if (isInstalled == false) {
        uni.showModal({
            title: '提示',
            content: '请先安装微信客户端',
            showCancel: false
        })
        return false
    }
    return true
}
```

## 功能介绍

## 微信授权登录

> 💡 微信登录是一个两步过程：先获取code，再通过后端接口换取用户信息

### 第一步：获取授权码 (code)

#### 参数说明

**TTWeChatLoginOptions**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| state | string | 否 | 请求唯一标识，原样返回，长度不超过1K |

**返回值 TTWeChatLoginSuccess**

| 参数 | 类型 | 说明 |
|------|------|------|
| code | string | 用于换取access_token的授权码 |
| state | string | 原样返回的标识符 |

#### 示例代码

#### uni-app x 版本

```typescript
// 微信授权登录
handleWeChatLogin() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat?.login({
        state: Date.now().toString(), // 使用时间戳作为唯一标识
        success: (result) => {
            console.log("✅ 获取授权码成功:", result.code);
            // 将code发送到后端服务器
            this.sendCodeToServer(result.code)
        },
        fail: (error) => {
            console.error("❌ 微信授权失败:", error);
            uni.showToast({
                title: '授权失败',
                icon: 'error'
            })
        }
    } as wxsdk.TTWeChatLoginOptions)
}

// 发送code到后端服务器
sendCodeToServer(code: string) {
    uni.request({
        url: 'https://your-server.com/api/wechat/login',
        method: 'POST',
        data: { code },
        success: (res) => {
            // 处理登录成功逻辑
            console.log('登录成功:', res.data)
        },
        fail: (err) => {
            console.error('登录请求失败:', err)
        }
    })
}
```

#### uni-app 版本

```javascript
// 微信授权登录
handleWeChatLogin() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat.login({
        state: Date.now().toString(), // 使用时间戳作为唯一标识
        success: (result) => {
            console.log("✅ 获取授权码成功:", result.code);
            // 将code发送到后端服务器
            this.sendCodeToServer(result.code)
        },
        fail: (error) => {
            console.error("❌ 微信授权失败:", error);
            uni.showToast({
                title: '授权失败',
                icon: 'error'
            })
        }
    })
}

// 发送code到后端服务器
sendCodeToServer(code) {
    uni.request({
        url: 'https://your-server.com/api/wechat/login',
        method: 'POST',
        data: { code },
        success: (res) => {
            // 处理登录成功逻辑
            console.log('登录成功:', res.data)
        },
        fail: (err) => {
            console.error('登录请求失败:', err)
        }
    })
}
```

### 第二步：后端换取用户信息

> 📖 详细流程请参考: [微信授权后接口调用文档](https://developers.weixin.qq.com/doc/oplatform/Mobile_App/WeChat_Login/Authorized_API_call_UnionID.html)

**后端需要完成的步骤：**
1. 使用code换取access_token
2. 使用access_token获取用户信息
3. 返回用户信息给前端

## 微信分享功能

> 💡 支持分享文本、图片、视频、网页、小程序和音乐到微信好友、朋友圈和收藏

### 分享类型和场景

**分享类型 (type)**
- `0` - 文本分享
- `1` - 图片分享  
- `2` - 视频分享
- `3` - 网页分享
- `4` - 小程序分享
- `5` - 音乐分享 ⚠️ *HarmonyOS平台不支持*

**分享场景 (scene)**
- `0` - 分享到聊天界面
- `1` - 分享到朋友圈
- `2` - 分享到收藏

### 参数说明

#### TTWeChatShareOptions

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | number | ✅ | 分享类型，见上表 |
| scene | number | ✅ | 分享场景，见上表 |
| title | string | 条件 | 分享标题（文本分享时必填） |
| desc | string | ❌ | 分享描述 |
| imageUrl | string | 条件 | 图片地址（图片分享时必填，仅支持本地路径） |
| thumbImageUrl | string | 条件 | 缩略图地址（小程序分享必填，仅支持本地路径，不能超过32kb） |
| videoUrl | string | 条件 | 视频地址（视频分享时必填） |
| musicUrl | string | 条件 | 音乐地址（音乐分享时必填） |
| href | string | 条件 | 网页链接（网页分享时必填） |
| miniProgram | TTWeChatShareMiniProgramOptions | 条件 | 小程序信息（小程序分享时必填） |

#### TTWeChatShareMiniProgramOptions

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userName | string | ✅ | 小程序原始ID |
| path | string | ✅ | 小程序页面路径 |
| webpageUrl | string | ✅ | 兼容低版本的网页URL |
| miniProgramType | number | ❌ | 版本类型：0-正式版，1-开发版，2-体验版（默认0） |

### 使用示例

#### 1. 分享文本

#### uni-app x 版本

```typescript
shareText() {
    this.weChat?.share({
        type: 0,
        scene: 0, // 分享到聊天
        title: '这是分享的文本内容',
        desc: '分享描述信息',
        success: (res) => {
            console.log('✅ 文本分享成功')
            uni.showToast({ title: '分享成功' })
        },
        fail: (error) => {
            console.error('❌ 分享失败:', error)
            uni.showToast({ title: '分享失败', icon: 'error' })
        }
    } as wxsdk.TTWeChatShareOptions)
}
```

#### uni-app 版本

```javascript
shareText() {
    this.weChat.share({
        type: 0,
        scene: 0, // 分享到聊天
        title: '这是分享的文本内容',
        desc: '分享描述信息',
        success: (res) => {
            console.log('✅ 文本分享成功')
            uni.showToast({ title: '分享成功' })
        },
        fail: (error) => {
            console.error('❌ 分享失败:', error)
            uni.showToast({ title: '分享失败', icon: 'error' })
        }
    })
}
```

#### 2. 分享图片

#### uni-app x 版本

```typescript
shareImage() {
    this.weChat?.share({
        type: 1,
        scene: 1, // 分享到朋友圈
        imageUrl: '/static/share-image.png', // 本地图片路径
        success: (res) => {
            console.log('✅ 图片分享成功')
        },
        fail: (error) => {
            console.error('❌ 图片分享失败:', error)
        }
    } as wxsdk.TTWeChatShareOptions)
}
```

#### uni-app 版本

```javascript
shareImage() {
    this.weChat.share({
        type: 1,
        scene: 1, // 分享到朋友圈
        imageUrl: '/static/share-image.png', // 本地图片路径
        success: (res) => {
            console.log('✅ 图片分享成功')
        },
        fail: (error) => {
            console.error('❌ 图片分享失败:', error)
        }
    })
}
```

#### 3. 分享网页

#### uni-app x 版本

```typescript
shareWebPage() {
    this.weChat?.share({
        type: 3,
        scene: 0,
        title: '网页标题',
        desc: '网页描述信息',
        href: 'https://www.example.com',
        imageUrl: '/static/webpage-thumb.png', // 缩略图
		thumbImageUrl: '/static/share-thumb-image.png', // 本地图片路径
        success: (res) => {
            console.log('✅ 网页分享成功')
        },
        fail: (error) => {
            console.error('❌ 网页分享失败:', error)
        }
    } as wxsdk.TTWeChatShareOptions)
}
```

#### uni-app 版本

```javascript
shareWebPage() {
    this.weChat.share({
        type: 3,
        scene: 0,
        title: '网页标题',
        desc: '网页描述信息',
        href: 'https://www.example.com',
        imageUrl: '/static/webpage-thumb.png', // 缩略图
		thumbImageUrl: '/static/share-thumb-image.png', // 本地图片路径
        success: (res) => {
            console.log('✅ 网页分享成功')
        },
        fail: (error) => {
            console.error('❌ 网页分享失败:', error)
        }
    })
}
```

#### 4. 分享小程序

#### uni-app x 版本

```typescript
shareMiniProgram() {
    this.weChat?.share({
        type: 4,
        scene: 0,
        title: '小程序标题',
        desc: '小程序描述',
		thumbImageUrl: '/static/share-thumb-image.png', // 本地图片路径
        miniProgram: {
            userName: 'gh_xxxxxxxxxxxx', // 小程序原始ID
            path: 'pages/index/index',   // 小程序页面路径
            webpageUrl: 'https://www.example.com', // 兼容网页
            miniProgramType: 0 // 正式版
        } as wxsdk.TTWeChatShareMiniProgramOptions,
        success: (res) => {
            console.log('✅ 小程序分享成功')
        },
        fail: (error) => {
            console.error('❌ 小程序分享失败:', error)
        }
    } as wxsdk.TTWeChatShareOptions)
}
```

#### uni-app 版本

```javascript
shareMiniProgram() {
    this.weChat.share({
        type: 4,
        scene: 0,
        title: '小程序标题',
        desc: '小程序描述',
		thumbImageUrl: '/static/share-thumb-image.png', // 本地图片路径
        miniProgram: {
            userName: 'gh_xxxxxxxxxxxx', // 小程序原始ID
            path: 'pages/index/index',   // 小程序页面路径
            webpageUrl: 'https://www.example.com', // 兼容网页
            miniProgramType: 0 // 正式版
        },
        success: (res) => {
            console.log('✅ 小程序分享成功')
        },
        fail: (error) => {
            console.error('❌ 小程序分享失败:', error)
        }
    })
}
```

## 微信支付功能

> 💡 调用微信客户端进行支付，支付参数需要从后端服务器获取

### 参数说明

#### TTWeChatPayOptions

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| partnerId | string | ✅ | 商家向财付通申请的商家ID |
| prepayId | string | ✅ | 预支付订单ID |
| nonceStr | string | ✅ | 随机字符串，不超过32位 |
| timeStamp | number | ✅ | 时间戳，防重发 |
| package | string | ✅ | 扩展字段，统一下单接口返回的prepay_id参数值 |
| sign | string | ✅ | 签名，根据微信开放平台文档生成 |

### 示例代码

#### uni-app x 版本

```typescript
// 微信支付
handleWeChatPay() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    // 从后端获取支付参数
    this.getPaymentParams().then(params => {
        this.weChat?.pay({
            partnerId: params.partnerId,
            prepayId: params.prepayId,
            nonceStr: params.nonceStr,
            package: params.package,
            timeStamp: params.timeStamp,
            sign: params.sign,
            success: (res) => {
                console.log("✅ 支付成功");
                uni.showToast({
                    title: '支付成功',
                    icon: 'success'
                })
                // 处理支付成功逻辑
                this.handlePaymentSuccess(res)
            },
            fail: (error) => {
                console.error("❌ 支付失败:", error);
                uni.showToast({
                    title: '支付失败',
                    icon: 'error'
                })
                // 处理支付失败逻辑
                this.handlePaymentFail(error)
            }
        } as wxsdk.TTWeChatPayOptions);
    })
}

// 从后端获取支付参数
getPaymentParams() {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://your-server.com/api/wechat/pay',
            method: 'POST',
            data: {
                orderId: 'your_order_id',
                amount: 100, // 支付金额（分）
            },
            success: (res) => {
                if (res.data.success) {
                    resolve(res.data.payParams)
                } else {
                    reject(res.data.message)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
```

#### uni-app 版本

```javascript
// 微信支付
handleWeChatPay() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    // 从后端获取支付参数
    this.getPaymentParams().then(params => {
        this.weChat.pay({
            partnerId: params.partnerId,
            prepayId: params.prepayId,
            nonceStr: params.nonceStr,
            package: params.package,
            timeStamp: params.timeStamp,
            sign: params.sign,
            success: (res) => {
                console.log("✅ 支付成功");
                uni.showToast({
                    title: '支付成功',
                    icon: 'success'
                })
                // 处理支付成功逻辑
                this.handlePaymentSuccess(res)
            },
            fail: (error) => {
                console.error("❌ 支付失败:", error);
                uni.showToast({
                    title: '支付失败',
                    icon: 'error'
                })
                // 处理支付失败逻辑
                this.handlePaymentFail(error)
            }
        });
    })
}

// 从后端获取支付参数
getPaymentParams() {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://your-server.com/api/wechat/pay',
            method: 'POST',
            data: {
                orderId: 'your_order_id',
                amount: 100, // 支付金额（分）
            },
            success: (res) => {
                if (res.data.success) {
                    resolve(res.data.payParams)
                } else {
                    reject(res.data.message)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
```

### 重要注意事项

⚠️ **安全提示**：
- 支付参数必须从服务器端获取，绝不可在客户端生成
- 签名算法严格按照微信支付文档执行
- 支付前建议先检测微信是否安装
- 支付结果需要通过服务器回调验证，不能仅依赖客户端返回

## 打开微信小程序

> 💡 从您的应用直接跳转到指定的微信小程序

### 参数说明

#### TTWeChatLaunchMiniProgramOptions

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userName | string | ✅ | 小程序原始ID (以 gh_ 开头) |
| path | string | ✅ | 小程序页面路径 |
| miniProgramType | number | ❌ | 版本类型：0-正式版，1-开发版，2-体验版（默认0） |

### 示例代码

#### uni-app x 版本

```typescript
// 打开微信小程序
openMiniProgram() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat?.launchMiniProgram({
        userName: "gh_xxxxxxxxxxxx", // 小程序原始ID
        path: "pages/index/index?param=value", // 可以带参数
        miniProgramType: 0, // 正式版
        success: (e) => {
            console.log("✅ 成功打开小程序");
        },
        fail: (err) => {
            console.error("❌ 打开小程序失败:", err);
            uni.showToast({
                title: '打开失败',
                icon: 'error'
            })
        }
    } as wxsdk.TTWeChatLaunchMiniProgramOptions);
}
```

#### uni-app 版本

```javascript
// 打开微信小程序
openMiniProgram() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat.launchMiniProgram({
        userName: "gh_xxxxxxxxxxxx", // 小程序原始ID
        path: "pages/index/index?param=value", // 可以带参数
        miniProgramType: 0, // 正式版
        success: (e) => {
            console.log("✅ 成功打开小程序");
        },
        fail: (err) => {
            console.error("❌ 打开小程序失败:", err);
            uni.showToast({
                title: '打开失败',
                icon: 'error'
            })
        }
    });
}
```

## 打开微信客服

> 💡 打开企业微信客服功能，为用户提供在线客服支持

### 参数说明

#### TTWeChatOpenCustomerServiceOptions

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| corpId | string | ✅ | 企业微信的企业ID |
| url | string | ✅ | 客服会话URL |

### 示例代码

#### uni-app x 版本

```typescript
// 打开微信客服
openCustomerService() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat?.openCustomerService({
        corpId: 'your_corp_id', // 企业微信ID
        url: 'https://work.weixin.qq.com/kf/xxx', // 客服URL
        success: (e) => {
            console.log("✅ 成功打开客服");
        },
        fail: (err) => {
            console.error("❌ 打开客服失败:", err);
            uni.showToast({
                title: '打开客服失败',
                icon: 'error'
            })
        }
    } as wxsdk.TTWeChatOpenCustomerServiceOptions);
}
```

#### uni-app 版本

```javascript
// 打开微信客服
openCustomerService() {
    // 先检查微信是否安装
    if (this.checkWeChatInstalled() == false) {
        return
    }
    
    this.weChat.openCustomerService({
        corpId: 'your_corp_id', // 企业微信ID
        url: 'https://work.weixin.qq.com/kf/xxx', // 客服URL
        success: (e) => {
            console.log("✅ 成功打开客服");
        },
        fail: (err) => {
            console.error("❌ 打开客服失败:", err);
            uni.showToast({
                title: '打开客服失败',
                icon: 'error'
            })
        }
    });
}
```

## 获取微信开放平台标签启动参数

> 💡 当用户从微信跳转到您的应用时，可以获取微信传递的启动参数（extData）

### 使用场景

- 用户点击微信消息中的链接跳转到应用
- 从微信分享的内容跳转回应用
- 需要根据微信传递的参数进行页面跳转或业务处理

### 参数说明

#### TTWeChatLaunchFromWXSuccess

| 参数 | 类型 | 说明 |
|------|------|------|
| data | string \| null | 从微信跳转过来的数据（extData 字符串） |

### 示例代码

#### uni-app x 版本

```typescript
// 在 onLoad 中设置监听
onLoad() {
    // 初始化微信SDK
    this.weChat = wxsdk.getTTWeChatSDK();
    this.initWeChatSDK();
    
    // 设置监听微信跳转事件
    this.setupLaunchListener();
}

// 设置监听微信跳转事件
setupLaunchListener() {
    this.weChat?.onLaunchFromWX({
        success: (res) => {
            console.log("✅ 监听到从微信跳转事件");
            console.log("启动参数:", res.data);
            
            // 处理启动参数
            if (res.data != null && res.data.length > 0) {
                try {
                    // 如果 extData 是 JSON 字符串，可以解析
                    const params = JSON.parse(res.data);
                    console.log("解析后的参数:", params);
                    
                    // 根据参数进行业务处理
                    this.handleLaunchParams(params);
                } catch (e) {
                    // 如果不是 JSON，直接使用字符串
                    console.log("启动参数（字符串）:", res.data);
                    this.handleLaunchParams(res.data);
                }
            }
            
            uni.showToast({
                title: '从微信跳转成功',
                icon: 'success'
            });
        },
        fail: (err) => {
            console.error("❌ 监听微信跳转事件失败:", err);
        },
        complete: (res) => {
            console.log("微信跳转事件监听完成:", res);
        }
    } as wxsdk.TTWeChatLaunchFromWXOptions);
}

// 处理启动参数
handleLaunchParams(params: any) {
    // 根据参数进行页面跳转或业务处理
    // 例如：跳转到指定页面
    if (params.page) {
        uni.navigateTo({
            url: params.page
        });
    }
    
    // 例如：设置用户信息
    if (params.userId) {
        // 处理用户ID
    }
}

// 取消监听（在 onUnmounted 中调用）
onUnload() {
    this.weChat?.offLaunchFromWX();
}
```

#### uni-app 版本

```javascript
// 在 onLoad 中设置监听
onLoad() {
    // 初始化微信SDK
    this.weChat = wxsdk.getTTWeChatSDK();
    this.initWeChatSDK();
    
    // 设置监听微信跳转事件
    this.setupLaunchListener();
}

// 设置监听微信跳转事件
setupLaunchListener() {
    this.weChat.onLaunchFromWX({
        success: (res) => {
            console.log("✅ 监听到从微信跳转事件");
            console.log("启动参数:", res.data);
            
            // 处理启动参数
            if (res.data != null && res.data.length > 0) {
                try {
                    // 如果 extData 是 JSON 字符串，可以解析
                    const params = JSON.parse(res.data);
                    console.log("解析后的参数:", params);
                    
                    // 根据参数进行业务处理
                    this.handleLaunchParams(params);
                } catch (e) {
                    // 如果不是 JSON，直接使用字符串
                    console.log("启动参数（字符串）:", res.data);
                    this.handleLaunchParams(res.data);
                }
            }
            
            uni.showToast({
                title: '从微信跳转成功',
                icon: 'success'
            });
        },
        fail: (err) => {
            console.error("❌ 监听微信跳转事件失败:", err);
        },
        complete: (res) => {
            console.log("微信跳转事件监听完成:", res);
        }
    });
}

// 处理启动参数
handleLaunchParams(params) {
    // 根据参数进行页面跳转或业务处理
    // 例如：跳转到指定页面
    if (params.page) {
        uni.navigateTo({
            url: params.page
        });
    }
    
    // 例如：设置用户信息
    if (params.userId) {
        // 处理用户ID
    }
}

// 取消监听（在 onUnload 中调用）
onUnload() {
    this.weChat.offLaunchFromWX();
}
```

### 重要提示

⚠️ **监听时机**：
- 建议在应用启动时（`onLoad` 或 `onMounted`）立即设置监听
- SDK 支持冷启动场景，即使应用未运行也能正确接收参数

⚠️ **参数格式**：
- `extData` 是字符串类型，可以是普通字符串或 JSON 字符串
- 建议在分享时使用 JSON 格式传递结构化数据

⚠️ **内存管理**：
- 在页面销毁时（`onUnload` 或 `onUnmounted`）调用 `offLaunchFromWX()` 取消监听
- 避免内存泄漏

### 完整示例

```typescript
// 分享时传递参数
shareWithParams() {
    // 准备要传递的参数
    const shareParams = {
        page: '/pages/detail/detail',
        id: '12345',
        type: 'product'
    };
    
    // 将参数转为 JSON 字符串（微信分享的 extData）
    const extData = JSON.stringify(shareParams);
    
    // 分享网页（在分享时设置 extData）
    this.weChat?.share({
        type: 3,
        scene: 0,
        title: '分享标题',
        desc: '分享描述',
        href: 'https://www.example.com',
        // 注意：extData 需要在微信开放平台配置，这里只是示例
        success: (res) => {
            console.log('分享成功，用户点击后会跳转回应用');
        }
    });
}

// 接收参数并处理
setupLaunchListener() {
    this.weChat?.onLaunchFromWX({
        success: (res) => {
            if (res.data) {
                const params = JSON.parse(res.data);
                // 跳转到指定页面
                uni.navigateTo({
                    url: `${params.page}?id=${params.id}&type=${params.type}`
                });
            }
        }
    });
}
```

## 错误处理

### 错误码说明

| 错误码 | 错误信息 | 适用场景 | 解决方案 |
|--------|----------|----------|----------|
| **基础错误** ||||
| 101 | 未安装微信 | 所有功能 | 提示用户安装微信客户端 |
| 102 | SDK未初始化或初始化失败 | 所有功能 | 检查SDK初始化参数，重新注册 |
| **分享错误** ||||
| 301 | type参数非法 | 分享功能 | 检查分享类型参数(0-5) |
| 302 | scene参数非法 | 分享功能 | 检查分享场景参数(0-2) |
| 303 | imageUrl不能为空 | 图片分享 | 提供有效的本地图片路径 |
| 304 | 图片类型的分享imageUrl参数异常 | 图片分享 | 检查图片路径和文件格式 |
| 305 | title不能为空 | 文本分享 | 提供分享标题 |
| 306 | videoUrl不能为空 | 视频分享 | 提供有效的视频链接 |
| 307 | href不能为空 | 网页分享 | 提供有效的网页链接 |
| 308 | miniProgram不能为空 | 小程序分享 | 提供完整的小程序信息 |
| 309 | musicUrl不能为空 | 音乐分享 | 提供有效的音乐链接 |
| **交互状态** ||||
| 901 | 已取消 | 所有功能 | 根据业务忽略或提示用户 |
| 902 | 被拒绝 | 所有功能 | 提示用户授权或重试 |
| **小程序相关** ||||
| 401 | userName不能为空 | 打开小程序 | 提供小程序原始ID |
| 402 | path不能为空 | 打开小程序 | 提供小程序页面路径 |
| 310 | userName不能为空（兼容编码） | 打开小程序 | 与401等价，按同样方式处理 |
| 311 | path不能为空（兼容编码） | 打开小程序 | 与402等价，按同样方式处理 |
| **客服相关** ||||
| 501 | corpId不能为空 | 打开客服 | 提供企业微信ID |
| 502 | url不能为空 | 打开客服 | 提供客服会话URL |
| **其他错误** ||||
| 999 | 其他错误 | 所有功能 | 查看微信原始错误码和详细信息 |
| 1000 | 暂无支持 | 所有功能 | 当前平台不支持此功能 |



## 常见问题

### 1. 找不到插件方法？
**解决方案**: 确保使用自定义基座运行，标准基座不包含原生插件。

### 2. iOS平台分享/登录无响应？
**解决方案**: 
- 检查 `uni_modules/tt-wechat-pro/utssdk/app-ios/Info.plist` 中的 URL Scheme 配置
- 确认通用链接配置正确
- 验证微信开放平台的 iOS 应用配置

### 3. Android平台功能异常？
**解决方案**:
- 确认应用签名与微信开放平台配置一致
- 检查包名是否正确
- 确保微信客户端版本支持相关功能

### 4. 分享图片失败？
**解决方案**:
- 确保图片路径为本地路径
- 检查图片文件是否存在
- 图片大小不要超过限制（建议小于32KB）

### 5. 小程序跳转失败？
**解决方案**:
- 确认小程序原始ID正确（以 gh_ 开头）
- 检查小程序是否已发布
- 验证跳转路径是否存在

### 6. 支付功能失败？
**解决方案**:
- 确保支付参数从服务器正确获取
- 检查签名算法是否正确
- 验证商户配置是否完整
- 确认微信客户端支持支付功能

### 7. HarmonyOS平台问题？
**常见问题**:
- **配置不完整**: 只添加了 `querySchemes` 导致应用无法正常运行
- **功能异常**: 使用了不支持的音乐分享功能

**解决方案**:
- 在正确路径 `harmony-configs/entry/src/main/module.json5` 创建配置文件
- 使用文档提供的**完整** `module.json5` 模板配置
- 确认 `querySchemes` 数组包含 `"weixin"` 和 `"wxopensdk"`
- 检查所有默认配置项是否保留（abilities、permissions等）
- 避免使用音乐分享功能（平台不支持）

## 📞 技术支持

如果在使用过程中遇到问题，请：
1. 查阅上方常见问题
2. 参考微信官方开发文档
3. 检查配置是否正确
4. 确认微信客户端版本

---

**祝您开发愉快！** 🎉