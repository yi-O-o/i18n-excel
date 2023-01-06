# i18n-excel v1.0.0📈

# 声明 视频编辑器国际化语言 不适用此脚本 ‼️

- 📃Excel中格式规范 图文介绍：https://confluence.mobvista.com/pages/viewpage.action?pageId=79350163
- 表头字段一定要有documentName //documentName表示文件名 比如你在documentName下定义了global则会 导出global.js文件
- 表头字段一定要有在commander中输入的 -l｜--lang 后面的数据 默认是"zh" "en"这2个字段//这一些字段表示需要翻译的语言 比如 -l "zh" "en" "tg" 则在excel表头中一定要有zh,en,tg这3个字段
- 在结束的下一行中documentName的位置增加end这个值，表示读取excel结束

## 作用：将特定格式的excel数据转化为项目lang文件夹中那一些js文件

## 使用说明：

### 开发：
    执行 npm run watch 这个命令会监听ts文件的修改，将ts文件转化为js文件，转化的js文件会放在 build文件夹中

### 执行脚本：在命令行中执行
    node ./build/bin.js -i [excel文件的位置] -o [输出被转化好文件夹的位置] -n [输出文件夹的名字] -l[需要翻译的字段] //-n -l是不必须字段，都有默认值 -n的默认值是i18n-land -l的默认值是'en','zh'

## 待处理问题
    package.json中bin命令不生效

