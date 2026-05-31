function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Preencha e-mail e senha.');
        return;
    }

    // redirect to dashboard
    window.location.href = 'estoque.html';
}