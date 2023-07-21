
#include <gpac/filters.h>

extern GF_Filter *dst;

u32 getWidth(){
        u32 width = 0;
      GF_FilterPid *ipid = gf_filter_get_ipid(dst, 0);
      if (ipid)
      {
        const GF_PropertyValue *p = gf_filter_pid_get_property(ipid, GF_PROP_PID_WIDTH);
        return p->value.uint;
      }

      return 0;
} 