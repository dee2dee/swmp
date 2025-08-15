$(document).ready(function() {
    $('#sidebarCollapse').on('click', function(){
        $('#sidebar').toggleClass('collapsed');
        $('#content').toggleClass('expanded');
    });

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const currentPath = window.location.pathname;

    sidebarItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });

    sidebarItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            sidebarItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            const targetHref = this.getAttribute('href');
                if (targetHref === '/auth/dashboard') {
                    window.location.href = '/auth/dashboard';
                } else if (targetHref === '/auth/managemen-ticket') {
                window.location.href = '/auth/managemen-ticket';
                } else if (targetHref === '/auth/transaction-report') {
                    window.location.href = '/auth/transaction-report';
                } else if (targetHref === '/auth/visitor-report') {
                    window.location.href = '/auth/visitor-report';
                } else if (targetHref === '/auth/setting') {
                    window.location.href = '/auth/setting';
                }
            });
        });


   
    $('#editBdtModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var id = button.data('id');
            var title = button.data('title');
            var fileUploadPath  = button.data('fileupload');

            console.log("File path for modal:", fileUploadPath);
            
            var modal = $(this);
            modal.find('#editBdtlID').val(id);
            modal.find('#editBdtTitle').val(title);

        });

    $('#saveBdtChanges').on('click', function(e) {
        e.preventDefault();

        var isValid = true;

        var id = $('#editBdtlID').val();
        var title = $('#editBdtTitle').val();
        var fileInput = $('#bdtEdUploadFile')[0];

        $('#editBdtForm input').each(function () {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').hide();
        });

        if (title.trim() === '') {
            isValid = false;
            $('#editBdtTitle').addClass('is-invalid');
            $('#editBdtTitle').siblings('.invalid-feedback').show();
        }

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var maxSize = 2 * 1024 * 1024;
            var allowedExtensions = ['pdf', 'docx', 'xlsx', 'txt'];

            if (file.size > maxSize) {
                isValid = true;
                $('#bdtEdUploadFile').addClass('is-invalid');
                $('#bdtEdUploadFile').siblings('.invalid-feedback').text('File must be less than 2MB.').show();
            }

            var fileExtension = file.name.split('.').pop().toLowerCase();
            if (!fileExtension.includes(fileExtension)) {
                isValid = true;
                $('#bdtEdUploadFile').addClass('is-invalid');
                $('#bdtEdUploadFile').siblings('.invalid-feedback').text('File must be in PDF, DOCX, XLSX, or TXT format.').show();
            }

        }

        if (!isValid) {
            return;
        }

        var formData = new FormData();
        formData.append("id", id);
        formData.append("title", title);

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            formData.append("fileupload", fileInput.files[0]);
        }

        
        $.ajax({
            url: '/bankdata/' + id,
            type: 'PUT',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $("#bdtEdSuccessAlert").text("Data changed successfully!").removeClass('d-none');
                setTimeout(function() {
                    $("#bdtEdSuccessAlert").addClass('d-none');
                    location.reload();
                }, 500);
            },
            error: function(xhr, status, error) {
                console.log("Error:", error);
                console.log("Status:", status);
                console.log("Response:", xhr.responseText);
            }
        });
    });

    $('#saveBdtChanges').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).submit();
        }
    });

    var bdtID;

    $('#deleteBdtModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        bdtID = button.data('id');
        var title = button.data('title');

        $('#deleteBdtName').text(title);
    });

    $('#confirmDelBdt').on('click', function() {
        $.ajax({
            url: '/bankdata/' + bdtID,
            type: 'DELETE',
            success: function(response) {
                console.log('Delete Response:', response);
                if (response && response.message === 'Deleted successfully') {
                    location.reload();
                } else {
                    alert('Failed to delete data.');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Failed delete data.');
                }
            });
        });

    $('#addExtPhoneModal').on('show.bs.modal', function () {
        $('#addDivName').val('');
        $('#addStafName').val('');
        $('#addExtPhone').val('');
    });

    $('#saveNewExtPhone').on('click', function(e) {
        e.preventDefault();

        var isValid = true;

        var divName = $('#addDivName').val();
        var name = $('#addStafName').val();
        var extPhone = $('#addExtPhone').val();

        $('#addExtPhoneForm input').each(function () {
            $(this).removeClass('is-invalid');
        });

        $('#addExtPhoneForm input[required]').each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
                $(this).siblings('.invalid-feedback').show();
            } else {
                $(this).removeClass('is-invalid');
                $(this).siblings('.invalid-feedback').hide();
            }
        });

        if (!isValid) {
            return;
        }

        var dataToSend = {
            div_name: divName,
            name: name,
            ext_phone: extPhone
        };

        var jsonData = JSON.stringify(dataToSend);
        console.log("JSON Data:", jsonData);

        $.ajax({
            url: '/extention',
            type: 'POST',
            contentType: 'application/json',
            data: jsonData,
            success: function(response) {
                $("#successAlertExtPhone").text(name + " Extention phone added successfully!").removeClass('d-none');
                setTimeout(function() {
                    $("#successAlertExtPhone").addClass('d-none');
                }, 500);
                $('#addExtPhoneForm')[0].reset();
            },
            error: function(error) {
                console.error("Error:", error);
                alert("An error occurred while adding a extention phone.");
            }
        });
    });

    $('#saveNewExtPhone').on('keypress', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $(this).submit();
        }
    });

    $('#editExtModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var id = button.data('id');
        var divName = button.data('divname');
        var name = button.data('name');
        var ext = button.data('extphone');

        console.log("Divisi yang akan disetel:", divName);
        
        var modal = $(this);
        modal.find('#editExtID').val(id);
        modal.find('#editExtName').val(name);
        modal.find('#editExtPhone').val(ext);

        $.ajax({
            url: '/divisions',
            type: 'GET',
            success: function(response) {
                console.log("Response data:", response);
                var divisiSelect = modal.find('#editExtDiv');
                divisiSelect.empty();
                divisiSelect.append('<option value="" disabled selected>Select Division</option>');
                
                response.divisions.forEach(function(divisi) {
                    var isSelected = divisi === divName ? 'selected' : '';
                    divisiSelect.append('<option value="' + divisi +'" ' + isSelected + '>' + divisi + '</option>');
                });
                
                if (divName) {
                    divisiSelect.val(divName);
                } else {
                    divisiSelect.val('');
                }
            },
            error: function(xhr, status, error) {
                console.log("Error:", error);
                alert("Failed to fetch divisions.");
            }
        });
    });

    $('#saveExtChanges').on('click', function() {
        var formData = {
            id: $('#editExtID').val(),
            div_name: $('#editExtDiv').val(),
            name: $('#editExtName').val(),
            ext_phone: $('#editExtPhone').val(),

        };

        console.log("Form data to be sent:", formData);

        $.ajax({
            url: '/extention/' + formData.id,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                $("#successAlertEdExtPhone").text(name + " Extention phone changed successfully!").removeClass('d-none');
                setTimeout(function() {
                    $("#successAlertEdExtPhone").addClass('d-none');
                    location.reload();
                }, 500);
            },
            error: function(xhr, status, error) {
                console.error("Error:", error);
                alert("Failed to update extention phone.");
            }
        });
    });

    var extID;

    $('#deleteExtModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        extID = button.data('id');
        var ext = button.data('extphone');
        
        $('#deleteExtPhone').text(ext);
    });

    $('#confirmDelExtPhone').on('click', function() {
        $.ajax({
            url: '/extention/' + extID,
            type: 'DELETE',
            success: function(response) {
                if (response && response.message === 'Deleted successfully') {
                    location.reload();
                } else {
                    alert('Failed to delete escalation.');
                }
            },
            error: function(error) {
                alert('Failed delete contact.');
                }
            });
        });

    $('#addUserModal').on('show.bs.modal', function () {
        $('#username').val('');
        $('#password').val('');
    });

    $('#saveNewUser').on('click', function (e) {
        e.preventDefault();

        var isValid = true;

        var username = $('#username').val();
        var password = $('#password').val();

        $('#addUserForm input').each(function () {
            $(this).removeClass('is-invalid');
        });

        $('#addUserForm input[required]').each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
                $(this).siblings('.invalid-feedback').show();
            }
        });

        if (username.trim() === '') {
            isValid = false;
            $('#username').addClass('is-invalid');
            $('#username').siblings('.invalid-feedback').show();
        } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            isValid = false;
            $('#username').addClass('is-invalid');
            $('#username').siblings('.invalid-feedback').show();
        } else {
            $('#username').removeClass('is-invalid');
            $('#username').siblings('.invalid-feedback').hide();
        }

        if (password.trim() === '') {
            isValid = false;
            $('#password').addClass('is-invalid');
            $('#password').siblings('.invalid-feedback').show();
        } else if (password.length < 6) {
            isValid = false;
            $('#password').addClass('is-invalid');
            $('#password').siblings('.invalid-feedback').show();
        } else {
            $('#password').removeClass('is-invalid');
            $('#password').siblings('.invalid-feedback').hide();
        }


        if (!isValid) {
            return;
        }

        var dataToSend = {
            username: username,
            password: password
        };

        var jsonData = JSON.stringify(dataToSend);

        console.log("JSON Data:", jsonData);

        $.ajax({
            url: '/user',
            type: 'POST',
            contentType: 'application/json',
            data: jsonData,
            success: function(response) {
                $("#successAlertAddUser").text(response.username + " User added successfully!").removeClass('d-none');
                setTimeout(function() {
                    $("#successAlertAddUser").addClass('d-none');
                    location.reload();
                }, 500);
            },
            error: function(error) {
                if (error.status === 409) {
                    $('#username').addClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').text('Username already exists!').show();
                    } else {
                        alert("An error occurred while adding a user.");
                    }
                }
            });
        });

        $('#saveNewUser').on('keypress', function(event) {
            if (event.which === 13) {
                event.preventDefault();
                $(this).submit();
            }
        });

        var id;

        $('#deleteUserModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            id = button.data('id');
            var username = button.data('username');
            
            $('#deleteUser').text(username);

        });

        $('#confirmDelUser').on('click', function() {
            $.ajax({
                url: '/user/' + id,
                type: 'DELETE',
                success: function(response) {
                    if (response && response.message === 'Deleted successfully') {
                        location.reload();
                    } else {
                        alert('Failed to delete user.');
                    }
                },
                error: function(error) {
                    if (error.responseJSON && error.responseJSON.error) {
                            alert(error.responseJSON.error);
                        } else {
                            alert('Failed to delete user.');
                        }
                    }
                });
            });

        $('#resetPasswordModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            var userId = button.data('id');

            console.log('Modal Opened. User ID:', userId);

            $('#resetUserId').val(userId);

        });

        $('#resetPasswordForm').on('submit', function (event) {
            event.preventDefault();

            var isValid = true;

            var id = $('#resetUserId').val();
            var password = $('#newPassword').val();

            console.log('Password Input Value:', password);

            $('#resetPasswordForm input').each(function () {
                $(this).removeClass('is-invalid');
            });

            if (!password || password.trim() === '') {
                isValid = false;
                $('#newPassword').addClass('is-invalid');
                $('#newPassword').siblings('.invalid-feedback').show();
            } else {
                $('#newPassword').removeClass('is-invalid');
                $('#newPassword').siblings('.invalid-feedback').hide();
            }

            if (!isValid) {
                console.error('Validation failed! Password is required.');
                return;
            }

            var dataToSend = {
                password: password
            };

            var jsonData = JSON.stringify(dataToSend);
            console.log("JSON Data:", jsonData);

            $.ajax({
                url: '/user/reset-password/' + id,
                type: 'PUT',
                contentType: 'application/json',
                data: jsonData,
                success: function(response) {
                    console.log('Password reset successful:', response);
                    $("#successAlertResetPassword").text("Reset password Successfully!").removeClass('d-none');

                    setTimeout(function() {
                        $("#successAlertResetPassword").addClass('d-none');
                        location.reload();
                    }, 500);
                },
                error: function(error) {
                    console.error('Error resetting password:', error);
                    alert('Error resetting password.');
                }
            });
        });

        $('#confirmResetPassword').on('keypress', function(event) {
            if (event.which === 13) {
                event.preventDefault();
                $(this).submit();
            }
        });

    document.getElementById('logoutText').addEventListener('click', function() {
        $('#confirmLogoutModal').modal('show');
    });

    document.getElementById('confirmSignoutButton').addEventListener('click', function () {
    fetch('/logout', { method: "POST" })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Logout successful') {
                $('#confirmLogoutModal').modal('hide');

                const alertBox = document.getElementById('logoutAlert');
                alertBox.classList.remove('d-none');
                setTimeout(() => {
                    alertBox.classList.add('d-none');
                    window.location.href = '/';
                }, 500);
            }
        })
        .catch(err => {
            console.error('Logout failed:', err);
        });
    });

});

