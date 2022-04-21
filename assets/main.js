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

    let use_footer = link_footer.firstElementChild.firstElementChild;
    let name_svg = use_footer.getAttribute('xlink:href');

    let array_href_link = link_footer.href.split('/');
    let name_id_main = array_href_link.at(-1);

    return {
        info: [name_svg, name_id_main],
        link_footer: link_footer
    }

}

function event_icon_footer(e){
    e.preventDefault();
    let target = e.target;
    if(target){
        let info_target = get_info_link_footer(target);
        let [name_svg, name_id_main] = info_target.info;
        let link_footer = info_target.link_footer;
        selectElement('footer ul li a.active').classList.remove('active');
        selectElement('symbol.active').classList.remove('active');

        link_footer.classList.add('active');
        selectElement(name_svg).classList.add('active');

        if(name_id_main == '#information'){

            open_sidebar_info();

        }else if(name_id_main == '#delete'){

            console.log('crear popup delete');

        }else{

            let element_main_show = selectElement('main section.show');
            element_main_show.classList.remove('show');
            element_main_show.classList.add('hide');
            selectElement(name_id_main).classList.remove('hide');
            selectElement(name_id_main).classList.add('show');

        }

    }
}

function remove_class_active(element){
    if(element != null){
        element.classList.remove('active');
    }
}

function status_init_form(){

    let link_form_location = selectElement('#link_location');
    
    if(link_form_location.classList.contains('init')){

        if(window.matchMedia(text_media_query).matches){
            
            link_form_location.classList.add('active');
            selectElement('#form_svg').classList.add('active');

            selectElement('footer ul').addEventListener(
                'click',
                event_icon_footer,
                false
            );

        }else{

            let link_active = selectElement('footer ul li a.active');
            let symbol = selectElement('symbol.active');
            remove_class_active(link_active);
            remove_class_active(symbol);

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
        remove_class_active(link_active);
        
        let symbol_active = selectElement('symbol.active');
        remove_class_active(symbol_active);

        selectElement('#link_location').classList.add('active');
        selectElement('#form_svg').classList.add('active');
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

        select_parish.clearOptions();
        select_parish.clear();

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
        
        button.innerHTML = `<svg><use xlink:href="#arrow_right"/></svg>`;
        button.setAttribute('data-lat', element.coordinates.lat);
        button.setAttribute('data-lng', element.coordinates.lng);

        td.appendChild(button);
        tr.appendChild(td);

        tbody.appendChild(tr);
    });
}

function show_items_map_mobile(){
    if(window.matchMedia(text_media_query).matches){
        selectElement('footer ul li a.active').classList.remove('active');
        selectElement('symbol.active').classList.remove('active');
        let element_main_show = selectElement('main section.show');
        element_main_show.classList.remove('show');
        element_main_show.classList.add('hide');

        selectElement('#list_map a').classList.add('active');
        selectElement('#map_location').classList.add('active');
        selectElement('#map').classList.remove('hide');
        selectElement('#map').classList.add('show');
    }
}

function add_data_map(data, map){

    show_items_map_mobile();

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


    }, wait_time_sidebar);
}

function load(){

    status_init_form();
    window.addEventListener('resize', status_init_form, false);

    document.querySelectorAll('.close_btn_info').forEach((element) => {
        element.addEventListener('click', close_sidebar_info, false);
    })

    selectElement('#btn_info_web').addEventListener('click', (e) => {
        e.preventDefault();
        open_sidebar_info();
    }, false);

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

    get_data_json('assets/php/create_list_municipality.php')
    .then(response =>{
        if(response.response){
            municipality.addOptions(response.data);
        }
    })
    .catch(error => {
        console.log(error);
    });

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

                show_items_map_mobile();

                
                setTimeout(() => {
                    map.setCenter(coordinates);
                    map.setZoom(18);
                }, wait_time_sidebar);
                

                /*
                
                button.addEventListener('click', function(e){
                    let btn = e.target;
                    btn.disabled = true;
                    selectElement('#map').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                    setTimeout(() =>{
                        map.setCenter(location);
                        map.setZoom(18);
                        btn.removeAttribute('disabled')
                    }, 1000);
                }, false);
                */
            }
        }
    }, false);

    selectElement('#query_location').addEventListener('submit', (e) => {
        e.preventDefault();
        let form = new FormData(e.target);
        let submit = e.target.querySelector('input[type="submit"]');
        submit.setAttribute('disabled', true);

        get_post_data_json(
            'assets/php/create_list_establishment_health.php',
            form
        )
        .then(response => {
            if(response.response){
                add_style_load_data_response();
                add_content_table(response.data.establishment);
                add_data_map(response.data, map);
                console.log(response.data);
            }
        })
        .catch(error => {
            console.log(error);
        })

    }, false);


}

window.addEventListener('load', load, false);