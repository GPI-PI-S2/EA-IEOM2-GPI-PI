import natural from 'natural';
import { negativePolarity } from './negativePolarity';
import { positivePolarity } from './positivePolarity';
import { upperCase } from './upperCase';
import { wordValues } from './wordValues';
function roundNumber(num: number, scale: number) {
	if (!('' + num).includes('e')) {
		return +(Math.round(num + ('e+' as never) + scale) + 'e-' + scale);
	} else {
		const arr = ('' + num).split('e');
		let sig = '';
		if (+arr[1] + scale > 0) {
			sig = '+';
		}
		return +(
			Math.round(+arr[0] + ('e' as never) + (sig as never) + (+arr[1] + scale)) +
			'e-' +
			scale
		);
	}
}
export const version = '1.0.0';
export const list = {
	asertividad: 0,
	'autoconciencia emocional': 0,
	autoestima: 0,
	'desarrollar y estimular a los demás': 0,
	empatía: 0,
	'autocontrol emocional': 0,
	influencia: 0,
	liderazgo: 0,
	optimismo: 0,
	'relación social': 0,
	'colaboración y cooperación': 0,
	'comprensión organizativa': 0,
	'conciencia crítica': 0,
	'desarrollo de las relaciones': 0,
	'tolerancia a la frustración': 0,
	'comunicacion asertiva': 0,
	'manejo de conflictos': 0,
	'motivación de logro': 0,
	'percepción y comprensión emocional': 0,
	violencia: 0,
};
export type sentiment =
	| 'asertividad'
	| 'autoconciencia emocional'
	| 'autoestima'
	| 'desarrollar y estimular a los demás'
	| 'empatía'
	| 'autocontrol emocional'
	| 'influencia'
	| 'liderazgo'
	| 'optimismo'
	| 'relación social'
	| 'colaboración y cooperación'
	| 'comprensión organizativa'
	| 'conciencia crítica'
	| 'desarrollo de las relaciones'
	| 'tolerancia a la frustración'
	| 'comunicacion asertiva'
	| 'manejo de conflictos'
	| 'motivación de logro'
	| 'percepción y comprensión emocional'
	| 'violencia';
export type list = { [key in sentiment]: number };
export class Sentiments {
	static readonly version = version;
	constructor(private input: string) {}
	calc(): list {
		const tokenizer = new natural.AggressiveTokenizerEs();
		const tokens = tokenizer.tokenize(this.input.toLowerCase());
		// sentiments analysis
		const sentiments = this.getTokensSentiments(tokens);

		const inputChars = this.input.split('');
		const upperCaseTotal =
			inputChars.filter((letter) => letter === letter.toUpperCase()).length /
			inputChars.length;

		const sentimentsUpperCaseFactor =
			upperCaseTotal >= 0.8
				? this.concatSents(sentiments, upperCase, (a, b) => a * b)
				: sentiments;

		// AFINN analysis
		const polarity = this.afinn(tokens);
		return polarity >= 0
			? this.concatSents(sentimentsUpperCaseFactor, positivePolarity, (a, b) =>
					roundNumber(a * (1 + polarity * b), 2),
			  )
			: this.concatSents(sentimentsUpperCaseFactor, negativePolarity, (a, b) =>
					roundNumber(a * (1 - polarity * b), 2),
			  );
	}

	private gramType = 2;
	private distanceFilter = 0.75;

	private getTokensSentiments(tokens: string[]): list {
		const stemmedTokens = tokens.map((token) => natural.PorterStemmerEs.stem(token));
		// generate sets over the tokens so that each token is associated with the resulting nGram (used for multi word matches)
		return this.tokensSentiment(stemmedTokens).reduce(
			(sents1, sents2) => this.concatSents(sents1, sents2, (a, b) => a + b),
			list,
		);
	}

	private tokensSentiment(tokens: string[], blockedPrefix = 0): list[] {
		if (tokens.length === 0) return [];
		if (tokens.length === 1 && blockedPrefix !== 0) return [];
		// compound word has preference since it has more context than a single word
		const compoundWord = tokens.slice(0, this.gramType).join(' ');
		const sentimentCompound = this.getSentiments(compoundWord);
		if (sentimentCompound)
			return [sentimentCompound, ...this.tokensSentiment(tokens.slice(1), this.gramType - 1)];
		if (blockedPrefix > 0) return this.tokensSentiment(tokens.slice(1), blockedPrefix - 1);
		const baseWord = tokens[0];
		const sentimentBase = this.getSentiments(baseWord);
		if (sentimentBase) return [sentimentBase, ...this.tokensSentiment(tokens.slice(1))];
		return this.tokensSentiment(tokens.slice(1));
	}

	private getSentiments(inputWord: string): list {
		const sentimentsList: [number, list][] = Object.entries(
			wordValues,
		).map(([word, sentiments]) => [this.JaroWinker(inputWord, word), sentiments]);
		const bestMatch = this.bestMatch(sentimentsList);
		return bestMatch[0] > 0.75 ? bestMatch[1] : undefined;
	}
	private JaroWinker(str1: string, str2: string): number {
		const JWDistance = natural.JaroWinklerDistance(str1, str2);
		// using the string lenght as a factor the algorithm prefers long matches over short ones (used when multiple matches give similar values)
		// consider only close matches to avoid false positives
		return JWDistance >= this.distanceFilter
			? JWDistance * Math.sqrt(Math.min(str1.length, str2.length))
			: 0;
	}

	private bestMatch(values: [number, list][]): [number, list] {
		// if all the values are zero returns the default sentiments
		return values.reduce(
			(maxValue, currentValue) => (maxValue[0] < currentValue[0] ? currentValue : maxValue),
			[0, list],
		);
	}

	private concatSents(
		sents1: list,
		sents2: list,
		combineFunction: (a: number, b: number) => number,
	): list {
		// concat sentiments using per factor provided function
		return Object.keys(list).reduce(
			(currentValues, key: sentiment) => ({
				...currentValues,
				[key]: combineFunction(sents1[key], sents2[key]),
			}),
			list,
		);
	}
	private afinn(tokens: string[]) {
		const polarityAnalizer = new natural.SentimentAnalyzer(
			'Spanish',
			natural.PorterStemmerEs,
			'afinn',
		);
		return polarityAnalizer.getSentiment(tokens);
	}
}
