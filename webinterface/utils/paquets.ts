
import {Common} from "../common"

const WIDTH = 1464419412;
const HEIGTH = 1212500295;

function gf_filter_get_udta()
{
console.log ("function gf_filter_get_udta has not been implemented!")
}

function gf_filter_pid_get_packet(PID : number) : number
{
    console.log ("function gf_filter_pid_get_packet has not been implemented!")
    return 0;
}
function gf_filter_pck_get_data(pck : number, ptr_size:number) : number
{
    let common = this as Common;
    let img = common.img;
    const malloc = common.mainModule.instance.exports.allocateData as Function;

    const ptr = malloc(img.length);
    common.HEAPU8.set(img, ptr);

    common.HEAPU32[ptr_size/4] = img.length;
    return ptr;
}
function gf_filter_pid_set_property(ptr_pid : number, prop_4cc: number, ptr_value :number)
{
    let common = this as Common;
    
    if (prop_4cc == WIDTH){
        const setWidth = common.mainModule.instance.exports.setWidth as Function;
        setWidth(common.mainModule.entry, ptr_value);

    }else if (prop_4cc == HEIGTH){
        const setHeight = common.mainModule.instance.exports.setHeight as Function;
        setHeight(common.mainModule.entry, ptr_value);
    }
}
function gf_filter_pck_new_alloc(ptr_pid : number, data_size:number, ptr_ptr_data:number)
{
    let common = this as Common;
    const malloc = common.mainModule.instance.exports.allocateData as Function;
    const ptr = malloc(data_size);
    common.HEAPU8[ptr_ptr_data] = ptr;
    return ptr;
}
function gf_filter_pck_send(pck : number)
{
    let common = this as Common;
    const setImage = common.mainModule.instance.exports.setImage as Function;
    setImage(common.mainModule.entry, pck);
}

export {gf_filter_get_udta, 
    gf_filter_pid_get_packet, 
    gf_filter_pck_get_data, 
    gf_filter_pid_set_property,
    gf_filter_pck_new_alloc,
    gf_filter_pck_send
}