

var myMap;
var myGeoObject;

$(document).ready(function(){
    
    ymaps.ready(init);

    $('#map').css({
        height: (window.screen.availHeight - 50) + 'px', 
        width: window.screen.availWidth + 'px'
    });

});

function getHelp() {
    getLocation();

}

function getLocation() {

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
    console.log(position.coords.latitude + ", " + position.coords.longitude);
    
    myMap.geoObjects
        .add(new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {
            iconContent: 'нужна помощь!',
            balloonContent: 'пользователь не зарегистрирован'
        }, {
            preset: 'islands#redStretchyIcon',
            iconColor: 'red'
        }));
}

function init() {
    
        myMap = new ymaps.Map("map", {
            center: [42.882004, 74.582748],
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        });

        // Создаем геообъект с типом геометрии "Точка".
        myGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            // geometry: {
            //     type: "Point",
            //     coordinates: [42.882004, 74.582748]
            // },
        });
        // myPieChart = new ymaps.Placemark([
        //     55.847, 37.6
        // ], {
        //     // Данные для построения диаграммы.
        //     data: [
        //         {weight: 8, color: '#0E4779'},
        //         {weight: 6, color: '#1E98FF'},
        //         {weight: 4, color: '#82CDFF'}
        //     ],
        //     iconCaption: "Диаграмма"
        // }, {
        //     // Зададим произвольный макет метки.
        //     iconLayout: 'default#pieChart',
        //     // Радиус диаграммы в пикселях.
        //     iconPieChartRadius: 30,
        //     // Радиус центральной части макета.
        //     iconPieChartCoreRadius: 10,
        //     // Стиль заливки центральной части.
        //     iconPieChartCoreFillStyle: '#ffffff',
        //     // Cтиль линий-разделителей секторов и внешней обводки диаграммы.
        //     iconPieChartStrokeStyle: '#ffffff',
        //     // Ширина линий-разделителей секторов и внешней обводки диаграммы.
        //     iconPieChartStrokeWidth: 3,
        //     // Максимальная ширина подписи метки.
        //     iconPieChartCaptionMaxWidth: 200
        // });

    // myMap.geoObjects
    //     .add(myGeoObject)
    //     .add(new ymaps.Placemark([42.843318, 74.608349], {
    //         iconContent: 'нужна помощь!',
    //         balloonContent: 'пользователь не зарегистрирован'
    //     }, {
    //         preset: 'islands#redStretchyIcon',
    //         iconColor: 'red'
    //     }));
}
