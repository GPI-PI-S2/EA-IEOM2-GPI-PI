import { list, Sentiments } from './v1';
export = (sentence: string): list => {
	return new Sentiments(sentence).calc();
};
