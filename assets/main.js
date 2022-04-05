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
    info_event = e.target;
    let element_target = info_event;
    if(info_event.tagName == 'use'){
        element_target = info_event.parentElement.parentElement
    }else if(info_event.tagName == 'svg'){
        element_target = info_event.parentElement
    }
    
    let name_current_main = element_target.dataset.main;
    let element_li = element_target.parentElement;
    let element_use = element_target.firstElementChild.firstElementChild;
    let name_icon_svg = element_use.getAttribute('xlink:href');

    if(element_li.classList.contains('active') == false){

        selectElement('.footer_icon ul li.active').classList.remove('active');
        selectElement('symbol.active').classList.remove('active');

        let section_past = selectElement('main .show');
        if(name_current_main != '#delete'){
            section_past.classList.remove('show');
            section_past.classList.add('hide');
        }

        element_li.classList.add('active');
        selectElement(name_icon_svg).classList.add('active');

        section_current = selectElement(name_current_main);
        section_current.classList.remove('hide');
        section_current.classList.add('show');

        selectElement('body').style['animation-name'] = 'fade_in_data';

        element_target.removeEventListener("click", view_main_data, false);

        setTimeout(()=>{
            element_target.addEventListener("click", view_main_data, false);
            selectElement('body').style['animation-name'] = '';
        }, 1000)

    }
    
}

function event_btn_cancel_preloader(e){
    e.preventDefault();
    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');
    selectElement('.footer_icon ul li.active').classList.remove('active');
    selectElement('#eraser').classList.remove('active');
    selectElement('body').style['animation-name'] = 'fade_in_data';

    let name_section_active = selectElement('main .show').id;
    let link_section_active = selectElement(`.footer_icon ul li a[data-main="#${name_section_active}"]`);
    let li_section_active = link_section_active.parentElement;
    let name_icon_svg_section_active = link_section_active.firstElementChild.firstElementChild.getAttribute('xlink:href');
    
    li_section_active.classList.add('active');
    selectElement(name_icon_svg_section_active).classList.add('active');

    setTimeout(() => {
        selectElement('body').style['animation-name'] = '';
    }, 1000);
}

function event_btn_confirm_preloader(e){
    e.preventDefault();
    let view_show_current = selectElement('main .show');
    view_show_current.classList.remove('show');
    view_show_current.classList.add('hide');

    selectElement('#form_location').classList.remove('hide');
    selectElement('#form_location').classList.add('show');

    selectElement('.footer_icon ul li.active').classList.remove('active');
    selectElement('symbol.active').classList.remove('active');

    document.querySelectorAll('.footer_icon ul li').forEach((element) =>{
        element.classList.add('hide');
    });

    selectElement('.footer_icon ul li:first-child').classList.remove('hide');

    selectElement('#delete').classList.remove('show');
    selectElement('#delete').classList.add('hide');
    selectElement('body').style['animation-name'] = 'fade_in_data';

    let array_link_footer = document.querySelectorAll('.footer_icon ul li a');

    array_link_footer.forEach((element) => {
        element.removeEventListener('click', view_main_data, false);
    })

    setTimeout(() => {
        selectElement('body').style['animation-name'] = '';
    }, 1000);
}

function load(){

    selectElement('#menu_btn_burger').addEventListener('click', function(e){
        let btn_menu = e.target;
        if(btn_menu.classList.contains('open')){
            btn_menu.classList.remove('open');
        }else{
            btn_menu.classList.add('open');
        }
    }, false);

    selectElement('#preloader_btn_cancel').addEventListener('click', 
    event_btn_cancel_preloader, false);

    selectElement('#preloader_btn_confirm').addEventListener('click',
    event_btn_confirm_preloader, false);

    let array_link_footer = document.querySelectorAll('.footer_icon ul li a');

    array_link_footer.forEach((element) => {
        element.addEventListener('click', view_main_data, false);
    })

    let munipality = new Choices('#municipality');
    let parish = new Choices('#parish');
    let community = new Choices('#community');
    let distance = new Choices('#distance');

    create_data_table(data_test, null);
}

window.addEventListener('load', load, false);