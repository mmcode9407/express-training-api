const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
	res.send('Hello from Nerdbord!');
});

app.get('/trains', (req, res) => {
	fs.readFile('./data/trains.json', 'utf8', (err, data) => {
		const jsonData = JSON.parse(data);
		res.json(jsonData);
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
