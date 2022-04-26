const selectElement = (element) => document.querySelector(element);

const selectVariableCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

const text_media_query = "(max-width: 900px)";

const wait_time_sidebar = 1000;
const wait_time_close_sidebar = 2100;

/**
 * @param {Object} target - Object target event
 * @returns {Object} Object
 * @property {Array<String, String>} Object.info - array contains name svg and name id main objective
 * @property {Object} Object.link_footer - Object type tagName A
 */
function get_info_link_footer(target){
    let name_target = target.tagName;
    let link_footer = target;

    if(name_target == 'svg'){

        link_footer = target.parentElement;

    }else if(name_target == 'use'){

        link_footer = target.parentElement.parentElement;

    }

    let array_href_link = link_footer.href.split('/');
    let name_id_main = array_href_link.at(-1);

    return {
        name_id_main: name_id_main,
        link_footer: link_footer
    }

}

function event_icon_footer(e){
    e.preventDefault();
    let target = e.target;
    if(target){
        let info_target = get_info_link_footer(target);
        let name_id_main = info_target.name_id_main;
        let link_footer = info_target.link_footer;
        let element_active = selectElement('footer ul li a.active');

        if(element_active != null){
            element_active.classList.remove('active');
        }

        let use_active = element_active.querySelector('svg use');

        if(use_active != null){
            use_active.classList.remove('active');
            use_active.classList.add('init');
        }

        link_footer.classList.add('active');

        let link_footer_use = link_footer.querySelector('svg use');
        link_footer_use.classList.remove('init');
        link_footer_use.classList.add('active');

        if(name_id_main == '#information'){

            open_sidebar_info();

        }else if(name_id_main == '#delete'){

            selectElement(name_id_main).style['animation-name'] = 'fade_in_data';
            selectElement(name_id_main).classList.remove('hide');
            selectElement(name_id_main).classList.add('show');

            setTimeout(() => {
                selectElement(name_id_main).style['animation-name'] = '';
            }, wait_time_sidebar);

        }else{

            let element_main_show = selectElement('main section.show');
            element_main_show.classList.remove('show');
            element_main_show.classList.add('hide');
            selectElement(name_id_main).classList.remove('hide');
            selectElement(name_id_main).classList.add('show');

        }

    }
}

function status_init_form(){

    let link_form_location = selectElement('#link_location');
    
    if(link_form_location.classList.contains('init')){

        if(window.matchMedia(text_media_query).matches){
            
            link_form_location.classList.add('active');

            let link_form_location_use = link_form_location.querySelector('svg use');
            link_form_location_use.classList.remove('init');
            link_form_location_use.classList.add('active');

            let list_info = selectElement('#list_info');

            if(list_info.classList.contains('hide')){
                list_info.classList.remove('hide');

                let use_info = selectElement('#information svg use');

                if(use_info.classList.contains('active')){
                    use_info.classList.remove('active');
                }

                if(use_info.classList.contains('init') == false){
                    use_info.classList.add('init');
                }
            }

            selectElement('footer ul').addEventListener(
                'click',
                event_icon_footer,
                false
            );

        }else{

            let link_active = selectElement('footer ul li a.active');

            if(link_active != null){
                link_active.classList.remove('active');

                let use_active = link_active.querySelector('svg use');

                if(use_active != null){
                    use_active.classList.remove('active');
                    use_active.classList.add('init');
                }

            }

            selectElement('footer ul').removeEventListener(
                'click',
                event_icon_footer,
                false
            );
        }

    }else{
        
        let sidebar_info = selectElement('#information');

        if(sidebar_info.classList.contains('show')){
            selectElement('#information').classList.remove('show');
            selectElement('#information').classList.add('hide');
        }

        if(window.matchMedia(text_media_query).matches == false){
            let sidebar_map = selectElement('#map');
            if(sidebar_map.classList.contains('hide')){
                sidebar_map.classList.remove('hide');
            }
        }
    }
}

/**
 * open sidebaer information
 * @param {String} name_id_main 
 */
