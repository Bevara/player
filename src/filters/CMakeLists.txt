
set(CMAKE_EXECUTABLE_SUFFIX ".wasm")

set(THIRD_PARTIES ${CMAKE_SOURCE_DIR}/third_parties)
set(THIRD_PARTIES_BINARIES ${CMAKE_BINARY_DIR}/third_parties)
set(GPAC_LOCATION ${THIRD_PARTIES}/gpac)
set(FFMPEG_LOCATION ${THIRD_PARTIES}/ffmpeg)

add_compile_definitions(GPAC_HAVE_CONFIG_H GF_CONFIG_H GPAC_CONFIG_EMSCRIPTEN GPAC_DISABLE_NETWORK GPAC_HAS_MTIM_NSEC GPAC_HAS_POLL GPAC_DISABLE_REMOTERY GPAC_HAS_STRLCPY GPAC_HAS_SOCK_UN GPAC_HAS_IPV6)

macro(add_filter FILTERNAME ENTRYFILES LINKFILES ENTRY_FN DEFINITIONS INCLUDES LINK_FLAGS)
        list(APPEND WASM_FILES ${CMAKE_BINARY_DIR}/${FILTERNAME}.wasm)

        add_executable(${FILTERNAME} ${ENTRYFILES})

        target_link_libraries(${FILTERNAME} ${LINKFILES})

        set_target_properties(${FILTERNAME}
                PROPERTIES
                LINK_FLAGS " -sWASM_BIGINT -s SIDE_MODULE=2 -s EXPORTED_FUNCTIONS=${ENTRY_FN} ${LINK_FLAGS}"
        )

        target_compile_definitions(${FILTERNAME} PRIVATE ${DEFINITIONS})
        target_include_directories(${FILTERNAME} PRIVATE ${INCLUDES})
endmacro()

add_filter(nanojpeg
        ${CMAKE_SOURCE_DIR}/src/filters/nanojpeg.c
        ${THIRD_PARTIES_BINARIES}/nanojpeg/nanojpeg.o
        _dynCall_nanojpeg_register
        ""
        ""
        "")

