import mongoose from 'mongoose';
import {isEmpty, getToObjectOptions} from './utils';

const file = new mongoose.Schema({
  fileName: String,
  filePath: String,
  originalName: String,
  user: String,
});

file.statics.getAll = function getAll() {
  return new Promise((resolve, reject) => {
    this.find({}, null, {sort: {timestamp: 1}}, (err, uploadedFiles) => {
      if (err) {
        reject(err);
      } else {
        resolve(uploadedFiles);
      }
    });
  });
};

file.statics.isEmpty = isEmpty;
file.set('toObject', getToObjectOptions());


file.statics.add = function add(data, cb) {
  return new this(data).save(cb);
};

export default function getFileModel() {
  return mongoose.model('File', file);
}
