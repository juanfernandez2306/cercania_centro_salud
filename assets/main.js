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
        }
        
        //ADD MAIN

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
            n += 200;
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


}

window.addEventListener('load', load, false);