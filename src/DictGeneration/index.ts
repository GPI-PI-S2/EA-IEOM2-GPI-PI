import fs from 'fs/promises';
import { list } from '../v1';
export default async function createDictionary(path: string): Promise<void> {
	const sep = ';';
	const file = await fs.readFile(path, 'utf8');
	const lines = file.split(/\r?\n/);

	const headers = lines[0].split(sep).slice(1);

	const values = lines.slice(1).map((line) => line.split(sep));
	const dictionary: Record<string, list> = {};
	values.forEach((arr) => {
		const word = arr[0];
		if (word === '') return;
		const values = arr.slice(1);
		const sentiments = headers.reduce(
			(obj, sentiment, index) => ({ ...obj, [sentiment]: parseFloat(values[index]) }),
			{},
		);
		dictionary[word] = sentiments as list;
	});
	await fs.writeFile('dictionary.json', JSON.stringify(dictionary, null, 2), 'utf8');
}
