#if __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#define emscripten_sleep gf_sleep
#endif

#include <stdio.h>

#include "player.h"

//GPAC log function
/*static void on_gpac_log(void *cbk, GF_LOG_Level ll, GF_LOG_Tool lm, const char *fmt, va_list list)
{
    printf(fmt, list);
}*/

int init_player(Dec_Entry *ctx)
{
    gf_term_connect_from_time(ctx->term, ctx->fio_url, 0, 1);
    
    return 0;
}

Dec_Entry *EMSCRIPTEN_KEEPALIVE setup_acc(const char *args)
{
    Dec_Entry *ctx;
    GF_SAFEALLOC(ctx, Dec_Entry);
    GF_List *filter_registers;
    //printf("test");

    //gf_log_set_callback(ctx, on_gpac_log);
    
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
    if (ctx->term)
        gf_term_del(ctx->term);

    if (ctx)
        gf_free(ctx);
}

char property[256];
const char *EMSCRIPTEN_KEEPALIVE get(Dec_Entry *ctx, const char* properties)
{
   if (!ctx)
        return "";

    return parse_json_properties(ctx, properties);
}

const char *EMSCRIPTEN_KEEPALIVE set(Dec_Entry *ctx, const char* properties)
{

    return set_json_properties(ctx, properties);
}

int EMSCRIPTEN_KEEPALIVE step_run(Dec_Entry *ctx)
{
    return gf_term_process_step(ctx->term);
}