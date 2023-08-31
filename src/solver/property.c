
#include <gpac/main.h>
#include <gpac/filters.h>

extern GF_FilterSession *session;

const char* get_filter_stats(GF_Filter *filter){
	GF_FilterStats stats;
	gf_filter_get_stats(filter, &stats);
	return stats.status;
}