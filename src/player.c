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
    //printf("test");
    gf_sys_init(GF_MemTrackerNone, "0");
    
    gf_opts_set_key("core", "audio-output", "SDL Audio Output");
    gf_opts_set_key("core", "video-output", "SDL Video Output");

    filter_registers = set_dec_entry_args(ctx, args);
    memset(&ctx->user, 0, sizeof(GF_User));
    ctx->user.EventProc = send_json_event;
    ctx->user.opaque = ctx;

    fprintf(stderr, "Loading GPAC Terminal\n");

    ctx->term = gf_term_new(&ctx->user);
    if (!ctx->term)
    {
        fprintf(stderr, "\nInit error - check you have at least one video out and one rasterizer...\nFound modules:\n");
        gf_sys_close();
        return NULL;
    }

    //emscripten_set_main_loop_arg(step_run, ctx, 0, 0);
    //emscripten_set_main_loop_arg(step_run, ctx, 1000,0); //TO BE IMPLEMENTED
    return ctx;
}

void EMSCRIPTEN_KEEPALIVE shutdown_acc(Dec_Entry *ctx)
{
    if (ctx)
        gf_free(ctx);
}