var feed = 0;
$("selectfeed").onclick = function () {
	if (feed == 1) {
		feed = 0;
		$("blob").style.display = "";
		$("followblob").style.display = "none";
		$("selectfeedtext").innerHTML = "GLOBAL";
	} else {
		feed = 1;
		$("blob").style.display = "none";
		$("followblob").style.display = "";
		$("selectfeedtext").innerHTML = "FOLLOWED";
	}
};

function emojiPost(text) {
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:" + emoji + "\\:", "g");
		text = text.replace(re, '<img src="https://cdn.stibarc.com/emojis/' + emojiIndex[emoji].filename + '" class="emoji" title=":' + emoji + ':"></img>');
	}
	return text;
}

var postsHTML = "";
function toLink(id, item) {
	try {
		if (item["deleted"]) {
			item["title"] = "Post deleted";
		}
		var title = item["title"]
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		postsHTML +=
			'<div class="post" onclick="goToPost(' +
			id +
			')" tabindex="1"> <div class="flex" style="align-items: initial;"> <div> <a href="post.html?id=' +
			id +
			'">' +
			emojiPost(title) +
			'</a> <div style="color: #7e7e7e;"><a href="user.html?id=' +
			item["poster"] +
			'">' +
			item["poster"] +
			'</a> </div> </div> <span class="flex-grow"></span> <span><span style="color: #a8a8a8;">' +
			item["upvotes"] +
			'</span><span style="color: #545454">/</span><span style="color: #a8a8a8;">' +
			item["downvotes"] +
			"</span> </span> </div> </div>";
		lastid = id;
	} catch (err) {
		console.log(err);
	}
}

var toFollowHTML = "";
function toFollowLink(id, item) {
	try {
		if (item["deleted"]) {
			item["title"] = "Post deleted";
		}
		var title = item["title"]
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		toFollowHTML +=
			'<div class="post" onclick="goToPost(' +
			id +
			')" tabindex="1"> <div class="flex" style="align-items: initial;"> <div> <a href="post.html?id=' +
			id +
			'">' +
			emojiPost(title) +
			'</a> <div style="color: #7e7e7e;"><a href="user.html?id=' +
			item["poster"] +
			'">' +
			item["poster"] +
			'</a> </div> </div> <span class="flex-grow"></span> <span><span style="color: #a8a8a8;">' +
			item["upvotes"] +
			'</span><span style="color: #545454">/</span><span style="color: #a8a8a8;">' +
			item["downvotes"] +
			"</span> </span> </div> </div>";
		lastfollowid = id;
	} catch (err) {
		console.log(err);
	}
}

function loadPosts() {
	$("posts").innerHTML = "Loading...";
	updateEmojiIndex();
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		var tmp = JSON.parse(this.responseText);
		$("posts").innerHTML = "";
		$("loadmorecontainer").style.display = "";
		var totalPosts = tmp["totalposts"];
		for (var i = totalPosts; i > totalPosts - 20; i--) {
			toLink(i, tmp[i]);
		}
		$("posts").innerHTML = postsHTML;
	};
	xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs", true);
	xhttp.send();
}

function loadFollowedPosts() {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		if (this.responseText != "No posts\n") {
			var followtmp = JSON.parse(this.responseText);
			$("followedposts").innerHTML = "";
			var tmpposts = [];
			for (var key in followtmp) {
				tmpposts.push(key);
			}
			for (var i = tmpposts.length - 1; i >= 0; i--) {
				toFollowLink(tmpposts[i], followtmp[tmpposts[i]]);
			}
			$("followedposts").innerHTML = toFollowHTML;
			$("followloadmorecontainer").style.display = "";
		} else {
			$("followedposts").innerHTML =
				"It looks like you aren't following anyone, or nobody has posted yet.";
		}
	};
	xhttp.open("GET", "https://api.stibarc.com/v3/getfollowposts.sjs?sess=" + sess, true);
	xhttp.send(null);
}

var lastid = 1;
var lastfollowid = 1;

function loadMore() {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		if (this.responseText.trim() != "") {
			var tmp = JSON.parse(this.responseText);
			var tmp2 = lastid - 1;
			for (var i = tmp2; i > tmp2 - 20; i--) {
				toLink(i, tmp[i]);
			}
			$("posts").innerHTML = postsHTML;
		} else {
			$("loadmorecontainer").style.display = "none";
		}
	};
	xhttp.open("GET", "https://api.stibarc.com/v2/getposts.sjs?id=" + lastid, true);
	xhttp.send(null);
}

function loadMoreFollow() {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		if (this.responseText.trim() != "No posts") {
			var tmp = JSON.parse(this.responseText);
			var tmp2 = [];
			for (var i in tmp) {
				tmp2.push(i);
			}
			for (var i = tmp2.length - 1; i >= 0; i--) {
				toFollowLink(tmp2[i], tmp[tmp2[i]]);
			}
			$("followedposts").innerHTML = toFollowHTML;
		} else {
			$("followloadmorecontainer").style.display = "none";
		}
	};
	xhttp.open("GET", "https://api.stibarc.com/v3/getfollowposts.sjs?sess=" + sess + "&id=" + lastfollowid, true);
	xhttp.send(null);
}

loadPosts();
if (sess != undefined && sess != null && sess != "") {
	loadFollowedPosts();
}

// if(loggedIn){
//     $('loggedOutHero').style.display = "none";
//     $('feedselect').style.display = "";
// }else{
//     $('loggedOutHero').style.display = "block";
// }
