if (!sessionStorage.getItem('usuario')) {
    window.location.href = '../login/Login.html';
}

const API = 'http://localhost:8080/funcionarios';

function mostrarToast(mensagem, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;
    toast.className = 'toast ' + tipo;
    setTimeout(() => { toast.className = 'toast hidden'; }, 3500);
}

function formatarCPF(valor) {
    const v = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
    if (v.length > 6) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    if (v.length > 3) return `${v.slice(0, 3)}.${v.slice(3)}`;
    return v;
}

function cpfValido(cpf) {
    const d = cpf.replace(/\D/g, '');
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    for (let t = 9; t < 11; t++) {
        let soma = 0;
        for (let i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
        const dv = ((soma * 10) % 11) % 10;
        if (dv !== Number(d[t])) return false;
    }
    return true;
}

function preencherForm(f) {
    document.getElementById('funcionarioId').value    = f.id              ?? '';
    document.getElementById('nome').value             = f.nome            ?? '';
    document.getElementById('email').value            = f.email           ?? '';
    document.getElementById('telefone').value         = f.telefone        ?? '';
    document.getElementById('cpf').value              = formatarCPF(f.cpf);
    document.getElementById('dataContratacao').value  = f.dataContratacao ?? '';
}

function limparForm() {
    ['funcionarioId', 'nome', 'email', 'telefone', 'cpf', 'dataContratacao']
        .forEach(id => { document.getElementById(id).value = ''; });
}

function coletarDados() {
    return {
        nome:             document.getElementById('nome').value.trim(),
        email:            document.getElementById('email').value.trim(),
        telefone:         document.getElementById('telefone').value.trim(),
        cpf:              document.getElementById('cpf').value.replace(/\D/g, ''),
        dataContratacao:  document.getElementById('dataContratacao').value
    };
}

function validar(dados) {
    if (!dados.nome || !dados.email || !dados.telefone || !dados.cpf || !dados.dataContratacao) {
        mostrarToast('Preencha todos os campos obrigatórios.', 'error');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dados.email)) {
        mostrarToast('Informe um e-mail válido.', 'error');
        return false;
    }
    if (!cpfValido(dados.cpf)) {
        mostrarToast('Informe um CPF válido.', 'error');
        return false;
    }
    return true;
}

function mascararTelefone(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    } else if (v.length > 2) {
        v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    } else if (v.length > 0) {
        v = '(' + v;
    }
    input.value = v;
}

async function lerMensagemErro(res, padrao) {
    try {
        const txt = (await res.text()).trim();
        return txt || padrao;
    } catch {
        return padrao;
    }
}

async function pesquisar() {
    const q = document.getElementById('searchInput').value.trim();
    const digitos = q.replace(/\D/g, '');

    let url;
    if (digitos.length === 11) {
        url = `${API}/cpf/${digitos}`;
    } else if (/^\d+$/.test(q)) {
        url = `${API}/${q}`;
    } else {
        mostrarToast('Digite um ID ou um CPF (11 dígitos) para pesquisar.', 'error');
        return;
    }

    try {
        const res = await fetch(url);
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado.', 'error');
            limparForm();
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        preencherForm(await res.json());
        mostrarToast('Funcionário encontrado.', 'success');
    } catch (err) {
        console.error('pesquisar:', err);
        mostrarToast('Erro ao buscar funcionário. Verifique a conexão com a API.', 'error');
        limparForm();
    }
}

async function adicionar() {
    const dados = coletarDados();
    if (!validar(dados)) return;
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.status === 409) {
            mostrarToast(await lerMensagemErro(res, 'Funcionário já cadastrado.'), 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        preencherForm(await res.json());
        mostrarToast('Funcionário adicionado com sucesso!', 'success');
    } catch (err) {
        console.error('adicionar:', err);
        mostrarToast('Erro ao adicionar funcionário.', 'error');
    }
}

async function salvarEdicao() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        mostrarToast('Pesquise um funcionário antes de editar.', 'error');
        return;
    }
    const dados = coletarDados();
    if (!validar(dados)) return;
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado para atualização.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        preencherForm(await res.json());
        mostrarToast('Funcionário atualizado com sucesso!', 'success');
    } catch (err) {
        console.error('salvarEdicao:', err);
        mostrarToast('Erro ao atualizar funcionário.', 'error');
    }
}

async function deletar() {
    const id = document.getElementById('funcionarioId').value;
    if (!id) {
        mostrarToast('Pesquise um funcionário antes de deletar.', 'error');
        return;
    }
    if (!confirm(`Tem certeza que deseja deletar o funcionário #${id}?`)) return;
    try {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
        if (res.status === 404) {
            mostrarToast('Funcionário não encontrado.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        limparForm();
        document.getElementById('searchInput').value = '';
        mostrarToast('Funcionário deletado com sucesso.', 'success');
    } catch (err) {
        console.error('deletar:', err);
        mostrarToast('Erro ao deletar funcionário.', 'error');
    }
}

document.getElementById('searchInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') pesquisar(); });

document.getElementById('cpf')
    .addEventListener('input', e => { e.target.value = formatarCPF(e.target.value); });

document.getElementById('dataContratacao').max = new Date().toISOString().split('T')[0];
document.getElementById('dataContratacao').min = '1900-01-01';