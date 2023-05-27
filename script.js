// ==UserScript==
// @name         Youtube-Loop-Between
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = ""

    setInterval(function(){
        if (currentUrl != window.location.href &&  document.getElementById("info-contents") != null) extensionFunc()
        else {
            if (document.querySelector(".skipsContainer") === null) extensionFunc()
        }
    }, 3000);


    const extensionFunc = () => {

        currentUrl = window.location.href

        const getSeconds = (timestamp) => {
            let nums = timestamp.split(":").map((n) => parseInt(n))
            if (nums.length === 2) return (nums[0]*60 + nums[1])
            else return ((nums[0]*3600) + (nums[1]*60) + nums[2])
        }

        const getTimestamp = (seconds) => {

            seconds = Math.round(seconds)

            if (seconds < 3600) {
                let kalan = seconds % 60
                if (kalan < 10) kalan = "0" + kalan.toString()
                return Math.floor(seconds / 60).toString() + ":" + kalan
            }

            else {
                let kalan_minutes = (Math.floor((seconds%3600)/60))
                if (kalan_minutes < 10) kalan_minutes = "0" + kalan_minutes.toString()

                let kalan_seconds = seconds % 60
                if (kalan_seconds < 10) kalan_seconds = "0" + kalan_seconds.toString()

                return Math.floor((seconds / 3600)).toString() + ":" + kalan_minutes + ":" + kalan_seconds
            }

        }


        let video = document.getElementsByClassName('video-stream')[0];

        let loopStart = 0
        let loopEnd = getSeconds(document.querySelector(".ytp-time-duration").textContent)

        let skipsToggle = document.createElement("div")
        skipsToggle.style.position = "absolute"
        skipsToggle.style.width = "13px"
        skipsToggle.style.height = "13px"
        skipsToggle.style.borderRadius = "50%"
        skipsToggle.style.backgroundColor = "#A3A3A3"
        skipsToggle.style.right = "15px"
        skipsToggle.style.top = "11px"
        skipsToggle.style.opacity = "0.1"
        skipsToggle.style.cursor = "pointer"
        skipsToggle.style.color = "#e9e9e9"

        skipsToggle.addEventListener("mouseover", () => {
            skipsToggle.style.opacity = "0.8"
        })

        skipsToggle.addEventListener("mouseout", () =>  {
            skipsToggle.style.opacity = "0.1"
        })


        skipsToggle.addEventListener("click", () => {
            if (document.querySelector(".skipsContainer").style.display === "block") {
                document.querySelector(".skipsContainer").style.display = "none"
            }

            else {
                document.querySelector(".skipsContainer").style.display = "block"
            }
        })

        let parentElement = document.getElementById("info-contents")
        parentElement.style.position = "relative"
        parentElement.insertBefore(skipsToggle, parentElement.firstChild);


        let skipsContainer = document.createElement("div")
        //skipsContainer.style.backgroundColor = "#aaa"
        skipsContainer.style.margin = "12px auto -10px"
        skipsContainer.style.textAlign = "center"
        skipsContainer.className = "skipsContainer"
        skipsContainer.style.display = "none"


        let setStartDiv = document.createElement("span")
        setStartDiv.textContent = "Set loop start (Current: 0:00)"
        setStartDiv.id = "setStart"
        setStartDiv.className = "skipExtension startDiv"

        setStartDiv.addEventListener("click", () => {
            loopStart = video.currentTime;
            document.querySelector(".startDiv").textContent = `Set loop start (Current: ${getTimestamp(loopStart)})`
        })

        skipsContainer.appendChild(setStartDiv)

        //////////////////////////////////////////

        let setResetDiv = document.createElement("span")
        setResetDiv.textContent = "[ Reset loops ]"
        setResetDiv.id = "setReset"
        setResetDiv.className = "skipExtension setResetDiv"

        setResetDiv.addEventListener("click", () => {
            loopStart = 0
            loopEnd =  getSeconds(document.querySelector(".ytp-time-duration").textContent)

            document.querySelector(".startDiv").textContent = "Set loop start (Current: 0:00)"
            document.querySelector(".endDiv").textContent = `Set loop end (Current: ${document.querySelector(".ytp-time-duration").textContent})`

        })

        skipsContainer.appendChild(setResetDiv)


        /////////////////////////////////////////////

        let setEndDiv = document.createElement("span")
        setEndDiv.textContent = "Set loop end (Current: " + document.querySelector(".ytp-time-duration").textContent + ")"
        setEndDiv.id = "setEnd"
        setEndDiv.className = "skipExtension endDiv"

        setEndDiv.addEventListener("click", () => {
            loopEnd = video.currentTime;
            document.querySelector(".endDiv").textContent = `Set loop end (Current: ${getTimestamp(loopEnd)})`
        })

        skipsContainer.appendChild(setEndDiv)

        parentElement.insertBefore(skipsContainer, parentElement.firstChild);


        document.querySelectorAll(".skipExtension").forEach((d) => {

            d.style.color = "#A3A3A3"
            d.style.fontSize = "14px"
            d.style.margin = "0 42px"
            d.style.cursor = "pointer"

            d.addEventListener("mouseover", () => {
                d.style.color = "#5e84f1"
            })

            d.addEventListener("mouseout", () =>  {
                d.style.color = "#A3A3A3"
            })

        })



        let intervalPassedUrl = currentUrl
        let myInterval = setInterval(function(){

            if (video.currentTime > loopEnd || video.currentTime < loopStart) {
                video.currentTime = loopStart
            }

            if (intervalPassedUrl != window.location.href) clearInterval(myInterval);

        }, 750);
    }




})();
