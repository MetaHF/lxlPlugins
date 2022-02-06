
const PATH = {
    MAIN: "./plugins/lightDEV/LF_Music",
    MUSIC: "./plugins/lightDEV/LF_Music/DATA/music/",
    DATA: "./plugins/lightDEV/LF_Music/DATA/data.json"
}

var config = new JsonConfigFile(PATH.MAIN + "/config.json",
    `{
    "sounds":{
      "postfix": ["ogg"],
      "category" : "music",
      "prefix": "music.game.",
      "stream": true,
      "?stream": "此为流式传输具体看 wiki"
    },
    "usrGUI":{
      "enable": true,
      "defaultTEXT": "歌曲{name}",
      "musicCMD":{
          "enable": true
      },
      "playsoundCMD":{
          "enable": true
      }
    },
    "serverRES": "./development_resource_packs/serverMusicRE/",
    "worldJson": "./worlds/Bedrock level/world_resource_packs.json",
    "version": [0,0,1],
    "reference": false
      }`)

var DataCfg
var DataArry

mc.listen("onServerStarted", function () {
    DataCfg = new JsonConfigFile(PATH.DATA, `
	{
	 "music": [

		]
	}
    `)
    DataArry = DataCfg.get("music")

    //无资源包不执行动作
    var enable = true


    //设置输出日志
    logger.setConsole(true, 4)


    if (File.exists(config.get("serverRES")) == false) {
        //无资源包不执行动作
        setTimeout('logger.error(`请将资源包放到 ${config.get("serverRES")} 的上一级目录，且名字为最后的/目录名字/`)', 2000)
        enable = false

    }
    if (File.exists(config.get("worldJson")) == false) {
        
        let wRES = new JsonConfigFile(config.get("worldJson"), `[]`)
        wRES.close()
    }
    if (File.exists(PATH.MUSIC) == false) {
        File.mkdir(PATH.MUSIC)
    }



})

mc.listen("onPlayerCmd", function (pl, cmd) {
    if (cmd == "refLF_M" || cmd == "MUCmenu")
        return false
})



//if (enable == true && (cmd == "refLF_M" || cmd == "MUCmenu"))

mc.regConsoleCmd('reflf', '', function () { })

mc.listen("onConsoleCmd", function (cmd) {
    if (cmd == 'reflf') {
        refMusic()
        return false
    }
})

//调试 用


mc.regPlayerCmd("reflf_m", "刷新LF_muic的音乐文件", function (pl, arg) {
    refMusic()
}, 1)
mc.regPlayerCmd("mucmenu", "召唤音乐菜单界面", function (pl, arg) {
    usrGUI(pl.xuid)
})





