#include "rapidjson/document.h"

#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>


using namespace rapidjson;

StringBuffer sb;

extern "C" uint32_t getWidth();

extern "C" const char *get_properties(const char *json)
{

  Document document;
  document.Parse(json);
  assert(document.IsArray());

  Document out;
  out.SetObject();

    for (Value::ConstValueIterator itr = document.Begin(); itr != document.End(); ++itr)
  {
    const char *property = itr->GetString();

    if (strcmp(property, "width") == 0)
    {
        out.AddMember(Value("width"), Value(getWidth()), out.GetAllocator());
    }else if (strcmp(property, "height") == 0)
    {
        out.AddMember(Value("height"), Value(0), out.GetAllocator());
    }
  }

  sb.Clear();
  Writer<StringBuffer> writer(sb);
  out.Accept(writer);
  return sb.GetString();
}