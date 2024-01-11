'use strict';

const pushButton = document.getElementById('push_notification_button');
const web_push_notification_enabled = document.getElementById('web_push_notification_enabled');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

function updateBtn() {
	if (Notification.permission === 'denied') {
		pushButton.textContent = 'Browser Messaging Blocked.';
		pushButton.disabled = true;
		updateSubscriptionOnServer(null);
		return;
	}

	if (isSubscribed) {
		pushButton.textContent = 'Disable Browser Messaging';
	} else {
		pushButton.textContent = 'Enable Browser Messaging';
	}

	pushButton.disabled = false;
}

// update web push device token on server
function updateSubscriptionOnServer(subscription) {

	$.ajax({
		type: "POST",
		url: "/save_web_push_device_token",
		contentType: 'application/json; charset=utf-8',
		dataType:'json',
		data: JSON.stringify({'web_push_device_token' : subscription}),
		success: function( data ){
			console.log(data.message);
    },
    error: function(jqXhr, textStatus, errorThrown ){
        console.log("error",errorThrown);
    }
	});
}

function subscribeUser() {
	const applicationServerPublicKey = localStorage.getItem('applicationServerPublicKey');
	const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
	swRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: applicationServerKey
		})
		.then(function(subscription) {
			console.log('User is subscribed.');

			localStorage.setItem('sub_token',JSON.stringify(subscription));
			updateSubscriptionOnServer(subscription);
			isSubscribed = true;

			updateBtn();
		})
		.catch(function(err) {
			console.log('Failed to subscribe the user: ', err);
			updateBtn();
		});
}

function unsubscribeUser() {
	swRegistration.pushManager.getSubscription()
		.then(function(subscription) {
			if (subscription) {
				return subscription.unsubscribe();
			}
		})
		.catch(function(error) {
			console.log('Error unsubscribing', error);
		})
		.then(function() {
			updateSubscriptionOnServer(null);

			console.log('User is unsubscribed.');
			isSubscribed = false;

			updateBtn();
		});
}

pushButton.addEventListener('click', function() {
	pushButton.disabled = true;
	if (isSubscribed) {
		unsubscribeUser();
	} else {
		subscribeUser();
	}
});

function initializeUI() {

	// Set the initial subscription value
	swRegistration.pushManager.getSubscription()
		.then(function(subscription) {
			isSubscribed = !(subscription === null);

			updateSubscriptionOnServer(subscription);

			if (isSubscribed) {
				console.log('User is subscribed.');
			} else {
				console.log('User is not subscribed.');
			}

			updateBtn();
		});
}

// register service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Service Worker and Push is supported');

	navigator.serviceWorker.register("/static/sw.js")
		.then(function(swReg) {

			console.log('Service Worker is registered');
			swRegistration = swReg;
			initializeUI();
		})
		.catch(function(error) {
			console.error('Service Worker Error', error);
		});
} else {
	console.warn('Push is not supported');
	pushButton.textContent = 'Browser Not Supported';
}

// for demo push notification
function push_message() {
	$.ajax({
		type: "POST",
		url: "/push_v1/",
		contentType: 'application/json; charset=utf-8',
		dataType:'json',
		data: JSON.stringify({'sub_token':localStorage.getItem('sub_token')}),
		success: function( data ){
			console.log(data.message);
    },
    error: function(jqXhr, textStatus, errorThrown ){
        console.log("error",errorThrown);
    }
	});
}

// on document ready get the VAPID public key for generating subscription token
$(document).ready(function(){
	$.ajax({
		type:"GET",
		url:'/get_VAPID_public_key',
		success:function(response){
			localStorage.setItem('applicationServerPublicKey',response.public_key);
		}
	});
});

// On page complete load get the unread notification count
$(window).load(function(e) {
	if(web_push_notification_enabled === "1"){
		get_unread_notification_count();
	}
});

// Create a broadcast channel to read the service worker message
const swListener = new BroadcastChannel('swListener');
swListener.onmessage = function(e) {
	let message = e.data;
	if(message === "Push Received"){
		// on push notification receive update the notification count
		get_unread_notification_count();
		// if the push received and opened page is notification manage page then refresh the table
		if(window.location.pathname === "/manage_web_push_notification"){
			$('#notification_table').bootstrapTable('refresh');
		}
	}else if(message === "Push Subscription Change"){
		// reset the subscription i.e save the new web push device token in server
		initializeUI();
	}else if(message === "Notification click Received"){
		// on notificaion click open the new tab for show notifications
		window.open("/cargofl_view_notificaion", "_blank");
	}else{
		console.log('swListener Received', e.data);
	}
};
