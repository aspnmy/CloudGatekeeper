const DUCKDUCKGO_HOST = 'duckduckgo.com';

export async function handleRequest(request) {
    try {
        const url = new URL(request.url);
        const searchQuery = url.searchParams.get('wd') || '';
        
        // 构建 DuckDuckGo 搜索 URL
        const searchUrl = new URL('https://' + DUCKDUCKGO_HOST);
        searchUrl.searchParams.set('q', searchQuery);
        
        // 发起搜索请求
        const response = await fetch(searchUrl.toString(), {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 获取响应内容
        const content = await response.text();
        
        // 返回处理后的响应
        return new Response(content, {
            status: response.status,
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        return new Response(`搜索处理错误: ${error.message}`, {
            status: 500,
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
