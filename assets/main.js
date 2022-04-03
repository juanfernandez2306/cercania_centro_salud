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

function load(){
    const url_municipality = 'assets/php/create_list_municipality.php';
    get_data_json(url_municipality)
    .then(response =>{
        if(response.response){
            load_select(response.data);
        }
    })
    .catch(error =>{
        console.log(error);
    })
}

window.addEventListener('load', load, false);