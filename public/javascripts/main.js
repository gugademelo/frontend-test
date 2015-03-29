var RankItemModel = Backbone.Model.extend({
    //seta 0 e 0 no percentual como default, para o caso de não vir numero de positivos e negativos no json
    defaults: {
        "perc_positive": 0,
        "perc_negative": 0
    }
});

var RankItemCollection = Backbone.Collection.extend({
    model: RankItemModel,
    url: 'fazenda.json',

    //ordena pelo percentual de positivos DESC
    comparator: function (item) {
        "use strict";
        return -item.get('perc_positive');
    },

    parse: function (response) {
        "use strict";
        return response.data;
    }

});

var RankItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'rank-item',

    template: _.template($('#rankTemplate').html()),

    events: {
        'mouseover': 'showToolTip',
        'mouseleave': 'hideToolTip'
    },

    render: function () {
        "use strict";
        this.$el.html(this.template(this.model.toJSON()));

        //adiciona algumas classes nos itens para zebrar a lista, adicionar border-radius, etc
        if (this.model.get('first')) { this.$el.addClass('first'); }
        if (this.model.get('last')) { this.$el.addClass('last'); }
        if (this.model.get('even')) { this.$el.addClass('even'); }

        return this;
    },

    showToolTip: function () {
        "use strict";
        $('#' + this.model.get('__id')).fadeIn(50);
    },

    hideToolTip: function () {
        "use strict";
        $('#' + this.model.get('__id')).fadeOut(50);
    }
});

var RankView = Backbone.View.extend({
    tagName: 'ul',
    className: 'rank',

    //gera a collection, adiciona na view e renderiza
    initialize: function () {
        "use strict";
        var rankView = this, rankItemCollection = new RankItemCollection();

        rankItemCollection.fetch({
            success: function (collection) {
                rankView.collection = collection;
                rankView.render();
            }
        });
    },

    render: function () {
        "use strict";
        this.collection.each(function (rankItem) {
            //só faz o calculo de percentual se existirem os campos de positivos e negativos
            if (rankItem.get('positive') !== null && rankItem.get('negative') !== null) {
                var positive = parseInt(rankItem.get('positive'), 10), negative = parseInt(rankItem.get('negative'), 10), perc_positive = (positive / (positive + negative)) * 100;
                perc_positive = perc_positive.toFixed(0);
                var perc_negative = 100 - perc_positive;
                rankItem.set('perc_positive', parseInt(perc_positive, 10));
                rankItem.set('perc_negative', perc_negative);
            }
        });

        //reordena a collection com os percentuais
        this.collection.sort();

        //foreach para setar os numeros das posições dos itens e os atributos usados para adicionar as classes
        //também cria a view individual de cada item da collection e renderiza
        var i = 1, collectionLength = (this.collection.length);
        this.collection.each(function (rankItem) {
            switch (i) {
            case 1:
                rankItem.set('first', true);
                break;
            case collectionLength:
                rankItem.set('last', true);
                break;
            default:
                break;
            }

            if (this.isEven(i)) { rankItem.set('even', true); }
            rankItem.set('position', i);
            i += 1;

            var rankItemView = new RankItemView({model: rankItem});
            this.$el.append(rankItemView.render().el);
        }, this);
        $('.container').append(this.el);
        return this;
    },

    isEven: function (n) {
        "use strict";
        return (n % 2 === 0);
    }
});

//inicia a aplicação
var app = new RankView();