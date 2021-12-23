/*
插件描述 ： 多语言支持
作者 : lightfly
*/
const __VERSION = 0.01
const MIN_LXLVERSION = { major: 0, minor: 5, revision: 10, isBeta: 0 }
//主版本,次版本,修订版本，是否测试版

function checkLXL() {

}

function LF_translate(id, version, flieDir, useLanguage) {
    this.id = id
    this.version = version
    this.flieDir = flieDir
    this.useLanguage = useLanguage
    this.checkTranslate = function () {
        try {
            if (File.exists(this.flieDir + this.useLanguage + '.json')) throw "未找到文件"
            {
                let testFile = new JsonConfigFile(this.flieDir + this.useLanguage + '.json')
                if (testFile.get(_version) != this.version) throw "翻译文件版本不匹配"
            }
        } catch (error) {
            log(error)
        }
    }
    this.translate = function () {
        if (this.checkTranslate()) {
            return false
        }
        console.log(this.version)

    }
}

let test = new LF_translate(101, 0.01, ".\\test\\", 'chinese')
test.translate()