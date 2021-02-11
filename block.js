'use strict';

const fs = require('fs')
const path = require('path')
const colors = require('colors')
const readline = require('readline')

const rl = readline.createInterface(process.stdin, process.stdout);

// folder with all blocks
const BLOCKS_DIR = 'src/components';
const scssPath = 'src/assets/scss/components';

//////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const fileSources = {
	vue: `<template>
	<div class="{blockName} section">
		<div class="container">
			<div class="section-title">
				<h2>{blockName}</h2>
			</div>
		</div>
	</div>
</template>

<script>
// import TopNav from '@/components/TopNav.vue' 
export default {
	name: '{blockName}',
	components: { 

	},
	data() {
		return{ 
		}
	}
}
</script>

<style lang="scss">
  
</style>`,
	scss: `
	// start .{blockName}
	.{blockName} \{
		// --sPT: ;
		// --sPB: ;
		// --sTPB: ;
		 
	@include media-breakpoint-up(xl) {}
	@include media-breakpoint-up(lg) {}
	@include media-breakpoint-up(md) {}
	@include media-breakpoint-up(sm) {}
	//
	@include media-breakpoint-between(md, xl) { }
	//
	@include media-breakpoint-only(xl) {}
	//
	@include media-breakpoint-down(xl) {}
} // end.{blockName}`
	,
};

function validateBlockName(blockName) {
	return new Promise((resolve, reject) => {
		const isValid = /^(\d|\w|-)+$/.test(blockName);

		if (isValid) {
			resolve(isValid);
		} else {
			const errMsg = (
				`ERR>>> An incorrect block name '${blockName}'\n` +
				`ERR>>> A block name must include letters, numbers & the minus symbol.`
			);
			reject(errMsg);
		}
	});
}

function directoryExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath, notExist => {
			if (notExist) {
				resolve();
			} else {
				reject(`ERR>>> The block '${blockName}' already exists.`.red);
			}
		});
	});
}

function createDir(dirPath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirPath, err => {
			if (err) {
				reject(`ERR>>> Failed to create a folder '${dirPath}'`.red);
			} else {
				resolve();
			}
		});
	});
}

function createFiles(blockName) {
	const promises = [];
	Object.keys(fileSources).forEach(ext => {
		const fileSource = fileSources[ext].replace(/\{blockName}/g, blockName);
		const filename = (ext == "scss" ? `_${blockName}.${ext}` : `${blockName}.${ext}`);
		const filePath = (ext == "scss" ? path.join(scssPath, filename) : path.join(BLOCKS_DIR, filename));
		promises.push(
			new Promise((resolve, reject) => {
				fs.writeFile(filePath, fileSource, 'utf8', err => {
					if (err) {
						reject(`ERR>>> Failed to create a file '${filePath}'`.red);
					} else {
						resolve();
					}
				});
			})
		);
	});

	return Promise.all(promises);
}

function getFiles(blockPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(blockPath, (err, files) => {
			if (err) {
				reject(`ERR>>> Failed to get a file list from a folder '${blockPath}'`);
			} else {
				resolve(files);
			}
		});
	});
}

function printErrorMessage(errText) {
	console.log(errText);
	rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(blockName) {
	const blockPath = path.join(BLOCKS_DIR, blockName);

	return validateBlockName(blockName)
		.then(() => directoryExist(blockPath, blockName))
		.then(() => createDir(blockPath))
		.then(() => createFiles(blockName))
		.then(() => getFiles(blockPath))
		.then(files => {
			const line = '-'.repeat(48 + blockName.length);
			console.log(line);
			console.log(`The block has just been created in 'src/components/${blockName}'`);
			console.log(line);

			// Displays a list of files created
			files.forEach(file => console.log(file.yellow));

			rl.close();
		});
}


// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
const blockNameFromCli = process.argv
	.slice(2)
	// join all arguments to one string (to simplify the capture user input errors)
	.join(' ');


// If the user pass the name of the block in the command-line options
// that create a block. Otherwise - activates interactive mode
if (blockNameFromCli !== '') {
	initMakeBlock(blockNameFromCli).catch(printErrorMessage);
}
else {
	rl.setPrompt('Block name: '.magenta);
	rl.prompt();
	rl.on('line', (line) => {
		const blockName = line.trim();
		initMakeBlock(blockName).catch(printErrorMessage);
	});
}