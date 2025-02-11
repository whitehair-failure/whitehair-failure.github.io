document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    // 获取本地存储中的 AdultCertification 值
    const adultCertification = localStorage.getItem("AdultCertification");

    // 如果 AdultCertification 不存在或为 0，显示弹窗
    if (!adultCertification || adultCertification === "0") {
      const modal = document.getElementById("adultModal");
      const body = document.body;

      // 启用背景模糊和禁用滚动
      body.classList.add("modal-open");
      body.classList.add("no-scroll");

      modal.style.display = "flex"; // 显示弹窗

      // 触发弹窗显示的动画
      setTimeout(() => {
        modal.style.opacity = "1"; // 设置不透明，显示弹窗
      }, 10);

      // 确定按钮事件
      document
        .getElementById("confirmAdult")
        .addEventListener("click", function () {
          localStorage.setItem("AdultCertification", "1"); // 设置成人认证为1
          modal.style.animation = "fadeOut 0.5s forwards"; // 弹窗消失动画
          setTimeout(() => {
            modal.style.display = "none"; // 关闭弹窗
            body.classList.remove("modal-open"); // 恢复背景模糊
            body.classList.remove("no-scroll"); // 恢复页面滚动
          }, 500); // 等待动画完成后再设置为隐藏
        });

      // 取消按钮事件
      document
        .getElementById("cancelAdult")
        .addEventListener("click", function () {
          window.close(); // 关闭页面
        });
    }
  }, 600);
});
