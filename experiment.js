/*
    
///////////////////////////////////////////////////////////////
//  Static Inatentionnal Blindness Task (Mack & Rock, 1998) //
//////////////////////////////////////////////////////////////
    
Static Inattentional Blindness task as elaborated by Newby & Rock (1998)
Enables the examination of explicit attentional capture
    
*/

/////////////////////////////////////
//Timeline and Experiment Variables//
/////////////////////////////////////

// Initialize jsPsych
var jsPsych = initJsPsych();

/* Uncoment to capture participants' info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');
    
jsPsych.data.addProperties({
        subject_id: subject_id,
        study_id: study_id,
        session_id: session_id
}); 
*/

/* General Variables */
var timeline = []; //this is the timeline to which all trials are pushed
var date = Date.now(); //get today's date for data logging
    
/* Experiment-Revelant Variables */
var key_vertical = `v`; //what key should participants press when the vertical line is the longest one ?
var key_horizontal = `n`; //what key should participants press when the horizontal line is the longest one ?
    
// Function to hide the cursor when needed
    function hideCursor() {
      document.body.style.cursor = 'none';
}
    
// Function to show the cursor when needed
    function showCursor() {
      document.body.style.cursor = 'default';
}
    
/*
//Uncomment this line to run the experiment on pavlovia.org
// init connection with pavlovia.org 
    var pavlovia_init = {
      type: jsPsychPavlovia,
      command: "init"
};
*/

// Preload images
    var preload = {
      type: jsPsychPreload,
      images: ['img/cross_1_h.png',
               'img/cross_2_h.png',
               'img/cross_3_h.png',
               'img/cross_4_h.png',
               'img/cross_5_h.png',
               'img/cross_6_h.png',
               'img/cross_1_v.png',
               'img/cross_2_v.png',
               'img/cross_3_v.png',
               'img/cross_4_v.png',
               'img/cross_5_v.png',
               'img/cross_6_v.png',
               'img/fix_square.png', 
               'img/PatternMask.png',
               'img/square.png', 
               'img/circle.png',
               'img/triangle.png',
               'img/hexagon.png',
               'img/localisation_question.png',], 
};
    
// Check Browser before starting the experiment
var browserCheck = {
        type: jsPsychBrowserCheck,
        inclusion_function: (data) => {
          return ['chrome', 'firefox'].includes(data.browser);
        },
        exclusion_message: (data) => {
          return `<p>You must use Google Chrome or Mozilla Firefox to participate in this research.</p>`;
        },
}; 
////////////////////////
/**** Trial Screens ***/
////////////////////////    
    
/* Here are defined the specific screens of the task. */   
var launch_trial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <style>
            body {
                background-color: #959595;
            }
            .instruction-text {
                text-align: center;
                margin: 0 250px;
                font-size: 18px; 
            }
        </style>
        <div class="instruction-text" style="margin: 0 150px; max-width: 800px;">
          <p>Press the <strong>SPACE</strong> key to start the trial.</p>
        </div>
      `,
      choices: [' '],
};
    
// Fixation square lasting 1000 ms
var fix_square = {
        type: jsPsychImageKeyboardResponse,
        stimulus: 'img/fix_square.png',
        choices: "NO_KEYS",
        trial_duration: 1000,
        on_load: function() {
            hideCursor();
            document.body.style.backgroundColor = '#959595';
        }
};
    
// End-trial mask lasting 500 ms
var mask = {
          type: jsPsychImageKeyboardResponse,
          stimulus: 'img/PatternMask.png',
          choices: "NO_KEYS",
          trial_duration: 500,
};
    
    
// Question about the longest line
var line_question = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <p style="font-size: 1.2em;">Which line seemed the longest to you?</p>
          <p>Press the key:</p>
          <p><strong>v</strong> to indicate that the <strong>vertical line (|)</strong> was the longest,</p>
          <p><strong>n</strong> to indicate that the <strong>horizontal line (—)</strong> was the longest.</p>
        `,
        choices: [key_horizontal, key_vertical],
        on_finish: function(data) {
          data.key_pressed = data.response;
        }
};
    
