import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { createUser } from './rest';

let user;

$(() => {
    $("#registerWithEmail").on('click', () => {
        user = {
            email: $('#emailInputReg').val(),
            nickName: $('#userInputReg').val(),
            password: $('#passwordInputReg').val()
        }
        createUser(user);
    })
})



