# toGoGG 项目

## 项目介绍
toGoGG 是一个基于 Cloudflare Workers 的动态路由代理系统，支持通过 URL 参数动态加载不同的规则处理请求。

## 快速开始

### 安装
```bash
npm install
```

### 开发
```bash
npm run dev      # 远程开发模式
npm run dev-l    # 本地开发模式
```

### 部署
```bash
npm run bud      # 部署到 Cloudflare Workers
```

## 目录结构
```
toGoGG/
├── index.js          # 主入口文件
├── api.js           # API接口封装
└── src/
    └── rule/        # 规则文件目录
        ├── rule_default.js    # 默认规则
        ├── rule_duckgo.js     # DuckDuckGo搜索规则
        └── ...                # 其他规则文件
```

## 使用方法

### 基本请求格式
```
https://[worker-domain]/?key=[rule-name]&[other-params]
```

### 请求头要求
```
Authorization: Bearer your-token
```

### 示例访问
1. 默认规则：
```
https://gateway.cf.shdrr.org/
```

2. DuckDuckGo搜索：
```
https://gateway.cf.shdrr.org/?key=duckgo&wd=搜索关键词
```

## 规则开发指南

### 规则文件模板
```javascript
// src/rule/rule_example.js
export async function handleRequest(request) {
    try {
        // 处理逻辑
        return new Response('响应内容', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
    }
}
```

### API调用示例
```javascript
import { RuleAPI } from './api.js';

const api = new RuleAPI();
api.setApiKey('your-api-key');

// 调用特定规则
const response = await api.callRule('custom', {
    data: 'your-data'
});
```

## 注意事项
1. 所有规则文件必须放在 `src/rule` 目录下
2. 规则文件命名必须遵循 `rule_*.js` 格式
3. 每个规则文件必须导出 `handleRequest` 函数
4. 确保请求包含有效的 Authorization header

## 错误处理
系统会自动处理以下错误：
- 规则加载失败
- 请求处理错误
- 认证失败

## 许可证
ISC
