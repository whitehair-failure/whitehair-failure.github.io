// 首页隐藏最新文章侧边栏
document.addEventListener("DOMContentLoaded", function () {

  // if (GLOBAL_CONFIG_SITE.isHome) {
  //   document.querySelector(".card-recent-post").style.display = "none";
  // } else {
  //   document.querySelector(".card-recent-post").style.display = "block";
  // }
  console.log("GLOBAL_CONFIG_SITE——DOMContentLoaded", GLOBAL_CONFIG_SITE); // 输出是否为文章页

  if (GLOBAL_CONFIG_SITE.pageType !== 'home') {
    let contentInner = document.querySelector("#content-inner");
    let firstChildDiv = contentInner.querySelector("div:first-child");
    firstChildDiv.style.transition = "0s";
    firstChildDiv.style.width = "76%";
    // firstChildDiv.style.transition = "0.3s";
    console.log("firstChildDiv", firstChildDiv); // 输出第一个子元素 div
  }
});

// 监听 pjax 页面跳转成功事件
document.addEventListener("pjax:success", function () {

  // if (GLOBAL_CONFIG_SITE.isHome) {
  //   document.querySelector(".card-recent-post").style.display = "none";
  // } else {
  //   document.querySelector(".card-recent-post").style.display = "block";
  // }
  console.log("GLOBAL_CONFIG_SITE", GLOBAL_CONFIG_SITE); // 输出是否为文章页

  if (GLOBAL_CONFIG_SITE.pageType !== 'home') {
    let contentInner = document.querySelector("#content-inner");
    let firstChildDiv = contentInner.querySelector("div:first-child");
    firstChildDiv.style.transition = "0s";
    firstChildDiv.style.width = "76%";
    // firstChildDiv.style.transition = "0.3s";
    console.log("firstChildDiv", firstChildDiv); // 输出第一个子元素 div
  }
});
