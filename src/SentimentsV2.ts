import natural from 'natural';
import * as data from './v2';
export class SentimentsV2 {
	static readonly version = data.version;
	constructor(private input: string) {}
	calc(): Sentiments.list {
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
				? this.concatSents(sentiments, data.upperCase, (a, b) => a * b)
				: sentiments;

		// AFINN analysis
		const polarity = this.afinn(tokens);
		return polarity >= 0
			? this.concatSents(
					sentimentsUpperCaseFactor,
					data.positivePolarity,
					(a, b) => a * (1 + polarity * b),
			  )
			: this.concatSents(
					sentimentsUpperCaseFactor,
					data.negativePolarity,
					(a, b) => a * (1 - polarity * b),
			  );
	}

	private gramType = 2;

	private getTokensSentiments(tokens: string[]): Sentiments.list {
		const stemmedTokens = tokens.map((token) => natural.PorterStemmerEs.stem(token));
		// generate sets over the tokens so that each token is associated with the resulting nGram (used for multi word matches)
		return this.tokensSentiment(stemmedTokens).reduce(
			(sents1, sents2) => this.concatSents(sents1, sents2, (a, b) => a + b),
			data.list,
		);
	}

	private tokensSentiment(tokens: string[], blockedPrefix = 0): Sentiments.list[] {
		if (tokens.length === 0) return [];
		if (tokens.length === 1 && blockedPrefix !== 0) return [];
		// compound word has preference since it has more context than a single word
		const compoundWord = tokens.slice(0, this.gramType).join(' ');
		const sentimentCompound = data.wordValues[compoundWord];
		if (sentimentCompound)
			return [sentimentCompound, ...this.tokensSentiment(tokens.slice(1), this.gramType - 1)];
		if (blockedPrefix > 0) return this.tokensSentiment(tokens.slice(1), blockedPrefix - 1);
		const baseWord = tokens[0];
		const sentimentBase = data.wordValues[baseWord];
		if (sentimentBase) return [sentimentBase, ...this.tokensSentiment(tokens.slice(1))];
		return this.tokensSentiment(tokens.slice(1));
	}

	private concatSents(
		sents1: Sentiments.list,
		sents2: Sentiments.list,
		combineFunction: (a: number, b: number) => number,
	): Sentiments.list {
		// concat sentiments using per factor provided function
		return Object.keys(data.list).reduce(
			(currentValues, key: Sentiments.sentiment) => ({
				...currentValues,
				[key]: combineFunction(sents1[key], sents2[key]),
			}),
			data.list,
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
export namespace Sentiments {
	export type sentiment = data.sentiment;
	export type list = data.list;
}
