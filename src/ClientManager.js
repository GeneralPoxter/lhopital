const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
	connectionString: connectionString,
	ssl: true
});

const limit = 900000;

const SUCCESS = "success";

class ClientManager {
	constructor() {
		pool.connect();
	}

	async vote(candidate, ip) {
		if (candidate != "cptzero" && candidate != "infinitus") {
			return "Candidate does not exist";
		}

		const date = new Date();
		var time = (
			await pool.query("SELECT time FROM times WHERE ip=$1", [ip])
		).rows;
		var diff;
		if (time.length == 0) {
			diff = limit;
			await pool.query("INSERT INTO times VALUES ($1, $2)", [
				ip,
				date.getTime()
			]);
		} else {
			diff = date.getTime() - time[0].time;
		}

		if (diff < limit) {
			return `Must wait ${Math.ceil(
				(limit - diff) / 60000
			)} minutes before you can vote again`;
		}

		const votes = (
			await pool.query("SELECT votes FROM votes WHERE name=$1", [
				candidate
			])
		).rows[0].votes;
		await pool.query("UPDATE votes SET votes=$1 WHERE name=$2", [
			votes + 1,
			candidate
		]);
		await pool.query("UPDATE times SET time=$1 WHERE ip=$2", [
			date.getTime(),
			ip
		]);

		return SUCCESS;
	}

	async getData() {
		const votes = (
			await pool.query("SELECT votes FROM votes ORDER BY name")
		).rows;
		return votes;
	}
}

ClientManager.SUCCESS = SUCCESS;

module.exports = ClientManager;
