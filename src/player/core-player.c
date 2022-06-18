#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "player.h"

#include <gpac/main.h>
#include <gpac/filters.h>
#include <gpac/terminal.h>
#include <gpac/options.h>

GF_List *filter_registers;

void gf_fs_reg_all(GF_FilterSession *fsess, GF_FilterSession *a_sess)
{
    if (!filter_registers) return; //No filter included

    for (int i = 0; i < gf_list_count(filter_registers); i++)
    {
        GF_FilterRegister *filter_register = gf_list_get(filter_registers, i);
        printf("Adding filter %s \n", filter_register->name);
        gf_fs_add_filter_register(fsess, filter_register);
    }

    //Done, cleanup filters
     gf_list_del(filter_registers);
     filter_registers = NULL;
}


volatile Bool connected = GF_FALSE;

static Bool play_pause_seek_gettime(GF_Terminal *term, const char *fn)
{
	u32 time;
	const u32 target_time_in_ms = 10000;

	//play
	connected = GF_FALSE;
	gf_term_connect_from_time(term, fn, 0, GF_FALSE);
	while (!connected) gf_sleep(1);

	//seek to target_time_in_ms
	gf_term_play_from_time(term, target_time_in_ms, GF_FALSE);
	gf_term_set_option(term, GF_OPT_PLAY_STATE, GF_STATE_STEP_PAUSE);
	time = gf_term_get_time_in_ms(term);
	assert(time == target_time_in_ms);

	//seek to 0
	connected = GF_FALSE;
	gf_term_play_from_time(term, 0, GF_FALSE);
	while (!connected) gf_sleep(1);
	time = gf_term_get_time_in_ms(term);
	assert(time == 0);

	return GF_TRUE;
}

Bool GPAC_EventProc(void *ptr, GF_Event *evt)
{
	switch (evt->type) {
	case GF_EVENT_CONNECT:
		connected = GF_TRUE;
		break;
	default:
		break;
	}

	return GF_FALSE;
}

Entry *EMSCRIPTEN_KEEPALIVE constructor()
{
    int i;
	GF_User user;
	GF_Terminal *term;
    
    gf_sys_init(GF_MemTrackerNone, "0");
    
    gf_opts_set_key("core", "audio-output", "SDL Audio Output");
    gf_opts_set_key("core", "video-output", "SDL Video Output");


	user.EventProc = GPAC_EventProc;
	term = gf_term_new(&user);
	if (!term)
		return NULL;
    
    int res = play_pause_seek_gettime(term, "test.mp4");
		if (res == GF_FALSE) {
			fprintf(stderr, "Failure with input \n");
			return GF_FALSE;
		}

    gf_term_disconnect(term);
	gf_term_del(term);

    return NULL;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{
    GF_Err e;
    parse_set_term(entry, attrs);

    //e= gf_fs_run(entry->session);

    return 0;
}

const char *EMSCRIPTEN_KEEPALIVE get(Entry *entry, const char *attrs)
{
    return parse_get_term(entry, attrs);
}

EMSCRIPTEN_KEEPALIVE void destructor(Entry *entry)
{
    
}