/*
插件描述 ： 服务器音乐
作者 : lightfly
lxl load ../test/lightServerMusic.js 
*/

const __VERSION = 0.01
const MIN_LXLVERSION = { major: 0, minor: 5, revision: 10 }

const LF_DESCRIPTION = "歌曲$name"
const LF_CFGPATH = '.\\plugins\\lightDEV\\lightServerMusic\\config.json'
const LF_PATH = {
    SM_DIR: '.\\plugins\\lightDEV\\lightServerMusic\\DATA\\'
}

const postfix = 'ogg'

logger.info('test')
init(LF_CFGPATH)
if (!(File.exists(LF_CFGPATH))) {
    init(LF_CFGPATH)
    logger.info('test')
}

function checkCFG(path) {
    let cfg = new JsonConfigFile(path)
    if (cfg == null) {
        ERROR(2)
        return false
    } else {
        if (cfg.get('refresh') == false) {

        }
    }
}
function FileCopyNoPostfix(from, to, postfix) {
    //移动所有ogg格式文件到指定目录
    let PostfixRP = new RegExp('[.]' + postfix + '$')
    let outArray = []
    outArray = File.getFilesList(from)
    File.mkdir(to)
    log(outArray)
    for (let i = 0; i < outArray.length; i++) {
        if (!(PostfixRP.test(outArray))) {
            outArray.splice(i, 1)
            --i
            log(outArray)
        } else if(!(File.getFilesList(to)[i]==outArray[i])){
            if (!(File.copy(from + outArray[i], to))) { Error('复制错误： ' + outArray[i]) }
            else { logger.info('导入音乐' + outArray[i]) }
        }
    }
    return outArray
}
function refresh(cfg) {
    let usingNE = cfg['usingName']
    let prefix = cfg['prefix']
    let content = cfg['desciption']
    let serverRESDIR = cfg['serverRES']
    let procedureFunc = "Procedure(index)"
    let dataJson = []
    Procedure(0)
    function Procedure(index) {
        switch (index) {
            case 0:
                oggJson = FileCopyNoPostfix(LF_PATH['SM_DIR'] + 'music\\', serverRESDIR + 'sounds\\', postfix)
                if (!(FuckOldP(LF_PATH['SM_DIR'] + 'data.json', oggJson))) {
                    break
                }
                break;
            case 1:
            	
                logger.info('test')
            default:
                break;
        }
    }
    function FuckOldP(path, json) {
        let pluginDataFR = new File(path, 0)
        if (!(pluginDataFR.seekTo(0, false))) {
            Error(3, '无法归零文件指针')
            return false
        }
        if (!(pluginDataFR.readAll(function (result) {
            log(result)
            if (result == null || result == []) {
                result = {
                    music: {
                        main: [
                            ''
                        ]
                    }
                }
                DataW(result, path, procedureFunc, 0)
                return
            }else{
                result = data.parseJson(result)
            }
            for (let i = 0; i < result['music']['main'].length; i++) {
                let same = false
                for (let v = 0; v < json.length; v++) {
                    if (result['music']['main'][i]['name'] == json[v]) {
                        same = true
                        json.splice(v, 1)
                        --v
                        break
                    }
                }
                if (!same) {
                    logger.info('已删除旧文件' + result['music']['main'][i]['name'])
                    result['music']['main'].splice(i, 1)
                    --i
                }
            }
            for (let i = 0; i < json.length; i++) {
                json[i] = { name: json[i] }
            }
            log(json)
            result['music']['main'] = result['music']['main'].concat(json)
            //拼接全部数据 相同的，新增的
            dataJson = result
            DataW(result, path, procedureFunc, 1)
            }
        ))) {
            Error(4, '无法读取文件')
            return false
        }
        function REwriteRES(json,path,cfg){
			let jsonSounds = {
				"format_version" : "1.14.0",
  			  "sound_definitions" : {
   			}
			}
			if((json)&&(json["music"])&&(json["music"]["main"])){
			ERROR("配置文件出错")
			}else{
			for (let i =0 ; i<json["music"]["main"].length;i++){
				let jsonW_OBJ = {}
				jsonW_OBJ[cfg["prefix"]+json["music"]["main"][i]] = {
					"category": cfg["category"],
      				"sounds": [
        							{
         							 "name": String.raw`sounds/music/` + json["music"]["main"][i],
         							 "stream": true
        							}
      							]
				}
				jsonSounds.push()
			
			}
			}
		}
        function DataW(json, path, func, index) {
            let DataFW = new File(path, 1)
            if (!(DataFW.seekTo(0, false))) { ERROR("DataW", "写入文件指针无法归零") }
            json = JSON.stringify(json)
            DataFW.write(json, function () {
                eval(func)
                //键入回调函数
            })
        }

    }
}

function init(path) {
    let cfg = new JsonConfigFile(path)
    log
    if (cfg == null) {
        ERROR(1)
        return false
    } else {
        cfg.init('category', "lightSM")//命名空间
        cfg.init('prefix', 'LF_')//前缀
        cfg.init('description', LF_DESCRIPTION)//描述
        cfg.init('serverRES', String.raw`.\\development_resource_packs\\serverMusicRE\\`)
        cfg.init('refresh', false)
    }
    cfgJ = cfg.read()
    cfg.close()
    cfgJ = data.parseJson(cfgJ)
    refresh(cfgJ)
}

function ERROR(msg,msg2,id) {
	logger.error(msg+'\n')
	logger.error(msg2)
    switch (id) {
        case 1:
            logger.error('无法初始化')
            break;
        case 2:
            logger.error('无法读取配置文件')
        default:
            break;
    }
}
