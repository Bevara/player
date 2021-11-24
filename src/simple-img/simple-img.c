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

u8* EMSCRIPTEN_KEEPALIVE allocateData(size_t size)
{
  return malloc(size);
}

void EMSCRIPTEN_KEEPALIVE setWidth(Entry* entry, GF_PropertyValue *value)
{
    entry->width = value->value.uint;
}

void EMSCRIPTEN_KEEPALIVE setHeight(Entry* entry, GF_PropertyValue *value)
{
  entry->height = value->value.uint;
}

void EMSCRIPTEN_KEEPALIVE setImage(Entry* entry, u8 *pck)
{
  entry->image =pck;
}