# gazeta-frontend-test :octocat:

## História: 📰
O Gazeta Online é o maior portal de notícias e entretenimento do Espírito Santo, com mais de 2 milhões de usuários por mês.



## Tarefa: 👈
Criar uma lista de matérias que será vinculada nas páginas de notícias e categorias do site. A funcionalidade pode ser carregada por rolagem do scroll no site ou por paginação. Para um exemplo prático da aplicação segue os links:
Scroll (Seção continue lendo no final do site) - http://hom.gazetaonline.com.br/noticias
Paginação - http://jasonwatmore.com/post/2016/01/31/angularjs-pagination-example-with-logic-like-google



## Critério de avaliação: 👈
- Código bem comentádo e otimizado.
- As tarefas do sistema tem mais peso que do template.



## Requisito: 👍
- Usar Vue.JS versão 1.x para construir o sistema de lista de matérias.
- Utilizar ajax para acessar o json no elemento 'matches' em http://hom.gazetaonline.com.br/api/search?query=noticias&count=24&sort=maisRecentes
- Construir um template simples usando HTML5 e CSS3.
- Fazer um fork desde repositório, a cada nova tarefa terminada enviar um commit e um pull request ao final do teste.
- Atualizar o arquivo README.md marcando com 'X' cada item do lista de matérias concluido.
- A cada loading de notícias mostrar efeito loader.



## Bônus: 👌
- Criar template responsivo.
- Usar Grunt ou Gulp.
- Usar LESS ou SASS.
- Criar um web component da lista de matéria.



## Lista de matérias template:
- [X] HTML e CSS para notícias com imagem, título, descrição e data.
- [X] Botão para carregar mais.
- [X] Efeito loader para carregar notícias.
- [X] Númeração para paginação.
- [X] Botão de anterior e próximo.
- [X] Botão de primeiro e último resultado.

## Lista de matérias por rolagem do scroll:
- [X] Número de matérias carregado por interação sendo 4.
- [X] Total de interações sendo 6.
- [X] Carregar mais resultados ao rolar para o final da página.

## Lista de matérias por paginação:
- [X] Número de matérias carregado por clique em página sendo 4.
- [X] Total de itens de página sendo 6.
- [X] Esconder resultado anterior ao clicar em uma novo item de página.
- [X] Sistema e mostrar botões de páginação por interação.
