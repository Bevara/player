
function gf_filter_get_udta()
{
console.log ("function gf_filter_get_udta has not been implemented!")
}

function gf_filter_pid_get_packet()
{
console.log ("function gf_filter_pid_get_packet has not been implemented!")
}
function gf_filter_pck_get_data()
{
console.log ("function gf_filter_pck_get_data has not been implemented!")
}
function gf_filter_pid_set_property()
{
console.log ("function gf_filter_pid_set_property has not been implemented!")
}
function gf_filter_pck_new_alloc()
{
console.log ("function gf_filter_pck_new_alloc has not been implemented!")
}
function gf_filter_pck_send()
{
console.log ("function gf_filter_pck_send has not been implemented!")
}

const paquetsLibrary: WebAssembly.ModuleImports = {

    "gf_filter_get_udta": gf_filter_get_udta,
    "gf_filter_pid_get_packet": gf_filter_pid_get_packet,
    "gf_filter_pck_get_data": gf_filter_pck_get_data,
    "gf_filter_pid_set_property": gf_filter_pid_set_property,
    "gf_filter_pck_new_alloc": gf_filter_pck_new_alloc,
    "gf_filter_pck_send": gf_filter_pck_send
}


export {paquetsLibrary}