const API_VERSION = 'v1';
const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': '' // 需要在使用时设置
};

class RuleAPI {
    constructor(baseURL, apiKey) {
        this.baseURL = baseURL || 'https://gateway.cf.shdrr.org';
        this.headers = { ...DEFAULT_HEADERS };
        if (apiKey) {
            this.headers['Authorization'] = `Bearer ${apiKey}`;
        }
    }

    async callRule(ruleName, data = {}, options = {}) {
        try {
            const url = new URL(`${this.baseURL}/api/${API_VERSION}`);
            url.searchParams.set('key', ruleName);

            const response = await fetch(url.toString(), {
                method: options.method || 'POST',
                headers: {
                    ...this.headers,
                    ...options.headers
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`规则调用失败[${ruleName}]:`, error);
            throw error;
        }
    }

    setApiKey(apiKey) {
        this.headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // 便捷方法
    async chat(messages, ruleName = 'default') {
        return this.callRule(ruleName, { messages });
    }

    async complete(prompt, ruleName = 'default') {
        return this.callRule(ruleName, { prompt });
    }
}

// 导出API类和工具函数
export {
    RuleAPI,
    API_VERSION
};

// 使用示例
/*
const api = new RuleAPI('https://your-worker.dev', 'your-api-key');

// 调用默认规则
const response1 = await api.chat([
    { role: 'user', content: 'Hello!' }
]);

// 调用特定规则
const response2 = await api.callRule('custom', {
    prompt: 'Hello!',
    options: { temperature: 0.7 }
});
*/
