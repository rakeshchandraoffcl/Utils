import fs from 'fs';
import { StatusError } from './../../config/StatusErrors.js';
import { envs } from './../../config/index.js';

export default class FileUtil {
	/**
	 * Remove file by name or file from url
	 * @param {Array<String>} filePaths array of string with file paths
	 * @returns {Array<String>} deleted file paths
	 */
	static remove(filePaths) {
		try {
			if (!Array.isArray(filePaths)) filePaths = [filePaths];
			const resultPaths = [];
			for (let path of filePaths) {
				if (!path) continue;
				// if path is URL
				if (!path.startsWith(envs.uploadPath))
					path = FileUtil.getFilePathFromUrlPath(path);
				// Remove if exists
				if (fs.existsSync(path)) fs.unlinkSync(path);
				resultPaths.push(path);
			}
			if (resultPaths.length > 0)
				console.log(`deleted files: ${resultPaths}`);
			return resultPaths;
		} catch (error) {
			throw StatusError.serverError(error);
		}
	}

	/**
	 * Get file path from URL
	 * @param {String} fileFullPath URL
	 */

	static getFilePathFromUrlPath(fileFullPath) {
		try {
			return String(fileFullPath).slice(
				fileFullPath.indexOf(envs.uploadPath)
			);
		} catch (error) {
			throw StatusError.serverError(error);
		}
	}

	/**
	 * Create URL for file
	 * @param {Express.Request} req Request Object
	 * @param {String} file File
	 * @return {String}
	 */
	static getFileURL(req, file) {
		if (!file) return null;
		return `${req.protocol}://${req.headers.host}/${String(file).replaceAll(
			'\\',
			'/'
		)}`;
	}

	/**
	 * Create download url of a file
	 * @param {Express.Request} req Request Object
	 * @param {String} file File
	 * @param {String} original_name File original name
	 * @return {String}
	 */

	static getFileDownloadURL(req, file, original_name) {
		if (!file || !original_name) return null;
		const protocol = String(req.headers.host).includes('localhost')
			? 'http'
			: 'https';
		const replacedPath = String(file).replaceAll('\\', '/');
		return `${protocol}://${req.headers.host}/api/v1/user/download-file/${replacedPath}?original_name=${original_name}`;
	}
}
