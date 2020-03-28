var cptzero = document.getElementById("cptzero");
var cptzeroButton = document.getElementById("cptzero-button");
var cptzeroModal = document.getElementById("cptzero-modal");
var infinitus = document.getElementById("infinitus");
var infinitusButton = document.getElementById("infinitus-button");
var infinitusModal = document.getElementById("infinitus-modal");
var closers = document.getElementsByClassName("close");
var timer;

function vote(candidate) {
	fetch("/api/vote", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: "candidate=" + encodeURIComponent(candidate)
	})
		.then(res => res.json())
		.then(result => {
			getData();
			if (result.status == "error") {
				alert(result.error);
			}
		})
		.catch(error => {
			console.log("Error: ", error);
		});
}

function getData() {
	fetch("/api/getData", {
		method: "GET"
	})
		.then(res => {
			return res.json();
		})
		.then(data => {
			document.getElementById("cptzero-votes").innerHTML =
				"Votes: " + data.body[0].votes;
			document.getElementById("infinitus-votes").innerHTML =
				"Votes: " + data.body[1].votes;
		});
}

window.onload = function () {
	timer = setInterval(getData, 1000);
};

window.onbeforeunload = function () {
	clearInterval(timer);
	return null;
};

cptzeroButton.onclick = function() {
	vote("cptzero");
};

infinitusButton.onclick = function() {
	vote("infinitus");
};

cptzero.onclick = function () {
	cptzeroModal.style.display = "block";
};

infinitus.onclick = function () {
	infinitusModal.style.display = "block";
};

closers[0].onclick = function () {
	cptzeroModal.style.display = "none";
};

closers[1].onclick = function () {
	infinitusModal.style.display = "none";
};
