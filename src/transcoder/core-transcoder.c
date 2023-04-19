#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#include "transcoder.h"

#define DEF_LOG_ENTRIES	10

static GF_Err evt_ret_val = GF_OK;
static u32 enable_reports = 0;
static Bool logs_to_file=GF_FALSE;
static u32 nb_log_entries = DEF_LOG_ENTRIES;
static u32 log_buf_size=0;
static char *log_buf = NULL;
static u32 log_write=0;
static u64 last_report_clock_us = 0;
static GF_SystemRTInfo rti;
static char *report_filter = NULL;

struct _logentry
{
	u32 tool, level;
	u32 nb_repeat;
	u64 clock;
	char *szMsg;
} *static_logs;

static Bool has_console;
void SET_CONSOLE(int code)
{
	if (!has_console) return;
	switch (code) {
	case GF_CONSOLE_CLEAR: code = 1; break;
	case GF_CONSOLE_SAVE: code = 2; break;
	case GF_CONSOLE_RESTORE: code = 3; break;
	default: return;
	}
	MAIN_THREAD_EM_ASM({
		Module.gpac_set_console($0);
	}, code);
}

static void print_date_ex(u64 time, Bool full_print)
{
	time_t gtime;
	struct tm *t;
	u32 sec;
	u32 ms;
	gtime = time / 1000;
	sec = (u32)(time / 1000);
	ms = (u32)(time - ((u64)sec) * 1000);
	t = gf_gmtime(&gtime);
	if (full_print) {
		fprintf(stdout, "%d-%02d-%02dT%02d:%02d:%02d.%03dZ\n", 1900 + t->tm_year, t->tm_mon + 1, t->tm_mday, t->tm_hour, t->tm_min, t->tm_sec, ms);
	} else {
		fprintf(stderr, "[%02d:%02d:%02d.%03dZ] ", t->tm_hour, t->tm_min, t->tm_sec, ms);
	}
}

static void print_date(u64 time)
{
	print_date_ex(time, GF_FALSE);

}

static void gpac_on_logs(void *cbck, GF_LOG_Level log_level, GF_LOG_Tool log_tool, const char* fmt, va_list vlist)
{
	va_list vlist_tmp;
	va_copy(vlist_tmp, vlist);
	u32 len = vsnprintf(NULL, 0, fmt, vlist_tmp);
	va_end(vlist_tmp);
	if (log_buf_size < len+2) {
		log_buf_size = len+2;
		log_buf = gf_realloc(log_buf, log_buf_size);
	}
	vsprintf(log_buf, fmt, vlist);

	if (log_write && static_logs[log_write-1].szMsg) {
		if (!strcmp(static_logs[log_write-1].szMsg, log_buf)) {
			static_logs[log_write-1].nb_repeat++;
			return;
		}
	}

	static_logs[log_write].level = log_level;
	static_logs[log_write].tool = log_tool;
	if (static_logs[log_write].szMsg) gf_free(static_logs[log_write].szMsg);
	static_logs[log_write].szMsg = gf_strdup(log_buf);
	static_logs[log_write].clock = gf_net_get_utc();

	log_write++;
	if (log_write==nb_log_entries) {
		log_write = nb_log_entries - 1;
		gf_free(static_logs[0].szMsg);
		memmove(&static_logs[0], &static_logs[1], sizeof (struct _logentry) * (nb_log_entries-1) );
		memset(&static_logs[log_write], 0, sizeof(struct _logentry));
	}
}

void gf_fs_reg_all(GF_FilterSession *fsess, GF_FilterSession *a_sess)
{

}

