import process from 'process';
import MoLang from './molang';
import {FloatVariable} from "./variables";

const source = process.argv[2];

const m = new MoLang({
	particle_random_1: new FloatVariable(Math.random()),
	particle_random_2: new FloatVariable(Math.random()),
	particle_random_3: new FloatVariable(Math.random()),
	particle_random_4: new FloatVariable(Math.random())
});

const result = m.evaluate(source);
console.log('RESULT', result);