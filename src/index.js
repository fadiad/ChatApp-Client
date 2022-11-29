import $ from 'jquery'
import { saveUserInfo, addProfileRegistered, currentUser, loadProfileByToken, saveToExport, loadRegisteredUserList, token, logout, addSuccessLabel2, addErrorLabel2, logoutGuest, addSuccessLabel, addErrorLabel, login, createUser, loginAsGuest, loadUserList } from './rest';
import { openConnection, sendPlainMessage, stompClient } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




$(() => {


  if (sessionStorage.getItem("token") == null) {
    document.getElementById("send-btn").disabled = true;
    document.getElementById("export-btn").disabled = true;
    document.getElementById("profilePage").style.display = "none";
  }

  let token = sessionStorage.getItem("token");

  var myVar
  function showList() {
    loadUserList();
    myVar = setTimeout(showList, 10000);
  }
  function stopFunction() {
    clearTimeout(myVar); // stop the timer
  }
  $(document).ready(function () {
    showList();
  });



  $("#signinBtnGuest").on('click', () => {
    let user = {
      nickName: $('#userInput').val()
    }

    if ($('#userInput').val() == '')
      addErrorLabel("Please Enter Nickname First.");
    else {
      loginAsGuest(user);
    }


  })

  $("#send-btn").on("click", () => {
    console.log(sessionStorage.getItem("nickName"), $('#message-input').val());
    sendPlainMessage(sessionStorage.getItem("nickName"), $('#message-input').val())
  })


  $("#export-btn").on("click", () => {
    saveToExport();
  })
})

function disableSignin() {

  document.getElementById("emailInput").disabled = true;
  document.getElementById("passwordInput").disabled = true;
  document.getElementById("signinBtn").disabled = true;
  document.getElementById("userInput").disabled = true;
  document.getElementById("signinBtnGuest").disabled = true;
  document.getElementById("toRegister").style.visibility = 'hidden';
}


function disableSignup() {
  document.getElementById("emailInputReg").disabled = true;
  document.getElementById("passwordInputReg").disabled = true;
  document.getElementById("userInputReg").disabled = true;
  document.getElementById("registerWithEmail").disabled = true;
}

let user;
$(() => {
  $("#signinBtn").on('click', () => {
    user = {
      email: $('#emailInput').val(),
      password: $('#passwordInput').val()
    }
    if ($('#emailInput').val() == '')
      addErrorLabel2("Please Enter Email First.");
    else if ($('#passwordInput').val() == '') {
      addErrorLabel2("Please Enter Password First.");
    }
    else {
      login(user);
    }
  })
})

let user2;

$(() => {
  $("#registerWithEmail").on('click', () => {
    user2 = {
      email: $('#emailInputReg').val(),
      nickName: $('#userInputReg').val(),
      password: $('#passwordInputReg').val()
    }
    createUser(user2);
  })
})


$(document).ready(function () {
  $(document).on("click", "#logoutG", function () {
    logoutGuest($('#userInput').val());
  })
});

$(document).ready(function () {
  $(document).on("click", "#logout", function () {
    logout(sessionStorage.getItem("token"));
    // document.getElementById("profilePage").style.display = "none";
    // document.getElementById("profileSection").innerHTML="";
    //
  })
});

if (sessionStorage.getItem("token") != null) {
  addProfileRegistered(sessionStorage.getItem("token"));
}

$(document).ready(function () {
  $(document).on("click", "#profile", function () {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("profilePage").style.display = "flex";
    document.getElementById("successLbl3").innerHTML = "";
    document.getElementById("errorLbl3").innerHTML = "";


    var image = document.getElementById('output').disabled = false;
    document.getElementById("image_input").disabled = false;
    document.getElementById("saveProfile").style.visibility = "visible";
    document.getElementById("statuses").disabled = false;


    document.getElementById("pro-nickName").disabled = false;
    document.getElementById("pro-firstName").disabled = false;
    document.getElementById("pro-lastName").disabled = false;
    document.getElementById("pro-email").disabled = false;
    document.getElementById("pro-birthday").disabled = false;
    document.getElementById("pro-desc").disabled = false;
    document.getElementById("pro-age").disabled = false;

    document.getElementById("isPublic").disabled = false;
    document.getElementById("isPrivate").disabled = false;

    loadProfileByToken(currentUser);
  })
});

$(document).ready(function () {
  $(document).on("change", "#pro-birthday", function () {
    var today = new Date();
    var birthDate = new Date(document.getElementById("pro-birthday").value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    document.getElementById("pro-age").value = age;
    console.log(age);
  });
});


$(document).ready(function () {
  $(document).on("click", "#cancelProfile", function () {
    document.getElementById("mainPage").style.display = "block";
    document.getElementById("profilePage").style.display = "none";
  });
});

$(document).ready(function () {
  $(document).on("click", "#saveProfile", function () {
    currentUser.nickName = document.getElementById("pro-nickName").value;
    currentUser.firstName = document.getElementById("pro-firstName").value;
    currentUser.lastName = document.getElementById("pro-lastName").value;
    currentUser.birthDate = document.getElementById("pro-birthday").value;
    currentUser.description = document.getElementById("pro-desc").value;
    currentUser.age = document.getElementById("pro-age").value;
    currentUser.imgUrl = document.getElementById('output').src;
    currentUser.status = document.getElementById("statuses").value;
    if (document.getElementById("isPublic").checked)
      currentUser.private = false;
    else
      currentUser.private = true;

    saveUserInfo(currentUser);
  });
});

openConnection();
export { disableSignin, disableSignup }