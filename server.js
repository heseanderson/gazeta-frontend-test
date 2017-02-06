var _gazeta = {}; /* iniciando a variável que guardará todas as outras, para ter um controle melhor */

_gazeta.config = { /* iniciando a variável de configuração */
    httpPort: 8080, /* definindo a porta padrão para comunicação */ 
    folder: '/client' /* definindo em qual pasta está localizado o cliente (scroll e pagination) */
};

const express = require('express'), /* carregando lib 'express', para comunicação entre servidor ~ cliente */
      server = express(), /* instanciando a variável server com o express */
      path = require('path'), /* carregando lib 'path' responsável por apontar as pastas do cliente */
      key = path.join(__dirname, _gazeta.config.folder); /* configurando a pasta */


server.use('/', express.static(key)); /* servidor agora irá usar como base a pasta '/' dentro do diretório especificado anteriormente */

server.listen(_gazeta.config.httpPort, function() { /* faz com que o servidor 'escute' na porta '_gazeta.config.httpPort', podendo agora receber chamadas do cliente */
    console.log("Abra o seu navegador em http://localhost:8080/scroll-test/ - para acessar o teste de scroll"); /* log */
    console.log("Abra o seu navegador em http://localhost:8080/pagination-test/ - para acessar o teste de paginação"); /* log */
    console.log('Servidor pronto em localhost:' + _gazeta.config.httpPort); /* log */    
}); 

