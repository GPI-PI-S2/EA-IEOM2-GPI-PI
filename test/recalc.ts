import { writeFileSync } from 'fs';
import Piscina from 'piscina';
import { Sentiments } from '../src/barrer';
import emol from './emol.json';
import reddit from './reddit.json';
import telegram from './telegram.json';
import twitter from './twitter.json';
import youtube from './youtube.json';
async function main() {
	const length = twitter.length;
	console.log(`\nPerformance recalc test IEOM2 (${Sentiments.version})\n`);
	const piscina = new Piscina({ filename: '../EA-IEOM2-GPI-PI/dist/index.js' });
	console.time('Duration');
	let twitterResponse = await Promise.all(
		twitter.map(async (sentence) => {
			const calc = await piscina.runTask(sentence.content);
			return { ...sentence, ...calc };
		}),
	);
	console.log(`Twitter ok ${twitterResponse.length}`);
	let redditResponse = await Promise.all(
		reddit.map(async (sentence) => {
			const calc = await piscina.runTask(sentence.content);
			return { ...sentence, ...calc };
		}),
	);
	console.log(`Redddit ok ${redditResponse.length}`);
	let youtubeResponse = await Promise.all(
		youtube.map(async (sentence) => {
			const calc = await piscina.runTask(sentence.content);
			return { ...sentence, ...calc };
		}),
	);
	console.log(`Youtube ok ${youtubeResponse.length}`);
	let emolResponse = await Promise.all(
		emol.map(async (sentence) => {
			const calc = await piscina.runTask(sentence.content);
			return { ...sentence, ...calc };
		}),
	);
	console.log(`EMOL ok ${emolResponse.length}`);
	let telegramResponse = await Promise.all(
		telegram.map(async (sentence) => {
			const calc = await piscina.runTask(sentence.content);
			return { ...sentence, ...calc };
		}),
	);
	console.log(`Telegram ok ${telegramResponse.length}`);

	console.log('\n');
	console.timeEnd('Duration');
	const pVersion = Sentiments.version.split('.').join('_');
	writeFileSync(`anal/twitter-${pVersion}.json`, JSON.stringify(twitterResponse));
	writeFileSync(`anal/emol-${pVersion}.json`, JSON.stringify(emolResponse));
	writeFileSync(`anal/youtube-${pVersion}.json`, JSON.stringify(youtubeResponse));
	writeFileSync(`anal/reddit-${pVersion}.json`, JSON.stringify(redditResponse));
	writeFileSync(`anal/telegram-${pVersion}.json`, JSON.stringify(telegramResponse));
	console.log('\n');
	console.log('Ended');
}
main();
