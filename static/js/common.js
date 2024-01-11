function handlespecialchars(input) {
		var inputvalue = input.value
		var newvalue = inputvalue.split("&").join("and");
		newvalue = newvalue.split("#").join(" ");
		newvalue = newvalue.split("'").join("");
		newvalue = newvalue.split("%").join(" ");
		document.getElementById(input.id).value = newvalue;
}

function isNumberKey(evt){
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if ((charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) || (charCode == 46)) {
		return false;
	}
	return true;
}
function isAlphanumeric(evt){
var code = (evt.which) ? evt.which : evt.keyCode;
if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
}
function isAlphanumericWithSpace(event){
	var regex = new RegExp("^[a-zA-Z0-9 ,_.]+$");
	var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
	if (!regex.test(key)) {
	    event.preventDefault();
	    return false;
	}
}

function titleCase(str) {
	return str.toLowerCase().split(' ').map(function(word) {
		return (word.charAt(0).toUpperCase() + word.slice(1));
	}).join(' ');
}

// function isNumberKeyWithFloat(el, evt) {
// 	var charCode = (evt.which) ? evt.which : event.keyCode;
// 	var number = el.value.split('.');
// 	if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
// 		return false;
// 	}
// 	//just one dot
// 	if(number.length>1 && charCode == 46){
// 		 return false;
// 	}

// 	//get the carat position
// 	var caratPos = getSelectionStart(el);
// 	var dotPos = el.value.indexOf(".");
// 	if( caratPos > dotPos && dotPos>-1 && (number[1].length > 1)){
// 		return false;
// 	}
// 	return true;
// }

// el -> this, evt -> event, decimal_length -> max length after floating point
function isNumberKeyWithFloat(el, evt, decimal_length=2) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	var number = el.value.split('.');

	if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	//just one dot
	if(number.length>1 && charCode == 46){
		 return false;
	}

	//get the carat position
	var caratPos = getSelectionStart(el);
	var dotPos = el.value.indexOf(".");

	if (
		caratPos > dotPos // entering after dot
		&& (dotPos>-1 || charCode == 46) // a dot is present, or current entered key is dot
		&& (el.value.length - (charCode == 46 ? caratPos : dotPos) > decimal_length) // total length - characters after position > specified max decimal length
		){
		return false;
	}
	return true;
}


function getSelectionStart(o) {
  if (o.createTextRange) {
	var r = document.selection.createRange().duplicate()
	r.moveEnd('character', o.value.length)
	if (r.text == '') return o.value.length
	return o.value.lastIndexOf(r.text)
  } else return o.selectionStart
}

String.prototype.toTitleCase = function(){
	return this.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
		return match.toUpperCase();
	});
};

// Prevent Ctrl+Shift+I, Ctrl+Shift+C, F12
$(document).keydown(function (event) {
	if ((event.ctrlKey && event.shiftKey) || (event.keyCode == 123)) {
		return false;
	}
});

//Disable Right Click
document.addEventListener("contextmenu", function(e){
	e.preventDefault();
}, false);

// resize bootstrap table on window resize
$(window).resize(function () {
	if($('.bootstrap-table table').length){
		$('.bootstrap-table table').bootstrapTable('resetView');
	}
});

// change menu text colour
function hilightMenu(menu){
	/*$(".navbar").find('a').filter(function(){return $(this).text()==menu}).parent().parent().siblings('.dropdown-menu').css("color", "#3299CC");
	$(".navbar").find('a').filter(function(){return $(this).text()==menu}).css("color", "#3299CC");*/
}

// auto-select hilighted option in select2 by Tab key
$(document).on('select2:close', 'select', function(evt) {
	var context = $(evt.target);

	$(document).on('keydown.select2', function(e) {
		// tab
		if (e.which === 9) {
			var highlighted = context.data('select2').$dropdown.find('.select2-results__option--highlighted');
			if (highlighted) {
				if (highlighted.data('data')) {
				  var id = highlighted.data('data').id;
				  context.val(id).trigger('change');
				} else{
				  context.val('').trigger('change');
				}
			}
		}
	});

	// unbind the event again to avoid binding multiple times
	setTimeout(function() {
		$(document).off('keydown.select2');
	}, 1);
});

// On focus open select2
$(document).on('focus', '.select2-selection.select2-selection--single', function (e) {
	$(this).closest(".select2-container").siblings('select:enabled').select2('open');
});

