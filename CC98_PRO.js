// ==UserScript==
// @name         CC98_PRO
// @namespace    http://vexio.net/
// @version      0.1
// @description  Optimize cc98
// @author       You
// @match        http://www.cc98.org/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    let today = new Date().getDate().toString();

    let sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    let getBearerAuth = () => {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken === null) {
            alert('access token not found!');
            return null;
        }
        return accessToken.slice(4);
    };

    let signin = () => {
        var http = new XMLHttpRequest();
        http.open("POST", "https://api-v2.cc98.org/me/signin", true);
        http.setRequestHeader("Content-type", "application/json");
        http.setRequestHeader("Authorization", getBearerAuth());
        http.send("嘻嘻嘻！");
    };

    async function checkSignin() {
        if (localStorage.getItem('last_signin') === today) {
            return true;
        }
        await sleep(500);
        var http = new XMLHttpRequest();
        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                let p = JSON.parse(http.response);
                if (p.hasSignedInToday === false) {
                    console.log("Try to signin...");
                    signin();
                } else {
                    localStorage.setItem('last_signin', today);
                }
            }
        };
        http.open("GET", "https://api-v2.cc98.org/me/signin", true);
        http.setRequestHeader("Authorization", getBearerAuth());
        http.send();
    }

    checkSignin();
})();