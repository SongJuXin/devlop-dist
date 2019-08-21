const _path = require('path')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()

/**
 *
 * @param host 主机名
 * @param username 用户名
 * @param port 远程连接的端口
 * @param path 上传目录，即dist所在目录
 * @param password 远程走账号密码方式密码
 * @param privateKey 远程走秘钥方式的私钥路径
 * @param baseURL app*.js里的baseURL，需包含http://。默认取http://host:8881
 */
module.exports=function({host,username,port,path,password,privateKey,baseURL}){
    const config=arguments[0]||{}
    const remotePath=config.path
    ssh.connect({
        tryKeyboard: true,
        onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
            console.log(name, instructions, instructionsLang, prompts, finish)
            if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
                finish([password])
            }
        },
        ...config,
    }).then(function () {
        console.log('connect success')
        const failed = []
        const successful = []
        ssh.exec('sudo',['rm -rf '+remotePath+'dist'],{cwd:remotePath,options:{pty:true},stdin:config.password+'\n'}).then(result=>{
            console.log('rm dist:',result,'。。。')
            console.log(`putDirectory`)
            ssh.putDirectory('dist', remotePath+'dist', {
                recursive: true,
                concurrency: 5,
                validate: function (itemPath) {
                    const baseName = _path.basename(itemPath)
                    return baseName.substr(0, 1) !== '.' && // do not allow dot files
                        baseName !== 'node_modules' // do not allow node_modules
                },
                tick: function (localPath, remotePath, error) {
                    if (error) {
                        failed.push(localPath)
                    } else {
                        successful.push(localPath)
                    }
                }
            }).then(status=>{
                console.log('the directory transfer was', status,status ? 'successful' : 'unsuccessful')
                console.log('failed transfers:', failed.join(', '))
                const baseURL=typeof config.baseURL==='string'?config.baseURL:`http://${config.host}:8881`
                ssh.exec(`sed -i 's#baseURL:".*",timeout#baseURL:"${baseURL}",timeout#g' dist/js/app.*`,[],{cwd:remotePath}).then(data=>{
                    console.log('sed:',data)
                    ssh.exec('date +%s').then(time=>{
                        console.log('time:',time)
                        ssh.exec(`if [ ! -d history ];then mkdir  history; fi`,[''],{cwd:remotePath}).then(result=>{
                            console.log('mkdir history:',result)
                            ssh.exec(`mkdir history/${time}`,[''],{cwd:remotePath}).then(result=>{
                                console.log(`mkdir ${time}:`,result)
                                ssh.exec(`cp -r dist history/${time}`,[''],{cwd:remotePath}).then(result=>{
                                    console.log(`cp: to history/dist${time}` )
                                    console.log('success')
                                    ssh.dispose()

                                })

                            })

                        })
                    })
                })
            })


        })
    }).catch(err=>{
        console.log('err:',err)
        ssh.dispose()

    })

}
