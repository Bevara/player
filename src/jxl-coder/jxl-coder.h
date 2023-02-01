#ifndef _TRANSCODER_
#define _TRANSCODER_

#ifdef __cplusplus
extern "C" {  
#endif

#include "jxl/decode.h"

typedef struct _Entry
{
  unsigned int version;
  JxlDecoder* decoder;
} Entry;


void parse_set_session(Entry* entry, const char *json);
const char * parse_get_session(Entry *entry, const char *json);


#ifdef __cplusplus
}
#endif

#endif