function open_sidebar_info(){

    selectElement('#screen').style['animation-name'] = 'fade_in_screen';
    selectElement('#wallpaper').classList.remove('hide');
    selectElement('#wallpaper').classList.add('show');

    setTimeout(() => {

        selectElement('#information').classList.remove('hide');
        selectElement('#information').classList.add('show');
        
    }, wait_time_sidebar);
    
    setTimeout(() => {
        selectElement('#screen').style['animation-name'] = '';
    }, wait_time_close_sidebar);

}

function efect_close_btn_info_mobile(){
    if(window.matchMedia(text_media_query).matches){
        let link_active = selectElement('footer ul li a.active');

        if(link_active != null){
            link_active.classList.remove('active');

            let use_active = link_active.querySelector('svg use');

            if(use_active != null){
                use_active.classList.remove('active');
                use_active.classList.add('init');
            }

        }

        let link_form_location =  selectElement('#link_location');

        link_form_location.classList.add('active');

        let link_form_location_use = link_form_location.querySelector('svg use');

        link_form_location_use.classList.remove('init');
        link_form_location_use.classList.add('active');
    }
}

function close_sidebar_info(e){
    e.preventDefault();
    let btn = e.target;

    if(btn.tagName == 'A' || btn.tagName == 'BUTTON'){
        btn.setAttribute('disabled', true);

        setTimeout(() => {
            btn.removeAttribute('disabled');
        }, wait_time_close_sidebar);

    }

    selectElement('#screen').style['animation-name'] = 'fade_in_screen';

    setTimeout(() => {

        selectElement('#information').classList.remove('show');
        selectElement('#information').classList.add('hide');

        efect_close_btn_info_mobile();
        
    }, wait_time_sidebar);
    
    setTimeout(() => {
        selectElement('#screen').style['animation-name'] = '';
        selectElement('#wallpaper').classList.remove('show');
        selectElement('#wallpaper').classList.add('hide');
    }, wait_time_close_sidebar);
}

/**
 * ajax function json
 * @param {String} url 
 * @returns {Object}
 */
 async function get_data_json(url){
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

/**
 * ajax function json with form data
 * @param {String} url 
 * @param {Object} FormData_input - form data native
 * @returns 
 */
 async function get_post_data_json(url, FormData_input){
    let response = await fetch(url, {
        method : 'POST',
        body : FormData_input
    });
    let data = await response.json();
    return data;
}

function combobox_municipality(select_parish, array_element_tom_select){

    selectElement('#municipality').addEventListener('change', (e) => {
        let cod_mun = e.target.value;

        let FormDataInput = new FormData();
        FormDataInput.append('cod_mun', cod_mun);

        select_parish.destroy();
        selectElement('#parish').innerHTML = '';

        select_parish = new TomSelect('#parish', {
            placeholder: 'Seleccione...'
        });

        array_element_tom_select.forEach((element) => {
            element.clearOptions();
            element.disable();
            element.clear();
        });

        get_post_data_json('assets/php/create_list_parish.php', FormDataInput)
        .then((response) => {
            if (response.response){
                select_parish.addOptions(response.data);
                select_parish.enable();
                select_parish.focus();
            }
        })
        .catch(error => {
            console.log(error);
        })

    }, false);


}

function combobox_parish(select_community, select_distance){
    selectElement('#parish').addEventListener('change', (e) => {
        let cod_parr = e.target.value;

        let FormDataInput = new FormData();
        FormDataInput.append('cod_parr', cod_parr);

        select_community.clearOptions();
        select_community.clear();

        select_distance.clear();

        get_post_data_json(
            'assets/php/create_list_community.php',
            FormDataInput
        )
        .then(response => {
            if(response.response){
                select_community.addOptions(response.data);
                select_community.enable();
                select_community.focus();
            }
        })
    }, false)
}

function create_option_distance_parish(select_distance){
    selectElement('#parish').addEventListener('change', (e) => {
        let cod_parr = e.target.value;
        let regex = new RegExp('(^2313)|(^2317)', 'gi');
        select_distance.clearOptions();
        let indice = 9;
        if(regex.test(cod_parr)){
            indice = 4;

        }

        let data = [{value: '', text: '---'}];
        let n = 0;
        for(var x = 0; x <= indice; x++){
            n += 400;
            data.push({text: n, value: n});
        }

        select_distance.addOptions(data);

    }, false);
}

function combobox_community(select_distance){
    selectElement('#community').addEventListener('change', (e) => {
        select_distance.clear();
        if(e.target && e.target.value != ''){
            select_distance.enable();
            select_distance.focus();
        }else{
            select_distance.disable();
        }
    }, false);

}

const initial_coordinates = {lat: 10.90847, lng: -72.08446};

function initMap(){

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: initial_coordinates,
        gestureHandling: "cooperative",
        fullscreenControl: false,
        streetViewControl: false,
    });

    return map;
}


