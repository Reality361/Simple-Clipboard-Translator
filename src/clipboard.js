// 获取文本框元素
const copyBox = document.getElementById("from-text");
const pasteBox = document.getElementById("to-text");
const listen = document.getElementById("listenCheckbox");
const button2JS = document.getElementById("button2JS");
var temp = null;



// 获取用户的读取剪贴板的权限
navigator.permissions
  .query({ name: "clipboard-read" })
  .then((result) => {
    if (result.state == "granted" || result.state == "prompt") {
      // 创建一个定时器，每隔0.5秒执行一次
      var timer = setInterval(function () {
        var langDisplay = translate.language.getCurrent();
        //translate.language.setLocal(langRecog);
        if(listen.checked == true){
          // 读取剪贴板的文本内容
          navigator.clipboard.readText().then((text) => {
            copyBox.value = text;
            if(temp != copyBox.value){
              temp = copyBox.value;
              // 将文本内容粘贴到文本框中
              pasteBox.innerText = copyBox.value;
            }
          });
        } else {
          if(temp != copyBox.value){
            temp = copyBox.value;
            pasteBox.innerText = copyBox.value;
          }
        }

        if(pasteBox.innerText == copyBox.value && !(copyBox.value.trim ().length == 0) && (listen.checked) && (button2JS.style.display == 'none')){
            console.log("Begin Refreshing")
            var changeLangTimer = setInterval(function () {
            //如果卡顿，则每3秒刷新一次
            if(pasteBox.innerText == copyBox.value){
              translateInit();
            }
            clearInterval(changeLangTimer);
          }, 3000)
        }
      }, 500);
    } else {
      alert("Unable to read clipboard!");
    }
  });