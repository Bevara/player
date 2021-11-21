#include <string.h>
#include <stdio.h>
#include <stdlib.h> 

#include "common.h"
#include <emscripten/emscripten.h>

Entry* EMSCRIPTEN_KEEPALIVE constructor()
{
  Entry* entry;
  entry = malloc(sizeof(Entry));

/*
  njInit();
  njDecode(jpeg, size);
  entry->image = njGetImage();
  entry->size = njGetImageSize();
  entry->width = njGetWidth();
  entry->height = njGetHeight();*/

  entry->image = 0;
  entry->size = 0;
  entry->width = 0;
  entry->height = 0;


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