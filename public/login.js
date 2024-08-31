document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'home.html';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});
