var postData = null;
var pushed = false;

function postcomment(id) {
	try {
	var again = localStorage.getItem("cancommentagain");
	if (again == null || again == "" || again == undefined) again = 0;
	var content = $("comtent").value;
	var title = document.title;
	if (content != "" && content != undefined && title != "" && title != undefined) {
		if (new Date().getTime() >= again) {
			pushed = true;
			var n = new Date().getTime() + 15000;
			localStorage.setItem("cancommentagain", n);
			$("comtent").value = "";
			var sess = localStorage.getItem("sess");
			var xhttp = new XMLHttpRequest();
			xhttp.onload = function() {
				location.reload();
			}
			xhttp.open("POST", "https://api.stibarc.com/newcomment.sjs", true);
			xhttp.send("sess=" + sess + "&postid=" + id + "&content=" + encodeURIComponent(content).replace(/%0A/g, "%0D%0A"));
		} else {
			var left = again - new Date().getTime();
			left = Math.round(left/1000);
			$("wait").innerHTML = "Please wait " + left + " more seconds before posting again";
			$("wait").style.display = "";
		}
	}
	} catch(err) {
		console.log(err);
	}
}

function getAttach(postData) {
	var images = ["png","jpg","gif","webp","svg"];
	var videos = ["mov","mp4","m4a","webm"];
	var audio = ["spx","m3a","wma","wav","mp3"];
	$("attachmentBtn").style.display = "none";
	if (postData['real_attachment'] != undefined && postData['real_attachment'] != "" && postData['real_attachment'] != "none") {
		var ext = postData['real_attachment'].split(".")[1];
		if (images.indexOf(ext) != -1) {
			var img = document.createElement("IMG");
			img.setAttribute("id", "image");
			img.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			$("attachment").appendChild(img);
		} else if (videos.indexOf(ext) != -1) {
			var video = document.createElement("VIDEO");
			video.setAttribute("controls", null);
			video.setAttribute("autoplay", null);
			video.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			video.appendChild(source);
			$("attachment").appendChild(video);
		} else if (audio.indexOf(ext) != -1) {
			var audio = document.createElement("AUDIO");
			audio.setAttribute("controls", null);
			audio.setAttribute("autoplay", null);
			audio.setAttribute("id", "image");
			var source = document.createElement("SOURCE");
			source.setAttribute("src", "https://cdn.stibarc.com/images/"+postData['real_attachment']);
			audio.appendChild(source);
			$("attachment").appendChild(audio);
		} else {
			$("attachmentBtn").style.display = "";
			window.open("https://cdn.stibarc.com/images/"+postData['real_attachment']);
		}
	} else {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            var media = this.responseText;
            if (media.substring(5,10) == "image") {
                var img = document.createElement("IMG");
                img.setAttribute("id", "image");
                img.setAttribute("src", media);
                $("attachment").appendChild(img);
            } else if (media.substring(5,10) == "video" || media.substring(5,20) == "application/mp4") {
                var video = document.createElement("VIDEO");
                video.setAttribute("controls", null);
                video.setAttribute("autoplay", null);
                video.setAttribute("id", "image");
                var source = document.createElement("SOURCE");
                source.setAttribute("src", media);
                video.appendChild(source);
                $("attachment").appendChild(video);
            } else if (media.substring(5,10) == "audio" || media.substring(5,20) == "application/mp3" || media.substring(5,20) == "application/wav") {
                var audio = document.createElement("AUDIO");
                audio.setAttribute("controls", null);
                audio.setAttribute("autoplay", null);
                audio.setAttribute("id", "image");
                var source = document.createElement("SOURCE");
                source.setAttribute("src", media);
                audio.appendChild(source);
                $("attachment").appendChild(audio);
            } else {
                $("attachmentBtn").style.display = "";
                window.open(media);
            }
        }
		xhttp.open("GET", "https://api.stibarc.com/getimage.sjs?id="+postData['attachment'], true);
		xhttp.send();
	}
}

function replyto(guy) {
	var sess = localStorage.getItem("sess");
	if (sess != undefined && sess != "" && sess != null) {
		$("comtent").value = $("comtent").value + "@" + guy + " ";
		$("comtent").focus();
	} else {
		location.href="login.html?redir=post.html%3Fid%3D"+getAllUrlParams().id;
	}
}

function reloadvotes() {
	var id = getAllUrlParams().id;
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id="+id, true);
	xhttp.onload = function() {
		var data = JSON.parse(this.responseText);
		$("upvotes").innerHTML = data['upvotes'];
		$("downvotes").innerHTML = data['downvotes'];
	}
	xhttp.send();
}

function upvote() {
	var sess = localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhttp = new XMLHttpRequest();
		xhttp.open("post", "https://api.stibarc.com/upvote.sjs", true);
		xhttp.onload = function() {
			reloadvotes();
		}
		xhttp.send("id="+id+"&sess="+sess);
	}
}

