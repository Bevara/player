#include <string.h>
#include <stdio.h>
#include <stdlib.h> 

#include "common.h"


#include <emscripten/emscripten.h>

extern void njInit(void);
extern int njDecode(const void* jpeg, const int size);
extern unsigned char* njGetImage(void);
extern int njGetImageSize(void);
extern int njGetWidth(void);
extern int njGetHeight(void);

Entry* EMSCRIPTEN_KEEPALIVE constructor(const void* jpeg, const int size)
{
  Entry* entry;
  entry = malloc(sizeof(Entry));
  njInit();
  njDecode(jpeg, size);
    entry->image = njGetImage();
    entry->size = njGetImageSize();
    entry->width = njGetWidth();
    entry->height = njGetHeight();
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