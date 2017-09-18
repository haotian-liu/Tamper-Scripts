// ==UserScript==
// @name         NexusHD_PRO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://www.nexushd.org/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var temp, count, tagA, timeout, t, flag;
    function getSameTorrents(a) {
        var torrentDOM = getTorrentDOM(a.href.match(/\d+/)[0]);
        if (!torrentDOM.getElementById("kothercopy")) {
            return 0;
        } else {
            div.append(torrentDOM.getElementById("kothercopy").firstChild);
        }
    }
    function getDate() {
        var now = new Date();
        return ((now.getHours().toString().length == 1) ? "0" + now.getHours() : now.getHours()) + ":" + ((now.getMinutes().toString().length == 1) ? "0" + now.getMinutes() : now.getMinutes());
    }
    function signIn() {
        var signInXhr = new XMLHttpRequest();
        signInXhr.open("post", "signin.php", false);
        signInXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        signInXhr.send("action=post&content=%5Bem28%5D");
        alert("签到成功");
        document.getElementById("info_block").innerHTML = document.getElementById("info_block").innerHTML.replace(/>签到</g, ">已签到<");
    }
    function getTorrentDOM(torrentId) {
        var xhr = new XMLHttpRequest();
        var parser = new DOMParser();
        xhr.open("get", "/details.php?id=" + torrentId + "&hit=1", false);
        xhr.send(null);
        return parser.parseFromString(xhr.responseText, "text/html");
    }
    function bbcodeParse(bbcode) {
        var r = /\\u([\d\w]{4})/gi;
        bbcode = bbcode.slice(bbcode.indexOf("bbCode"), bbcode.indexOf("window.clipboardData.clearData"));
        bbcode = bbcode.slice(bbcode.indexOf("\"") + 1, bbcode.lastIndexOf("\""));
        bbcode = bbcode.replace(r, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
        });
        bbcode = unescape(bbcode);
        bbcode = bbcode.replace(/\\r\\n/g, "\n");
        bbcode = bbcode.replace(/\\t/g, " ");
        bbcode = bbcode.replace(/\\[/]/g, "/");
        return bbcode;
    }
    function sayType(text) {
        if (text.match(/Movies/)) {
            return 1;
        } else if (text.match(/TV Series/)) {
            return 2;
        } else if (text.match(/TV Shows/)) {
            return 3;
        } else if (text.match(/Documentaries/)) {
            return 4;
        } else if (text.match(/Anime/)) {
            return 5;
        } else if (text.match(/Sports/)) {
            return 6;
        } else if (text.match(/Music Videos/)) {
            return 7;
        } else if (text.match(/HQ Audio/)) {
            return 8;
        } else if (text.match(/Games/)) {
            return 9;
        } else if (text.match(/E-learning/)) {
            return 10;
        } else if (text.match(/Other/)) {
            return 11;
        } else { return 0; }
    }
    function saySourse(text) {
        if (text.match(/Blu-ray/)) {
            return 1;
        } else if (text.match(/HD DVD/)) {
            return 2;
        } else if (text.match(/DVD/)) {
            return 3;
        } else if (text.match(/HDTV/)) {
            return 4;
        } else if (text.match(/TV/)) {
            return 5;
        } else if (text.match(/WEB-DL/)) {
            return 6;
        } else if (text.match(/CD/)) {
            return 7;
        } else if (text.match(/Other/)) {
            return 8;
        } else if (text.match(/WEBRip/)) {
            return 9;
        } else { return 0; }
    }
    function sayCodec(text) {
        if (text.match(/H.264/)) {
            return 1;
        } else if (text.match(/VC-1/)) {
            return 2;
        } else if (text.match(/Xvid/)) {
            return 3;
        } else if (text.match(/MPEG-2/)) {
            return 4;
        } else if (text.match(/FLAC/)) {
            return 5;
        } else if (text.match(/APE/)) {
            return 6;
        } else if (text.match(/H.265/)) {
            return 7;
        } else if (text.match(/Other/)) {
            return 8;
        } else { return 0; }
    }
    function sayStandard(text) {
        if (text.match(/1080p/)) {
            return 1;
        } else if (text.match(/1080i/)) {
            return 2;
        } else if (text.match(/720p/)) {
            return 3;
        } else if (text.match(/SD/)) {
            return 4;
        } else if (text.match(/Lossless/)) {
            return 5;
        } else if (text.match(/2160p/)) {
            return 6;
        } else { return 0; }
    }
    function sayProcessing(text) {
        if (text.match(/Raw/)) {
            return 1;
        } else if (text.match(/Encode/)) {
            return 2;
        } else { return 0; }
    }
    function fillInForm(torrentDOM, form) {
        var title = torrentDOM.getElementById("top").childNodes[0].data.replace(/\s{3,}/, "");
        var subTitle = torrentDOM.getElementsByClassName("rowfollow")[1].innerText;
        var desc = bbcodeParse(torrentDOM.getElementById("outer").getElementsByTagName("script")[torrentDOM.getElementById("outer").getElementsByTagName("script").length - 1].innerHTML);
        var types = torrentDOM.getElementsByClassName("rowfollow")[2].innerText;
        var imdb, douban;
        if (torrentDOM.getElementById("kimdb")) {
            imdb = torrentDOM.getElementById("kimdb").innerText.match(/\d+/);
        } else if (desc.match(/imdb/)) {
            imdb = desc.slice(desc.indexOf("imdb"), desc.length).match(/\d+/);
        }
        if (torrentDOM.getElementById("kdouban")) {
            douban = torrentDOM.getElementById("kdouban").innerText.match(/\d+/);
        } else if (desc.match(/douban/)) {
            douban = desc.slice(desc.indexOf("douban"), desc.length).match(/\d+/);
        }
        form[0].onchange = null;
        form[1].value = title;
        form[2].value = subTitle;
        if (imdb) { form[3].value = "http://www.imdb.com/title/tt" + imdb + "\/"; }
        if (douban) { form[4].value = "https://movie.douban.com/subject/" + douban + "\/"; }
        form[17].value = desc;
        form[18].selectedIndex = sayType(types);
        if (types.match(/来源/)) { form[19].selectedIndex = saySourse(types.slice(types.indexOf("来源"), types.length)); }
        if (types.match(/编码/)) { form[20].selectedIndex = sayCodec(types.slice(types.indexOf("编码"), types.length)); }
        if (types.match(/分辨率/)) { form[21].selectedIndex = sayStandard(types.slice(types.indexOf("分辨率"), types.length)); }
        if (types.match(/处理/)) { form[22].selectedIndex = sayProcessing(types.slice(types.indexOf("处理"), types.length)); }
    }
    if (document.URL.match(/details.php\?id=/)) {
        temp = document.getElementById("copy-bbcode-link");
        temp.href = "/upload.php?cloneid=" + document.URL.match(/\d+/)[0];
        temp.target = "_blank";
        temp.childNodes[2].childNodes[0].innerText = "一键克隆";
        temp.onclick = null;
        temp = null;
    } else if (document.URL.match(/upload.php\?cloneid=/)) {
        fillInForm(getTorrentDOM(document.URL.match(/\d+/)), document.getElementById("compose"));
    } else if (document.URL.match(/torrents.php/)) {
        // var div = document.createElement("div");
        // div.id = "kothercopy";
        // div.style.backgroundColor = "white";
        // div.style.position = "absolute";
        // div.style.border = "1px solid gray";
        // div.style.borderRadius = "5px";
        // document.body.append(div);
        // temp = document.getElementsByClassName("torrentname");
        // for (count = 0; count < 50; count++) {
        //     temp[count].getElementsByTagName("a")[0].onmouseover = function (event) {
        //         var tagA = this;
        //         tagA.title = "";
        //         clearTimeout(timeout);
        //         timeout = setTimeout(function () {
        //             if (div.hasChildNodes()) { div.removeChild(div.firstChild); }
        //             div.style.top = window.pageYOffset + event.clientY + "px";
        //             div.style.left = event.clientX + "px";
        //             getSameTorrents(tagA);
        //             div.style.opacity = 0;
        //             div.style.visibility = "visible";
        //             t = window.setInterval(function () {
        //                 if (parseFloat(div.style.opacity) >= 0.95) {
        //                     window.clearInterval(t);
        //                 } else {
        //                     div.style.opacity = parseFloat(div.style.opacity) + 0.02;
        //                 }
        //             }, 10);
        //         }, 500);
        //     };
        //     temp[count].getElementsByTagName("a")[0].onmouseout = function () {
        //         clearTimeout(timeout);
        //         timeout = setTimeout(function () {
        //             t = window.setInterval(function () {
        //                 if (parseFloat(div.style.opacity) < 0) {
        //                     div.style.visibility = "hidden";
        //                     window.clearInterval(t);
        //                 } else {
        //                     div.style.opacity = parseFloat(div.style.opacity) - 0.05;
        //                 }
        //             }, 20);
        //         }, 2000);
        //     };
        // }
    }
    if (document.getElementById("info_block")) {
        if ((document.getElementById("info_block").innerText.match(/\[签到\]/))) {
            signIn();
        }
        document.getElementsByClassName("medium")[2].childNodes[0].data = "当前时间：" + getDate();
    }

    const setCookie = (name, value, days = 7, path = '/') => {
        const expires = new Date(Date.now() + days * 864e5).toGMTString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path;
    };

    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    };

    const deleteCookie = (name, path) => {
        setCookie(name, '', -1, path);
    };


    var tryFirstDiv = document.getElementsByTagName("div")[0];
    if (tryFirstDiv !== undefined && tryFirstDiv !== null) {
        var eggIMG = tryFirstDiv.getElementsByTagName("img")[0];
        var firstImgSrc = (function (item) {
            if (item !== undefined && item !== null) { return item.currentSrc; }
            else { return null; }
        })(eggIMG);
        if (firstImgSrc !== undefined && firstImgSrc !== null && firstImgSrc === "http://www.nexushd.org/pic/easteregg.png") {
            var link = tryFirstDiv.getElementsByTagName("a")[0].href;

            var http = new XMLHttpRequest();
            http.open("GET", link, true);
            http.send(null);
            alert("你刚刚抢到了一个彩蛋！");
            eggIMG.parentElement.removeChild(eggIMG);
        }
    }
})();