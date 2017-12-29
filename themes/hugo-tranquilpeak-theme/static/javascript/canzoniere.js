// COSE DA FARE AL CARICAMENTO DEL DOM
  $(document).ready(function() {
  });
// FUNZIONI "VUE RELATED"
Vue.component('canzoniselezionate', {
    name: 'canzoniselezionate',
    props: ['daticanzone'],
    template: '<span>{{daticanzone.titolo}} <small>(in {{daticanzone.tonalita}} <span v-if="daticanzone.transpose!=0"class="badge"><span v-if="daticanzone.transpose>0">+</span>{{daticanzone.transpose}}</span> )</small> </span>'
});


Vue.component('AddButton', {
  template: '<a v-on:click="AddToCanzoniere(row)" class="tooltip-top" data-tooltip="Aggiungi al canzoniere"><span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span></a>',
  props: ['row'],

    methods: {
        AddToCanzoniere: function(song) {
            var temp = new Object;
            temp = JSON.parse(JSON.stringify(song));
            temp.transpose = 0;
            app.canzoniere.selezionecanzoni.push(temp);
        }
    }
});

Vue.component('pdflink', {
  template: '<span><a target="_blank" :href="\'/canzoni/\'+ (row.identificatore) + \'/\'" class="tooltip-top" data-tooltip="Guarda il testo della canzone"><i class="fa fa-music" aria-hidden="true"></i> </a> <a target="_blank" :href="\'https://pdf.canzoniereonline.it/\' + (row.identificatore) + \'.pdf\'" class="tooltip-top" data-tooltip="Scarica il pdf" ><i class="fa fa-file-pdf-o" aria-hidden="true"></i></a></span>',
  props: ['row']
});

var app = new Vue({
  el: '#app',
  data: {
    canzoniere:{
        selezionecanzoni: [],
        formatopagina: "standard",
        cappello: "",
        email: "",
        carattere: "Palatino",
        copertina: false,
        indiceautore: false,
        indicetitolo: false,
        indicemomenti: false,
        sottotitolo: "",
        titolo: "",
        versioneaccordi: true,
        eula: false,
        versionetesto: false,
        numerocolonne: 1
    },
    elencocanzoni: [],
    colonne: [
            {label: 'Titolo', field: 'titolo'},
            {label: 'Momenti', field: 'momenti'},
            {label: 'Autore', field: 'autore'},
            {label: 'Tonalita', field: 'tonalita'},
            {label: 'Link', component: 'pdflink'},
            {label: 'Aggiungi', component: 'AddButton'}
        ],
    pagesize: 20,
    backup: [],
    evento: 0,
    undocheck: false,
    hash: ""
  },
    mounted: function() { 
    $.get( "https://canzoniereonline.it/canzoni.json", function( data ) {
    app.elencocanzoni = data;
    });
    if (window.location.search.substr(1) == "reset"){
        localStorage.clear();
        window.location.href="https://canzoniereonline.it/crea/canzoniere/";
    }
    if (window.location.search.substr(1).length > 5){
        $.get( "https://api.canzoniereonline.it/load/" + window.location.search.substr(1), function( data ) {
            app.canzoniere = JSON.parse(data);
        }); 
    } else { 
    this.backup = JSON.parse(localStorage.backup);
        if (this.backup[1] !== undefined) {
            this.canzoniere = JSON.parse(JSON.stringify(this.backup[0]));
            this.undocheck = true;
        };
    }
    if (this.canzoniere.copertina == true){
        $("#campi_copertina").show();
    }
    setTimeout(function(){app.canzoniere.eula = true; app.canzoniere.eula = false;}, 2000);

    
  },
    watch: {
        'canzoniere.selezionecanzoni': function(){
            if (this.undocheck){
                this.backup.shift();
                this.undocheck = false;
            } else {
            if (this.backup.length > 50) {this.backup.pop();}
            this.backup.unshift(JSON.parse(JSON.stringify(this.canzoniere)));
            localStorage.backup = JSON.stringify(this.backup);
            }
        },
        evento: function(){
            if (this.backup.length > 50) {this.backup.pop();}
            this.backup.unshift(JSON.parse(JSON.stringify(this.canzoniere)));
            localStorage.backup = JSON.stringify(this.backup);
        }
    },
    methods:{
        undo: function(){
            this.undocheck = true;
            if (this.backup[1] !== undefined) {
                this.canzoniere = JSON.parse(JSON.stringify(this.backup[1]));
            }
        },
        sort: function(){
            var temp = new Object
            temp = _.orderBy(this.canzoniere.selezionecanzoni, 'identificatore', 'asc');
            this.canzoniere.selezionecanzoni = JSON.parse(JSON.stringify(temp));

        },
        send: function(){
            console.log(this.canzoniere)
            var senddata = new Object
            senddata.canzoniere = JSON.stringify(this.canzoniere)
            $.post( "https://api.canzoniereonline.it/crea", senddata)  
            .done(function( data ) {
                alert("Complimenti, il tuo canzoniere è stato inviato per l'elaborazione\n\nIl numero univoco ad esso associato è: * " + data + " *\n\nDovrebbe arrivarti una mail in pochi secondi con il risultato del tuo lavoro. \nBuone cantate!")
                location.href = "https://canzoniereonline.it/crea/canzoniere/"                
            })
            .fail(function() {
                alert( "error" )
            })
        },
        erase: function(){
            this.canzoniere.selezionecanzoni=[];
        },
        load: function(){
            window.location.href="https://canzoniereonline.it/crea/canzoniere/?" + app.hash;
        }
    }
});

//nasconde campi copertina

$("#copertina").change(function() {
    if(this.checked) {
        $("#campi_copertina").slideDown();
    } else {
        $("#campi_copertina").slideUp();
    }
});

//listener per select


$("select.form-control").on("change", function(){
//app.pagesize = parseInt(this.value);
});

$("#carattere").on("change", function(){
//app.canzoniere.carattere = this.value;
});

$("#formatopagina").on("change", function(){
//app.canzoniere.formatopagina = this.value;
});

$("#numerocolonne").on("change", function(){
//app.canzoniere.numerocolonne = this.value;
});



