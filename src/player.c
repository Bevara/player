#if __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#define emscripten_sleep gf_sleep
#endif


typedef struct __Dec_Entry
{

} Dec_Entry;


Dec_Entry *EMSCRIPTEN_KEEPALIVE setup_acc(const char* args)
{
    Dec_Entry *ctx;
    GF_SAFEALLOC(ctx, Dec_Entry);
    if (!ctx)
        return NULL;

    return ctx;
}