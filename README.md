# i18n-excel v1.0.0📈

# 声明 视频编辑器国际化语言 不适用此脚本 ‼️

- 📃Excel 中格式规范 图文介绍：https://confluence.mobvista.com/pages/viewpage.action?pageId=79350163
- 表头字段一定要有 documentName //documentName 表示文件名 比如你在 documentName 下定义了 global 则会 导出 global.js 文件
- 表头字段一定要有在 commander 中输入的 -l ｜--lang 后面的数据 默认是"zh" "en"这 2 个字段//这一些字段表示需要翻译的语言 比如 -l "zh" "en" "tg" 则在 excel 表头中一定要有 zh,en,tg 这 3 个字段
- 在结束的下一行中 documentName 的位置增加 end 这个值，表示读取 excel 结束

## 作用：

    将特定格式的excel数据转化为项目lang文件夹中那一些js文件

## 使用说明：

### 依赖安装

    npm install

### 开发：

    执行 npm run watch 这个命令会监听ts文件的修改，将ts文件转化为js文件，转化的js文件会放在 build文件夹中

### 执行脚本：在命令行中执行

    node ./build/bin.js -i [excel文件的位置] -o [输出被转化好文件夹的位置] -n [输出文件夹的名字] -l[需要翻译的字段] 
    //都有默认值 -i的默认值是当前目录下的i18n-land.xlsx文件 -o的默认值是当前目录 -n的默认值是i18n-land -l的默认值是'en','zh'

### 执行脚本：项目中使用

    在package.json中引入这个项目："i18nExcel":"git@gitlab.mobvista.com:playable/i18n-excel.git"
    然后 npm install i18nExcel -D
    在main.js中:
        import i18nExcel from 'i18nExcel'
        i18nExcel({
            inDir: path.join("./", "i18n-land.xlsx"),
            outDir: path.join("./"),
            name: "i18n-land",
            lang: ["zh", "en"],
        })

## 待处理问题

    package.json中bin命令不生效

### 注意事项

    1.excel可以放在任何位置 -i后面的值一定要是绝对路径 -o后面的值也要是绝对路径。
    2.key不能这样💥💥💥💥💥💥💥💥💥💥💥💥
            key                  en            zh
        aside.project         my-project     我的项目
        aside.project.a       my-project-a   我的项目a
        aside.project.b       my-project-b   我的项目b
        这样写报一个Cannot create property 'playable' on string 'xxxxxxxxx' ！！！！！！！
        原因是：
        aside.project的结构是  =====》aside:{
                                            project:my-project
                                        }
        aside.project.a的结构是 =====》aside:{
                                            project:{
                                                a:my-project-a
                                            }
                                        }
        这样子把project从一个字符串变成了一个对象，会导致project原来的值丢失从而引发报错
    3.支持documentName同名，如果documentName同名则会追加内容。

# 目录结构

    --src
     ---bin.ts 入口文件
     --- excel.ts 主要方法文件
    --build  ts代码转化成js，js的存放文件
