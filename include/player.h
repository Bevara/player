#ifndef _PLAYER_
#define _PLAYER_

#ifdef __cplusplus
extern "C" {  
#endif

#define GPAC_HAVE_CONFIG_H

#include <gpac/main.h>
#include <gpac/filters.h>
#include <gpac/terminal.h>
#include <gpac/options.h>

typedef struct __Dec_Entry
{
    GF_FileIO *fio;
    const char *fio_url;
    void (*event_callback)(struct __Dec_Entry* entry, const char* callback);
    int (*success_callback)(struct __Dec_Entry* ctx);
    void* IOCtx;
    char out_format[256];
    Bool Run;
    GF_Terminal *term;
    GF_User user;
    GF_EventDuration duration;
    Bool autostart;
} Dec_Entry;

typedef void (*event_callback)(struct __Dec_Entry*, const char*);

GF_List* set_dec_entry_args(Dec_Entry* ctx, const char* json);
Bool send_json_event(Dec_Entry *ctx, GF_Event *evt);
const char* parse_json_properties(Dec_Entry *ctx, const char *json);
const char *set_json_properties(Dec_Entry *ctx, const char *json);

const char *make_fileio(Dec_Entry *entry, const char *inargs, Bool is_input, GF_Err *e);
void del_mem_fileio(GF_FileIO *fileio);

#ifdef __cplusplus
}
#endif

#endif
