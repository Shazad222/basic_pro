document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("uploadForm");
    const imageList = document.getElementById("imageList");
    const editImageForm = document.getElementById("editImageForm");
    const editImageIdInput = document.getElementById("editImageId");

    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayImages();
                    uploadForm.reset();
                } else {
                    alert('Upload failed');
                }
            })
            .catch(err => console.error('Error during file upload:', err));
    });

    function displayImages() {
        fetch('/images')
            .then(response => response.json())
            .then(data => {
                imageList.innerHTML = '';
                data.forEach(image => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.innerHTML = `
                    <img src="uploads/${image.filename}" width="100" class="img-thumbnail">
                    <div>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${image.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${image.id}">Delete</button>
                    </div>
                `;
                    imageList.appendChild(li);
                });
            })
            .catch(err => console.error('Error fetching images:', err));
    }

    imageList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            fetch(`/delete/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayImages();
                    } else {
                        alert('Failed to delete image');
                    }
                })
                .catch(err => console.error('Error during file deletion:', err));
        } else if (event.target.classList.contains('edit-btn')) {
            const id = event.target.getAttribute('data-id');
            editImageIdInput.value = id;
            $('#editImageModal').modal('show');
        }
    });

    editImageForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = editImageIdInput.value;
        const formData = new FormData(editImageForm);

        fetch(`/edit/${id}`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    $('#editImageModal').modal('hide');
                    displayImages();
                } else {
                    alert('Failed to edit image');
                }
            })
            .catch(err => console.error('Error during file edit:', err));
    });

    displayImages();
});
