function vote(cm) {
	return async function (req, res) {
		if (req.body) {
			console.log(JSON.stringify(req));
			var ip = req.headers["x-forwarded-for"].split(",").slice(-1)[0].trim();
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
