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

function load(){

    const url_municipality = 'assets/php/create_list_municipality.php';

    let map = initMap();

    get_data_json(url_municipality)
    .then(response =>{
        if(response.response){
            load_select(response.data);
        }
    })
    .catch(error =>{
        console.log(error);
    })

    load_data_response(data_test, map);
}

window.addEventListener('load', load, false);