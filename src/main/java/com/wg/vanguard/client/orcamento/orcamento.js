

const API = 'http://localhost:8080';

const cats  = ["Camiseta","Calça","Vestido","Saia","Jaqueta","Moletom","Shorts","Blusa","Bermuda","Acessório"];
const cores  = ["Preto","Branco","Cinza","Azul","Vermelho","Verde","Rosa","Amarelo","Bege","Marrom","Vinho","Laranja"];
const tams   = ["PP","P","M","G","GG","XG","36","38","40","42","44","46","48","Único"];

let items       = [];   // itens da tabela
let idc         = 1;    // id local de controle
let orcamentoId = null; // ID do orçamento carregado (null = novo)


function selFill(el) {
  el.className = el.value ? 'v' : '';
}

function opts(arr, val) {
  return arr.map(x => `<option${val === x ? ' selected' : ''}>${x}</option>`).join('');
}

function toast(msg, tipo = 'ok') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function setLoading(on) {
  document.querySelectorAll('.btn').forEach(b => b.disabled = on);
}



function adicionarItem() {
  items.push({ id: idc++, peca: '', cat: '', cor: '', tam: '', qtd: 1, preco: 0 });
  renderItems();
}

function removerItem(id) {
  items = items.filter(i => i.id !== id);
  renderItems();
}

function renderItems() {
  const el = document.getElementById('itemsList');
  if (!items.length) { el.innerHTML = ''; calcTotals(); return; }

  el.innerHTML = items.map(item => `
    <div class="irow" id="r${item.id}">
      <div class="ibox">
        <input type="text" placeholder="Nome ou ref. da peça" value="${esc(item.peca)}"
          oninput="upd(${item.id},'peca',this.value)" />
      </div>
      <div class="ibox">
        <select class="${item.cat ? 'v' : ''}" onchange="upd(${item.id},'cat',this.value);selFill(this)">
          <option value="">Tipo...</option>${opts(cats, item.cat)}
        </select>
      </div>
      <div class="ibox">
        <select class="${item.cor ? 'v' : ''}" onchange="upd(${item.id},'cor',this.value);selFill(this)">
          <option value="">Cor...</option>${opts(cores, item.cor)}
        </select>
      </div>
      <div class="ibox">
        <select class="${item.tam ? 'v' : ''}" onchange="upd(${item.id},'tam',this.value);selFill(this)">
          <option value="">Tam...</option>${opts(tams, item.tam)}
        </select>
      </div>
      <div class="ibox">
        <input type="number" min="1" step="1" value="${item.qtd}"
          oninput="upd(${item.id},'qtd',this.value)" />
      </div>
      <div class="ibox">
        <input type="number" min="0" step="0.01" value="${item.preco || ''}" placeholder="0,00"
          oninput="upd(${item.id},'preco',this.value)" />
      </div>
      <button class="brm" onclick="removerItem(${item.id})" aria-label="Remover item">
        <i class="ti ti-x"></i>
      </button>
    </div>
  `).join('');

  calcTotals();
}

function upd(id, field, value) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  item[field] = (field === 'qtd' || field === 'preco') ? (parseFloat(value) || 0) : value;
  calcTotals();
}

function esc(str) {
  return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}


function calcTotals() {
  const sub  = items.reduce((s, i) => s + (i.qtd * i.preco), 0);
  const desc = Math.min(100, Math.max(0, parseFloat(document.getElementById('desconto').value) || 0));
  const total = sub * (1 - desc / 100);
  document.getElementById('subtotal').textContent   = fmtBRL(sub);
  document.getElementById('totalGeral').textContent = fmtBRL(total);
}

function fmtBRL(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}



function lerFormulario() {
  const sub  = items.reduce((s, i) => s + (i.qtd * i.preco), 0);
  const desc = Math.min(100, Math.max(0, parseFloat(document.getElementById('desconto').value) || 0));

  return {
    cpf:           document.getElementById('cpf').value.replace(/\D/g, ''),
    nomeCliente:   document.getElementById('nomeCliente').value.trim(),
    telefone:      document.getElementById('tel').value.replace(/\D/g, ''),
    status:        document.getElementById('statusOrc').value,
    observacoes:   document.getElementById('obs').value.trim(),
    dataOrcamento: document.getElementById('dataOrc').value || null,
    subtotal:      sub,
    desconto:      desc,
    itens: items.map(i => ({
      peca:          i.peca,
      categoria:     i.cat,
      cor:           i.cor,
      tamanho:       i.tam,
      quantidade:    i.qtd,
      precoUnitario: i.preco
    }))
  };
}


