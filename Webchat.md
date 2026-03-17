# Documentação de Testes: Integração Webchat

## 1. Resumo do Status
* **Mensagens de Texto (Entrada):** Funcional (Chatwoot e logs NotificaMe).
* **Mensagens de Imagem (Entrada):** Falha no processamento.
* **Mensagens (Saída/Chatwoot):** Não retornam erro, mas não são entregues.
* **Teste de Conexão (NotificaMe):** Erro `METHOD_NOT_ALLOWED`.

---

## 2. Análise de Falha: Envio de Imagens
O log capturado indica que o objeto de mensagem é recebido pelo canal, mas o conteúdo do tipo `file` pode não estar sendo interpretado corretamente pela camada de integração seguinte.

**Log de Erro (Payload):**
```json
{
  "type": "MESSAGE",
  "id": "621377e7-bce1-4c72-933d-ae7dfe082339",
  "timestamp": "2026-03-17 12:59:13 pm",
  "subscriptionId": "de462ac8-3663-443a-a77a-a2febd272441",
  "channel": "webchat",
  "direction": "IN",
  "message": {
    "id": "621377e7-bce1-4c72-933d-ae7dfe082339",
    "from": "d3a0d3be-ab98-4ab5-890c-7b5737a5120b",
    "to": "de462ac8-3663-443a-a77a-a2febd272441",
    "direction": "IN",
    "channel": "webchat",
    "type": "webchat",
    "visitor": {
      "name": "Eiden Teste",
      "number": "0000000001"
    },
    "contents": [
      {
        "type": "file",
        "fileUrl": "https://hannah-groups.s3.amazonaws.com/NotificaMeHub/storage/d3a0d3be-ab98-4ab5-890c-7b5737a5120b.1354199.jpeg",
        "fileMimeType": "image/jpeg",
        "fileName": "d3a0d3be-ab98-4ab5-890c-7b5737a5120b.1354199.jpeg",
        "caption": ""
      }
    ]
  }
}
```
> **Nota:** O link do S3 foi validado manualmente e está acessível.

---

## 3. Diagnóstico de Conexão
Ao realizar o "Teste de Conexão" na plataforma NotificaMe, não foi enviada a mensagem.

**Resposta do Erro:**
* **Status:** `HTTP 200`.
* **Corpo:**
```json
{
    "code": "METHOD_NOT_ALLOWED",
    "message": "Method not allowed"
}
```


---

## 4. Ambiente de Testes
| Recurso | URL |
| :--- | :--- |
| **Interface do Chat** | [https://anime.eidenfox.xyz/chat](https://anime.eidenfox.xyz/chat) |
| **Painel Chatwoot** | [https://app.chatwoot.com/](https://app.chatwoot.com/app/accounts/156481/conversations/3) |
| **Webhook Debug** | [Webhook.site](https://webhook.site/#!/view/2e08f607-72f1-48cd-863e-0253a742798d/ef494a5b-116b-4a56-a454-e407d054d402/1) |

**Credenciais de Acesso:**
* **Login:** `fakoc31080@onbap.com`
* **Senha:** `fakoc31080@onbap.comA!`

---