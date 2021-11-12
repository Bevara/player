#ifndef _COMMON_
#define _COMMON_

#ifdef __cplusplus
extern "C" {  
#endif

typedef struct _Entry
{
  const char* src;
  unsigned char* image;
  int size;
  int width;
  int height;
} Entry;


void parse_set(Entry* entry, const char *json);
const char * parse_get(Entry *entry, const char *json);

#ifdef __cplusplus
}
#endif

#endif
