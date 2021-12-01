#include <string.h>
#include <stdio.h>
#include <stdlib.h> 

#include "common.h"
#include <emscripten/emscripten.h>

Entry* EMSCRIPTEN_KEEPALIVE constructor()
{
 Entry* entry = malloc(sizeof(Entry));

   return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry* entry, const char* attrs)
{
    parse_set(entry, attrs);
    return 0;
}

const char* EMSCRIPTEN_KEEPALIVE get(Entry* entry, const char* attrs)
{
    return parse_get(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry* entry)
{

}