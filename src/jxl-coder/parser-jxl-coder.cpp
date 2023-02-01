#include "rapidjson/document.h"

#include <emscripten/emscripten.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

#include "jxl-coder.h"

using namespace rapidjson;

StringBuffer sb;

extern "C" void parse_set_session(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsObject());

}

extern "C" const char *parse_get_session(Entry *entry, const char *json)
{
  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}