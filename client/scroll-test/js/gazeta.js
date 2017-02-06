/* Gazeta Scroll Test - Anderson Hese */
Vue.component('gazeta-news-component', { /* criando o component 'gazeta-news-component', que irá mostrar as notícias */
    template: '#template-gazeta-news', /* adicionando o template do component */
    props: ['new'] /* adicionando as propriedades do component */
});

var gazeta = {}; /* Variável para controle de todas as outras variáveis */
gazeta.app_gazeta = new Vue({ /* Iniciando o Vue na variável gazeta.app_gazeta */
    el: '#app_gazeta', /* adicionando o id controlador */
    data: {        
        url : 'http://hom.gazetaonline.com.br/api/search?query=noticias&count=24&sort=maisRecentes',
        news : [], /* variável que guardará todas as noticías */
        loading : false, /* variável que controla a visibilidade do 'img/loading.gif' */
        loading_news : false, /* Para um controle maior do carregando das notícias */
        config : { 
            initial_value_scroll : 0,
            itens_per_scroll : 4
        } /* Variavel para controle das configurações */
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
    var end = false; /* inicia a variável que definirá se as notícias acabaram ou não */ 
    if(gazeta.app_gazeta.config.initial_value_scroll < (data.length/gazeta.app_gazeta.config.itens_per_scroll)){ /* verifica se a quantidade carregada é menor que a quantidade disponível */
        var sending_news = [], /* variável responsável por controlar quais notícias vão aparecer, dependendo do número da página em que você está */
            len = gazeta.app_gazeta.config.itens_per_scroll, /* chama uma variável auxiliar contendo o número máximo de notícias por 'scroll' */
            aux = gazeta.app_gazeta.config.initial_value_scroll * gazeta.app_gazeta.config.itens_per_scroll; /* faz o calculo de qual notícia irá aparecer primeiro */

        while(len--){ /* diminui o valor da variável auxiliar, para que não fique eternamente aqui */
            if(aux < data.length && data[aux]) /* verifica se a variável 'aux' é menor que o número máximo de notícias */
                sending_news.push(data[aux]); /* então adiciona a notícia na variável 'sending_news' */
            else /* se não for válida */
                break; /* para o processo e sai do while */                                    

            aux++; /* adiciona + um a variável 'aux', para que sejá pego a próxima notícia */ 
        } 
    }else /* se a quantidade carregada for maior que a disponível então para o processo */
        end = true; /* e adiciona end, para que não seja carregada mais notícias */

    gazeta.app_gazeta.loading = false; /* torna o 'img/loading.gif' invisivel */

    if(end){ /* caso seja o fim das notícias a flag "end" será verdadeira */
        gazeta.app_gazeta.loading = false; /* então o loading é parado */
    }else{    
        gazeta.app_gazeta.config.initial_value_scroll++; /* caso ainda não seja o fim ele adiciona as notícias ao nosso contador */
        for(var i= 0, len = sending_news.length; i < len; i++){ /* por meio do 'for' adiciona todas as notícias vindas do 'makeGet' */
            gazeta.app_gazeta.news.push({title:sending_news[i].title, desc: sending_news[i].description, pic: sending_news[i].dominantthumbnail, url: sending_news[i].url, date: ConvertDate(sending_news[i].createtime), real_date: sending_news[i].createtime});   
        } 
        gazeta.loading_news = false; /* então o loading é parado */
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

$(window).scroll(function() {  /* Ativando o 'ouvinte' da função scroll, do jquer, sempre que o cliente usar o scroll está função será chamada */ 
    if($(window).scrollTop() + $(window).height() == $(document).height()) { /* verifica que o cliente já atingiu o final da página */
        if(!gazeta.loading_news){ /* verifica também se ele não está "carregando" as notícias */
            gazeta.loading_news = true; /* então ele liga a 'flag' de carregando */
            gazeta.app_gazeta.loading = true; /* torna o 'img/loading.gif' visivel */
            makeGet(gazeta.app_gazeta.url, fillNews, function(){alert("Invalid Action!");}); /* executa o 'makeGet' */
        }
    }
});

makeGet(gazeta.app_gazeta.url, fillNews, function(){alert("Invalid Action!");}); /* Faz a primeira requisição, para carregar as 4 notícias iniciais */