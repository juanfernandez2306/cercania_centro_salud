const selectElement = (element) => document.querySelector(element);

const selectVariableCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

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

function load_input_select({
    data_municipality,
    selectMunicipality,
    selectParish,
    selectCommunity,
    selectDistance
}){

    selectMunicipality.setChoices(data_municipality);

    let data_distance_urban = [{label: '---', value: '', selected: true},
    {label: '200', value: '200'}, {label: '400', value: '400'},
    {label: '600', value: '600'}, {label: '800', value: '800'},
    {label: '1000', value: '1000'}
    ];

    let data_distance_rural = [{label: '---', value: '', selected: true},
    {label: '400', value: '400'}, {label: '800', value: '800'},
    {label: '1000', value: '1000'}, {label: '1500', value: '1500'},
    {label: '2000', value: '2000'}
    ];

    selectElement('#municipality').addEventListener('change', (e)=>{
        let selectInput = e.target;
        let cod_mun = selectInput.value;

        let FormDataInput = new FormData();
        FormDataInput.append('cod_mun', cod_mun);
        selectParish.clearChoices();
        selectParish.disable();
        selectCommunity.clearStore();
        selectCommunity.disable();
        selectDistance.clearStore();
        selectDistance.disable();

        if(cod_mun == 2313 || cod_mun == 2317){
            selectDistance.setChoices(data_distance_urban)
        }else{
            selectDistance.setChoices(data_distance_rural);
        }
        
        
        const url_parish = 'assets/php/create_list_parish.php';
        get_post_data_json(url_parish, FormDataInput)
        .then(response => {
            if(response.response){
                selectParish.setChoices(response.data);
                selectParish.enable();
            }
        })
        .catch(error => {
            console.log(error);
        })

    }, false);

    selectElement('#parish').addEventListener('change', (e) => {
        let selectInput = e.target;
        let cod_parr = selectInput.value;
        let FormDataInput = new FormData();
        FormDataInput.append('cod_parr', cod_parr);

        selectCommunity.clearChoices();
        selectCommunity.disable();
        selectDistance.enable();

        const url_community = 'assets/php/create_list_community.php';
        get_post_data_json(url_community, FormDataInput)
        .then(response => {
            if(response.response){
                selectCommunity.setChoices(response.data);
                selectCommunity.enable();
            }
        })
        .catch(error => {
            console.log(error);
        })

    }, false);

};

const initial_coordinates = {lat: 10.90847, lng: -72.08446};

function initMap(){
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: initial_coordinates,
    });

    return map;
}

function load_data_map(data_response, map){
    let data_community = data_response.community;
    let data_tbody = data_response.establishment;
    newCenter = {lat: data_community.lat, lng: data_community.lng};
    
    let svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: selectVariableCSS('--firts-color'),
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
      };
    

    let markers = [];

    data_tbody.forEach((element) => {
        var contentString = `<h3 class="text_popup">${element.name}</h3>`;
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
        });

        var latlng = {lat: element.lat, lng: element.lng};

        var marker = new google.maps.Marker({
            position: latlng,
            map,
            icon: svgMarker,
            title: element.name
        })

        marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              map,
              shouldFocus: false,
            });
          });
        
        
        markers.push(marker);
    })

    let circle = new google.maps.Circle({
        strokeColor: selectVariableCSS('--color-error'),
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: selectVariableCSS('--color-error'),
        fillOpacity: 0.35,
        map,
        center: newCenter,
        radius: 1000
    });

    markers.push(circle);

    let bounds = circle.getBounds();
    console.log(bounds);

    map.fitBounds(bounds);

    /*
    map.setCenter(newCenter);
    map.setZoom(15);
    */
    console.log(markers);
}

function load_data_response(data_response, map){
    let tbody = selectElement('#summary_table tbody');
    let data_tbody = data_response.establishment;
    data_tbody.forEach(element => {
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
        let location = {lat: element.lat, lng: element.lng};
        
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
        
        button.innerHTML = `<svg><use xlink:href="#arrow_right"/></svg>`;
        td.appendChild(button);
        tr.appendChild(td);

        tbody.appendChild(tr);
    });

    
    let data_community = data_response.community;
    newCenter = {lat: data_community.lat, lng: data_community.lng};
    let markers = [];
    data_tbody.forEach((element) => {
        markers.push(
            new google.maps.Marker({
                position: {lat: element.lat, lng: element.lng},
                map,
                title: element.name
            })
        )
    })

    map.setCenter(newCenter);
    map.setZoom(15);
    console.log(markers);
    
}

