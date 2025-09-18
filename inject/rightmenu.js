var selectTextNow = "";
let rmWidth = document.getElementById("rightMenu").offsetWidth,
    rmHeight = document.getElementById("rightMenu").offsetHeight,
    domhref = "",
    domImgSrc = "",
    globalEvent = null,
    rm = {};

function imageToBlob(e) {
	const n = new Image,
		t = document.createElement("canvas"),
		o = t.getContext("2d");
	return n.crossOrigin = "", n.src = e, new Promise((e => {
		n.onload = function() {
			t.width = this.naturalWidth, t.height = this.naturalHeight, o.drawImage(this, 0, 0), t.toBlob((n => {
				e(n)
			}), "image/png", .75)
		}
	}))
}
async function copyImage(e) {
	const n = await imageToBlob(e),
		t = new ClipboardItem({
			"image/png": n
		});
	navigator.clipboard.write([t])
}

function stopMaskScroll() {
	if (document.getElementById("rightMenu-mask")) {
		document.getElementById("rightMenu-mask").addEventListener("mousewheel", (function(e) {
            rm.hideRightMenu()
        }), !1)
	}
	if (document.getElementById("rightMenu")) {
		document.getElementById("rightMenu").addEventListener("mousewheel", (function(e) {
            rm.hideRightMenu()
        }), !1)
	}
}

function addRightMenuClickEvent() {
    document.getElementById("rightMenu-mask").addEventListener("click", rm.hideRightMenu);
    document.getElementById("rightMenu-mask").addEventListener("contextmenu", function() {
        rm.hideRightMenu();
        return false;
    });
    document.getElementById("menu-backward").addEventListener("click", function() {
        window.history.back();
        rm.hideRightMenu();
    });
    document.getElementById("menu-forward").addEventListener("click", function() {
        window.history.forward();
        rm.hideRightMenu();
    });
    document.getElementById("menu-refresh").addEventListener("click", function() {
        rm.hideRightMenu();
        window.location.reload();
    });
    document.getElementById("menu-darkmode").addEventListener("click", rm.switchDarkMode);
    document.getElementById("menu-reading").addEventListener("click", rm.switchReadMode);
    document.getElementById("menu-commentBarrage").addEventListener("click", function() {
        rm.hideRightMenu();
        rm.switchCommentBarrage();
    });
    document.getElementById("menu-postlink").addEventListener("click", rm.copyPostUrl);
    document.getElementById("menu-copytext").addEventListener("click", function() {
        rm.rightmenuCopyText(selectTextNow);
        btf.snackbarShow("复制成功，复制和转载请标注本文地址");
    });
    document.getElementById("menu-pastetext").addEventListener("click", rm.pasteText);
    document.getElementById("menu-commenttext").addEventListener("click", function() {
        rm.commentText(selectTextNow);
        rm.hideRightMenu();
    });
    document.getElementById("menu-searchBaidu").addEventListener("click", rm.searchBaidu);
    document.getElementById("menu-newwindow").addEventListener("click", function() {
        window.open(domhref);
        rm.hideRightMenu();
    });
    document.getElementById("menu-copylink").addEventListener("click", rm.copyLink);
    document.getElementById("menu-copyimg").addEventListener("click", function() {
        rm.writeClipImg(domImgSrc);
    });
    document.getElementById("menu-downloadimg").addEventListener("click", function() {
        rm.downloadImage(domImgSrc, "MeuiCat");
    });
    document.getElementById("menu-copylinkimg").addEventListener("click", function() {
        rm.CopyLinkImg(domImgSrc);
    });
    document.getElementById("menu-randomPost").addEventListener("click", function() {
        rm.hideRightMenu();
        toRandomPost();
    });
    document.getElementById("menu-translate").addEventListener("click", rm.translate);
    document.getElementById("menu-asidehide").addEventListener("click", rm.hideAsideBtn);
}

function selceText() {
    var e;
    if (window.getSelection) {
        e = window.getSelection().toString();
    } else if (document.selection) {
        e = document.selection.createRange().text;
    }
    selectTextNow = e || "";
}

