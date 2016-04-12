/**
 * Created by ���� on 17.11.2015.
 */
/*������� button, select.
 �� ������� �� ������ ������������ ajax ������ �� ���� url:

 https://openui5.hana.ondemand.com/test-resources/sap/ui/demokit/explored/products.json

 ����� ��������� ������, ��������� select ���������� �� ������� ProductCollection (������������ ������ Name �������� ������ ���� ProductId)

 ADVANCED:
 ������� �������� "����: "
 ��� ������ �������� � ������� �������� � �������� ��� ����*/

var model = {
    ajaxRequestResult :[],
    ajaxCompleted:false,
 //���� ������
    runAjaxRequest: function () {
       $.ajax({
        url:"https://openui5.hana.ondemand.com/test-resources/sap/ui/demokit/explored/products.json",
        cache: false,
        dataType: "json",
        success: function(data, textStatus){
            model.ajaxCompleted=true;
            //��������������� �������� ����������
            model.ajaxRequestResult=data.ProductCollection;
            //���������� ����������� ������� ��� ���� ������ ������� ��������
            controller.testCompletedAjaxRequest(true)
        }
       });

  }
};

var view = {
    //�������� ������ � �������
   createCss: function(objName){
       //�������
       $.each(objName, function (name, val) {
           $(".ajaxResult").append(
               //���������� ���������� ��� ������� �������� ������ �������
               $('<option/>', {
                   text: val.Name,
                   id: val.ProductId
               })
           )
       });
    //���������� ����������� ������� ��� ������ ������� �����������
    controller.testCompletedCSS(true);
    return false
   },
    //�������� ���������� ����������
    createPar: function (objName) {
        $( "select" )
        .change(function () {
        //��������� ���������� �� ������� �������� � �������� �������� �� id
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
            // ��� �������� ���� ������� ������ �������� ������ � �������
            view.createCss(model.ajaxRequestResult);
        }
    },
    testCompletedCSS: function (stance) {
        if(stance){
            // ��� �������� ���� ������� ������ �������� ���������� ����������
            view.createPar(model.ajaxRequestResult);
        }
    }
};

$(document).ready(function () {
    controller.startWork()
});
