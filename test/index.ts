import anal from '../src';
import sentimentList from './twitter.json';
async function main() {
	const length = sentimentList.length;
	const sampleSize = 3;
	console.log('\nAlgorithm test\n');
	console.log('Length:', length);
	console.log('Sample size:', sampleSize);
	console.log('Calculating...');
	new Array(sampleSize).fill(null).forEach(() => {
		const index = Math.floor(Math.random() * length);
		const sentence = sentimentList[index];
		console.log(`\nsentence:\n${sentence.content}`);
		const response = anal(sentence.content);
		console.table(response);
	});
	console.log('Ended');
}
main();
