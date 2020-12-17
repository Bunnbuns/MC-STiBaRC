function $(id) {
	if (id.startsWith(".")) {
		return document.getElementsByClassName(id.substring(1));
	} else {
		return document.getElementById(id);
	}
}

// if(localStorage.getItem('pfp') !== null && localStorage.getItem('pfp') !== "") {
//     $("navpfp").src = localStorage.getItem('pfp');
// }
var emojiIndex = {};
if (
	localStorage.getItem("emojiIndex") !== null &&
	localStorage.getItem("emojiIndex") !== ""
) {
	emojiIndex = JSON.parse(localStorage.getItem("emojiIndex"));
}

var sess = localStorage.getItem("sess");
var loggedIn = false;
if (sess !== null && sess !== "") {
	loggedIn = true;
}

const loggedOutDivs = $(".loggedout");
const loggedInDivs = $(".loggedin");
if(loggedIn) {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "";
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "none";
    }
} else {
    for (var i = 0; i < loggedInDivs.length; i++) {
        loggedInDivs[i].style.display = "none";
    }
    for (var i = 0; i < loggedOutDivs.length; i++) {
        loggedOutDivs[i].style.display = "";
    }
}

// nav dropdown //
function updateNavDropdownContent() {
	if (loggedIn) {
		$("loggedInAs").innerHTML = localStorage.getItem("username");
		$("loggedInAs").title = "Logged in as " + localStorage.getItem("username");
		$("loggedInAs").href = "./user.html?id=" + localStorage.getItem("username");
		$("navpfp").title = "Logged in as " + localStorage.getItem("username");
	}
}

var click_stereo = new Audio();
click_stereo.src = "http://apis.buncode.com/minecraft/sounds/click_stereo.ogg";
click_stereo.volume = 0.15;
const mcButtons = $(".mc-button");
// nav dropdown display //
// var pfpNavDropdown = $("pfpNavDropdown");
// var navDropdown = $("navDropdown");
document.addEventListener("click", function (event) {
	// 	var isClickInside = pfpNavDropdown.contains(event.target);
	// 	var navDropdownContent = navDropdown.contains(event.target);
	// 	if ($("navDropdown").style.display == "none" || navDropdownContent) {
	// 		$("navDropdown").style.display = "block";
	// 		$("pfpNavDropdown").classList.add("active");
	// 	} else {
	// 		$("navDropdown").style.display = "none";
	// 		$("pfpNavDropdown").classList.remove("active");
	// 	}
	// 	if (!isClickInside && !navDropdownContent) {
	// 		//the click was outside the nav dropdown
	// 		$("navDropdown").style.display = "none";
	// 		$("pfpNavDropdown").classList.remove("active");
	// 	}
	for (var i = 0; i < mcButtons.length; i++) {
		var buttonClicked = mcButtons[i].contains(event.target);
		if (buttonClicked) {
			click_stereo.play();
			click_stereo.currentTime = 0;
		}
	}
});

// login popup //
var popuped = false;
function loginPopUp() {
	if (!popuped) {
		popuped = true;
		var loginpopup = window.open(
			"https://stibarc.com/login/",
			"",
			"menubar=no,location=no,resizable=no,scrollbars=yes,status=yes,height=360,width=500"
		);
		window.addEventListener("message", function (evt) {
			if (evt.data != "Cancelled") {
				localStorage.sess = evt.data;
				console.log(evt.data);
				loginpopup.close();
				location.href = "index.html";
			} else {
				loginpopup.close();
				popuped = false;
			}
		});
	}
}

// get profile info //
function getUserInfo() {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		localStorage.setItem(
			"username",
			this.responseText.replace(/(\r\n|\n|\r)/gm, "")
		);
		updateNavDropdownContent();
		getUserPfp("navpfp", localStorage.getItem("username"));
	};
	xhttp.open(
		"GET",
		"https://api.stibarc.com/v2/getusername.sjs?sess=" +
			localStorage.getItem("sess"),
		true
	);
	xhttp.send();
}

// get profile pfp //
function getUserPfp(callback, username) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		var userPfp = this.responseText;
		if (callback == "post") {
			$("postPfp").src = userPfp;
		} else {
			localStorage.setItem("pfp", userPfp);
			$("navpfp").src = localStorage.getItem("pfp");
		}
	};
	xhttp.open(
		"GET",
		"https://api.stibarc.com/v2/getuserpfp.sjs?id=" + username,
		true
	);
	xhttp.send();
}

// logout //
function logout() {
	console.log("Loging out... (Sending request to kill session)");
	localStorage.removeItem("username");
	localStorage.removeItem("pfp");
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		var tmp = this.responseText;
		console.log("Loging out... (Request sent)");
		if (tmp == "gud\n") {
			// logout went ok
			localStorage.removeItem("sess");
			console.log("Loging out complete: " + tmp);
			location.href = "index.html";
		} else {
			// logout request sent but might no be ok
			localStorage.removeItem("sess");
			console.log("Logout failed (Request error: " + tmp + ")");
			alert("Logout may have failed (Request error: " + tmp + ")");
		}
	};
	xhttp.open(
		"GET",
		"https://api.stibarc.com/logout.sjs?sess=" + localStorage.getItem("sess"),
		true
	);
	xhttp.send();
}

function checkVerified(poster) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		var data = this.responseText.split("\n")[0];
		if (data == "true") {
			$("verified").style.display = "";
		}
	};
	xhttp.open(
		"GET",
		"https://api.stibarc.com/checkverify.sjs?id=" + poster,
		true
	);
	xhttp.send(null);
}

function emojiHTML(emoji) {
	return (
		'<img src="https://cdn.stibarc.com/emojis/' +
		emojiIndex[emoji].filename +
		'" class="emoji" title=":' +
		emoji +
		':" alt=":' +
		emoji +
		':">'
	);
}

function updateEmojiIndex(callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		emojiIndex = JSON.parse(this.responseText);
		localStorage.setItem("emojiIndex", this.responseText);
		if (callback == "post") {
			emojisReplace(emojiIndex);
		}
	};
	xhttp.open("GET", "https://cdn.stibarc.com/emojis/index.json", true);
	xhttp.send(null);
}

function goToPost(id) {
	window.location.href = "./post.html?id=" + id;
}

function getAllUrlParams(url) {
	var queryString = url ? url.split("?")[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split("#")[0];
		var arr = queryString.split("&");
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split("=");
			var paramNum = undefined;
			var paramName = a[0].replace(/\[\d*\]/, function (v) {
				paramNum = v.slice(1, -1);
				return "";
			});
			var paramValue = typeof a[1] === "undefined" ? true : a[1];
			paramName = paramName;
			paramValue = paramValue;
			if (obj[paramName]) {
				if (typeof obj[paramName] === "string") {
					obj[paramName] = [obj[paramName]];
				}
				if (typeof paramNum === "undefined") {
					obj[paramName].push(paramValue);
				} else {
					obj[paramName][paramNum] = paramValue;
				}
			} else {
				obj[paramName] = paramValue;
			}
		}
	}
	return obj;
}

// if(loggedIn) {
//     getUserInfo();
// }