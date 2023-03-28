#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "player.h"

#include "gpac/list.h"
#include "module_wrap.h"

extern GF_ModuleManager *gpac_modules_static;

using namespace rapidjson;

StringBuffer sb;

extern "C" void parse_set_term(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

  if (document.HasMember("filters"))
  {
    assert(document["filters"].IsArray());
    const Value &filters = document["filters"];
    for (SizeType i = 0; i < filters.Size(); i++)
      gf_list_add(entry->filter_registers,(void*)filters[i].GetInt());
  }

  if (document.HasMember("modules"))
  {
    assert(document["modules"].IsArray());
    const Value &modules = document["modules"];
    for (SizeType i = 0; i < modules.Size(); i++)
      gf_list_add(gpac_modules_static->plugin_registry, (void*)modules[i].GetInt());
  }

  if (document.HasMember("io_in"))
  {
    
  }

}

extern "C" const char *parse_get_term(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

  for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
  {
    const char *property = itr->GetString();

  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}