async function criarContaNotificame(nome, email, cpf_cnpj, senha) {
    try {
        const { data, error } = await supabaseCon.functions.invoke('criar-conta-notificame', {
            body: {
                nome: nome,
                email: email,
                cpf_cnpj: cpf_cnpj,
                senha: senha
            }
        });

        if (error) {
            console.error("Erro na chamada da Edge Function:", error);
            return { sucesso: false, erro: "Erro de comunicação com o servidor." };
        }

        if (data && data.success) {
            return { sucesso: true };
        } else {
            console.error("Erro retornado pela Edge Function:", data);
            return { sucesso: false, erro: data.error };
        }
    } catch (error) {
        console.error("Erro ao invocar a função:", error);
        return { sucesso: false, erro: "Erro interno da aplicação." };
    }
}


async function sincronizarCanais(email, token) {
    try {
        const { data, error } = await supabaseCon.functions.invoke('sincronizar-canais', {
            body: {
                email: email,
                notificame_token: token
            }
        });

        if (error) {
            console.error("Erro ao chamar Edge Function de sincronização:", error);
            return null;
        }

        if (data && data.success) {
            document.getElementById('display-user-channels').innerText = data.canaisDisponiveis;

            if (data.nomeAtualizado) {
                document.getElementById('display-user-name').innerText = data.nomeAtualizado;
            }

            return data.canaisDisponiveis;
        } else {
            console.error("Erro na sincronização:", data?.error);
            return null;
        }
    } catch (error) {
        console.error("Erro interno na sincronização:", error);
        return null;
    }
}