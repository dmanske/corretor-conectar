# Como Configurar o Login Social (Google) para Seu App com Supabase

## 1. Cadastro do domínio no Supabase

1. Acesse o painel do Supabase do seu projeto.
2. No menu lateral, vá em **Authentication > URL Configuration**.
3. Em **Site URL**, coloque o domínio onde seu app estará hospedado. Exemplo:
   - `https://meuapp.com/`
4. Em **Redirect URLs**, adicione:
   - `https://meuapp.com/`
   - Se usar HashRouter: `https://meuapp.com/#/`
5. Se for usar em ambiente de desenvolvimento, adicione também:
   - `http://localhost:8080/`
   - `http://localhost:8080/#/`
   - (ou a porta que você usa)
6. Clique em **Save** para salvar as alterações.

---

## 2. Cadastro do domínio no Google Cloud (OAuth)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. No menu, vá em **APIs & Services > Credentials**.
3. Clique no seu **OAuth 2.0 Client ID** (ou crie um novo se necessário).
4. Em **Authorized redirect URIs**, adicione:
   - `https://meuapp.com/`
   - Se usar HashRouter: `https://meuapp.com/#/`
   - (e os domínios de desenvolvimento, se necessário)
5. Salve as alterações.

---

## 3. Observações importantes

- **Sempre cadastre todos os domínios e portas que você pretende usar** (produção e desenvolvimento).
- Se mudar o domínio do app, lembre de atualizar nas duas plataformas.
- O login social só funciona em domínios cadastrados por questão de segurança.
- Para cada novo cliente (se for white label), repita o processo para o domínio dele.

---

## 4. Dúvidas frequentes

- **Posso cadastrar vários domínios?**
  - Sim, tanto o Supabase quanto o Google permitem múltiplos domínios/URLs.
- **Preciso cadastrar localhost?**
  - Sim, para testar localmente.
- **E se der erro de redirect_uri_mismatch?**
  - Verifique se a URL está exatamente igual nas duas plataformas e no navegador.

---

Se precisar de ajuda, consulte esta documentação ou peça suporte ao desenvolvedor do sistema. 