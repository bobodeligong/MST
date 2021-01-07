<!DOCTYPE html>
<html>
    <head>
        <title>MST</title>
        <script src="jspsych-6.0.5/jspsych.js"></script>
        <script src="jspsych-6.0.5/plugins/jspsych-html-keyboard-response.js"></script>
        <script src="jspsych-6.0.5/plugins/jspsych-image-keyboard-response.js"></script>
        <link href="jspsych-6.0.5/css/jspsych.css" rel="stylesheet" type="text/css"></link>
    </head>
    <body></body>
    <script>
        var timeline = [];

        /*define instruction trial*/
        var instruction = {
            type:'html-keyboard-response',
            stimulus: "<p>Instruction. Press Enter to start the experiemnt.</p>",
            choices: ['enter']
        };
        timeline.push(instruction);

        /* test trials */

        var study_stimuli = [
            {stimulus: "img/object1.png", emotion: "img/emotion1.png", emotion_index: 'neutral', data: {study_part: 'study', study_correct_response: 'k'}}; //change response button later to represent old picture
            {stimulus: "img/object2.png", emotion: "img/emotion2.png", emotion_index: 'negative', data: {study_part: 'study', study_correct_response: 'j'}}; 
            {stimulus: "img/object3.png", emotion: "img/emotion3.png", emotion_index: 'neutral', data: {study_part: 'study', study_correct_response: 'k'}}
        ]

        var test_stimuli = [
            {stimulus: "img/object4.png", data: {test_part: 'test', test_correct_response: '1'}}; //change response button later to represent old picture
            {stimulus: "img/object5.png", data: {test_part: 'test', test_correct_response: '2'}}; 
            {stimulus: "img/object6.png", data: {test_part: 'test', test_correct_response: '3'}}; 
        ]

        /* Emotion Rating Display */
        var emotion_rating = {
            type: 'html-keyboard-response',
            stimulus: jsPsych.timelineVariable('emotion'),
            choices: ['0','1','2','3','4'],
            prompt: "<p>Emotion rating from 0 to 4</p>",
            trial_duration: 4000
            data: jsPsych.timelineVariable('emotion_index')
        };


        /*Encoding*/
        var encoding ={
            type: 'html-keyboard-response',
            stimulus: jsPsych.timelineVariable('stimulus'), // add correct answer here? Should items with wrong response deleted later on in analysize
            choices: ['k','j'], // choose from 2 options?
            prompt: "<p>Indoor or Outdoor using j or k</p>",
            trial_duration: 2500,
            data: jsPsych.timelineVariable('data')
        };

        /*ITI*/
        var ITI ={
            type: 'html-keyboard-response',
            stimulus: '<div style="font-size:60px;">+</div>',
            choice: jsPsych.NO_KEYS,
            trial_duration: 1000

        };

        var encoding_procedure ={
            timeline: [emotion_rating, encoding, ITI],
            timeline_variables: study_stimuli
         };
        timeline.push(encoding_procedure);

        /*Test*/
        var test = {
            type: 'html-keyboard-response',
            stimulus: jsPsych.timelineVariable('stimulus'), // add tag about which type of stimuli presented: target, lure, foil
            choice: ['1','2','3'], // which buttons to use
            prompt:"<p>Old, Similar, or New using 1, 2, 3</p>",
            trial_duration: 2000,
            data:jsPsych.timelineVariable('data')
            }
        };
        
        var test_procedure = {
            timeline: [test],
            timeline_variabkes: test_stimuli
        };
        timeline.push(test_procedure);

        /*define debrief*/
        var debrief_block ={
            type:"html-keyboard-response",
            stimulus:function(){
                var trials = jsPsych.data.get().filter({test_part: 'test'}); // add test_part and practice_part at the beginning
                var similar_lure_trial = trials.filter ({test_correct_response: '2', key_press: '2'}); // which key press it refer to? the encoding display or the test display?
                var lure_trial = trials.filter ({test_correct_response: '2'});
                var similar_foil_trial = trials.filter ({test_correct_response: '3', key_press: '2'});
                var foil_trial = trials.filter ({test_correct_response: '3'});
                var similar_lure_prob = Math.round(similar_lure_trial.count()/lure_trial.count()*100);
                var similar_foil_prob = Math.round(similar_foil_trial.count()/foil_trial.count()*100);
                var LDI = Math.round(similar_lure_prob - similar_foil_prob);
                var old_target_trial = trials.filter({test_correct_response: '1', key_press: '1'});
                var target_trial =trials.filter({test_correct_response: '1'});
                var old_foil_trial = trials.filter({test_correct_response: '3', key_press: '1'});
                var foil_trial = trials.filter({test_correct_response: '3'});
                var old_target_prob = Math.round(old_target_trial.count()/target_trial.count()*100);
                var old_foil_prob = Math.round(old_foil_trial.count()/foil_trial.count()*100);
                var REC = Math.round(old_target_prob - old_foil_prob);
                return "<p>Your Lure Distinguish Index is "+LDI+"</p>"+ "<p>Your correct recognition memory score is "+REC+"</p>"+"<p>Press any key to complete the experiment. Thank you!</p>";
            }
        };
        timeline.push(debrief_block);

        /* start the experiment */
        jsPsych.init({
            timeline: timeline,
            on_finish: function(){
                jsPsych.data.displayData();
            }
        })

    </script>
</html>