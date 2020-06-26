// we will restore the intercepted SMS here, for later restore
var smsList = [];
var interceptEnabled = false;


var sendSms = function(sendToArray, textmsg) {
    //var number = document.getElementById('numberTxt').value.toString(); /* iOS: ensure number is actually a string */
    //var message = document.getElementById('messageTxt').value;

    //CONFIGURATION
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
        }
    };

    var success = function () { return true; };
    var error = function (e) { return true; };
    sms.send(sendToArray, textmsg, options, success, error);
    return true;
}

function sendSMSv2(sendToArray, textmsg){
    var permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.SEND_SMS, function( status ){
        if (status.hasPermission){
            if(SMS){
                SMS.sendSMS(sendToArray, textmsg, function(){return true}, function(str){alert(str);});
            }
        }else{
            permissions.requestPermission(permissions.SEND_SMS,
                function(status){
                    if(status.hasPermission ){
                        if(SMS){
                            SMS.sendSMS(sendToArray, textmsg, function(){return true}, function(str){alert(str);});
                        }
                    }else{
                        return false;
                    }
                }
            );
        }
    });
    return true;
}