// TODO
// - request API key for OSM
// - add contributors : map icons, Fuse.js
// - use sprites for icons
// - icon is reloaded when making a layer visible again
// - layers control : add All on/off toggle ?
// - improve Fuse.js to consider accents ...

// var categories = {
//     101 : {desc: "Musées & Châteaux", icon:"museum_archeological.png"},
//     103 : {desc: "Médiathèque", icon:"library.png"},
//     104 : {desc: "Monument", icon:"mural.png"},
//     105 : {desc: "Ecole Culturelle", icon:"music_choral.png"},
//     106 : {desc: "Salle d'exposition", icon:"museum_art.png"},
//     107 : {desc: "Salle de spectacle", icon:"theater.png"},
//     108 : {desc: "Cinéma", icon:"cinema.png"}
// };

// var setupIcons = function() {

//     var icons = {};
//     for (var cat in categories) {
//         var icon = categories[cat].icon;
//         var url = "images/" + icon;
 
//         var icon = L.icon({
//             iconUrl: url,
//             iconSize: [32, 32],
//             iconAnchor: [16, 37],
//             popupAnchor: [0, -28]
//         });
//         icons[cat] = icon;
//     }
    
//     return icons;
// };

var map;

$(function() {

    // Set map height to remaining window height
    // FIXME Best done with CSS
    $(window).resize(function() {
        // remaining height - 22 (wrapper bottom padding + map border + 1) !
        $('#map').height($(window).height() - $('#map').offset().top - 22);
    });
    $(window).resize();

    // Create a Leaflet map with OSM background
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //var osmLayer = L.tileLayer('http://b.tile.cloudmade.com/9d991d739a924642a9664d59abf90002/1/256/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });

    map = L.map('map', {
        // center: new L.LatLng(47.84091,36.83012),
        center: new L.LatLng(48.0,37.62),
        zoom: 8,
        maxZoom: 18,
        layers: [osmLayer]
    });
// });
// function aazz(){
    // Layer control, setting up 1 layer per category
    var layers = {},
        cultureLayer = L.layerGroup(),
        layerCtrl = L.control.layers();
    // for (var icat in categories) {
    //     var layer = L.featureGroup();
    //     layers[icat] = layer;
    //     cultureLayer.addLayer(layer);
var layer_adm = L.geoJSON(my_geojson, {
    filter: function(feature) {
        return (feature.properties.id > 100);
    }
    
  // oneEachFeature: function(feature,layer) {
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
        // onEachFeature: displayFeatures1,
        // filter: function(feature, layer) {
        //           feature.layer = layer;
        //  return feature.properties.id_tg === tg_id;
        // },
        pointToLayer: function (feature, latlng) {
            // var context = {
            //     feature: feature,
            //     variables: {}
            // };
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
                // riseOnHover: true
            });
            return marker;  
            // return L.circleMarker(latlng, style_WO_centroids_2_0());
        },
        onEachFeature: bindPopup1
    // }).bindPopup(function (layer) {
    //   return layer.feature.properties.ID;
      });
    // .addTo(map);
    map.addLayer(layer_WO_centroids_2);

// L.circleMarker(latlng, style_WO_centroids_2_0(feature));
// layer_WO_centroids_2.setStyle({fillColor :'#f7941d', fillOpacity: 0.2,"weight": 1, color: 'red'});

    // var tg_id="305";
    // layer_WO_centroids_2 = new L.geoJson(json_WO_centroids_2, {
    //     attribution: '',
    //     interactive: true,
    //     dataVar: 'json_WO_centroids_2',
    //     layerName: 'layer_WO_centroids_2',
    //     onEachFeature: pop_WO_centroids_2,
    //     // onEachFeature: displayFeatures1,
    //     filter: function(feature, layer) {
    //               feature.layer = layer;
    //      return feature.properties.id_tg === tg_id;
    //     },
    //     pointToLayer: function (feature, latlng) {
    //         var context = {
    //             feature: feature,
    //             variables: {}
    //         };
    //         return L.circleMarker(latlng, style_WO_centroids_2_0(feature));
    //     },
    // });
    // map.addLayer(layer_WO_centroids_2);
        
    //     var cat = categories[icat],
    //         desc = '<img class="layer-control-img" src="images/' + cat.icon + '"> ' + cat.desc;
    //     layerCtrl.addOverlay(layer, desc);
    // }
    // cultureLayer.addTo(map);
    
    // Information pane
    // L.control.infoPane('infopane', {position: 'bottomright'}).addTo(map);
    
    // Add fuse search control
    var options = {
        position: 'topright',
        title: 'Пошук по: ID, назві, населеному пункті',
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

    // layerCtrl.addTo(map);

    // var icons = setupIcons();


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

    // Load the data
    // jQuery.getJSON("data/lieux_culture_nantes.json", function(data) {
    //     displayFeatures(data.features, layers, icons);
    //     var props = ['ID'];
    //     fuseSearchCtrl.indexFeatures(data.features, props);
    // });
    
});