window.oncontextmenu = function(e) {
    if (document.body.clientWidth > 768) {
        let n = e.clientX + 10,
            t = e.clientY,
            p = document.querySelector(".rightMenuPost"),
            o = document.querySelector(".rightMenuOther"),
            i = document.querySelector(".rightMenuPlugin"),
            g = document.getElementById("menu-commentBarrage"),
            c = document.getElementById("menu-copytext"),
            r = document.getElementById("menu-pastetext"),
            m = document.getElementById("menu-commenttext"),
            d = document.getElementById("menu-search"),
            s = document.getElementById("menu-searchBaidu"),
            a = document.getElementById("menu-newwindow"),
            u = document.getElementById("menu-copylink"),
            l = document.getElementById("menu-copyimg"),
            h = document.getElementById("menu-downloadimg"),
            w = document.getElementById("menu-copylinkimg"),
            y = e.target.href,
            M = e.target.currentSrc,
            b = false;

        o.style.display = "block";
        globalEvent = e;

        if (selectTextNow && window.getSelection()) {
            b = true;
            c.style.display = "block";
            document.getElementById("post-comment") ? m.style.display = "block" : m.style.display = "none";
            d.style.display = "block";
            s.style.display = "block";
            p.style.display = "none";
        } else {
            c.style.display = "none";
            m.style.display = "none";
            d.style.display = "none";
            s.style.display = "none";
        }

        if (y) {
            b = true;
            a.style.display = "block";
            u.style.display = "block";
            domhref = y;
            p.style.display = "none";
        } else {
            a.style.display = "none";
            u.style.display = "none";
        }

        if (M) {
            b = true;
            l.style.display = "block";
            h.style.display = "block";
            w.style.display = "block";
            domImgSrc = M;
            p.style.display = "none";
        } else {
            l.style.display = "none";
            h.style.display = "none";
            w.style.display = "none";
        }

        if (e.target.tagName.toLowerCase() === "input" || e.target.tagName.toLowerCase() === "textarea") {
            b = true;
            r.style.display = "block";
            p.style.display = "none";
        } else {
            r.style.display = "none";
        }

        if (b) {
            o.style.display = "none";
            i.style.display = "block";
        } else {
            i.style.display = "none";
            document.querySelector("#body-wrap.post") ? p.style.display = "block" : p.style.display = "none";
        }

        document.querySelector(".read-mode") ? g.style.display = "none" : g.style.display = "block";

        rm.reloadrmSize();

        if (n + rmWidth > window.innerWidth) {
            n -= rmWidth + 10;
        }

        if (t + rmHeight > window.innerHeight) {
            t -= t + rmHeight - window.innerHeight;
        }
        
        rm.showRightMenu(true, t, n);
        document.getElementById("rightMenu-mask").style.display = "flex";
        return false;
    }
}
document.onmouseup = document.ondbclick = selceText

