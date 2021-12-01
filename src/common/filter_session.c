
#include "filter_session.h"

struct __gf_filter
{
    const GF_FilterRegister *freg;
};

GF_Filter *gf_filter_new(const GF_FilterRegister *freg){
    GF_Filter *filter;

    GF_SAFEALLOC(filter, GF_Filter);

	if (!filter) {
		GF_LOG(GF_LOG_ERROR, GF_LOG_FILTER, ("Failed to alloc filter for %s\n", freg->name));
		return NULL;
	}
    
    return NULL;
}