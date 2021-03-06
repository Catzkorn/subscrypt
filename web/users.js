const atSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207">
                    </path>
                </svg>`

const userSvg =   `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                    </path>
                  </svg>`

const pencilSvg = `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>`

function loadUser() {
  _getUser(_showUser);
}

function _getUser(callback) {
  let xhttp = new XMLHttpRequest();
  let path = '/api/users';
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      let user = JSON.parse(xhttp.responseText);
      callback(user);
    }
  };
  xhttp.open("GET", path, true);
  xhttp.send();
}

function _showUser(user) {
  let newUserHTML = "";
  let existingUserHTML = "";
  if (user != null) {
    existingUserHTML = _formatUser(user);
    loadSubscriptions();
  } else {
    newUserHTML = _newUserForm();
  }
  document.getElementById("new-user").innerHTML = newUserHTML;

  document.getElementById("existing-user").innerHTML = existingUserHTML;
}

function _formatUser(user) {
  return `
    <h3>Welcome back</h3>
    <form class="form-inline">
      <div class="form-group">
        <label for="user-name" class="col-form-label col-form-label-mdt"><span class="icon icon-light">${userSvg}</span></label>
        <input type="text" readonly class="form-control-plaintext form-control-md input-light" id="user-name" value="${user.Name}">
        <label for="email" class="col-form-label col-form-label-md"><span class="icon icon-light">${atSvg}</span></label>
        <input type="email" readonly class="form-control-plaintext form-control-md input-light" id="email" value="${user.Email}">
        ${_formatEditUserButton(user)}
      </div>
    </form>
  `;
}

function _formatEditUserButton(user) {
  return `<button type="button" class="icon-button icon-light" id="edit-user-button" onclick="showEditUserForm('${user.Name}', '${user.Email}')">` +
          pencilSvg +
          `</button>`;
}

function _newUserForm() {
  let newUserForm = `<div class="card mx-auto justify-content-center" id='new-user-form'>` +
                      `<div class="card-body">` +
                        `<h5 class="card-title text-center new-user pb-3">Welcome! Enter your details</h5>` +
                        `<form class="row" id="user-form">
                            <div class="form-group row justify-content-center new-user">
                                <label for="user-name" class="col- col-form-label col-form-label-md ml-4"><span class="icon icon-light">${userSvg}</span></label>
                                  <div class="col">
                                      <input type="text" class="form-control form-control-md input-dark" id="user-name" placeholder="Name">
                                  </div>
                                 <label for="email" class="col- col-form-label col-form-label-md ml-4"><span class="icon icon-light">${atSvg}</span></label>
                                <div class="col">
                                    <input type="email" class="form-control form-control-md input-dark" id="email" placeholder="Email">
                                </div>
                                <div class="col-2">
                                    <button type="button" class="btn btn-primary mr-5" id="create-user-button" onclick="createUser()">Submit</button>
                                </div>
                            </div>
                        </form>` +
                      "</div>" +
                    "</div>"
  return newUserForm
}

function _formatUserForm() {
  let userForm = `
    <form class="form-inline" id="user-form">
      <div class="form-group">
        <label for="user-name" class="col-form-label col-form-label-md"><span class="icon icon-light">${userSvg}</span></label>
        <input type="text" class="form-control form-control-md input-active input-light" id="user-name" placeholder="Name">
        <label for="email" class="col-form-label col-form-label-md"><span class="icon icon-light">${atSvg}</span></label>
        <input type="text" class="form-control form-control-md input-active input-light" id="email" placeholder="Email">
        <button type="button" class="btn btn-primary" id="create-user-button" onclick="createUser()">Submit</button>
      </div>
    </form>
`;

  return userForm;
}

function showEditUserForm(name, email) {
  let editUserFormHTML = "<h3>Welcome back</h3>"
  editUserFormHTML += _formatUserForm();
  document.getElementById("existing-user").innerHTML = editUserFormHTML;
  document.getElementById("user-name").value = name;
  document.getElementById("email").value = email;
}


function createUser() {
  let name = document.getElementById('user-name').value;
  let email = document.getElementById('email').value;

  if (validateUserValues(name, email) == false) {
    return;
  }

  let xhttp = new XMLHttpRequest();
  let url = "/api/users";
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      loadUser();
    }
  };
  let data = JSON.stringify({ "name": name, "email": email });
  xhttp.send(data);
}

function validateUserValues(name, email) {
  if (name == "" || email == "") {
    document.getElementById("user-error").innerHTML = "Please enter user details";
    return false;
  } else {
    return true;
  }
}