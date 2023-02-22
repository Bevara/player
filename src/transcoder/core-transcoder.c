#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "transcoder.h"

static GF_Err evt_ret_val = GF_OK;

void gf_fs_reg_all(GF_FilterSession *fsess, GF_FilterSession *a_sess)
{

}

static void gpac_print_report(GF_FilterSession *fsess, Bool is_init, Bool is_final)
{

}

static Bool gpac_event_proc(void *opaque, GF_Event *event)
{
	GF_FilterSession *fsess = (GF_FilterSession *)opaque;
	if ((event->type==GF_EVENT_PROGRESS) && (event->progress.progress_type==3)) {
		gpac_print_report(fsess, GF_FALSE, GF_FALSE);
	}
	else if (event->type==GF_EVENT_QUIT) {
		if (event->message.error>0)
			evt_ret_val = event->message.error;
		gf_fs_abort(fsess, GF_FS_FLUSH_ALL);
	}

	return GF_FALSE;
}

Entry *EMSCRIPTEN_KEEPALIVE constructor()
{
    GF_Err e;
    u32 sflags=0;

    Entry *entry = malloc(sizeof(Entry));
    //gf_log_set_tool_level(GF_LOG_FILTER, GF_LOG_DEBUG);
    entry->session = gf_fs_new_defaults(sflags);

    return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{
    GF_Err e;
    parse_set_session(entry, attrs);

    gf_fs_set_ui_callback(entry->session, gpac_event_proc, entry);
    e= gf_fs_run(entry->session);

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get_session(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
}