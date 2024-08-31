document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    fetch('/signup', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
});
