var Xray = require("x-ray");
var ProgressBar = require('progress');
var xray = Xray();
xray.throttle(4, 1000);


var url = 'http://gifts.ru/';

var links = [];
var data = [];

function fillData(d) {
  data.push(d);
}

function fillLinks(data) {
  links.push(data);
}


xray(url, [".main-category a@href"])((err, links)=> {
  var categories = links.filter(item => !item.includes("unikum"));
  var categoryPromises = [];
  categories.forEach(link => categoryPromises.push(new Promise((resolve, reject)=> {
    parseCategory(link, resolve);
  })));
  Promise.all(categoryPromises).then(function () {
    getItemsData(links);
  })
});

function parseCategory(url, pResolve) {
  xray(url, [".paginator a"])(function (err, pages) {
    var pagePromises = [];
    pagePromises.push(new Promise(function (resolve, reject) {
      parsePage(url, resolve);
    }));
    pages.forEach(function (pageNum) {
      pagePromises.push(new Promise(function (resolve, reject) {
        parsePage(url + "/page" + pageNum, resolve);
      }))
    });
    Promise.all(pagePromises).then(function () {
      console.log("Done!" + links.length);
      pResolve();
    });
  });
}
/**
 * Получает с указанного url страницы ссылки из списока товаров и её номер.
 * Затем вызывает процедуру сохранения ссылок.
 * @param url {string} Ссылка на страницу каталога
 * @param done {function} Коллбэк для выполнения промиса
 */
function parsePage(url, done) {
  xray(url, {
      list: [".itm-list .itm-list-link@href"],
      page: ".paginator .select",
      title: "h1.hidden-tablet"
    }
  )(function (err, result) {
    getItemsLinks(result.list, result.page, result.title, done);
  });
}

/**
 * Процедура обрабатывающая переданные ей ссылки, заполняя массив со ссылками
 * на страницы товаров.
 * Если ссылка не указывает на конкрентый товар (разные цвета),
 * процедура запрашивает список товаров по этой ссылке.
 * @param list {Array} Массив ссылок со страницы
 * @param page {number} Номер страницы
 * @param done {function} Коллбэк для выполнения промиса
 */
function getItemsLinks(list, page, title, done) {
  var bar = new ProgressBar('Получение ссылок (страница ' + page + ',категория ' + title + '): :percent | :current/:total | :elapsed c.', {
    total: list.length
  });

  var linksPromises = [];
  list.forEach(function (link) {
    linksPromises.push(new Promise(function (resolve, reject) {
      if (link.indexOf("/id/") < 0) {
        xray(link, {
          items: [".itm-list .itm-list-link@href"]
        })(function (err, list) {
          if (err) console.error(err);
          bar.tick();
          resolve(list.items);
        })
      } else {
        resolve(link);
        bar.tick();
      }
    }).then(function (result) {
      if (Array.isArray(result)) {
        result.forEach(item => fillLinks(item))
      } else {
        fillLinks(result);
      }
    }))
  });
  Promise.all(linksPromises).then(function () {
    done()
  });
}

/**
 * Процедура получения данных о товаре с его страницы,
 * с дальнейшим заполнением глобального массива.
 * @param aLinks {Array} Массив ссылок на страницы конкретных товаров
 */
function getItemsData(aLinks) {
  var bar = new ProgressBar('Получение содержимого: :percent | :current/:total | :elapsed c. :item', {
    total: aLinks.length
  });
  var dataPromises = [];
  aLinks.forEach(function (item) {
    dataPromises.push(new Promise(function (resolve, reject) {
      xray(item, {
        name: ".itm-hdr h1",
        amount: ".lgnr .amount"
      })(function (err, info) {
        bar.tick({item: info.name});
        resolve(info);
      })
    }).then(function (result) {
      fillData(result);
    }))
  });

  Promise.all(dataPromises).then(function () {
    console.log(data.length);
  });
}