static void gpac_print_report(GF_FilterSession *fsess, Bool is_init, Bool is_final)
{
u32 i, count, nb_active;
	u64 now;

	//if (in_sig_handler) return;

	if (is_init) {
		if (enable_reports==2)
			SET_CONSOLE(GF_CONSOLE_SAVE);

		logs_to_file = gf_log_use_file();
		if (!logs_to_file && (enable_reports==2) ) {
			if (!nb_log_entries) nb_log_entries = 1;
			static_logs = gf_malloc(sizeof(struct _logentry) * nb_log_entries);
			memset(static_logs, 0, sizeof(struct _logentry) * nb_log_entries);
			gf_log_set_callback(fsess, gpac_on_logs);
		}
		last_report_clock_us = gf_sys_clock_high_res();
		return;
	}

	now = gf_sys_clock_high_res();
	if ( (now - last_report_clock_us < 200000) && !is_final)
		return;

	last_report_clock_us = now;
	if (!is_final)
		SET_CONSOLE(GF_CONSOLE_CLEAR);

	/*gf_sys_get_rti(100, &rti, 0);
	SET_CONSOLE(GF_CONSOLE_CYAN);
	print_date(gf_net_get_utc());
	fprintf(stderr, "GPAC Session Status: ");
	SET_CONSOLE(GF_CONSOLE_RESET);
	fprintf(stderr, "mem % 10"LLD_SUF" kb CPU % 2d", rti.gpac_memory/1000, rti.process_cpu_time);
	fprintf(stderr, "\n");*/

	gf_fs_lock_filters(fsess, GF_TRUE);
	nb_active = count = gf_fs_get_filters_count(fsess);
	for (i=0; i<count; i++) {
		GF_FilterStats stats;
		gf_fs_get_filter_stats(fsess, i, &stats);
		if (stats.done || stats.filter_alias) {
			nb_active--;
			continue;
		}
		if (report_filter && (!strstr(report_filter, stats.reg_name)))
			continue;

		SET_CONSOLE(GF_CONSOLE_GREEN);
		fprintf(stderr, "%s", stats.name ? stats.name : stats.reg_name);
		SET_CONSOLE(GF_CONSOLE_RESET);
		if (stats.name && strcmp(stats.name, stats.reg_name))
			fprintf(stderr, " (%s)", stats.reg_name);
		fprintf(stderr, ": ");

		if (stats.status) {
			fprintf(stderr, "%s\n", stats.status);
		} else {
			if (stats.stream_type)
				fprintf(stderr, "%s ", gf_stream_type_name(stats.stream_type));
			if (stats.codecid)
			 	fprintf(stderr, "(%s) ", gf_codecid_name(stats.codecid) );

			if ((stats.nb_pid_in == stats.nb_pid_out) && (stats.nb_pid_in==1)) {
				Double pck_per_sec = (Double) (stats.nb_hw_pck_sent ? stats.nb_hw_pck_sent : stats.nb_pck_sent);
				pck_per_sec *= 1000000;
				pck_per_sec /= (stats.time_process+1);

				fprintf(stderr, "% 10"LLD_SUF" pck %02.02f FPS ", (s64) stats.nb_out_pck, pck_per_sec);
			} else {
				if (stats.nb_pid_in)
					fprintf(stderr, "%d input PIDs % 10"LLD_SUF" pck ", stats.nb_pid_in, (s64)stats.nb_in_pck);
				if (stats.nb_pid_out)
					fprintf(stderr, "%d output PIDs % 10"LLD_SUF" pck ", stats.nb_pid_out, (s64) stats.nb_out_pck);
			}
			if (stats.in_eos)
				fprintf(stderr, "- EOS");
			fprintf(stderr, "\n");
		}
	}
	fprintf(stderr, "Active filters: %d\n", nb_active);

	if (static_logs) {
		if (is_final && (!log_write || !static_logs[log_write-1].szMsg))
			return;

		fprintf(stderr, "\nLogs:\n");
		for (i=0; i<log_write; i++) {
			if (static_logs[i].level==GF_LOG_ERROR) SET_CONSOLE(GF_CONSOLE_RED);
			else if (static_logs[i].level==GF_LOG_WARNING) SET_CONSOLE(GF_CONSOLE_YELLOW);
			else if (static_logs[i].level==GF_LOG_INFO) SET_CONSOLE(GF_CONSOLE_GREEN);
			else SET_CONSOLE(GF_CONSOLE_CYAN);

			print_date(static_logs[i].clock);

			if (static_logs[i].nb_repeat)
				fprintf(stderr, "[repeated %d] ", static_logs[i].nb_repeat);

			fprintf(stderr, "%s", static_logs[i].szMsg);
			SET_CONSOLE(GF_CONSOLE_RESET);
		}
		fprintf(stderr, "\n");
	}
	gf_fs_lock_filters(fsess, GF_FALSE);
	fflush(stderr);
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
	//gf_sys_init(GF_MemTrackerNone, "0");
    entry->session = gf_fs_new_defaults(sflags);

    return entry;
}

int EMSCRIPTEN_KEEPALIVE set(Entry *entry, const char *attrs)
{
    GF_Err e;
    parse_set_session(entry, attrs);

    gf_fs_set_ui_callback(entry->session, gpac_event_proc, entry);
    //gf_fs_enable_reporting(entry->session, GF_TRUE);
    //gpac_print_report(entry->session, GF_TRUE, GF_FALSE);
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