function add_style_load_data_response(){
    selectElement('#link_location').classList.remove('init');
    status_init_form();

    document.querySelectorAll('footer ul li.list_optional').forEach(element => {
        element.classList.remove('hide');
    })

    if(window.matchMedia(text_media_query).matches){
        selectElement('#list_info').classList.add('hide');
    }
    
}

function add_content_table(data_establishment){
    let tbody = selectElement('#summary_table table tbody');
    data_establishment.forEach(element => {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        let text = document.createTextNode(element.name);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        text = document.createTextNode(element.distance);
        td.appendChild(text);
        tr.appendChild(td);

        td = document.createElement('td');
        let button = document.createElement('button');
        
        button.innerHTML = `<svg><use class="init" xlink:href="#arrow_right"/></svg>`;
        button.setAttribute('data-lat', element.coordinates.lat);
        button.setAttribute('data-lng', element.coordinates.lng);

        td.appendChild(button);
        tr.appendChild(td);

        tbody.appendChild(tr);
    });
}

function show_items_map(){

    let link_active = selectElement('footer ul li a.active');

    if(link_active != null){
        link_active.classList.remove('active');

        let use_active = link_active.querySelector('svg use');

        if(use_active != null){
            use_active.classList.remove('active');
            use_active.classList.add('init');
        }
    }

    let element_main_show = selectElement('main section.show');

    if(element_main_show != null){
        element_main_show.classList.remove('show');
        element_main_show.classList.add('hide');
    }

    if(window.matchMedia(text_media_query).matches){

        selectElement('#list_map a').classList.add('active');
        selectElement('#list_map a svg use').classList.remove('init');
        selectElement('#list_map a svg use').classList.add('active');
        selectElement('#map').classList.remove('hide');
        selectElement('#map').classList.add('show');

    }else{

        selectElement('#list_table_summary a').classList.add('active');
        selectElement('#list_table_summary a svg use').classList.remove('init');
        selectElement('#list_table_summary a svg use').classList.add('active');
        selectElement('#summary_table').classList.remove('hide');
        selectElement('#summary_table').classList.add('show');

    }
}

function add_data_map(data, map){

    show_items_map();

    let markers = [];

    function create_svg_marker(path){
        return {
            path: path,
            fillColor: selectVariableCSS('--firts-color'),
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30)
        };
    }

    let path_marker = "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z";
    let path_house = "m12 3-10 9h3v8h14v-8h3zm0 4.7c2.1 0 3.8 1.7 3.8 3.8 0 3-3.8 6.5-3.8 6.5s-3.8-3.5-3.8-6.5c0-2.1 1.7-3.8 3.8-3.8m0 2.3a1.5 1.5 0 0 0 -1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0 -1.5-1.5z";

    setTimeout(() => {

        var contentString = `<h3 class="text_popup">${data.community.name}</h3>`;

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
        });

        var marker = new google.maps.Marker({
            position: data.community.coordinates,
            map,
            icon: create_svg_marker(path_house),
            title: data.community.name
        });

        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });

        markers.push(marker);
        
        data.establishment.forEach(element => {
            var contentString_estab = `<h3 class="text_popup">${element.name}</h3>`;

            var infowindow_estab = new google.maps.InfoWindow({
                content: contentString_estab,
            });

            var marker_estab = new google.maps.Marker({
                position: element.coordinates,
                map,
                icon: create_svg_marker(path_marker),
                title: element.name
            })
    
            marker_estab.addListener("click", () => {
                infowindow_estab.open({
                  anchor: marker_estab,
                  map,
                  shouldFocus: false,
                });
              });
            
            
            markers.push(marker_estab);
        });

        let circle = new google.maps.Circle({
            strokeColor: selectVariableCSS('--third-color'),
            strokeOpacity: 0.6,
            strokeWeight: 2,
            fillColor: selectVariableCSS('--third-color'),
            fillOpacity: 0.25,
            map,
            center: data.community.coordinates,
            radius: data.community.distance
        });
    
        markers.push(circle);
    
        let bounds = circle.getBounds();
    
        map.fitBounds(bounds);

        function reinit_map(){
            markers.forEach(element => {
                element.setMap(null);
            });

            map.setCenter(initial_coordinates);
            map.setZoom(7);

            selectElement('#preloader_btn_confirm').removeEventListener('click', reinit_map, false);

        }

        selectElement('#preloader_btn_confirm').addEventListener('click', reinit_map, false);


    }, wait_time_sidebar);
}

