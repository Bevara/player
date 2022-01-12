#include <gpac/filters.h>
#include <emscripten/emscripten.h>



extern void njInit(void);
extern int njDecode(const void* jpeg, const int size);
extern unsigned char* njGetImage(void);
extern int njGetImageSize(void);
extern int njGetWidth(void);
extern int njGetHeight(void);


typedef struct
{
	u32 codecid;
	GF_FilterPid *ipid, *opid;
	u32 width, height, pixel_format, BPP;
} GF_NanojpegCtx;

static GF_Err nanojpeg_configure_pid(GF_Filter *filter, GF_FilterPid *pid, Bool is_remove)
{
	const GF_PropertyValue *prop;
	GF_NanojpegCtx *ctx = (GF_NanojpegCtx *) gf_filter_get_udta(filter);

	//disconnect of src pid (not yet supported)
	if (is_remove) {
		if (ctx->opid) {
			gf_filter_pid_remove(ctx->opid);
			ctx->opid = NULL;
		}
		ctx->ipid = NULL;
		return GF_OK;
	}
	if (! gf_filter_pid_check_caps(pid))
		return GF_NOT_SUPPORTED;

	ctx->codecid = prop->value.uint;
	ctx->ipid = pid;

	if (!ctx->opid) {
		ctx->opid = gf_filter_pid_new(filter);
	}
	//copy properties at init or reconfig
	gf_filter_pid_copy_properties(ctx->opid, ctx->ipid);
	gf_filter_pid_set_property(ctx->opid, GF_PROP_PID_CODECID, & PROP_UINT( GF_CODECID_RAW ));

	if (ctx->codecid==GF_CODECID_JPEG) {
		gf_filter_set_name(filter, "imgdec:libnanojpeg");
	}
	return GF_OK;
}

static const GF_FilterCapability NanojpegCaps[] =
{
	CAP_UINT(GF_CAPS_INPUT, GF_PROP_PID_STREAM_TYPE, GF_STREAM_FILE),
	CAP_STRING(GF_CAPS_INPUT, GF_PROP_PID_FILE_EXT, "jpg"),
	CAP_STRING(GF_CAPS_INPUT, GF_PROP_PID_MIME, "image/jpg"),
	CAP_UINT(GF_CAPS_OUTPUT, GF_PROP_PID_CODECID, GF_CODECID_PNG)
};

GF_Err EMSCRIPTEN_KEEPALIVE nanojpeg_process(GF_Filter *filter)
{
    u32 i, w, wr, h, hr, wh, size, pf;
    u8 *data, *buffer;

    GF_NanojpegCtx *ctx = gf_filter_get_udta(filter);

    GF_FilterPacket *pck, *pck_dst;
    pck = gf_filter_pid_get_packet(ctx->ipid);
    data = (unsigned char *) gf_filter_pck_get_data(pck, &size);

  	njInit();
  	njDecode(data, size);

	gf_filter_pid_set_property(ctx->opid, GF_PROP_PID_WIDTH, &PROP_UINT(njGetWidth()) );
	gf_filter_pid_set_property(ctx->opid, GF_PROP_PID_HEIGHT, &PROP_UINT(njGetHeight()) );

    pck_dst = gf_filter_pck_new_alloc(ctx->opid, njGetImageSize(), &buffer);
	memcpy(buffer, njGetImage(), njGetImageSize());

    gf_filter_pck_send(pck_dst);
    return GF_OK;
}


GF_FilterRegister NanojpegRegister = {
	.name = "nanojpeg",
	.version = "1.3.5",
	GF_FS_SET_DESCRIPTION("nanojpeg decoder")
	GF_FS_SET_HELP("This filter decodes nanojpeg streams through nanojpeg library.")
	.private_size = sizeof(GF_NanojpegCtx),
	.priority = 1,
	SETCAPS(NanojpegCaps),
	.configure_pid = nanojpeg_configure_pid,
	.process = nanojpeg_process,
};

const GF_FilterRegister* nanojpeg_register(GF_FilterSession *session)
{
	return &NanojpegRegister;
}
