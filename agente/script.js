/* INICIO DE FUNÇÃO DE PARSER DE MARKDOWN; esta função converte a formatação enviada pela IA (negrito, títulos, quebras de linha) em tags HTML interpretáveis pelo navegador */
function formatMarkdown(text) {
    let html = text;

    // Títulos (###, ##, #)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Negrito (**texto**)
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Itálico (*texto*)
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Listas simples (- item ou * item)
    html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
    // Agrupa listas consecutivas removendo as quebras entre elas
    html = html.replace(/<\/ul><br><ul>/gim, '');

    // Linha de separação (---)
    html = html.replace(/^---$/gim, '<hr class="chat-divider">');

    // Quebras de linha (\n)
    html = html.replace(/\n/gim, '<br>');

    return html;
}

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesBox = document.getElementById('messages-box');
const clearChatButton = document.getElementById('clear-chat-button');
const chatContainer = document.querySelector('.chat-container');

let sessionId = localStorage.getItem('chat_session_id');
if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
}

let webhookUrl = 'https://eidenfox.app.n8n.cloud/webhook/chat';

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

    if (sender === 'ai') {
        const iconImg = document.createElement('img');
        iconImg.src = '../img/favicon.ico';
        iconImg.alt = 'Ícone do Agente';
        iconImg.classList.add('agent-icon');
        messageDiv.appendChild(iconImg);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    if (sender === 'ai') {
        contentDiv.innerHTML = formatMarkdown(text);
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        contentDiv.appendChild(paragraph);
    }

    messageDiv.appendChild(contentDiv);
    messagesBox.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

clearChatButton.addEventListener('click', () => {
    messagesBox.innerHTML = `
        <div class="message ai-message">
            <img src="../img/favicon.ico" alt="Ícone do Agente" class="agent-icon">
            <div class="message-content">
                <p>Olá! Sou o assistente de IA. Como posso te ajudar hoje?</p>
            </div>
        </div>
    `;
    sessionId = crypto.randomUUID();
    localStorage.setItem('chat_session_id', sessionId);
});

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
    typingDiv.innerHTML = '<img src="../img/favicon.ico" alt="Ícone do Agente" class="agent-icon"><div class="message-content"><p>Digitando...</p></div>';
    messagesBox.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                message: text
            })
        });

        if (!response.ok) {
            throw new Error('Erro na comunicação com o webhook.');
        }

        const data = await response.json();

        document.getElementById(typingId).remove();

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

messageInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    if (this.scrollHeight > 150) {
        this.style.overflowY = 'auto';
    } else {
        this.style.overflowY = 'hidden';
    }
});