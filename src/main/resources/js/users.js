$(document).ready(function() {
    function onHashChange() {
        var hash = window.location.hash;

        if (hash) {
            $(`[data-toggle="tab"][href="${hash}"]`).trigger('click');
        }
    }

    window.addEventListener('hashchange', onHashChange, false);
    onHashChange();
});

$(async function () {
    await getUsersTable();
    getUserModal();
    addNewUser();
    getSingleUserTable();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },

    getAllUsers: async () => await fetch('api/users'),
    getOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    editUser: async (user, id) => await fetch(`api/users/${id}`, {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head}),
    getCurrentUser: async () => await fetch('api/username')
}

async function getUsersTable() {
    let table = $('#mainUsersTable tbody');
    table.empty();


    await userFetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFill = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>`;
                let roles = user.roles;
                roles.forEach(role => {
                    tableFill += `<a>${role.name} </a>`;
                })
                tableFill += `</td>
                         <td>
                            <button type="button" data-userid="${user.id}" data-action="edit"
                            class="btn btn-info" data-toggle="modal" data-target="#userModal">Edit</button>
                        </td>
                         <td>
                            <button type="button" data-userid="${user.id}" data-action="delete"
                            class="btn btn-danger" data-toggle="modal" data-target="#userModal">Delete</button>
                        </td>
                    </tr>
                    )`;
                table.append(tableFill);
            })
        })

    $("#mainUsersTable").find('button').on('click', (event) => {
        let userModal = $('#userModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        userModal.attr('data-userid', buttonUserId);
        userModal.attr('data-action', buttonAction);
        userModal.modal('show');
    })
}



async function getUserModal() {
    $('#userModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userId = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userId);
                break;
            case 'delete':
                deleteUser(thisModal, userId);
                break;
        }
    }).on("hidden.bs.modal", (event) => {
        let thisModal = $(event.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let prevUser = await userFetchService.getOneUser(id);
    let user = prevUser.json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let editButton = `<button class="btn btn-info" id="editButton">Edit</button>`;

    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);


    user.then(user => {
        let bodyForm = `<form class="form-group" id="editUser">
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="id" class="form-label font-weight-bold">ID</label>
                                    <input type="text" class="form-control" id="id" name="id" value="${user.id}" readonly>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="firstName" class="form-label font-weight-bold">First name</label>
                                    <input type="text" class="form-control" id="firstName" value="${user.firstName}" placeholder="First Name">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="lastName" class="form-label font-weight-bold">Last name</label>
                                    <input type="text" class="form-control" id="lastName" value="${user.lastName}" placeholder="Last Name">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="age" class="form-label font-weight-bold">Age</label>
                                    <input type="number" class="form-control" id="age" value="${user.age}" placeholder="0">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="email" class="form-label font-weight-bold">Email</label>
                                    <input type="email" class="form-control" id="email" value="${user.email}" placeholder="example@mail.com">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="password" class="form-label font-weight-bold">Password</label>
                                    <input type="password" class="form-control" id="password">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="role" class="form-label font-weight-bold">Role</label>
                                    <select class="form-select col" size="2"  multiple aria-label="multiple select" id="role">
                                        <option value="ROLE_ADMIN">ADMIN</option>
                                        <option value="ROLE_USER" selected>USER</option>
                                    </select>
                                </div>
                            </div>
                        </form>`;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let firstName = modal.find("#firstName").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let role= modal.find("#role option:selected").val().trim();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            role: role
        }
        const response = await userFetchService.editUser(data, id);

        if (response.ok) {
            getUsersTable();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let prevUser = await userFetchService.getOneUser(id);
    let user = prevUser.json();

    modal.find('.modal-title').html('Delete user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;
    let deleteButton = `<button class="btn btn-info" id="deleteButton">Delete</button>`;

    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let bodyForm = `<form class="form-group" id="deleteUser">
                            <fieldset disabled>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="id" class="form-label font-weight-bold">ID</label>
                                    <input type="text" class="form-control" id="id" name="id" value="${user.id}" readonly>
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="firstName" class="form-label font-weight-bold">First name</label>
                                    <input type="text" class="form-control" id="firstName" value="${user.firstName}" placeholder="First Name">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="lastName" class="form-label font-weight-bold">Last name</label>
                                    <input type="text" class="form-control" id="firstName" value="${user.lastName}" placeholder="Last Name">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="age" class="form-label font-weight-bold">Age</label>
                                    <input type="number" class="form-control" id="firstName" value="${user.age}" placeholder="0">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="email" class="form-label font-weight-bold">Email</label>
                                    <input type="text" class="form-control" id="email" value="${user.email}" placeholder="example@mail.com">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="password" class="form-label font-weight-bold">Password</label>
                                    <input type="password" class="form-control" id="password">
                                </div>
                            </div>
                            <div class="row justify-content-center">
                                <div class="mb-3 col-md-7">
                                    <label for="role" class="form-label font-weight-bold">Role</label>
                                    <select class="form-select col" size="2"  multiple aria-label="multiple select" id="role">
                                        <option value="ROLE_ADMIN">ADMIN</option>
                                        <option value="ROLE_USER">USER</option>
                                    </select>
                                </div>
                            </div>
                            </fieldset>
                        </form>`;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#deleteButton").on('click', async () => {
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            getUsersTable();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function addNewUser() {
    $("#addNewUserButton").on('click', async () => {
        let addUserForm = $('#newUserForm');
        let firstName = addUserForm.find('#newFirstName').val().trim();
        let lastName = addUserForm.find('#newLastName').val().trim();
        let age = addUserForm.find('#newAge').val().trim();
        let email = addUserForm.find('#newEmail').val().trim();
        let password = addUserForm.find('#newPassword').val().trim();
        let role = addUserForm.find('#newRole option:selected').val().trim();
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            role: role
        };
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getUsersTable();
            addUserForm.find('#newFirstName').val('');
            addUserForm.find('#newLastName').val('');
            addUserForm.find('#newAge').val('');
            addUserForm.find('#newEmail').val('');
            addUserForm.find('#newPassword').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="messageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert);
        }
    })
}

async function getSingleUserTable() {
    let table = $('#userPanelTable tbody');
    table.empty();

    await userFetchService.getCurrentUser()
        .then(res => res.json())
        .then(user => {
            let tableFill = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>`;
            let roles = user.roles;
            roles.forEach(role => {
                tableFill += `<a>${role.name} </a>`;
            })
            tableFill += `</td>
                    </tr>
                    )`;
            table.append(tableFill);
        })
}