// Chat moderno estilo Discord renderizado em uma div 'chat'
(function() {
    // HTML do chat
    const chatHTML = `
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #23272a; }
            .chat-container { max-width: 480px; margin: 40px auto; background: #2c2f33; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.25); padding: 24px 18px 18px 18px; }
            .messages { min-height: 260px; max-height: 340px; overflow-y: auto; border-radius: 8px; padding: 8px; margin-bottom: 18px; background: #23272a; border: 1px solid #36393f; }
            .input-area { display: flex; gap: 10px; align-items: flex-end; }
            textarea { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #36393f; resize: vertical; min-height: 44px; max-height: 120px; font-family: inherit; background: #23272a; color: #fff; font-size: 1rem; }
            button { padding: 10px 20px; border-radius: 8px; border: none; background: #5865f2; color: #fff; cursor: pointer; font-weight: 500; font-size: 1rem; transition: background 0.2s; }
            button:hover { background: #4752c4; }
            .msg { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
            .avatar { width: 38px; height: 38px; border-radius: 50%; background: #5865f2; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.3rem; font-weight: bold; flex-shrink: 0; box-shadow: 0 2px 8px rgba(88,101,242,0.15); }
            .bubble { background: #36393f; border-radius: 8px; padding: 10px 14px; color: #fff; min-width: 60px; max-width: 320px; word-break: break-word; position: relative; }
            .bubble .timestamp { display: block; font-size: 0.75rem; color: #b9bbbe; margin-top: 4px; }
            .bubble .edit-btn { display: block; margin: 8px 0 0 auto; background: #ffc107; color: #23272a; border: none; border-radius: 4px; cursor: pointer; padding: 2px 8px; font-size: 0.85rem; font-weight: 500; transition: background 0.2s; }
            .bubble .edit-btn:hover { background: #ffe082; }
        </style>
        <div class="chat-container">
            <div class="messages" id="messages"></div>
            <div class="input-area">
                <textarea id="chatInput" placeholder="Digite sua mensagem... Use *negrito* ou _itálico_"></textarea>
                <button id="sendBtn">Enviar</button>
            </div>
        </div>
    `;
    // Renderiza na div 'chat'
    let chatDiv = document.getElementById('chat');
    if (!chatDiv) {
        chatDiv = document.createElement('div');
        chatDiv.id = 'chat';
        document.body.appendChild(chatDiv);
    }
    chatDiv.innerHTML = chatHTML;

    // Lógica do chat
    let editingMsg = null;
    function sendMessage() {
        const input = document.getElementById('chatInput');
        const messages = document.getElementById('messages');
        let text = input.value;
        if (text.trim()) {
            // Markdown-like: *negrito* e _itálico_
            let htmlText = text.replace(/\*(.*?)\*/g, '<b>$1</b>');
            htmlText = htmlText.replace(/_(.*?)_/g, '<i>$1</i>');
            htmlText = htmlText.replace(/\r?\n/g, '<br>');
            if (editingMsg) {
                // Atualiza mensagem existente
                editingMsg.msgText.innerHTML = htmlText;
                editingMsg.timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                editingMsg = null;
                input.value = '';
                input.focus();
                return;
            }
            // Cria msg nova
            const msgDiv = document.createElement('div');
            msgDiv.className = 'msg';
            // Avatar
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.textContent = 'VC';
            msgDiv.appendChild(avatar);
            // Bolha
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            // Texto
            const msgText = document.createElement('span');
            msgText.innerHTML = htmlText;
            bubble.appendChild(msgText);
            // Timestamp
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            const now = new Date();
            timestamp.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            bubble.appendChild(timestamp);
            // Botão editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', function() {
                // Recupera texto original para edição
                let rawText = msgText.innerHTML.replace(/<br>/g, '\n').replace(/<b>(.*?)<\/b>/g, '*$1*').replace(/<i>(.*?)<\/i>/g, '_$1_');
                input.value = rawText;
                input.focus();
                editingMsg = {msgText, timestamp};
            });
            bubble.appendChild(editBtn);
            msgDiv.appendChild(bubble);
            messages.appendChild(msgDiv);
            messages.scrollTop = messages.scrollHeight;
            input.value = '';
            input.focus();
        }
    }
    document.getElementById('sendBtn').onclick = sendMessage;
    document.getElementById('chatInput').addEventListener('keydown', function(e) {
        // Enter envia, Shift+Enter quebra linha
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
})();