rm.showRightMenu = function(e, n = 0, t = 0) {
    const rightMenu = document.getElementById("rightMenu");
    rightMenu.style.top = n + "px";
    rightMenu.style.left = t + "px";
    if (e) {
        rightMenu.style.display = "block";
        stopMaskScroll();
    } else {
        rightMenu.style.display = "none";
    }
},
rm.hideRightMenu = function() {
    rm.showRightMenu(false);
    document.getElementById("rightMenu-mask").style.display = "none";
},
rm.reloadrmSize = function() {
    const rightMenu = document.getElementById("rightMenu");
    rightMenu.style.display = "block"; // Ensure the element is visible
    rmWidth = rightMenu.offsetWidth;
    rmHeight = rightMenu.offsetHeight;
    rightMenu.style.display = "none"; // Hide it again if necessary
},
rm.switchDarkMode = function() {
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        btf.activateDarkMode()
        btf.saveToLocal.set('theme', 'dark', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
        btf.activateLightMode()
        btf.saveToLocal.set('theme', 'light', 2)
        GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread')
        .children.length && setTimeout(() => window.disqusReset(), 200)
    // document.getElementById('darkmode').click();
    rm.hideRightMenu()
},
rm.switchReadMode = function() {
    const body = document.body;
    if (!document.querySelector(".read-mode")) {
        body.classList.add('read-mode');
        const newButton = document.createElement('button');
        newButton.type = 'button';
        newButton.className = 'iconfont icat-exit-mode exit-readmode';
        body.appendChild(newButton);

        const clickFn = () => {
            body.classList.remove('read-mode');
            newButton.remove();
            newButton.removeEventListener('click', clickFn);
        };

        newButton.addEventListener('click', clickFn);
        document.getElementById("menu-reading").querySelector("span").textContent = "退出阅读模式";
    } else {
        body.classList.remove('read-mode');
        const exitButton = document.querySelector('.exit-readmode');
        if (exitButton) {
            exitButton.remove();
        }
        document.getElementById("menu-reading").querySelector("span").textContent = "阅读模式";
    }
    rm.hideRightMenu();
},
rm.switchCommentBarrage = function() {
    const commentBarrage = document.querySelector(".comment-barrage");
    if (commentBarrage) {
        if (commentBarrage.style.display === "block") {
            commentBarrage.style.display = "none";
            document.getElementById("menu-commentBarrage").querySelector("span").textContent = "显示热评";
            document.querySelector("#consoleCommentBarrage").classList.remove("on");
            localStorage.setItem("commentBarrageSwitch", "false");
        } else {
            commentBarrage.style.display = "block";
            document.getElementById("menu-commentBarrage").querySelector("span").textContent = "关闭热评";
            document.querySelector("#consoleCommentBarrage").classList.add("on");
            localStorage.removeItem("commentBarrageSwitch");
        }
    }
    rm.hideRightMenu();
},
rm.copyUrl = function(url) {
    const input = document.createElement("input");
    input.id = "copyVal";
    document.body.appendChild(input);
    input.value = url;
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("copy");
    input.remove();
},
rm.copyPostUrl = function() {
    const url = window.location.href;
    rm.copyUrl(url);
    btf.snackbarShow("复制本页链接地址成功", false, 2000);
    rm.hideRightMenu();
},
rm.rightmenuCopyText = function(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    }
    rm.hideRightMenu();
},
rm.readClipboard = function() {
    if (navigator.clipboard) {
        navigator.clipboard.readText().then((text) => rm.insertAtCaret(globalEvent.target, text));
    }
},
rm.insertAtCaret = function(input, text) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (document.selection) {
        input.focus();
        document.selection.createRange().text = text;
        input.focus();
    } else if (start || start === 0) {
        const scrollTop = input.scrollTop;
        input.value = input.value.substring(0, start) + text + input.value.substring(end, input.value.length);
        input.focus();
        input.selectionStart = start + text.length;
        input.selectionEnd = start + text.length;
        input.scrollTop = scrollTop;
    } else {
        input.value += text;
        input.focus();
    }
},
rm.pasteText = function() {
    rm.readClipboard();
    rm.hideRightMenu();
},
rm.commentText = function (txt) {
    const inputs = ["#wl-edit", ".el-textarea__inner"];
    for (let i = 0; i < inputs.length; i++) {
        let el = document.querySelector(inputs[i]);
        if (el != null) {
            el.dispatchEvent(new Event('input', { bubble: true, cancelable: true }));
            el.value = '> ' + txt.replace(/\n/g, '\n> ') + '\n\n';
            el.focus();
            el.setSelectionRange(-1, -1);
        }
    }
},
rm.searchBaidu = function() {
    btf.snackbarShow("即将跳转到谷歌搜索", false, 2000);
    setTimeout(function() {
        window.open("https://www.google.com/search?q=" + selectTextNow);
    }, 2000);
    rm.hideRightMenu();
},
rm.copyLink = function() {
    rm.rightmenuCopyText(domhref);
    btf.snackbarShow("已复制链接地址");
},
rm.writeClipImg = function(url) {
    const lazyTime = "2000";
    const waitTime = "localhost" === window.location.hostname || "127.0.0.1" === window.location.hostname ? 0 : 10000;
    console.log("按下复制");
    rm.hideRightMenu();
    btf.snackbarShow("正在下载中，请稍后", false, waitTime);
    if (rm.downloadimging === 0) {
        rm.downloadimging = true;
        setTimeout(function() {
            copyImage(url);
            btf.snackbarShow("复制成功！图片已添加盲水印，请遵守版权协议");
            rm.downloadimging = false;
        }, lazyTime);
    }
},
rm.downloadImage = function(url, name) {
    rm.hideRightMenu();
    if (rm.downloadimging === 0) {
        rm.downloadimging = true;
        btf.snackbarShow("正在下载中，请稍后", false, 10000);
        setTimeout(function() {
            let img = new Image();
            img.setAttribute("crossOrigin", "anonymous");
            img.onload = function() {
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                let dataURL = canvas.toDataURL("image/png");
                let a = document.createElement("a");
                let event = new MouseEvent("click");
                a.download = name || "photo";
                a.href = dataURL;
                a.dispatchEvent(event);
            };
            img.src = url;
            btf.snackbarShow("图片已添加盲水印，请遵守版权协议");
            rm.downloadimging = false;
        }, 10000);
    } else {
        btf.snackbarShow("有正在进行中的下载，请稍后再试");
    }
},
rm.CopyLinkImg = function(url) {
    rm.rightmenuCopyText(url);
    btf.snackbarShow("已复制图片链接");
},
rm.translate = function() {
    rm.hideRightMenu();
    document.getElementById("translateLink").click();
},
rm.hideAsideBtn = function() {
    const htmlDom = document.documentElement.classList;
    const saveStatus = htmlDom.contains('hide-aside') ? 'show' : 'hide';
    btf.saveToLocal.set('aside-status', saveStatus, 2);
    htmlDom.toggle('hide-aside');
    rm.hideRightMenu();
};

// 右键菜单
addRightMenuClickEvent();

// 监听 pjax 页面跳转成功事件
document.addEventListener('pjax:success', function () {
  console.log('Pjax: New content loaded successfully');
  // 页面加载完成后执行操作，例如重新初始化插件
  addRightMenuClickEvent();

})