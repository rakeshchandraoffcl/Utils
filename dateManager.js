import dayjs from 'dayjs';
import 'dayjs/locale/ko.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import tz from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

export class CustomDate {
	constructor() {
		this.date = dayjs;
		// Initialize plugin for timezone
		this.date.extend(utc);
		this.date.extend(tz);
		// Plugin to check date difference
		this.date.extend(isSameOrAfter);
		// Set Timezone
		this.date.tz.setDefault('Asia/Seoul');
	}

	getCurrentDate = (date = null) => {
		return date
			? this.date(date).format('YYYY-MM-DD')
			: this.date().format('YYYY-MM-DD');
	};
	getCurrentDateWithoutHypen = (date = null) => {
		return date
			? this.date(date).format('YYYYMMDD')
			: this.date().format('YYYYMMDD');
	};
	getCurrentTime = (date = null) => {
		return date
			? this.date(date).format('YYYY-MM-DD HH:mm:ss')
			: this.date().format('YYYY-MM-DD HH:mm:ss');
	};
	// Make mySQL ready
	isoStringToMySQL = (date = new Date()) => {
		return date.toISOString().slice(0, 19).replace('T', ' ');
	};
	// Check date difference
	isSameOrAfterToday = (date = null) => {
		if (!date) return false;
		return this.date().isSameOrAfter(date);
	};
	//Convert date to korean language
	toKoreanLang = (date = null, { showTime = false } = {}) => {
		if (!date) return null;
		const localeFormat = showTime ? 'LLL' : 'LL';
		this.date.extend(localizedFormat);
		return date
			? this.date(date).locale('ko').format(localeFormat)
			: this.date().locale('ko').format(localeFormat);
	};
}