function preencherFormulario(orc) {
  orcamentoId = orc.id;

  document.getElementById('idOrc').value        = 'ORC-' + String(orc.id).padStart(5, '0');
  document.getElementById('nomeCliente').value  = orc.cliente?.nome        || '';
  document.getElementById('cpf').value          = fmtCPF(orc.cliente?.cpf  || '');
  document.getElementById('tel').value          = fmtTel(orc.cliente?.telefone || '');
  document.getElementById('statusOrc').value    = orc.status               || '';
  document.getElementById('obs').value          = orc.observacoes          || '';
  document.getElementById('dataOrc').value      = orc.dataOrcamento        || '';
  document.getElementById('desconto').value     = orc.desconto             || 0;

  // Itens armazenados como JSON string no backend
  let itensBackend = [];
  try { itensBackend = JSON.parse(orc.itens || '[]'); } catch (_) {}

  items = itensBackend.map(i => ({
    id:    idc++,
    peca:  i.peca          || '',
    cat:   i.categoria     || '',
    cor:   i.cor           || '',
    tam:   i.tamanho       || '',
    qtd:   i.quantidade    || 1,
    preco: i.precoUnitario || 0
  }));

  renderItems();
}



async function pesquisar() {
  const q = document.querySelector('.sw input').value.trim();
  if (!q) { toast('Digite um ID ou CPF para pesquisar.', 'warn'); return; }

  setLoading(true);
  try {
    const cpfLimpo = q.replace(/\D/g, '');
    let orc = null;

    // Tenta primeiro por ID numérico
    if (/^\d+$/.test(q) && q.length < 10) {
      const r = await fetch(`${API}/orcamentos/${q}`);
      if (r.ok) orc = await r.json();
    }

    // Se não achou por ID, tenta por CPF (pega o mais recente)
    if (!orc && cpfLimpo.length === 11) {
      const r = await fetch(`${API}/orcamentos/cliente/${cpfLimpo}`);
      if (r.ok) {
        const lista = await r.json();
        if (lista.length) orc = lista[lista.length - 1]; // mais recente
      }
    }

    if (orc) {
      preencherFormulario(orc);
      toast('Orçamento carregado.');
    } else {
      toast('Nenhum orçamento encontrado.', 'warn');
    }
  } catch (e) {
    toast('Erro ao pesquisar: ' + e.message, 'erro');
  } finally {
    setLoading(false);
  }
}



async function salvar() {
  const dados = lerFormulario();

  if (!dados.cpf || dados.cpf.length !== 11) {
    toast('CPF inválido. Verifique o campo.', 'warn');
    return;
  }
  if (!dados.nomeCliente) {
    toast('Informe o nome do cliente.', 'warn');
    return;
  }

  setLoading(true);
  try {
    let r;
    if (orcamentoId) {
      // Edição
      r = await fetch(`${API}/orcamentos/${orcamentoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Criação
      r = await fetch(`${API}/orcamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    if (!r.ok) {
      const err = await r.text();
      throw new Error(err || r.statusText);
    }

    const orc = await r.json();
    preencherFormulario(orc);
    toast(orcamentoId ? 'Orçamento atualizado!' : 'Orçamento salvo!');
  } catch (e) {
    toast('Erro ao salvar: ' + e.message, 'erro');
  } finally {
    setLoading(false);
  }
}


async function deletar() {
  if (!orcamentoId) {
    toast('Nenhum orçamento carregado para deletar.', 'warn');
    return;
  }
  if (!confirm(`Deseja deletar o orçamento ORC-${String(orcamentoId).padStart(5, '0')}?`)) return;

  setLoading(true);
  try {
    const r = await fetch(`${API}/orcamentos/${orcamentoId}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(r.statusText);
    toast('Orçamento deletado.');
    novoOrcamento();
  } catch (e) {
    toast('Erro ao deletar: ' + e.message, 'erro');
  } finally {
    setLoading(false);
  }
}


function novoOrcamento() {
  orcamentoId = null;
  items = [];
  renderItems();

  document.getElementById('idOrc').value        = 'ORC-NOVO';
  document.getElementById('nomeCliente').value  = '';
  document.getElementById('cpf').value          = '';
  document.getElementById('tel').value          = '';
  document.getElementById('statusOrc').value    = '';
  document.getElementById('obs').value          = '';
  document.getElementById('dataOrc').value      = new Date().toISOString().split('T')[0];
  document.getElementById('desconto').value     = 0;

  calcTotals();
  adicionarItem();
}


function mascCPF(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  el.value = v;
}

function mascTel(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  el.value = v;
}

function fmtCPF(cpf) {
  const v = cpf.replace(/\D/g, '');
  return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function fmtTel(tel) {
  const v = tel.replace(/\D/g, '');
  if (v.length === 11) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length === 10) return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return tel;
}


document.querySelector('.sw input').addEventListener('keydown', e => {
  if (e.key === 'Enter') pesquisar();
});

document.querySelector('.bsearch').addEventListener('click', pesquisar);

novoOrcamento();