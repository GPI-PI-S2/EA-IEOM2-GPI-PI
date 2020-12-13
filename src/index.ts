import { Sentiments } from './Sentiments';
import { SentimentsV2 } from './SentimentsV2';
export = (sentence: string, version: number): Sentiments.list => {
	switch (version) {
		case 1:
			return new Sentiments(sentence).calc();
		case 2:
			return new SentimentsV2(sentence).calc();
	}
};
