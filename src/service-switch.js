/*
Array.prototype.removeByValue = async function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === val) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  }*/
  /*
  async function removeByValue(val){

  }*/

  //切换至谷歌翻译
  async function changeTranslator2GG() {
    document.getElementById("google-translate-element").style.display = "";
    document.getElementById("button2GG").style.display = "none";
    document.getElementById("button2JS").style.display = "";
    document.getElementById("changeLLang").style.display = "none";
    document.getElementById("changeTLang").style.display = "none";
    /*
    document.getElementById("button2EdgeService").style.display = "none";
    document.getElementById("button2JSService").style.display = "none";*/

    document.getElementById("to-text").classList.remove("notranslate");
    document.getElementById("to-text").classList.add("ignore");
    //translate.ignore.class.push('result'); //终止translate.js工作
    translateInit();
  }

  //切换至混合翻译
  async function changeTranslator2JS() {
    document.getElementById("google-translate-element").style.display = "none";
    document.getElementById("button2GG").style.display = "";
    document.getElementById("button2JS").style.display = "none";
    document.getElementById("changeLLang").style.display = "";
    document.getElementById("changeTLang").style.display = "";
    /*
    if(document.getElementById("service").innerText == "client.edge"){
      document.getElementById("button2JSService").style.display = "";
    } else {
      document.getElementById("button2EdgeService").style.display = "";
    }*/
    document.getElementById("to-text").classList.add("notranslate");
    document.getElementById("to-text").classList.remove("ignore");
    //translate.ignore.class.removeByValue('result'); //激活translate.js工作
    translateInit();
  }

  /*
  function changeService2Edge() {
    document.getElementById("button2EdgeService").style.display = "none";
    document.getElementById("button2JSService").style.display = "";
    translate.service.use('client.edge');
    document.getElementById("service").innerText = "client.edge";
    translateInit();
  }

  function changeService2JS() {
    document.getElementById("button2EdgeService").style.display = "";
    document.getElementById("button2JSService").style.display = "none";
    translate.service.use('translate.service');
    document.getElementById("service").innerText = "translate.service";
    translateInit();
  }*/