function add_event_list_web(){
    if(window.matchMedia(text_media_query).matches == false){
        selectElement('footer ul').addEventListener(
            'click',
            event_icon_footer,
            false
        );
    }
}

function event_btn_cancel_preloader(e){

    e.preventDefault();
    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');

    let link_active = selectElement('footer ul li a.active');

    if(link_active != null){
        link_active.classList.remove('active');

        let use_active = link_active.querySelector('svg use');

        if(use_active != null){
            use_active.classList.remove('active');
            use_active.classList.add('init');
        }
    }

    selectElement('main').style['animation-name'] = 'fade_in_data';

    //START EVENT ADD CLASS ACTIVE IN ICON SVG MAIN ACTIVE
    let name_section_active = selectElement('main section.show').id;
    let link_section_active = selectElement(`footer ul li a[href="#${name_section_active}"]`);

    link_section_active.classList.add('active');

    let use_section_active = link_section_active.querySelector('svg use');

    if(use_section_active != null){
        use_section_active.classList.remove('init');
        use_section_active.classList.add('active');
    }
    
    //END EVENT ADD CLASS ACTIVE IN ICON SVG MAIN ACTIVE

    setTimeout(() => {
        selectElement('main').style['animation-name'] = '';
    }, wait_time_sidebar);

}

function stop_animation_loader(class_response){
    var preloader = selectElement('#response_preloader .preloader_wallpaper');
    preloader.classList.add(class_response);
    preloader.classList.add('stop_animation_preloader');
}

function event_btn_confirm_preloader(e){
    e.preventDefault();
    let view_show_current = selectElement('main section.show');
    view_show_current.classList.remove('show');
    view_show_current.classList.add('hide');

    selectElement('#form_location').classList.remove('hide');
    selectElement('#form_location').classList.add('show');

    let link_active =  selectElement('footer ul li a.active');

    if(link_active != null){
        link_active.classList.remove('active');

        let use_active = link_active.querySelector('svg use');

        if(use_active != null){
            use_active.classList.remove('active');
            use_active.classList.add('init');
        }
    }

    selectElement('#link_location').classList.add('init');

    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');

    selectElement('main').style['animation-name'] = 'fade_in_data';

    document.querySelectorAll('li.list_optional').forEach(element => {
        element.classList.add('hide');
    })

    selectElement('#summary_table table tbody').innerHTML = '';

    status_init_form();

    setTimeout(() => {
        selectElement('main').style['animation-name'] = '';
    }, wait_time_sidebar);

}

function restart_style_preloader(){
    var preloader = selectElement('#response_preloader .preloader_wallpaper');
    preloader.classList.remove('error');
    preloader.classList.remove('success');
    preloader.classList.remove('stop_animation_preloader');

    selectElement('#response_preloader').classList.remove('show');
    selectElement('#response_preloader').classList.add('hide');

}

function restart_style_preloader_click_button(e){
    e.preventDefault;
    let btn = e.target;
    btn.disabled = true;

    restart_style_preloader();

    let msg_error = selectElement('#msg_error');

    msg_error.innerHTML = '';
    msg_error.classList.remove('show');
    msg_error.classList.add('hide');

    selectElement('main').style['animation-name'] = 'fade_in_data';

    setTimeout(() => {
        btn.removeAttribute('disabled');
        selectElement('main').style['animation-name'] = '';
    }, wait_time_sidebar);

}

function reinit_form(array_tom_select){
    selectElement('#query_location input[type="submit"]').removeAttribute('disabled');
    selectElement('#btn_geolocation').removeAttribute('disabled');

    array_tom_select.forEach(element => {
        element.disable();
    })
}

