/* INICIO DE FUNÇÃO DE [auth.js]; esta função faz o gerenciamento de login, cadastro, busca de valores padrão e comunicação com o banco de dados Supabase */

const supabaseUrl = 'https://gaejvymnzwvhwkehopoi.supabase.co';
const supabaseKey = 'sb_publishable_hx5Squj4TZDF8P8TaXp7uw_etpAVIGc';
const supabaseCon = window.supabase.createClient(supabaseUrl, supabaseKey);

window.COMPANY_UUID = null;

function showNotification(message, type = 'error') {
    const toast = document.getElementById("toast-notification");
    toast.innerText = message;
    toast.className = type + " show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "").trim();
    }, 3000);
}

function alternarFormulariosAuth() {
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    if (loginBox.style.display === 'none') {
        loginBox.style.display = 'flex';
        registerBox.style.display = 'none';
    } else {
        loginBox.style.display = 'none';
        registerBox.style.display = 'flex';
    }
}

async function criarConta() {
    const nome = document.getElementById('reg-nome').value;
    const cpfcnpj = document.getElementById('reg-cpfcnpj').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-password').value;

    if (!nome || !cpfcnpj || !email || !senha) {
        showNotification("Preencha todos os campos.", "error");
        return;
    }

    const resultado = await criarContaNotificame(nome, email, cpfcnpj, senha);

    if (resultado.sucesso) {
        showNotification("Conta criada com sucesso! Faça login.", "success");
        alternarFormulariosAuth();
    } else {
        let mensagemErro = resultado.erro || "";

        if (typeof mensagemErro === 'object') {
            mensagemErro = JSON.stringify(mensagemErro);
        }

        if (mensagemErro.includes("email already exists")) {
            showNotification("Este email já está cadastrado.", "error");
        } else {
            showNotification("Erro ao criar conta. Verifique o console para mais detalhes.", "error");
            console.error(mensagemErro);
        }
    }
}
window.USER_EMAIL = null;

async function realizarLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    if (!email || !senha) {
        showNotification("Preencha todos os campos.", "error");
        return;
    }

    const { data, error } = await supabaseCon.functions.invoke('realizar-login', {
        body: { email: email, senha: senha }
    });

    if (error) {
        showNotification("Um erro ocorreu na comunicação com o servidor.", "error");
        console.error(error);
        return;
    }

    if (data && data.success) {
        window.COMPANY_UUID = data.user.notificame_token;
        window.USER_EMAIL = email;

        document.getElementById('display-user-name').innerText = data.user.nome;
        document.getElementById('display-user-channels').innerText = "...";

        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';

        await sincronizarCanais(window.USER_EMAIL, window.COMPANY_UUID);
    } else {
        showNotification(data.error || "Erro ao realizar login.", "error");
    }
}