// Detection question
var detection_question = {
        type: jsPsychSurveyHtmlForm,
        preamble: `
          <h2 style="text-align: center;">Detection</h2>
          <p>Did you notice anything unusual during the last trial that was not present in the previous trials?</p>
        `,
        html: `
          <div style="display: flex; justify-content: center; gap: 20px;">
            <label><input type="radio" name="detection" value="yes" required> Yes</label>
            <label><input type="radio" name="detection" value="no" required> No</label>
          </div>
        `,
        button_label: 'Continue',
        on_load: showCursor,
        on_finish: function(data) {    
          data.detection_response = data.response;
        }
};
    
// Initialize an empty array to store all localisation responses
var localisation_responses = [];
    
// Localisation question
var localisation_question = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h2 style="text-align: center;">Localization</h2>
        <p>Please indicate in which quadrant the unexpected element appeared.</p>
        <p>If you did not notice anything during this trial, try to guess where the unexpected element might have appeared.</p>
        <div style="position: relative; width: 266px; height: 266px; margin: 0 auto;">
          <img src="img/localisation_question.png" style="width: 100%; height: 100%;">
        </div>
      `,
      choices: ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'],
      button_html: function(choice, index) {
        // Customize button placement based on index
        let style = '';
        switch (index) {
          case 0: style = 'position: absolute; top: 45%; left: 30%; font-size: 12px;'; break;
          case 1: style = 'position: absolute; top: 45%; right: 32%; font-size: 12px;'; break;
          case 2: style = 'position: absolute; bottom: 8%; left: 30%; font-size: 12px;'; break;
          case 3: style = 'position: absolute; bottom: 8%; right: 32%; font-size: 12px;'; break;
        }
        return `<button class="jspsych-btn" style="${style}">${choice}</button>`;
      },
      on_finish: function(data) {
        var choices = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'];
        var response = choices[data.response];
    
        // Append the response to the localisation_responses array
        localisation_responses.push(response);
    
        // Save the updated array in the jsPsych data
        jsPsych.data.addProperties({
          localisation_responses: localisation_responses
        });
      }
};
    
// Identification question
var identification_question = {
        type: jsPsychSurveyHtmlForm,
        preamble: `
          <h2 style="text-align: center;">Identification</h2>
          <p>Please indicate which of these images you saw during the last trial.</p>
          <p>If you do not know or are unsure, please still try to guess which image might have appeared.</p>
        `,
        html: function() {
          // Array of label elements
          var labels = [
            '<label style="text-align: center;"><img src="img/circle.png" style="width: 76px; height: 76px;"><br><input type="radio" name="identification" value="circle" required></label>',
            '<label style="text-align: center;"><img src="img/square.png" style="width: 76px; height: 76px;"><br><input type="radio" name="identification" value="square" required></label>',
            '<label style="text-align: center;"><img src="img/triangle.png" style="width: 76px; height: 76px;"><br><input type="radio" name="identification" value="triangle" required></label>',
            '<label style="text-align: center;"><img src="img/hexagon.png" style="width: 76px; height: 76px;"><br><input type="radio" name="identification" value="hexagon" required></label>'
          ];
    
          // Shuffle the labels array
          labels = jsPsych.randomization.shuffle(labels);
    
          // Join the shuffled labels into a single string
          return '<div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap;">' + labels.join('') + '</div>';
        },
        button_label: 'Continue',
        on_finish: function(data) {
          data.identification_response = data.response;
        }
};
    
// Confidence in detection response
var confidence_detection = {
      type: jsPsychSurveyHtmlForm,
      preamble: `
        <h2 style="text-align: center; margin-top: 30px; margin-left: 30px; margin-right: 30px; max-width: 880px;">Confidence in your response</h2>
        <p style="margin-left: 30px; margin-right: 30px; max-width: 880px;">How confident are you in your response to the question about <u>detecting something unusual during the last trial?</u></p>  `,
      html: `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-left: 30px; margin-right: 30px; max-width: 880px;">
          <label style="font-size: 16px;"> No confidence in my response</label>
          <label><input type="radio" name="confidence" value="0" required> 0</label>
          <label><input type="radio" name="confidence" value="1" required> 1</label>
          <label><input type="radio" name="confidence" value="2" required> 2</label>
          <label><input type="radio" name="confidence" value="3" required> 3</label>
          <label style="font-size: 16px;"> High confidence in my response</label>
        </div>
      `,
      button_label: 'Continue',
      on_finish: function(data) {      
        data.confidence_detection = data.response;
      }
};
// Confidence in localisation response
var confidence_localisation = {
      type: jsPsychSurveyHtmlForm,
      preamble: `
        <style>
        </style>
        <h2 style="text-align: center; margin-top: 30px; margin-left: 30px; margin-right: 30px; max-width: 880px;">Confidence in your response</h2>
        <p style="margin-left: 30px; margin-right: 30px; max-width: 880px;">How confident are you in your response to the question about <u>the quadrant in which the unexpected image appeared?</u></p>
      `,
      html: `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-left: 30px; margin-right: 30px; max-width: 880px;">
          <label style="font-size: 16px;"> No confidence in my response</label>
          <label><input type="radio" name="confidence" value="0" required> 0</label>
          <label><input type="radio" name="confidence" value="1" required> 1</label>
          <label><input type="radio" name="confidence" value="2" required> 2</label>
          <label><input type="radio" name="confidence" value="3" required> 3</label>
          <label style="font-size: 16px;"> High confidence in my response</label>
        </div>
      `,
      button_label: 'Continue',
      on_finish: function(data) {    
        data.confidence_localisation = data.response;
      }
};
    
// Confidence in identification response
var confidence_identification = {
      type: jsPsychSurveyHtmlForm,
      preamble: `
        <h2 style="text-align: center; margin-top: 30px; margin-left: 30px; margin-right: 30px; max-width: 880px;">Confidence in your response</h2>
        <p style="margin-left: 30px; margin-right: 30px; max-width: 880px;">How confident are you in your response to the question about <u>identifying the unexpected image?</u></p>
      `,
      html: `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-left: 30px; margin-right: 30px; max-width: 880px;">
          <label style="font-size: 16px;"> No confidence in my response</label>
          <label><input type="radio" name="confidence" value="0" required> 0</label>
          <label><input type="radio" name="confidence" value="1" required> 1</label>
          <label><input type="radio" name="confidence" value="2" required> 2</label>
          <label><input type="radio" name="confidence" value="3" required> 3</label>
          <label style="font-size: 16px;"> High confidence in my response</label>
        </div>
      `,
      button_label: 'Continue',
      on_finish: function(data) {    
        data.confidence_identification = data.response;
      }
};
      
/////////////////////
/* Training Trials */
/////////////////////
    
// Initialize an empty array to store the order of the stimuli
var stimulus_choosen = [];
    
// Define and shuffle the cross stimuli array at the beginning of the experiment
var shuffled_cross_stimuli = jsPsych.randomization.shuffle([
      {stimulus: "img/cross_1_h.png", name: "h"},
      {stimulus: "img/cross_2_h.png", name: "h"}, 
      {stimulus: "img/cross_3_h.png", name: "h"},
      {stimulus: "img/cross_4_h.png", name: "h"},
      {stimulus: "img/cross_5_h.png", name: "h"},
      {stimulus: "img/cross_6_h.png", name: "h"},
      {stimulus: "img/cross_1_v.png", name: "v"},
      {stimulus: "img/cross_2_v.png", name: "v"},
      {stimulus: "img/cross_3_v.png", name: "v"},
      {stimulus: "img/cross_4_v.png", name: "v"},
      {stimulus: "img/cross_5_v.png", name: "v"},
      {stimulus: "img/cross_6_v.png", name: "v"}
]);
    
// Initialize a counter to keep track of the current stimulus index
var current_stimulus_index = 0;
    
/* define the stimuli of the training trials */
var training_trials = {
      type: jsPsychImageKeyboardResponse,
      stimulus: function() {
        // Select the stimulus based on the current index
        var stimulus = shuffled_cross_stimuli[current_stimulus_index].stimulus;
    
        // Append the chosen stimulus to the stimulus_order array
        stimulus_choosen.push(stimulus);
    
        // Increment the counter
        current_stimulus_index++;
    
        return stimulus;
      },
      choices: "NO_KEYS", 
      trial_duration: 200,
      data: function() {
        return {
          stimulus_chosen: shuffled_cross_stimuli[current_stimulus_index - 1].stimulus,
          stimulus_name: shuffled_cross_stimuli[current_stimulus_index - 1].name
        };
      },
      on_finish: function(data) {
        // Append the chosen stimulus to the stimulus_choosen array
        stimulus_choosen.push(data.stimulus_chosen);
    
        // Save the updated array in the jsPsych data
        jsPsych.data.addProperties({
          stimulus_choosen: stimulus_choosen
        });
      }
};
    
/* define the stimuli of the first three test trials */
var test = {
      type: jsPsychImageKeyboardResponse,
      stimulus: function() {
        // Select the stimulus based on the current index
        var stimulus = shuffled_cross_stimuli[current_stimulus_index].stimulus;
    
        // Append the chosen stimulus to the stimulus_order array
        stimulus_choosen.push(stimulus);
    
        // Increment the counter
        current_stimulus_index++;
    
        return stimulus;
      },
      choices: "NO_KEYS", 
      trial_duration: 200,
      data: function() {
        return {
          stimulus_chosen: shuffled_cross_stimuli[current_stimulus_index - 1].stimulus,
          stimulus_name: shuffled_cross_stimuli[current_stimulus_index - 1].name
        };
      },
      on_finish: function(data) {
        // Append the chosen stimulus to the stimulus_choosen array
        stimulus_choosen.push(data.stimulus_chosen);
    
        // Save the updated array in the jsPsych data
        jsPsych.data.addProperties({
          stimulus_choosen: stimulus_choosen
        });
      }
};
    
////////////////////
/* Critical Trial */
////////////////////
      
// Define an array to store all selected positions
var selected_positions = [];
      
// Define possible positions for the unexpected stimulus
// In this case, this corresponds to an eccentricity of approximately 5 degrees of visual angle
var positions = [
      {name: 'TopLeft', top: -135, left: -135},   
      {name: 'TopRight', top: -135, left: 135},   
      {name: 'BottomLeft', top: 135, left: -135}, 
      {name: 'BottomRight', top: 135, left: 135}
];

var critical_trial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function() {
        // Select the stimulus based on the current index
        var stimulus = shuffled_cross_stimuli[current_stimulus_index].stimulus;
    
        // Append the chosen stimulus to the stimulus_order array
        stimulus_choosen.push(stimulus);
    
        // Increment the counter
        current_stimulus_index++;
    
        // Randomly select a position from the positions array
        var selectedPosition = jsPsych.randomization.sampleWithoutReplacement(positions, 1)[0];
    
        // Save the selected position in the selected_positions array
        selected_positions.push(selectedPosition);
    
        // Center coordinates of the cross
        var crossCenterX = window.innerWidth / 2;
        var crossCenterY = window.innerHeight / 2;
    
        // Define the position of the unexpected stimulus US relative to the cross
        var USLeft = selectedPosition.left - 13; // Adjust for half the image width
        var USTop = selectedPosition.top - 13; // Adjust for half the image height 
    
        // Create the HTML for the trial
        // You have to write in the last line of this var the unexpected stimulus you want to display during the critical trial
        var html = `
            <div style="position: relative; width: 100%; height: 100%;background-color: #959595;">
            <img src="${stimulus}" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <img src="img/circle.png" style="position: absolute; left: ${USLeft}px; top: ${USTop}px; width: 25px; height: 25px;"> 
            </div>
        `;
        return html;
      },
      choices: "NO_KEYS",
      trial_duration: 200,
      data: function() {
        return {
            stimulus_choosen: shuffled_cross_stimuli[current_stimulus_index - 1].stimulus,
            stimulus_name: shuffled_cross_stimuli[current_stimulus_index - 1].name,
            position_choosen: selected_positions[selected_positions.length - 1].name,
        };
      },
      on_finish: function(data) {
        // Append the chosen stimulus to the stimulus_choosen array
        stimulus_choosen.push(data.stimulus_chosen);
    
        // Append the selected position to the selected_positions array
        var selectedPosition = positions.find(pos => pos.name === data.position_chosen);
        if (selectedPosition) {
          selected_positions.push({
            name: data.position_chosen,
            top: selectedPosition.top,
            left: selectedPosition.left
          });
        }
    
        // Save the updated arrays in the jsPsych data
        jsPsych.data.addProperties({
          stimulus_choosen: stimulus_choosen,
          selected_positions: selected_positions
        });
      }
};
    
//////////////////////
/* Trials timelines */
//////////////////////
      
// Timeline of the first training trial
var training = {
        timeline: [launch_trial, fix_square, training_trials, mask, line_question],
        repetitions: 2
};
      
// Timeline of the first six test trials
var trials_1_to_3_procedure = {
        timeline: [launch_trial,fix_square, test, mask, line_question],
        repetitions: 3
};
      
// Timeline of the critical trial
var critical_trial_procedure = {
        timeline: [launch_trial, fix_square, critical_trial, mask, line_question, detection_question, localisation_question, confidence_detection, confidence_localisation, identification_question, confidence_identification]
};
      
//Timeline of the buffer trials
var buffer_trials= {
        timeline: [launch_trial, fix_square, test, mask, line_question],
        repetitions: 2
};
    
//Timeline of the bias trial 
var bias_trial_procedure = {
      timeline: [
        launch_trial,
        fix_square,
        test,
        mask,
        line_question,
        detection_question,
        {
          timeline: [
            localisation_question,
            confidence_detection,
            confidence_localisation,
            identification_question,
            confidence_identification
          ],
          conditional_function: function() {
            // Get the response to the detection question
            var last_trial_data = jsPsych.data.get().last(1).values()[0];
            console.log("Last trial data:", last_trial_data); // Log the last trial data for debugging
    
            var last_response = last_trial_data.response.detection;
            console.log("Detection response:", last_response); // Log the response for debugging
    
            // Return true if the response was "oui", false otherwise
            return last_response === "oui";
          }
        },
        {
          timeline: [confidence_detection],
          conditional_function: function() {
            // Get the response to the detection question
            var last_trial_data = jsPsych.data.get().last(1).values()[0];
            console.log("Last trial data:", last_trial_data); // Log the last trial data for debugging
    
            var last_response = last_trial_data.response.detection;
            console.log("Detection response:", last_response); // Log the response for debugging
    
            // Return true if the response was "non", false otherwise
            return last_response === "non";
          }
        }
      ]
};
    
    
//Timeline of the divided attention trial 
var divided_trial_procedure = {
        timeline: [launch_trial, fix_square, critical_trial, mask, line_question, detection_question, localisation_question, confidence_detection, confidence_localisation, identification_question, confidence_identification]
};
      
//Timeline of the full attention trial 
var full_trial_procedure = {
        timeline: [launch_trial, fix_square, critical_trial, mask, detection_question, localisation_question, confidence_detection, confidence_localisation, identification_question, confidence_identification]
};
      
////////////////////////////
/** Instructions screens **/
////////////////////////////
      
// Define welcome screen
var welcome = {
      type: jsPsychInstructions,
      pages: [
        `
          <style>
              h1 {text-align: center;}
              p {font-size: 18px;} /* Increase the font size of paragraphs */
          </style>
          <h1 style="text-align: center; margin-top: 20px;"> Welcome!</h1>
          <div style="margin: 0 180px; text-align: center;">
            <p> For compatibility and display quality reasons, <strong> this experiment must be conducted on a desktop or laptop computer. </strong>
            <p> We also ask you to <strong> have a card such as a bank card </strong> (or a card of similar size, such as a loyalty card, health card, etc.) <strong> or a ruler.</strong> At the beginning of the experiment, you will need to place one of these objects on the screen to adjust the display size of the images and determine the distance at which you are positioned relative to the screen. <br> </p>
            <p> Once you have a card or a ruler, please press the <strong>Start the experiment</strong> button.
          </div>
        `
      ],
      show_clickable_nav: true,
      allow_backward: false,
      button_label_next: `Start the experiment`
};

      
// Enter Fullscreen Mode
var enter_fullscreen = {
          type: jsPsychFullscreen,
          message: `
            <div style="margin: 0 250px; text-align: left; font-size: 20px;">
              <h1 style="text-align: center;">Enter Fullscreen Mode</h1>
              <p> We invite you to perform the following actions:</p>
              <ul style="list-style-type: none; padding: 0;">
                <li style="padding-left: 5px;">&#x2192; Close all other tabs currently open in your browser,</li>
                <li style="padding-left: 5px;">&#x2192; Close all other applications currently open on your computer.</li>
              </ul>
              <p><strong>Once these actions are completed, please click the button below to enter fullscreen mode.</strong></p>
            </div>
          `,
          button_label: 'Enter Fullscreen Mode',
          fullscreen_mode: true
};
      
// Gender questionnaire
var gender_questionnaire = {
        type: jsPsychSurveyHtmlForm,
        preamble: "<h2 style='text-align: center;'>Gender</h2><p style='text-align: center; font-size: 24px;'>Please indicate your gender:</p>",
        html: `
          <div style="text-align: left; display: flex; flex-direction: column; align-items: flex-start; margin: 0 auto;">
            <label style="display: flex; align-items: center; font-size: 20px;"><input type="radio" name="gender" value="Female" required> Female</label>
            <label style="display: flex; align-items: center; font-size: 20px;"><input type="radio" name="gender" value="Male" required> Male</label>
            <label style="display: flex; align-items: center; font-size: 20px;"><input type="radio" name="gender" value="Other" required> Other</label>
            <label style="display: flex; align-items: center; font-size: 20px;"><input type="radio" name="gender" value="Prefer not to answer" required> Prefer not to answer</label>
          </div>
          <div style="height: 20px;"></div>
        `,
        button_label: "Continue",   
        on_finish: function(data) {
          data.gender = data.response.gender;
      }
};
      
// Age questionnaire
var age_questionnaire = {
        type: jsPsychSurveyHtmlForm,
        preamble: "<h2 style='text-align: center;'>Âge</h2><p style='text-align: center; font-size: 18px;'>Veuillez indiquer votre âge :</p>",
        html: `
          <div style="text-align: center; display: flex; flex-direction: column; align-items: center; margin: 0 auto;">
            <label style="display: flex; flex-direction: column; align-items: center; font-size: 18px;">
              <input type="text" name="age" pattern="\\d*" required style="text-align: center; width: 100px; height: 30px; font-size: 20px;">
            </label>
          </div>
          <div style="height: 20px;"></div>
        `,
        button_label: "Continuer",
        on_finish: function(data) {
            data.age = data.response.age;
        }
};

// Question asking participants on which device they used to complete the experiment
var device_question = {
  type: jsPsychSurveyHtmlForm,
  preamble: `
  <h2 style='text-align: center;'>Device used</h2>
  <p style='text-align: center; font-size: 20px; margin: 0 auto; max-width: 950px;'>
  <p style='margin-bottom: 20px;'> Please indicate which of the following devices you used to participate in this experiment:</p>
  `,
  html: `
      <div style="text-align: center; display: flex; flex-direction: column; align-items:flex-start; margin: 0 auto; width: 30%;">
      <label style="display: flex; align-items: center; font-size: 18px;"><input type="radio" name="device" value="A laptop" required> A laptop</label>
      <label style="display: flex; align-items: center; font-size: 18px;"><input type="radio" name="device" value="A desktop computer" required> A desktop computer</label>
      <label style="display: flex; align-items: center; font-size: 18px;"><input type="radio" name="device" value="A mobile phone" required> A mobile phone</label>
      <label style="display: flex; align-items: center; font-size: 18px;"><input type="radio" name="device" value="A tablet" required> A tablet</label>
      <label style="display: flex; align-items: center; font-size: 18px;"><input type="radio" name="device" value="Other" required> Other</label>
    </div>
    <div style="height: 20px;"></div>
  `,
  button_label: "Continue",
  on_finish: function(data) {
    console.log("Device Response:", data.response.device); // Verify the device response
    data.device = data.response.device;
}
};
      
// Distance screen instructions
var distance_instruction = {
          type: jsPsychInstructions,
          pages: [ `
            <style>
                h1 {
                    text-align: center;
                }
                .instruction-text {
                    text-align: justify;
                    margin: 0 250px;
                    font-size: 26 px; /* Increase text size */
                    line-height: 1.6; /* Increase line spacing */
                }
            </style>
            <h1 style="text-align: center; margin-top: 20px;">Distance between your eyes and the screen</h1>
            <div class="instruction-text" style="margin: 0 150px; max-width: 900px; font-size: 20px;">
              <p> To ensure optimal visualization of the lines that will be presented to you, <strong> please position yourself approximately 60 cm away from the screen</strong>. 
              This distance corresponds approximately to the length of your outstretched arm in front of you, without extending your shoulder, with the palm of your hand resting on the screen. </p>
              <p> On the next page, you will perform two quick maneuvers to verify that your eyes are at the correct distance from the screen, <strong> a distance you will need to maintain for the rest of the experiment.</strong> </p>
              <p> Before continuing, please have a card such as a bank card (or a loyalty card, health card, etc.) or a ruler.</p>
            </div>
          `
          ],
          show_clickable_nav: true,
          allow_backward: false,
          button_label_next: 'Continue'
};

// Define general task instructions
var general_instruction = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <style>
            h1 {
                text-align: center;
            }
            .instruction-text {
                text-align: justify;
                margin: 0 250px;
                font-size: 18px; 
            }
            body {
                background-color: #959595;
            }
        </style>
        <h1 style="text-align: center; margin-top: 20px;">General instructions for the experiment</h1>
        <div class="instruction-text" style="margin: 0 150px; max-width: 800px;">
          <p> You will now perform a task of perception and estimation of line lengths.</p>
          <p> Each trial will proceed as follows:</p>
          <p> First, you will need to focus your gaze on the square that will appear in the center of the screen. <br>
          Then, a cross composed of a vertical line and a horizontal line will briefly appear. Your task will be to indicate, at the end of each trial, which of the two lines seems longer by pressing the key:</p>
          <p>
            - « <strong>v</strong> » if the vertical line (|) seemed longer than the horizontal line (—),<br>
            - « <strong>n</strong> » if the horizontal line (—) seemed longer than the vertical line (|).
          </p>
          <p>The keys to press will be reminded at the end of each trial.<br>
          When you are ready, press the <strong>SPACE</strong> key to start with two training trials to familiarize yourself with the task.</p>
        </div>
      `,
      choices: [' '],
};

