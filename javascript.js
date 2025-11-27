// javascript.js - EcoCalc (coloque este arquivo na mesma pasta)
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS carregado!");

  // ====== FATORES ======
  const FATORES = {
    transporte: { carro: 0.12, onibus: 0.05, moto: 0.08, bicicleta: 0.0, a_pe: 0.0 },
    alimento: { carne_refeicao: 2.5 },
    energia: { kwh: 0.06 },
    consumo: { roupa_peca: 7.0, eletronico_unidade: 150 }
  };

  // DOM refs
  const form = document.getElementById("ecoForm");
  const resultadoResumo = document.getElementById("resultadoResumo");
  const dicasArea = document.getElementById("dicasArea");
  const comparacoes = document.getElementById("comparacoes");
  const btnReset = document.getElementById("btnReset");
  const btnHistorico = document.getElementById("btnHistorico");
  const historyModal = document.getElementById("historyModal");
  const closeModal = document.getElementById("closeModal");
  const historyList = document.getElementById("historyList");
  const btnAtualizarMedias = document.getElementById("btnAtualizarMedias");
  const btnScrollCalc = document.getElementById("btnScrollCalc");

  // charts
  let emissionsChart = null;
  let comparisonChart = null;

  // ====== cálculo ======
  function calcularPegada(vals) {
    const semanasPorMes = 4.345;
    const kmSemana = Number(vals.kmSemana) || 0;
    const transporteTipo = vals.transporteTipo || 'carro';
    const refeicoesCarne = Number(vals.refeicoesCarne) || 0;
    const kwhMes = Number(vals.kwhMes) || 0;
    const roupasMes = Number(vals.roupasMes) || 0;
    const eletronicosAno = Number(vals.eletronicosAno) || 0;

    const transporteKgSemana = kmSemana * (FATORES.transporte[transporteTipo] ?? 0);
    const alimentoKgSemana = refeicoesCarne * FATORES.alimento.carne_refeicao;
    const energiaKgSemana = (kwhMes * FATORES.energia.kwh) / semanasPorMes;
    const roupasKgSemana = (roupasMes * FATORES.consumo.roupa_peca);
    const eletronicosKgSemana = (eletronicosAno * FATORES.consumo.eletronico_unidade) / 52;

    const porCategoria = {
      Transporte: transporteKgSemana,
      Alimentacao: alimentoKgSemana,
      Energia: energiaKgSemana,
      Roupas: roupasKgSemana,
      Eletronicos: eletronicosKgSemana
    };

    const total = Object.values(porCategoria).reduce((s, v) => s + v, 0);
    return { porCategoria, total };
  }

  // ====== gráficos ======
  function atualizarGrafico(catObj) {
    const labels = Object.keys(catObj).map(k => k.replace('_',' '));
    const data = Object.values(catObj).map(v => Math.round(v * 100) / 100);
    const ctx = document.getElementById('emissionsChart').getContext('2d');

    const backgroundColor = [
      'rgba(55,150,131,0.85)',
      'rgba(168,230,207,0.9)',
      'rgba(170,220,200,0.7)',
      'rgba(80,180,150,0.6)',
      'rgba(120,200,170,0.5)'
    ];

    if (emissionsChart) {
      emissionsChart.data.labels = labels;
      emissionsChart.data.datasets[0].data = data;
      emissionsChart.update();
      return;
    }

    emissionsChart = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets: [{ label: 'kg CO₂ / semana', data, backgroundColor, hoverOffset:8, borderWidth:0 }] },
      options: { plugins:{legend:{position:'bottom'}, tooltip:{callbacks:{label: ctx => `${ctx.label}: ${ctx.formattedValue} kg CO₂ / semana`}}}, maintainAspectRatio:false, aspectRatio:1.2 }
    });
  }

  function inicializarGraficoComparacao() {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    comparisonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Você','Média Nacional','Média Internacional'],
        datasets: [{ label: 'kg CO₂ / semana', data: [0,42.5,55.2], backgroundColor: ['#379683','#a8e6cf','#75d5b7'], borderRadius:6 }]
      },
      options: { plugins:{legend:{display:false}}, responsive:true, maintainAspectRatio:false, scales:{y:{beginAtZero:true}} }
    });
  }

  function atualizarGraficoComparacao(valorUsuario, medias = null) {
    if (!comparisonChart) return;
    const ds = comparisonChart.data.datasets[0];
    ds.data[0] = Math.round(valorUsuario * 10) / 10;
    if (medias) {
      ds.data[1] = Math.round((medias.nacional || 0) * 10) / 10;
      ds.data[2] = Math.round((medias.internacional || 0) * 10) / 10;
      window.lastLoadedMedias = medias;
    }
    comparisonChart.update();
  }

  // ====== dicas ======
  function gerarDicas(cat) {
    const entries = Object.entries(cat).sort((a,b) => b[1]-a[1]);
    const top = entries[0] || ['—',0];
    const total = Object.values(cat).reduce((s,v)=>s+v,0) || 1;
    const dicas = [];
    dicas.push({titulo:'Comece com pequenas mudanças', texto:'Trocar uma refeição com carne por semana por uma opção vegetal e substituir um trajeto de carro por transporte público já reduzem emissões.'});
    if (top[0] === 'Transporte') dicas.push({titulo:`Transporte — ${Math.round((top[1]/total)*100)}% da sua pegada`, texto:'Reduzir viagens de carro e priorizar transporte coletivo ou bicicleta.'});
    if (top[0] === 'Alimentacao') dicas.push({titulo:`Alimentação — ${Math.round((top[1]/total)*100)}%`, texto:'Reduzir carne vermelha e preferir vegetais.'});
    if (top[0] === 'Energia') dicas.push({titulo:`Energia — ${Math.round((top[1]/total)*100)}%`, texto:'Melhorar eficiência energética, trocar lâmpadas por LED.'});
    dicas.push({titulo:'Próximo passo', texto:'Integre com DB para acompanhar sua evolução ao longo do tempo.'});
    return dicas;
  }

  // ====== salvar histórico via fetch -->
  function salvarHistorico(total) {
    fetch("save.php", {
      method: "POST",
      headers: {"Content-Type":"application/x-www-form-urlencoded"},
      body: "total_co2=" + encodeURIComponent(total)
    })
    .then(r => r.text())
    .then(t => console.log("save.php:", t))
    .catch(err => console.error("Erro ao salvar:", err));
  }

  // ====== carregar histórico (usado quando abre modal) -->
  function carregarHistorico() {
    historyList.innerHTML = 'Carregando...';
    fetch("carregar_historico.php")
      .then(r => r.json())
      .then(data => {
        if (!data || !data.length) { historyList.innerHTML = "<p>Nenhum registro salvo.</p>"; return; }
        historyList.innerHTML = data.map(item => `
          <div class="history-item">
            <strong>${item.total_co2} kg CO₂</strong><br>
            <small>${item.data_registro}</small>
          </div>
        `).join('');
      })
      .catch(err => { historyList.innerHTML = "<p>Erro ao carregar histórico.</p>"; console.error(err); });
  }

  // ====== eventos do form ======
  form.addEventListener('submit', e => {
    e.preventDefault();
    const vals = {
      transporteTipo: form.transporteTipo.value,
      kmSemana: +form.kmSemana.value,
      refeicoesCarne: +form.refeicoesCarne.value,
      kwhMes: +form.kwhMes.value,
      roupasMes: +form.roupasMes.value,
      eletronicosAno: +form.eletronicosAno.value
    };

    const calc = calcularPegada(vals);
    resultadoResumo.textContent = isFinite(calc.total) ? (Math.round(calc.total*10)/10 + ' kg CO₂ / semana') : '—';
    const kmEquiv = calc.total / FATORES.transporte.carro || 0;
    comparacoes.innerHTML = `Sua pegada semanal é <strong>${Math.round(calc.total*10)/10} kg CO₂</strong>. Equivale a ~<strong>${Math.round(kmEquiv)}</strong> km de carro por semana.`;
    const dicas = gerarDicas(calc.porCategoria);
    dicasArea.innerHTML = dicas.map(d => `<div class="tip"><strong>${d.titulo}</strong><div>${d.texto}</div></div>`).join('');
    atualizarGrafico(calc.porCategoria);
    atualizarGraficoComparacao(calc.total);
    salvarHistorico(calc.total);
  });

  // reset
  btnReset.addEventListener('click', () => {
    form.reset();
    form.kmSemana.value = 20;
    form.refeicoesCarne.value = 7;
    form.kwhMes.value = 180;
    form.roupasMes.value = 1;
    form.eletronicosAno.value = 0;
    resultadoResumo.textContent = '— kg CO₂ / semana';
    comparacoes.textContent = '—';
    dicasArea.innerHTML = '<div class="tip"><strong>Dica:</strong> Preencha o formulário e clique em "Calcular" para ver sugestões específicas.</div>';
    try {
      localStorage.removeItem('eco_input');
      localStorage.removeItem('eco_saved_last');
    } catch(e){}
    if (emissionsChart) { emissionsChart.destroy(); emissionsChart = null; }
    if (comparisonChart) { comparisonChart.data.datasets[0].data = [0, (window.lastLoadedMedias?.nacional)||0, (window.lastLoadedMedias?.internacional)||0]; comparisonChart.update(); }
  });

  // histórico modal
  btnHistorico.addEventListener('click', () => {
    historyModal.classList.remove('hidden');
    carregarHistorico();
  });
  closeModal.addEventListener('click', () => historyModal.classList.add('hidden'));

  // atualizar médias (placeholder)
  btnAtualizarMedias.addEventListener('click', async () => {
    btnAtualizarMedias.disabled = true; btnAtualizarMedias.textContent = 'Buscando...';
    try {
      // mock - substitua por fetch real
      const medias = await (async ()=>({nacional:42.5, internacional:55.2}))();
      document.getElementById('mediasInfo').textContent = 'Fonte: dados de exemplo (substituir por API/DB).';
      const savedInput = JSON.parse(localStorage.getItem('eco_input') || 'null');
      const currentCalc = savedInput ? calcularPegada(savedInput) : { total: 0 };
      atualizarGraficoComparacao(currentCalc.total, medias);
    } catch(e){ console.error(e); }
    btnAtualizarMedias.disabled = false; btnAtualizarMedias.textContent = 'Atualizar médias';
  });

  // botão scroll para calculadora
  btnScrollCalc.addEventListener('click', () => {
    document.getElementById('ecoForm').scrollIntoView({behavior:'smooth', block:'center'});
  });

  // ====== inicializa gráficos ======
  inicializarGraficoComparacao();

  // tenta restaurar estado salvo (opcional)
  try {
    const saved = JSON.parse(localStorage.getItem('eco_input') || 'null');
    if (saved) {
      Object.entries(saved).forEach(([k,v])=>{ if (form[k] !== undefined) form[k].value = v; });
      // não disparamos submit automático aqui para evitar salvar sem querer
    }
  } catch(e){ console.warn('restore err', e); }

  // ====== top países (usa imagens da flagcdn ou local se preferir) ======
  const paises = [
    { nome: "China", code:"cn", co2:11.5 },
    { nome: "Estados Unidos", code:"us", co2:5.0 },
    { nome: "Índia", code:"in", co2:2.7 },
    { nome: "Rússia", code:"ru", co2:1.7 },
    { nome: "Japão", code:"jp", co2:1.1 },
    { nome: "Irã", code:"ir", co2:0.8 },
    { nome: "Alemanha", code:"de", co2:0.7 },
    { nome: "Arábia Saudita", code:"sa", co2:0.6 },
    { nome: "Indonésia", code:"id", co2:0.6 },
    { nome: "Canadá", code:"ca", co2:0.5 }
  ];
  const lista = document.getElementById('listaPaises');
  lista.innerHTML = paises.map((p,i)=>`
    <tr>
      <td>#${i+1}</td>
      <td><img class="pais-flag" src="https://flagcdn.com/w40/${p.code}.png" alt="${p.nome}"> ${p.nome}</td>
      <td>${p.co2} Gt</td>
    </tr>
  `).join('');

  // ====== slider de fontes de energia ======
  const fontes = [
    { nome: "Carvão", emissao: "~820 g CO₂/kWh", img: "imagens/carvao.jpg", desc: "Fonte fóssil com alta emissão." },
    { nome: "Gás Natural", emissao: "~490 g CO₂/kWh", img: "imagens/gas.webp", desc: "Menos poluente que o carvão, ainda fóssil." },
    { nome: "Petróleo", emissao: "~650 g CO₂/kWh", img: "imagens/petroleo.png", desc: "Usado em termelétricas e transporte." },
    { nome: "Hidrelétrica", emissao: "~24 g CO₂/kWh", img: "imagens/hidreletrica.jpg", desc: "Renovável; variação depende do projeto." },
    { nome: "Eólica", emissao: "~12 g CO₂/kWh", img: "imagens/eolica.jpg", desc: "Renovável e de baixíssimas emissões." },
    { nome: "Solar", emissao: "~40 g CO₂/kWh", img: "imagens/solar.jpg", desc: "Renovável, limpo e escalável." }
  ];

  const slider = document.getElementById('sliderEnergia');
  slider.innerHTML = fontes.map(f=>`
    <div class="slide">
      <img src="${f.img}" alt="${f.nome}">
      <div class="slide-content">
        <h3>${f.nome}</h3>
        <p><strong>${f.emissao}</strong></p>
        <p>${f.desc}</p>
      </div>
    </div>
  `).join('');

  let slideIndex = 0;
  const updateSlider = ()=> slider.style.transform = `translateX(-${slideIndex*100}%)`;
  document.querySelector('.btn-next').addEventListener('click', ()=> { if (slideIndex < fontes.length-1) slideIndex++; updateSlider(); });
  document.querySelector('.btn-prev').addEventListener('click', ()=> { if (slideIndex > 0) slideIndex--; updateSlider(); });

});


