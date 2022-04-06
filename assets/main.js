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

function load_select(data_municipality){

    let selectMunicipality = new Choices('#municipality', {
        choices: data_municipality
    });

    let selectParish = new Choices('#parish');
    let selectCommunity = new Choices('#community');
    let selectDistance = new Choices('#distance');

    selectElement('#municipality').addEventListener('change', (e)=>{
        let selectInput = e.target;
        let cod_mun = selectInput.value;

        let FormDataInput = new FormData();
        FormDataInput.append('cod_mun', cod_mun);
        selectParish.clearChoices();
        selectParish.disable();
        selectCommunity.clearStore();
        selectCommunity.disable();
        
        
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

/*
function initMap(){
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: initial_coordinates,
    });

    return map;
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

*/

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

function load(){

    visualize_map();
    move_footer_icon();

    window.addEventListener('resize', visualize_map, false);
    window.addEventListener('resize', move_footer_icon, false);

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

    create_data_table(data_test, null);
}

window.addEventListener('load', load, false);