function vote(cm) {
	return async function (req, res) {
		if (req.body) {
			var i = req.rawHeaders.findIndex("X-Forwarded-For");
			var ip = req.rawHeaders[i + 1].split(",").slice(-1)[0].trim();
			const status = await cm.vote(req.body.candidate, ip);
			if (status == cm.constructor.SUCCESS) {
				res.json({
					status: "success"
				});
			} else {
				res.status(400).json({
					status: "error",
					error: status
				});
			}
		} else {
			res.status(400).json({
				status: "error",
				error: "no candidate selected"
			});
		}
	};
}

module.exports = vote;
