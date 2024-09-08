const OPENAI_API_HOST = "api.groq.com";

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // 克隆请求的 URL 并替换主机为 OPENAI_API_HOST
    const url = new URL(request.url);
    url.host = OPENAI_API_HOST;

    // 构建新的请求，将原始请求的头部、方法和主体传递给新请求
    const newRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
    });

    // 将新的请求发送到目标 API 并返回响应
    return await fetch(newRequest);
}