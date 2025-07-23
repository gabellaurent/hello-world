// Chat Supabase em 1 arquivo JS autossuficiente
(function() {
  // Carrega o supabase-js dinamicamente
  function loadSupabase(callback) {
    if (window.supabase) return callback();
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // CSS do chat
  var css = `
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #313338; margin: 0; padding: 0; }
    .chat-wrapper { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
    .container { background: #36393f; padding: 0; border-radius: 12px; max-width: 420px; width: 100%; height: 100%; box-shadow: 0 2px 24px 0 rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; }
    h1 { color: #fff; font-size: 1.4rem; font-weight: 600; background: #23272a; margin: 0; padding: 18px 0 12px 0; border-radius: 12px 12px 0 0; letter-spacing: 1px; width: 100%; box-sizing: border-box; text-align: center; }
    .user-box { background: #23272a; padding: 10px 16px 8px 16px; border-bottom: 1px solid #222; width: 100%; box-sizing: border-box; }
    #usuario { width: 100%; padding: 8px 10px; border-radius: 6px; border: none; background: #40444b; color: #fff; font-size: 1rem; outline: none; box-sizing: border-box; }
    .chat-box { flex: 1 1 0; min-height: 0; overflow-y: auto; background: #23272a; padding: 18px 10px 10px 10px; margin-bottom: 0 !important; }
    .chat-list { list-style: none; padding: 0; margin: 0; }
    .chat-msg { background: #40444b; color: #dcddde; margin-bottom: 12px; padding: 10px 14px 8px 14px; border-radius: 8px; text-align: left; position: relative; word-break: break-word; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08); transition: background 0.2s; }
    .chat-msg:last-child { margin-bottom: 0; }
    .chat-msg .user { color: #00b0f4; font-weight: 600; margin-right: 8px; font-size: 1rem; }
    .chat-msg .hora { color: #72767d; font-size: 0.85rem; float: right; }
    .chat-msg .texto { display: block; margin-top: 2px; font-size: 1.05rem; color: #dcddde; }
    .input-box { display: flex; align-items: flex-end; background: #23272a; padding: 14px 12px 14px 12px; border-radius: 0 0 12px 12px; gap: 8px; }
    #mensagem { flex: 1; min-height: 38px; max-height: 80px; resize: none; border-radius: 6px; border: none; background: #40444b; color: #fff; font-size: 1rem; padding: 8px 10px; outline: none; margin-right: 4px; }
    #enviar { background: #5865f2; color: #fff; border: none; border-radius: 6px; padding: 10px 18px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    #enviar:hover { background: #4752c4; }
    ::-webkit-scrollbar { width: 8px; background: #23272a; }
    ::-webkit-scrollbar-thumb { background: #40444b; border-radius: 4px; }
    .erro-usuario { border: 2px solid #ff5555 !important; box-shadow: 0 0 0 2px #ff555588; background: #3a2323 !important; color: #fff !important; }
    .erro-usuario::placeholder { color: #ff5555 !important; opacity: 1; }
    @media (max-width: 600px) {
      body { height: 100vh; min-height: 100vh; max-height: 100vh; margin: 0; padding: 0; overflow: hidden; }
      .chat-wrapper { height: 100vh; }
      .container { width: 100vw; height: 100vh; min-height: 100vh; border-radius: 0; margin: 0; }
      .chat-box { flex: 1 1 0; min-height: 0; padding-left: 4px; padding-right: 4px; background: #23272a; }
      .input-box { padding-left: 4px; padding-right: 4px; }
      .user-box { padding-left: 8px; padding-right: 8px; }
    }
  `;

  function mountChat() {
    // Adiciona o CSS
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // Permite renderizar dentro de uma div com id="chat-root", se existir
    var root = document.getElementById('chat-root') || document.body;
    if (root === document.body) document.body.innerHTML = '';
    var wrapper = document.createElement('div');
    wrapper.className = 'chat-wrapper';
    wrapper.innerHTML = `
      <div class="container">
        <h1>Chat em Tempo Real</h1>
        <div class="user-box">
          <input id="usuario" type="text" placeholder="Seu nome de usuário" maxlength="32" autocomplete="off" />
        </div>
        <div class="chat-box">
          <ul id="chat" class="chat-list"></ul>
        </div>
        <div class="input-box">
          <textarea id="mensagem" placeholder="Digite sua mensagem..." maxlength="500"></textarea>
          <button id="enviar">Enviar</button>
        </div>
      </div>
    `;
    root.appendChild(wrapper);

    // Supabase config
    const supabaseUrl = 'https://xhybbhdhjaluqjrtopml.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeWJiaGRoamFsdXFqcnRvcG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNzQ5NjMsImV4cCI6MjA2ODg1MDk2M30.Xb98A6l-duDBO6G8_3SPKwluyAm-v8LH5G22ysmSXck';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const chat = document.getElementById('chat');
    const chatBox = document.querySelector('.chat-box');
    const usuarioInput = document.getElementById('usuario');
    const mensagemInput = document.getElementById('mensagem');
    const enviarBtn = document.getElementById('enviar');

    function mostrarMensagem(msg) {
      const li = document.createElement('li');
      li.className = 'chat-msg';
      li.dataset.id = msg.id;
      const data = new Date(msg.created_at);
      const hora = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      li.innerHTML = `<span class="user">${msg.usuario || 'Anônimo'}</span> <span class="hora">${hora}</span><br><span class="texto">${msg.texto}</span>`;
      chat.appendChild(li);
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function carregarMensagens() {
      chat.innerHTML = '';
      const { data, error } = await supabase
        .from('meu-chat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) {
        data.reverse().forEach(mostrarMensagem);
        setTimeout(() => {
          if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 50);
      }
    }

    async function enviarMensagem() {
      const usuario = usuarioInput.value.trim();
      const texto = mensagemInput.value.trim();
      if (!usuario) {
        usuarioInput.focus();
        usuarioInput.classList.add('erro-usuario');
        // Salva placeholder original
        if (!usuarioInput.dataset.placeholder) {
          usuarioInput.dataset.placeholder = usuarioInput.placeholder;
        }
        usuarioInput.placeholder = 'identifique-se aqui!';
        setTimeout(() => {
          usuarioInput.classList.remove('erro-usuario');
          usuarioInput.placeholder = usuarioInput.dataset.placeholder || 'Seu nome de usuário';
        }, 1800);
        return;
      }
      if (!texto) return;
      mensagemInput.value = '';
      await supabase.from('meu-chat').insert([{ usuario, texto }]);
      setTimeout(() => {
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
      }, 100);
    // Destaque visual para campo de usuário vazio
    var styleErro = document.createElement('style');
    styleErro.innerHTML = '.erro-usuario { border: 2px solid #ff5555 !important; box-shadow: 0 0 0 2px #ff555588; }';
    document.head.appendChild(styleErro);
    }

    enviarBtn.onclick = enviarMensagem;
    mensagemInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
      }
    });

    supabase
      .channel('public:meu-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meu-chat' }, payload => {
        const existe = Array.from(chat.children).some(li => li.dataset.id === payload.new.id);
        if (!existe) {
          mostrarMensagem(payload.new);
          while (chat.children.length > 10) {
            chat.removeChild(chat.firstChild);
          }
          setTimeout(() => {
            if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
          }, 50);
        }
      })
      .subscribe();

    carregarMensagens();
  }

  loadSupabase(mountChat);
})();
