import path from 'path';
import { readFileSync } from 'fs';

const filename = path.resolve(__dirname, '../../assets/index.html');
const html = readFileSync(filename, 'utf8');

const bootstrap = (req, res) => res.send(html);

export default bootstrap;