function verifyCoordinateLimits(ObjectLatLng){
    var lat= ObjectLatLng.lat,
        lng = ObjectLatLng.lng;
        
    var limitLat = lat >= 8.36808 && lat <= 11.85079,
        limitLng = lng >= -73.37939 && lng <= -70.66714;
        
    if(limitLat == true && limitLng == true){
        return true;
    }else{
        return false;
    }
}

function init_location(btn, map){
    btn.setAttribute('disabled', true);

    selectElement('#response_preloader').classList.remove('hide');
    selectElement('#response_preloader').classList.add('show');
    selectElement('#response_preloader').style['animation-name'] = 'fade_in_data';

    let msg_error = selectElement('#msg_error')

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let accuracy  = parseInt(position.coords.accuracy);

                let verifyCoordinate = verifyCoordinateLimits({lat: lat, lng: lng});

                if(accuracy > 100){

                    stop_animation_loader('error');
                    btn.removeAttribute('disabled');

                    msg_error.innerHTML = 'No se obtuvo buena precisión en la geolocalización';
                    msg_error.classList.remove('hide');
                    msg_error.classList.add('show');
                    

                }else{

                    if(verifyCoordinate == false){

                        stop_animation_loader('error');
                        btn.removeAttribute('disabled');

                        msg_error.innerHTML = '¡Disculpe! Usted se encuentra fuera del área de influencia del estado Zulia - Venezuela';
                        msg_error.classList.remove('hide');
                        msg_error.classList.add('show');

                    }else{

                        let FormData_input = new FormData();
                        FormData_input.append('lat', lat);
                        FormData_input.append('lng', lng);

                        get_post_data_json(
                            'assets/php/create_list_establishment_location.php',
                            FormData_input
                        )
                        .then(response => {
                            if(response.response){
                                stop_animation_loader('success');
                
                                add_style_load_data_response();
                                add_content_table(response.data.establishment);
                                add_data_map(response.data, map);
                                add_event_list_web();

                                selectElement('#query_location input[type="submit"]').setAttribute('disabled', true);
                                
                            }else{
                                stop_animation_loader('error');
                                msg_error.innerHTML = response.message;
                                msg_error.classList.remove('hide');
                                msg_error.classList.add('show');
                                btn.removeAttribute('disabled');
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            stop_animation_loader('error');
                            btn.removeAttribute('disabled');

                        })

                    }

                }

            },
            (error) => {
                console.log(error);
                stop_animation_loader('error');
                msg_error.innerHTML = 'Acceso denegado a la ubicación del dispositivo';
                msg_error.classList.remove('hide');
                msg_error.classList.add('show');
                btn.removeAttribute('disabled');
            }
        )

    }else{
        stop_animation_loader('error');
        msg_error.innerHTML = 'El navegador web no es compatible con la función de geolocalización';
        msg_error.classList.remove('hide');
        msg_error.classList.add('show');
        btn.removeAttribute('disabled');
    }
        
}

