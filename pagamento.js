// doacoes.js — controla a página de doações (envia para save_donation.php)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('donationForm');
  const resultBox = document.getElementById('donationResult');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultBox.style.display = 'none';
    resultBox.innerHTML = '';

    // coletar e validar
    const name = form.donorName.value.trim();
    const email = form.donorEmail.value.trim();
    const amount = parseFloat(form.donationAmount.value);
    const method = form.payMethod.value;
    const note = form.donationNote.value.trim();

    if (!name || !email || isNaN(amount) || amount <= 0) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = '<strong style="color:#b63b3b">Preencha nome, email e valor válido (maior que 0).</strong>';
      return;
    }

    // UI: confirmação local (simulada)
    const confirmMsg = `
      <div>
        <strong>Confirme a doação</strong>
        <p>Nome: ${escapeHtml(name)}<br>
        Email: ${escapeHtml(email)}<br>
        Valor: R$ ${amount.toFixed(2)}<br>
        Método: ${escapeHtml(method)}</p>
        <div style="display:flex;gap:8px;">
          <button id="btnConfirmDo" class="primary">Confirmar</button>
          <button id="btnCancelDo" class="ghost">Cancelar</button>
        </div>
      </div>
    `;
    resultBox.style.display = 'block';
    resultBox.innerHTML = confirmMsg;

    document.getElementById('btnCancelDo').addEventListener('click', () => {
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
    });

    document.getElementById('btnConfirmDo').addEventListener('click', async () => {
      // desabilitar botões visualmente
      document.getElementById('btnConfirmDo').disabled = true;
      document.getElementById('btnConfirmDo').textContent = 'Enviando...';

      // prepara payload (URL encoded)
      const payload = `donor_name=${encodeURIComponent(name)}&donor_email=${encodeURIComponent(email)}&amount=${encodeURIComponent(amount.toFixed(2))}&method=${encodeURIComponent(method)}&note=${encodeURIComponent(note)}`;

      try {
        // chama endpoint PHP (que você implementará em seguida)
        const res = await fetch('save_donation.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload
        });

        const text = await res.text();

        if (!res.ok) {
          throw new Error(text || 'Erro no servidor');
        }

        // resposta esperada: "ok" ou JSON; aceitamos ambos
        resultBox.innerHTML = `<strong style="color:green">Doação registrada com sucesso (simulada).</strong>
          <p>Resposta do servidor: ${escapeHtml(text)}</p>
          <p><em>Lembrete:</em> por ser um projeto escolar, nenhum valor foi transferido.</p>`;

        // opcional: limpar form
        form.reset();
        form.donationAmount.value = '10';
      } catch (err) {
        console.error(err);
        resultBox.innerHTML = `<strong style="color:#b63b3b">Falha ao enviar doação.</strong>
          <p>${escapeHtml(err.message)}</p>`;
      }
    });
  });

  // função simples para escapar HTML (evita XSS no resultado)
  function escapeHtml(s) {
    return (''+s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
});
