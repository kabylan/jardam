
let helpNeedsData = [];
let myMap;
let myGeoObject;

let showBeforeHours = 12;

$(document).ready(function(){
    moment.locale('ru'); 
    ymaps.ready(init);

    $('#map').css({
        height: (window.screen.availHeight - 150) + 'px', 
        width: window.screen.availWidth + 'px'
    });

    let timerId = setTimeout(function tick(){

        timerId = setTimeout(tick, 30*1000);

        getThenShowHelpNeeds();

    }, 30*1000);
    
    elementsChanges();
});


function elementsChanges() {
    
    $('#timeToShowRange').on('input', function () {
        $(this).trigger('change');
        $('#timeToShowTxt').text($(this).val());

        showBeforeHours = parseFloat($(this).val());
    });

    showHelpNeeds();
}

function getThenShowHelpNeeds() {

    console.log("Обновление меток");
    $.ajax({
        type: "GET",
        url: "https://localhost:44391/HelpDatas",
        success: function (data) {

            helpNeedsData = data;
            // createDateTime: "2022-06-01T22:36:52.3999775"
            // lat: "112.00"
            // long: "1223.00"
            // userFirstName: "Куштар"
            // userLastName: "Тимка"

            
            showHelpNeeds();
    
        },
        // error: function (xhr, ajaxOptions, thrownError) {
        //     console.log(xhr);
            
        // },
        // complete: function (data) {
        //     console.log(data);
            
        // }
    });
}

function showHelpNeeds() {

    let data = helpNeedsData;

    let halfAnHourAgo = moment().subtract(30, 'minutes').toDate().getTime();
    let twelveHoursAgo = moment().subtract(showBeforeHours, 'hours').toDate().getTime();

    data.forEach(m => {

        // отображать метки не позднее 12 часов
        if (moment(m.createDateTime) < twelveHoursAgo) return;

        // метки до 30 минут красного цвета, если больше то серого цвета
        let iconColor = moment(m.createDateTime) > halfAnHourAgo ? 'red' : 'grey'; 

        // пользователь
        let forWhom = m.userFirstName != null ? '<b>' + m.userFirstName + m.userLastName + '</b>': 
            '<span class="text-muted">Неизвестно кто</span>';
        let balloonContent = "Вызов от: " +  forWhom;

        // время создания и сколько прошло
        balloonContent += "<br><b class='text-primary'>" + moment(m.createDateTime).fromNow() + "</b>";
        balloonContent += "<br>" + moment(m.createDateTime).format('HH:mm DD.MM.YYYY ') ;

        // добавить метку на карте
        myMap.geoObjects
        .add(new ymaps.Placemark([parseFloat(m.lat), parseFloat(m.long)], {
            iconContent: 'Нужна помощь! - ' + forWhom,
            balloonContent: balloonContent
        }, {
            preset: `islands#${iconColor}StretchyIcon`,
            iconColor: iconColor
        }));
    });
}

function getHelp() {
    getLocation();
}

function sendLocation(lat, long) {
    $.ajax({
        type: "POST",
        url: "https://localhost:44391/HelpDatas/Create",
        data: {
            Id : null,
            CreateDateTime  : null,
            Lat: lat + '',
            Long: long + '',
            UserID  : null,
            User  : null 
        },
         
        dataType: 'json',  
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            
        },
        complete: function (data) {
            console.log(data);
            
        }
    });
}

function getLocation() {

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
}

function showPosition(position) {
    console.log(position.coords.latitude + ", " + position.coords.longitude);
    
    // myMap.geoObjects
    //     .add(new ymaps.Placemark([position.coords.latitude, position.coords.longitude], {
    //         iconContent: 'нужна помощь!',
    //         balloonContent: 'пользователь не зарегистрирован'
    //     }, {
    //         preset: 'islands#redStretchyIcon',
    //         iconColor: 'red'
    //     }));

    sendLocation(position.coords.latitude, position.coords.longitude);

    getThenShowHelpNeeds();
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

    getThenShowHelpNeeds();

}
