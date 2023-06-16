import * as fs from 'fs';

export const fileTypeFilter = (req: any, file: any, callback: any) => {
  if (!CheckFileType(file.originalname)) {
    req.fileValidationError = 'Invalid file type';
    return callback(null, false);
  }
  if (file.originalname.length > 200) {
    req.fileNameError = 'Too long';
    return callback(null, false);
  }
  callback(null, true);
};

export const CheckFileType = (filename) => {
  if (!filename.match(/\.(jpg|jpeg|png|gif|doc|docx|xlsx|xls|ppt|pptx|pdf|vsd|vsdx)$/)) {
    return false;
  } else {
    return true;
  }
};

export const deleteFiles = (files) => {
  for (const file of files) {
    fs.unlink(file.path, (err) => {
      if (err) throw err;
      // if no error, file has been deleted successfully
    });
  }
  console.log('Files deleted due to malicious content');
};