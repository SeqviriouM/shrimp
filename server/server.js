import express from 'express';
import path from 'path';
import http from 'http';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import startSocketServer from './socket.js';
import getConfig from './config.js';
import {createDefaultChannel} from './fill-db.js';
import {signInUser, signUpUser, checkUserEmail, checkEmailExist, setSessionId, checkOldPassword, changePassword, saveFile, removeFile, getOriginalFilenameByPath} from './db/db_core.js';
import getInitState from './initial-state';
import {generateSessionId} from './lib/core.js';
const debug = require('debug')('shrimp:server');

const app = express();
const server = new http.Server(app);
const port = process.env.PORT || 3000;
const appConfig = getConfig();
const isDev = process.env.NODE_ENV === 'development';
const env = process.env.NODE_ENV;
const isDebug = process.env.DEBUG;
const isMongoConnect = process.env.MONGO_CONNECT;

if (isDev && isDebug && process.env.DEBUG.indexOf('shrimp:front') === 0) {
  const webpack = require('webpack');
  const makeConfig = require('../make-webpack-config.js');

  const config = makeConfig({
    sourcemaps: false,
    devtool: 'eval',
  });
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
} else {
  app.use('/static', express.static(path.join(__dirname, '../static')));
}

app.use(bodyParser.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  },
});

app.use(multer({ storage: storage, limits: { fileSize: 10000000 } }).single('file'));

startSocketServer(server);

if (isMongoConnect === 'yes') {
  mongoose.connect(appConfig.db[env]);
  createDefaultChannel();
}


app.post('/signin', (req, res) => {
  signInUser(req.body.email, req.body.password, (userData) => {
    if (userData.status.type === 'success') {
      const sessionId = generateSessionId();
      setSessionId(userData.userId, sessionId, (userSessionId) => {
        getInitState(userSessionId).then(initState => {
          res.json(initState);
        });
      });
    } else {
      res.json({user: userData});
    }
  });
});

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  checkUserEmail(email, (userData) => {
    if (userData.status.type === 'success') {
      const userSessionId = generateSessionId();
      signUpUser(email, password, name, userSessionId, () => {
        getInitState(userSessionId).then(initState => {
          res.json(initState);
        });
      });
    } else {
      res.json({user: userData});
    }
  });
});

app.post('/checkemailexist', (req, res) => {
  const email = req.body.email;
  checkEmailExist(email, (exist) => {
    res.json(exist);
  });
});

app.post('/changepass', (req, res) => {
  const oldPassword = req.body.oldPassword;
  const password = req.body.password;
  checkOldPassword(req.cookies.sessionId, oldPassword, (passwordCheck) => {
    if (passwordCheck.status.type === 'success') {
      changePassword(passwordCheck.user, password, (status) => {
        res.json({ status });
      });
    } else {
      res.json({
        status: passwordCheck.status,
      });
    }
  });
});


app.post('/upload', (req, res) => {
  const savedFile = {
    fileName: req.file.filename,
    filePath: req.file.path,
    originalName: req.file.originalname,
    user: req.cookies.sessionId,
  };
  saveFile(savedFile, (file) => {
    res.json(file.toObject());
  });
});


app.delete('/remove-file', (req, res) => {
  const removedFile = {
    user: req.cookies.sessionId,
    filePath: req.body.filePath,
  };
  removeFile(removedFile, () => {
    fs.unlink(req.body.filePath, () => {
      res.json({
        fileName: req.body.fileName,
      });
    });
  });
});


app.get('/uploads/:file', (req, res) => {
  const file = req.params.file;
  const filePath = 'uploads/' + file;

  getOriginalFilenameByPath(filePath, (originalName) => {
    res.download(filePath, originalName, (err) => {
      if (err) debug(err);
    });
  });
});


app.get('/fileIcons/:file', (req, res) => {
  const file = req.params.file;
  const filePath = 'fileIcons/' + file;

  res.download(filePath);
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../app/root.html'));
});

server.listen(port);