SET(IMG_DEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_img.c
        ${GPAC_LOCATION}/src/media_tools/img.c
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

SET(IMG_INC
        ${THIRD_PARTIES}/libpng-code
        ${THIRD_PARTIES}/jpeg-9e
        ${THIRD_PARTIES_BINARIES}/libpng
        ${THIRD_PARTIES_BINARIES}/libjpeg
)

SET(IMG_LIBS
        ${PNG_LIB}
        ${JPEG_LIB}
)

add_filter(imgdec
        "${IMG_DEC_SRC}"
        "${IMG_LIBS}"
        _dynCall_imgdec_register
        "${IMG_FLAGS}"
        "${IMG_INC}"
        "")

SET(RFIMG_SRC
        ${GPAC_LOCATION}/src/filters/reframe_img.c
)

add_filter(rfimg
        "${RFIMG_SRC}"
        "${IMG_LIBS}"
        _dynCall_img_reframe_register
        "${IMG_FLAGS}"
        "${IMG_INC}"
        "")

SET(PNGENC_SRC
        ${GPAC_LOCATION}/src/filters/enc_png.c
)

SET(PNGENC_LIBS
        ${PNG_LIB}
)

add_filter(pngenc
        "${PNGENC_SRC}"
        "${PNGENC_LIBS}"
        _dynCall_pngenc_register
        GPAC_HAS_PNG
        "${IMG_INC}"
        "")

SET(JPGENC_SRC
        ${GPAC_LOCATION}/src/filters/enc_jpg.c
)

add_filter(jpgenc
        "${JPGENC_SRC}"
        "${JPEG_LIB}"
        _dynCall_jpgenc_register
        GPAC_HAS_JPEG
        "${IMG_INC}"
        "")

SET(J2KDEC_INC
        ${THIRD_PARTIES}/openjpeg/src/lib/openjp2
        ${THIRD_PARTIES_BINARIES}/openjpeg/src/lib/openjp2
)

SET(J2KDEC_LIB
        ${THIRD_PARTIES_BINARIES}/openjpeg/bin/libopenjp2.a
)

SET(J2KDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_j2k.c
)

add_filter(j2kdec
        "${J2KDEC_SRC}"
        "${J2KDEC_LIB}"
        _dynCall_j2kdec_register
        GPAC_HAS_JP2
        "${J2KDEC_INC}"
        "")

SET(RFMP3_SRC
        ${GPAC_LOCATION}/src/filters/reframe_mp3.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)

SET(RFMP3_LIB

)

add_filter(rfmp3
        "${RFMP3_SRC}"
        "${RFMP3_LIB}"
        _dynCall_mp3_dmx_register
        ""
        ${GPAC_LOCATION}/include
        "")

SET(MADDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_mad.c
)

SET(MADDEC_LIB
        ${THIRD_PARTIES_BINARIES}/libmad/.libs/libmad.a
)

add_filter(maddec
        "${MADDEC_SRC}"
        "${MADDEC_LIB}"        
        _dynCall_maddec_register
        GPAC_HAS_MAD
        ${THIRD_PARTIES_BINARIES}/libmad
        "")

SET(RFAC3_SRC
        ${GPAC_LOCATION}/src/filters/reframe_ac3.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
)

SET(RFAC3_LIB
)

add_filter(rfac3
        "${RFAC3_SRC}"
        "${RFAC3_LIB}"
        _dynCall_ac3dmx_register
        ""
        ${GPAC_LOCATION}/include
        "")

SET(FAAD_SRC
        ${GPAC_LOCATION}/src/filters/dec_faad.c
)

SET(FAAD_INCLUDE
        ${THIRD_PARTIES}/faad2-2.8.8/include
)

SET(FAAD_LIB
        ${THIRD_PARTIES_BINARIES}/libfaad/libfaad/.libs/libfaad.a
)

add_filter(faaddec
        "${FAAD_SRC}"
        "${FAAD_LIB}"
        _dynCall_faad_register
        GPAC_HAS_FAAD
        "${FAAD_INCLUDE}"
        "")

SET(A52DEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_ac52.c
)

SET(A52DEC_INCLUDE
        ${THIRD_PARTIES}/a52dec-0.7.4/include
)

SET(A52DEC_LIB
        ${THIRD_PARTIES_BINARIES}/liba52/liba52/.libs/liba52.a
)

add_filter(a52dec
        "${A52DEC_SRC}"
        "${A52DEC_LIB}"
        _dynCall_a52dec_register
        GPAC_HAS_LIBA52
        "${A52DEC_INCLUDE}"
        "")

SET(OPENHEVCDEC_INCLUDE
        ${GPAC_LOCATION}/extra_lib/include
)

SET(OPENHEVCDEC_LIB
        ${THIRD_PARTIES_BINARIES}/openHEVC/libopenhevc/libopenhevc.a
)


SET(OPENHEVCDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_openhevc.c
)

# add_filter(openhevcdec
#         "${OPENHEVCDEC_SRC}"
#         "${OPENHEVCDEC_LIB}"
#         _dynCall_ohevcdec_register
#         "-DGPAC_HAS_OPENHEVC -DGPAC_OPENHEVC_STATIC -DOPENHEVC_HAS_AVC_BASE"
#         "${OPENHEVCDEC_INCLUDE}"
#         "")

SET(FFDEC_SRC
        ${GPAC_LOCATION}/src/filters/ff_dec.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

SET(FF_INCLUDE
        ${THIRD_PARTIES}/ffmpeg
        ${THIRD_PARTIES_BINARIES}/ffmpeg
)

SET(FF_LIB
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavcodec/libavcodec.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavutil/libavutil.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavformat/libavformat.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libavfilter/libavfilter.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libswresample/libswresample.a
        ${THIRD_PARTIES_BINARIES}/ffmpeg/libswscale/libswscale.a
)


SET(FFDEC_LIB
        ${FF_LIB}
)

add_filter(ffdec
        "${FFDEC_SRC}"
        "${FFDEC_LIB}"
        _dynCall_ffdec_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFBSF_SRC
        ${GPAC_LOCATION}/src/filters/ff_bsf.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

add_filter(ffbsf
        "${FFBSF_SRC}"
        "${FF_LIB}"
        _dynCall_ffbsf_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFAVF_SRC
        ${GPAC_LOCATION}/src/filters/ff_avf.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

add_filter(ffavf
        "${FFAVF_SRC}"
        "${FF_LIB}"
        _dynCall_ffavf_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFDMX_SRC
        ${GPAC_LOCATION}/src/filters/ff_dmx.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

SET(FFDMX_LIB
        ${FF_LIB}
)

add_filter(ffdmx
        "${FFDMX_SRC}"
        "${FFDMX_LIB}"
        _dynCall_ffdmx_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFRESCALE_SRC
        ${GPAC_LOCATION}/src/filters/ff_rescale.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

add_filter(ffsws
        "${FFRESCALE_SRC}"
        "${FF_LIB}"
        _dynCall_ffsws_register
        GPAC_HAS_FFMPEG
        "${FF_INCLUDE}"
        "")

SET(FFMX_SRC
        ${GPAC_LOCATION}/src/filters/ff_mx.c
        ${GPAC_LOCATION}/src/filters/ff_common.c
)

SET(FFMX_LIB
        ${FF_LIB}
)

add_filter(ffmx
        "${FFMX_SRC}"
        "${FFMX_LIB}"
        _dynCall_ffmx_register
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
)

SET(FFENC_FLAGS
        GPAC_HAS_FFMPEG
)

add_filter(ffenc
        "${FFENC_SRC}"
        "${FFENC_LIB}"
        _dynCall_ffenc_register
        "${FFENC_FLAGS}"
        "${FFENC_INCLUDE}"
        "")

SET(RFFLAC_SRC
        ${GPAC_LOCATION}/src/filters/reframe_flac.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

SET(RFFLAC_LIB

)

add_filter(rfflac
        "${RFFLAC_SRC}"
        "${RFFLAC_LIB}"
        _dynCall_flac_dmx_register
        ""
        ""
        "")

SET(OGGDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_ogg.c
        ${GPAC_LOCATION}/src/media_tools/gpac_ogg.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)


SET(OGGDMX_LIB
)

add_filter(oggdmx
        "${OGGDMX_SRC}"
        "${OGGDMX_LIB}"
        _dynCall_oggdmx_register
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
        _dynCall_vorbisdec_register
        GPAC_HAS_VORBIS
        "${VORBISDEC_INCLUDE}"
        "")

SET(VORBISDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_vorbis.c
)

SET(THEORADEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_theora.c
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
        _dynCall_theoradec_register
        GPAC_HAS_THEORA
        "${THEORADEC_INCLUDE}"
        "")

SET(XVIDDEC_SRC
        ${GPAC_LOCATION}/src/filters/dec_xvid.c
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
        _dynCall_xviddec_register
        GPAC_HAS_XVID
        "${XVIDDEC_INCLUDE}"
        "")

SET(RFADTS_SRC
        ${GPAC_LOCATION}/src/filters/reframe_adts.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

SET(RFADTS_LIB

)


add_filter(rfadts
        "${RFADTS_SRC}"
        "${RFADTS_LIB}"
        _dynCall_adts_dmx_register
        ""
        ""
        "")

SET(RFAMR_SRC
        ${GPAC_LOCATION}/src/filters/reframe_amr.c
)

SET(RFAMR_LIB
)

add_filter(rfamr
        "${RFAMR_SRC}"
        "${RFAMR_LIB}"
        _dynCall_amrdmx_register
        ""
        ""
        "")

SET(M2PSDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_mpegps.c
        ${GPAC_LOCATION}/src/media_tools/mpeg2_ps.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
)

SET(M2PSDMX_LIB

)

add_filter(m2psdmx
        "${M2PSDMX_SRC}"
        "${M2PSDMX_LIB}"
        _dynCall_m2psdmx_register
        ""
        ""
        "")

SET(RFMPGVID_SRC
        ${GPAC_LOCATION}/src/filters/reframe_mpgvid.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

SET(RFMPGVID_LIB
)

add_filter(rfmpgvid
        "${RFMPGVID_SRC}"
        "${RFMPGVID_LIB}"
        _dynCall_mpgviddmx_register
        ""
        ""
        "")

SET(MP4DMX_SRC
        ${GPAC_LOCATION}/src/filters/isoffin_read.c
        ${GPAC_LOCATION}/src/filters/isoffin_load.c
        ${GPAC_LOCATION}/src/filters/isoffin_read_ch.c
)

SET(MP4DMX_LIB
)

add_filter(mp4dmx
        "${MP4DMX_SRC}"
        "${MP4DMX_LIB}"
        _dynCall_isoffin_register
        ""
        ""
        "")

SET(MP4MX_LIB
)

SET(MP4MX_SRC
        ${GPAC_LOCATION}/src/filters/mux_isom.c
        ${GPAC_LOCATION}/src/isomedia/isom_intern.c
        ${GPAC_LOCATION}/src/filters/mux_ts.c
        ${GPAC_LOCATION}/src/isomedia/drm_sample.c
        ${GPAC_LOCATION}/src/isomedia/track.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
)

add_filter(mp4mx
        "${MP4MX_SRC}"
        "${MP4MX_LIB}"
        _dynCall_mp4_mux_register
        ""
        ""
        "")

SET(RFNALU_SRC
        ${GPAC_LOCATION}/src/filters/reframe_nalu.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)

SET(RFNALU_LIB
)

add_filter(rfnalu
        "${RFNALU_SRC}"
        "${RFNALU_LIB}"
        _dynCall_naludmx_register
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
        ${GPAC_LOCATION}/src/utils/alloc.c
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

SET(COMPOSE_LIB
)

add_filter(compose
        "${COMPOSE_SRC}"
        "${COMPOSE_LIB}"
        _dynCall_compose_filter_register
        ""
        ""
        "")

SET(AVIDMX_LIB
)


SET(AVIDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_avi.c
        ${GPAC_LOCATION}/src/media_tools/avilib.c
        ${GPAC_LOCATION}/src/media_tools/media_import.c
)

add_filter(avidmx
        "${AVIDMX_SRC}"
        "${AVIDMX_LIB}"
        _dynCall_avidmx_register
        ""
        ""
        "")

add_filter(ufvtt
        ${GPAC_LOCATION}/src/filters/write_vtt.c
        ""
        _dynCall_vttmx_register
        ""
        ""
        "")

add_filter(tx3g2ttml
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _dynCall_tx3g2ttml_register
        ""
        ""
        "")

add_filter(tx3g2vtt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _dynCall_tx3g2ttml_register
        ""
        ""
        "")

add_filter(tx3g2srt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _dynCall_tx3g2ttml_register
        ""
        ""
        "")

add_filter(ufttxt
        ${GPAC_LOCATION}/src/filters/write_tx3g.c
        ""
        _dynCall_tx3g2ttml_register
        ""
        ""
        "")

SET(WRITEQCP_LIB
)

add_filter(writeqcp
        ${GPAC_LOCATION}/src/filters/write_qcp.c
        "${WRITEQCP_LIB}"
        _dynCall_qcpmx_register
        ""
        ""
        "")

add_filter(nhntw
        ${GPAC_LOCATION}/src/filters/write_nhnt.c
        ""
        _dynCall_nhntdump_register
        ""
        ""
        "")

add_filter(nhmlw
        ${GPAC_LOCATION}/src/filters/write_nhml.c
        ""
        _dynCall_nhmldump_register
        ""
        ""
        "")

add_filter(writeuf
        ${GPAC_LOCATION}/src/filters/write_generic.c
        ""
        _dynCall_writeuf_register
        ""
        ""
        "")

add_filter(vflip
        ${GPAC_LOCATION}/src/filters/vflip.c
        ""
        _dynCall_vflip_register
        ""
        ""
        "")

add_filter(vcrop
        ${GPAC_LOCATION}/src/filters/vcrop.c
        ""
        _dynCall_vcrop_register
        ""
        ""
        "")

add_filter(unframer
        ${GPAC_LOCATION}/src/filters/unframer.c
        ""
        _dynCall_unframer_register
        ""
        ""
        "")

add_filter(ttml2srt
        ${GPAC_LOCATION}/src/filters/ttml_conv.c
        ""
        _dynCall_ttmlconv2_register
        ""
        ""
        "")

add_filter(ttml2vtt
        ${GPAC_LOCATION}/src/filters/ttml_conv.c
        ""
        _dynCall_dynCall_ttmlconv_register
        ""
        ""
        "")

add_filter(tssplit
        ${GPAC_LOCATION}/src/filters/tssplit.c
        ""
        _dynCall_m2tssplit_register
        ""
        ""
        "")

add_filter(tilesplit
        ${GPAC_LOCATION}/src/filters/tilesplit.c
        ""
        _dynCall_tilesplit_register
        ""
        ""
        "")

add_filter(tileagg
        ${GPAC_LOCATION}/src/filters/tileagg.c
        ""
        _dynCall_tileagg_register
        ""
        ""
        "")

add_filter(ufobu
        ${GPAC_LOCATION}/src/filters/rewrite_obu.c
        ""
        _dynCall_obumx_register
        ""
        ""
        "")

add_filter(ufnalu
        ${GPAC_LOCATION}/src/filters/rewrite_nalu.c
        ""
        _dynCall_nalumx_register
        ""
        ""
        "")

add_filter(ufvc1
        ${GPAC_LOCATION}/src/filters/rewrite_mp4v.c
        ""
        _dynCall_vc1mx_register
        ""
        ""
        "")

add_filter(ufmhas
        ${GPAC_LOCATION}/src/filters/rewrite_mhas.c
        ""
        _dynCall_mhasmx_register
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
        _dynCall_latm_mx_register
        ""
        ""
        "")

add_filter(rewind
        ${GPAC_LOCATION}/src/filters/rewind.c
        ""
        _dynCall_rewind_register
        ""
        ""
        "")

add_filter(restamp
        ${GPAC_LOCATION}/src/filters/restamp.c
        ""
        _dynCall_restamp_register
        ""
        ""
        "")

SET(RFTRUEHD_SRC
        ${GPAC_LOCATION}/src/filters/reframe_truehd.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

SET(RFTRUEHD_LIB

)

add_filter(rftruehd
        "${RFTRUEHD_SRC}"
        "${RFTRUEHD_LIB}"
        _dynCall_truehd_register
        ""
        ""
        "")

SET(RFRAW_SRC
        ${GPAC_LOCATION}/src/filters/reframe_rawvid.c
        ${GPAC_LOCATION}/src/utils/constants.c
)

SET(RFRAW_LIB

)


add_filter(rfrawvid
        "${RFRAW_SRC}"
        "${RFRAW_LIB}"
        _dynCall_rawvidreframe_register
        ""
        ""
        "")

SET(RFPCM_SRC
        ${GPAC_LOCATION}/src/filters/reframe_rawpcm.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/constants.c
)

SET(RFPCM_LIB

)


add_filter(rfpcm
        "${RFPCM_SRC}"
        "${RFPCM_LIB}"
        _dynCall_pcmreframe_register
        ""
        ""
        "")

SET(RFQCP_SRC
        ${GPAC_LOCATION}/src/filters/reframe_qcp.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
)

SET(RFQCP_LIB

)

add_filter(rfqcp
        "${RFQCP_SRC}"
        "${RFQCP_LIB}"
        _dynCall_qcpdmx_register
        ""
        ""
        "")

add_filter(rfprores
        ${GPAC_LOCATION}/src/filters/reframe_prores.c
        ""
        _dynCall_proresdmx_register
        ""
        ""
        "")

SET(RFMHAS_LIB

)

add_filter(rfmhas
        ${GPAC_LOCATION}/src/filters/reframe_mhas.c
         "${RFMHAS_LIB}"
         _dynCall_mhas_dmx_register
        ""
        ""
        "")

SET(LATM_SRC
        ${GPAC_LOCATION}/src/filters/reframe_latm.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
)

SET(LATM_LIB

)


add_filter(rflatm
        "${LATM_SRC}"
        "${LATM_LIB}"
        _dynCall_latm_dmx_register
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
        _dynCall_h263dmx_register
        ""
        ""
        "")

SET(RFAV1_SRC
        ${GPAC_LOCATION}/src/filters/reframe_av1.c
        ${GPAC_LOCATION}/src/media_tools/av_parsers.c
        ${GPAC_LOCATION}/src/utils/alloc.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/bitstream.c
        ${GPAC_LOCATION}/src/utils/list.c
        ${GPAC_LOCATION}/src/odf/descriptors.c
)

SET(RFAV1_LIB

)


add_filter(rfav1
        "${RFAV1_SRC}"
        "${RFAV1_LIB}"
        _dynCall_av1dmx_register
        ""
        ""
        "")

add_filter(m2tsmx
        ${GPAC_LOCATION}/src/filters/mux_ts.c
        ""
        _dynCall_tsmux_register
        ""
        ""
        "")

add_filter(oggmx
        ${GPAC_LOCATION}/src/filters/mux_ogg.c
        ""
        _dynCall_oggmux_register
        ""
        ""
        "")

add_filter(gsfmx
        ${GPAC_LOCATION}/src/filters/mux_gsf.c
        ""
        _dynCall_gsfmx_register
        ""
        ""
        "")

 SET(RFSRT_LIB

)


SET(RFSRT_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(rfsrt
        "${RFSRT_SRC}"
        "${RFSRT_LIB}"
        _dynCall_rfsrt_register
        ""
        ""
        "")

SET(VTT2TX3G_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

SET(VTT2TX3G_LIB

)

add_filter(vtt2tx3g
        "${VTT2TX3G_SRC}"
        "${VTT2TX3G_LIB}"
        _dynCall_vtt2tx3g_register
        ""
        ""
        "")

SET(TXTIN_LIB

)

SET(TXTIN_SRC
        ${GPAC_LOCATION}/src/filters/load_text.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(txtin
        "${TXTIN_SRC}"
        "${TXTIN_LIB}"
        _dynCall_txtin_register
        ""
        ""
        "")

SET(SVG_LIBS

)

SET(SVGIN_SRC
        ${GPAC_LOCATION}/src/filters/load_svg.c
)

add_filter(svgplay
        "${SVGIN_SRC}"
        "${SVG_LIBS}"
        _dynCall_svgin_register
        ""
        ""
        "")

SET(BTPLAY_LIB

)

SET(BTPLAY_SRC
        ${GPAC_LOCATION}/src/filters/load_bt_xmt.c
        ${GPAC_LOCATION}/src/utils/utf.c
)

add_filter(btplay
        "${BTPLAY_SRC}"
        "${BTPLAY_LIB}"
        _dynCall_ctxload_register
        ""
        ""
        "")

SET(CRYPTIN_LIBS

)

add_filter(cryptin
        ${GPAC_LOCATION}/src/filters/io_fcryp.c
        "${CRYPTIN_LIBS}"
        _dynCall_cryptfin_register
        ""
        ""
        "")

SET(CRYPTOUT_LIBS

)

add_filter(cryptout
        ${GPAC_LOCATION}/src/filters/io_fcryp.c
        "${CRYPTOUT_LIBS}"
        _dynCall_cryptfout_register
        ""
        ""
        "")

add_filter(probe
        ${GPAC_LOCATION}/src/filters/inspect.c
        ""
        _dynCall_probe_register
        ""
        ""
        "")

add_filter(inspect
        ${GPAC_LOCATION}/src/filters/inspect.c
        ""
        _dynCall_inspect_register
        ""
        ""
        "")

add_filter(hevcsplit
        ${GPAC_LOCATION}/src/filters/hevcsplit.c
        ""
        _dynCall_hevcsplit_register
        ""
        ""
        "")

add_filter(hevcmerge
        ${GPAC_LOCATION}/src/filters/hevcmerge.c
        ""
        _dynCall_hevcmerge_register
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
        _dynCall_filelist_register
        ""
        ""
        "")

add_filter(cecrypt
        ${GPAC_LOCATION}/src/filters/encrypt_cenc_isma.c
        ""
        _dynCall_cenc_encrypt_register
        ""
        ""
        "")

SET(VOBSUBDMX_LIB

)

add_filter(vobsubdmx
        ${GPAC_LOCATION}/src/filters/dmx_vobsub.c
        "${VOBSUBDMX_LIB}"
        _dynCall_vobsubdmx_register
        ""
        ""
        "")

add_filter(safdmx
        ${GPAC_LOCATION}/src/filters/dmx_saf.c
        ""
        _dynCall_safdmx_register
        ""
        ""
        "")

add_filter(nhntr
        ${GPAC_LOCATION}/src/filters/dmx_nhnt.c
        ""
        _dynCall_nhntdmx_register
        ""
        ""
        "")

add_filter(nhmlr
        ${GPAC_LOCATION}/src/filters/dmx_nhml.c
        ""
        _dynCall_nhmldmx_register
        ""
        ""
        "")

SET(M2TSDMX_LIB

)

SET(M2TSDMX_SRC
        ${GPAC_LOCATION}/src/filters/dmx_m2ts.c
        ${GPAC_LOCATION}/src/media_tools/mpegts.c
        ${GPAC_LOCATION}/src/utils/alloc.c
        ${GPAC_LOCATION}/src/utils/error.c
        ${GPAC_LOCATION}/src/utils/list.c
)

add_filter(m2tsdmx
        "${M2TSDMX_SRC}"
        "${M2TSDMX_LIB}"
        _dynCall_m2tsdmx_register
        ""
        ""
        "")

SET(GSFDMX_LIB
        ${FF_LIB}

)

add_filter(gsfdmx
        ${GPAC_LOCATION}/src/filters/dmx_gsf.c
        "${GSFDMX_LIB}"
        _dynCall_gsfdmx_register
        ""
        ""
        "")

SET(DASHIN_LIB

)

add_filter(dashin
        ${GPAC_LOCATION}/src/filters/dmx_dash.c
        "${DASHIN_LIB}"
        _dynCall_dashdmx_register
        ""
        ""
        "")

add_filter(cdcrypt
        ${GPAC_LOCATION}/src/filters/decrypt_cenc_isma.c
        ""
        _dynCall_cenc_decrypt_register
        ""
        ""
        "")

add_filter(vttdec
        ${GPAC_LOCATION}/src/filters/dec_webvtt.c
        ""
        _dynCall_vttdec_register
        ""
        ""
        "")

add_filter(ttxtdec
        ${GPAC_LOCATION}/src/filters/dec_ttxt.c
        ""
        _dynCall_ttxtdec_register
        ""
        ""
        "")

add_filter(ttmldec
        ${GPAC_LOCATION}/src/filters/dec_ttml.c
        ""
        _dynCall_ttmldec_register
        ""
        ""
        "")

add_filter(odfdec
        ${GPAC_LOCATION}/src/filters/dec_odf.c
        ""
        _dynCall_odf_dec_register
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
        _dynCall_lsrdec_register
        ""
        ""
        "")

add_filter(bifsdec
        ${GPAC_LOCATION}/src/filters/dec_bifs.c
        ""
        _dynCall_bifs_dec_register
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
        _dynCall_dasher_register
        ""
        ""
        "")

SET(BSRW_SRC
        ${GPAC_LOCATION}/src/filters/bsrw.c
        ${GPAC_LOCATION}/src/utils/os_config_init.c
)

SET(BSRW_LIB

)

add_filter(bsrw
        "${BSRW_SRC}"
        "${BSRW_LIB}"
        _dynCall_bsrw_register
        ""
        ""
        "")

add_filter(bssplit
        ${GPAC_LOCATION}/src/filters/bs_split.c
        ""
        _dynCall_bs_split_register
        ""
        ""
        "")

add_filter(bsagg
        ${GPAC_LOCATION}/src/filters/bs_agg.c
        ""
        _dynCall_bs_agg_register
        ""
        ""
        "")

SET(JXLDEC_SRC
        ${CMAKE_SOURCE_DIR}/src/filters/jxl/dec_jxl.c
)

SET(JXLDEC_LIB
        ${THIRD_PARTIES_BINARIES}/libjxl/lib/libjxl.a
        ${THIRD_PARTIES_BINARIES}/libjxl/third_party/highway/libhwy.a
        ${THIRD_PARTIES_BINARIES}/libjxl/third_party/brotli/libbrotlicommon-static.a
        ${THIRD_PARTIES_BINARIES}/libjxl/third_party/brotli/libbrotlidec-static.a
        ${THIRD_PARTIES}/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/pic/libc++.a
        ${THIRD_PARTIES}/emsdk/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/pic/libc++abi.a
)

SET(JXLDEC_INC
        ${THIRD_PARTIES}/libjxl/lib/include
        ${THIRD_PARTIES_BINARIES}/libjxl/lib/include
)

add_filter(jxldec
        "${JXLDEC_SRC}"
        "${JXLDEC_LIB}"
        _dynCall_jxldec_register
        ""
        "${JXLDEC_INC}"
        "")

SET(RFJXL_SRC
        ${CMAKE_SOURCE_DIR}/src/filters/jxl/reframe_jxl.c
)

SET(RFJXL_LIB
        ${THIRD_PARTIES_BINARIES}/libjxl/lib/libjxl.a
)

add_filter(rfjxl
        "${RFJXL_SRC}"
        "${RFJXL_LIB}"
        _dynCall_jxl_reframe_register
        ""
        "${JXLDEC_INC}"
        "")

# Should always be at the end of this file
set(WASM_FILES ${WASM_FILES} PARENT_SCOPE)