function load(data_municipality){

    status_init_form();
    window.addEventListener('resize', status_init_form, false);

    document.querySelectorAll('.close_btn_info').forEach((element) => {
        element.addEventListener('click', close_sidebar_info, false);
    })

    selectElement('#btn_info_web').addEventListener('click', (e) => {
        e.preventDefault();
        open_sidebar_info();
    }, false);

    selectElement('#preloader_btn_cancel').addEventListener('click', event_btn_cancel_preloader, false);

    selectElement('#preloader_btn_confirm').addEventListener('click', event_btn_confirm_preloader, false);

    selectElement('#restart_preloader').addEventListener('click', restart_style_preloader_click_button, false);

    selectElement('#form_location nav ul').addEventListener('click', (e) => {
        e.preventDefault();
        if(e.target && e.target.tagName == 'A'){
            selectElement('#form_location nav ul li a.active').classList.remove('active');
            e.target.classList.add('active');
            let href = e.target.getAttribute('href');

            let element_show = selectElement('#form_location .show');
            element_show.classList.remove('show');
            element_show.classList.add('hide');

            selectElement(href).classList.remove('hide');
            selectElement(href).classList.add('show');
            
        }
    }, false);

    let municipality = new TomSelect('#municipality', {
        placeholder: 'Seleccione...'
    });

    let parish = new TomSelect('#parish', {
        placeholder: 'Seleccione...'
    });

    let community = new TomSelect('#community', {
        placeholder: 'Seleccione...'
    })

    let distance = new TomSelect('#distance', {
        placeholder: 'seleccione...'
    });

    municipality.addOptions(data_municipality);

    selectElement('#preloader_btn_confirm').addEventListener(
        'click', 
        (e) => {
            reinit_form([parish, community, distance])
        }, 
        false
    );

    combobox_municipality(parish, [community, distance]);
    combobox_parish(community, distance);
    create_option_distance_parish(distance);
    combobox_community(distance);

    let map = initMap();

    selectElement('#summary_table table').addEventListener('click', (e) => {
        if(e.target){
            let name_target = e.target.tagName;
            let btn = null;
            if(name_target == 'BUTTON'){
                btn = e.target;
            }else if(name_target == 'svg'){
                btn = e.target.parentElement;
            }else if(name_target == 'use'){
                btn = e.target.parentElement.parentElement;
            }

            if(btn != null){
                
                let coordinates = {
                    lat : parseFloat(btn.getAttribute('data-lat')),
                    lng: parseFloat(btn.getAttribute('data-lng'))
                }

                show_items_map();

                
                setTimeout(() => {
                    map.setCenter(coordinates);
                    map.setZoom(18);
                }, wait_time_sidebar);
                
                
            }
        }
    }, false);

    selectElement('#btn_geolocation').addEventListener('click', (e) =>{
        e.preventDefault();
        let btn = e.target;
        init_location(btn, map);
    }, false);

    selectElement('#query_location').addEventListener('submit', (e) => {
        e.preventDefault();
        let form = new FormData(e.target);
        let submit = e.target.querySelector('input[type="submit"]');
        submit.setAttribute('disabled', true);

        selectElement('#response_preloader').classList.remove('hide');
        selectElement('#response_preloader').classList.add('show');

        selectElement('#response_preloader').style['animation-name'] = 'fade_in_data';

        setTimeout(() => {
            selectElement('#response_preloader').style['animation-name'] = '';
        }, wait_time_sidebar);

        let msg_error = selectElement('#msg_error');

        get_post_data_json(
            'assets/php/create_list_establishment_health.php',
            form
        )
        .then(response => {
            
            if(response.response){
                stop_animation_loader('success');

                add_style_load_data_response();
                add_content_table(response.data.establishment);
                add_data_map(response.data, map);
                add_event_list_web();

                selectElement('#btn_geolocation').setAttribute('disabled', true);
                
            }else{

                stop_animation_loader('error');
                msg_error.innerHTML = response.message;
                msg_error.classList.remove('hide');
                msg_error.classList.add('show');

                reinit_form([parish, community, distance]);

                submit.removeAttribute('disabled');

            }

        })
        .catch(error => {
            stop_animation_loader('error');
            console.log(error);
            reinit_form([parish, community, distance]);
            submit.removeAttribute('disabled');
        })

    }, false);

}

const appHeight = () => {
    const doc = document.documentElement;
    let vh = window.innerHeight * 0.01;
    doc.style.setProperty('--app-height', `${vh}px`)
}

window.addEventListener('load', (e) => {

    if(window.matchMedia('(pointer: coarse)').matches){
        appHeight();
        window.addEventListener('resize', appHeight, false);
    }

    var preloader = selectElement('#init_preloader .preloader_wallpaper');

    get_data_json('assets/php/create_list_municipality.php')
    .then(response =>{
        if(response.response){
            preloader.classList.add('success');
            preloader.classList.add('stop_animation_preloader');

            setTimeout(() => {
                selectElement('#init_preloader').classList.remove('show');
                selectElement('#init_preloader').classList.add('hide');

                selectElement('main').classList.remove('hide');
                selectElement('main').style['animation-name'] = 'fade_in_data';

                load(response.data);
                
            }, wait_time_close_sidebar);

            setTimeout(() => {
                selectElement('main').style['animation-name'] = '';
            }, wait_time_close_sidebar);

        }else{
            preloader.classList.add('error');
            preloader.classList.add('stop_animation_preloader');
        }
    })
    .catch(error => {
        console.log(error);
    });
}, false);