# i18n-excel v1.0.0📈

# 声明 视频编辑器国际化语言 不适用此脚本 ‼️

- 📃Excel中格式规范 图文介绍：https://confluence.mobvista.com/pages/viewpage.action?pageId=79350163
- 表头字段一定要有documentName //documentName表示文件名 比如你在documentName下定义了global则会 导出global.js文件
- 表头字段一定要有在commander中输入的 -l｜--lang 后面的数据 默认是"zh" "en"这2个字段//这一些字段表示需要翻译的语言 比如 -l "zh" "en" "tg" 则在excel表头中一定要有zh,en,tg这3个字段
- 在结束的下一行中documentName的位置增加end这个值，表示读取excel结束

## 作用：
    将特定格式的excel数据转化为项目lang文件夹中那一些js文件
    
## 使用说明：

### 依赖安装
    npm install

### 开发：
    执行 npm run watch 这个命令会监听ts文件的修改，将ts文件转化为js文件，转化的js文件会放在 build文件夹中

### 执行脚本：在命令行中执行    
    node ./build/bin.js -i [excel文件的位置] -o [输出被转化好文件夹的位置] -n [输出文件夹的名字] -l[需要翻译的字段] //-n -l是不必须字段，都有默认值 -n的默认值是i18n-land -l的默认值是'en','zh'

## 待处理问题
    package.json中bin命令不生效

### 注意事项
    1.excel可以放在任何位置 -i后面的值一定要是绝对路径 -o后面的值也要是绝对路径
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

# 目录结构
    --src 
     ---bin.ts 入口文件
     --- excel.ts 主要方法文件
    --build  ts代码转化成js，js的存放文件

