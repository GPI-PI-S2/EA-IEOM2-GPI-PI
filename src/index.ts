import { list, Sentiments } from './barrer';
export = (sentence: string): list => {
	return new Sentiments(sentence).calc();
};
