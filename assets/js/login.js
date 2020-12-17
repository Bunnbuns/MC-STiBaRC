function login() {
    $("errorMsg").style.display = "none";
	var username = $("username").value;
	var password = $("password").value;
	if (username != undefined && username != "" && password != undefined && password != "") {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            sess = this.responseText;
            if (sess != "Invalid username or password\n") {
                localStorage.setItem("sess", sess.split("\n")[0]);
                localStorage.setItem("username", username);
                if (getAllUrlParams().redir != undefined && getAllUrlParams().redir.trim() != "") {
                    location.href = decodeURIComponent(getAllUrlParams().redir);
                } else {
                    location.href = "./index.html";
                }
            } else {
                $("errorMsg").style.display = "";
                $("errorMsg").innerHTML = "Invalid username or password!";
            }
        }
		xhttp.open("POST", "https://api.stibarc.com/createsess.sjs", true);
		xhttp.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));

	} else {
        $("errorMsg").style.display = "";
		$("errorMsg").innerHTML = "Username or password cannot be blank!";
	}
}

window.onload = function () {
	$("login").onclick = function () {
		login();
	}
	$("username").addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			document.getElementById("password").focus();
		}
	});
	$("password").addEventListener("keyup", function(e) {
		if (e.keyCode == 13) {
			login();
		}
	});
}