function refMusic() {

    const musicArry = copyFL(PATH.MUSIC, config.get("serverRES") + "sounds/music/", config.get("sounds")["postfix"])

    writeRandD(musicArry, config.get("serverRES") + 'sounds/sound_definitions.json')

    if (updateVerion(config.get('serverRES') + 'manifest.json', config) == true) {
        logger.info("音乐已更新完毕")
    }

    function copyFL(from, to, postfix) {
        //需要config json对象

        let fileArry = File.getFilesList(from)
        let outArry = []

        //清除所有旧音乐文件

        File.delete(to)

        if (postfix.length == 0) {
            //防止未输入后缀格式
            postfix = ["ogg"]
        }


        File.mkdir(to)


        for (let i = 0; i < fileArry.length; i++) {

            for (let v = 0; v < postfix.length; v++) {

                let reg = new RegExp("(." + postfix[v] + ")$", "g")

                if (reg.test(fileArry[i]) == true) {

                    if (File.copy(from + fileArry[i], to) == true) {

                        //去除后缀
                        let reg = new RegExp("(." + postfix[v] + ")$", "i")

                        outArry.push(fileArry[i].replace(reg, ""))

                        //未设置debug显示
                        logger.info(`音乐 ${fileArry[i]} 导入`)
                    } else {
                        logger.info(`音乐 ${fileArry[i]} 导入失败`)
                    }
                } else {
                    log('bug1')
                }
            }

        }

        return outArry
    }

    //将数据写入addons的音乐索引 和 插件的音乐数据 中
    function writeRandD(arry, pathR) {

        //需要config Data json对象
        const soundCfg = new JsonConfigFile(pathR, '{}')
        const dataCfg = new JsonConfigFile(PATH.DATA)

        let dataList = []
        let dataJson = dataCfg.get("music")
        let soundJson = {
            format_version: "1.14.0",
            sound_definitions: {
            }
        }



        for (let i = 0; i < arry.length; i++) {

            soundJson["sound_definitions"][config.get("sounds")['prefix'] + arry[i]] = {
                category: config.get("sounds")["category"],
                sounds: [
                    {
                        name: "sounds/music/" + arry[i],
                        stream: config.get("sounds")["stream"]
                    }
                ]
            }


            for (let v = 0; v <= dataJson.length; v++) {

                if (dataJson[v] != null && (dataJson[v]["index"] == arry[i])) {
                    dataList[dataList.length] = {
                        index: dataJson[v]["index"],
                        rename: dataJson[v]["rename"]

                    }
                    break
                }
                if (v >= dataJson.length) {
                    dataList[dataList.length] = {
                        index: arry[i],
                        rename: arry[i]
                    }
                }
            }


        }


        //更新全局变量
        soundCfg.write(data.toJson(soundJson, 1))
        dataCfg.set("music", dataList)

        dataCfg.reload()
        soundCfg.close()

    }

    //更新插件verion 和 addons verion
    function updateVerion(path) {
        //需要config json对象

        //Main 为addons  manifest
        let Main = new JsonConfigFile(path)
        let world = new JsonConfigFile(config.get('worldJson'), "[]")
        let worldJson = world.read()
        let version = config.get('version')

        if (version[0] == null || version[1] == null || version[2] == null) {
            version = [0, 0, 1]
        } else if (version[0] >= 9 && version[1] >= 9 && version[2] >= 9) {
            logger.info('版本已达最大上限请修改uuid或想其他办法更新addons版本')
            return false
        }

        // for (let i = 2; i > 0; i--) {
        //     if (version[i] <= 99) {
        //         version[i] += 1
        //         break
        //     } else {
        //         version[i] -= 99
        //         version[i - 1] += 1
        //     }
        // } 写法有误

        if (version[2] <= 9) {
            version[2] += 1
        } else if (version[1] <= 9) {
            version[2] = 0
            version[1] += 1
        } else if (version[0] <= 9) {
            version[2] = 0
            version[1] = 0
            version[0] += 1
        }


        Main.set('header', {
            description: "lxl加载器的lightSM的音乐资源包",
            name: "lightServerMusic",
            uuid: "f3f55c4c-991a-4158-9ae3-5cf7b2848072",
            version: version,
            min_engine_version: [
                1,
                14,
                0
            ]
        })

        Main.set("modules", [
            {
                description: "音乐资源包",
                type: "resources",
                uuid: "df2767fb-5bc1-41eb-b38d-2293eac94c92",
                version: version
            }
        ])

        Main.close()



        if (worldJson == '[]') {
            worldJson = [
                {
                    pack_id: 'f3f55c4c-991a-4158-9ae3-5cf7b2848072',
                    version: version
                }
            ]

        } else {
            worldJson = data.parseJson(worldJson)

            for (let i = 0; i <= worldJson.length; i++) {
                if (i >= worldJson.length) {
                    worldJson[worldJson.length] = {
                        pack_id: 'f3f55c4c-991a-4158-9ae3-5cf7b2848072',
                        version: version
                    }
                    break

                } else if (worldJson[i]['pack_id'] == 'f3f55c4c-991a-4158-9ae3-5cf7b2848072') {
                    worldJson[i]['version'] = version
                    break
                }
            }
        }

        world.write(data.toJson(worldJson, 1))
        world.reload()
        world.close()

        config.set('version', version)
        config.reload()

    }
}

