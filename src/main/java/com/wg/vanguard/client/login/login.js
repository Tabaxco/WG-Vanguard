const API = 'http://localhost:8080/auth';

async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        mostrarErro('Preencha e-mail e senha.');
        return;
    }

    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (res.status === 401) {
            mostrarErro('E-mail ou senha incorretos.');
            return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const usuario = await res.json();
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        window.location.href = '../orcamento/orcamento.html';

    } catch (err) {
        mostrarErro('Erro ao conectar com o servidor.');
    }
}

function mostrarErro(msg) {
    let el = document.getElementById('erroLogin');
    if (!el) {
        el = document.createElement('div');
        el.id = 'erroLogin';
        el.style.cssText = `
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
            border-radius: 10px;
            padding: 10px 16px;
            font-size: .85rem;
            font-weight: 500;
            margin-bottom: 16px;
        `;
        document.querySelector('.btn').insertAdjacentElement('beforebegin', el);
    }
    el.textContent = msg;
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
});