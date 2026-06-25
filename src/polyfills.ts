import '@angular/localize/init';
import 'core-js/es/reflect';
import 'zone.js';
import 'core-js/es/array';
import { Buffer } from 'buffer';
import process from 'process';

(window as any).global = window;
const globalScope = window as any;
globalScope.Buffer = globalScope.Buffer || Buffer;
globalScope.process = globalScope.process || process;