function create_data_table(data_response, map){
    let tbody = selectElement('#summary_table tbody');
    let data_tbody = data_response.establishment;
    data_tbody.forEach(element => {
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
        let location = {lat: element.lat, lng: element.lng};
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
        button.innerHTML = `<svg><use xlink:href="#arrow_right"/></svg>`;
        td.appendChild(button);
        tr.appendChild(td);

        tbody.appendChild(tr);
    });
}

function view_main_data(e){
    e.preventDefault();
    let element_target = e.target;

    if(element_target.tagName == 'use'){
        element_target = element_target.parentElement.parentElement;
    }else if(element_target.tagName == 'svg'){
        element_target = element_target.parentElement;
    }

    let href_element_target = element_target.href;
    let array_href = href_element_target.split('/');
    let name_id_section_target = array_href[array_href.length - 1];
    
    if(element_target.classList.contains('active') == false){
        let element_use_target = element_target.firstElementChild.firstElementChild;
        let name_svg_target = element_use_target.getAttribute('xlink:href');

        selectElement('.footer_icon ul li a.active').classList.remove('active');
        selectElement('symbol.active').classList.remove('active');

        element_target.classList.add('active');
        selectElement(name_svg_target).classList.add('active');

        let section_past = selectElement('main section.show');
        if(name_id_section_target != '#delete'){
            section_past.classList.remove('show');
            section_past.classList.add('hide');
        }

        let section_current = selectElement(name_id_section_target);
        section_current.classList.remove('hide');
        section_current.classList.add('show');

        selectElement('body').style['animation-name'] = 'fade_in_data';

        setTimeout(()=>{
            selectElement('body').style['animation-name'] = '';
        }, 1000)
    }
}

function event_btn_cancel_preloader(e){
    e.preventDefault();
    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');
    selectElement('.footer_icon ul li a.active').classList.remove('active');
    selectElement('#eraser').classList.remove('active');
    selectElement('body').style['animation-name'] = 'fade_in_data';

    //START EVENT ADD CLASS ACTIVE IN ICON SVG MAIN ACTIVE
    let name_section_active = selectElement('main section.show').id;
    let link_section_active = selectElement(`.footer_icon ul li a[href="#${name_section_active}"]`);
    let name_icon_svg_section_active = link_section_active.firstElementChild.firstElementChild.getAttribute('xlink:href');
    
    link_section_active.classList.add('active');
    selectElement(name_icon_svg_section_active).classList.add('active');
    //END EVENT ADD CLASS ACTIVE IN ICON SVG MAIN ACTIVE

    setTimeout(() => {
        selectElement('body').style['animation-name'] = '';
    }, 1000);
}

function event_btn_confirm_preloader(e){
    e.preventDefault();
    let view_show_current = selectElement('main section.show');
    view_show_current.classList.remove('show');
    view_show_current.classList.add('hide');

    selectElement('#form_location').classList.remove('hide');
    selectElement('#form_location').classList.add('show');

    selectElement('.footer_icon ul li a.active').classList.remove('active');
    selectElement('symbol.active').classList.remove('active');

    document.querySelectorAll('.footer_icon ul li').forEach((element) =>{
        element.classList.add('hide');
    });

    selectElement('.footer_icon ul li:first-child').classList.remove('hide');

    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');
    selectElement('body').style['animation-name'] = 'fade_in_data';

    selectElement('.footer_icon ul').removeEventListener('click', view_main_data, false);
    selectElement('.footer_icon ul').addEventListener('click', event_inactive, false);

    setTimeout(() => {
        selectElement('body').style['animation-name'] = '';
    }, 1000);
}

function event_btn_form_location(e){
    e.preventDefault();
    if (e.target.tagName == 'A'){
        selectElement('#form_location nav ul li a.active').classList.remove('active');
        e.target.classList.add('active');
        let href_section = e.target.href;
        let array_href = href_section.split('/');
        let id_name_aside = array_href[array_href.length -1];
        let aside_current = selectElement('#form_location aside.show');
        aside_current.classList.remove('show');
        aside_current.classList.add('hide');
        selectElement(id_name_aside).classList.remove('hide');
        selectElement(id_name_aside).classList.add('show');

    }
}

function event_inactive(e){
    e.preventDefault();
}

const text_media_query = '(min-width: 900px)';

