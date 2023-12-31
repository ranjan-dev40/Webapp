
  jQuery(document).ready(function () {
    var $ = jQuery;
    var myRecorder = {
        objects: {
            context: null,
            stream: null,
            recorder: null
        },
        init: function () {
            if (null === myRecorder.objects.context) {
                myRecorder.objects.context = new (
                    window.AudioContext || window.webkitAudioContext
                );
            }
        },
        start: function () {
            var options = { audio: true, video: false };
            navigator.mediaDevices.getUserMedia(options).then(function (stream) {

                myRecorder.objects.stream = stream;
                myRecorder.objects.recorder = new Recorder(
                    myRecorder.objects.context.createMediaStreamSource(stream),
                    { numChannels: 1 }
                );
                myRecorder.objects.recorder.record();
            }).catch(function (err) {
                alert(err.name + ": " + err.message);
            });
        },
        stop: function (listObject) {
            if (null !== myRecorder.objects.stream) {
                myRecorder.objects.stream.getAudioTracks()[0].stop();
            }
            if (null !== myRecorder.objects.recorder) {
                myRecorder.objects.recorder.stop();

                // Validate object
                if (null !== listObject
                    && 'object' === typeof listObject
                    && listObject.length > 0) {
                    // Export the WAV file
                    myRecorder.objects.recorder.exportWAV(function (blob) {
                        var url = (window.URL || window.webkitURL)
                            .createObjectURL(blob);




                        // Prepare the playback
                        var audioObject = $('<audio controls></audio>')
                            .attr('src', url);




                        // Wrap everything in a row
                        var holderObject = $('<div class="row"></div>')
                            .append(audioObject)

                        // Append to the list
                        listObject.empty().append(holderObject);



                    });
                }
            }
        }
    };

    // Prepare the recordings list
    var listObject = $('[data-role="recordings"]');




    // Prepare the record button
    $('[data-role="controls"] > button').click(function () {
        // Initialize the recorder
        myRecorder.init();

        // Get the button state 
        var buttonState = !!$(this).attr('data-recording');

        // Toggle
        if (!buttonState) {
            $(this).attr('data-recording', 'true');
            $('[data-role="controls"] > button').html('Stop');
            myRecorder.start();
            $()
        } else {
            $(this).attr('data-recording', '');
            $('[data-role="controls"] > button').html('Start');
            myRecorder.stop(listObject);



        }
    });


    $.session.set('listObject', 'jqueryscript');



    $.ajax({
        type: "POST",
        url: url,
        data: listObject,
        success: success,
        dataType: String
    });




});
