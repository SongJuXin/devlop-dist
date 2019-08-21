//运行方式，命令行
//node run-example2.js  -- ENV=example

const devlop=require('../devlop')
const envConfigs={
    example:{
        host: '47.94.221.203',
        username: 'root',
        port: 22,
        password:'#D&jriqs',
        path:'/root/FE/realbox/',
    }
}

const arg=process.argv.splice(2)
const argObj=arg.reduce((obj,item)=>{
    const arr=item.split('=')
    obj[arr[0]]=arr[1]
    return obj
},{})
const RunExample2=argObj.ENV
const config=envConfigs[RunExample2]
console.log('config',config)
devlop(config)
