#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "player.h"

using namespace rapidjson;

StringBuffer sb;

extern "C"
{
  const GF_FilterRegister *wcdec_register(GF_FilterSession *session);
  const GF_FilterRegister *wcenc_register(GF_FilterSession *session);
  const GF_FilterRegister *webgrab_register(GF_FilterSession *session);
  const GF_FilterRegister *dynCall_vout_register(GF_FilterSession *session);
  const GF_FilterRegister *dynCall_aout_register(GF_FilterSession *session);
}

extern "C" void parse_set_session(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  if (document.HasMember("debug") && (document["debug"].GetBool() == true))
  {
    gf_log_set_tool_level(GF_LOG_TOOL_MAX, GF_LOG_INFO);
  }

  if (document.HasMember("use-webcodec") && (document["use-webcodec"].GetBool() == true))
  {
    gf_fs_add_filter_register(entry->session, wcdec_register(entry->session));
    gf_fs_add_filter_register(entry->session, wcenc_register(entry->session));
    gf_fs_add_filter_register(entry->session, webgrab_register(entry->session));
  }

  gf_fs_add_filter_register(entry->session, dynCall_vout_register(entry->session));
  gf_fs_add_filter_register(entry->session, dynCall_aout_register(entry->session));
  

  if (document.HasMember("filters"))
  {
    assert(document["filters"].IsArray());
    const Value &filters = document["filters"];
    for (SizeType i = 0; i < filters.Size(); i++)
      gf_fs_add_filter_register(entry->session, (const GF_FilterRegister *)filters[i].GetInt());
  }

  if (document.HasMember("src"))
  {
    GF_Err err;
    assert(document["src"].IsString());
    const char *source = document["src"].GetString();

    entry->src = gf_fs_load_source(entry->session, source, NULL, NULL, &err);
    if (err)
    {
      fprintf(stderr, "session error %s\n", gf_error_to_string(err));
    }
  }

  GF_Err e;

  GF_Filter *filter = gf_fs_load_filter(entry->session, "vout", &e);
  filter = gf_fs_load_filter(entry->session, "aout", &e);
}

extern "C" const char *parse_get_session(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

  for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
  {
    const char *property = itr->GetString();

    if (strcmp(property, "connections") == 0)
    {
      gf_fs_print_connections(entry->session);
    }
    else if (strcmp(property, "width") == 0)
    {
      u32 width = 0;
      GF_FilterPid *ipid = gf_filter_get_ipid(entry->dst, 0);
      if (ipid)
      {
        const GF_PropertyValue *p = gf_filter_pid_get_property(ipid, GF_PROP_PID_WIDTH);
        width = p->value.uint;
      }

      out.AddMember(Value("width"), Value(width), out.GetAllocator());
    }
    else if (strcmp(property, "height") == 0)
    {
      u32 height = 0;
      GF_FilterPid *ipid = gf_filter_get_ipid(entry->dst, 0);
      if (ipid)
      {
        const GF_PropertyValue *p = gf_filter_pid_get_property(ipid, GF_PROP_PID_HEIGHT);
        height = p->value.uint;
      }

      out.AddMember(Value("height"), Value(height), out.GetAllocator());
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}
