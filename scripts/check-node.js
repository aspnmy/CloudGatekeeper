const requiredVersion = '20.18.0';

if (process.version.localeCompare(requiredVersion, undefined, { numeric: true }) < 0) {
    console.error(`需要 Node.js ${requiredVersion} 或更高版本`);
    console.error('请运行以下命令切换版本：');
    console.error('nvm use 20.18.0');
    process.exit(1);
}
