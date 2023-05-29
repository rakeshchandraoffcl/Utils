/**
 * A service that search text messages by title,time and usage
 * @author Rakesh
 * @param Object      filter
 * @param Boolean     isCount
 * @param Number      offset
 * @param Number      limit
 * @return Promise<Array>
 *
 */

export const textSearch = async (
	{ title, time, usage },
	isCount,
	offset,
	limit
) => {
	let query =
		`SELECT ` +
		(isCount ? ` count(*) as total_records ` : ` * `) +
		` FROM ${TABLES.TS_MESSAGE_SETTING} `;

	let condition = '';

	if (title) {
		condition +=
			(!condition ? ` WHERE ` : ` AND `) +
			` message_title LIKE '%${title}%' `;
	}
	if (usage) {
		condition +=
			(!condition ? ` WHERE ` : ` AND `) + ` usage_status='${usage}' `;
	}
	if (time) {
		condition +=
			(!condition ? ` WHERE ` : ` AND `) +
			` when_send_message LIKE '%${time}%' `;
	}

	query += ` ${condition} `;

	query += `ORDER BY id DESC`;
	// If the service is not used for total count then add limit
	if (!isCount && typeof offset !== 'undefined' && limit) {
		query += ` LIMIT ${offset}, ${limit} `;
	}

	// Execute query
	const result = await MySQLManager.getInstance().execute(query);
	return result;
};
