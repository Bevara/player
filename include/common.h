#ifndef _COMMON_
#define _COMMON_

#ifdef __cplusplus
extern "C" {  
#endif

#include <emscripten/emscripten.h>
#include "filter_session.h"


typedef struct
{
  struct _Entry* entry;
  char *_p;
  char *path;
  Bool write;
  u32 nb_refs;
} MemIOCtx;

typedef struct _Entry
{
  const char* src;
  unsigned char* image;
  int size;
  int width;
  int height;
  GF_FilterSession *session;
  GF_Filter *filter;
  GF_FileIO *fio;
  char* data;
  size_t numBytes;
  const char* fio_url;
  MemIOCtx *IOCtx;
} Entry;

void parse_set(Entry* entry, const char *json);
const char * parse_get(Entry *entry, const char *json);
const char *make_fileio(Entry *entry, const char *inargs, Bool is_input, GF_Err *e);

#ifdef __cplusplus
}
#endif

#endif
