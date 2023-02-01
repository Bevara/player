#include <emscripten/emscripten.h>

#include "jxl/decode.h"

typedef struct _Entry
{

} Entry;



Entry *EMSCRIPTEN_KEEPALIVE constructor()
{

    return 0;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return 0;
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
}