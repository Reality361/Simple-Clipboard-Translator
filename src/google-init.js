//召唤谷歌翻译
async function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      includedLanguages: 'en,en-GB,zh-CN,zh-TW,de,fr,ru,ja,hi,ko', // 设置需要翻译的语言
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE, // 设置翻译面板的样式
      autoDisplay: true
    }, "google-translate-element");
}