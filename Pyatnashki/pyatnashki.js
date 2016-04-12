/**
 * Created by ���� on 22.10.2015.
 */

//Модель
var model;
model = {
    tableValue: [
        ["2", "5", "7"],
        ["3", "4", ""],
        ["6", "1", "8"]
    ],
    clickedBool: false,
    //Создадим структуру
    createStructure: function () {
        //Создаем создаем таблицу, крепим её к div, инициализируем и объявляем переменную для создания строк в таблице.
        var mytable = $('<table/>', {
            class: 'mytable'
        });
        $('.content').append(mytable);
        var itr = 0;

        //
        $.each(model.tableValue, function () {
            itr++;
            //Переопределяем строку
            var DataCell = $('<tr/>');
            $('.mytable').append(DataCell);
            //Пробегаемся по строкам, создаем ячейки, присваиваем им id и содержимое.
            var itd = 0;
            $.each(this, function () {
                itd++;
                var tdId = itr.toString() + itd.toString();
                DataCell.append(
                    $('<td/>', {
                        text: this,
                        id: tdId
                    })
                );

            });

        });
        // присвоение класса main
        model.changeMainStance();
    },
    changeMainStance: function () {
        // определение главной ячейки путем присвоения класса main
        $('td').each(function (index, element) {
            var a = $(element).html();
            if (a == "") {
                $(element).addClass('main');
            } else {
                $(element).removeClass('main')
            }

        });

    },
    changeClickedStance: function () {
        // смена состояния главной ячейки (нажата/не нажата)
        this.clickedBool = !this.clickedBool;
        return this.clickedBool;
    },
    replaceValues: function (e) {
        if (model.clickedBool) {
            console.log(model.clickedBool);
            $('td').each(function (index, element) {
                //рассчет координат ячеек с которыми возможно взаимодействие. Вверх/вниз шаг на 10, вправо/влево шаг на 1
                if ($(this).html() == '') {
                    $(this).html(e.html());
                    e.html("");
                    console.log(e.html() + "   " + e.attr("id"));
                    console.log($(this).html());
                    $('.moveable').removeAttr('class');
                    model.changeMainStance();
                    model.clickedBool = false;

                }
            });
        }

    }
};

var view = {
    //Настройка графического отображения взаимодействующих ячеек путем присвоения классов
    selectByColor: function (e) {
        if(e.html()==""){
            if (model.changeClickedStance()){
                $('td').each(function(index, element){
                    //рассчет координат ячеек с которыми возможно взаимодействие. Вверх/вниз шаг на 10, вправо/влево шаг на 1
                    var valEl = Math.abs($(element).attr('id')-e.attr('id'));
                    if(valEl==10||valEl==1){
                        var ds =  $(element).attr('id');
                        $("#"+ds).addClass('moveable');

                    }
                });
            } else {
                $('.moveable').removeAttr('class' );

            }
        }

   return false;
    }

};

var controller= {
    playThis: function () {
        $('td').click(function () {
            if($(this).attr('class')=='main'){
                view.selectByColor($(this));
            } else if($(this).attr('class')=='moveable'){
                model.replaceValues($(this));
            } else {
                return false;
            }
        })
    }
};
$(document).ready(function () {
    model.createStructure();
    controller.playThis();
});


