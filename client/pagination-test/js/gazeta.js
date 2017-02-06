/* Gazeta Pagination Test - Anderson Hese */
Vue.component('gazeta-news-component', { /* criando o component 'gazeta-news-component', que irá mostrar as notícias */
    template: '#template-gazeta-news', /* adicionando o template do component */
    props: ['new'] /* adicionando as propriedades do component */
});

var gazeta = {}; /* variável para controle de todas as outras variáveis */
gazeta.app_gazeta = new Vue({ /* Iniciando o Vue na variável gazeta.app_gazeta */
    el: '#app_gazeta', /* adicionando o id controlador */
    data: {
        url : 'http://hom.gazetaonline.com.br/api/search?query=noticias&count=24&sort=maisRecentes', /*url para fazer os 'get'*/
        news: [], /* variável que guardará todas as noticías */ 
        pages: [], /* variável que guardará a paginação */
        loading: true, /* variável que controla a visibilidade do 'img/loading.gif' */  
        total_pages: 0, /* variável que guardará o total de páginas */
        config: {
            itens_per_page: 4, /* itens mostrados por página */
            pages_display_max_number: 2,/* número máximo de butões que serão visiveis (antes e depois) do botão principal (que foi clicado) na páginação */
            number_page: 1 /* o usuário sempre iniciará na página 1 e essa variável controlará isso */
        }        
    }
});


/* Função que faz requisições para o servidor. */
function makeGet(url, success_callback, fail_callback){
    $.get(url) /* A função .get pede por parâmetro uma url */
        .done(function(data){  /* .done = quando o $.get retornar algo, com sucesso, ele chamará está função */
        if(data && data.matches && data.matches.length) /* se a variável data, que contem os resultados, for diferente de nula e existir resultados em "data.matches" */
            success_callback(data.matches); /* então chamará o success_callback */
        else
            success_callback([]); /* mas caso não haja notícias ele passa por aqui */

    })
        .fail(function(){ /* .fal = caso não algum erro aconteça no processo o $.get chamará está função */
        fail_callback(); /* então é chamada a função de erro */
    });
}

/* Função que irá preencher a variável "news" responsável por guardar todas as notícias */
function fillNews(data){

    gazeta.app_gazeta.total_pages = Math.ceil(data.length / gazeta.app_gazeta.config.itens_per_page); /* 'gazeta.app_gazeta.total_pages' guardará o número de máximo páginas, está usando 'Math.ceil' para pegar o número correto da divisão, exemplo: se o resultado fosse 6.25 (25/4) iria virar 7 */

    var sending_news = [], /* variável responsável por controlar quais notícias vão aparecer, dependendo do número da página em que você está */
        len = gazeta.app_gazeta.config.itens_per_page, /* chama uma variável auxiliar contendo o número máximo de notícias por página */
        aux = (gazeta.app_gazeta.config.number_page-1) * gazeta.app_gazeta.config.itens_per_page;  /* faz o calculo de qual notícia irá aparecer primeiro, caso o usuário vá para a página 'dois' o sistema terá que mostrar como primeira notícia a de número 5 */

    while(len--){ /* diminui o valor da variável auxiliar, para que não fique eternamente aqui */
        if(aux <= data.length && data[aux])  /* verifica se a variável 'aux' é menor que o número máximo de notícias */
            sending_news.push(data[aux]); /* então adiciona a notícia na variável 'sending_news' */
        else /* se não for válida */
            break; /* para o processo e sai do while */                            

        aux++; /* adiciona + um a variável 'aux', para que sejá pego a próxima notícia */ 
    }


    gazeta.app_gazeta.pages = []; /* reseta o número páginas visiveis */

    if(gazeta.app_gazeta.config.number_page > gazeta.app_gazeta.total_pages) /* verificação: controla se o número da página é maior que a de páginas disponíveis*/
        gazeta.app_gazeta.config.number_page = gazeta.app_gazeta.total_pages;  /* se for muda o valor de 'gazeta.app_gazeta.config.number_page' para 'gazeta.app_gazeta.total_pages' */

    pagination(); /* executa a função */

    gazeta.app_gazeta.loading = false; /* remove o loading */

    gazeta.app_gazeta.news = []; /* reseta as notícias, para que só sejam mostradas as novas */

    for(var i= 0, len = sending_news.length; i < len; i++){ /* por meio do 'for' adiciona todas as notícias vindas do 'makeGet' */
        gazeta.app_gazeta.news.push({title:sending_news[i].title, desc: sending_news[i].description, pic: sending_news[i].dominantthumbnail, url: sending_news[i].url, date: ConvertDate(sending_news[i].createtime), real_date: sending_news[i].createtime});   
    } 
}

