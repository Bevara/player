#if __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#define emscripten_sleep gf_sleep
#endif

#include <stdio.h>

#include "player.h"

int EMSCRIPTEN_KEEPALIVE setup_acc(const char *args)
{
    /*Dec_Entry *ctx;
    GF_SAFEALLOC(ctx, Dec_Entry);*/
    return (args + 1);
}

void EMSCRIPTEN_KEEPALIVE shutdown_acc(Dec_Entry *ctx)
{

}