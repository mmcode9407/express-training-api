const express = require('express');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from Nerdbord!');
});

app.get('/trains', (req, res) => {
	fs.readFile('./data/trains.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading trains.json');
			return;
		}

		const jsonData = JSON.parse(data);
		res.json(jsonData);
	});
});

app.post('/trains', (req, res) => {
	const requiredFields = [
		'trainExpressName',
		'countryOfOrigin',
		'yearOfConstruction',
		'maxKilometerPerHour',
		'destinationFrom',
		'destinationTo',
	];
	const newData = req.body;

	for (const field of requiredFields) {
		if (!newData[field]) {
			return res.status(400).send(`Required field is missing: ${field}`);
		}
	}

	fs.readFile('./data/trains.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading trains.json');
			return;
		}

		const jsonData = JSON.parse(data);

		if (jsonData.length > 0) {
			newData.id = (Number(jsonData[jsonData.length - 1].id) + 1).toString();
		} else {
			newData.id = 1;
		}

		jsonData.push(newData);

		fs.writeFile(
			'./data/trains.json',
			JSON.stringify(jsonData, null, 2),
			(err) => {
				if (err) {
					res.status(500).send('Error saving data to trains.json');
					return;
				}

				res.status(201).send('Successfully adding the data.');
			}
		);
	});
});

app.put('/trains/:id', (req, res) => {
	const fieldsToUpdate = [
		'trainExpressName',
		'countryOfOrigin',
		'yearOfConstruction',
		'maxKilometerPerHour',
		'destinationFrom',
		'destinationTo',
	];
	const dataId = parseInt(req.params.id);
	const newData = req.body;

	fs.readFile('./data/trains.json', 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Error reading trains.json');
			return;
		}

		const jsonData = JSON.parse(data);

		const existingDataItem = jsonData.find(
			(item) => parseInt(item.id) === dataId
		);

		if (!existingDataItem) {
			res.status(404).send('Item with given ID not found.');
		}

		for (const field of fieldsToUpdate) {
			existingDataItem[field] = newData[field] || existingDataItem[field];
		}

		fs.writeFile(
			'./data/trains.json',
			JSON.stringify(jsonData, null, 2),
			(err) => {
				if (err) {
					res.status(500).send('Error saving data to trains.json');
					return;
				}

				res.json(existingDataItem);
			}
		);
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
