/*
* A light-weight module that brings window.fetch to Node.js
* */
const fetch = require('node-fetch')
const Ids = require('../models/ids')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const qiniu = require('qiniu')
const gm = require('gm')
