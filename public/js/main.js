$(document).ready(function(){
    var $form = $('form');
    var $users = $('#users');
    var $input = $('input#msg');
    var $messages = $('div#messages');
    var messages_height = 0;
    var username_color='#1BBC9B';
    var username;
    var addMessage = function (data){
        html = '<span class="username" style="color: '+username_color+'">'+data.username+'</span>';
        html += '<span class="message">'+data.message+'</span>';
        $messages.append('<div class="message">'+html+'</div>');
        last_message_height = $('div.message').last().outerHeight();
        messages_height += last_message_height;
        $messages.scrollTop(messages_height);
    }

    var setUserOnline = function(online_username) {
        var html = '<span class="glyphicon glyphicon-cloud online"></span>';
        if(online_username == username){
            html += '<span><b>'+online_username+'</b></span>';
        }else{
            html += '<span>'+online_username+'</span>';
        }
        $users.append('<div class="user" data='+online_username+'>'+html+'</div>');
        console.log(username, online_username, online_username == username);
    }

    var removeUser = function(offline_username) {
        $('[data='+offline_username+']').remove();
    }

    var socket = io.connect('http://localhost:3000');

    socket.on('connect', function(data){
        username = prompt('What is your username: ');
        socket.emit('join', username);
    });

    socket.on('userDisconnect', function(username){
        removeUser(username);
    });
    socket.on('newClient', function(data){
        setUserOnline(data);
    });

    socket.on('message', function(data){
        addMessage(data);
    });

    socket.on('messageSuccess', function(data){
        $input.val('');
        addMessage({username: username, message: data});
    });

    $form.on('submit', function(e){
        e.preventDefault();
        message = $input.val()
        socket.emit('message', message);
    });
});

