"use strict";/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/facebookincubator/create-react-app/blob/master/LICENSE
 */var url=require("url");var chalk=require("chalk");var address=require("address");module.exports=function prepareUrls(protocol,host,port){var formatUrl=function formatUrl(hostname){return url.format({protocol:protocol,hostname:hostname,port:port,pathname:"/"})};var prettyPrintUrl=function prettyPrintUrl(hostname){return url.format({protocol:protocol,hostname:hostname,port:chalk.bold(port),pathname:"/"})};var isUnspecifiedHost=host==="0.0.0.0"||host==="::";var prettyHost,lanUrlForConfig,lanUrlForTerminal;if(isUnspecifiedHost){prettyHost="localhost";try{// This can only return an IPv4 address
lanUrlForConfig=address.ip();if(lanUrlForConfig){// Check if the address is a private ip
// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
if(/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)){// Address is private, format it for later use
lanUrlForTerminal=prettyPrintUrl(lanUrlForConfig)}else{// Address is not private, so we will discard it
lanUrlForConfig=undefined}}}catch(_e){// ignored
}}else{prettyHost=host}var localUrlForTerminal=prettyPrintUrl(prettyHost);var localUrlForBrowser=formatUrl(prettyHost);return{lanUrlForConfig:lanUrlForConfig,lanUrlForTerminal:lanUrlForTerminal,localUrlForTerminal:localUrlForTerminal,localUrlForBrowser:localUrlForBrowser}};