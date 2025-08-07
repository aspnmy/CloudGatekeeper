# CloudGatekeeper 云守门人

## 项目介绍

CloudGatekeeper 是一个基于 Cloudflare Workers 的动态路由代理系统，支持通过 URL 参数动态加载不同的规则处理请求。

## 快速开始

### 安装

```bash
npm install
```

### 开发命令

```bash
npm run dev      # 远程开发模式
npm run dev-l    # 本地开发模式
npm run bud      # 部署到 Cloudflare Workers
```

## 使用方法

### 基本访问

- 使用说明页面：`https://gateway.cf.shdrr.org/`
- 规则生成器：`https://gateway.cf.shdrr.org/?webtools`

### 规则调用

基本格式：

```
https://gateway.cf.shdrr.org/?key=规则名称&参数名=参数值
```

常用规则示例：

- DuckDuckGo搜索：
  ```
  https://gateway.cf.shdrr.org/?key=duckgo&wd=搜索关键词
  ```
- 自定义规则：
  ```
  https://gateway.cf.shdrr.org/?key=custom&参数名=参数值
  ```

### 请求头要求

所有请求需要包含 Authorization 头：

```
Authorization: Bearer your-token
```

## 规则开发

### 目录结构

```
CloudGatekeeper/
├── index.js          # 主入口文件
├── api.js           # API接口封装
└── src/
    ├── web/         # Web工具目录
    │   ├── rule-generator.html    # 规则生成器页面
    │   ├── generator.js          # 生成器逻辑
    │   └── style.css            # 样式文件
    └── rule/        # 规则文件目录
        ├── rule_default.js      # 默认规则
        ├── rule_duckgo.js       # DuckDuckGo搜索规则
        └── ...                  # 其他规则文件
```

### 规则生成器

1. 访问 `/?webtools` 进入规则生成器
2. 输入管理密码（WTPD）验证身份**（WTPD部署在Cloudflare Workers的设置区域，不用明文部署)**
3. 填写规则配置信息
4. 生成并下载规则文件
5. 将规则文件放入 `src/rule` 目录

### 规则文件模板

```javascript
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

## 特性

- 动态规则加载
- Web可视化规则生成器
- 完整的CORS支持
- 请求验证机制
- 错误处理机制

## 安全说明

- 所有请求需要验证 Authorization 头
- 规则生成器需要管理密码（WTPD）
- 支持 CORS 安全配置

## 许可证

ISC
