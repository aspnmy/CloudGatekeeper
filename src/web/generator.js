// 定义全局密码常量
const cWTPD = WTPD; // 这里设置你的默认密码

// 添加验证状态管理
let isAuthenticated = false;

function verifyPassword() {
    const password = document.getElementById('authPassword').value;
    if (password === cWTPD) {
        isAuthenticated = true;
        document.querySelector('.auth-form').style.display = 'none';
        document.querySelector('.auth-buttons').style.display = 'none';
        document.querySelector('.rule-form').style.display = 'block';
        document.querySelector('.rule-preview').style.display = 'block';
    } else {
        alert('密码错误！请重试');
    }
}

function generateRule() {
    if (!isAuthenticated) {
        alert('请先进行密码验证！');
        return;
    }
    const ruleName = document.getElementById('ruleName').value;
    const targetHost = document.getElementById('targetHost').value;
    const method = document.getElementById('method').value;
    const responseType = document.getElementById('responseType').value;
    const customLogic = document.getElementById('customLogic').value;

    const template = `// filepath: src/rule/rule_${ruleName}.js
export async function handleRequest(request) {
    try {
        const url = new URL(request.url);
        url.host = "${targetHost}";

        ${customLogic || `
        const newRequest = new Request(url.toString(), {
            method: "${method}",
            headers: new Headers(request.headers),
            body: request.body,
        });

        const response = await fetch(newRequest);`}

        return new Response(${responseType === 'json' ? 'JSON.stringify(await response.json())' : 'await response.text()'}, {
            headers: {
                'Content-Type': '${responseType === 'json' ? 'application/json' : responseType === 'html' ? 'text/html' : 'text/plain'}',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(\`Error: \${error.message}\`, { status: 500 });
    }
}`;

    document.getElementById('ruleCode').textContent = template;
}

function copyRule() {
    if (!isAuthenticated) {
        alert('请先进行密码验证！');
        return;
    }
    const code = document.getElementById('ruleCode').textContent;
    navigator.clipboard.writeText(code);
    alert('规则代码已复制到剪贴板！');
}

function downloadRule() {
    if (!isAuthenticated) {
        alert('请先进行密码验证！');
        return;
    }
    const ruleName = document.getElementById('ruleName').value;
    const code = document.getElementById('ruleCode').textContent;
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rule_${ruleName}.js`;
    a.click();
    URL.revokeObjectURL(url);
}
