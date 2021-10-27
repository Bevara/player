#include "player.h"

#include "property_keys.h"


#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include <rapidjson/writer.h>

#include <gpac/events.h>
#include <gpac/filters.h>
#include <gpac/term_info.h>
#include <gpac/options.h>

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


extern "C" const char *parse_json_properties(Dec_Entry *ctx, const char *json)
{
    Document in_doc;
    in_doc.Parse(json);
    assert(in_doc.IsArray());
    Document out_doc;
    out_doc.SetObject();
    u32 idx = 0;

    for (Value::ConstValueIterator itr = in_doc.Begin(); itr != in_doc.End(); ++itr)
    {
        const char *property = itr->GetString();

        if (strcmp(property, COMPONENT_DURATION) == 0)
        {

            GF_MediaInfo info;
            GF_ObjectManager *root_odm = gf_term_get_root_object(ctx->term);

            GF_ObjectManager *odm = gf_term_get_object(ctx->term, root_odm, 0);
            if (gf_term_get_object_info(ctx->term, odm, &info) == GF_OK)
            {
                out_doc.AddMember(Value(COMPONENT_DURATION), Value(info.duration), out_doc.GetAllocator());
            }
        }
        else if (strcmp(property, CODEC_NAME) == 0)
        {
            GF_MediaInfo info;
            GF_ObjectManager *root_odm = gf_term_get_root_object(ctx->term);

            GF_ObjectManager *odm = gf_term_get_object(ctx->term, root_odm, idx);
            if (gf_term_get_object_info(ctx->term, odm, &info) == GF_OK)
            {
                out_doc.AddMember(Value(CODEC_NAME), Value(StringRef(info.codec_name)), out_doc.GetAllocator());
            }
        }
        else if (strcmp(property, COMPONENT_SAMPLERATE) == 0)
        {
            GF_MediaInfo info;
            GF_ObjectManager *root_odm = gf_term_get_root_object(ctx->term);

            GF_ObjectManager *odm = gf_term_get_object(ctx->term, root_odm, idx);
            if (gf_term_get_object_info(ctx->term, odm, &info) == GF_OK)
            {
                out_doc.AddMember(Value(COMPONENT_SAMPLERATE), Value(info.sample_rate), out_doc.GetAllocator());
            }
        }
        else if (strcmp(property, COMPONENT_NB_CHANNELS) == 0)
        {
            GF_MediaInfo info;
            GF_ObjectManager *root_odm = gf_term_get_root_object(ctx->term);

            GF_ObjectManager *odm = gf_term_get_object(ctx->term, root_odm, idx);
            if (gf_term_get_object_info(ctx->term, odm, &info) == GF_OK)
            {
                out_doc.AddMember(Value(COMPONENT_NB_CHANNELS), Value(info.num_channels), out_doc.GetAllocator());
            }
        }
        else if (strcmp(property, GET_TIME_IN_MS) == 0)
        {
            out_doc.AddMember(Value(GET_TIME_IN_MS), Value(gf_term_get_time_in_ms(ctx->term)), out_doc.GetAllocator());
        }
        else if (strcmp(property, PLAYER_STATE) == 0)
        {
            out_doc.AddMember(Value(PLAYER_STATE), Value(gf_term_get_option(ctx->term, GF_OPT_PLAY_STATE) == GF_STATE_PLAYING), out_doc.GetAllocator());
        }
        else if (strcmp(property, INFO) == 0)
        {
            // const unsigned char chunk[4096] = "";

            // int cur_post = gf_ftell((FILE *)ctx->fio);
            // gf_fseek((FILE *)ctx->fio, 0, SEEK_SET);

            // //MediaInfoLib::MediaInfo::Option_Static(__T("Output"), __T("JSON"));
            // //MediaInfoLib::MediaInfo::Option_Static(__T("File_IsSeekable"), __T("1"));

            // MediaInfoLib::MediaInfo mi;
            // mi.Option(__T("Output"), __T("JSON"));
            // mi.Option(__T("File_IsSeekable"), __T("1"));
            // mi.Open_Buffer_Init();

            // size_t From_Buffer_Size;
            // do
            // {
            //     From_Buffer_Size = gf_fread((void *)chunk, 4096, (FILE *)ctx->fio);

            //     if ((mi.Open_Buffer_Continue(chunk, (ZenLib::int64u)From_Buffer_Size) & 0x02) == 1)
            //     {
            //         int File_GoTo = mi.Open_Buffer_Continue_GoTo_Get();
            //         gf_fseek((FILE *)ctx->fio, File_GoTo, SEEK_SET);
            //     }
            // } while (From_Buffer_Size > 0);

            // mi.Open_Buffer_Finalize();
            // gf_fseek((FILE *)ctx->fio, cur_post, SEEK_SET);

            // MediaInfoLib::String inform = mi.Inform();
            // char *output = (char *)malloc(inform.size() - 1);
            // wcstombs(output, (const wchar_t *)inform.c_str(), inform.size() - 1);
            // Document mediainfo_doc;
            // mediainfo_doc.Parse(output);
            // out_doc.AddMember(Value(INFO), mediainfo_doc, out_doc.GetAllocator());
            // free(output);
            // mi.Close();
        }
        else if (strcmp(property, DISPLAY_SIZE) == 0)
        {
            u32 width;
            u32 height;
            gf_term_get_visual_output_size(ctx->term, &width, &height);
            Value json_objects(kObjectType);
            json_objects.AddMember(Value(DISPLAY_WIDTH), Value(width), out_doc.GetAllocator());
            json_objects.AddMember(Value(DISPLAY_HEIGHT), Value(height), out_doc.GetAllocator());
            out_doc.AddMember(Value(DISPLAY_SIZE), json_objects, out_doc.GetAllocator());
        }
        else if (strcmp(property, PLAYER_STATE) == 0)
        {
            const char *options = gf_term_get_option(ctx->term, GF_OPT_PLAY_STATE) == GF_STATE_PLAYING ? PLAYER_PLAY : PLAYER_PAUSE;
            out_doc.AddMember(Value(DISPLAY_SIZE), Value(StringRef(options)), out_doc.GetAllocator());
        }else if (strcmp(property, PLAYER_VOLUME) == 0)
        {
            out_doc.AddMember(Value(PLAYER_VOLUME), Value(gf_term_get_option(ctx->term, GF_OPT_AUDIO_VOLUME)), out_doc.GetAllocator());
        }else if (strcmp(property, PLAYER_MUTE) == 0)
        {
            out_doc.AddMember(Value(PLAYER_MUTE), Value(gf_term_get_option(ctx->term, GF_OPT_AUDIO_MUTE)), out_doc.GetAllocator());
        }
    }

    sb.Clear();
    Writer<StringBuffer> writer(sb);
    out_doc.Accept(writer);
    return sb.GetString();
}

