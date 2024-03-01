async function translateInit(){
    translate.language.setUrlParamControl(); //url参数后可以加get方式传递 language 参数的方式控制当前网页以什么语种显示
    translate.listener.start();	//开启html页面变化的监控，对变化部分会进行自动翻译。注意，这里变化区域，是指使用 translate.setDocuments(...) 设置的区域。如果未设置，那么为监控整个网页的变化
    translate.execute(); //执行翻译初始化操作，显示出select语言选择
  }

//translate.ignore.tag.push('img'); //翻译时追加上自己想指定忽略的tag标签，凡是在这里面的，都不进行翻译。
//translate.ignore.class.push('test');	//翻译时指定忽略的class name，凡是class name 在这里面的，都不进行翻译。如果不设置默认只有 ignore 这一个
//var documents = [];
//documents.push(document.getElementById('ajax'));
//documents.push(document.getElementById('test2'));
//documents.push(document.getElementById('test3'));
//translate.setDocuments(documents); //指定要翻译的元素的集合,可传入一个或多个元素。如果不设置，默认翻译整个网页
//translate.setAutoDiscriminateLocalLanguage();	//设置用户第一次用时，自动识别其所在国家的语种进行切换
translate.language.setLocal('english'); //设置本地语种（当前网页的语种）。如果不设置，默认就是 'chinese_simplified' 简体中文。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明
translate.language.setDefaultTo('english');
translate.service.use('client.edge'); // 设置机器翻译服务通道，直接客户端本身，不依赖服务端
translateInit();