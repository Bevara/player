#ifndef _COMMON_
#define _COMMON_

#ifdef __cplusplus
extern "C" {  
#endif

#include <emscripten/emscripten.h>
#include "filter_session.h"


typedef struct
{
  char* path;
  char **data;
  size_t *numBytes;
  char *_p;
  Bool write;
  u32 nb_refs;
} MemIOCtx;

typedef struct _Entry
{
  GF_FilterSession *session;
} Entry;

void parse_set(Entry* entry, const char *json);
const char * parse_get(Entry *entry, const char *json);

#ifdef __cplusplus
}
#endif

#endif
