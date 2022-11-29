import $ from 'jquery'
import {loadProfileByToken,token} from './rest';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


$(() => {
    loadProfileByToken(token);
  })