function move_footer_icon(){
    let footer = selectElement('section.footer_icon');
    let parentElementFooter = footer.parentElement.tagName;
    
    if(window.matchMedia(text_media_query).matches){
        if(parentElementFooter === 'BODY'){
            selectElement('main').append(footer);
        }
    }else{
        if(parentElementFooter === 'MAIN'){
            selectElement('body').append(footer);
        }
    }
}

function visualize_map(){
    if(window.matchMedia(text_media_query).matches){
        let element_map = selectElement('#map');
        let link_list_active = selectElement('.footer_icon ul li a.active');
        if(link_list_active == null){
            selectElement('#form_location').classList.remove('hide');
            selectElement('#form_location').classList.add('show');
        }else{
            let array_href_element_list = link_list_active.href.split('/');
            let href_element_list = array_href_element_list[array_href_element_list.length -1];
            if(href_element_list == '#map'){
                selectElement('.footer_icon ul li a.active').classList.remove('active');
                selectElement('#map_location').classList.remove('active');
                selectElement('#summary_table').classList.remove('hide');
                selectElement('#summary_table').classList.add('show');
                selectElement(`.footer_icon ul li a[href="#summary_table"]`).classList.add('active');
                selectElement('#table_svg').classList.add('active');
            }else if(href_element_list == '#delete'){
                let sections_visible = document.querySelectorAll('main section.show');
                if (sections_visible.length < 1){
                    selectElement('#summary_table').classList.remove('hide');
                    selectElement('#summary_table').classList.add('show');
                }
            }
        }
        
        element_map.classList.remove('hide');
        element_map.classList.add('show');
        
    }else{
        let link_map = selectElement(`a[href="#map"]`);
        if(link_map.classList.contains('active') == false){
            selectElement('#map').classList.remove('show');
            selectElement('#map').classList.add('hide');
        }
        
    }
}

function efect_btn_burger(e){
    let btn_menu = e.target;
    let information = selectElement('#information');

    if(e.target.tagName === 'SPAN'){
        btn_menu = e.target.parentElement;
    }

    if(btn_menu.classList.contains('open')){
        btn_menu.classList.remove('open');
        information.classList.remove('open');
    }else{
        btn_menu.classList.add('open');
        information.classList.add('open');
    }
}

function remove_class_hide_info(e){
    if(window.matchMedia(text_media_query).matches == false){
        selectElement('#information').classList.remove('hide');
    }else{
        if(selectElement('#information').classList.contains('show') == false){
            selectElement('#information').classList.add('hide');
        }
    }
}

function load(){

    remove_class_hide_info();
    visualize_map();
    move_footer_icon();

    window.addEventListener('resize', remove_class_hide_info, false);
    window.addEventListener('resize', visualize_map, false);
    window.addEventListener('resize', move_footer_icon, false);

    selectElement('#info').addEventListener('click', (e) => {
        e.preventDefault();
        selectElement('#information').classList.remove('hide');
        selectElement('#information').classList.add('open');

        selectElement('body').style['animation-name'] = 'fade_in_data';

        setTimeout(() => {
            selectElement('body').style['animation-name'] = '';
        }, 1000);

    }, false);

    selectElement('#close_info').addEventListener('click', (e) => {
        e.preventDefault();
        selectElement('#information').classList.remove('open');
        selectElement('#information').classList.add('hide');

        selectElement('body').style['animation-name'] = 'fade_in_data';

        setTimeout(() => {
            selectElement('body').style['animation-name'] = '';
        }, 1000);
    }, false);

    selectElement('#form_location nav ul').addEventListener('click', event_btn_form_location, false);

    selectElement('#menu_btn_burger').addEventListener('click', efect_btn_burger, false);

    selectElement('#preloader_btn_cancel').addEventListener('click', 
    event_btn_cancel_preloader, false);

    selectElement('#preloader_btn_confirm').addEventListener('click',
    event_btn_confirm_preloader, false);

    selectElement('.footer_icon ul').addEventListener('click', view_main_data, false);

    let munipality = new Choices('#municipality');
    let parish = new Choices('#parish');
    let community = new Choices('#community');
    let distance = new Choices('#distance');

    const url_municipality = 'assets/php/create_list_municipality.php';

    let map = initMap();

    get_data_json(url_municipality)
    .then(response =>{
        if(response.response){
            load_input_select({
                data_municipality: response.data,
                selectMunicipality: munipality,
                selectParish: parish,
                selectCommunity: community,
                selectDistance: distance
            });
        }
    })
    .catch(error => {
        console.log(error);
    })

    create_data_table(data_test, null);
    load_data_map(data_test, map);
}

window.addEventListener('load', load, false);