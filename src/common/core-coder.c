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

    return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{
    GF_Err e;
    parse_set(entry, attrs);

    e= gf_fs_run(entry->session);

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
}