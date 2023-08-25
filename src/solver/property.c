  
#include <gpac/main.h>
#include <gpac/filters.h>

extern GF_FilterSession *session;

const char* gf_fs_filters_registers_name(GF_FilterRegister *reg){
  return reg->name;
}

const char* getRegisteredFilters()
{
  u32 i, count;

	gf_fs_print_connections(session);
	return "test1";
}



const char* getConnections()
{
  u32 i, count;

	gf_fs_print_connections(session);
	return "test1";
}

const char* getNonConnected()
{
	gf_fs_print_non_connected(session);
	return "test2";
}


  GF_EXPORT
  const char *get_property(const char *property)
  {

      if (strcmp(property, "connections") == 0)
      {
        return getConnections();
      }else if (strcmp(property, "nonConnected") == 0)
      {
        return getNonConnected();
      }else if (strcmp(property, "registered") == 0)
      {
        return getRegisteredFilters();
      }


    return "";
  }