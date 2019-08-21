//运行方式，命令行
//node run-example1.js

const devlop=require('../devlop')
const config={
    host: '47.94.221.203',
    username: 'root',
    port: 22,
    password:'123456',
    path:'/root/FE/realbox/',
}
devlop(config)
