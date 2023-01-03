#ifndef _PLAYER_
#define _PLAYER_

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
  //GF_User* user;
  //GF_Terminal *term;
  GF_List *filter_registers;
} Entry;

void parse_set_term(Entry* entry, const char *json);
const char * parse_get_term(Entry *entry, const char *json);

#ifdef __cplusplus
}
#endif

#endif
