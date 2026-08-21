const NOTIFICAME_API = "https://api.notificame.com.br";
let metaPopup = null;

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function openMetaPopup(flow) {
    const tokenError = document.getElementById("token-error");

    if (!window.COMPANY_UUID) {
        console.log("Token Inválido ou Usuário não logado");
        tokenError.style.display = "block";
        return;
    }

    tokenError.style.display = "none";

    const origin = window.location.origin;

    const url = `${NOTIFICAME_API}/v2/oauth/meta/start?company_uuid=${window.COMPANY_UUID}&redirect_origin=${encodeURIComponent(origin)}&type=${flow}`;

    metaPopup = window.open(url, "notificameMetaConnect", "width=800,height=900");

    if (!metaPopup) {
        setStatus("Popup bloqueado.", false);
    }
}

function setStatus(message, success) {
    const el = document.getElementById("status");
    el.innerText = message;
    el.className = "status " + (success ? "success" : "error");
}

window.addEventListener("message", async (event) => {
    if (event.origin !== NOTIFICAME_API) return;
    if (!event.data || !event.data.status) return;

    if (event.data.status === "channel-success") {
        console.log("event.data", event.data);
        setStatus("Canal conectado com sucesso! Sincronizando dados...", true);
        
        await sincronizarCanais(window.USER_EMAIL, window.COMPANY_UUID);
        
        setStatus("Canal conectado e sincronizado!", true);
    } else {
        setStatus("Erro ao conectar canal.", false);
    }

    if (metaPopup && !metaPopup.closed) {
        metaPopup.close();
    }
});