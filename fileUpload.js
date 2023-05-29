import fs from 'fs';
import { CustomDate } from './dateManager.js';

/**
 * File size in bytes
 * @param  {Number} actualSize size in mb
 * @return {Number}
 */

const convertMbToBytes = (actualSize) => actualSize * 1024 * 1024;

/**
 * Create StorageEngine For File Upload
 * @param  {String} moduleName Name of the parent folder
 * @param  {"diskStorage" | "memoryStorage"}   storageType   type of storage
 * @return {multer.StorageEngine}
 */

const createStorage = (moduleName = null, storageType = 'diskStorage') => {
	return multer[storageType]({
		destination: function (req, _, cb) {
			//Create directory with the module name and the current time stamp
			let directory;
			if (moduleName)
				directory = `${
					envs.uploadPath
				}/${moduleName}/${new CustomDate().getCurrentDateWithoutHypen()}`;
			else
				directory = `${
					envs.uploadPath
				}/${new CustomDate().getCurrentDateWithoutHypen()}`;
			// Create directory if not exists
			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, { recursive: true });
			}
			cb(null, directory);
		},
		filename: async function (req, file, cb) {
			const pathToCheck = `${Date.now()}-${file.originalname}`;
			cb(null, pathToCheck);
		},
	});
};

/**
 * Optional function to control which files are uploaded. This is called
 * for every file that is processed.
 * @param  {Number} allowedFileSize Size of the file
 * @param  {Array<String>}   allowedFileTypes   allowed file types
 * @return {Function}
 */
const generateFilter =
	(allowedFileSize, allowedFileTypes) => (req, file, callback) => {
		const acceptableExtensions = allowedFileTypes;
		// File type of theuploaded file
		const mime = file.mimetype;
		if (!acceptableExtensions.includes(mime)) {
			return callback({ code: 'LIMIT_FILE_TYPE' });
		}

		// File size of the uploaded file
		const fileSize = parseInt(req.headers['content-length']);
		if (fileSize > allowedFileSize) {
			return callback({ code: 'LIMIT_FILE_SIZE_50' });
		}

		callback(null, true);
	};

// A middleware to upload only images
export const imageUploadHandler = multer({
	storage: createStorage(),
	fileFilter: generateFilter(convertMbToBytes(3), [
		FILE_TYPES.jpeg,
		FILE_TYPES.jpg,
		FILE_TYPES.png,
	]),
});