// Translated instructions for the chinrest
var chinrest = {
        type: jsPsychVirtualChinrest,       
        blindspot_reps: 3,
        resize_units: "cm",
        pixels_per_unit: 38,
};

// Start of the test block instructions
var test_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <style>
              h1 {
                  text-align: center;
                  margin-top: 20px;
              }
              .justified-text {
                  text-align: justify;
                  margin: 0 150px;
                  max-width: 800px;
              }
          </style>
          <h1>Test phase</h1>
          <div class="justified-text">
            <p>You have completed the training phase.</p>
            <p>Please press the <strong>SPACE</strong> key on your keyboard to start the test phase.</p>
          </div>
        `,
        choices: [' '],
};

// Instructions for the full attention trial
var full_attention_trial_instructions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
          <style>
              h1 {
                  text-align: center;
                  margin-top: 20px;
              }
              .justified-text {
                  text-align: justify;
                  margin: 0 150px;
                  max-width: 800px;
              }
          </style>
          <h1>Change of instructions</h1>
          <div class="justified-text">
            <p>For this last trial, we ask you to observe the entire screen without comparing the lengths of the two lines.</p>
            <p>Please press the <strong>SPACE</strong> key on your keyboard to start the last trial.</p>
          </div>
        `,
        choices: [' '],
};



