import production from './production';
import development from './development';

if (process.env.NODE_ENV === 'production') {
  module.exports = production;
} else {
  module.exports = development;
}
