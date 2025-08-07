const OPENAI_API_HOST = "gateway.cf.shdrr.org";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
//在请求头中使用 X-Rule-Key 指定要使用的规则
async function handleRequest(request) {
    try {
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

        // 基本请求验证
        if (!request.headers.get('Authorization')) {
            return new Response('Missing Authorization header', { status: 401 });
        }

        // 从 URL 查询参数获取规则标识
        const url = new URL(request.url);
        const ruleKey = url.searchParams.get('key') || 'default';
        
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