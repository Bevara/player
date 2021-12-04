#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "common.h"

extern const GF_FilterRegister* nanojpeg_register(GF_FilterSession *session);

Entry *EMSCRIPTEN_KEEPALIVE constructor()
{
    GF_Err e;
    u32 sflags=0;

    Entry *entry = malloc(sizeof(Entry));
    entry->session = gf_fs_new_defaults(sflags);
    //gf_fs_add_filter_register(entry->session, nanojpeg_register(NULL) );
    //entry->filter = gf_fs_load_filter(entry->session, "nanojpeg", &e);

    return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{
    GF_Err e;

    parse_set(entry, attrs);

    GF_Filter *source = NULL;
    GF_Filter *dst = NULL;
    const char *fargs_src = NULL;
    

    e= gf_fs_run(entry->session);
    gf_fs_print_connections(entry->session);

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
}