/**
 * Created by –айч on 17.11.2015.
 */
/*—оздать button, select.
 ѕо нажатии на кнопку производитс€ ajax запрос на этот url:

 https://openui5.hana.ondemand.com/test-resources/sap/ui/demokit/explored/products.json

 ѕосле получени€ ответа, заполнить select продуктами из массива ProductCollection (ќтображатьс€ должен Name значение должно быть ProductId)

 ADVANCED:
 создать параграф "÷ена: "
 ѕри выборе продукта в селекте выводить в параграф его цену*/

var model = {
    ajaxRequestResult :[],
    ajaxCompleted:false,
 //а€кс запрос
    runAjaxRequest: function () {
       $.ajax({
        url:"https://openui5.hana.ondemand.com/test-resources/sap/ui/demokit/explored/products.json",
        cache: false,
        dataType: "json",
        success: function(data, textStatus){
            model.ajaxCompleted=true;
            //переопределение значени€ переменной
            model.ajaxRequestResult=data.ProductCollection;
            //присвоение контроллеру статуса что а€кс запрос успешно выполнен
            controller.testCompletedAjaxRequest(true)
        }
       });

  }
};

var view = {
    //создание списка в селекте
   createCss: function(objName){
       //выборка
       $.each(objName, function (name, val) {
           $(".ajaxResult").append(
               //присвоение информации дл€ каждого жлемента внутри селекте
               $('<option/>', {
                   text: val.Name,
                   id: val.ProductId
               })
           )
       });
    //присвоение контроллеру статуса что селект успешно сформирован
    controller.testCompletedCSS(true);
    return false
   },
    //создание справочной информации
    createPar: function (objName) {
        $( "select" )
        .change(function () {
        //сравнение выбранного из селекта элемента с массивом объектов по id
            $( "select option:selected" ).each(function() {
                $.each(objName, function (name, val) {
                  if(val.ProductId==($("select option:selected").attr("id"))){
                      $( ".descr" ).text( "Price: " + val.Price);
                  }
                });
            });
        })
        .change();

    }
};

var controller = {
    startWork: function () {
        $("#runAjaxRequest").click(function () {
            if(model.ajaxCompleted==false)
            model.runAjaxRequest()
        })
    },
    testCompletedAjaxRequest: function (stance) {
        if(stance){
            // при успешном а€кс запросе запуск создани€ списка в селекте
            view.createCss(model.ajaxRequestResult);
        }
    },
    testCompletedCSS: function (stance) {
        if(stance){
            // при успешном а€кс запросе запуск создани€ справочной информации
            view.createPar(model.ajaxRequestResult);
        }
    }
};

$(document).ready(function () {
    controller.startWork()
});
