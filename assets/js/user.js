var postsHTML = '';

function toLink(item) {
	try {
		var i = item.indexOf(':');
		var splits = [item.slice(0, i), item.slice(i + 1)];
		postsHTML += $("posts").innerHTML.concat('<a class="post text-sh" href="post.html?id=').concat(splits[0]).concat('">').concat(splits[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).concat("</a>");
    } catch (err) {
		console.log("Whoops");
	}
}

function getPosts(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        data = this.responseText.split("\n");
        $('posts').innerHTML = "";
        for (i = 0; i < data.length - 1; i++) {
            toLink(data[i]);
        }
        $('posts').innerHTML = postsHTML;
    }
	xhttp.open("GET", "https://api.stibarc.com/getuserposts.sjs?id=" + id, true);
	xhttp.send(null);
}

function getStuff(id) {
	var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var tmp = JSON.parse(this.responseText);
        var rank = tmp['rank'];
        var name = tmp['name'];
        var email = tmp['email'];
        var birthday = tmp['birthday'];
        $("username").innerHTML = id.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").concat('<span id="verified" title="Verified user" style="display:none">' + '<img class="verify" src="./assets/images/verify.png"></span>');
        checkVerified(id);
        $("rank").innerHTML = "Rank: ".concat(rank);
        if (name != "Not shown" && name != "Not set") {
            $("name").innerHTML = "".concat(name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        }
        if (email != "Not shown" && email != "Not set") {
            $("email").innerHTML = "Email: ".concat("<a href=\"mailto:" + email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "\">" + email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</a>");
        } else {
            $("email").innerHTML = "Email: ".concat(email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        }
        $("birthday").innerHTML = "Birthday: ".concat(birthday.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));

        $("pfp").src = tmp['pfp'];
        $("followers").innerText = "Followers: "+tmp.followers.length;
        $("following").innerText = "Following: "+tmp.following.length;
        $("follow").innerText = "Follow";
        if (localStorage.username != undefined && localStorage.sess != undefined) {
            if (tmp.followers.indexOf(localStorage.username) != -1) {
                $("follow").innerText = "Following";
                $("follow").onclick = function() {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onload = function() {
                        location.reload();
                    }
                    xhttp.open("POST", "https://api.stibarc.com/v3/unfollow.sjs", true);
                    xhttp.send("sess="+localStorage.sess+"&id="+encodeURIComponent(id));
                }
            } else {
                $("follow").innerText = "Follow";
                $("follow").onclick = function() {
                    var xhttp = new XMLHttpRequest();
                    xhttp.onload = function() {
                        location.reload();
                    }
                    xhttp.open("POST", "https://api.stibarc.com/v3/follow.sjs", true);
                    xhttp.send("sess="+localStorage.sess+"&id="+encodeURIComponent(id));
                }
            }
        }
        var showbio = false;
        var bio = "";
        $("bioText").innerHTML = "";
        if (tmp['bio'] != undefined && tmp['bio'] != "") {
            bio = tmp['bio'].replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
            showbio = true;
        }
        if (showbio) {
            $("bio").style.display = "";
            $("bioText").innerHTML = bio;
        } else {
            $("bio").style.display = "none";
        }
    }
    xhttp.open("GET", "https://api.stibarc.com/v3/getuser.sjs?id=" + id, true);
    xhttp.send(null);
}

var id = getAllUrlParams().id;
document.title = id + " - STiBaRC";
getStuff(id);
getPosts(id);
