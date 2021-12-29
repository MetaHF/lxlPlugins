/*
插件描述 ： 服务器音乐
作者 : lightfly
lxl load ../test/lightServerMusic.js 
*/

const __VERSION = 0.01
const MIN_LXLVERSION = { major: 0, minor: 5, revision: 10}

const LF_DESCRIPTION = "歌曲$name"
const LF_CFGPATH = '.\\plugins\\lightDEV\\lightServerMusic\\config.json'
const LF_PATH = {
    SM_DIR = '.\\plugins\\lightDEV\\lightServerMusic\\DATA\\'
}

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
function FileCopyNoPostfix(from,to){
    //移动所有ogg格式文件到指定目录
}
function refresh(cfg){
    let usingNE = cfg.get('usingName')
    let prefix = cfg.get('prefix')
    let content = cfg.get('desciption')
    let serverRESDIR = cfg.get('serverRES')
    let pluginData = new File(LF_PATH[SM_DIR],0)
    let RESData = new File(serverRESDIR+'sounds\\sound_definitions.json',0)
    let procedureFunc = "Procedure(index)"
	function Procedure(index){
		
	}
    function FuckOldP(path,json){
        let pluginDataFR = new File(path,0)
        let wJson = {}
        if(!(pluginDataFR.seekTo(0,false)&&pluginDataFW.seekTo(0,false))){
            Error(3,'无法归零文件指针')
            return false
        }
        if(!(pluginDataFR.readAll(function(result){
            if(result==null){
                
            }
            for (let i = 0; i < result['music']['main'].length; i++) {
                let same = false
                for(let v =0; v<json.length;v++){
                    if(result['music']['main'][i]['name'] == json[v]){
                        same = true
                        json.splice(v,1)
                        break
                    }
                if(!same){
                    result['music']['main'].splice(i,1)
                    i -= 1
                    logger.info('已删除旧文件'+result['music']['main'][i]['name'])
                }
                }
             for(let i =0;i<json.length;i++){
				json[i] = {name:json[i]}
			}
			result['music']['main'] = result['music']['main'].comcat(json)
			//拼接全部数据 相同的，新增的
			
             DataW(result,path,procedureFunc,1)
            }
        }))){
            Error(4,'无法读取文件')
            return false
        }
        function DataW(json,path,func,index){
			let DataFW = new File(path,2)
			if(DataFW.seekTo(0,false)){ERROR("DataW","写入文件指针无法归零")}
			DataW.write(json,function(){
				eval(func)
			})
        }

    }
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
        cfg.init('serverRES','.\\development_resource_packs\\serverMusicRE\\')
        cfg.init('refresh',false)
        cfg.close
    }
}

function ERROR(id){
	aa
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
