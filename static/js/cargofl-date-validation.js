// requires <script src="/static/custom/invoice/assets/plugins/moment/moment.js"></script>

$(document).on('changeDate', '.cargofl-date-validation', function (event) {

	var field_label = $(this).data('label');

	// check if this date is greater than current date date
	if ($(this).hasClass('cargofl-disable-past-date')) {
		if (event.date && (event.date - new Date(moment().startOf('day')) < 0)) {
			validation_error = (field_label ? field_label : 'Date') + " should not be less than current date.";
			alert(validation_error);
			$(this).val('').focus();
			return;
		}
	}

	// check if this to date is greater than from date
	if ($(this).hasClass('cargofl-to-date')) {
		var from_date_selector = $(this).data('fromDate');
		if (event.date && from_date_selector) {
			var from_date = $(from_date_selector).val();
			if (from_date) {
				if (event.date - new Date(moment(from_date, 'DD-MM-YYYY hh:mm')) < 0) {
					var to_date_label = field_label;
					var from_date_label = $(from_date_selector).data('label');
					validation_error = (to_date_label ? to_date_label : 'To Date') + ' should be greater than or equal to ' + (from_date_label ? from_date_label : 'From Date');
					alert(validation_error);
					$(this).val('').focus();
					return;
				}
			}
		}

		var from_date_value = $(this).data('fromDateValue');
		if (event.date && from_date_value && (event.date - new Date(moment(from_date_value, 'DD-MM-YYYY hh:mm')) < 0)) {
			var to_date_label = field_label;
			var from_date_label = $(this).data('fromDateLabel');
			validation_error = (to_date_label ? to_date_label : 'To Date') + ' should be greater than or equal to ' + (from_date_label ? from_date_label : 'From Date');
			alert(validation_error);
			$(this).val('').focus();
			return;
		}
	}

	// check if all to dates are greater than this from date
	if ($(this).hasClass('cargofl-from-date')) {
		var to_date_selector_list = $(this).data('toDate').split(',');
		var error_selector = [];
		var error_dates = [];

		for (to_date_selector of to_date_selector_list) {
			if (event.date && to_date_selector) {
				var to_date = $(to_date_selector).val();
				if (to_date) {
					if (new Date(moment(to_date, 'DD-MM-YYYY hh:mm')) - event.date < 0) {
						var from_date_label = field_label;
						var to_date_label = $(to_date_selector).data('label');
						error_dates.push(to_date_label ? to_date_label : 'To Date')
						error_selector.push(to_date_selector);
						$(to_date_selector).val('');
					}
				}
			}
		}

		if (error_selector.length) {
			validation_error = error_dates.join(", ") + ' should be greater than or equal to ' + (from_date_label ? from_date_label : 'From Date');
			alert(validation_error);
			// focus to first error datepicker
			$(error_selector[0]).focus();
		}
		else if (to_date_selector_list.length && !$(to_date_selector_list[0]).val() ) {
			// focus to first empty to date
			$(to_date_selector_list[0]).focus();
		}
	}

});