function usrGUI(xuid) {
    let pl = mc.getPlayer(xuid)
    let SF = mc.newSimpleForm()
    SF = SF.setTitle('音乐主菜单')
    SF = SF.setContent('选择你的音乐播放模式')
    SF = SF.addButton('跟随播放模式')
    SF = SF.addButton('定点播放模式')
    pl.sendForm(SF, function (pl, mode) {
        //mode 选择的模式
        if (mode != null) {
            let SF = mc.newSimpleForm()
            if (mode == 0) {
                SF = SF.setContent("选择功能 \n 注意如果当前音乐为循环模式，就不可添加音乐到音乐队列")
                SF = SF.setTitle("音乐菜单@跟随播放模式")
                SF = SF.addButton("选择播放音乐")
                SF = SF.addButton("添加音乐队列")
            } else if (mode == 1) {
                SF = SF.setContent("选择功能")
                SF = SF.setTitle("音乐菜单@定点播放模式")
                SF = SF.addButton("选择播放音乐")
            }

            SF = SF.addButton("停止播放音乐")
            pl.sendForm(SF, function (pl, id) {
                if (id != null) {
                    let SF = mc.newSimpleForm()
                    if ((mode == 0 && (id == 0 || id == 1)) || (mode == 1 && id == 0)) {
                        //显示音乐按钮 /music 播放音乐 添加音乐到队列 /playsound 播放音乐

                        SF = SF.setTitle("选择音乐")
                        SF = SF.setContent("选一首喜欢的音乐吧")

                        for (let i = 0; i < DataArry.length; i++) {
                            let rename = DataArry[i]["rename"]
                            let text = config.get("usrGUI")["defaultTEXT"]
                            let content = ""
                            if (rename == "") {
                                rename = DataArry[i]["index"]
                            }
                            if (typeof (DataArry[i]["text"]) == "string" && DataArry[i]["text"] != "") {
                                text = DataArry[i]["text"]
                            }
                            content = format(text, { name: rename })
                            SF = SF.addButton(content)
                        }

                        pl.sendForm(SF, function (pl, id1) {
                            //未写完 调节音量
                            if (id1 != null) {
                                let CF = mc.newCustomForm()
                                // if((mode == 0 &&( id == 0 || id== 1 ))||(mode == 1 && id==1)){
                                CF = CF.setTitle("属性")
                                CF = CF.addLabel(`选择音乐 ${DataArry[id1]['rename']}`)
                                CF = CF.addSlider("音量", 1, 100, 1, 50)
                                if (mode == 0 && (id == 0 || id == 1)) {
                                    CF = CF.addSwitch("是否开启循环播放", false)
                                }
                                // }
                                pl.sendForm(CF, function (pl, Arry) {
                                    if (Arry != null) {
                                        let musicIndex = config.get("sounds")["prefix"] + DataArry[id1]['index']
                                        let volume = Arry[1] / 100

                                        let loop = "play_once"
                                        if (Arry[2] == true) {
                                            loop = "loop"
                                        }

                                        if (mode == 0 && id == 0) {
                                            mc.runcmd(`execute @a[name="${pl.realName}"] ~~~ music play ${musicIndex} ${volume} 0 ${loop}`)
                                        } else if (mode == 0 && id == 1) {
                                            mc.runcmd(`execute @a[name="${pl.realName}"]  ~~~ music queue ${musicIndex} ${volume} 0 ${loop}`)
                                        } else if (mode == 1 && id == 0) {
                                            mc.runcmd(`execute @a[name="${pl.realName}"]  ~~~ playsound ${musicIndex} @s ~~~ ${volume} 1.0 `)
                                        }
                                    }
                                })
                            }
                        })
                    } else if (mode == 0 && id == 2) {
                        mc.runcmd(`execute @a[name="${pl.realName}"]  ~~~ music stop 0`)


                        return false
                    } else if (mode == 1 && id == 1) {
                        mc.runcmd(`execute @a[name="${pl.realName}"] ~~~ stopsound @s`)

                        return false
                    }
                }
            })
        }
    })

}

function format(str, obj) {
    //str 为字符串 obj 为替代对象 例如 {name:"me"} str 替代表达式{name}
    if (typeof (str) == "string" && typeof (obj) == "object") {
        for (key in obj) {
            let reg = new RegExp("({" + key + "})", "g")
            str = str.replace(reg, obj[key])
        }
        return str
    } else {
        logger.error("格式化字符串出错")
        return "error"
    }
}
