// Copyright (C) 2011-2012 by Tapjoy Inc.
//
// This file is part of the Tapjoy SDK.
//
// By using the Tapjoy SDK in your software, you agree to the terms of the Tapjoy SDK License Agreement.
//
// The Tapjoy SDK is bound by the Tapjoy SDK License Agreement and can be found here: https://www.tapjoy.com/sdk/license


var Tapjoy = function() {
}

Tapjoy = function() {
    Tapjoy.serviceName = "TapjoyPlugin";
    Tapjoy.eventDict = {};
};

Tapjoy.prototype.TJC_DISPLAY_AD_SIZE_320X50 = "320x50";
Tapjoy.prototype.TJC_DISPLAY_AD_SIZE_640X100 = "640x100";
Tapjoy.prototype.TJC_DISPLAY_AD_SIZE_768X90	= "768x90";


// iOS settings for collection of MAC address. Use this with the TJC_OPTION_COLLECT_MAC_ADDRESS option.
Tapjoy.prototype.MacAddressOptionOn = "0";                      // Enables collection of MAC address.
Tapjoy.prototype.MacAddressOptionOffWithVersionCheck = "1";     //Disables collection of MAC address for iOS versions 6.0 and above.
Tapjoy.prototype.MacAddressOptionOff = "2";                     //Completely disables collection of MAC address. THIS WILL EFFECTIVELY DISABLE THE SDK FOR IOS VERSIONS BELOW 6.0!

/**
 * Initialize Tapjoy Connect
 *
 * @param sdkKey			The Tapjoy SDK Key.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.requestTapjoyConnect = function(sdkKey, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "requestTapjoyConnect",
        [appID, secretKey]);
};

/**
 * Initialize Tapjoy Connect with flags
 *
 * @param sdkKey            The Tapjoy SDK Key.
 * @param flags				Tapjoy Connect flags.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.requestTapjoyConnectWithFlags = function(sdkKey, flags, successCallback, failureCallback) {
    // Populate the hashtable.
    for (var name in flags) {
        cordova.exec(
            null,
            null,
            Tapjoy.serviceName,
            "setFlagKeyValue",
            [name, flags[name]]);
    }

    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "requestTapjoyConnect",
        [appID, secretKey]);
};

/**
 * Sets a userID for this device/account.  This can only be used with non-managed currency and must be called before
 * showing the Marketplace, Display ads, Featured ad, etc.
 *
 * @param userID			The ID you wish to use for this user/account.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.setUserID = function(userID, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "setUserID",
        [userID]);
};

/**
 * Use for advertising your app if it is a Paid App.  Call after requestTapjoyConnect.
 *
 * @param paidAppActionID	The Tapjoy Paid App Action ID for this offer.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.enablePaidAppWithActionID = function(paidAppActionID, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        'enablePaidAppWithActionID',
        [paidAppActionID]);
};


/**
 * Pay Per Action.
 *
 * @param actionID			PPA ID.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.actionComplete = function(actionID, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "actionComplete",
        [actionID]);
};


/**
 * Get Tap Points
 *
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.getTapPoints = function(successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "getTapPoints",
        []);
};


/**
 * Spend Tap Points
 *
 * @param amount			Amount to spend.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.spendTapPoints = function(amount, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "spendTapPoints",
        [amount]);
};


/**
 * Award Tap Points
 *
 * @param amount			Amount to award.
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.awardTapPoints = function(amount, successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "awardTapPoints",
        [amount]);
};


/**
 * Sets the video notifier
 *
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.setVideoNotifier = function(successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        'setVideoNotifier',
        []);
};

/**
 * @deprecated Deprecated since version 10.0.0
 * Sets the video notifier
 *
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.setVideoAdDelegate = function(successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        "setVideoAdDelegate",
        []);
};

/**
 * Sends shutdown event.
 *
 * @param successCallback	The success callback
 * @param failureCallback	The error callback
 */
Tapjoy.prototype.sendShutDownEvent = function(successCallback, failureCallback) {
    return cordova.exec(
        successCallback,
        failureCallback,
        Tapjoy.serviceName,
        'sendShutDownEvent',
        []);
};


///// Tapjoy Events Framework implementation

Tapjoy.sendEventCompleteWithContent = function(guid) {
    if (guid in Tapjoy.eventDict){
        Tapjoy.eventDict[guid].triggerSendEventSucceeded(true);
    }

};

Tapjoy.sendEventComplete = function(guid) {
    if(guid in Tapjoy.eventDict){
        Tapjoy.eventDict[guid].triggerSendEventSucceeded(false);
    }
};

Tapjoy.sendEventFail = function(guid, errorMsg) {
    if(guid in Tapjoy.eventDict){
        Tapjoy.eventDict[guid].triggerSendEventFailed(errorMsg);
    }
};

Tapjoy.eventContentDidAppear = function(guid) {
    if(guid in Tapjoy.eventDict){
        Tapjoy.eventDict[guid].triggerContentDidAppear();
    }
};

Tapjoy.eventContentDidDisappear = function(guid) {
    if(guid in Tapjoy.eventDict){
        Tapjoy.eventDict[guid].triggerContentDidDisappear();
    }
};

Tapjoy.createEvent = function(tjEvent, eventName, eventParameter) {
    var guid = generateGuid();

    while(guid in Tapjoy.eventDict){
        guid = generateGuid();
    }

    tjEvent.guid = guid;

    this.eventDict[guid] = tjEvent;

    // Platform Plugin createEvent
    var responseFunction = function(r){

    }

    return cordova.exec(
        responseFunction,
        responseFunction,
        Tapjoy.serviceName,
        "createEvent",
        [guid, eventName, eventParameter]);
};

