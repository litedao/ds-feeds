#! /usr/bin/env node
'use strict';

const pkg = require('./package.json');
const program = require('commander');
const CLI = require('clui'),
  Spinner = CLI.Spinner;
const inquirer = require('inquirer');
const Preferences = require('preferences');
const prefs = new Preferences('feeds');
const Web3 = require('web3');

let web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider("http://localhost:8545")
));

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences');

program
  .command('claim <type>')
  .description('claims a feed or an aggregator')
  .action((type) => {
    console.log(type);
    var f = require('./feedbase.js');
  });

program
  .command('inspect <type>')
  .description('inspect a feed or an aggregator')
  .action((type) => {
    console.log('Type: ', type);
    if (type !== 'feed' || type !== 'agg') {
      console.log('Error: <type> must be "feed" or "agg"');
      process.exit(1);
    } else {
      console.log('exec "%s"', type);
    }
  });

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

program.parse(process.argv); // end with parse to parse through the input

//process.exit(0);

if (program.clear) {
  prefs.feeds = {};
  console.log('Cleared preferences');
  process.exit(0);
}

if(!program.args.length) program.help();

function init() {
  const Feedbase = require("./lib/feedbase.js");
  const Aggregator = require("./lib/aggregator.js");

  Aggregator.environments.ropsten.aggregator.value = '0x509a7c442b0f8220886cfb9af1a11414680a6749';
  Feedbase.environments.ropsten.feedbase.value = '0x929be46495338d84ec78e6894eeaec136c21ab7b';

  feedbase = new Feedbase.class(web3, env).objects.feedbase
  aggregator = new Aggregator.class(web3, env).objects.aggregator
}

// var status = new Spinner('Getting network version...');

function askForFeedbase(callback) {
  var questions = [
    {
      name: 'feedbase',
      message: 'Enter a feedbase address:',
      type: 'input',
      default: '0x929be46495338d84ec78e6894eeaec136c21ab7b',
      validate: (str) => {
        return web3.isAddress(str);
      }
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function askForAggregator(callback) {
  var questions = [
    {
      name: 'aggregator',
      message: 'Enter an aggregator address:',
      type: 'input',
      default: '0x509a7c442b0f8220886cfb9af1a11414680a6749',
      validate: (str) => {
        return web3.isAddress(str);
      }
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function getDefaultAccount(callback) {
  var questions = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts
    },
  ];
  inquirer.prompt(questions).then(callback);
}

function getBalance(account) {
  web3.eth.getBalance(account, (e, r) => {
    prefs.feeds.balance = r.valueOf();
  });
}