/* Função para conversão de "Data" para "String" de uma maneira simples */
/* A função pede como parâmetro uma data em formato de String, exemplo: 2017-02-04T13:05:35.000Z */
function ConvertDate(date){
    if(date){        
        const now = new Date(); /* cria-se uma constante para defirmos a data de hoje */
        var aux = new Date(date); /* transforma a string recebida como parâmetro "date" em data */

        if(now.getDate() == aux.getDate() && now.getMonth() == aux.getMonth() && now.getYear() == aux.getYear()){ /* verifica se a notícia é da mesma data do sistema */
            return "hoje às "+aux.getHours()+"h"; /* se for já retorna com valor, exemplo : 'hoje às 18h' */
        }else{
            if(now.getDate() - aux.getDate() == 1 && now.getMonth() == aux.getMonth() && now.getYear() == aux.getYear()){ /* verifica se a data da notícia e a data de processamento tem um dia de diferença */ 
                return "ontem às "+aux.getHours()+"h"; /* se for já retorna com valor, exemplo : 'ontem às 7h' */
            }else{
                if(now.getMonth() == aux.getMonth() && now.getYear() == aux.getYear()){ /* verifica se estão no mesmo mês e ano */
                    return ""+("0" + aux.getDate()).slice(-2)+"/"+("0" + (aux.getMonth() + 1)).slice(-2)+"";  /* se for já retorna com valor, exemplo : '02/02' */
                }else{
                    return ("0" + aux.getDate()).slice(-2)+"/"+("0" + (aux.getMonth() + 1)).slice(-2)+"/"+aux.getFullYear(); /* se não for nenhuma das anteriores retorna o valor '02/02/2016'*/
                }
            }
        }
    }
    return ""; /* se o valor do parametro "date" for nulo ele retorna uma valor vazio */
}

/* função que gera um array tendo o primeiro item o valor de 'start' e o último com o valor de 'end', exemplo: range(1,5) -> [1,2,3,4,5] */
function range(start, end){
    var range = []; /* inicia a variável que servirá como retorno */
    var step = 1; /* variável responsável por fazer os "passos" entre um número e outro */

    /* então é feio um 'while' para adicionar os números entre o 'start' e 'end' */
    while (step > 0 ? end >= start : end <= start) {
        range.push(start);
        start += step;
    }    

    return range; /* retorna o array com o range de start~end */
}

/* 'setPage' é responsável por chamar o 'makeGet' que por sua vez comunica-se com o servidor, dizendo em qual página você está, retornando então as noticias pertencentes a aquela página */
function setPage(page){

    $("#loading").center(); /* adiciona o img/loading.gif no meio atual da página */

    /* verifica a página que o usuário quer acessar é válida */
    if(page != gazeta.app_gazeta.config.number_page && page > 0 && page <= gazeta.app_gazeta.total_pages){
        gazeta.app_gazeta.config.number_page = page; /* então muda o número da página, para que seja enviada no 'makeGet' */
        gazeta.app_gazeta.loading = true; /* inicia o loading */
        makeGet(gazeta.app_gazeta.url, fillNews, function(){alert("Invalid Action!");});  /* executa o 'makeGet' */     
    }
}