function downvote() {
	var sess = localStorage.getItem("sess");
	var id = getAllUrlParams().id;
	if (sess != undefined && sess != "") {
		var xhttp = new XMLHttpRequest();
		xhttp.open("post", "https://api.stibarc.com/downvote.sjs", true);
		xhttp.onload = function() {
			reloadvotes();
		}
		xhttp.send("id="+id+"&sess="+sess);
	}
}

function greenify() {
	var content = $("postContent").innerHTML;
	var tmp = content.split("<br>");
	for (var i = 0; i < tmp.length; i++) {
		if (tmp[i].split("")[0] == "&" && tmp[i].split("")[1] == "g" && tmp[i].split("")[2] == "t" && tmp[i].split("")[3] == ";" && tmp[i].split("")[4] != " ") {
			console.log(i);
			tmp[i] = '<span style="color:green;">'+tmp[i]+"</span>"
		}
	}
	$("postContent").innerHTML = tmp.join("<br>");
}

function emojisReplace(emojiIndex) {
	var content = $("postContent").innerHTML;
	var title = $("postTitle").innerHTML;
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:"+emoji+"\\:","g");
		content = content.replace(re, emojiHTML(emoji));
		title = title.replace(re, emojiHTML(emoji));
	}
	$("postContent").innerHTML = content;
	$("postTitle").innerHTML = title;
}

function emojiComment(commentText) {
	for (var emoji in emojiIndex) {
		var re = new RegExp("\\:"+emoji+"\\:","g");
		commentText = commentText.replace(re, emojiHTML(emoji));
	}
	return commentText;
}

window.onload = function () {
	var id = getAllUrlParams().id;
	loadPost(id);
	loadComments(id);
	updateEmojiIndex();
}

function loadComments(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onload = function() {
		if (sess != undefined && sess != null && sess != "") {
			$('newcomment').style.display = '';
		}
		if (this.responseText != "undefined\n") {
			var comments = JSON.parse(this.responseText);
			var commentsHTML = '';
			for (var key in comments) {
				var image = "";
				image = '<img src="' + comments[key].pfp + '"style="width:40px;height:40px;border-radius:50%;vertical-align:middle;margin-right:8px;" />';
				commentsHTML += '<div class="comment"><div><a class="comment-username" href="user.html?id=' + comments[key]['poster'] + '">'+image+comments[key]['poster'].replace(/&/g, "&amp;") + '</a></div><div class="content">' + emojiComment(comments[key]['content'].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>")) + '</div><a class="replyto light-text" href="javascript:replyto('+"'"+comments[key]['poster']+"'"+')">Reply</a></div>';
			}
			$('comments').innerHTML = commentsHTML;
		} else {
			$("comments").innerHTML = '<div id="comment">No comments</div>';
		}
	}
	xhttp.open("GET", "https://api.stibarc.com/getcomments.sjs?id=" + id, true);
	xhttp.send(null);
}

var htmlAbleUsernames = ["herronjo", "DomHupp", "Aldeenyo", "savaka", "alluthus", "Bunnbuns", "Merkle"];

function buildPost(data, id) {
    document.title = data.title + " - STiBaRC";
    $("postTitle").innerHTML = data.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	$("postUsername").innerHTML = '<a href="user.html?id=' + data.poster + '">' + data.poster + '</a><span id="verified" title="Verified user" style="display:none">' + "&#10004;&#65039;</span>";
	checkVerified(data.poster);
    $("postDate").innerHTML = data.postdate;
    getUserPfp('post', data.poster);
    if (htmlAbleUsernames.indexOf(data.poster) > -1) {
        $("postContent").innerHTML = data.content.replace(/\r\n/g, "<br/>");
    } else {
        $("postContent").innerHTML = data.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r\n/g, "<br/>");
	}
	if(localStorage.getItem('emojiIndex') !== null && localStorage.getItem('emojiIndex') !== "") {
		emojisReplace(emojiIndex);
	} else {
		updateEmojiIndex('post');
	}
	if (data['edited'] == true) {
		$("edited").style.display = "";
	}
	if (data.poster == localStorage.username) {
		$("editlinkcontainer").style.display = "";
		$("editlink").href = "editpost.html?id=" + id;
	}
	if (data["attachment"] != "none" && data["attachment"] != undefined && data["attachment"] != null) {
		$("attachment").style.display = "";
	}
	$("upvotes").innerHTML = postData['upvotes'];
	$("downvotes").innerHTML = postData['downvotes'];
	if (data.client != undefined) {
		$("client").innerHTML = "<i>Posted using "+data.client+"</i>";
		$("client").style.display = "";
	}
}

function loadPost(id){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        postData = JSON.parse(this.responseText);
		buildPost(postData, id);
		greenify();
    };
    xhttp.open("GET", "https://api.stibarc.com/v2/getpost.sjs?id=" + id, true);
    xhttp.send();
}