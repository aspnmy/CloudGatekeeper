const OPENAI_API_HOST = "gateway.cf.shdrr.org";

// 添加使用说明HTML内容
const USAGE_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>CloudGatekeeper 使用说明</title>
    <style>
        body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .example { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        code { background: #e0e0e0; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>CloudGatekeeper 使用说明</h1>
    
    <h2>基本用法</h2>
    <div class="example">
        <p>默认规则：<br>
        <code>${OPENAI_API_HOST}/</code></p>
    </div>

    <h2>规则调用</h2>
    <div class="example">
        <p>使用特定规则：<br>
        <code>${OPENAI_API_HOST}/?key=规则名称</code></p>
        
        <p>常用规则示例：</p>
        <ul>
            <li>DuckDuckGo搜索：<br>
            <code>${OPENAI_API_HOST}/?key=duckduckgo&wd=搜索关键词</code></li>
            <li>自定义规则：<br>
            <code>${OPENAI_API_HOST}/?key=custom&参数名=参数值</code></li>
        </ul>
    </div>

    <h2>工具访问</h2>
    <div class="example">
        <p>规则生成器：<br>
        <code>${OPENAI_API_HOST}/?webtools</code></p>
    </div>

    <h2>请求头要求</h2>
    <div class="example">
        <p>所有请求需要包含Authorization头：<br>
        <code>Authorization: Bearer your-token</code></p>
    </div>
    
    <h2>更多信息</h2>
    <p>访问 <a href="https://github.com/aspnmy/CloudGatekeeper">GitHub仓库</a> 获取更多信息。</p>
</body>
</html>
`;

// 添加web工具HTML内容
const WEB_TOOLS_HTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=src/web/rule-generator.html">
    <title>重定向到规则生成器</title>
</head>
<body>
    <p>正在跳转到规则生成器...</p>
</body>
</html>
`;

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
//在请求头中使用 X-Rule-Key 指定要使用的规则
async function handleRequest(request) {
    try {
        const url = new URL(request.url);
        
        // 检查是否有任何查询参数
        if (url.search === '') {
            return new Response(USAGE_HTML, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 检查是否访问web工具
        if (url.searchParams.has('webtools')) {
            return new Response(WEB_TOOLS_HTML, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 添加 CORS 支持
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Rule-Key',
                }
            });
        }

        // 网页访问模式不需要传Authorization
        // // 基本请求验证
        // if (!request.headers.get('Authorization')) {
        //     return new Response('Missing Authorization header', { status: 401 });
        // }

        // 从 URL 查询参数获取规则标识
        const ruleKey = url.searchParams.get('key') ;
        
        try {
            // 更新规则文件路径
            const rulePath = `./src/rule/rule_${ruleKey}.js`;
            const ruleModule = await import(rulePath);
            
            if (ruleModule && typeof ruleModule.handleRequest === 'function') {
                return await ruleModule.handleRequest(request);
            }
        } catch (importError) {
            console.error(`规则加载失败[${ruleKey}]: ${importError.message}`);
        }
        
        // 默认处理逻辑
        url.host = OPENAI_API_HOST;
        // 移除key参数，避免传递给目标服务器
        url.searchParams.delete('key');

        const newRequest = new Request(url.toString(), {
            method: request.method,
            headers: new Headers(request.headers),
            body: request.body,
            redirect: 'follow',
        });

        const response = await fetch(newRequest);
        
        // 添加 CORS 头到响应
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        
        return new Response(response.body, {
            status: response.status,
            headers: newHeaders,
        });

    } catch (error) {
        console.error(`请求处理错误: ${error.message}`);
        return new Response(`Error: ${error.message}`, { 
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }
}