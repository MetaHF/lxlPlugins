/*
插件描述 ： 多语言支持
作者 : lightfly
*/
const __VERSION = 0.01
const MIN_LXLVERSION = { major: 0, minor: 5, revision: 10}
//主版本,次版本,修订版本，是否测试版
lxl.export(ERROR,'LF_translate')

function checkLXL() {
    try {
        if(lxl.requireVersion(MIN_LXLVERSION['major'],MIN_LXLVERSION['minor'],MIN_LXLVERSION['revision'])){
            if(!(mo.export=ERROR) throw 1
        }else{
            throw 2
        }
    } catch (error) {
        ERROR(error)
    }
}

class LF_translate{
    constructor(version,name,useLanguage,flieDir){
        this.version = version
        this.flieDir = flieDir?flieDir:'.\\plugins\\lightDEV\\Translate\\'+name+'\\'
        this.useLanguage = useLanguage?useLanguage:'zh_CN'
    }
    checkTranslate(){
        try {
            {
                let useLanguage = new JsonConfigFile('.\\plugins\\lightTranslate','{"userLanguage":"zh_CN"}')
                useLanguage = useLanguage.get('userLanguage')
                let testFile = File.readFrom(this.flieDir + useLanguage + '.json')
                if (testFile == null){
                    WARN(1,useLanguage)
                    useLanguage = this.useLanguage
                    testFile = File.readFrom(this.flieDir + useLanguage + '.json')
                    if(testFile==null) throw 3
                }
                testFile = data.parseJson(testFile)
                if(testFile['_version']!=this.version) throw 4
                if(testFile['Translate']==null) throw 5

                return useLanguage
            }
        } catch (error) {
            //读取出错
            ERROR(error)
            return false
        }
    }
    translate(key){
        try {
            let useLanguage = this.checkTranslate()
            if(useLanguage == false) {
                return false
            }else{
                let TRstr = new File(this.flieDir + useLanguage + '.json',1)
                if(TRstr==null) throw 6
                let str = TRstr.readAllSync()
                if(str==null) throw 7
                str = data.parseJson(str)
                if(str==null) throw 8
                if(str['Translate'][key]==null){
                    WARN(2,key)
                } 
                return str['Translate'][key]
            }
        } catch (error) {
            ERROR(error)
        }

    }
}

function ERROR(error){
    log(error)
    switch (error) {
        case 1:
            log('导出错误检查是否有导出函数名为LF_translate')
            break
        case 2:
            log('lxl版本过低')
            break
        case 3:
            log('配置文件的默认语言无法获取')
            break
        case 4:
            log('语言文件版本不匹配')
            break
        case 5:
            log('没有Translate的内容')
            break
        case 6:
            log('无法同步读取使用的多语言文件')
            break
        case 7:
            log('无法读取使用的多语言文件')
            break
        case 8:
            log('多语言内容无法转json')
            break
        default:
            log('未知错误')
            break;
    }
}

function WARN(num,msg){
    log('[警告]：###########')
    switch (num) {
        case 1:
            log('当前插件没有'+msg+'语言')
            break;
        case 2:
            log('当前插件没有'+msg+'翻译的单词')
            break;
        default:
            break;
    }
}
let test = new LF_translate(0.01,'lightTranslate','zh_CN')
log(test.translate('test'))