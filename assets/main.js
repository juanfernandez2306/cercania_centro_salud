const selectElement = (element) => document.querySelector(element);

const selectVariableCSS = (element) => getComputedStyle(document.body).getPropertyValue(element);

const text_media_query = "(max-width: 900px)";

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
    let name_id_main = array_href_link[array_href_link.length - 1];

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
        
        //ADD MAIN

    }
}

function status_init_form(){
    let link_form_location = selectElement('#form_location');
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
            if(link_active != null){
                link_active.classList.remove('active');
            }

            let symbol = selectElement('symbol.active');

            if(symbol != null){
                symbol.classList.remove('active');
            }

            selectElement('footer ul').removeEventListener(
                'click',
                event_icon_footer,
                false
            );
        }

    }
}

function load(){
    status_init_form();
    window.addEventListener('resize', status_init_form, false);

}

window.addEventListener('load', load, false);