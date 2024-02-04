function getCurrentTimestamp() {
	return new Date();
}

function renderMessageToScreen(args) {
	let displayDate = (args.time || getCurrentTimestamp()).toLocaleString('en-IN', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});
	let messagesContainer = $('.messages');
	let tx =args.text;
	let message = $(`
	<li class="message ${args.message_side}">
		<div class="avatar"></div>
		<div class="text_wrapper">
			<div class="text">${tx}</div>
			<div class="timestamp">${displayDate}</div>
		</div>
	</li>
	`);

	messagesContainer.append(message);

	setTimeout(function () {
		message.addClass('appeared');
	}, 0);
	messagesContainer.animate({ scrollTop: messagesContainer.prop('scrollHeight') }, 300);
}


$(document).ready(function() {
    $('#msg_input').keydown(function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $('#send_button').click();
        }
    });
});


function showUserMessage(message, datetime) {
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'right',
	});
}

function showBotMessage(message, datetime) {
	// console.log(message);
	renderMessageToScreen({
		text: message,
		time: datetime,
		message_side: 'left',
	});
}


    $('#send_button').on('click', function (e) {
        var user_input = $('#msg_input').val();

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/predict_intent',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({ 'user_input': user_input }),
            success: function (data) {
                var response = data.response;
                showBotMessage(response);							// Display the response on the screen
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });

        showUserMessage(user_input);

        $('#msg_input').val('');
    });

$(window).on('load', function () {
	showBotMessage('Hello there! Type in a message.');
});