extern "C" const char *set_json_properties(Dec_Entry *ctx, const char *json)
{
    GF_Err err;
    Document in_doc;
    in_doc.Parse(json);
    assert(in_doc.IsObject());
    Document out_doc;
    out_doc.SetObject();

    for (Value::ConstMemberIterator itr = in_doc.MemberBegin(); itr != in_doc.MemberEnd(); ++itr)
    {
        const char *property = itr->name.GetString();
        const Value &values = in_doc[itr->name.GetString()];
        if (strcmp(property, DISPLAY_SIZE) == 0)
        {
            assert(values.IsObject());
            u32 width = 0;
            u32 height = 0;
            for (Value::ConstMemberIterator itr2 = values.MemberBegin(); itr2 != values.MemberEnd(); ++itr2)
            {
                const char *prop_size = itr2->name.GetString();
                const Value &prop_value = values[itr2->name.GetString()];
                if (strcmp(prop_size, DISPLAY_WIDTH) == 0)
                {
                    width = prop_value.GetInt();
                }
                else if (strcmp(prop_size, DISPLAY_HEIGHT) == 0)
                {
                    height = prop_value.GetInt();
                }
            }

            err = gf_term_set_size(ctx->term, width, height);

            if (err == GF_OK)
            {
                Value json_objects(kObjectType);
                json_objects.AddMember(Value(DISPLAY_WIDTH), Value(width), out_doc.GetAllocator());
                json_objects.AddMember(Value(DISPLAY_HEIGHT), Value(height), out_doc.GetAllocator());
                out_doc.AddMember(Value(DISPLAY_SIZE), json_objects, out_doc.GetAllocator());
            }
            else
            {
                const char *error = gf_error_to_string(err);
                Value json_error;
                json_error.SetString(StringRef(error));
                out_doc.AddMember(Value(DISPLAY_SIZE), json_error, out_doc.GetAllocator());
            }
        }
        else if (strcmp(property, TRANSCODE_TO) == 0)
        {
            // assert(values.IsObject());
            // const char *file = NULL;
            // for (Value::ConstMemberIterator itr2 = values.MemberBegin(); itr2 != values.MemberEnd(); ++itr2)
            // {
            //     const char *prop_trans = itr2->name.GetString();
            //     const Value &prop_value = values[itr2->name.GetString()];
            //     if (strcmp(prop_trans, TRANSCODE_TO_FILE) == 0)
            //     {
            //         file = prop_value.GetString();
            //     }
            // }

            // err = transcode_to(ctx, file);

            // if (err == GF_OK)
            // {
            //     Value json_objects(kObjectType);
            //     json_objects.AddMember(Value(TRANSCODE_TO_FILE), Value(StringRef(file)), out_doc.GetAllocator());
            //     out_doc.AddMember(Value(TRANSCODE_TO), json_objects, out_doc.GetAllocator());
            // }
            // else
            // {
            //     const char *error = gf_error_to_string(err);
            //     Value json_error;
            //     json_error.SetString(StringRef(error));
            //     out_doc.AddMember(Value(TRANSCODE_TO), json_error, out_doc.GetAllocator());
            // }
        }
        else if (strcmp(property, PLAYER_STATE) == 0)
        {
            assert(values.IsString());
            const char *state = values.GetString();
            if (strcmp(state, PLAYER_PLAY) == 0)
            {
                gf_term_set_option(ctx->term, GF_OPT_PLAY_STATE, GF_STATE_PLAYING);
            }
            else if (strcmp(state, PLAYER_PAUSE) == 0)
            {
                gf_term_set_option(ctx->term, GF_OPT_PLAY_STATE, GF_STATE_PAUSED);
            }
            out_doc.AddMember(Value(PLAYER_STATE), Value(gf_term_get_option(ctx->term, GF_OPT_PLAY_STATE) == GF_STATE_PLAYING), out_doc.GetAllocator());
        }
        else if (strcmp(property, PLAYER_MUTE) == 0)
        {
            assert(values.IsInt());
            gf_term_set_option(ctx->term, GF_OPT_AUDIO_MUTE, values.GetInt());
            out_doc.AddMember(Value(PLAYER_MUTE), Value(gf_term_get_option(ctx->term, GF_OPT_AUDIO_MUTE)), out_doc.GetAllocator());
        } else if (strcmp(property, GET_TIME_IN_MS) == 0)
        {
            assert(values.IsInt());
            gf_term_play_from_time(ctx->term, values.GetInt(), 2);
            out_doc.AddMember(Value(GET_TIME_IN_MS), Value(gf_term_get_time_in_ms(ctx->term)), out_doc.GetAllocator());
        }else if (strcmp(property, PLAYER_VOLUME) == 0)
        {
            assert(values.IsInt());
            err = gf_term_set_option(ctx->term, GF_OPT_AUDIO_VOLUME, values.GetInt());
            if (err == GF_OK)
            {
             out_doc.AddMember(Value(PLAYER_VOLUME), Value(gf_term_get_option(ctx->term, GF_OPT_AUDIO_VOLUME)), out_doc.GetAllocator());
            }
            else
            {
                const char *error = gf_error_to_string(err);
                Value json_error;
                json_error.SetString(StringRef(error));
                out_doc.AddMember(Value(PLAYER_VOLUME), json_error, out_doc.GetAllocator());
            }
        }else if (strcmp(property, PLAYER_SPEED) == 0)
        {
            assert(values.IsNumber());
            err = gf_term_set_speed(ctx->term, FIX2FLT(values.GetDouble()));
            if (err == GF_OK)
            {
             out_doc.AddMember(Value(PLAYER_SPEED), Value(values.GetDouble()), out_doc.GetAllocator());
            }
            else
            {
                const char *error = gf_error_to_string(err);
                Value json_error;
                json_error.SetString(StringRef(error));
                out_doc.AddMember(Value(PLAYER_SPEED), json_error, out_doc.GetAllocator());
            }
        }
    }
    sb.Clear();
    Writer<StringBuffer> writer(sb);
    out_doc.Accept(writer);
    return sb.GetString();
}