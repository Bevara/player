#if __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#define emscripten_sleep gf_sleep
#endif

#include <stdio.h>

#include "player.h"

Dec_Entry *EMSCRIPTEN_KEEPALIVE setup_acc(const char *args)
{
    Dec_Entry *ctx;
    GF_SAFEALLOC(ctx, Dec_Entry);
    GF_List *filter_registers;
    printf("test");
    filter_registers = set_dec_entry_args(ctx, args);
    return ctx;
}

void EMSCRIPTEN_KEEPALIVE shutdown_acc(Dec_Entry *ctx)
{
    if (ctx)
        gf_free(ctx);
}