/* responsável por criar e adicionar os botões das páginas disponíveis */
/* incluindo "primeira", "anterior", "próxima" e "última" */
function pagination(){

    var aux_min = parseInt(gazeta.app_gazeta.config.number_page) - gazeta.app_gazeta.config.pages_display_max_number; /* grava em uma variável auxiliar o valor minimo das páginas visiveis */
    var aux_max = parseInt(gazeta.app_gazeta.config.number_page) + gazeta.app_gazeta.config.pages_display_max_number; /* grava em uma variável auxiliar o valor máximo das páginas visiveis */

    if(aux_min <= 0) /* verifica se o valor minimo é menor ou igual a zero */
        aux_min = 1; /* se for muda o valor para 1, que é minimo */
    if(aux_max > gazeta.app_gazeta.total_pages) /* verifica se o valor máximo é maior que o número máximo de páginas */
        aux_max = gazeta.app_gazeta.total_pages; /* então adiciona a 'aux_max' o valor de 'gazeta.total_pages' que é o número máximo de páginas */


    var aux_dis_ant = false; /* variável para controlar se o botão 'anterior' e 'primeiro' está desabilitado */
    if(gazeta.app_gazeta.config.number_page == 1) /* se o número da página for igual ao valor mínimo (1) */
        aux_dis_ant = true; /* então desabilita o botão 'anterior' e 'primeiro' */

    /* botão responsável por levar o usuário até a primeira página */
    gazeta.app_gazeta.pages.push({name : 'primeiro', id : 1, active: false, disable: aux_dis_ant});

    /* guarda o valor da página anterior (página atual - 1) */
    var aux_anterior = (gazeta.app_gazeta.config.number_page-1) <= 0? 1 : (gazeta.app_gazeta.config.number_page-1);

    /* botão responsável por levar o usuário até a página anterior */ 
    gazeta.app_gazeta.pages.push({name : 'anterior', id : aux_anterior, active: false, disable: aux_dis_ant});

    /* variável que guardará o valor entre o 'aux_min' e 'aux_max' */
    var aux = range(aux_min, aux_max);        

    /* for para gerar os botões */
    for(var i = 0, len = aux.length; i < len; i++){
        var ac = false; /* variável para controlar se o botão está ativo */
        if(aux[i] == gazeta.app_gazeta.config.number_page) /* se o número do botão for o mesmo da página atual */
            ac = true; /* então ativa o botão */

        /* adicionao o botão a variável 'gazeta.app_gazeta.pages' responsável por guardar todos os botões das páginas */
        gazeta.app_gazeta.pages.push({name :aux[i], id : aux[i], active: ac});
    }

    var aux_dis_prox = false; /* variável para controlar se o botão 'próximo' e 'último' está desabilitado */
    if(gazeta.app_gazeta.config.number_page == gazeta.app_gazeta.total_pages) /* se o número da página for igual ao valor máximo ('gazeta.total_pages') */
        aux_dis_prox = true; /* então desabilita o botão 'próximo' e 'último' */

    /* guarda o valor da próxima página (página atual + 1) */
    var aux_proximo = (gazeta.app_gazeta.config.number_page+1) >= gazeta.app_gazeta.total_pages? gazeta.app_gazeta.total_pages : (gazeta.app_gazeta.config.number_page+1);

    /* botão responsável por levar o usuário até a próxima página */ 
    gazeta.app_gazeta.pages.push({name : 'próximo', id : aux_proximo, active: false, disable: aux_dis_prox});

    /* botão responsável por levar o usuário até a última página */ 
    gazeta.app_gazeta.pages.push({name : 'último', id : gazeta.app_gazeta.total_pages, active: false, disable: aux_dis_prox});

}

/* adicionando uma função na lib 'jQuery', que servirá para mandarmos um elemento até o centro atual da tela */
jQuery.fn.center = function () {
    this.css("position","absolute"); /* mudando a posição do elemento, para 'absolute' */
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px"); /* calcula a posição do 'centro' da tela pegando o valor da tela, menos o valor da tela com todos os atributos (borda, preenchimento e afins), divide por dois e então adiciona o 'scroll' que o usuário fez, pegando como base o topo */
    this.css("width: ", "140px"); /* adicionando um valor em 'largura' apenas para ter certeza que não ficará vazio */
    return this; /* retorna o elemento modificado, para que assim as alterações (acima) sejam concluídas */
}

$("#loading").center(); /* muda a posição do loading para a do centro atual da tela */
makeGet(gazeta.app_gazeta.url, fillNews, function(){alert("Invalid Action!");}); /* Faz a primeira requisição, para carregar as 4 notícias iniciais */