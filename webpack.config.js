import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url);

const srcPath = path.resolve(__dirname, '../src');
const entryPath = './docs/assets/js/src';
const distPath = path.resolve(__dirname, '../docs/assets/js/dist');

const config = {
	mode: process.env.MODE,
	entry: {
		'docs-script': `${entryPath}/docs-script.ts`,
	},
	output: {
		path: distPath,
		filename: '[name].bundle.js',
	},
	resolve: {
		fullySpecified: true,
		extensionAlias: {
			'.js': ['.ts', '.js'],
		},
		alias: {
			'@cipscis/analyser$': `${srcPath}/index.ts`,
			'@cipscis/analyser/types$': `${srcPath}/types/index.ts`,
			'@cipscis/analyser/statistics$': `${srcPath}/statistics.ts`,
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
			},
		],
	},
};

switch (process.env.MODE) {
	case 'development':
		config.optimization = {
			minimize: false,
		};
		config.devtool = 'eval-source-map';
		break;
	case 'production':
	default:
		config.devtool = 'source-map';
		break;
}

export default config;
