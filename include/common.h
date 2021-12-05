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
  const char* src;
  int width;
  int height;
  GF_FilterSession *session;
  char* in_data;
  size_t in_numBytes;
  char* out_data;
  size_t out_numBytes;
  GF_List *all_gfio_defined;
} Entry;

void parse_set(Entry* entry, const char *json);
const char * parse_get(Entry *entry, const char *json);
const char *make_fileio(Entry *entry, const char *inargs, char **data, size_t *numBytes, Bool is_input, GF_Err *e);

#ifdef __cplusplus
}
#endif

#endif
