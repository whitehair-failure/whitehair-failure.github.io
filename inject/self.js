window.addEventListener("load", function () {
  // 获取本地存储中的 AdultCertification 值
  const adultCertification = localStorage.getItem("AdultCertification");

  // 如果 AdultCertification 不存在或为 0，显示弹窗
  if ((!adultCertification || adultCertification === "0") && GLOBAL_CONFIG_SITE.pageType === 'home') {
    const body = document.body;

    // 动态创建弹窗元素
    const modal = document.createElement("div");
    modal.id = "adultModal";
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalText = document.createElement("p");
    modalText.innerHTML =
      "该网站包含有年龄限制的内容。<br/> 进入即表示您确认您已年满 18 岁，或在您访问本网站时所在的司法管辖区已是成年人。";

    const confirmButton = document.createElement("button");
    confirmButton.id = "confirmAdult";
    confirmButton.innerText = "我年满18岁。进入";

    const cancelButton = document.createElement("button");
    cancelButton.id = "cancelAdult";
    cancelButton.innerText = "我未满18。退出";

    // 将内容添加到弹窗中
    modalContent.appendChild(modalText);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(cancelButton);
    modal.appendChild(modalContent);

    // 将弹窗添加到 body 中
    body.appendChild(modal);

    // 启用背景模糊和禁用滚动
    body.classList.add("modal-open");
    body.classList.add("no-scroll");

    // 显示弹窗并添加显示动画
    setTimeout(() => {
      modal.style.display = "flex";
      modal.style.opacity = "1";
    }, 10);

    // 确定按钮事件
    confirmButton.addEventListener("click", function () {
      localStorage.setItem("AdultCertification", "1"); // 设置成人认证为1
      modal.style.animation = "fadeOut 0.5s forwards"; // 弹窗消失动画
      setTimeout(() => {
        modal.style.display = "none"; // 关闭弹窗
        body.classList.remove("modal-open"); // 恢复背景模糊
        body.classList.remove("no-scroll"); // 恢复页面滚动
      }, 500); // 等待动画完成后再设置为隐藏
    });

    // 取消按钮事件
    cancelButton.addEventListener("click", function () {
      window.close(); // 关闭页面
    });
  }
});

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

let counter = 0; // 用于计数触发次数

// 头像 URL 数组
const avatars = [
  "https://img.lolimama.love/gh/whitehair-failure/own-picture-bed/blog_img/Char.jpg",
  "https://img.lolimama.love/gh/whitehair-failure/own-picture-bed/blog_img/Madman.png",
];

// ✅ 预加载头像图片
/* avatars.forEach(url => {
  const img = new Image();
  img.src = url;
}); */

setInterval(() => {
  let asideContent = document.querySelector("#aside-left");
  let avatarBox = asideContent.querySelector(".avatar-img");
  let avatarImg = avatarBox.querySelector("img");

  // 头像模糊效果
  avatarImg.style.filter = "blur(40px)";

  setTimeout(() => {
    // 切换头像
    avatarImg.src = avatars[counter % avatars.length];

    // 头像清晰
    avatarImg.style.filter = "blur(0px)";

    // 计数器增加
    counter++;
  }, 2000);
}, 4000);

