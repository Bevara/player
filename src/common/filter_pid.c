#include "common.h"


void* EMSCRIPTEN_KEEPALIVE gf_filter_get_udta(GF_Filter *filter){
    return NULL;
}

const u8* EMSCRIPTEN_KEEPALIVE gf_filter_pck_get_data(GF_FilterPacket *pck, u32 *size){
    return NULL;
}

GF_FilterPacket* EMSCRIPTEN_KEEPALIVE gf_filter_pid_get_packet(GF_FilterPid *PID){
    return NULL;
}

GF_FilterPacket* EMSCRIPTEN_KEEPALIVE gf_filter_pck_new_alloc(GF_FilterPid *pid, u32 data_size, u8 **data){
    return NULL;
}

GF_Err EMSCRIPTEN_KEEPALIVE gf_filter_pck_send(GF_FilterPacket *pck){
    return GF_OK;
}

GF_Err EMSCRIPTEN_KEEPALIVE gf_filter_pid_set_property(GF_FilterPid *PID, u32 prop_4cc, const GF_PropertyValue *value){
    return GF_OK;
}