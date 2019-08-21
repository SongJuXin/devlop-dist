### 功能
上传静态资源到服务器上,替换baseURL,并自动创建备份目录history

### 运行环境
nodev10.15.3

### 运行方式
在项目根目录创建run.js文件:
```run.js
const devlop=require('../devlop')
const config={
    host: '47.94.221.203',
    username: 'root',
    port: 22,
    password:'123456',
    path:'/root/FE/realbox/',
}
devlop(config)
```
命令行执行`node run.js`


### 已知错误
1. UnhandledPromiseRejectionWarning: Error: Failure

    解决方法：重新运行
