
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

SET(FOUT_SRC
        ${GPAC_LOCATION}/src/filters/out_file.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_file.c
)

add_filter(fout
        "${FOUT_SRC}"
        ""
        _fileout_register
        ""
        ""
        "")

SET(FIN_SRC
        ${GPAC_LOCATION}/src/filters/in_file.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_file.c
)


add_filter(fin
        "${FIN_SRC}"
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
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/img.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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

SET(JPEG_LIB
        ${THIRD_PARTIES_BINARIES}/libjpeg/.libs/libjpeg.a
)

SET(IMG_FLAGS
        GPAC_HAS_JPEG
        GPAC_HAS_PNG
)

SET(IMG_LIBS
        ${PNG_LIB}
        ${JPEG_LIB}
        ${THIRD_PARTIES}/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/pic/libz.a
)

add_filter(imgdec
        "${IMG_DEC_SRC}"
        "${IMG_LIBS}"
        _imgdec_register
        "${IMG_FLAGS}"
        ""
        "-sUSE_ZLIB=1")

SET(RFIMG_SRC
        ${GPAC_LOCATION}/src/filters/reframe_img.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/img.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        )

add_filter(rfimg
        "${RFIMG_SRC}"
        "${IMG_LIBS}"
        _img_reframe_register
        "${IMG_FLAGS}"
        ""
        "")

SET(WRITEGEN_SRC
        ${GPAC_LOCATION}/src/filters/write_generic.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
)

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

SET(PNGENC_LIBS
        ${PNG_LIB}
        ${THIRD_PARTIES}/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/pic/libz.a
)

add_filter(pngenc
        "${PNGENC_SRC}"
        "${PNGENC_LIBS}"
        _pngenc_register
        GPAC_HAS_PNG
        ""
        "")

SET(JPGENC_SRC
        ${GPAC_LOCATION}/src/filters/enc_jpg.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
)

add_filter(jpgenc
        "${JPGENC_SRC}"
        "${JPEG_LIB}"
        _jpgenc_register
        GPAC_HAS_JPEG
        ""
        "")

SET(J2KDEC_LIB
        ${THIRD_PARTIES}/openjpeg/src/lib/openjp2
        ${THIRD_PARTIES_BINARIES}/openjpeg/src/lib/openjp2
)

SET(J2KDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_j2k.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
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

SET(MADDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_mad.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(maddec
        "${MADDEC_SRC}"
        ${THIRD_PARTIES_BINARIES}/libmad/.libs/libmad.a
        _maddec_register
        GPAC_HAS_MAD
        ${THIRD_PARTIES_BINARIES}/libmad
        "")

SET(RFAC3_SRC
        ${GPAC_LOCATION}/src/filters/reframe_ac3.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
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

SET(FFBSF_SRC
        ${GPAC_LOCATION}/src/filters/ff_bsf.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
)

add_filter(ffbsf
        "${FFBSF_SRC}"
        "${FFDEC_LIB}"
        _ffbsf_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFAVF_SRC
        ${GPAC_LOCATION}/src/filters/ff_avf.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
)

add_filter(ffavf
        "${FFAVF_SRC}"
        "${FFDEC_LIB}"
        _ffavf_register
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
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_file.c
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
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

add_filter(ffsws
        "${FFRESCALE_SRC}"
        "${FFDEC_LIB}"
        _ffsws_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFMX_SRC
        ${GPAC_LOCATION}/src/filters/ff_mx.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
)

add_filter(ffmx
        "${FFMX_SRC}"
        "${FFDEC_LIB}"
        _ffmx_register
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
)

SET(FFENC_FLAGS
        GPAC_HAS_FFMPEG
)

add_filter(ffenc
        "${FFENC_SRC}"
        "${FFENC_LIB}"
        _ffenc_register
        "${FFENC_FLAGS}"
        "${FFENC_INCLUDE}"
        "")

SET(RFFLAC_SRC
        ${GPAC_LOCATION}/src/filters/reframe_flac.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(rfflac
        "${RFFLAC_SRC}"
        ""
        _flac_dmx_register
        ""
        ""
        "")

SET(OGGDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_ogg.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/gpac_ogg.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
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

SET(RFADTS_SRC
        ${GPAC_LOCATION}/src/filters/reframe_adts.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(rfadts
        "${RFADTS_SRC}"
        ""
        _adts_dmx_register
        ""
        ""
        "")

SET(RFAMR_SRC
        ${GPAC_LOCATION}/src/filters/reframe_amr.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(rfamr
        "${RFAMR_SRC}"
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
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
        ${GPAC_LOCATION}/src/isomedia/box_code_3gpp.c
        ${GPAC_LOCATION}/src/isomedia/box_code_adobe.c
        ${GPAC_LOCATION}/src/isomedia/box_code_apple.c
        ${GPAC_LOCATION}/src/isomedia/box_code_base.c
        ${GPAC_LOCATION}/src/isomedia/box_code_meta.c
        ${GPAC_LOCATION}/src/isomedia/box_code_drm.c
        ${GPAC_LOCATION}/src/isomedia/box_dump.c
        ${GPAC_LOCATION}/src/isomedia/movie_fragments.c
        ${GPAC_LOCATION}/src/isomedia/track.c
        ${GPAC_LOCATION}/src/isomedia/drm_sample.c
        ${GPAC_LOCATION}/src/isomedia/media.c
        ${GPAC_LOCATION}/src/isomedia/meta.c
        ${GPAC_LOCATION}/src/isomedia/sample_descs.c
        ${GPAC_LOCATION}/src/isomedia/avc_ext.c
        ${GPAC_LOCATION}/src/isomedia/stbl_read.c
        ${GPAC_LOCATION}/src/isomedia/hinting.c
        ${GPAC_LOCATION}/src/isomedia/iff.c
        ${GPAC_LOCATION}/src/media_tools/webvtt.c
        ${GPAC_LOCATION}/src/media_tools/isom_tools.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
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
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
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

SET(COMPOSE_SRC
        ${GPAC_LOCATION}/src/filters/compose.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/compositor/audio_input.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_layer_2d.c
        ${GPAC_LOCATION}/src/compositor/audio_mixer.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_layer_3d.c
        ${GPAC_LOCATION}/src/compositor/audio_render.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_layout.c
        ${GPAC_LOCATION}/src/compositor/bindable.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_lighting.c
        ${GPAC_LOCATION}/src/compositor/camera.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_mediacontrol.c
        ${GPAC_LOCATION}/src/compositor/clock.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_mediasensor.c
        ${GPAC_LOCATION}/src/compositor/compositor.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_path_layout.c
        ${GPAC_LOCATION}/src/compositor/compositor_2d.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_sensors.c
        ${GPAC_LOCATION}/src/compositor/compositor_3d.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_sound.c
        ${GPAC_LOCATION}/src/compositor/compositor_node_init.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_text.c
        ${GPAC_LOCATION}/src/compositor/drawable.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_textures.c
        ${GPAC_LOCATION}/src/compositor/events.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_timesensor.c
        ${GPAC_LOCATION}/src/compositor/font_engine.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_viewport.c
        ${GPAC_LOCATION}/src/compositor/hardcoded_protos.c
        ${GPAC_LOCATION}/src/compositor/navigate.c
        ${GPAC_LOCATION}/src/compositor/hc_flash_shape.c
        ${GPAC_LOCATION}/src/compositor/object_manager.c
        ${GPAC_LOCATION}/src/compositor/media_object.c
        ${GPAC_LOCATION}/src/compositor/offscreen_cache.c
        ${GPAC_LOCATION}/src/compositor/mesh.c
        ${GPAC_LOCATION}/src/compositor/scene.c
        ${GPAC_LOCATION}/src/compositor/mesh_collide.c
        ${GPAC_LOCATION}/src/compositor/scene_node_init.c
        ${GPAC_LOCATION}/src/compositor/mesh_tesselate.c
        ${GPAC_LOCATION}/src/compositor/scene_ns.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_animstream.c
        ${GPAC_LOCATION}/src/compositor/svg_base.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_audio.c
        ${GPAC_LOCATION}/src/compositor/svg_external.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_background.c
        ${GPAC_LOCATION}/src/compositor/svg_filters.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_background2d.c
        ${GPAC_LOCATION}/src/compositor/svg_font.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_bitmap.c
        ${GPAC_LOCATION}/src/compositor/svg_geometry.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_composite.c
        ${GPAC_LOCATION}/src/compositor/svg_grouping.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_form.c
        ${GPAC_LOCATION}/src/compositor/svg_media.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_geometry_2d.c
        ${GPAC_LOCATION}/src/compositor/svg_paint_servers.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_geometry_3d.c
        ${GPAC_LOCATION}/src/compositor/svg_text.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_geometry_ifs2d.c
        ${GPAC_LOCATION}/src/compositor/texturing.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_geometry_ils2d.c
        ${GPAC_LOCATION}/src/compositor/texturing_gl.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_gradients.c
        ${GPAC_LOCATION}/src/compositor/visual_manager.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_grouping.c
        ${GPAC_LOCATION}/src/compositor/visual_manager_2d.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_grouping_2d.c
        ${GPAC_LOCATION}/src/compositor/visual_manager_2d_draw.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_grouping_3d.c
        ${GPAC_LOCATION}/src/compositor/visual_manager_3d.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_inline.c
        ${GPAC_LOCATION}/src/compositor/visual_manager_3d_gl.c
        ${GPAC_LOCATION}/src/compositor/mpeg4_inputsensor.c
        ${GPAC_LOCATION}/src/compositor/x3d_geometry.c
        ${GPAC_LOCATION}/src/scenegraph/base_scenegraph.c
        ${GPAC_LOCATION}/src/scenegraph/mpeg4_valuator.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_js.c
        ${GPAC_LOCATION}/src/scenegraph/commands.c
        ${GPAC_LOCATION}/src/scenegraph/smil_anim.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_proto.c
        ${GPAC_LOCATION}/src/scenegraph/dom_events.c
        ${GPAC_LOCATION}/src/scenegraph/smil_timing.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_route.c
        ${GPAC_LOCATION}/src/scenegraph/dom_js.c
        ${GPAC_LOCATION}/src/scenegraph/svg_attributes.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_script.c
        ${GPAC_LOCATION}/src/scenegraph/html5_media_js.c
        ${GPAC_LOCATION}/src/scenegraph/svg_js.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_tools.c
        ${GPAC_LOCATION}/src/scenegraph/html5_mse_js.c
        ${GPAC_LOCATION}/src/scenegraph/svg_properties.c
        ${GPAC_LOCATION}/src/scenegraph/x3d_nodes.c
        ${GPAC_LOCATION}/src/scenegraph/mpeg4_animators.c
        ${GPAC_LOCATION}/src/scenegraph/svg_types.c
        ${GPAC_LOCATION}/src/scenegraph/xml_ns.c
        ${GPAC_LOCATION}/src/scenegraph/mpeg4_nodes.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_interpolators.c
        ${GPAC_LOCATION}/src/evg/ftgrays.c
        ${GPAC_LOCATION}/src/evg/raster3d.c
        ${GPAC_LOCATION}/src/evg/raster_565.c
        ${GPAC_LOCATION}/src/evg/raster_argb.c
        ${GPAC_LOCATION}/src/evg/raster_rgb.c
        ${GPAC_LOCATION}/src/evg/raster_yuv.c
        ${GPAC_LOCATION}/src/evg/stencil.c
        ${GPAC_LOCATION}/src/evg/surface.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/color.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/math.c
        ${GPAC_LOCATION}/src/utils/module.c
        ${GPAC_LOCATION}/src/utils/path2d.c
        ${GPAC_LOCATION}/src/utils/path2d_stroker.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
)

add_filter(compose
        "${COMPOSE_SRC}"
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
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/media_tools/avilib.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(avidmx
        "${AVIDMX_SRC}"
        ""
        _avidmx_register
        ""
        ""
        "")

add_filter(ufvtt
        ${GPAC_LOCATION}/src/filters/write_vtt.c
        ""
        _vttmx_register
        ""
        ""
        "")

add_filter(tx3g2ttml
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _tx3g2ttml_register
        ""
        ""
        "")

add_filter(tx3g2vtt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _tx3g2vtt_register
        ""
        ""
        "")

add_filter(tx3g2srt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _tx3g2srt_register
        ""
        ""
        "")

add_filter(ufttxt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _ttxtuf_register
        ""
        ""
        "")

add_filter(writeqcp
        ${GPAC_LOCATION}/src/filters/write_qcp.c
        ""
        _qcpmx_register
        ""
        ""
        "")

add_filter(nhntw
        ${GPAC_LOCATION}/src/filters/write_nhnt.c
        ""
        _nhntdump_register
        ""
        ""
        "")

add_filter(nhmlw
        ${GPAC_LOCATION}/src/filters/write_nhml.c
        ""
        _nhmldump_register
        ""
        ""
        "")

add_filter(writeuf
        ${GPAC_LOCATION}/src/filters/write_generic.c
        ""
        _writeuf_register
        ""
        ""
        "")

add_filter(vflip
        ${GPAC_LOCATION}/src/filters/vflip.c
        ""
        _vflip_register
        ""
        ""
        "")

add_filter(vcrop
        ${GPAC_LOCATION}/src/filters/vcrop.c
        ""
        _vcrop_register
        ""
        ""
        "")

add_filter(unframer
        ${GPAC_LOCATION}/src/filters/unframer.c
        ""
        _unframer_register
        ""
        ""
        "")

add_filter(ttml2srt
        ${GPAC_LOCATION}/src/filters/ttml_conv.c
        ""
        _ttmlconv2_register
        ""
        ""
        "")

add_filter(ttml2vtt
        ${GPAC_LOCATION}/src/filters/ttml_conv.c
        ""
        _ttmlconv_register
        ""
        ""
        "")

add_filter(tssplit
        ${GPAC_LOCATION}/src/filters/tssplit.c
        ""
        _m2tssplit_register
        ""
        ""
        "")

add_filter(tilesplit
        ${GPAC_LOCATION}/src/filters/tilesplit.c
        ""
        _tilesplit_register
        ""
        ""
        "")

add_filter(tileagg
        ${GPAC_LOCATION}/src/filters/tileagg.c
        ""
        _tileagg_register
        ""
        ""
        "")

add_filter(ufobu
        ${GPAC_LOCATION}/src/filters/rewrite_obu.c
        ""
        _obumx_register
        ""
        ""
        "")

add_filter(ufnalu
        ${GPAC_LOCATION}/src/filters/rewrite_nalu.c
        ""
        _nalumx_register
        ""
        ""
        "")

add_filter(ufvc1
        ${GPAC_LOCATION}/src/filters/rewrite_mp4v.c
        ""
        _vc1mx_register
        ""
        ""
        "")

add_filter(ufmhas
        ${GPAC_LOCATION}/src/filters/rewrite_mhas.c
        ""
        _mhasmx_register
        ""
        ""
        "")

SET(UFLATM_SRC
        ${GPAC_LOCATION}/src/filters/rewrite_adts.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(uflatm
        "${UFLATM_SRC}"
        ""
        _latm_mx_register
        ""
        ""
        "")

add_filter(rewind
        ${GPAC_LOCATION}/src/filters/rewind.c
        ""
        _rewind_register
        ""
        ""
        "")

add_filter(restamp
        ${GPAC_LOCATION}/src/filters/restamp.c
        ""
        _restamp_register
        ""
        ""
        "")

SET(RESAMPLE_SRC
        ${GPAC_LOCATION}/src/filters/resample_audio.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/compositor/audio_mixer.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
)

add_filter(resample
        "${RESAMPLE_SRC}"
        ""
        _resample_register
        ""
        ""
        "")

add_filter(reframer
        ${GPAC_LOCATION}/src/filters/reframer.c
        ""
        _reframer_register
        ""
        ""
        "")

SET(RFTRUEHD_SRC
        ${GPAC_LOCATION}/src/filters/reframe_truehd.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(rftruehd
        "${RFTRUEHD_SRC}"
        ""
        _truehd_register
        ""
        ""
        "")

SET(RFRAW_SRC
        ${GPAC_LOCATION}/src/filters/reframe_rawvid.c
        ${GPAC_LOCATION}/src/utils/constants.c
)

add_filter(rfrawvid
        "${RFRAW_SRC}"
        ""
        _rawvidreframe_register
        ""
        ""
        "")

SET(RFPCM_SRC
        ${GPAC_LOCATION}/src/filters/reframe_rawpcm.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
)

add_filter(rfpcm
        "${RFPCM_SRC}"
        ""
        _pcmreframe_register
        ""
        ""
        "")

SET(RFQCP_SRC
        ${GPAC_LOCATION}/src/filters/reframe_qcp.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(rfqcp
        "${RFQCP_SRC}"
        ""
        _qcpdmx_register
        ""
        ""
        "")

add_filter(rfprores
        ${GPAC_LOCATION}/src/filters/reframe_prores.c
        ""
        _proresdmx_register
        ""
        ""
        "")

add_filter(rfmhas
        ${GPAC_LOCATION}/src/filters/reframe_mhas.c
        ""
        _mhas_dmx_register
        ""
        ""
        "")

SET(LATM_SRC
        ${GPAC_LOCATION}/src/filters/reframe_latm.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(rflatm
        "${LATM_SRC}"
        ""
        _latm_dmx_register
        ""
        ""
        "")

SET(RFH263_SRC
        ${GPAC_LOCATION}/src/filters/reframe_h263.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

add_filter(rfh263
        "${RFH263_SRC}"
        ""
        _h263dmx_register
        ""
        ""
        "")

SET(RFAV1_SRC
        ${GPAC_LOCATION}/src/filters/reframe_av1.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
)

add_filter(rfav1
        "${RFAV1_SRC}"
        ""
        _av1dmx_register
        ""
        ""
        "")

add_filter(vout
        ${GPAC_LOCATION}/src/filters/out_video.c
        ""
        _vout_register
        ""
        ""
        "")

add_filter(m2tsmx
        ${GPAC_LOCATION}/src/filters/mux_ts.c
        ""
        _tsmux_register
        ""
        ""
        "")

add_filter(oggmx
        ${GPAC_LOCATION}/src/filters/mux_ogg.c
        ""
        _oggmux_register
        ""
        ""
        "")

add_filter(gsfmx
        ${GPAC_LOCATION}/src/filters/mux_gsf.c
        ""
        _gsfmx_register
        ""
        ""
        "")

SET(RFSRT_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(rfsrt
        "${RFSRT_SRC}"
        ""
        _rfsrt_register
        ""
        ""
        "")

SET(VTT2TX3G_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(vtt2tx3g
        "${VTT2TX3G_SRC}"
        ""
        _vtt2tx3g_register
        ""
        ""
        "")

SET(TXTIN_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(txtin
        "${TXTIN_SRC}"
        ""
        _txtin_register
        ""
        ""
        "")

SET(SVG_LIBS
        ${THIRD_PARTIES}/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/pic/libz.a
)

SET(SVGIN_SRC
        ${GPAC_LOCATION}/src/filters/load_svg.c
        ${GPAC_LOCATION}/src/filter_core/filter.c
        ${GPAC_LOCATION}/src/filter_core/filter_pck.c
        ${GPAC_LOCATION}/src/filter_core/filter_pid.c
        ${GPAC_LOCATION}/src/filter_core/filter_props.c
        ${GPAC_LOCATION}/src/filter_core/filter_session.c
        ${GPAC_LOCATION}/src/filter_core/filter_queue.c
        ${GPAC_LOCATION}/src/compositor/audio_render.c
        ${GPAC_LOCATION}/src/compositor/audio_mixer.c
        ${GPAC_LOCATION}/src/compositor/compositor.c
        ${GPAC_LOCATION}/src/compositor/compositor_2d.c
        ${GPAC_LOCATION}/src/compositor/clock.c
        ${GPAC_LOCATION}/src/compositor/object_manager.c
        ${GPAC_LOCATION}/src/compositor/scene.c
        ${GPAC_LOCATION}/src/compositor/events.c
        ${GPAC_LOCATION}/src/compositor/compositor_node_init.c
        ${GPAC_LOCATION}/src/scenegraph/base_scenegraph.c
        ${GPAC_LOCATION}/src/scenegraph/dom_events.c
        ${GPAC_LOCATION}/src/scenegraph/xml_ns.c
        ${GPAC_LOCATION}/src/scenegraph/svg_types.c
        ${GPAC_LOCATION}/src/scenegraph/svg_attributes.c
        ${GPAC_LOCATION}/src/scenegraph/svg_properties.c
        ${GPAC_LOCATION}/src/scenegraph/vrml_tools.c
        ${GPAC_LOCATION}/src/scene_manager/scene_manager.c
        ${GPAC_LOCATION}/src/scene_manager/loader_svg.c
        ${GPAC_LOCATION}/src/utils/color.c
        ${GPAC_LOCATION}/src/utils/constants.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/xml_parser.c
        ${GPAC_LOCATION}/src/utils/math.c
        ${GPAC_LOCATION}/src/utils/gzio.c
        ${GPAC_LOCATION}/src/utils/path2d.c
        ${GPAC_LOCATION}/src/utils/os_thread.c
        ${GPAC_LOCATION}/src/utils/os_divers.c
        ${GPAC_LOCATION}/src/utils/os_file.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
)

add_filter(svgplay
        "${SVGIN_SRC}"
        "${SVG_LIBS}"
        _svgin_register
        ""
        ""
        "")

SET(BTPLAY_SRC
        ${GPAC_LOCATION}/src/filters/load_bt_xmt.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(btplay
        "${BTPLAY_SRC}"
        ""
        _ctxload_register
        ""
        ""
        "")

add_filter(cryptin
        ${GPAC_LOCATION}/src/filters/io_fcryp.c
        ""
        _cryptfin_register
        ""
        ""
        "")

add_filter(cryptout
        ${GPAC_LOCATION}/src/filters/io_fcryp.c
        ""
        _cryptfout_register
        ""
        ""
        "")

add_filter(probe
        ${GPAC_LOCATION}/src/filters/inspect.c
        ""
        _probe_register
        ""
        ""
        "")

add_filter(inspect
        ${GPAC_LOCATION}/src/filters/inspect.c
        ""
        _inspect_register
        ""
        ""
        "")

add_filter(hevcsplit
        ${GPAC_LOCATION}/src/filters/hevcsplit.c
        ""
        _hevcsplit_register
        ""
        ""
        "")

add_filter(hevcmerge
        ${GPAC_LOCATION}/src/filters/hevcmerge.c
        ""
        _hevcmerge_register
        ""
        ""
        "")

SET(FLIST_SRC
        ${GPAC_LOCATION}/src/filters/filelist.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(flist
        "${FLIST_SRC}"
        ""
        _filelist_register
        ""
        ""
        "")

add_filter(cecrypt
        ${GPAC_LOCATION}/src/filters/encrypt_cenc_isma.c
        ""
        _cenc_encrypt_register
        ""
        ""
        "")

add_filter(vobsubdmx
        ${GPAC_LOCATION}/src/filters/dmx_vobsub.c
        ""
        _vobsubdmx_register
        ""
        ""
        "")

add_filter(safdmx
        ${GPAC_LOCATION}/src/filters/dmx_saf.c
        ""
        _safdmx_register
        ""
        ""
        "")

add_filter(nhntr
        ${GPAC_LOCATION}/src/filters/dmx_nhnt.c
        ""
        _nhntdmx_register
        ""
        ""
        "")

add_filter(nhmlr
        ${GPAC_LOCATION}/src/filters/dmx_nhml.c
        ""
        _nhmldmx_register
        ""
        ""
        "")

SET(M2TSDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_m2ts.c
        ${GPAC_LOCATION}/src/media_tools/mpegts.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/list.c
)

add_filter(m2tsdmx
        "${M2TSDMX_SRC}"
        ""
        _m2tsdmx_register
        ""
        ""
        "")

add_filter(gsfdmx
        ${GPAC_LOCATION}/src/filters/dmx_gsf.c
        ""
        _gsfdmx_register
        ""
        ""
        "")

add_filter(dashin
        ${GPAC_LOCATION}/src/filters/dmx_dash.c
        ""
        _dashdmx_register
        ""
        ""
        "")

add_filter(cdcrypt
        ${GPAC_LOCATION}/src/filters/decrypt_cenc_isma.c
        ""
        _cenc_decrypt_register
        ""
        ""
        "")

add_filter(vttdec
        ${GPAC_LOCATION}/src/filters/dec_webvtt.c
        ""
        _vttdec_register
        ""
        ""
        "")

add_filter(ttxtdec
        ${GPAC_LOCATION}/src/filters/dec_ttxt.c
        ""
        _ttxtdec_register
        ""
        ""
        "")

add_filter(ttmldec
        ${GPAC_LOCATION}/src/filters/dec_ttml.c
        ""
        _ttmldec_register
        ""
        ""
        "")

add_filter(odfdec
        ${GPAC_LOCATION}/src/filters/dec_odf.c
        ""
        _odf_dec_register
        ""
        ""
        "")

SET(LSRDRC_SRC
        ${GPAC_LOCATION}/src/filters/dec_laser.c
        ${GPAC_LOCATION}/src/compositor/scene.c
)

add_filter(lsrdec
        "${LSRDRC_SRC}"
        ""
        _lsrdec_register
        ""
        ""
        "")

add_filter(bifsdec
        ${GPAC_LOCATION}/src/filters/dec_bifs.c
        ""
        _bifs_dec_register
        ""
        ""
        "")

SET(DASHER_SRC
        ${GPAC_LOCATION}/src/filters/dasher.c
        ${GPAC_LOCATION}/src/media_tools/mpd.c
)

add_filter(dasher
        "${DASHER_SRC}"
        ""
        _dasher_register
        ""
        ""
        "")

add_filter(bsrw
        ${GPAC_LOCATION}/src/filters/bsrw.c
        ""
        _bsrw_register
        ""
        ""
        "")

add_filter(bssplit
        ${GPAC_LOCATION}/src/filters/bs_split.c
        ""
        _bs_split_register
        ""
        ""
        "")

add_filter(bsagg
        ${GPAC_LOCATION}/src/filters/bs_agg.c
        ""
        _bs_agg_register
        ""
        ""
        "")

# Should always be at the end of this file
set(WASM_FILES ${WASM_FILES} PARENT_SCOPE)