var map;

$(function() {
    $(window).resize(function() {
        // remaining height - 22 (wrapper bottom padding + map border + 1) !
        $('#map').height($(window).height() - $('#map').offset().top - 22);
    });
    $(window).resize();

    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //var osmLayer = L.tileLayer('http://b.tile.cloudmade.com/9d991d739a924642a9664d59abf90002/1/256/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
 
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'], 
          attribution: 'Google Satellite. Інвентаризація 2021'
        
    });

    var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community. Інвентаризація 2021'
    });

    map = L.map('map', {
        // center: new L.LatLng(47.84091,36.83012),
        center: new L.LatLng(48.0,37.62),
        zoom: 8,
        maxZoom: 18,
        layers: [osmLayer]
    });

     var baseMaps = {
      "OpenStreetMap": osmLayer,
      "Esri_WorldImagery": Esri_WorldImagery,
      "Google_Sat": googleSat
  };
  var layerControl = L.control.layers(baseMaps).addTo(map);

    var layers = {},
        cultureLayer = L.layerGroup(),
        layerCtrl = L.control.layers(basemaps);
var layer_adm = L.geoJSON(my_geojson, {
    filter: function(feature) {
        return (feature.properties.id > 100);
    }
    
    }).bindPopup(function (layer) {
      return layer.feature.properties.ADMIN_3+" "+layer.feature.properties.TYPE+'<br />'+layer.feature.properties.ADMIN_2 ;
      // return layer.feature.properties.ADMIN_2;
      // style: admStyle
  }).addTo(map);

