/*
插件描述 ： 服务器音乐
作者 : lightfly
lxl load ../test/lightServerMusic.js 
*/

const __VERSION = 0.01
const MIN_LXLVERSION = { major: 0, minor: 5, revision: 10}

const LF_DESCRIPTION = "歌曲$name"
const LF_CFGPATH = '.\\plugins\\lightDEV\\lightServerMusic\\config.json'

if(!(File.exists(LF_CFGPATH))){
    init(LF_CFGPATH)
}

function checkCFG(path){
    let cfg = new JsonConfigFile(path)
    if (cfg == null){
        ERROR(2)
        return false
    }else{
        if(cfg.get('refresh')==false){

        }
    }
}
function FileCopyOGG(from,to){
    //移动所有ogg格式文件到
}
function refresh(cfg){
    let usingNE = cfg.get('usingName')
    let prefix = cfg.get('prefix')
    let content = cfg.get('desciption')

}

function init(path){
    let cfg = new JsonConfigFile(path)
    if (cfg == null){
        ERROR(1)
        return false
    }else{
        cfg.init('usingName',"lightSM")//命名空间
        cfg.init('prefix','LF_')//前缀
        cfg.init('description',LF_DESCRIPTION)//描述
        cfg.init('refresh',false)
        cfg.close
    }
}

function ERROR(id){
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