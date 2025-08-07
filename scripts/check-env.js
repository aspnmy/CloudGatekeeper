const fs = require('fs');
const path = require('path');

function checkEnvironment() {
    const requiredVars = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'];
    const missingVars = [];

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    });

    if (missingVars.length > 0) {
        console.error('错误: 缺少必要的环境变量:');
        missingVars.forEach(varName => {
            console.error(`  - ${varName}`);
        });
        process.exit(1);
    }

    console.log('✅ 环境变量检查通过');
}

checkEnvironment();