layer_adm.setStyle({fillColor :'#f7941d', fillOpacity: 0.2,"weight": 1, color: 'red'});

    var tg_id="305";
    layer_WO_centroids_2 = new L.geoJson(json_WO_centroids_2, {
        attribution: '',
        interactive: true,
        dataVar: 'json_WO_centroids_2',
        layerName: 'layer_WO_centroids_2',
        onEachFeature: pop_WO_centroids_2,
        pointToLayer: function (feature, latlng) {
              var marker = L.circleMarker(latlng, {
                radius: 4.0,
                opacity: 1,
                color: 'rgba(35,35,35,1.0)',
                dashArray: '',
                lineCap: 'butt',
                lineJoin: 'miter',
                weight: 1,
                fill: true,
                fillOpacity: 1,
                fillColor: 'rgba(165,187,248,1.0)',
                interactive: true,
                // keyboard: false,
                riseOnHover: true,
                riseOffset: 250,
            });
            return marker;  
        },
        onEachFeature: bindPopup1
      });
    map.addLayer(layer_WO_centroids_2);

 // Add fuse search control
    var options = {
        position: 'topright',
        title: 'Пошук по: ID, назві, населеному пункту',
        placeholder: 'ID, назва, населений пункт',
        maxResultLength: 15,
        threshold: 0.5,
        showInvisibleFeatures: true,
        showResultFct: function(feature, container) {
            props = feature.properties;
            var name = L.DomUtil.create('b', null, container);
            name.innerHTML = props.ID;
            container.appendChild(L.DomUtil.create('br', null, container));
            var info = '' + props.WO_name + ', ' + props.city_name;
            container.appendChild(document.createTextNode(info));
        }
    };
    var fuseSearchCtrl = L.control.fuseSearch(options);
    map.addControl(fuseSearchCtrl);

   function pop_WO_centroids_2(feature, layer) {
    var popupContent = '<table class="my_table">\
        <tr>\
          <td class="name_row"> ID</td>\
          <td class="row_value">' + feature.properties['ID'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Площа водного дзеркала при НПР, га</td>\
          <td class="row_value">' + feature.properties['Площа водного дзеркала при НПР_ га'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Об\'єм при НПР, тис.м3</td>\
          <td class="row_value">' + feature.properties['Об\'єм при НПР_ тис.куб.м'] + '</td>\
        </tr>\
        <tr>\
        <tr>\
          <td class="name_row"> Населений пункт</td>\
          <td class="row_value">' + feature.properties['city_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Район</td>\
          <td class="row_value">' + feature.properties['Район'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Територіальна громада</td>\
          <td class="row_value">' + feature.properties['tg_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Назва ВО</td>\
          <td class="row_value">' + feature.properties['WO_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Тип гідрографії</td>\
          <td class="row_value">' + feature.properties['Тип об\'єкта гідрографії'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Тип ВО</td>\
          <td class="row_value">' + feature.properties['Тип водного об\'єкта'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Назва водотоку, на якому розташовано ВО (басейн річки)</td>\
          <td class="row_value">' + feature.properties['Назва водотоку_ на якому розташовано водний об\'єкт_ басейн річки'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Суббасейн</td>\
          <td class="row_value">' + feature.properties['Суббасейн'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Район річкового басейну</td>\
          <td class="row_value">' + feature.properties['Район річкового басейну'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Код водогосподарської ділянки</td>\
          <td class="row_value">' + feature.properties['Водогосподарська ділянка _код_'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Паспорт водного об’єкта (дата погодження)</td>\
          <td class="row_value">' + feature.properties['Паспорт водного об\'єкта _дата погодження_'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Паспорт рибогосподарської технологічної водойми  (дата погодження)</td>\
          <td class="row_value">' + feature.properties['Паспорт рибогосподарської технологічної водойми _дата погодження_'] + '</td>\
        </tr>\
          <td class="name_row"> Форма власності ГТС</td>\
          <td class="row_value">' + feature.properties['Форма власності гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Форма власності ГТС</td>\
          <td class="row_value">' + feature.properties['Форма власності гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Балансоутримувач\/орендар\/власник ГТС</td>\
          <td class="row_value">' + feature.properties['Балансоутримувач_орендар_власник гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Стан ГТС (задовільний\/незадовільний\/аварійний)</td>\
          <td class="row_value">' + feature.properties['Стан гідротехнічної споруди (задовільний_незадовільний_аварійний)'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Можливість регулювання стоку</td>\
          <td class="row_value">' + feature.properties['Можливість регулювання стоку'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Кадастровий номер земельної ділянки під ВО</td>\
          <td class="row_value">' + feature.properties['Кадастровий номер земельної ділянки під водним об\'єктом'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Форма власності на ділянку</td>\
          <td class="row_value">' + feature.properties['Форма власності на ділянку'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Користувач ділянки під ВО</td>\
          <td class="row_value">' + feature.properties['Користувач ділянки під водним об\'єктом'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Орендар ВО</td>\
          <td class="row_value">' + feature.properties['Орендар водного об\'єкта'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Орендодавець</td>\
          <td class="row_value">' + feature.properties['Орендодавець'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Номер договору, за яким орендується ВО, період дії</td>\
          <td class="row_value">' + feature.properties['Номер договору_ за яким орендується водний об\'єкт_ період дії'] + '</td>\
        </tr>\
      </table>';
      // layer.bindPopup(popupContent, {maxHeight: 300});
      return popupContent;
    }

    var props = ['ID', 'WO_name', 'city_name'];
    fuseSearchCtrl.indexFeatures(json_WO_centroids_2.features, props);
   
});

function displayFeatures1(feature, layer) {

    var popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer());
                    
        var feat = feature.properties.id;
        var cat = pop_WO_centroids_2();
        console.log(cat);
        var site = L.geoJson(feat, {
            pointToLayer: function(feature, latLng) {
                // var icon = icons[cat];
                var icon = icons[1];
                var marker = L.marker(latLng, {
                    icon: icon,
                    keyboard: false,
                    riseOnHover: true
                });
                if (! L.touch) {
                    marker.on('mouseover', function(e) {
                        var nom = e.target.feature.properties.WO_name;
                        var pos = map.latLngToContainerPoint(e.latlng);
                        popup.innerHTML = pop_WO_centroids_2();
                        L.DomUtil.setPosition(popup, pos);
                        L.DomUtil.addClass(popup, 'visible');
                    }).on('mouseout', function(e) {
                        L.DomUtil.removeClass(popup, 'visible');
                    });
                }
                return marker;
            },
        });
}
 
function bindPopup1(feature, layer) {
    feature.layer = layer;
    var props = feature.properties;
    if (props) {
      var popupContent = '<table class="my_table">\
        <tr>\
          <td class="name_row"> ID</td>\
          <td class="row_value">' + feature.properties['ID'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Площа водного дзеркала при НПР, га</td>\
          <td class="row_value">' + feature.properties['Площа водного дзеркала при НПР_ га'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Об\'єм при НПР, тис.м3</td>\
          <td class="row_value">' + feature.properties['Об\'єм при НПР_ тис.куб.м'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Населений пункт</td>\
          <td class="row_value">' + feature.properties['city_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Район</td>\
          <td class="row_value">' + feature.properties['Район'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Територіальна громада</td>\
          <td class="row_value">' + feature.properties['tg_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Назва ВО</td>\
          <td class="row_value">' + feature.properties['WO_name'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Тип гідрографії</td>\
          <td class="row_value">' + feature.properties['Тип об\'єкта гідрографії'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Тип ВО</td>\
          <td class="row_value">' + feature.properties['Тип водного об\'єкта'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Назва водотоку, на якому розташовано ВО (басейн річки)</td>\
          <td class="row_value">' + feature.properties['Назва водотоку_ на якому розташовано водний об\'єкт_ басейн річки'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Суббасейн</td>\
          <td class="row_value">' + feature.properties['Суббасейн'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Район річкового басейну</td>\
          <td class="row_value">' + feature.properties['Район річкового басейну'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Код водогосподарської ділянки</td>\
          <td class="row_value">' + feature.properties['Водогосподарська ділянка _код_'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Паспорт водного об’єкта (дата погодження)</td>\
          <td class="row_value">' + feature.properties['Паспорт водного об\'єкта _дата погодження_'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Паспорт рибогосподарської технологічної водойми  (дата погодження)</td>\
          <td class="row_value">' + feature.properties['Паспорт рибогосподарської технологічної водойми _дата погодження_'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Форма власності ГТС</td>\
          <td class="row_value">' + feature.properties['Форма власності гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Форма власності ГТС</td>\
          <td class="row_value">' + feature.properties['Форма власності гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Балансоутримувач\/орендар\/власник ГТС</td>\
          <td class="row_value">' + feature.properties['Балансоутримувач_орендар_власник гідротехнічної споруди'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Стан ГТС (задовільний\/незадовільний\/аварійний)</td>\
          <td class="row_value">' + feature.properties['Стан гідротехнічної споруди (задовільний_незадовільний_аварійний)'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Можливість регулювання стоку</td>\
          <td class="row_value">' + feature.properties['Можливість регулювання стоку'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Кадастровий номер земельної ділянки під ВО</td>\
          <td class="row_value">' + feature.properties['Кадастровий номер земельної ділянки під водним об\'єктом'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Форма власності на ділянку</td>\
          <td class="row_value">' + feature.properties['Форма власності на ділянку'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Користувач ділянки під ВО</td>\
          <td class="row_value">' + feature.properties['Користувач ділянки під водним об\'єктом'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Орендар ВО</td>\
          <td class="row_value">' + feature.properties['Орендар водного об\'єкта'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Орендодавець</td>\
          <td class="row_value">' + feature.properties['Орендодавець'] + '</td>\
        </tr>\
        <tr>\
          <td class="name_row"> Номер договору, за яким орендується ВО, період дії</td>\
          <td class="row_value">' + feature.properties['Номер договору_ за яким орендується водний об\'єкт_ період дії'] + '</td>\
        </tr>\
      </table>';

        layer.bindPopup(popupContent, {maxHeight: 270});
    }
}
function style_WO_centroids_2_0() {
    return {
        radius: 4.0,
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(165,187,248,1.0)',
        interactive: true,
    }
}
