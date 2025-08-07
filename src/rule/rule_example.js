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
