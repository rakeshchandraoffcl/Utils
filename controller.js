const PAGINATION_LIMIT = 10;

/**
 * Search text messages by title,time and usage
 * @param Request      req
 * @param Response     res
 * @param NextFunction next
 * @return RouteHandler
 *
 */

export const searchTexts = async (req, res, next) => {
	try {
		const title = req.query.title ?? null;
		const time = req.query.time ?? null;
		const usage = req.query.usage ?? null;

		const totalRecordAvailableResponse =
			await textManagementService.textSearch(
				{
					title,
					time,
					usage,
				},
				// Return count
				true
			);
		const totalRecords = totalRecordAvailableResponse[0]['total_records'];
		if (totalRecords > 0) {
			const noOfRecordsPerPage =
				req.query.record_count && !!Number(req.query.record_count)
					? Number(req.query.record_count)
					: PAGINATION_LIMIT;
			const totalPages = Math.ceil(totalRecords / noOfRecordsPerPage);
			const pageNo =
				req.query.page && !!Number(req.query.page)
					? Number(req.query.page)
					: 1;
			const offSet = (pageNo - 1) * noOfRecordsPerPage;

			const searchResponse = await textManagementService.textSearch(
				{
					title,
					time,
					usage,
				},
				// Return Count
				false,
				// Offset
				offSet,
				// Number of entries per request
				noOfRecordsPerPage
			);

			// Serialize data for response
			const texts = searchResponse.map((item) => ({
				id: item.id,
				caller_id: item.sender_contact,
				text_title: item.message_title,
				time_of_text_message: item.when_send_message,
				usage_status: item.usage_status,
				create_date: item.create_date,
			}));

			res.status(200).send({
				pagination_limit: noOfRecordsPerPage,
				total_pages: totalPages,
				current_page: pageNo,
				total_records: Number(totalRecords),
				texts,
			});
		} else {
			throw StatusError.badRequest('noRecordsFound');
		}
	} catch (error) {
		next(error);
	}
};
