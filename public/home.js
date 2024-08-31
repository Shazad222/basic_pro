// document.addEventListener('DOMContentLoaded', () => {
//     const user = JSON.parse(sessionStorage.getItem('user'));

//     if (!user) {
//         window.location.href = 'login.html';
//         return;
//     }

//     document.getElementById('username').textContent = user.name;
//     document.getElementById('userInfo').innerHTML = `
//         <p>Name: ${user.name}</p>
//         <p>Gender: ${user.gender}</p>
//         <img src="uploads/${user.profilePic}" alt="Profile Picture" style="width: 100px; height: 100px;">
//     `;

//     document.getElementById('logoutButton').addEventListener('click', () => {
//         sessionStorage.removeItem('user');
//         window.location.href = 'login.html';
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('username').textContent = user.name;
    document.getElementById('userInfo').innerHTML = `
        <p>Name: ${user.name}</p>
        <p>Gender: ${user.gender}</p>
        <img src="/uploads/${user.profilePic}" alt="Profile Picture" style="width: 100px; height: 100px;">
    `;

    document.getElementById('logoutButton').addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});