Tapjoy.eventRequestCompleted = function(guid)
{
    var responseFunction = function(r){

    }
    return cordova.exec(
        responseFunction,
        responseFunction,
        Tapjoy.serviceName,
        "eventRequestCompleted",
        [guid]);
};

Tapjoy.eventRequestCancelled = function(guid)
{
    var responseFunction = function(r){

    }
    return cordova.exec(
        responseFunction,
        responseFunction,
        Tapjoy.serviceName,
        "eventRequestCancelled",
        [guid]);
};

/////////////////////////////
// TJEvent
/////////////////////////////

/**
 * Creates a new instance of TJEvent
 *
 * @param eventName				The name of the event
 * @param eventParameter		String that specifies the additional event value
 * @param eventCallback			An instance of TJEventCallback
 */
var TJEvent = function(eventName, eventParameter, eventCallback) {
    this.eventName = eventName;
    this.eventParameter = eventParameter;
    this.eventCallback = eventCallback;

    Tapjoy.createEvent(this, eventName, eventParameter);
};

/**
 * Sends the event to the server
 */
TJEvent.prototype.send = function(){
    Tapjoy.sendEvent(this.guid);
};

/**
 * Shows the content that was received from the server after sending this event
 */
TJEvent.prototype.show = function(){
    Tapjoy.showEvent(this.guid);
};

TJEvent.prototype.enableAutoPresent = function(autoPresent) {
    Tapjoy.enableEventAutoPresent(this.guid, autoPresent);
};

TJEvent.prototype.triggerSendEventSucceeded = function(contentIsAvailable){
    this.eventCallback.sendEventSucceeded(this, contentIsAvailable);
};

TJEvent.prototype.triggerSendEventFailed = function(errorMsg){
    this.eventCallback.sendEventFailed(this, errorMsg);
};

TJEvent.prototype.triggerContentDidAppear = function(){
    this.eventCallback.contentDidAppear(this);
};

TJEvent.prototype.triggerContentDidDisappear = function(){
    this.eventCallback.contentDidDisappear(this);
};

TJEvent.prototype.triggerDidRequestAction = function(type, identifier, quantity){
    var eventRequest = new TJEventRequest(this.guid, type, identifier, quantity);

    this.eventCallback.didRequestAction(this, eventRequest);
};

/////////////////////////////
// TJEventCallback
/////////////////////////////

/**
 * Class that handles the responses received upon sending a TJEvent
 *
 * @param eventSuccessFunction 			A function that will be called when the event is sent successfully.
 * @param eventFailedFunction 			A function that will be called when an error occurs while sending the event
 */
var TJEventCallback = function(eventSuccessFunction, eventFailedFunction, contentDidAppearFunction, contentDidDisappearFunction, didRequestActionFunction) {
    this.eventSuccessFunction = eventSuccessFunction;
    this.eventFailedFunction = eventFailedFunction;
    this.contentDidAppearFunction = contentDidAppearFunction;
    this.contentDidDisappearFunction = contentDidDisappearFunction;
    this.didRequestActionFunction = didRequestActionFunction;
};

/**
 * Called when the event is sent successfully
 *
 * @param tjEvent				The TJEvent that was sent
 * @param contentIsAvailable	true if content is available, otherwise false
 */
TJEventCallback.prototype.sendEventSucceeded = function(tjEvent, contentIsAvailable) {
    this.eventSuccessFunction(tjEvent, contentIsAvailable);
};

/**
 * Called when an error occurs while sending the event
 *
 * @param tjEvent				The TJEvent that was sent
 * @param errorMsg				The error that occurred
 */
TJEventCallback.prototype.sendEventFailed = function(tjEvent, errorMsg) {
    this.eventFailedFunction(tjEvent, errorMsg);
};

/**
 * Called when content has been shown
 *
 * @param tjEvent       The TJEvent that was sent
 */
TJEventCallback.prototype.contentDidAppear = function(tjEvent) {
    this.contentDidAppearFunction(tjEvent);
};

/**
 * Called when content has been dismissed
 *
 * @param tjEvent       The TJEvent that was sent
 */
TJEventCallback.prototype.contentDidDisappear = function(tjEvent) {
    this.contentDidDisappearFunction(tjEvent);
};

/**
 * Called when an action is requested of your app
 *
 * @param tjEvent         The TJEvent that was sent
 * @param tjEventRequest  The TJEventRequest object describing the request
 */
TJEventCallback.prototype.didRequestAction = function(tjEvent, tjEventRequest) {
    this.didRequestActionFunction(tjEvent, tjEventRequest);
};

/////////////////////////////
// TJEventRequest
/////////////////////////////

var TJEventRequest = function(guid, type, identifier, quantity) {
    this.guid = guid;
    this.type = type;
    this.identifier = identifier;
    this.quantity = quantity;
};

TJEventRequest.TYPE_IN_APP_PURHCASE = 1;
TJEventRequest.TYPE_VIRTUAL_GOOD = 2;
TJEventRequest.TYPE_CURRENCY = 3;
TJEventRequest.TYPE_NAVIGATION = 4;

TJEventRequest.prototype.eventRequestCompleted = function() {
    Tapjoy.eventRequestCompleted(this.guid);
};

TJEventRequest.prototype.eventRequestCancelled = function() {
    Tapjoy.eventRequestCancelled(this.guid);
}

// Utility functions

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

function generateGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.Tapjoy) {
    window.plugins.Tapjoy = new Tapjoy();
}

if (module.exports) {
    module.exports = new Tapjoy();
}