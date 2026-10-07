const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesBox = document.getElementById('messages-box');

// URL do webhook que será futuramente consultada de forma dinâmica no banco de dados (Supabase/Vercel)
let webhookUrl = 'URL_DO_SEU_WEBHOOK_N8N_AQUI';

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    contentDiv.appendChild(paragraph);
    messageDiv.appendChild(contentDiv);
    messagesBox.appendChild(messageDiv);

    messagesBox.scrollTop = messagesBox.scrollHeight;
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    messageInput.value = '';
    messageInput.style.height = 'auto'; 

    const typingId = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai-message');
    typingDiv.id = typingId;
    typingDiv.innerHTML = '<div class="message-content"><p>Digitando...</p></div>';
    messagesBox.appendChild(typingDiv);
    messagesBox.scrollTop = messagesBox.scrollHeight;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: "sessao-" + Date.now(), 
                message: text 
            })
        });

        if (!response.ok) {
            throw new Error('Erro na comunicação com o webhook.');
        }

        const data = await response.json();
        
        document.getElementById(typingId).remove();

        // O campo 'data.output' deve corresponder à chave json que o seu n8n vai retornar no final do fluxo
        const respostaIA = data.output || data.response || data.message || 'Resposta recebida, ajuste a chave do JSON no script.js';
        appendMessage('ai', respostaIA);

    } catch (error) {
        document.getElementById(typingId).remove();
        appendMessage('ai', 'Desculpe, ocorreu um erro de conexão.');
        console.error('Erro no fetch:', error);
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if (this.scrollHeight > 150) {
        this.style.overflowY = 'auto';
    } else {
        this.style.overflowY = 'hidden';
    }
});