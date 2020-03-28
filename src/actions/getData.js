function getData(cm) {
	return async function (req, res) {
		res.json({
			status: "success",
			body: await cm.getData()
		});
	};
}

module.exports = getData;
