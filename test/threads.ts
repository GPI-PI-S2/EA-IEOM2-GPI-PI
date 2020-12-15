import Piscina from 'piscina';
import sentimentList from './sentences.json';
async function main() {
	const length = sentimentList.sentences.length;
	console.log('\nPerformance test (threads)\n');
	console.log('Length:', length);
	console.log('Calculating...');
	console.time('Duration');
	const piscina = new Piscina({ filename: '../EA-IEOM2-GPI-PI/dist/index.js' });
	await Promise.all(
		sentimentList.sentences.map(async (sentence) => await piscina.runTask(sentence)),
	);
	console.log('\n');
	console.timeEnd('Duration');
	console.log('\n');
	console.log('Ended');
}
main();
