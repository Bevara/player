#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "transcoder.h"

using namespace rapidjson;

StringBuffer sb;

extern "C" void parse_set_session(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  if (document.HasMember("filters"))
  {
    assert(document["filters"].IsArray());
    const Value &filters = document["filters"];
    for (SizeType i = 0; i < filters.Size(); i++)
      gf_fs_add_filter_register(entry->session, (const GF_FilterRegister *)filters[i].GetInt());
  }

  if (document.HasMember("io_in"))
  {
    GF_Err err;
    assert(document["io_in"].IsString());
    const char *io_in = document["io_in"].GetString();

    entry->src = gf_fs_load_source(entry->session, io_in, NULL, NULL, &err);
    if (err)
    {
      fprintf(stderr, "session error %s\n", gf_error_to_string(err));
    }
  }

  if (document.HasMember("enc"))
  {
    GF_Err err;
    assert(document["enc"].IsArray());
    for (Value::ConstValueIterator itr = document["enc"].Begin(); itr != document["enc"].End(); ++itr)
    {
      const char *enc = itr->GetString();
      gf_fs_load_filter(entry->session, enc, &err);
      if (err)
      {
        fprintf(stderr, "session error %s\n", gf_error_to_string(err));
      }
    }
  }

  if (document.HasMember("io_out"))
  {
    GF_Err err;
    assert(document["io_out"].IsString());
    const char *io_out = document["io_out"].GetString();

    entry->dst = gf_fs_load_destination(entry->session, io_out, NULL, NULL, &err);
    if (err)
    {
      fprintf(stderr, "session error %s\n", gf_error_to_string(err));
    }
  }

  if (document.HasMember("debug"))
  {
    gf_log_set_tool_level(GF_LOG_FILTER, GF_LOG_INFO);
  }
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