// function displayFeatures(features, layers, icons) {

//     var popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer());
                    
//     for (var id in features) {
//         var feat = features[id];
//         var cat = feat.properties.categorie;
//         var site = L.geoJson(feat, {
//             pointToLayer: function(feature, latLng) {
//                 var icon = icons[cat];
//                 var marker = L.marker(latLng, {
//                     icon: icon,
//                     keyboard: false,
//                     riseOnHover: true
//                 });
//                 if (! L.touch) {
//                     marker.on('mouseover', function(e) {
//                         var nom = e.target.feature.properties.nom_comple;
//                         var pos = map.latLngToContainerPoint(e.latlng);
//                         popup.innerHTML = nom;
//                         L.DomUtil.setPosition(popup, pos);
//                         L.DomUtil.addClass(popup, 'visible');

//                     }).on('mouseout', function(e) {
//                         L.DomUtil.removeClass(popup, 'visible');
//                     });
//                 }
//                 return marker;
//             },
//             onEachFeature: bindPopup
//         });
//         var layer = layers[cat];
//         if (layer !== undefined) {
//             layer.addLayer(site);
//         }
//     }
//     return layers;
// }

function displayFeatures1(feature, layer) {

    var popup = L.DomUtil.create('div', 'tiny-popup', map.getContainer());
                    
    // for (var id in features) {
        var feat = feature.properties.id;
        var cat = pop_WO_centroids_2();
        console.log(cat);
        // var cat = feat.properties.id;
        var site = L.geoJson(feat, {
            pointToLayer: function(feature, latLng) {
                // var icon = icons[cat];
                var icon = icons[1];
                // L.circleMarker(latlng, style_WO_centroids_2_0(feature))
                var marker = L.marker(latLng, {
                    icon: icon,
                    keyboard: false,
                    riseOnHover: true
                });
                // console.log(feat);
                // console.log(marker);
                if (! L.touch) {
                    marker.on('mouseover', function(e) {
                        var nom = e.target.feature.properties.WO_name;
                        var pos = map.latLngToContainerPoint(e.latlng);
                        // popup.innerHTML = nom;
                        popup.innerHTML = pop_WO_centroids_2();
                        L.DomUtil.setPosition(popup, pos);
                        L.DomUtil.addClass(popup, 'visible');

                    }).on('mouseout', function(e) {
                        L.DomUtil.removeClass(popup, 'visible');
                    });
                }
                return marker;
            },
            // onEachFeature: bindPopup1
            // onEachFeature: pop_WO_centroids_2
        });
        // var layer = layers[cat];
        // if (layer !== undefined) {
        //     layer.addLayer(site);
        // }
    // }
    // return layers;
}

 
// function bindPopup(feature, layer) {
//     // Keep track of the layer(marker)
//     feature.layer = layer;
    
//     var props = feature.properties;
//     if (props) {
//         var desc = '<span id="feature-popup">';
//         desc += '<strong>' + props.id + '</strong><br/>';

//         var cat = props.libtype ? props.libtype : props.libcategor;
//         if (cat !== null) {
//             desc += '<em>' + cat + '</em></br>';
//         }
        
//         var url = props.web;
//         if (url !== null) {
//             desc += '<a href="http://' + url + '" target=_blank>Site web</a></br>';
//         }
         
//         var address = '' + props.adresse + ' ' + props.code_posta + ' ' + props.commune;
//         desc += address + '<br/>';

//         if (props.telephone) {
//             desc += 'Tel: ' + props.telephone + '<br/>';
//         }
        
//         desc += '</span>';
//         layer.bindPopup(desc);
//     }
// }

function bindPopup1(feature, layer) {
    // Keep track of the layer(marker)
    feature.layer = layer;
    
    var props = feature.properties;
    // console.log(props);
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
        // pane: 'pane_WO_centroids_2',
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
  