#include <stdio.h>
#include <stdlib.h>

#include <emscripten/emscripten.h>
#include "jxl-coder.h"

#include <jxl/decode.h>

Entry *EMSCRIPTEN_KEEPALIVE constructor()
{
    JxlMemoryManager manager;
    Entry *entry = malloc(sizeof(Entry));
    entry->version = JxlDecoderVersion();
    entry->decoder = JxlDecoderCreate(&manager);
    return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{

    parse_set_session(entry, attrs);

    JxlDecoderStatus status = JxlDecoderProcessInput(entry->decoder);
    /*if (status == JXL_DEC_ERROR) {
      fprintf(stderr, "Failed to decode image\n");
      return false;
    } else if (status == JXL_DEC_NEED_MORE_INPUT) {
        fprintf(stderr, "Need more input!\n");
    }*/
    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get_session(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
    JxlDecoderDestroy(entry->decoder);
}