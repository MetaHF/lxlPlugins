
const PATH = {
    MAIN: "./plugins/lightDEV/LF_Music",
    MUSIC: "./plugins/lightDEV/LF_Music/DATA/music/",
    DATA: "./plugins/lightDEV/LF_Music/DATA/data.json"
}

var config = new JsonConfigFile(PATH.MAIN + "/config.json",
    `{
    "sunds":{
      "postfix": ["ogg"],
      "category" : "music",
      "prefix": "music.game.",
      "stream": "true"
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

var DataCfg = new JsonConfigFile(PATH.DATA,`
	{
	 "music": [

		]
	}
`)
var DataArry = data.parseJson(DataCfg.read())

//无资源包不执行动作
var enable = true


//设置输出日志
logger.setConsole(true, 4)
if (File.exists(config.get("serverRES")) == false) {
    //无资源包不执行动作
    setTimeout('logger.error(`请将资源包放到 ${config.get("serverRES")} 的上一级目录，且名字为最后的/目录名字/`)', 2000)
    enable = false

} else if (File.exists(config.get("worldJson")) == false) {
    let wRES = new JsonConfigFile(config.get("worldJson"), `[
        {
          pack_id:"f3f55c4c-991a-4158-9ae3-5cf7b2848072",
          version:[0,0,1]
        }
      ]`)
    wRES.close()
} else if (File.exists(PATH.MUSIC) == false) {
    File.mkdir(PATH.MUSIC)
}

mc.listen("onPlayerCmd", function (pl, cmd) {
    if (enable == true && (cmd == "refLF_M" || cmd == "MUCmenu"))
        return false
})





mc.regConsoleCmd('reflf', '', function () { })

mc.listen("onConsoleCmd", function (cmd) {
    if (cmd == 'reflf') {
        refMusic()
        return false
    }
})




mc.regPlayerCmd("reflf_m", "刷新LF_muic的音乐文件", function (pl, arg) {
    refMusic(pl.xuid)
}, 1)
mc.regPlayerCmd("mucmenu", "召唤音乐菜单界面", function (pl, arg) {
    usrGUI(pl.xuid)
})





function refMusic(xuid) {
    const pl = mc.getPlayer(xuid)
    const muiscArry = copyFL(PATH.MUSIC, config.get("serverRES") + "sounds/music/", config.get("sunds")["postfix"])
    log(muiscArry)
    log(config.get("serverRES") + "sounds/sound_definitions.json")
    writeRandD(muiscArry, './development_resource_packs/serverMusicRE/sounds/sound_definitions.json', PATH.DATA)

    if (updateVerion(config.get('serverRES') + 'manifest.json', config) == true) {
        logger.info("音乐已更新完毕")
    }

    function copyFL(from, to, postfix) {
        //需要config json对象
        log(from)
        let fileArry = File.getFilesList(from)
        let outArry = []

        //清除所有旧音乐文件
        File.delete(to)
        File.mkdir(to)

        if (postfix.length == 0) {
            //防止未输入后缀格式
            postfix = ["ogg"]
        }
        for (let i = 0; i < fileArry; i++) {
            for (const key in postfix) {
                let reg = new RegExp("/(." + postfix[key] + ")$/", "g")
                if (reg.test(fileArry[i]) == true) {
                    if (File.copy(from + fileArry[i], to) == true) {

                        //去除后缀
                        let reg = new RegExp("/(." + postfix[key] + ")$/", "i")
                        outArry.push(fileArry[i].replace(reg, ""))

                        //未设置debug显示
                        logger.debug(`音乐 ${fileArry[i]} 导入`)
                    } else {
                        logger.info(`音乐 ${fileArry[i]} 导入失败`)
                    }
                }
            }

        }
        return outArry
    }

    //将数据写入addons的音乐索引 和 插件的音乐数据 中
    function writeRandD(arry, pathR, pathD) {

        //需要config json对象
        const soundCfg = new JsonConfigFile(pathR, '{}')
        const dataCfg = new JsonConfigFile(pathD)
        log(soundCfg.read())
        let dataList = []
        let dataJson = dataCfg.get("music")
        let soundJson = {
            "format_version": "1.14.0",
            "sound_definitions": {
            }
        }

        //soundJson = data.parseJson(soundJson)

        //if (dataJson != "") {
            //dataJson = data.parseJson(dataJson)
       // } else {
       //     dataJson = []
      //  }

        for (let i = 0; i < arry.length; i++) {
            soundJson["sound_definitions"][config.get("sounds")['prefix'] + arry[i]] = {
                category: config.get("sounds")["category"],
                sounds: [
                    {
                        name: arry[i],
                        stream: config.get("sounds")["stream"]
                    }
                ]
            }


            for (let v = 0; v < dataJson.length; v++) {
                if (dataJson[v]["index"] == arry[i]) {
                	dataList.push({
						index: dataJson[v]["index"] ,
						rename: dataJson[v]["rename"]

					})
                    continue
                }
                if (v >= dataJson.length) {
                    dataList.push({
                        index: arry[i],
                        rename: ""
                    })
                }
            }


        }

        //更新全局变量
        soundCfg.write(data.toJson(soundJson, 1))
        dataCfg.set("music",dataList)

        dataCfg.reload()
        soundCfg.close()

    }

    //更新插件verion 和 addons verion
    function updateVerion(path) {
        //需要config json对象

        //Main 为addons  manifest
        let Main = new JsonConfigFile(path)
        let world = new JsonConfigFile(config.get('worldJson'),"[]")
        let worldJson = world.read()
        let version = config.get('version')

        if (version[0] == null || version[1] == null || version[2] == null) {
            version = [0, 0, 1]
        } else if (version[0] >= 99 && version[1] >= 99 && version[2] >= 99) {
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

        if(version[2]<=99){
            version[2] +=1
        }else if(version[1]<=99){
            version[2] = 0
            version[1] += 1
        }else if(version[0]<=99){
            version[2] = 0
            version[1] = 0
            version[0] += 1
        }

        log(version)

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
        log(worldJson)
        if(worldJson=='[]'){
            worldJson = [
                {
                    pack_id: 'f3f55c4c-991a-4158-9ae3-5cf7b2848072',
                    version: version
                }
            ]
        }else{
            worldJson = data.parseJson(worldJson)
            for (let i=0; i<worldJson.length;i++){
                if (worldJson[i]['pack_id']=='f3f55c4c-991a-4158-9ae3-5cf7b2848072'){
                    worldJson[i]['version'] = version
                    break
                }else if (i>=worldJson.length){
                    worldJson[worldJson.length]={
                        pack_id: 'f3f55c4c-991a-4158-9ae3-5cf7b2848072',
                        version: version
                    }
                }
            }
        }

        world.write(data.toJson(worldJson,1))
        world.close()

        config.set('version',version)
        config.reload()

    }
}

function usrGUI(xuid){
    let pl = mc.getPlayer(xuid)
    let mainSF = mc.newSimpleForm()
    mainSF = mainSF.setTitle('音乐主菜单')
    mainSF = mainSF.setContent('选择你的音乐播放模式')
    mainSF = mainSF.addButton('跟随播放模式')
    mainSF = mainSF.addButton('定点播放模式')
    pl.sendForm(mainSF,function(pl,mode){
        //mode 选择的模式
        if(mode!=null){
            let modeSF = mc.newSimpleForm()
            modeSF = modeSF.setContent("选择功能")
            if (mode==0){
             
              modeSF = modeSF.setTitle("音乐菜单@跟随播放模式")
              modeSF = modeSF.addButton("选择播放音乐")
              modeSF = modeSF.addButton("添加音乐队列")
            }
        }
    })
}
