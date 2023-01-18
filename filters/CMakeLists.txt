
set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set(THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set(GPAC_LOCATION ${THIRD_PARTIES}/gpac)
set(FFMPEG_LOCATION ${THIRD_PARTIES}/ffmpeg)

add_compile_definitions(GPAC_HAVE_CONFIG_H)

macro(add_filter FILTERNAME ENTRYFILES LINKFILES ENTRY_FN DEFINITIONS INCLUDES LINK_FLAGS)
        list(APPEND WASM_FILES ${CMAKE_BINARY_DIR}/${FILTERNAME}.wasm)

        add_executable(${FILTERNAME} ${ENTRYFILES})

        target_link_libraries(${FILTERNAME} ${LINKFILES})

        set_target_properties(${FILTERNAME}
                PROPERTIES
                LINK_FLAGS "-s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS=${ENTRY_FN} ${LINK_FLAGS}"
        )

        target_compile_definitions(${FILTERNAME} PRIVATE ${DEFINITIONS})
        target_include_directories(${FILTERNAME} PRIVATE ${INCLUDES})
endmacro()

add_filter(fileout
        ${GPAC_LOCATION}/src/filters/out_file.c
        ""
        _fileout_register
        ""
        ""
        "")

add_filter(filein
        ${GPAC_LOCATION}/src/filters/in_file.c
        ""
        _filein_register
        ""
        ""
        "")

add_filter(nanojpeg
        ${CMAKE_SOURCE_DIR}/filters/nanojpeg.c
        ${THIRD_PARTIES_BINARIES}/nanojpeg/nanojpeg.o
        _nanojpeg_register
        ""
        ""
        "")

SET(IMG_DEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_img.c
        ${GPAC_LOCATION}/src/media_tools/img.c)

add_filter(imgdec
        "${IMG_DEC_SRC}"
        ""
        "[_imgdec_register,_jpeg_std_error]"
        GPAC_HAS_JPEG
        ${GPAC_LOCATION}/include
        "-s USE_LIBJPEG=1")
SET(RFIMG_SRC
        ${GPAC_LOCATION}/src/filters/reframe_img.c
        ${GPAC_LOCATION}/src/media_tools/img.c
        ${GPAC_LOCATION}/src/utils/bitstream.c)

add_filter(rfimg
        "${RFIMG_SRC}"
        ""
        _img_reframe_register
        GPAC_HAS_JPEG
        ""
        "-s USE_LIBJPEG=1")

SET(WRITEGEN_SRC
        ${GPAC_LOCATION}/src/filters/write_generic.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
)

if(DEBUG_MODE)
        SET(PNG_LIB
                ${THIRD_PARTIES_BINARIES}/libpng/libpng16d.a
        )
else()
        SET(PNG_LIB
                ${THIRD_PARTIES_BINARIES}/libpng/libpng16.a
        )
endif()

add_filter(writegen
        "${WRITEGEN_SRC}"
        ""
        _writegen_register
        ""
        ""
        "")

SET(PNGENC_SRC
        ${GPAC_LOCATION}/src/filters/enc_png.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
)

add_filter(pngenc
        "${PNGENC_SRC}"
        "${PNG_LIB}"
        _pngenc_register
        GPAC_HAS_PNG
        ""
        "")
SET(J2KDEC_LIB
        ${THIRD_PARTIES}/openjpeg/src/lib/openjp2
        ${THIRD_PARTIES_BINARIES}/openjpeg/src/lib/openjp2
)

SET(J2KDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_j2k.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(j2kdec
        "${J2KDEC_SRC}"
        ${THIRD_PARTIES_BINARIES}/openjpeg/bin/libopenjp2.a
        _j2kdec_register
        GPAC_HAS_JP2
        "${J2KDEC_LIB}"
        "")
SET(RFMP3_SRC
        ${GPAC_LOCATION}/src/filters/reframe_mp3.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/utf.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(rfmp3
        "${RFMP3_SRC}"
        ""
        _mp3_dmx_register
        ""
        ${GPAC_LOCATION}/include
        "")

add_filter(maddec
        ${GPAC_LOCATION}/src/filters/dec_mad.c
        ${THIRD_PARTIES_BINARIES}/libmad/.libs/libmad.a
        _maddec_register
        GPAC_HAS_MAD
        ${THIRD_PARTIES_BINARIES}/libmad
        "")

SET(RFAC3_SRC
        ${GPAC_LOCATION}/src/filters/reframe_ac3.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(rfac3
        "${RFAC3_SRC}"
        ""
        _ac3dmx_register
        ""
        ${GPAC_LOCATION}/include
        "")

SET(FAAD_SRC
        ${GPAC_LOCATION}/src/filters/dec_faad.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

SET(FAAD_INCLUDE
        ${THIRD_PARTIES}/faad2-2.8.8/include
)

add_filter(faaddec
        "${FAAD_SRC}"
        ${THIRD_PARTIES_BINARIES}/libfaad/libfaad/.libs/libfaad.a
        _faad_register
        GPAC_HAS_FAAD
        "${FAAD_INCLUDE}"
        "")

SET(A52DEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_ac52.c
)

SET(A52DEC_INCLUDE
        ${THIRD_PARTIES}/a52dec-0.7.4/include
)

add_filter(a52dec
        "${A52DEC_SRC}"
        ${THIRD_PARTIES_BINARIES}/liba52/liba52/.libs/liba52.a
        _a52dec_register
        GPAC_HAS_LIBA52
        "${A52DEC_INCLUDE}"
        "")

SET(OPENHEVCDEC_INCLUDE
        ${GPAC_LOCATION}/extra_lib/include
)

SET(OPENHEVCDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_openhevc.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)

add_filter(openhevcdec
        "${OPENHEVCDEC_SRC}"
        ${THIRD_PARTIES_BINARIES}/openHEVC/libopenhevc/libopenhevc.a
        _ohevcdec_register
        "-DGPAC_HAS_OPENHEVC -DGPAC_OPENHEVC_STATIC -DOPENHEVC_HAS_AVC_BASE" 
        "${OPENHEVCDEC_INCLUDE}"
        "")

SET(FFDEC_SRC
        ${GPAC_LOCATION}/src/filters/ff_dec.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/utils/alloc.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
)

SET(FF_INCLUDE
        ${THIRD_PARTIES}/ffmpeg
        ${THIRD_PARTIES_BINARIES}/ffmpeg
)

SET(FFDEC_LIB
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavcodec/libavcodec.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavutil/libavutil.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavformat/libavformat.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavfilter/libavfilter.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libswresample/libswresample.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libswscale/libswscale.a
)

add_filter(ffdec
        "${FFDEC_SRC}"
        "${FFDEC_LIB}"
        _ffdec_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFDMX_SRC
        ${GPAC_LOCATION}/src/filters/ff_dmx.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)

add_filter(ffdmx
        "${FFDMX_SRC}"
        "${FFDEC_LIB}"
        _ffdmx_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFRESCALE_SRC
        ${GPAC_LOCATION}/src/filters/ff_rescale.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/evg/surface.c
        ${GPAC_LOCATION}/src/evg/raster_rgb.c
        ${GPAC_LOCATION}/src/evg/stencil.c
        ${GPAC_LOCATION}/src/evg/raster_argb.c
        ${GPAC_LOCATION}/src/evg/raster_565.c
        ${GPAC_LOCATION}/src/evg/raster_yuv.c
        ${GPAC_LOCATION}/src/utils/color.c
        ${GPAC_LOCATION}/src/utils/path2d.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(ffrescale
        "${FFRESCALE_SRC}"
        "${FFDEC_LIB}"
        _ffsws_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFENC_INCLUDE
        ${THIRD_PARTIES}/ffmpeg
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc
        ${THIRD_PARTIES}/x264
        ${THIRD_PARTIES_BINARIES}/x264
)

SET(FFENC_LIB
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libavcodec/libavcodec.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libavutil/libavutil.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libavformat/libavformat.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libavfilter/libavfilter.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libswresample/libswresample.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg-enc/libswscale/libswscale.a
        ${THIRD_PARTIES_BINARIES}/x264/libx264.a
)

SET(FFENC_SRC
        ${GPAC_LOCATION}/src/filters/ff_enc.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(ffenc
        "${FFENC_SRC}"
        "${FFENC_LIB}"
        _ffenc_register
        GPAC_HAS_FFMPEG
        "${FFENC_INCLUDE}"
        "")

add_filter(rfflac
        ${GPAC_LOCATION}/src/filters/reframe_flac.c
        ""
        _flac_dmx_register
        ""
        ""
        "")

SET(OGGDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_ogg.c
        ${GPAC_LOCATION}/src/media_tools/gpac_ogg.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
)

add_filter(oggdmx
        "${OGGDMX_SRC}"
        ""
        _oggdmx_register
        ""
        ""
        "")

SET(VORBISDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_vorbis.c
)

SET(VORBISDEC_INCLUDE
        ${THIRD_PARTIES}/vorbis/include
        ${THIRD_PARTIES}/ogg/include
        ${THIRD_PARTIES_BINARIES}/ogg/include
)

SET(VORBISDEC_LIB
        ${THIRD_PARTIES_BINARIES}/vorbis/lib/libvorbis.a
        ${THIRD_PARTIES_BINARIES}/ogg/libogg.a
)

add_filter(vorbisdec
        "${VORBISDEC_SRC}"
        "${VORBISDEC_LIB}"
        _vorbisdec_register
        GPAC_HAS_VORBIS
        "${VORBISDEC_INCLUDE}"
        "")

        SET(VORBISDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_vorbis.c
)

SET(THEORADEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_theora.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

SET(THEORADEC_INCLUDE
        ${THIRD_PARTIES}/theora/include
        ${THIRD_PARTIES}/ogg/include
        ${THIRD_PARTIES_BINARIES}/ogg/include
)

SET(THEORADEC_LIB
        ${THIRD_PARTIES_BINARIES}/theora/lib/.libs/libtheora.a
        ${THIRD_PARTIES_BINARIES}/ogg/libogg.a
)

add_filter(theoradec
        "${THEORADEC_SRC}"
        "${THEORADEC_LIB}"
        _theoradec_register
        GPAC_HAS_THEORA
        "${THEORADEC_INCLUDE}"
        "")

SET(XVIDDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_xvid.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

SET(XVIDDEC_INCLUDE
        ${THIRD_PARTIES}/xvidcore/src
)

SET(XVIDDEC_LIB
        ${THIRD_PARTIES_BINARIES}/xvidcore/libxvidcore.a
)

add_filter(xviddec
        "${XVIDDEC_SRC}"
        "${XVIDDEC_LIB}"
        _xviddec_register
        GPAC_HAS_XVID
        "${XVIDDEC_INCLUDE}"
        "")

add_filter(rfadts
        ${GPAC_LOCATION}/src/filters/reframe_adts.c
        ""
        _adts_dmx_register
        ""
        ""
        "")

add_filter(rfamr
        ${GPAC_LOCATION}/src/filters/reframe_amr.c
        ""
        _amrdmx_register
        ""
        ""
        "")

SET(M2PSDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_mpegps.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/media_tools/mpeg2_ps.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
)

add_filter(m2psdmx
        "${M2PSDMX_SRC}"
        ""
        _m2psdmx_register
        ""
        ""
        "")

SET(RFMPGVID_SRC
        ${GPAC_LOCATION}/src/filters/reframe_mpgvid.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(rfmpgvid
        "${RFMPGVID_SRC}"
        ""
        _mpgviddmx_register
        ""
        ""
        "")

SET(MP4DMX_SRC
        ${GPAC_LOCATION}/src/filters/isoffin_read.c
        ${GPAC_LOCATION}/src/filters/isoffin_load.c
        ${GPAC_LOCATION}/src/filters/isoffin_read_ch.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/isomedia/isom_read.c
        ${GPAC_LOCATION}/src/isomedia/isom_write.c
        ${GPAC_LOCATION}/src/isomedia/isom_intern.c
        ${GPAC_LOCATION}/src/isomedia/data_map.c
        ${GPAC_LOCATION}/src/isomedia/box_funcs.c
        ${GPAC_LOCATION}/src/isomedia/box_code_apple.c
        ${GPAC_LOCATION}/src/isomedia/movie_fragments.c
        ${GPAC_LOCATION}/src/isomedia/track.c
        ${GPAC_LOCATION}/src/isomedia/drm_sample.c
        ${GPAC_LOCATION}/src/isomedia/media.c
        ${GPAC_LOCATION}/src/isomedia/meta.c
        ${GPAC_LOCATION}/src/isomedia/sample_descs.c
        ${GPAC_LOCATION}/src/isomedia/avc_ext.c
        ${GPAC_LOCATION}/src/isomedia/stbl_read.c
        ${GPAC_LOCATION}/src/media_tools/isom_tools.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/odf/odf_codec.c
        ${GPAC_LOCATION}/src/odf/desc_private.c
        ${GPAC_LOCATION}/src/odf/odf_code.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
        ${GPAC_LOCATION}/src/odf/slc.c
)

add_filter(mp4dmx
        "${MP4DMX_SRC}"
        ""
        _isoffin_register
        ""
        ""
        "")

SET(MP4MX_SRC
        ${GPAC_LOCATION}/src/filters/mux_isom.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/webvtt.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/isomedia/isom_read.c
        ${GPAC_LOCATION}/src/isomedia/isom_write.c
        ${GPAC_LOCATION}/src/isomedia/isom_intern.c
        ${GPAC_LOCATION}/src/isomedia/isom_store.c
        ${GPAC_LOCATION}/src/isomedia/box_funcs.c
        ${GPAC_LOCATION}/src/isomedia/box_code_base.c
        ${GPAC_LOCATION}/src/isomedia/box_dump.c
        ${GPAC_LOCATION}/src/isomedia/box_code_meta.c
        ${GPAC_LOCATION}/src/isomedia/avc_ext.c
        ${GPAC_LOCATION}/src/isomedia/box_code_drm.c
        ${GPAC_LOCATION}/src/isomedia/box_code_3gpp.c
        ${GPAC_LOCATION}/src/isomedia/hinting.c
        ${GPAC_LOCATION}/src/isomedia/iff.c
        ${GPAC_LOCATION}/src/isomedia/box_code_apple.c
        ${GPAC_LOCATION}/src/isomedia/box_code_adobe.c
        ${GPAC_LOCATION}/src/isomedia/data_map.c
        ${GPAC_LOCATION}/src/isomedia/track.c
        ${GPAC_LOCATION}/src/isomedia/media.c
        ${GPAC_LOCATION}/src/isomedia/sample_descs.c
        ${GPAC_LOCATION}/src/isomedia/drm_sample.c
        ${GPAC_LOCATION}/src/isomedia/stbl_write.c
        ${GPAC_LOCATION}/src/isomedia/stbl_read.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/filters/mux_ts.c
        ${GPAC_LOCATION}/src/odf/odf_codec.c
        ${GPAC_LOCATION}/src/odf/desc_private.c
        ${GPAC_LOCATION}/src/odf/odf_code.c
        ${GPAC_LOCATION}/src/odf/slc.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
)

add_filter(mp4mx
        "${MP4MX_SRC}"
        ""
        _mp4_mux_register
        ""
        ""
        "")

    

SET(RFNALU_SRC
        ${GPAC_LOCATION}/src/filters/reframe_nalu.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
)

add_filter(rfnalu
        "${RFNALU_SRC}"
        ""
        _naludmx_register
        ""
        ""
        "")

add_filter(compose
        ${GPAC_LOCATION}/src/filters/compose.c
        ""
        _compose_filter_register
        ""
        ""
        "")

add_filter(aout
        ${GPAC_LOCATION}/src/filters/out_audio.c
        ""
        _aout_register
        ""
        ""
        "")

add_filter(httpin
        ${GPAC_LOCATION}/src/filters/in_http.c
        ""
        _httpin_register
        ""
        ""
        "")

SET(AVIDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_avi.c
        ${GPAC_LOCATION}/src/media_tools/avilib.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
)

add_filter(avidmx
        "${AVIDMX_SRC}"
        ""
        _avidmx_register
        ""
        ""
        "")

# # Should always be at the end of this file
set(WASM_FILES ${WASM_FILES} PARENT_SCOPE)