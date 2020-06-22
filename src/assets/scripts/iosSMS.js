sendIOSSMS = function(number, message){
    number = number.toString(); /* iOS: ensure number is actually a string */
    message = message.toString();
    
    var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
            intent: 'INTENT'  // send SMS with the native android SMS messaging
            //intent: '' // send SMS without opening any other app
        }
    };

    var success = function () { return true; };
    var error = function (e) { return true; };
    sms.send(number, message, options, success, error);
    return true;
};