// need different approach here (dont allow bootstrap validator to add class instead removing it after it has been added)
// dont add has-success class in bootstrap form
$(document).on('change', '.bv-form', function(e) {
	$(this).find('.has-success').removeClass('has-success');
});

// formats number to currency
// currency_formatter.format(10000000.1313) => ₹ 1,00,00,000.13
const currency_formatter = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'INR',
	minimumFractionDigits: 2
});

// return days between two dates
function getDaysBetweenDate(date1, date2){

raw_date1 = date1.split("-");
date1 = raw_date1[2] + "-" + raw_date1[1] + "-" + raw_date1[0];

raw_date2 = date2.split("-");
date2 = raw_date2[2] + "-" + raw_date2[1] + "-" + raw_date2[0];

date1 = new Date(date1);
date2 = new Date(date2);

var Difference_In_Time = date2.getTime() - date1.getTime();

var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

return Difference_In_Days;

}

// loader for every ajax call
$(document).ajaxStart(function(){
  $(".divLoading").addClass('show');
});

$(document).ajaxComplete(function(){
  $(".divLoading").removeClass('show');
});

// Get total days in current month
function daysInThisMonth(date = null) {
	if (date == null) {
		var now = new Date();
	}else{
		var now = date;
	}
  return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
}

// compare month and year
function compare_selected_month_year_with_currnt_month_year(selected_date) {
	// If selected date is empty then set selected date as today's date
	if (selected_date == "") {
		selected_date = new Date();
	}
	let selected_filtered_date = new Date(selected_date);
	let current_date = new Date();

	let selected_date_month = selected_filtered_date.getMonth() + 1;
	let selected_date_year = selected_filtered_date.getFullYear()

	let current_date_month = current_date.getMonth() + 1;
	let current_date_year = current_date.getFullYear();

	// Compare month and year
	if (selected_date_month == current_date_month && selected_date_year == current_date_year){
		// selected month year is equal to currnt month year
		return 0;
	}else if ((selected_date_year + selected_date_month / 12) < (current_date_year + current_date_month / 12)){
		// selected month year is less than currnt month year
		return -1;
	}else{
		// selected month year is greater than currnt month year
	 return 1;
	}
}

// compare applicable month and year with closing month year
function compare_applicable_month_year_with_closing_month_year(applicable_date, closing_date) {
	var months = {'January' : '01','February' : '02','March' : '03','April' : '04','May' : '05','June' : '06','July' : '07','August': '08','September' : '09','October' : '10','November' : '11','December' : '12'};

	var from_month = months[applicable_date.split(" ")[0]];
	var to_month = months[closing_date.split(" ")[0]];

	var from_year = applicable_date.split(" ").pop();
	var to_year = closing_date.split(" ").pop();

	// IF applicable month is less than closing date then return true else false
	if ((to_month > from_month && to_year == from_year) || (to_year > from_year)){
		return true;
	}
	else{
		return false;
	}
}

// return days between two dates
function get_date_difference(date1, date2){
raw_date1 = date1.split("-");
date1 = raw_date1[2] + "-" + raw_date1[1] + "-" + raw_date1[0];

raw_date2 = date2.split("-");
date2 = raw_date2[2] + "-" + raw_date2[1] + "-" + raw_date2[0];

date1 = new Date(date1);
date2 = new Date(date2);

var Difference_In_Time = date2.getTime() - date1.getTime();

var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
return Difference_In_Days;
}

// on every ajax call send a access token
$.ajaxSetup({
	beforeSend: function (xhr)
	{
		 xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"));
	}
});	

// on 401 ie unauthorized response redirect to login page
$( document ).ajaxError(function( event, jqxhr, settings, exception ) {
	if ( jqxhr.status == 401) {
		// popup security alert modal
		$("#modal_token_expiry").modal("show");
	}
});

// on page load complete ajax call tp verify the user loaded page
$( document ).ready(function(e) {
	let access_token = localStorage.getItem("access_token");
	// if token not null then only call to verify token
	if(access_token != null){
		$.ajax({
			url: '/api/v1/cargofl/verify-access-token',
			type: 'GET',
			dataType: 'json',
			async: false,
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response) {
				return;
			}
		});
	}
});

// documentation of below function is avaiable on : https://sweetalert.js.org/docs/
// This function is use for pop up confirmation alert
function submitForm(form) {
	swal({
		title: "Are you sure want to submit?",
		icon: "warning",
		buttons: ["Cancle", "Yes, Sure"],
	})
	.then(function (isOkay) {
		if (isOkay) {
			form.submit();
		}
	});
	return false;
}