// Final message for participants
var successful_message = {
  type: jsPsychSurveyHtmlForm,
  html: `
        <div style="text-align: center; font-size: 20px; margin: 0 auto; max-width: 900px;">
        <h2>Thank you for your participation!</h2>
        <div class="debriefing-container" style="text-align: left; display: flex; flex-direction: column; align-items: flex-start; margin: 0 auto; max-width: 800px;">
        <p style="font-size: 20px; margin-top: 20px;"> Please click the "Finish the experiment" button and leave this window open until you are automatically redirected to Prolific to ensure your participation is recorded.</p>
        <p style="font-size: 20px; margin-top: 20px;">If you have any questions or comments, you can contact us at the following email address: katarina.pavic@uca.fr</p>
        </div>
  `,
  button_label: "Finish the experiment"
};

// Uncomment this part to finish the connection with Pavlovia and redirect to Prolific
/*
var pavlovia_finish = {
  type: jsPsychPavlovia,
  command: "finish",
  on_finish: function (){
    document.body.innerHTML = `<p> Please wait. You will be redirected back to Prolific in a few moments. 
    If you get a pop-up warning you "data may not be saved", you can click "leave", your data have already been saved.</p>`;
    setTimeout(function () {
      location.href = "https://app.prolific.co/submissions/complete?cc=XXXXXX";
      document.body.innerHTML =`<p>If you are not automatically redirected, please click here: 
      <a href="https://app.prolific.co/submissions/complete?cc=XXXXXX">https://app.prolific.co/submissions/complete?cc=XXXXXX</a></p>
      <p>If you get a pop-up warning you "data may not be saved", you can click "leave", your data have already been saved.</p>`;
    }, 5000);
  }
};
*/

//  timeline.push(pavlovia_init);
    timeline.push(preload);
    timeline.push(browserCheck);
    timeline.push(welcome);
    timeline.push(gender_questionnaire);
    timeline.push(age_questionnaire);
    timeline.push(device_question);
    timeline.push(enter_fullscreen);
    timeline.push(chinrest);
    timeline.push(general_instruction);
    timeline.push(training);
    timeline.push(test_instructions);
    timeline.push(trials_1_to_3_procedure);
    timeline.push(critical_trial_procedure);
    timeline.push(buffer_trials);
    timeline.push(bias_trial_procedure);
    timeline.push(divided_trial_procedure);
    timeline.push(full_attention_trial_instructions);
    timeline.push(full_trial_procedure);
    timeline.push(successful_message);
    //timeline.push(pavlovia_finish);

    /* start the experiment */
    jsPsych.run(timeline);