// function getSessionStatus() {
//     fetch('/session-status')
//         .then(response => response.json())
//         .then(data => {
//             if (data.loggedIn) {
//                 var currentUser = data.username;
                
//                 $('tbody tr').each(function() {
//                     var username = $(this).find('td').eq(0).text().trim();
//                     var deleteButton = $(this).find('.btn-reset');
//                     var resetButton = $(this).find('.btn-delete');

//                     if (currentUser === "dee2") {
//                         if (username === "dee2") {
//                             resetButton.prop('disabled', true);
//                             deleteButton.prop('disabled', false);
//                         } else {
//                             resetButton.prop('disabled', false);
//                             deleteButton.prop('disabled', false);
//                         }
//                     } else {
//                         if (username === "dee2") {
//                             resetButton.prop('disabled', true);
//                             deleteButton.prop('disabled', true);
//                         } else {
//                             resetButton.prop('disabled', false);
//                             deleteButton.prop('disabled', false);
//                         }
//                     }
//                 });
//             } else {
//                 console.log("User not logged in.");
//             }
//         })
//         .catch(error => {
//             console.error("Error fetching session status:", error);
//         });
// }

document.addEventListener('DOMContentLoaded', function() {
    getSessionStatus();
});

$('#fileContentModal').on('hidden.bs.modal', function () {
    $('#fileContentModalBody').empty();
})

