#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "transcoder.h"

void gf_fs_reg_all(GF_FilterSession *fsess, GF_FilterSession *a_sess)
{

}

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
    parse_set_session(entry, attrs);

    e= gf_fs_run(entry->session);

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get_session(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
}