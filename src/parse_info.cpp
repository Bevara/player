#include "player.h"

#include "property_keys.h"


#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include <rapidjson/writer.h>

#include <cstring>

using namespace rapidjson;

extern "C" GF_List *set_dec_entry_args(Dec_Entry *ctx, const char *json)
{
    Document document;
    document.Parse(json);
    assert(document.IsObject());

    GF_List *filters = NULL;

    if (document.HasMember("src"))
    {
        GF_Err e;
        assert(document["src"].IsString());
        make_fileio(ctx, document["src"].GetString(), GF_TRUE, &e);
    }

    if (document.HasMember("autostart"))
    {
        assert(document["autostart"].IsBool());
        ctx->autostart = document["autostart"].GetBool() ? GF_TRUE : GF_FALSE;
    }

#if !defined(__EMSCRIPTEN__)
    filters = gf_list_new();
    add_filters(filters);
    ctx->event_callback = test_callback;
    return filters;
#endif

    if (document.HasMember("evt_callback"))
    {
        ctx->event_callback = reinterpret_cast<event_callback>(document["evt_callback"].GetInt());
    }

    if (document.HasMember("entryLibraries"))
    {
        filters = gf_list_new();

        const Value &entries = document["entryLibraries"];
        assert(entries.IsArray());
        for (SizeType i = 0; i < entries.Size(); i++)
            gf_list_add(filters, reinterpret_cast<GF_FilterRegister *>(entries[i].GetInt()));
    }

    return filters;
}

StringBuffer sb;

extern "C" Bool send_json_event(Dec_Entry *ctx, GF_Event *evt)
{
    Document document;
    document.SetObject();
    switch (evt->type)
    {
    case GF_EVENT_PROGRESS:
        document.AddMember(Value("type"), Value("GF_EVENT_PROGRESS"), document.GetAllocator());
        document.AddMember(Value("progress_type"), Value(evt->progress.progress_type), document.GetAllocator());
        document.AddMember(Value("done"), Value(evt->progress.done), document.GetAllocator());
        document.AddMember(Value("total"), Value(evt->progress.total), document.GetAllocator());
        break;
    case GF_EVENT_MESSAGE:
        document.AddMember(Value("type"), Value("GF_EVENT_MESSAGE"), document.GetAllocator());
        document.AddMember(Value("message"), Value(evt->message.message, document.GetAllocator()), document.GetAllocator());
        if (evt->message.error)
        {
            document.AddMember(Value("error"), Value(gf_error_to_string(evt->message.error), document.GetAllocator()), document.GetAllocator());
        }
        break;
    case GF_EVENT_CONNECT:
        document.AddMember(Value("type"), Value("GF_EVENT_CONNECT"), document.GetAllocator());
        document.AddMember(Value("is_connected"), Value(evt->connect.is_connected), document.GetAllocator());
        break;
    case GF_EVENT_SIZE:
        document.AddMember(Value("type"), Value("GF_EVENT_SIZE"), document.GetAllocator());
        document.AddMember(Value("width"), Value(evt->size.width), document.GetAllocator());
        document.AddMember(Value("height"), Value(evt->size.height), document.GetAllocator());
        break;
    case GF_EVENT_DURATION:
        document.AddMember(Value("type"), Value("GF_EVENT_DURATION"), document.GetAllocator());
        document.AddMember(Value("duration"), Value(evt->duration.duration), document.GetAllocator());
        document.AddMember(Value("can_seek"), Value(evt->duration.can_seek), document.GetAllocator());
        break;
    case GF_EVENT_RESOLUTION:
        document.AddMember(Value("type"), Value("GF_EVENT_RESOLUTION"), document.GetAllocator());
        document.AddMember(Value("width"), Value(evt->size.width), document.GetAllocator());
        document.AddMember(Value("height"), Value(evt->size.height), document.GetAllocator());
        break;
    default:
        document.AddMember(Value("type"), Value(EVENT_STRING[evt->type], document.GetAllocator()), document.GetAllocator());
        break;
    }

    if (ctx->event_callback)
    {
        sb.Clear();
        Writer<StringBuffer> writer(sb);

        document.Accept(writer);
        ctx->event_callback(ctx, sb.GetString());
    }

    return GF_TRUE;
}