function handleFileView(filePath) {

    const basePath = "/files/uploads/";

    console.log("File path received:", filePath);

    let cleanFilePath  = filePath.trim();

    if (!cleanFilePath || cleanFilePath === "") {
        alert("File path is not available!");
        return;
    }

    const fileExtension = filePath.split('.').pop().toLowerCase();

    console.log("Cleaned file path:", filePath);
    console.log("File extension detected:", fileExtension);

    if (!filePath || filePath === "") {
        alert("File path is not available!");
        return;
    }

    if (fileExtension === "pdf") {
        const modalBody = document.getElementById('fileContentModalBody');
        if (modalBody) {
            const pdfIframe = `<iframe src="${basePath + cleanFilePath}" width="100%" height="1000px" frameborder="0" scrolling="no" style="overflow: hidden;"></iframe>`;
            modalBody.innerHTML = pdfIframe;
        } else {
            console.error("Element 'fileContentModalBody' not found!");
        }
        $('#fileContentModal').modal('show');
    } else if (fileExtension === "txt") {
        fetch(basePath + filePath)
            .then(response => response.text())
            .then(content => {

                $('#editBdtModal').modal('hide');
                const contentModalBody = document.getElementById('fileContentModalBody');
                if (contentModalBody) {
                    const sanitizedContent = DOMPurify.sanitize(content);
                    contentModalBody.innerHTML = sanitizedContent;
                } else {
                    console.error("Element 'fileContentModalBody' not found!");
                }
                $('#fileContentModal').modal('show');

            })
            .catch(error => console.error("Error loading file:", error));
    } else if (["docx", "xlsx"].includes(fileExtension)) {
        
        window.location.href = basePath + filePath;
    } else {
        
        alert("Unsupported file type: " + filePath);
    }

}