import config from '../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [...config, ...nx.configs['flat/react']];
