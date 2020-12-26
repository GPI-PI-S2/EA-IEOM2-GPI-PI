import anal from '../src';
import sentimentList from './twitter.json';
function main() {
	const length = sentimentList.length;
	console.log('\nPerformance test (single)\n');
	console.log('Length:', length);
	console.log('Calculating...');
	console.time('Duration');
	sentimentList.forEach((sentence) => anal(sentence.content));
	console.log('\n');
	console.timeEnd('Duration');
	console.log('\n');
	console.log('Ended');
}
main();
